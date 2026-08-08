package com.example.rankback.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Anket kunyesi.
 *
 * <p>comments yalnizca tek anket cekilirken (detay) doldurulur; liste
 * uctan noktasinda bos gelir, cunku liste ekrani yorumlari gostermez ve
 * her anket icin ayri sorgu atmak gereksiz olurdu.
 */
public record PollDTO(
        Integer pollId,
        String title,
        String description,
        String coverUrl,
        CategoryDTO category,
        boolean featured,
        List<String> modes,
        BigDecimal globalScore,
        Integer totalRatings,
        Integer playCount,
        Integer creatorId,
        String creatorUsername,
        LocalDateTime createdAt,
        List<PollItemDTO> items,
        List<PollCommentDTO> comments
) {
}
