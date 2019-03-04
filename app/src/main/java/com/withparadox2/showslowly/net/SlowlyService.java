package com.withparadox2.showslowly.net;

import com.withparadox2.showslowly.net.result.FriendListResult;
import com.withparadox2.showslowly.net.result.LetterListResult;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface SlowlyService {
  @GET("users/me/friends/v2?requests=1")
  public Call<FriendListResult> listFriends(@Query("token") String token);

  @GET("posts/{user_id}?ver=2")
  public Call<LetterListResult> listLetters(@Path("user_id") String userId,
      @Query("token") String token, @Query("page") int page);
}
