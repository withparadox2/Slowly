package com.withparadox2.showslowly.letter;

interface IDataCallback {
  void onServerDataLoaded(boolean isRefresh);
  void onLocalDataLoaded();

  void onError(String message);
}
