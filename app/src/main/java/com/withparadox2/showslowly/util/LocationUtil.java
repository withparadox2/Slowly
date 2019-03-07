package com.withparadox2.showslowly.util;

public class LocationUtil {
  static double pi = 3.141592653589793D;
  static double a = 6378245.0D;
  static double ee = 0.006693421622965943D;
  static double x_pi = 52.35987755982988D;

  public LocationUtil() {
  }

  public static double[] wgs2gcj(double lat, double lon) {
    if (outOfChina(lat, lon)) {
      return new double[] { lat, lon };
    } else {
      double[] d = delta(lat, lon);
      return new double[] { lat + d[0], lon + d[1] };
    }
  }

  public static double[] wgs2bd(double lat, double lon) {
    double[] wgs2gcj = wgs2gcj(lat, lon);
    double[] gcj2bd = gcj2bd(wgs2gcj[0], wgs2gcj[1]);
    return gcj2bd;
  }

  public static double[] gcj2wgs(double lat, double lon) {
    if (outOfChina(lat, lon)) {
      return new double[] { lat, lon };
    } else {
      double[] d = delta(lat, lon);
      return new double[] { lat - d[0], lon - d[1] };
    }
  }

  public static double[] gcj2bd(double lat, double lon) {
    double z = Math.sqrt(lon * lon + lat * lat) + 2.0E-5D * Math.sin(lat * x_pi);
    double theta = Math.atan2(lat, lon) + 3.0E-6D * Math.cos(lon * x_pi);
    double bd_lon = z * Math.cos(theta) + 0.0065D;
    double bd_lat = z * Math.sin(theta) + 0.006D;
    return new double[] { bd_lat, bd_lon };
  }

  public static double[] bd2wgs(double lat, double lon) {
    double[] bd2gcj = bd2gcj(lat, lon);
    double[] gcj2wgs = gcj2wgs(bd2gcj[0], bd2gcj[1]);
    return gcj2wgs;
  }

  public static double[] bd2gcj(double lat, double lon) {
    double x = lon - 0.0065D;
    double y = lat - 0.006D;
    double z = Math.sqrt(x * x + y * y) - 2.0E-5D * Math.sin(y * x_pi);
    double theta = Math.atan2(y, x) - 3.0E-6D * Math.cos(x * x_pi);
    double gg_lon = z * Math.cos(theta);
    double gg_lat = z * Math.sin(theta);
    return new double[] { gg_lat, gg_lon };
  }

  public static double distance(double latA, double logA, double latB, double logB) {
    double earthR = 6371000.0D;
    double x = Math.cos(latA * 3.141592653589793D / 180.0D)
        * Math.cos(latB * 3.141592653589793D / 180.0D)
        * Math.cos((logA - logB) * 3.141592653589793D / 180.0D);
    double y =
        Math.sin(latA * 3.141592653589793D / 180.0D) * Math.sin(latB * 3.141592653589793D / 180.0D);
    double s = x + y;
    if (s > 1.0D) {
      s = 1.0D;
    }

    if (s < -1.0D) {
      s = -1.0D;
    }

    double alpha = Math.acos(s);
    double distance = alpha * earthR;
    return distance;
  }

  public static boolean outOfChina(double wgsLat, double wgsLon) {
    return wgsLon >= 72.004D && wgsLon <= 137.8347D ? wgsLat < 0.8293D || wgsLat > 55.8271D : true;
  }

  private static double[] delta(double lat, double lon) {
    double a = 6378245.0D;
    double ee = 0.006693421622965943D;
    double dLat = transformLat(lon - 105.0D, lat - 35.0D);
    double dLon = transformLon(lon - 105.0D, lat - 35.0D);
    double radLat = lat / 180.0D * pi;
    double magic = Math.sin(radLat);
    magic = 1.0D - ee * magic * magic;
    double sqrtMagic = Math.sqrt(magic);
    dLat = dLat * 180.0D / (a * (1.0D - ee) / (magic * sqrtMagic) * pi);
    dLon = dLon * 180.0D / (a / sqrtMagic * Math.cos(radLat) * pi);
    return new double[] { dLat, dLon };
  }

  private static double transformLat(double lat, double lon) {
    double ret =
        -100.0D + 2.0D * lat + 3.0D * lon + 0.2D * lon * lon + 0.1D * lat * lon + 0.2D * Math.sqrt(
            Math.abs(lat));
    ret += (20.0D * Math.sin(6.0D * lat * pi) + 20.0D * Math.sin(2.0D * lat * pi)) * 2.0D / 3.0D;
    ret += (20.0D * Math.sin(lon * pi) + 40.0D * Math.sin(lon / 3.0D * pi)) * 2.0D / 3.0D;
    ret +=
        (160.0D * Math.sin(lon / 12.0D * pi) + 320.0D * Math.sin(lon * pi / 30.0D)) * 2.0D / 3.0D;
    return ret;
  }

  private static double transformLon(double lat, double lon) {
    double ret = 300.0D + lat + 2.0D * lon + 0.1D * lat * lat + 0.1D * lat * lon + 0.1D * Math.sqrt(
        Math.abs(lat));
    ret += (20.0D * Math.sin(6.0D * lat * pi) + 20.0D * Math.sin(2.0D * lat * pi)) * 2.0D / 3.0D;
    ret += (20.0D * Math.sin(lat * pi) + 40.0D * Math.sin(lat / 3.0D * pi)) * 2.0D / 3.0D;
    ret +=
        (150.0D * Math.sin(lat / 12.0D * pi) + 300.0D * Math.sin(lat / 30.0D * pi)) * 2.0D / 3.0D;
    return ret;
  }

  public static double[] mercator2LatLon(double x, double y) {
    double lon = x / 2.003750834E7D * 180.0D;
    double lat = y / 2.003750834E7D * 180.0D;
    lat = 57.29577951308232D * (2.0D * Math.atan(Math.exp(lat * 3.141592653589793D / 180.0D))
        - 1.5707963267948966D);
    double[] latLng = new double[] { lat, lon };
    return latLng;
  }

  public static double[] latLon2Mercator(double lat, double lon) {
    double x = lon * 2.003750834E7D / 180.0D;
    double y =
        Math.log(Math.tan((90.0D + lat) * 3.141592653589793D / 360.0D)) / 0.017453292519943295D;
    y = y * 2.003750834E7D / 180.0D;
    return new double[] { x, y };
  }

  public static double distance(com.withparadox2.showslowly.entity.Location l1,
      com.withparadox2.showslowly.entity.Location l2) {
    return distance(l1.lat, l1.lng, l2.lat, l2.lng);
  }
}
