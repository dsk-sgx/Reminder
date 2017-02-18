package jp.co.sugiyama.exporter;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

import org.codehaus.jackson.map.ObjectMapper;

import jp.co.sugiyama.exporter.data.TFile;
import jp.co.sugiyama.exporter.data.TNote;

public class Exporter {

  /**
   * メモアプリのDB情報をReminderのファイル形式に変換します。
   * 
   * @param args[0] DBファイルパス
   * @throws FileNotFoundException DBファイルが存在しない場合
   * @throws SQLException データベース操作でエラーが発生した場合
   * @throws IOException Json変換でエラーが発生した場合
   */
  public static void main(String[] args) throws FileNotFoundException, SQLException, IOException {
    if (args.length != 1) {
      throw new IllegalArgumentException("Usage java jp.co.sugiyama.exporter.Exporter > outfile");
    }
    File db = new File(args[0]);
    if (!db.exists()) {
      throw new FileNotFoundException();
    }

    List<TFile> src = new Reader().read(db);
    List<TNote> dest = src.stream().map(file -> new TNote(file)).collect(Collectors.toList());
    String json = new ObjectMapper().writeValueAsString(dest);
    System.out.println(json);
  }

}
