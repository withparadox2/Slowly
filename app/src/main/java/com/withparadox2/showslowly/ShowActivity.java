package com.withparadox2.showslowly;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import com.withparadox2.showslowly.entity.Friend;
import com.withparadox2.showslowly.net.ServiceManager;
import com.withparadox2.showslowly.token.TokenManager;
import com.withparadox2.showslowly.util.Util;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ShowActivity extends AppCompatActivity {
  private List<Friend> mFriendList = new ArrayList<>();
  private RecyclerView mRecyclerView;
  private FriendAdapter mAdapter;

  @Override protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
    mRecyclerView = findViewById(R.id.rv_friend);
    mAdapter = new FriendAdapter();
    mRecyclerView.setAdapter(mAdapter);
    mRecyclerView.setLayoutManager(new LinearLayoutManager(this));

    if (TokenManager.isTokenExist()) {
      loadFriends();
    } else {
      Util.toast("Token doesn't exist");
    }
  }

  @Override protected void onResume() {
    super.onResume();
    if (TokenManager.checkTokenFromClipboard()) {
      loadFriends();
    }
  }

  private void loadFriends() {
    ServiceManager.getSlowlyService().listFriends(TokenManager.getPrefToken()).enqueue(
        new Callback<List<Friend>>() {
          @Override
          public void onResponse(@NonNull Call<List<Friend>> call,
              @NonNull Response<List<Friend>> response) {
            if (response.body() != null) {
              mFriendList = response.body();
              mAdapter.notifyDataSetChanged();
              Util.toast("size = " + mFriendList.size());
            }
          }

          @Override public void onFailure(@NonNull Call<List<Friend>> call, @NonNull Throwable t) {
            Util.toast("error " + t.getMessage());
          }
        });
  }

  private class FriendAdapter extends RecyclerView.Adapter<ViewHolder> {

    @NonNull @Override public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
      return new ViewHolder(
          LayoutInflater.from(ShowActivity.this).inflate(R.layout.item_friend, viewGroup, false));
    }

    @SuppressLint("SetTextI18n") @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
      Friend friend = mFriendList.get(i);
      viewHolder.tvBaseInfo.setText(friend.getId() + " " + friend.getName());
      viewHolder.tvLastComment.setText("最近回复：" + friend.getLastComment());
      viewHolder.tvLastLogin.setText("最近登录：" + friend.getLastLogin());
      viewHolder.tvLocation.setText("最近位置：" + friend.getUserLocation());
    }

    @Override public int getItemCount() {
      return mFriendList == null ? 0 : mFriendList.size();
    }
  }

  private static class ViewHolder extends RecyclerView.ViewHolder {

    TextView tvBaseInfo;
    TextView tvLastComment;
    TextView tvLastLogin;
    TextView tvLocation;

    public ViewHolder(@NonNull View itemView) {
      super(itemView);
      tvBaseInfo = itemView.findViewById(R.id.tv_base_info);
      tvLastComment = itemView.findViewById(R.id.tv_last_comment);
      tvLastLogin = itemView.findViewById(R.id.tv_last_login);
      tvLocation = itemView.findViewById(R.id.tv_location);
    }
  }

  @Override public boolean onCreateOptionsMenu(Menu menu) {
    MenuItem item = menu.add(Menu.NONE, Menu.NONE, Menu.NONE, "Token");
    item.setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS);
    return true;
  }

  @Override public boolean onOptionsItemSelected(MenuItem item) {
    if (item.getItemId() == Menu.NONE) {
      copyToken();
      return true;
    }
    return super.onOptionsItemSelected(item);
  }

  private void copyToken() {
    Util.runAsync(new Runnable() {
      @Override public void run() {
        StringBuilder token = new StringBuilder();
        String errMsg = TokenManager.readTokenFromSlowly(token);
        if (TextUtils.isEmpty(token.toString())) {
          Util.toast("error: " + errMsg);
        } else {
          Util.copyToClipboard(TokenManager.packToken(token.toString()));
          Util.toast("Token has been copied");
        }
      }
    });
  }
}
