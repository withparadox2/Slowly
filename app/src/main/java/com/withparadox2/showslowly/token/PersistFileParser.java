package com.withparadox2.showslowly.token;

import org.json.JSONException;
import org.json.JSONObject;

class PersistFileParser {
  public static String parseToken(String str) throws JSONException {
    JSONObject jsonObject = new JSONObject(str);
    String meStr = jsonObject.optString("me");
    JSONObject meJsonObject = new JSONObject(meStr);
    return meJsonObject.optString("token");
  }
}
