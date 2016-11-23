package jp.co.reminder;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * アプリケーション共通の設定クラスです。<br>
 * 
 * @author daisuke
 */
@Configuration
public class Configure {

  @Value("${spring.datasource.url}")
  String dataSourceUrl;

  @Value("${spring.datasource.driver-class-name}")
  String driver;

  @Bean
  public DataSource dataSource() {
    DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
    dataSourceBuilder.driverClassName(driver);
    dataSourceBuilder.url(dataSourceUrl);
    return dataSourceBuilder.build();
  }
}
