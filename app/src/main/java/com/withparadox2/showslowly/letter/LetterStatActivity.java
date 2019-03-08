package com.withparadox2.showslowly.letter;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.widget.TextView;
import com.withparadox2.showslowly.BaseActivity;
import com.withparadox2.showslowly.R;
import com.withparadox2.showslowly.entity.Friend;
import com.withparadox2.showslowly.entity.Letter;
import com.withparadox2.showslowly.store.AppDatabase;
import java.util.List;

public class LetterStatActivity extends BaseActivity {

  @Override protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Friend friend = (Friend) getIntent().getSerializableExtra("friend");

    setContentView(R.layout.activity_stat);
    TextView tvContent = findViewById(R.id.tv_content);

    List<Letter> list = AppDatabase.instance().letterDao().getLetterList(friend.getId());

    StringBuilder sb = new StringBuilder();
    int fromCount = 0;
    int toCount = 0;
    int fromWordCount = 0;
    int toWordCount = 0;
    for (Letter letter : list) {
      if (letter.getUserFrom().equals(friend.getUserId())) {
        fromCount++;
        fromWordCount += letter.getBody().length();
      } else {
        toCount++;
        toWordCount += letter.getBody().length();
      }
    }

    sb.append(friend.getName() + "\n")
        .append("from letter count:" + fromCount + "\n")
        .append("to letter count:" +toCount + "\n")

        .append("from letter word count:" + fromWordCount + "\n")
        .append("to letter word count:" +toWordCount + "\n");

    tvContent.setText(sb.toString());
  }


}
