package com.withparadox2.showslowly;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;
import com.withparadox2.showslowly.util.FileUtil;
import com.withparadox2.showslowly.util.Util;
import java.io.File;
import java.util.Iterator;
import org.json.JSONException;
import org.json.JSONObject;

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
    try {
      //Persist persist = parseJson(readFromAssets());
      Persist persist = parseJson(FileUtil.readContent(new File(slowDir, "files/persistStore/persist-root")));
      sb.append("token = " + persist.token + "\n\n");

      for (Friend friend : persist.friendList) {
        sb.append(friend.getId() + " " + friend.getName()).append("\n");
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }
    mTextView.setText(sb.toString());
  }

  public Persist parseJson(String str) throws JSONException {
    Persist persist = new Persist();

    JSONObject jsonObject = new JSONObject(str);

    String meStr = jsonObject.optString("me");
    JSONObject meJsonObject = new JSONObject(meStr);
    persist.token = meJsonObject.optString("token");

    String contactsStr = jsonObject.optString("contacts");
    JSONObject contactsJsonObject = new JSONObject(contactsStr);
    Iterator<String> keys = contactsJsonObject.keys();
    if (keys != null) {
      while (keys.hasNext()) {
        String key = keys.next();
        if (!key.matches("\\d+")) {
          continue;
        }
        JSONObject friendJsonObject = contactsJsonObject.getJSONObject(key);
        Friend friend = new Friend();
        friend.setId(key);
        friend.setName(friendJsonObject.optString("name"));
        friend.setLastComment(friendJsonObject.optString("latest_comment"));
        friend.setLastLogin(friendJsonObject.optString("last_login"));
        String locationStr = friendJsonObject.optString("user_location");
        if (locationStr != null && locationStr.contains(",")) {
          String[] locations = locationStr.split(",");
          if (locations.length == 2) {
            friend.setLatitude(Util.parseNumber(locations[0], -1));
            friend.setLongitude(Util.parseNumber(locations[1], -1));
          }
        }
        persist.friendList.add(friend);
      }
    }
    return persist;
  }

  private String readFromAssets() {
    return FileUtil.readContentFromAssets(this, "persist-root");
  }
}
