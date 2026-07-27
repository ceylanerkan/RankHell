package com.example.rankback.controller;

import com.example.rankback.dto.PollDTO;
import com.example.rankback.dto.PollRequest;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.PollService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/polls")
public class CustomPollController {

    private final PollService pollService;

    public CustomPollController(PollService pollService) {
        this.pollService = pollService;
    }

    @GetMapping
    public List<PollDTO> getPolls(
            @RequestParam(required = false) Integer creatorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return pollService.getPolls(creatorId, page, size);
    }

    @GetMapping("/{pollId}")
    public PollDTO getPoll(@PathVariable Integer pollId) {
        return pollService.getPoll(pollId);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PollDTO> createPoll(
            @Valid @RequestBody PollRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        PollDTO created = pollService.createPoll(request, principal.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{pollId}")
    @PreAuthorize("isAuthenticated()")
    public PollDTO updatePoll(
            @PathVariable Integer pollId,
            @Valid @RequestBody PollRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return pollService.updatePoll(pollId, request, principal.getUser());
    }

    @DeleteMapping("/{pollId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deletePoll(
            @PathVariable Integer pollId,
            @AuthenticationPrincipal UserPrincipal principal) {
        pollService.deletePoll(pollId, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
