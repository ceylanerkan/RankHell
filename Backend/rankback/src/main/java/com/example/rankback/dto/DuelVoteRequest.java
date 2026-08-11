package com.example.rankback.dto;

import jakarta.validation.constraints.Pattern;

/** Oy verilen taraf. Arayuz "A" veya "B" gonderir. */
public record DuelVoteRequest(
        @Pattern(regexp = "[AB]", message = "Side must be A or B")
        String side) {
}
