package jp.co.sugiyama.exporter.data;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;

/**
 * ReminderClientのレコード
 * 
 * @author daisuke
 */
@Getter
public class TNote {

  private int id;

  private String title;

  private List<String> tags = new ArrayList<>();

  private String text;

  public TNote(TFile src) {
    id = src.id;
    title = src.title;
    if (src.category1 != null) {
      tags.add(src.category1);
    }
    if (src.category2 != null) {
      tags.add(src.category2);
    }
    text = src.text;
  }
}
