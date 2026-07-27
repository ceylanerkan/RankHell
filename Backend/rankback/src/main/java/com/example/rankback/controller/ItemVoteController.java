package com.example.rankback.controller;

import com.example.rankback.dto.VoteDTO;
import com.example.rankback.dto.VoteRequest;
import com.example.rankback.dto.VoteSummaryDTO;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.VoteService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Item_Votes: up/down votes of a single item. */
@RestController
@RequestMapping("/api/items/{itemId}/votes")
public class ItemVoteController {

    private final VoteService voteService;

    public ItemVoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @GetMapping
    public VoteSummaryDTO getVoteSummary(
            @PathVariable Integer itemId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Integer currentUserId = principal == null ? null : principal.getUser().getUserId();
        return voteService.getSummary(itemId, currentUserId);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public VoteDTO getMyVote(@PathVariable Integer itemId, @AuthenticationPrincipal UserPrincipal principal) {
        return voteService.getMyVote(itemId, principal.getUser().getUserId());
    }

    /** Idempotent upsert: casting again with a different value flips the vote. */
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public VoteSummaryDTO castVote(
            @PathVariable Integer itemId,
            @Valid @RequestBody VoteRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return voteService.castVote(itemId, request.value(), principal.getUser());
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public VoteSummaryDTO removeVote(@PathVariable Integer itemId, @AuthenticationPrincipal UserPrincipal principal) {
        return voteService.removeVote(itemId, principal.getUser());
    }
}
