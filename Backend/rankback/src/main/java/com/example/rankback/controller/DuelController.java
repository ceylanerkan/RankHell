package com.example.rankback.controller;

import com.example.rankback.dto.DuelDTO;
import com.example.rankback.dto.DuelRequest;
import com.example.rankback.dto.DuelVoteRequest;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.DuelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Duellolar. Okuma ve oylama herkese acik (bkz. SecurityConfig), duello
 * olusturmak ve silmek giris ister.
 */
@RestController
@RequestMapping("/api/duels")
public class DuelController {

    private final DuelService duelService;

    public DuelController(DuelService duelService) {
        this.duelService = duelService;
    }

    @GetMapping
    public List<DuelDTO> getDuels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return duelService.getDuels(page, size);
    }

    @GetMapping("/{duelId}")
    public DuelDTO getDuel(@PathVariable Integer duelId) {
        return duelService.getDuel(duelId);
    }

    @PostMapping("/{duelId}/votes")
    public DuelDTO vote(@PathVariable Integer duelId, @Valid @RequestBody DuelVoteRequest request) {
        return duelService.vote(duelId, request.side());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DuelDTO> createDuel(
            @Valid @RequestBody DuelRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        DuelDTO created = duelService.createDuel(request, principal.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{duelId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteDuel(
            @PathVariable Integer duelId,
            @AuthenticationPrincipal UserPrincipal principal) {
        duelService.deleteDuel(duelId, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
