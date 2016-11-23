package jp.co.reminder.util;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Jsonを処理するUtilクラスです。<br>
 * 
 * @author daisuke
 */
public class JsonUtil {

  protected JsonUtil() {
  }

  /**
   * オブジェクトをJson文字列に変換します。<br>
   * 
   * @param value 変換対象のオブジェクト
   * @return Json文字列
   */
  public static String toJson(Object value) {
    try {
      return new ObjectMapper().writeValueAsString(value);
    } catch (IOException e) {
      throw new RuntimeException("convert to json error", e.getCause());
    }
  }

  /**
   * Json文字列を指定のオブジェクトに変換します。<br>
   * 
   * @param value Json文字列
   * @param result 戻り値のクラス
   * @return オブジェクト
   */
  public static <T> T fromJson(String value, Class<T> result) {
    try {
      return new ObjectMapper().readValue(value, result);
    } catch (IOException e) {
      throw new RuntimeException("convert from json error", e.getCause());
    }
  }
}
