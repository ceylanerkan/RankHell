package com.example.rankback.controller;

import com.example.rankback.dto.DailyRankingDTO;
import com.example.rankback.service.DailyRankingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Gunun siralamasi. Herkese acik: anasayfada giris yapmadan gorunur. */
@RestController
@RequestMapping("/api/ranking")
public class DailyRankingController {

    private final DailyRankingService dailyRankingService;

    public DailyRankingController(DailyRankingService dailyRankingService) {
        this.dailyRankingService = dailyRankingService;
    }

    @GetMapping("/daily")
    public DailyRankingDTO getDailyRanking(@RequestParam(defaultValue = "5") int limit) {
        return dailyRankingService.getDailyRanking(limit);
    }
}
