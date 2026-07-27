package com.example.rankback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank(message = "Comment content cannot be empty")
        @Size(max = 500, message = "Comment cannot exceed 500 characters")
        String content,

        /** Null for a top level comment, otherwise the comment being replied to. */
        Integer parentCommentId
) {
}
