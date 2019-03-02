package com.withparadox2.showslowly.entity;

import com.google.gson.annotations.SerializedName;
import com.withparadox2.showslowly.util.TypeUtil;

import java.io.Serializable;

public class Friend implements Serializable {
  @SerializedName("user_id")
  private String id;

  @SerializedName("name")
  private String name;

  @SerializedName("last_login")
  private String lastLogin;

  @SerializedName("latest_comment")
  private String lastComment;

  @SerializedName("user_location")
  private String userLocation;

  private transient double latitude;
  private transient double longitude;
  private transient boolean isLocationChanged;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(String lastLogin) {
    this.lastLogin = lastLogin;
  }

  public String getLastComment() {
    return lastComment;
  }

  public void setLastComment(String lastComment) {
    this.lastComment = lastComment;
  }

  public double getLatitude() {
    return latitude;
  }

  public void setLatitude(double latitude) {
    this.latitude = latitude;
  }

  public double getLongitude() {
    return longitude;
  }

  public void setLongitude(double longitude) {
    this.longitude = longitude;
  }

  public String getUserLocation() {
    return userLocation;
  }

  public void parseLocation() {
    if (userLocation != null && userLocation.contains(",")) {
      String[] arr = userLocation.split(",");
      setLongitude(TypeUtil.parseDouble(arr[1], -1));
      setLatitude(TypeUtil.parseDouble(arr[0], -1));
    }
  }

  public boolean isLocationChanged() {
    return isLocationChanged;
  }

  public void setLocationChanged(boolean locationChanged) {
    isLocationChanged = locationChanged;
  }
}
