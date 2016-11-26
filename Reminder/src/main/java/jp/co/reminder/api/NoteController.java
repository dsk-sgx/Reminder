package jp.co.reminder.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jp.co.reminder.domain.entity.TNote;
import jp.co.reminder.service.NoteService;

/**
 * ノートのコントローラクラスです。<br>
 * 
 * @author daisuke
 */
@ResponseBody
@RestController
@RequestMapping("/Reminder/notes")
public class NoteController {

  @Autowired
  NoteService service;

  /**
   * ノートを検索します。<br>
   * リクエストパラメータが存在する場合のみ、検索条件として使用します。<br>
   * 
   * @param keyword 検索キーワード
   * @param tag 検索対象のタグ
   * @return 検索結果<br>
   *         存在しない場合は空のリスト
   */
  @RequestMapping(method = RequestMethod.GET)
  public List<TNote> find(@ModelAttribute("keyword") String keyword, @ModelAttribute("tag") String tag) {
    if (StringUtils.isEmpty(keyword)) {
      return service.findAll();
    }
    return service.findByKeyword(keyword);
  }

  /**
   * noteIdを条件に検索します。<br>
   * 
   * @param noteId
   * @return
   */
  @RequestMapping(path = "/{noteId}", method = RequestMethod.GET)
  public TNote detail(@PathVariable Integer noteId) {
    return service.findById(noteId);
  }

  /**
   * ノートを登録、もしくは更新します。<br>
   * 
   * @param note
   * @return 更新結果
   */
  @RequestMapping(method = RequestMethod.POST)
  public TNote update(@RequestBody TNote note) {
    service.update(note);
    return note;
  }

  /**
   * noteIdをもつノートを削除します。<br>
   * 
   * @param noteId
   * @return
   */
  @RequestMapping(path = "/{noteId}", method = RequestMethod.DELETE)
  public boolean delete(@PathVariable Integer noteId) {
    service.delete(noteId);
    return true;
  }
}
