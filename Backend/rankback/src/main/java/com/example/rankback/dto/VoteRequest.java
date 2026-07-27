package com.example.rankback.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record VoteRequest(
        @NotNull(message = "Vote value cannot be null")
        @Min(value = -1, message = "Vote value must be -1 or 1")
        @Max(value = 1, message = "Vote value must be -1 or 1")
        Byte value
) {
}
