package com.withparadox2.showslowly;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.drawable.ShapeDrawable;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.DividerItemDecoration;
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
import com.withparadox2.showslowly.letter.LetterListActivity;
import com.withparadox2.showslowly.map.MapActivity;
import com.withparadox2.showslowly.net.ServiceManager;
import com.withparadox2.showslowly.net.result.FriendListResult;
import com.withparadox2.showslowly.permission.PermissionManager;
import com.withparadox2.showslowly.store.AppDatabase;
import com.withparadox2.showslowly.entity.Location;
import com.withparadox2.showslowly.token.TokenManager;
import com.withparadox2.showslowly.util.DateUtil;
import com.withparadox2.showslowly.util.LocationUtil;
import com.withparadox2.showslowly.util.NetUtil;
import com.withparadox2.showslowly.util.Util;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.Manifest.permission.ACCESS_COARSE_LOCATION;
import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.Manifest.permission.READ_EXTERNAL_STORAGE;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

public class ShowActivity extends BaseActivity {
  private List<Friend> mFriendList = new ArrayList<>();
  private FriendAdapter mAdapter;
  private SwipeRefreshLayout mRefreshLayout;
  private Call<?> mCurrentCall;

  @Override protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setHomeButtonVisible(false);
    PermissionManager.requestPermission(this, new Runnable() {
      @Override public void run() {
        setup();
      }
    }, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE, ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION);
  }

  private void setup() {
    setContentView(R.layout.activity_show);
    RecyclerView recyclerView = findViewById(R.id.rv_list);
    mAdapter = new FriendAdapter();
    recyclerView.setAdapter(mAdapter);
    recyclerView.setLayoutManager(new LinearLayoutManager(this));
    recyclerView.addItemDecoration(createDivider());

    mRefreshLayout = findViewById(R.id.layout_refresh);
    mRefreshLayout.setEnabled(true);
    mRefreshLayout.setColorSchemeResources(R.color.colorPrimary);
    mRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
      @Override public void onRefresh() {
        loadFriends();
      }
    });

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
    if (mCurrentCall != null) {
      mCurrentCall.cancel();
    }
    Call<FriendListResult> call =
        ServiceManager.getSlowlyService().listFriends(TokenManager.getPrefToken());
    call.enqueue(
        new Callback<FriendListResult>() {
          @Override
          public void onResponse(@NonNull Call<FriendListResult> call,
              @NonNull Response<FriendListResult> response) {
            mRefreshLayout.setRefreshing(false);
            if (response.body() != null) {
              mFriendList = response.body().getFriendList();
              updateFriendList();
              updateLocation(new Runnable() {
                @Override public void run() {
                  mAdapter.notifyDataSetChanged();
                }
              });
              mAdapter.notifyDataSetChanged();
            } else {
              NetUtil.handleError(response.errorBody());
            }
          }

          @Override public void onFailure(@NonNull Call<FriendListResult> call, @NonNull Throwable t) {
            mRefreshLayout.setRefreshing(false);
            Util.toast("error " + t.getMessage());
          }
        });
    mCurrentCall = call;
    mRefreshLayout.setRefreshing(true);
  }

  private void updateFriendList() {
    for (Friend friend : mFriendList) {
      friend.parseLocation();
      friend.setLastComment(addHour(friend.getLastComment(), 8));
      friend.setLastLogin(addHour(friend.getLastLogin(), 8));
    }
  }

  private void updateLocation(final Runnable invalidateAction) {
    Util.runAsync(new Runnable() {
      @Override public void run() {
        for (Friend friend : mFriendList) {
          Location oldOne =
              AppDatabase.instance().locationDao().getLocationByUserId(friend.getId());

          Location newOne = new Location().setUserId(friend.getId())
              .setLat(friend.getLatitude())
              .setLng(friend.getLongitude())
              .setDateTime(friend.getLastComment());

          if (oldOne != null) {
            if (LocationUtil.distance(oldOne, newOne) < 500) {
              continue;
            } else {
              friend.setLocationChanged(true);
            }
          }

          AppDatabase.instance().locationDao().insert(newOne);
        }

        Util.post(invalidateAction);
      }
    });
  }

  private String addHour(String dateInput, int hoursToAdd) {
    if (dateInput == null) {
      return null;
    }
    Date date = DateUtil.parseDate(dateInput);
    if (date == null) {
      return dateInput;
    }
    return DateUtil.formatDate(date.getTime() + TimeUnit.HOURS.toMillis(hoursToAdd));
  }

  private DividerItemDecoration createDivider() {
    DividerItemDecoration divider = new
        DividerItemDecoration(this, DividerItemDecoration.VERTICAL);
    ShapeDrawable drawable = new ShapeDrawable();
    drawable.setIntrinsicHeight(1);
    divider.setDrawable(drawable);
    return divider;
  }

  private class FriendAdapter extends RecyclerView.Adapter<ViewHolder> {

    @NonNull @Override public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
      return new ViewHolder(
          LayoutInflater.from(ShowActivity.this).inflate(R.layout.item_friend, viewGroup, false));
    }

    @SuppressLint("SetTextI18n") @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, final int i) {
      final Friend friend = mFriendList.get(i);
      viewHolder.tvBaseInfo.setText(friend.getId() + " " + friend.getName());
      viewHolder.tvLastComment.setText("最近回复：" + friend.getLastComment());
      viewHolder.tvLastLogin.setText(
          "最近登录：" + (friend.getLastLogin() == null ? "" : friend.getLastLogin()));
      viewHolder.tvLocation.setText("最近位置：" + friend.getUserLocation());
      if (friend.isLocationChanged()) {
        viewHolder.tvLocation.setTextColor(getResources().getColor(R.color.colorAccent));
      } else {
        viewHolder.tvLocation.setTextColor(viewHolder.tvLastComment.getCurrentTextColor());
      }
      viewHolder.itemView.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
          Intent intent = new Intent(ShowActivity.this, MapActivity.class);
          intent.putExtra("friend", friend);
          startActivity(intent);
        }
      });
      viewHolder.itemView.setOnLongClickListener(new View.OnLongClickListener() {
        @Override public boolean onLongClick(View v) {
          Intent intent = new Intent(ShowActivity.this, LetterListActivity.class);
          intent.putExtra("friend", friend);
          startActivity(intent);
          return true;
        }
      });
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

    ViewHolder(@NonNull View itemView) {
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
