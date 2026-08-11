package com.example.rankback.dto;

import java.time.LocalDateTime;

/** Duello kunyesi. itemA/itemB, arayuzun bekledigi gibi ic ice gonderilir. */
public record DuelDTO(
        Integer duelId,
        String title,
        DuelSideDTO itemA,
        DuelSideDTO itemB,
        int votesA,
        int votesB,
        Integer creatorId,
        String creatorUsername,
        LocalDateTime createdAt) {
}
