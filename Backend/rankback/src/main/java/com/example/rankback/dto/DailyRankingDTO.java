package com.example.rankback.dto;

import java.time.LocalDate;
import java.util.List;

/** Gunun siralamasi: hangi gun, ve o gun en cok oy toplayan item'lar. */
public record DailyRankingDTO(
        LocalDate date,
        String title,
        List<DailyRankingEntryDTO> entries) {
}
