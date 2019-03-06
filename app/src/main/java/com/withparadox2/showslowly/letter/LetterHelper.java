package com.withparadox2.showslowly.letter;

import com.withparadox2.showslowly.entity.Letter;
import java.util.List;

public class LetterHelper {
  public static void markLastLetterEarliestOne(List<Letter> list) {
    if (list != null && list.size() > 0) {
      list.get(list.size() - 1).setIsEarliest(true);
    }
  }
}
