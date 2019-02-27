package com.withparadox2.showslowly.util;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import com.withparadox2.showslowly.App;

/**
 * Created by withparadox2 on 2017/10/2.
 */

public class PreferencesUtil {
  public static void putString(final String key, final String value) {
    apply(new IApply() {
      @Override public void beforeApply(SharedPreferences.Editor editor) {
        editor.putString(key, value);
      }
    });
  }

  public static void putInt(final String key, final int value) {
    apply(new IApply() {
      @Override public void beforeApply(SharedPreferences.Editor editor) {
        editor.putInt(key, value);
      }
    });
  }

  public static void putBoolean(final String key, final boolean value) {
    apply(new IApply() {
      @Override public void beforeApply(SharedPreferences.Editor editor) {
        editor.putBoolean(key, value);
      }
    });
  }

  public static void putFloat(final String key, final float value) {
    apply(new IApply() {
      @Override public void beforeApply(SharedPreferences.Editor editor) {
        editor.putFloat(key, value);
      }
    });
  }

  public static String getString(String key, String defaultValue) {
    return getPreferences().getString(key, defaultValue);
  }

  public static int getInt(String key, int defaultValue) {
    return getPreferences().getInt(key, defaultValue);
  }

  public static boolean getBoolean(String key, boolean defaultValue) {
    return getPreferences().getBoolean(key, defaultValue);
  }

  public static float getFloat(String key, float defaultValue) {
    return getPreferences().getFloat(key, defaultValue);
  }

  public static SharedPreferences getPreferences() {
    return PreferenceManager.getDefaultSharedPreferences(App.instance);
  }

  public static void apply(IApply apply) {
    SharedPreferences.Editor editor = getPreferences().edit();
    apply.beforeApply(editor);
    editor.apply();
  }

  public interface IApply {
    public void beforeApply(SharedPreferences.Editor editor);
  }
}
