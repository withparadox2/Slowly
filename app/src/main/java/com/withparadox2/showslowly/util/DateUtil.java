package com.withparadox2.showslowly.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class DateUtil {
  public static String FORMAT_Y = "yyyy";
  public static String FORMAT_HM = "HH:mm";
  public static String FORMAT_MDHM = "MM-dd HH:mm";
  public static String FORMAT_YMD = "yyyy-MM-dd";
  public static String FORMAT_YMDHM = "yyyy-MM-dd HH:mm";
  public static String FORMAT_YMDHMS = "yyyy-MM-dd HH:mm:ss";
  public static String FORMAT_FULL = "yyyy-MM-dd HH:mm:ss.S";
  public static String FORMAT_FULL_SN = "yyyyMMddHHmmssS";

  public static SimpleDateFormat DEFAULT_FORMAT =
      new SimpleDateFormat(FORMAT_YMDHMS, Locale.getDefault());

  public static Date parseDate(String input) {
    return parseDate(input, DEFAULT_FORMAT);
  }

  public static Date parseDate(String input, DateFormat dateFormat) {
    try {
      return dateFormat.parse(input);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

  public static String formatDate(long date) {
    return formatDate(date, DEFAULT_FORMAT);
  }

  public static String formatDate(long date, DateFormat dateFormat) {
    return formatDate(new Date(date), dateFormat);
  }

  public static String formatDate(Date date) {
    return formatDate(date, DEFAULT_FORMAT);
  }

  public static String formatDate(Date date, DateFormat dateFormat) {
    return dateFormat.format(date);
  }
}
