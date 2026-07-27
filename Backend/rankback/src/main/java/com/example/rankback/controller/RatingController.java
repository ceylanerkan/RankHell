package com.example.rankback.controller;

import com.example.rankback.dto.RatingDTO;
import com.example.rankback.dto.RatingRequest;
import com.example.rankback.dto.RatingSummaryDTO;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Ratings: 1-5 star scores of a single item. */
@RestController
@RequestMapping("/api/items/{itemId}/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping
    public List<RatingDTO> getItemRatings(
            @PathVariable Integer itemId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ratingService.getItemRatings(itemId, page, size);
    }

    @GetMapping("/summary")
    public RatingSummaryDTO getSummary(
            @PathVariable Integer itemId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Integer currentUserId = principal == null ? null : principal.getUser().getUserId();
        return ratingService.getSummary(itemId, currentUserId);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public RatingDTO getMyRating(@PathVariable Integer itemId, @AuthenticationPrincipal UserPrincipal principal) {
        return ratingService.getMyRating(itemId, principal.getUser().getUserId());
    }

    /** Idempotent upsert: one rating per user per item. */
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public RatingSummaryDTO rate(
            @PathVariable Integer itemId,
            @Valid @RequestBody RatingRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ratingService.rate(itemId, request.score(), principal.getUser());
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public RatingSummaryDTO deleteRating(@PathVariable Integer itemId, @AuthenticationPrincipal UserPrincipal principal) {
        return ratingService.deleteRating(itemId, principal.getUser());
    }
}
