package com.example.rankback.repository;

import com.example.rankback.entity.ItemVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemVoteRepository extends JpaRepository<ItemVote, Integer> {

    Optional<ItemVote> findByUser_UserIdAndItem_ItemId(Integer userId, Integer itemId);

    long countByItem_ItemIdAndVoteValue(Integer itemId, Byte voteValue);
}
