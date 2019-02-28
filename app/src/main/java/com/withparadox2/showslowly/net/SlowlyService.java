package com.withparadox2.showslowly.net;

import com.withparadox2.showslowly.net.result.FriendListResult;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface SlowlyService {
  @GET("users/me/friends/v2?requests=1")
  public Call<FriendListResult> listFriends(@Query("token") String token);
}
