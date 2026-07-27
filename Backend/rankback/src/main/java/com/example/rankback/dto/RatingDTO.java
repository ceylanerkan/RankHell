package com.example.rankback.dto;

import java.time.LocalDateTime;

public record RatingDTO(
        Integer ratingId,
        Integer itemId,
        Integer userId,
        String username,
        Byte score,
        LocalDateTime createdAt
) {
}
