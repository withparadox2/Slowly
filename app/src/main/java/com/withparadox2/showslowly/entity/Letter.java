package com.withparadox2.showslowly.entity;

import com.google.gson.annotations.SerializedName;

public class Letter {

  @SerializedName("id")
  private String id;

  @SerializedName("body")
  private String body;

  @SerializedName("deliver_at")
  private String deliverAt;

  @SerializedName("created_at")
  private String createdAt;

  @SerializedName("location_code")
  private String locationCode;
  public String getId() {
    return id;
  }

  public String getBody() {
    return body;
  }

  public String getDeliverAt() {
    return deliverAt;
  }

  public String getCreatedAt() {
    return createdAt;
  }

  public String getLocationCode() {
    return locationCode;
  }

}
