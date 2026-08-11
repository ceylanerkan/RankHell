package com.example.rankback.repository;

import com.example.rankback.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {

    /**
     * Checks if a rating already exists for a given user and item.
     * Backs up the SQL UNIQUE constraint to fail gracefully at the application layer.
     */
    boolean existsByUser_UserIdAndItem_ItemId(Integer userId, Integer itemId);

    Optional<Rating> findByUser_UserIdAndItem_ItemId(Integer userId, Integer itemId);

    @EntityGraph(attributePaths = "user")
    Page<Rating> findByItem_ItemId(Integer itemId, Pageable pageable);

    /** Profil sayfasindaki "Verdigim Oylar" listesi; item da tek sorguda gelir. */
    @EntityGraph(attributePaths = "item")
    Page<Rating> findByUser_UserId(Integer userId, Pageable pageable);

    long countByItem_ItemId(Integer itemId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.item.itemId = :itemId")
    Double findAverageScoreByItemId(@Param("itemId") Integer itemId);
}
