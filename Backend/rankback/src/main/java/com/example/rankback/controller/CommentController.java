package com.example.rankback.controller;

import com.example.rankback.dto.CommentDTO;
import com.example.rankback.dto.CommentUpdateRequest;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{commentId}")
    public CommentDTO getComment(@PathVariable Integer commentId) {
        return commentService.getComment(commentId);
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public CommentDTO updateComment(
            @PathVariable Integer commentId,
            @Valid @RequestBody CommentUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return commentService.updateComment(commentId, request.content(), principal.getUser());
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Integer commentId,
            @AuthenticationPrincipal UserPrincipal principal) {
        commentService.deleteComment(commentId, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
