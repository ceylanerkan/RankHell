package com.example.rankback.repository;

import com.example.rankback.entity.ItemComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemCommentRepository extends JpaRepository<ItemComment, Integer> {

    /**
     * Top level comments only; replies are fetched separately and nested in the service.
     */
    @EntityGraph(attributePaths = "user")
    Page<ItemComment> findByItem_ItemIdAndParentCommentIsNull(Integer itemId, Pageable pageable);

    @EntityGraph(attributePaths = "user")
    List<ItemComment> findByParentComment_CommentIdInOrderByCreatedAtAsc(List<Integer> parentCommentIds);

    @EntityGraph(attributePaths = "user")
    Page<ItemComment> findByUser_UserId(Integer userId, Pageable pageable);

    long countByItem_ItemId(Integer itemId);
}
