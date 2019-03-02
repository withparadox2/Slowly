package com.withparadox2.showslowly;

import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import com.withparadox2.showslowly.permission.PermissionManager;

public class BaseActivity extends AppCompatActivity {
  @Override public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
      @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    PermissionManager.handlePermissionResult(requestCode, permissions, grantResults);
  }
}
