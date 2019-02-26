package com.withparadox2.showslowly.util;

public class Util {
  public static double parseNumber(String input, double defaultValue) {
    try {
      return Double.parseDouble(input);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return defaultValue;
  }
}
