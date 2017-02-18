package jp.co.sugiyama.exporter.data;

import jp.co.sugiyama.exporter.db.Column;

/**
 * メモアプリのレコード
 * 
 * @author daisuke
 */
public class TFile {

  @Column("id")
  public int id;

  @Column("cate1")
  public String category1;

  @Column("cate2")
  public String category2;

  @Column("title")
  public String title;

  @Column("url")
  public String url;

  @Column("text")
  public String text;
}
