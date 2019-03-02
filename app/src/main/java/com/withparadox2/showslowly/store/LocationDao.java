package com.withparadox2.showslowly.store;

import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Delete;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;
import android.arch.persistence.room.Update;
import java.util.List;

@Dao
public interface LocationDao {
  @Query("select * from location")
  public List<Location> getAll();

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  public void insert(Location location);

  @Update
  public void update(Location location);

  @Delete
  public void delete(Location location);

  @Query("select * from location where user_id = :userId order by date_time desc")
  public Location getLocationByUserId(String userId);
}
