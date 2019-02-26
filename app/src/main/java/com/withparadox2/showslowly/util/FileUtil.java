package com.withparadox2.showslowly.util;

import android.content.Context;
import java.io.BufferedReader;
import java.io.Closeable;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class FileUtil {
  public static String readContent(File file) {
    StringBuilder result = new StringBuilder();
    BufferedReader reader = null;

    try {
      reader = new BufferedReader(new FileReader(file));
      char[] buf = new char[1024];

      int r;
      while ((r = reader.read(buf)) != -1) {
        result.append(buf, 0, r);
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      closeQuietly(reader);
    }

    return result.toString();
  }

  public static String readContentFromAssets(Context context, String fileName) {
    BufferedReader br = null;
    try {
      StringBuilder sb = new StringBuilder();
      InputStream is = context.getAssets().open(fileName);
      br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
      String str;
      while ((str = br.readLine()) != null) {
        sb.append(str);
      }
      return sb.toString();
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      closeQuietly(br);
    }
    return "";
  }

  public static void closeQuietly(Closeable closeable) {
    try {
      if (closeable != null) {
        closeable.close();
      }
    } catch (IOException var2) {
    }
  }
}
