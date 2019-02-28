package com.withparadox2.showslowly;

import android.app.Application;
import android.os.Handler;

import com.baidu.mapapi.CoordType;
import com.baidu.mapapi.SDKInitializer;

public class App extends Application {
  public static App instance = null;
  private Handler mHandler = new Handler();

  @Override public void onCreate() {
    super.onCreate();
    instance = this;
    SDKInitializer.initialize(this);
    SDKInitializer.setCoordType(CoordType.BD09LL);
  }

  public Handler getHandler() {
    return mHandler;
  }
}
