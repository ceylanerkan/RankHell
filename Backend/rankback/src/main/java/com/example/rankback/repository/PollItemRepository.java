package com.example.rankback.repository;

import com.example.rankback.entity.PollItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PollItemRepository extends JpaRepository<PollItem, Integer> {
}
