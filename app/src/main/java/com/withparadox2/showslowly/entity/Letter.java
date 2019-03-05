package com.withparadox2.showslowly.entity;

import android.arch.persistence.room.ColumnInfo;
import android.arch.persistence.room.Entity;
import android.arch.persistence.room.PrimaryKey;
import android.text.TextUtils;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "letter")
public class Letter {

  @PrimaryKey(autoGenerate = true)
  public int id;

  @SerializedName("id")
  @ColumnInfo(name = "letter_id")
  private String letterId;

  @SerializedName("body")
  @ColumnInfo(name = "body")
  private String body;

  @SerializedName("deliver_at")
  @ColumnInfo(name = "deliver_at")
  private String deliverAt;

  @SerializedName("created_at")
  @ColumnInfo(name = "create_at")
  private String createdAt;

  @SerializedName("location_code")
  @ColumnInfo(name = "location_code")
  private String locationCode;

  @SerializedName("user")
  @ColumnInfo(name = "user_from")
  private String userFrom;

  @SerializedName("user_to")
  @ColumnInfo(name = "user_to")
  private String userTo;

  public String getLetterId() {
    return letterId;
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

  public String getUserFrom() {
    return userFrom;
  }

  public String getUserTo() {
    return userTo;
  }

  private String shortBody;
  public String getShortBody() {
    if (shortBody == null) {
      if (body != null) {
        if (body.length() > 200) {
          shortBody = body.substring(0, 200);
        } else {
          shortBody = body;
        }
      } else {
        shortBody = "";
      }
    }
    return shortBody;
  }

  @Override public boolean equals(Object obj) {
    if (obj == this) {
      return true;
    } else if (obj instanceof Letter) {
      return TextUtils.equals(((Letter) obj).getLetterId(), getLetterId());
    } else {
      return false;
    }
  }
}
