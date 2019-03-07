package com.withparadox2.showslowly.map;

import android.os.Bundle;
import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.model.LatLng;
import com.withparadox2.showslowly.BaseActivity;
import com.withparadox2.showslowly.R;
import com.withparadox2.showslowly.entity.Friend;
import com.withparadox2.showslowly.util.LocationUtil;

public class MapActivity extends BaseActivity {
  private MapView mMapView = null;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Friend friend = (Friend) getIntent().getSerializableExtra("friend");
    setContentView(R.layout.activity_map);
    mMapView = findViewById(R.id.bmapView);

    if (friend != null) {
      MapStatus.Builder builder = new MapStatus.Builder();
      double[] ll = LocationUtil.wgs2bd(friend.getLatitude(), friend.getLongitude());
      LatLng point = new LatLng(ll[0], ll[1]);
      builder.target(point).zoom(18.0f);
      mMapView.getMap().animateMapStatus(MapStatusUpdateFactory.newMapStatus(builder.build()));

      BitmapDescriptor bitmap = BitmapDescriptorFactory
          .fromResource(R.drawable.icon_location);
      OverlayOptions option = new MarkerOptions()
          .position(point)
          .icon(bitmap);
      mMapView.getMap().addOverlay(option);
    }
  }

  @Override
  protected void onResume() {
    super.onResume();
    mMapView.onResume();
  }

  @Override
  protected void onPause() {
    super.onPause();
    mMapView.onPause();
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    mMapView.onDestroy();
  }
}
