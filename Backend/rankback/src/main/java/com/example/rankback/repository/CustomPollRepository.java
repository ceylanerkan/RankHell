package com.example.rankback.repository;

import com.example.rankback.entity.CustomPoll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomPollRepository extends JpaRepository<CustomPoll, Integer> {

    @Override
    @EntityGraph(attributePaths = "creator")
    Page<CustomPoll> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "creator")
    Page<CustomPoll> findByCreator_UserId(Integer creatorId, Pageable pageable);
}
