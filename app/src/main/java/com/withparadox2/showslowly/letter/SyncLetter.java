package com.withparadox2.showslowly.letter;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.widget.TextView;
import com.withparadox2.showslowly.entity.Friend;
import com.withparadox2.showslowly.entity.Letter;
import com.withparadox2.showslowly.net.ServiceManager;
import com.withparadox2.showslowly.net.result.LetterListResult;
import com.withparadox2.showslowly.store.AppDatabase;
import com.withparadox2.showslowly.token.TokenManager;
import com.withparadox2.showslowly.util.Util;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Response;

public class SyncLetter {
  private AppCompatActivity mActivity;
  private SyncDialog mSyncDialog;
  private List<Letter> mLetterList = new ArrayList<>();
  private boolean mHasStarted = false;
  private Friend mFriend;

  public SyncLetter(AppCompatActivity context, Friend friend) {
    mActivity = context;
    mFriend = friend;
  }

  public void showSyncDialog() {
    if (mHasStarted) {
      throw new IllegalStateException("This method can only be called once");
    }
    mHasStarted = true;
    mSyncDialog = new SyncDialog();
    mSyncDialog.show(mActivity.getSupportFragmentManager(), null);
    Util.post(new Runnable() {
      @Override public void run() {
        startSync(LetterDataManager.START_PAGE);
      }
    });
  }

  private void startSync(final int page) {
    mSyncDialog.setMessage(String.valueOf("Current page is " + page));
    ServiceManager.getSlowlyService()
        .listLetters(mFriend.getId(), TokenManager.getPrefToken(), page)
        .enqueue(
            new retrofit2.Callback<LetterListResult>() {
              @Override
              public void onResponse(Call<LetterListResult> call,
                  Response<LetterListResult> response) {
                if (response.body() != null) {
                  LetterListResult.Comments comments = response.body().getComments();
                  if (comments != null) {
                    if (comments.getLetterList() != null) {
                      mLetterList.addAll(comments.getLetterList());
                    }
                    boolean hasMore = !TextUtils.isEmpty(comments.getNextPageUrl());
                    if (!hasMore) {
                      LetterHelper.markLastLetterEarliestOne(mLetterList);
                      Util.runAsync(new Runnable() {
                        @Override public void run() {
                          AppDatabase.instance().letterDao().clear();
                          AppDatabase.instance().letterDao().insert(mLetterList);
                        }
                      });
                      cancelSync();
                      Util.toast("Sync Success!");
                    } else {
                      startSync(page + 1);
                    }
                    return;
                  }
                }
                // Error cancel
                cancelSync();
              }

              @Override public void onFailure(Call<LetterListResult> call, Throwable t) {
                Util.toast("load letters error: " + t.getMessage());
                t.printStackTrace();
                cancelSync();
              }
            }
        );
  }

  private void cancelSync() {
    mSyncDialog.dismissAllowingStateLoss();
  }

  public static class SyncDialog extends DialogFragment {
    private AlertDialog mShowDialog;
    private long mLastClickStamp = 0;

    @NonNull @Override public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
      mShowDialog = new AlertDialog.Builder(getActivity()).setTitle("Sync Letter")
          //TODO make dialog uncancelbale
          .setCancelable(false)
          .setMessage("")
          .setPositiveButton("Cancel", new DialogInterface.OnClickListener() {
            @Override public void onClick(DialogInterface dialog, int which) {
              int delay = 3000;
              if (System.currentTimeMillis() - mLastClickStamp < delay) {
                Util.toast("Cancel");
              } else {
                mLastClickStamp = System.currentTimeMillis();
                Util.toast("Click again to cancel");
              }
            }
          }).create();
      return mShowDialog;
    }

    public void setMessage(String msg) {
      if (mShowDialog != null) {
        TextView tvMessage = mShowDialog.findViewById(android.R.id.message);
        tvMessage.setText(msg);
      }
    }
  }
}
