package jp.co.sugiyama.exporter;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

import jp.co.sugiyama.exporter.data.TFile;
import jp.co.sugiyama.exporter.db.Query;

public class Reader {

  public List<TFile> read(File db) throws SQLException {

    String sql = "SELECT file.id id, cate1.name cate1, cate2.name cate2, file.title, file.url url, file.text text"//
        + " FROM T_FILE file"//
        + " INNER JOIN M_CATEGORY cate1 ON file.category1 = cate1.id"// 
        + " INNER JOIN M_CATEGORY cate2 ON file.category2 = cate2.id";
    Query query = new Query();
    return query.select(getConnection(db), TFile.class, sql);
  }

  private Connection getConnection(File db) {
    final String driver = "jdbc:sqlite:" + db.getAbsolutePath();
    try {
      Class.forName("org.sqlite.JDBC");
      return DriverManager.getConnection(driver);
    } catch (Exception e) {
      throw new RuntimeException(String.format("DB接続に失敗しました。Driver:%s", driver));
    }
  }

}
