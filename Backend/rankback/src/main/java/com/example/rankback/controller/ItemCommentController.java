package com.example.rankback.controller;

import com.example.rankback.dto.CommentDTO;
import com.example.rankback.dto.CommentRequest;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Item_Comments of a single item; single-comment operations live in CommentController. */
@RestController
@RequestMapping("/api/items/{itemId}/comments")
public class ItemCommentController {

    private final CommentService commentService;

    public ItemCommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<CommentDTO> getItemComments(
            @PathVariable Integer itemId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return commentService.getItemComments(itemId, page, size);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Integer itemId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        CommentDTO created = commentService.createComment(itemId, request, principal.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
