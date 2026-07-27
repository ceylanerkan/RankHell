package com.example.rankback.dto;

import java.time.LocalDateTime;

/** Public profile; safe to expose to any authenticated caller. */
public record UserSummaryDTO(
        Integer userId,
        String username,
        LocalDateTime createdAt
) {
}
