package com.example.rankback.dto;

import java.time.LocalDateTime;

public record VoteDTO(
        Integer voteId,
        Integer itemId,
        Integer userId,
        Byte value,
        LocalDateTime createdAt
) {
}
