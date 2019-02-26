package com.withparadox2.showslowly;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;
import java.io.File;

public class ShowActivity extends AppCompatActivity {
  private TextView mTextView;
  @Override protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mTextView = new TextView(this);
    mTextView.setPadding(20, 20, 20, 20);
    setContentView(mTextView);

    File dir = getFilesDir();
    StringBuilder sb = new StringBuilder();
    sb.append("dir = " + dir.getAbsolutePath() + "\n\n");
    File slowDir = new File(dir.getParentFile().getParentFile(), "com.slowlyapp");
    sb.append("slowly dir exist = " + slowDir.exists()+"\n");
    if (slowDir.exists()) {
      File jsonFile = new File(slowDir, "files/persistStore/persist-root");
      sb.append("jsonFile exist = " + jsonFile.exists()+"\n\n");
    }
    mTextView.setText(sb.toString());
  }
}
