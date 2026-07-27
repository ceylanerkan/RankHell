package com.example.rankback.controller;

import com.example.rankback.dto.PollItemDTO;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.PollService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Poll_Items join table: the items contained in a single poll. */
@RestController
@RequestMapping("/api/polls/{pollId}/items")
public class PollItemController {

    private final PollService pollService;

    public PollItemController(PollService pollService) {
        this.pollService = pollService;
    }

    @GetMapping
    public List<PollItemDTO> getPollItems(@PathVariable Integer pollId) {
        return pollService.getPollItems(pollId);
    }

    @PostMapping("/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public List<PollItemDTO> addPollItem(
            @PathVariable Integer pollId,
            @PathVariable Integer itemId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return pollService.addPollItem(pollId, itemId, principal.getUser());
    }

    @DeleteMapping("/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public List<PollItemDTO> removePollItem(
            @PathVariable Integer pollId,
            @PathVariable Integer itemId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return pollService.removePollItem(pollId, itemId, principal.getUser());
    }
}
