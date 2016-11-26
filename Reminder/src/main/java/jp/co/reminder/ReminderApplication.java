package jp.co.reminder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@EnableWebSocket
@SpringBootApplication
public class ReminderApplication {

  public static void main(String[] args) {
    SpringApplication.run(ReminderApplication.class, args);
  }
}
