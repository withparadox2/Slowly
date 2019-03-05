package com.withparadox2.showslowly.store;

import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Delete;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;
import android.arch.persistence.room.Update;
import com.withparadox2.showslowly.entity.Letter;
import java.util.List;

@Dao
public interface LetterDao {
  @Query("select * from letter")
  public List<Letter> getAll();

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  public void insert(Letter letter);

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  public void insert(List<Letter> letterList);

  @Update
  public void update(Letter letter);

  @Delete
  public void delete(Letter letter);

  @Query("delete from letter")
  void clear();

  @Query("select * from letter where user_from = :userId order by letter_id asc")
  public List<Letter> getLetterList(String userId);
}
