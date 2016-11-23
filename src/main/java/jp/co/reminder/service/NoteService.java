package jp.co.reminder.service;

import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.reminder.domain.entity.TNote;
import jp.co.reminder.domain.repository.TNoteRepository;

/**
 * ノートのサービスクラスです。<br>
 * 
 * @author daisuke
 */
@Service
@Transactional
public class NoteService {

  @Autowired
  EntityManager em;

  @Autowired
  TNoteRepository repository;

  /**
   * ノートを全件検索します。<br>
   * 
   * @return 検索結果
   */
  public List<TNote> findAll() {
    return repository.findAll();
  }

  /**
   * keywordの部分一致でnoteを検索します。<br>
   * 
   * @param keyword 検索文字列
   * @return
   */
  public List<TNote> findByKeyword(String keyword) {
    return repository.findByKeyword("%" + keyword + "%");
  }

  /**
   * タグを条件に検索します。<br>
   * 
   * @param tag 検索タグ
   * @return
   */
  public List<TNote> findByTag(String tag) {
    return repository.findByTag("%" + tag + ",");
  }

  /**
   * noteIdを条件に検索します。<br>
   * 
   * @param noteId
   * @return
   */
  public TNote findById(Integer noteId) {
    return repository.findOne(noteId);
  }

  /**
   * ノートを登録or更新します。<br>
   * 
   * @param note
   * @return
   */
  public TNote update(TNote note) {
    return repository.save(note);
  }

  /**
   * ノートを物理削除します。<br>
   * 
   * @param id
   */
  public void delete(Integer id) {
    repository.delete(id);
  }
}
