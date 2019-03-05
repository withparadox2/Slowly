package com.withparadox2.showslowly.util;

import android.text.TextUtils;
import java.io.IOException;
import okhttp3.ResponseBody;
import org.json.JSONException;
import org.json.JSONObject;

public class NetUtil {
  public static String resolveErrorMessage(ResponseBody body) {
    try {
      String message = body.string();
      JSONObject jsonObject = new JSONObject(message);
      return jsonObject.optString("error");
    } catch (IOException | JSONException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static void handleError(ResponseBody body) {
    if (body != null) {
      String error = resolveErrorMessage(body);
      if (!TextUtils.isEmpty(error)) {
        Util.toast(error);
      } else {
        try {
          Util.toast(body.string());
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }
}
