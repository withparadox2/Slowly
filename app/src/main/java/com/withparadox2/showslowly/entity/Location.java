package com.withparadox2.showslowly.entity;

import android.arch.persistence.room.ColumnInfo;
import android.arch.persistence.room.Entity;
import android.arch.persistence.room.PrimaryKey;

@Entity(tableName = "location")
public class Location {
  @PrimaryKey(autoGenerate = true)
  public int id;

  @ColumnInfo(name = "user_id")
  public String userId;

  @ColumnInfo(name = "lat")
  public double lat;

  @ColumnInfo(name = "lng")
  public double lng;

  @ColumnInfo(name = "date_time")
  public String dateTime;


  public Location setUserId(String userId) {
    this.userId = userId;
    return this;
  }

  public Location setLat(double lat) {
    this.lat = lat;
    return this;
  }

  public Location setLng(double lng) {
    this.lng = lng;
    return this;
  }

  public Location setDateTime(String dateTime) {
    this.dateTime = dateTime;
    return this;
  }
}
