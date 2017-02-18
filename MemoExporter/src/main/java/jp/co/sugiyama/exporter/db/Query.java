package jp.co.sugiyama.exporter.db;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Query {

  /**
   * DBの検索結果を指定の型で返します。<br>
   * クエリ実行後、{@code conn}をクローズします。
   * 
   * @param conn コネクション
   * @param clazz 戻り値の型
   * @param sql 実行SQL
   * @param SQLのパラメータ
   * @return 検索結果のリスト
   */
  public <T> List<T> select(Connection conn, Class<T> clazz, String sql, Object... params) {
    return select(conn, clazz, sql, Arrays.asList(params));
  }

  private <T> List<T> select(Connection conn, Class<T> clazz, String sql, List<Object> params) {
    PreparedStatement stmt = null;
    ResultSet rs = null;
    try {
      stmt = conn.prepareStatement(sql);

      if (params != null) {
        for (int i = 0; i < params.size(); i++) {
          String param = String.valueOf(params.get(i));
          stmt.setString(i + 1, param);
        }
      }

      rs = stmt.executeQuery();

      ResultSetMetaData rsmd = rs.getMetaData();

      List<T> result = new ArrayList<T>();
      Field[] fields = clazz.getFields();
      while (rs.next()) {

        try {

          T instance = clazz.newInstance();

          for (int i = 1; i <= rsmd.getColumnCount(); i++) {

            String key = rsmd.getColumnName(i);
            Object value = rs.getObject(i);
            for (Field field : fields) {
              Column column = field.getAnnotation(Column.class);
              if (key.equals(column.value())) {
                field.set(instance, value);
                continue;
              }
            }
          }
          result.add(instance);
        } catch (IllegalAccessException e) {
        } catch (InstantiationException e) {
        }
      }

      return result;

    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    } finally {
      try {
        conn.close();
        stmt.close();
        rs.close();
      } catch (Exception e) {
      }
    }
  }
}
