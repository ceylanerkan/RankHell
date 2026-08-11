package com.example.rankback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Duello olusturma/guncelleme istegi. Oy sayilari disarida: onlar oylamayla degisir. */
public record DuelRequest(
        @NotBlank(message = "Title cannot be empty")
        @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
        String title,

        @NotNull(message = "itemAId is required")
        Integer itemAId,

        @NotNull(message = "itemBId is required")
        Integer itemBId) {
}
