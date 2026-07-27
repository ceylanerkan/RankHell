package com.example.rankback.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PollDTO(
        Integer pollId,
        String title,
        Integer creatorId,
        String creatorUsername,
        LocalDateTime createdAt,
        List<PollItemDTO> items
) {
}
