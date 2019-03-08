package com.withparadox2.showslowly.letter;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import com.github.nukc.LoadMoreWrapper.LoadMoreAdapter;
import com.github.nukc.LoadMoreWrapper.LoadMoreWrapper;
import com.withparadox2.showslowly.BaseActivity;
import com.withparadox2.showslowly.R;
import com.withparadox2.showslowly.ShowActivity;
import com.withparadox2.showslowly.entity.Friend;
import com.withparadox2.showslowly.entity.Letter;
import com.withparadox2.showslowly.map.MapActivity;
import com.withparadox2.showslowly.util.Util;

public class LetterListActivity extends BaseActivity implements IDataCallback {
  private SwipeRefreshLayout mRefreshLayout;
  private LetterAdapter mAdapter;
  private LoadMoreAdapter mMoreAdapter;
  private LetterDataManager mDataManager;
  private Friend mFriend;

  @Override protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mFriend = (Friend) getIntent().getSerializableExtra("friend");
    mDataManager = new LetterDataManager(mFriend, this);

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
            mDataManager.requestLoadData(false);
          }
        }).into(rv);

    mRefreshLayout = findViewById(R.id.layout_refresh);
    mRefreshLayout.setEnabled(true);
    mRefreshLayout.setColorSchemeResources(R.color.colorPrimary);
    mRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
      @Override public void onRefresh() {
        mDataManager.requestLoadData(true);
      }
    });
    mDataManager.requestLoadData(true);
    updateTitle();
  }

  @Override public void onServerDataLoaded(boolean isRefresh) {
    mRefreshLayout.setRefreshing(false);
    mAdapter.notifyDataSetChanged();
    mMoreAdapter.setShowNoMoreEnabled(!mDataManager.isHasMoreData());
    mMoreAdapter.setLoadMoreEnabled(mDataManager.isHasMoreData());
    updateTitle();
  }

  @Override public void onLocalDataLoaded() {
    mAdapter.notifyDataSetChanged();
    mMoreAdapter.setShowNoMoreEnabled(!mDataManager.isHasMoreData());
    mMoreAdapter.setLoadMoreEnabled(mDataManager.isHasMoreData());
    updateTitle();
  }

  @SuppressLint("DefaultLocale") private void updateTitle() {
    if (getSupportActionBar() != null) {
      getSupportActionBar().setTitle(
          String.format("%s(%d)", mFriend.getName(), mDataManager.getLetterList().size()));
    }
  }

  @Override public void onError(String message) {
    mRefreshLayout.setRefreshing(false);
    Util.toast("load letters error: " + message);
  }

  private class LetterAdapter extends RecyclerView.Adapter<VH> {

    @NonNull @Override public VH onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
      TextView textView = new TextView(LetterListActivity.this);
      return new VH(textView);
    }

    @Override public void onBindViewHolder(@NonNull VH vh, int i) {
      Letter letter = mDataManager.getLetterList().get(i);
      vh.tvContent.setText(letter.getShortBody());
    }

    @Override public int getItemCount() {
      return Util.collectionSize(mDataManager.getLetterList());
    }
  }

  private static class VH extends RecyclerView.ViewHolder {
    private TextView tvContent;

    public VH(@NonNull View itemView) {
      super(itemView);
      tvContent = (TextView) itemView;
    }
  }

  @Override public boolean onCreateOptionsMenu(Menu menu) {
    MenuItem item = menu.add(Menu.NONE, Menu.NONE, Menu.NONE, "Sync");
    item.setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS);
    return true;
  }

  @Override public boolean onOptionsItemSelected(MenuItem item) {
    if (item.getItemId() == Menu.NONE) {
      //new SyncLetter(this, mFriend).showSyncDialog();
      Intent intent = new Intent(this, LetterStatActivity.class);
      intent.putExtra("friend", mFriend);
      startActivity(intent);
      return true;
    }
    return super.onOptionsItemSelected(item);
  }

}
