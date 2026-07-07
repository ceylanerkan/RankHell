package com.example.rankback.repository;

import com.example.rankback.entity.CustomPoll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomPollRepository extends JpaRepository<CustomPoll, Integer> {
}
