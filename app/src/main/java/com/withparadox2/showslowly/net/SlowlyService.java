package com.withparadox2.showslowly.net;

import com.withparadox2.showslowly.entity.Friend;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface SlowlyService {
  @GET("users/me/friends/v2?requests=1")
  public Call<List<Friend>> listFriends(@Query("token") String token);
}
