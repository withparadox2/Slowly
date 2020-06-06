var LocationUtil = (function() {
  function LocationUtil() {}
  LocationUtil.wgs2gcj = function(lat, lon) {
    if (LocationUtil.outOfChina(lat, lon)) {
      return [lat, lon]
    } else {
      var d = LocationUtil.delta(lat, lon)
      return [lat + d[0], lon + d[1]]
    }
  }
  LocationUtil.wgs2bd = function(lat, lon) {
    if (LocationUtil.outOfChina(lat, lon)) {
      return [lat, lon]
    }
    var wgs2gcj = LocationUtil.wgs2gcj(lat, lon)
    var gcj2bd = LocationUtil.gcj2bd(wgs2gcj[0], wgs2gcj[1])
    return gcj2bd
  }
  LocationUtil.gcj2wgs = function(lat, lon) {
    if (LocationUtil.outOfChina(lat, lon)) {
      return [lat, lon]
    } else {
      var d = LocationUtil.delta(lat, lon)
      return [lat - d[0], lon - d[1]]
    }
  }
  LocationUtil.gcj2bd = function(lat, lon) {
    var z =
      Math.sqrt(lon * lon + lat * lat) +
      2.0e-5 * Math.sin(lat * LocationUtil.x_pi)
    var theta =
      Math.atan2(lat, lon) + 3.0e-6 * Math.cos(lon * LocationUtil.x_pi)
    var bd_lon = z * Math.cos(theta) + 0.0065
    var bd_lat = z * Math.sin(theta) + 0.006
    return [bd_lat, bd_lon]
  }
  LocationUtil.bd2wgs = function(lat, lon) {
    var bd2gcj = LocationUtil.bd2gcj(lat, lon)
    var gcj2wgs = LocationUtil.gcj2wgs(bd2gcj[0], bd2gcj[1])
    return gcj2wgs
  }
  LocationUtil.bd2gcj = function(lat, lon) {
    var x = lon - 0.0065
    var y = lat - 0.006
    var z = Math.sqrt(x * x + y * y) - 2.0e-5 * Math.sin(y * LocationUtil.x_pi)
    var theta = Math.atan2(y, x) - 3.0e-6 * Math.cos(x * LocationUtil.x_pi)
    var gg_lon = z * Math.cos(theta)
    var gg_lat = z * Math.sin(theta)
    return [gg_lat, gg_lon]
  }
  LocationUtil.distance = function(latA, logA, latB, logB) {
    var earthR = 6371000.0
    var x =
      Math.cos((latA * 3.141592653589793) / 180.0) *
      Math.cos((latB * 3.141592653589793) / 180.0) *
      Math.cos(((logA - logB) * 3.141592653589793) / 180.0)
    var y =
      Math.sin((latA * 3.141592653589793) / 180.0) *
      Math.sin((latB * 3.141592653589793) / 180.0)
    var s = x + y
    if (s > 1.0) {
      s = 1.0
    }
    if (s < -1.0) {
      s = -1.0
    }
    var alpha = Math.acos(s)
    var distance = alpha * earthR
    return distance
  }
  LocationUtil.outOfChina = function(wgsLat, wgsLon) {
    return wgsLon >= 72.004 && wgsLon <= 137.8347
      ? wgsLat < 0.8293 || wgsLat > 55.8271
      : true
  }
  /*private*/ LocationUtil.delta = function(lat, lon) {
    var a = 6378245.0
    var ee = 0.006693421622965943
    var dLat = LocationUtil.transformLat(lon - 105.0, lat - 35.0)
    var dLon = LocationUtil.transformLon(lon - 105.0, lat - 35.0)
    var radLat = (lat / 180.0) * LocationUtil.pi
    var magic = Math.sin(radLat)
    magic = 1.0 - ee * magic * magic
    var sqrtMagic = Math.sqrt(magic)
    dLat =
      (dLat * 180.0) /
      (((a * (1.0 - ee)) / (magic * sqrtMagic)) * LocationUtil.pi)
    dLon =
      (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * LocationUtil.pi)
    return [dLat, dLon]
  }
  /*private*/ LocationUtil.transformLat = function(lat, lon) {
    var ret =
      -100.0 +
      2.0 * lat +
      3.0 * lon +
      0.2 * lon * lon +
      0.1 * lat * lon +
      0.2 * Math.sqrt(Math.abs(lat))
    ret +=
      ((20.0 * Math.sin(6.0 * lat * LocationUtil.pi) +
        20.0 * Math.sin(2.0 * lat * LocationUtil.pi)) *
        2.0) /
      3.0
    ret +=
      ((20.0 * Math.sin(lon * LocationUtil.pi) +
        40.0 * Math.sin((lon / 3.0) * LocationUtil.pi)) *
        2.0) /
      3.0
    ret +=
      ((160.0 * Math.sin((lon / 12.0) * LocationUtil.pi) +
        320.0 * Math.sin((lon * LocationUtil.pi) / 30.0)) *
        2.0) /
      3.0
    return ret
  }
  /*private*/ LocationUtil.transformLon = function(lat, lon) {
    var ret =
      300.0 +
      lat +
      2.0 * lon +
      0.1 * lat * lat +
      0.1 * lat * lon +
      0.1 * Math.sqrt(Math.abs(lat))
    ret +=
      ((20.0 * Math.sin(6.0 * lat * LocationUtil.pi) +
        20.0 * Math.sin(2.0 * lat * LocationUtil.pi)) *
        2.0) /
      3.0
    ret +=
      ((20.0 * Math.sin(lat * LocationUtil.pi) +
        40.0 * Math.sin((lat / 3.0) * LocationUtil.pi)) *
        2.0) /
      3.0
    ret +=
      ((150.0 * Math.sin((lat / 12.0) * LocationUtil.pi) +
        300.0 * Math.sin((lat / 30.0) * LocationUtil.pi)) *
        2.0) /
      3.0
    return ret
  }
  LocationUtil.mercator2LatLon = function(x, y) {
    var lon = (x / 2.003750834e7) * 180.0
    var lat = (y / 2.003750834e7) * 180.0
    lat =
      57.29577951308232 *
      (2.0 * Math.atan(Math.exp((lat * 3.141592653589793) / 180.0)) -
        1.5707963267948966)
    var latLng = [lat, lon]
    return latLng
  }
  LocationUtil.latLon2Mercator = function(lat, lon) {
    var x = (lon * 2.003750834e7) / 180.0
    var y =
      Math.log(Math.tan(((90.0 + lat) * 3.141592653589793) / 360.0)) /
      0.017453292519943295
    y = (y * 2.003750834e7) / 180.0
    return [x, y]
  }
  return LocationUtil
})()
LocationUtil.pi = 3.141592653589793
LocationUtil.a = 6378245.0
LocationUtil.ee = 0.006693421622965943
LocationUtil.x_pi = 52.35987755982988
LocationUtil["__class"] = "LocationUtil"

export function bd2wgs(lat, lng) {
  return LocationUtil.bd2wgs(lat, lng)
}
export function wgs2bd(lat, lng) {
  return LocationUtil.wgs2bd(lat, lng)
}
