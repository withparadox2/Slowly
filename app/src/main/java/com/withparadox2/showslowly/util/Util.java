package com.withparadox2.showslowly.util;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Looper;
import android.widget.Toast;
import com.withparadox2.showslowly.App;
import com.withparadox2.showslowly.R;
import java.util.Collection;

public class Util {
  public static double parseNumber(String input, double defaultValue) {
    try {
      return Double.parseDouble(input);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return defaultValue;
  }

  public static void copyToClipboard(String content) {
    ClipboardManager clipboard =
        (ClipboardManager) App.instance.getSystemService(Context.CLIPBOARD_SERVICE);
    ClipData clip = ClipData.newPlainText(App.instance.getString(R.string.app_name), content);
    clipboard.setPrimaryClip(clip);
  }

  public static String getTopTextFromClipboard() {
    ClipboardManager clipboard =
        (ClipboardManager) App.instance.getSystemService(Context.CLIPBOARD_SERVICE);
    final ClipData clipdata = clipboard.getPrimaryClip();
    if (clipdata != null && clipdata.getItemCount() > 0) {
      if (clipdata.getItemAt(0).getText() != null) {
        return clipdata.getItemAt(0).getText().toString();
      }
    }
    return null;
  }

  public static void toast(final String text) {
    post(new Runnable() {
      @Override public void run() {
        Toast.makeText(App.instance, text, Toast.LENGTH_SHORT).show();
      }
    });
  }

  public static void post(Runnable action) {
    if (action == null) {
      return;
    }
    App.instance.getHandler().post(action);
  }

  public static void postDelayed(Runnable action, long delayMillis) {
    if (action == null) {
      return;
    }
    App.instance.getHandler().postDelayed(action, delayMillis);
  }

  public static void runAsync(Runnable runnable) {
    AsyncTask.THREAD_POOL_EXECUTOR.execute(runnable);
  }

  public static int dip2px(float dpValue) {
    final float scale = App.instance.getResources().getDisplayMetrics().density;
    return (int) (dpValue * scale + 0.5f);
  }

  public static int collectionSize(Collection<?> collection) {
    return collection == null ? 0 : collection.size();
  }

  public static void assertOn(boolean on, String error) {
    if (!on) {
      throw new AssertionError(error);
    }
  }

  public static boolean isMainThread() {
    return Thread.currentThread() == Looper.getMainLooper().getThread();
  }
}
