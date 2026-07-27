package com.example.rankback.dto;

import java.math.BigDecimal;

public record RatingSummaryDTO(
        Integer itemId,
        BigDecimal averageScore,
        long ratingCount,
        /** The caller's own score, or null when anonymous / not rated yet. */
        Byte myScore
) {
}
