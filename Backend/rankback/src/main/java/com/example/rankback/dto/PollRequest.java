package com.example.rankback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PollRequest(
        @NotBlank(message = "Title cannot be empty")
        @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
        String title,

        /** Optional; replaces the poll's items when provided. */
        List<Integer> itemIds
) {
}
