package com.example.rankback.dto;

public record VoteSummaryDTO(
        Integer itemId,
        long upvotes,
        long downvotes,
        long score,
        /** The caller's own vote, or null when anonymous / not voted yet. */
        Byte myVote
) {
}
