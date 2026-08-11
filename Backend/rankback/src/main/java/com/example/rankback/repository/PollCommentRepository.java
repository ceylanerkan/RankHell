package com.example.rankback.repository;

import com.example.rankback.entity.PollComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollCommentRepository extends JpaRepository<PollComment, Integer> {

    /** Yorumu yazan kullanici da tek sorguda gelir (aksi halde satir basina bir sorgu). */
    @EntityGraph(attributePaths = "user")
    List<PollComment> findByPoll_PollIdOrderByCreatedAtDesc(Integer pollId);
}
