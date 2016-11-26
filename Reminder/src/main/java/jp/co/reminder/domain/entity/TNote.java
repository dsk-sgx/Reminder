package jp.co.reminder.domain.entity;

import java.util.Collections;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.util.StringUtils;

import jp.co.reminder.util.JsonUtil;
import lombok.Data;

@Data
@Entity
@Table(name = "t_note")
public class TNote {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "note_id", unique = true, nullable = false)
  private Integer noteId;

  @Column(name = "title")
  private String title;

  @Column(name = "text")
  private String text;

  @Column(name = "tags")
  private String tags;

  /**
   * @param tags
   */
  public void setTags(List<String> tags) {
    this.tags = JsonUtil.toJson(tags);
  }

  public List<String> getTags() {
    if (StringUtils.isEmpty(tags)) {
      return Collections.emptyList();
    }
    return JsonUtil.fromJson(this.tags, List.class);
  }
}
