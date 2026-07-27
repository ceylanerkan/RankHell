package com.example.rankback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TagRequest(
        @NotBlank(message = "Tag name cannot be empty")
        @Size(min = 2, max = 50, message = "Tag name must be between 2 and 50 characters")
        String name
) {
}
