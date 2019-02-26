package com.withparadox2.showslowly;

public class Friend {
  private String id;

  private String name;
  private String lastLogin;
  private String lastComment;
  private double latitude;
  private double longitude;

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
}
