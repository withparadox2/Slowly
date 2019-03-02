package com.withparadox2.showslowly.store;

import android.arch.persistence.room.Database;
import android.arch.persistence.room.Room;
import android.arch.persistence.room.RoomDatabase;
import com.withparadox2.showslowly.App;
import com.withparadox2.showslowly.entity.Location;

@Database(entities = { Location.class }, version = 1)
public abstract class AppDatabase extends RoomDatabase {
  public abstract LocationDao locationDao();

  private static AppDatabase sDatabase;

  public static AppDatabase instance() {
    if (sDatabase == null) {
      synchronized (AppDatabase.class) {
        if (sDatabase == null) {
          sDatabase = Room.databaseBuilder(App.instance, AppDatabase.class, "showslowly.db")
              .allowMainThreadQueries()
              .build();
        }
      }
    }
    return sDatabase;
  }
}
