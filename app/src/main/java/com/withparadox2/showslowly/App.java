package com.withparadox2.showslowly;

import android.app.Application;
import android.os.Handler;

public class App extends Application {
  public static App instance = null;
  private Handler mHandler = new Handler();

  @Override public void onCreate() {
    super.onCreate();
    instance = this;
  }

  public Handler getHandler() {
    return mHandler;
  }
}
