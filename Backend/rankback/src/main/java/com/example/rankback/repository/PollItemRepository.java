package com.example.rankback.repository;

import com.example.rankback.entity.PollItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PollItemRepository extends JpaRepository<PollItem, Integer> {

    @EntityGraph(attributePaths = "item")
    List<PollItem> findByPoll_PollId(Integer pollId);

    @EntityGraph(attributePaths = "item")
    List<PollItem> findByPoll_PollIdIn(List<Integer> pollIds);

    Optional<PollItem> findByPoll_PollIdAndItem_ItemId(Integer pollId, Integer itemId);

    boolean existsByPoll_PollIdAndItem_ItemId(Integer pollId, Integer itemId);
}
