package com.example.rankback.dto;

import java.time.LocalDateTime;

public record PollCommentDTO(
        Integer commentId,
        Integer userId,
        String username,
        String body,
        /** Yorumla birlikte verilen puan; null olabilir. */
        Byte score,
        LocalDateTime createdAt
) {
}
