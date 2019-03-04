package com.withparadox2.showslowly.net.result;

import com.google.gson.annotations.SerializedName;
import com.withparadox2.showslowly.entity.Letter;
import java.util.List;

public class LetterListResult {

  @SerializedName("comments")
  private Comments comments;

  public Comments getComments() {
    return comments;
  }

  public static class Comments {

    @SerializedName("per_page")
    private int perPage;

    @SerializedName("current_page")
    private int currentPage;

    @SerializedName("next_page_url")
    private String nextPageUrl;

    @SerializedName("prev_page_url")
    private String prePageUrl;

    @SerializedName("from")
    private int from;

    @SerializedName("to")
    private int to;

    @SerializedName("data")
    private List<Letter> letterList;

    public int getPerPage() {
      return perPage;
    }

    public int getCurrentPage() {
      return currentPage;
    }

    public String getNextPageUrl() {
      return nextPageUrl;
    }

    public String getPrePageUrl() {
      return prePageUrl;
    }

    public int getFrom() {
      return from;
    }

    public int getTo() {
      return to;
    }

    public List<Letter> getLetterList() {
      return letterList;
    }
  }
}
