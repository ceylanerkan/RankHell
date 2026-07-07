package com.example.rankback.repository;

import com.example.rankback.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    
    /**
     * Checks if a rating already exists for a given user and item.
     * Backs up the SQL UNIQUE constraint to fail gracefully at the application layer.
     */
    boolean existsByUser_UserIdAndItem_ItemId(Integer userId, Integer itemId);
}
