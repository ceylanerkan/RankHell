package com.example.rankback.dto;

public record PollItemDTO(
        Integer id,
        Integer itemId,
        String name,
        String imageUrl
) {
}
