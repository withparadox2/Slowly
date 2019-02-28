package com.withparadox2.showslowly.net.converter;

import com.withparadox2.showslowly.entity.Friend;
import com.withparadox2.showslowly.net.result.FriendListResult;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.List;
import okhttp3.ResponseBody;
import retrofit2.Converter;
import retrofit2.Retrofit;

public class SlowlyConverterFactory extends Converter.Factory {
  @Override
  public Converter<ResponseBody, ?> responseBodyConverter(Type type, Annotation[] annotations,
      Retrofit retrofit) {
    Converter<ResponseBody, FriendListResult> delegate =
        retrofit.nextResponseBodyConverter(this, FriendListResult.class, annotations);
    return new FriendListConverter(delegate);
  }

  static class FriendListConverter implements Converter<ResponseBody, List<Friend>> {
    private Converter<ResponseBody, FriendListResult> delegate;

    FriendListConverter(Converter<ResponseBody, FriendListResult> delegate) {
      this.delegate = delegate;
    }

    @Override public List<Friend> convert(ResponseBody value) throws IOException {
      FriendListResult result = delegate.convert(value);
      return result.getFriendList();
    }
  }
}
