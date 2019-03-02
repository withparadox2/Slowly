package com.withparadox2.showslowly.permission;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.util.SparseArray;
import com.withparadox2.showslowly.util.Util;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class PermissionManager {

  private static SparseArray<Runnable> sIdToAction = new SparseArray<>();
  private static AtomicInteger sIdGenerator = new AtomicInteger(0);

  public static boolean hasPermission(Object o, String... permissions) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return true;
    }

    for (String permission : permissions) {
      boolean hasPermission = ContextCompat.checkSelfPermission(getContext(o), permission)
          == PackageManager.PERMISSION_GRANTED;
      if (!hasPermission) {
        return false;
      }
    }
    return true;
  }

  private static Context getContext(Object o) {
    if (o instanceof Activity) {
      return (Activity) o;
    } else if (o instanceof Fragment) {
      return ((Fragment) o).getActivity();
    } else if (o instanceof android.app.Fragment) {
      return ((android.app.Fragment) o).getActivity();
    } else {
      throw new IllegalArgumentException("Can not get context from object o.");
    }
  }

  public static void requestPermission(Object o, Runnable action, String... permissions) {
    Context context = getContext(o);
    List<String> deniedList = new ArrayList<>();
    for (String p : permissions) {
      if (!hasPermission(context, p)) {
        deniedList.add(p);
      }
    }
    if (deniedList.size() == 0) {
      action.run();
    } else {
      int requestCode = newRequestCode();
      sIdToAction.put(requestCode, action);
      requestPermission(context, requestCode, deniedList.toArray(new String[deniedList.size()]));
    }
  }

  @TargetApi(Build.VERSION_CODES.M)
  public static void requestPermission(Object o, int requestCode, String... permissions) {
    if (o instanceof Activity) {
      ActivityCompat.requestPermissions(((Activity) o), permissions, requestCode);
    } else if (o instanceof android.support.v4.app.Fragment) {
      ((android.support.v4.app.Fragment) o).requestPermissions(permissions, requestCode);
    } else if (o instanceof android.app.Fragment) {
      ((android.app.Fragment) o).requestPermissions(permissions, requestCode);
    }
  }

  public static void handlePermissionResult(int requestCode, @NonNull String[] permissions, @NonNull
      int[] grantResults) {
    boolean allGranted = true;
    for (int i = 0; i < permissions.length; i++) {
      if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
        allGranted = false;
        break;
      }
    }
    if (!allGranted) {
      Util.toast("Please grant all permission requests.");
    } else {
      Runnable action = getAndRemoveAction(requestCode);
      if (action != null) {
        action.run();
      }
    }
  }

  public static Runnable getAndRemoveAction(int requestCode) {
    Runnable action = sIdToAction.get(requestCode);
    if (action != null) {
      sIdToAction.delete(requestCode);
    }
    return action;
  }

  public static int newRequestCode() {
    return sIdGenerator.getAndIncrement();
  }
}
