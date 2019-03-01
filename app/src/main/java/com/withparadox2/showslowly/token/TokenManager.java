package com.withparadox2.showslowly.token;

import android.support.annotation.NonNull;
import android.text.TextUtils;
import com.withparadox2.showslowly.App;
import com.withparadox2.showslowly.util.FileUtil;
import com.withparadox2.showslowly.util.PreferencesUtil;
import com.withparadox2.showslowly.util.Util;
import java.io.File;
import org.json.JSONException;

public class TokenManager {
  private static final String PREFIX_TOKEN = "show_slowly_token=";
  private static final String PREF_KEY_TOKEN = "slowly_token";

  /**
   * Read token from Slowly's persist file under VirtualXposed
   * environment
   *
   * @param tokenResult package to deliver token
   * @return null if succeed or error message if failed
   */
  public static String readTokenFromSlowly(@NonNull StringBuilder tokenResult) {
    File dir = App.instance.getFilesDir();

    if (dir.getAbsolutePath().contains("io.va.exposed")) {
      File slowlyDir = new File(dir.getParentFile().getParentFile(), "com.slowlyapp");
      if (slowlyDir.exists()) {
        File jsonFile = new File(slowlyDir, "files/persistStore/persist-root");
        String content = FileUtil.readContent(jsonFile);
        try {
          String token = PersistFileParser.parseToken(content);
          tokenResult.setLength(0);
          tokenResult.append(token);
          return null;
        } catch (JSONException e) {
          e.printStackTrace();
          return "parse json error";
        }
      } else {
        return "Please import slowly to VirtualXposed and try to login until success";
      }
    } else {
      return "Only support retrieving data under VirtualXposed";
    }
  }

  public static String packToken(@NonNull String token) {
    if (isTokenPack(token)) {
      return token;
    } else {
      return PREFIX_TOKEN + token;
    }
  }

  public static String unpackToken(@NonNull String input) {
    if (isTokenPack(input)) {
      return input.substring(PREFIX_TOKEN.length());
    }
    return input;
  }

  /**
   * Check if pack contains a valid token
   *
   * @param pack the pack to be checked
   */
  public static boolean isTokenPack(@NonNull String pack) {
    return !TextUtils.isEmpty(pack) && pack.startsWith(PREFIX_TOKEN);
  }

  public static boolean checkTokenFromClipboard() {
    String candidate = Util.getTopTextFromClipboard();
    if (candidate != null) {
      if (isTokenPack(candidate)) {
        String newToken = unpackToken(candidate);
        if (!TextUtils.equals(newToken, getPrefToken())) {
          setPrefToken(newToken);
          Util.toast("Token has been updated");
          return true;
        }
      }
    }
    return false;
  }

  public static String getPrefToken() {
    return PreferencesUtil.getString(PREF_KEY_TOKEN, null);
  }

  public static void setPrefToken(String token) {
    PreferencesUtil.putString(PREF_KEY_TOKEN, token);
  }

  public static boolean isTokenExist() {
    return !TextUtils.isEmpty(getPrefToken());
  }
}
