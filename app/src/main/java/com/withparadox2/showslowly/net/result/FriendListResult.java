package com.withparadox2.showslowly.net.result;

import com.google.gson.annotations.SerializedName;
import com.withparadox2.showslowly.entity.Friend;
import java.util.List;

public class FriendListResult {
  @SerializedName("friends")
  private List<Friend> friendList;

  public List<Friend> getFriendList() {
    return friendList;
  }QA
}
