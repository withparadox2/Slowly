package com.withparadox2.showslowly.net;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.converter.scalars.ScalarsConverterFactory;

public class ServiceManager {
  private static SlowlyService sSlowlyService = new Retrofit.Builder()
      .addConverterFactory(ScalarsConverterFactory.create())
      .addConverterFactory(GsonConverterFactory.create())
      .baseUrl("https://api.getslowly.com/")
      .build().create(SlowlyService.class);

  public static SlowlyService getSlowlyService() {
    return sSlowlyService;
  }
}
