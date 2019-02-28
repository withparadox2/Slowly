package com.withparadox2.showslowly.util;

public class TypeUtil {
  public static double parseDouble(String input, double defaultVal) {
    try {
      return Double.parseDouble(input);
    } catch (Exception ignore) {
      return defaultVal;
    }
  }

  public static double parseFloat(String input, float defaultVal) {
    try {
      return Float.parseFloat(input);
    } catch (Exception ignore) {
      return defaultVal;
    }
  }
}
