package com.example.rankback.dto;

import java.math.BigDecimal;
import java.util.List;

public record ItemDTO(
        Integer itemId,
        String name,
        String description,
        String imageUrl,
        BigDecimal globalScore,
        Integer totalVotes,
        List<CategoryDTO> categories
) {
}
