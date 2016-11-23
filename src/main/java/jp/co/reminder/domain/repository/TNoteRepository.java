package jp.co.reminder.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jp.co.reminder.domain.entity.TNote;

@Repository
public interface TNoteRepository extends JpaRepository<TNote, Integer> {

  @Query("SELECT note FROM TNote note"
      + " WHERE UPPER(note.title) LIKE ?1"
      + " OR UPPER(note.text) LIKE ?1"
      + " OR UPPER(note.tags) LIKE ?1")
  List<TNote> findByKeyword(String keyword);

  @Query("SELECT note FROM TNote note WHERE UPPER(note.tags) LIKE ?1")
  List<TNote> findByTag(String keyword);
}
