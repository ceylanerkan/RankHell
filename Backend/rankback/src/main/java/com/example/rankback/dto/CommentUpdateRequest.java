package com.example.rankback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentUpdateRequest(
        @NotBlank(message = "Comment content cannot be empty")
        @Size(max = 500, message = "Comment cannot exceed 500 characters")
        String content
) {
}
