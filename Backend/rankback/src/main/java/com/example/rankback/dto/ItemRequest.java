package com.example.rankback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ItemRequest(
        @NotBlank(message = "Item name cannot be empty")
        @Size(min = 2, max = 255, message = "Item name must be between 2 and 255 characters")
        String name,

        String description,

        @Size(max = 500, message = "Image URL cannot exceed 500 characters")
        String imageUrl,

        /** Optional; replaces the item's category links when provided. */
        List<Integer> categoryIds
) {
}
