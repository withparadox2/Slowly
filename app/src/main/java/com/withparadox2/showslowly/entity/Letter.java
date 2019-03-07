package com.withparadox2.showslowly.entity;

import android.arch.persistence.room.ColumnInfo;
import android.arch.persistence.room.Entity;
import android.arch.persistence.room.PrimaryKey;
import android.support.annotation.NonNull;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "letter")
public class Letter {

  @SerializedName("id")
  @PrimaryKey
  @NonNull
  @ColumnInfo(name = "letter_id")
  private Long letterId;

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

  /**
   * Same as {@link Friend#id Friend#id}
   */
  @ColumnInfo(name = "post")
  @SerializedName("post")
  private String post;

  /**
   * If this letter is the earliest one, yes-1 and no-0
   */
  @ColumnInfo(name = "last_one")
  private int earliestFlag = 0;

  public void setLetterId(Long letterId) {
    this.letterId = letterId;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public void setDeliverAt(String deliverAt) {
    this.deliverAt = deliverAt;
  }

  public void setCreatedAt(String createdAt) {
    this.createdAt = createdAt;
  }

  public void setLocationCode(String locationCode) {
    this.locationCode = locationCode;
  }

  public void setUserFrom(String userFrom) {
    this.userFrom = userFrom;
  }

  public void setUserTo(String userTo) {
    this.userTo = userTo;
  }

  public Long getLetterId() {
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

  public boolean isEarliest() {
    return earliestFlag == 1;
  }

  public void setIsEarliest(boolean isEarliest) {
    earliestFlag = isEarliest ? 1 : 0;
  }

  public int getEarliestFlag() {
    return earliestFlag;
  }

  public void setEarliestFlag(int earliestFlag) {
    this.earliestFlag = earliestFlag;
  }

  private transient String shortBody;

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
      return ((Letter) obj).getLetterId().equals(getLetterId());
    } else {
      return false;
    }
  }

  public String getPost() {
    return post;
  }

  public void setPost(String post) {
    this.post = post;
  }
}
