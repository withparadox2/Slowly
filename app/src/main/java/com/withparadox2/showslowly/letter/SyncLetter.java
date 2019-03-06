package com.withparadox2.showslowly.letter;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AppCompatActivity;
import com.withparadox2.showslowly.util.Util;

public class SyncLetter {
  private AppCompatActivity mActivity;
  private SyncDialog mSyncDialog;

  public SyncLetter(AppCompatActivity context) {
    mActivity = context;
  }

  public void showSyncDialog() {
    mSyncDialog = new SyncDialog();
    mSyncDialog.show(mActivity.getSupportFragmentManager(), null);
  }

  private void startSync() {

  }

  private void cancelSync() {

  }

  public static class SyncDialog extends DialogFragment {
    private AlertDialog mShowDialog;
    private long mLastClickStamp = 0;

    @NonNull @Override public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
      mShowDialog = new AlertDialog.Builder(getActivity()).setTitle("Sync Letter")
          .setCancelable(false)
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
        mShowDialog.setMessage(msg);
      }
    }
  }
}
