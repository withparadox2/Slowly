package com.withparadox2.showslowly.letter;

import android.support.annotation.NonNull;
import android.text.TextUtils;
import com.withparadox2.showslowly.entity.Friend;
import com.withparadox2.showslowly.entity.Letter;
import com.withparadox2.showslowly.net.ServiceManager;
import com.withparadox2.showslowly.net.result.LetterListResult;
import com.withparadox2.showslowly.store.AppDatabase;
import com.withparadox2.showslowly.store.LetterDao;
import com.withparadox2.showslowly.token.TokenManager;
import com.withparadox2.showslowly.util.NetUtil;
import com.withparadox2.showslowly.util.Util;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Response;

/**
 * Manage letters by fetching data from server and caching to database.
 */
public class LetterDataManager implements IDataCallback {
  public static final int START_PAGE = 1;

  private int mPerPage = -1;
  /**
   * Who sent the letter
   */
  private Friend mFriend;

  private List<Letter> mLetterList = new ArrayList<>();
  private IDataCallback mCallback;
  private LetterDao mLetterDao = AppDatabase.instance().letterDao();
  private boolean mHasMore = true;

  LetterDataManager(@NonNull Friend friend, IDataCallback callback) {
    this.mFriend = friend;
    this.mCallback = callback;
  }

  void requestLoadData(final boolean isRefresh) {
    if (isRefresh) {
      Util.runAsync(new Runnable() {
        @Override public void run() {
          List<Letter> list = loadLocalData();
          mLetterList.clear();
          mLetterList.addAll(list);
          if (mLetterList.size() > 0) {
            mHasMore = !mLetterList.get(mLetterList.size() - 1).isEarliest();
          } else {
            mHasMore = true;
          }
          onLocalDataLoaded();
          loadDataFromServer(START_PAGE);
        }
      });
    } else {
      if (!mHasMore) {
        // Come on, there is no more data
        return;
      }

      if (mPerPage <= 0) {
        requestLoadData(true);
        return;
      }

      int nextPage = mLetterList.size() / mPerPage + START_PAGE;
      loadDataFromServer(nextPage);
    }
  }

  private void loadDataFromServer(final int page) {
    ServiceManager.getSlowlyService()
        .listLetters(mFriend.getId(), TokenManager.getPrefToken(), page)
        .enqueue(
            new retrofit2.Callback<LetterListResult>() {
              @Override
              public void onResponse(Call<LetterListResult> call,
                  Response<LetterListResult> response) {
                if (response.body() != null && response.body().getComments() != null) {
                  LetterListResult.Comments comments = response.body().getComments();
                  List<Letter> newList = comments.getLetterList();
                  boolean isRefresh = page == START_PAGE;
                  if (isRefresh) {
                    if (newList.size() > 0) {
                      Letter lastNewLetter = newList.get(newList.size() - 1);

                      if (isContained(mLetterList, lastNewLetter) || mLetterList.size() == 0) {
                        // Resolve sublist containing letters that doesn't exist locally, on which is
                        // the part we are going to operate
                        final List<Letter> freshList =
                            mLetterList.size() == 0 ? newList : cutTo(newList, mLetterList.get(0));
                        if (freshList.size() > 0) {
                          mLetterList.addAll(0, freshList);
                          cacheData(freshList, true);
                        }
                      } else {
                        // We are faraway from server, just drop all data in db and re-sync
                        mLetterDao.clear();
                        mLetterList.clear();
                        mLetterList.addAll(newList);
                      }
                    } else {
                      // Letters have been cleared in server? Ok, we do the same
                      mLetterList.clear();
                      mLetterDao.clear();
                    }
                  } else {
                    // Load more letters
                    if (newList.size() > 0) {
                      Util.assertOn(mLetterList.size() > 0,
                          "Should not load more data with page = " + page + " if list is empty");
                      Letter lastLocalLetter = mLetterList.get(mLetterList.size() - 1);
                      if (isContained(newList, lastLocalLetter)) {
                        // Two lists are overlapped, everything is fine
                        final List<Letter> freshList = cutFrom(newList, lastLocalLetter);
                        if (freshList.size() > 0) {
                          mLetterList.addAll(freshList);
                          cacheData(freshList, true);
                        }
                      } else {
                        if (mLetterList.size() % mPerPage != 0) {
                          // TODO Something is wrong, clear all letters which are old

                        } else {
                          if (newList.size() > 0) {
                            mLetterList.addAll(newList);
                            cacheData(newList, true);
                          }
                        }
                      }
                    }
                  }

                  boolean localHasMore = !TextUtils.isEmpty(comments.getNextPageUrl());

                  mPerPage = comments.getPerPage();
                  mHasMore = localHasMore && mHasMore;

                  if (!localHasMore && mLetterList.size() > 0) {
                    final Letter lastLetter = mLetterList.get(mLetterList.size() - 1);
                    lastLetter.setIsEarliest(true);
                    Util.runAsync(new Runnable() {
                      @Override public void run() {
                        mLetterDao.update(lastLetter);
                      }
                    });
                  }

                  onServerDataLoaded(isRefresh);
                } else {
                  NetUtil.handleError(response.errorBody());
                  onError("");
                }
              }

              @Override public void onFailure(Call<LetterListResult> call, Throwable t) {
                Util.toast("load letters error: " + t.getMessage());
                t.printStackTrace();
                onError(t.getMessage());
              }
            }
        );
  }

  private List<Letter> cutTo(List<Letter> sourceList, Letter toExclude) {
    int targetIndex = -1;
    for (int i = 0; i < sourceList.size(); i++) {
      if (sourceList.get(i).equals(toExclude)) {
        targetIndex = i;
        break;
      }
    }
    return targetIndex < 0 ? sourceList : sourceList.subList(0, targetIndex);
  }

  private List<Letter> cutFrom(List<Letter> sourceList, Letter fromExclude) {
    int targetIndex = -1;
    for (int i = 0; i < sourceList.size(); i++) {
      if (sourceList.get(i).equals(fromExclude)) {
        targetIndex = i;
        break;
      }
    }
    if (targetIndex < 0) {
      return sourceList;
    } else if (targetIndex >= sourceList.size() - 1) {
      return new ArrayList<>();
    } else {
      return sourceList.subList(targetIndex + 1, sourceList.size());
    }
  }

  private boolean isContained(List<Letter> list, Letter target) {
    for (Letter letter : list) {
      if (letter.equals(target)) {
        return true;
      }
    }
    return false;
  }

  public List<Letter> loadLocalData() {
    return mLetterDao.getLetterList(mFriend.getId());
  }

  public void cacheData(final List<Letter> list, boolean async) {
    if (async) {
      Util.runAsync(new Runnable() {
        @Override public void run() {
          mLetterDao.insert(list);
        }
      });
    } else {
      mLetterDao.insert(list);
    }
  }

  public boolean isHasMoreData() {
    return mHasMore;
  }

  public List<Letter> getLetterList() {
    return mLetterList;
  }

  @Override public void onServerDataLoaded(final boolean isRefresh) {
    if (mCallback != null) {
      mCallback.onServerDataLoaded(isRefresh);
    }
  }

  @Override public void onLocalDataLoaded() {
    if (mCallback != null) {
      Util.post(new Runnable() {
        @Override public void run() {
          mCallback.onLocalDataLoaded();
        }
      });
    }
  }

  @Override public void onError(String message) {
    if (mCallback != null) {
      mCallback.onError(message);
    }
  }
}
