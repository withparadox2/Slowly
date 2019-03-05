package com.withparadox2.showslowly.letter;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import com.github.nukc.LoadMoreWrapper.LoadMoreAdapter;
import com.github.nukc.LoadMoreWrapper.LoadMoreWrapper;
import com.withparadox2.showslowly.BaseActivity;
import com.withparadox2.showslowly.R;
import com.withparadox2.showslowly.entity.Friend;
import com.withparadox2.showslowly.entity.Letter;
import com.withparadox2.showslowly.net.ServiceManager;
import com.withparadox2.showslowly.net.result.LetterListResult;
import com.withparadox2.showslowly.token.TokenManager;
import com.withparadox2.showslowly.util.NetUtil;
import com.withparadox2.showslowly.util.Util;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LetterListActivity extends BaseActivity {
  private static final int FIRST_PAGE = 1;

  private SwipeRefreshLayout mRefreshLayout;
  private List<Letter> mLetterList = new ArrayList<>();
  private LetterAdapter mAdapter;
  private Friend mFriend;
  private int mPage = FIRST_PAGE;
  private LoadMoreAdapter mMoreAdapter;
  private LoadMoreAdapter.Enabled mLoadMoreEnabled;

  @Override protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mFriend = (Friend) getIntent().getSerializableExtra("friend");
    setContentView(R.layout.activity_show);
    RecyclerView rv = findViewById(R.id.rv_list);
    rv.setLayoutManager(new LinearLayoutManager(this));
    mAdapter = new LetterAdapter();
    rv.setAdapter(mAdapter);

    mMoreAdapter = LoadMoreWrapper.with(mAdapter)
        .setFooterView(null) // view or layout resource
        .setShowNoMoreEnabled(false) // enable show NoMoreView，default false
        .setListener(new LoadMoreAdapter.OnLoadMoreListener() {
          @Override
          public void onLoadMore(LoadMoreAdapter.Enabled enabled) {
            mLoadMoreEnabled = enabled;
            loadLetters(mPage);
          }
        }).into(rv);

    mRefreshLayout = findViewById(R.id.layout_refresh);
    mRefreshLayout.setEnabled(true);
    mRefreshLayout.setColorSchemeResources(R.color.colorPrimary);
    mRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
      @Override public void onRefresh() {
        loadLetters(FIRST_PAGE);
      }
    });
    loadLetters(FIRST_PAGE);
  }

  private void loadLetters(final int page) {
    ServiceManager.getSlowlyService()
        .listLetters(mFriend.getId(), TokenManager.getPrefToken(), page)
        .enqueue(
            new Callback<LetterListResult>() {
              @Override
              public void onResponse(Call<LetterListResult> call,
                  Response<LetterListResult> response) {
                mRefreshLayout.setRefreshing(false);
                if (response.body() != null && response.body().getComments() != null) {
                  LetterListResult.Comments comments = response.body().getComments();
                  if (page == FIRST_PAGE) {
                    mLetterList.clear();
                  }
                  mLetterList.addAll(comments.getLetterList());
                  mAdapter.notifyDataSetChanged();
                  mPage = page + 1;

                  if (mLoadMoreEnabled != null) {
                    boolean hasMore = !TextUtils.isEmpty(comments.getNextPageUrl());
                    mMoreAdapter.setShowNoMoreEnabled(!hasMore);
                    mMoreAdapter.setLoadMoreEnabled(hasMore);
                  }
                } else {
                  NetUtil.handleError(response.errorBody());
                }
              }

              @Override public void onFailure(Call<LetterListResult> call, Throwable t) {
                mRefreshLayout.setRefreshing(false);
                Util.toast("load letters error: " + t.getMessage());
                t.printStackTrace();
              }
            });
  }

  private class LetterAdapter extends RecyclerView.Adapter<VH> {

    @NonNull @Override public VH onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
      TextView textView = new TextView(LetterListActivity.this);
      return new VH(textView);
    }

    @Override public void onBindViewHolder(@NonNull VH vh, int i) {
      Letter letter = mLetterList.get(i);
      vh.tvContent.setText(letter.getBody());
    }

    @Override public int getItemCount() {
      return Util.collectionSize(mLetterList);
    }
  }

  private static class VH extends RecyclerView.ViewHolder {
    private TextView tvContent;

    public VH(@NonNull View itemView) {
      super(itemView);
      tvContent = (TextView) itemView;
    }
  }
}
