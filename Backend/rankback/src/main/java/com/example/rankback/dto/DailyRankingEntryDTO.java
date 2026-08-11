package com.example.rankback.dto;

/**
 * Gunun siralamasinda tek satir.
 *
 * delta: dune gore kac sira yukseldi (pozitif) veya dustu (negatif).
 * Dun hic siralamaya girmemisse null -- arayuz bunu "yeni" rozetine cevirir.
 */
public record DailyRankingEntryDTO(
        Integer itemId,
        String itemName,
        String itemImageUrl,
        long votesToday,
        Integer delta) {
}
