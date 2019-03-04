package com.withparadox2.xposedslowly;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.widget.Toast;
import de.robv.android.xposed.IXposedHookLoadPackage;
import de.robv.android.xposed.XC_MethodHook;
import de.robv.android.xposed.XposedBridge;
import de.robv.android.xposed.XposedHelpers;
import de.robv.android.xposed.callbacks.XC_LoadPackage;

public class Main implements IXposedHookLoadPackage {
  @Override public void handleLoadPackage(XC_LoadPackage.LoadPackageParam loadPackageParam)
      throws Throwable {
    XposedBridge.log("handleLoadPackage execute");
    if (loadPackageParam.packageName.equals("com.slowlyapp")) {
      XposedHelpers.findAndHookMethod(Activity.class, "onCreate", Bundle.class,
          new XC_MethodHook() {
            @Override protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
              super.beforeHookedMethod(param);
              Toast.makeText((Context) param.thisObject, "haha", Toast.LENGTH_SHORT).show();
              XposedBridge.log(param.thisObject.getClass().getName());
            }

            @Override protected void afterHookedMethod(MethodHookParam param) throws Throwable {
              super.afterHookedMethod(param);
              XposedBridge.log("after hook");
            }
          });
    }
  }

}
