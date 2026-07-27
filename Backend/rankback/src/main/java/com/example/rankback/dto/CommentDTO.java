package com.example.rankback.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CommentDTO(
        Integer commentId,
        Integer itemId,
        Integer userId,
        String username,
        String content,
        LocalDateTime createdAt,
        Integer parentCommentId,
        List<CommentDTO> replies
) {
}
