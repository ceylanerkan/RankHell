package com.example.rankback.controller;

import com.example.rankback.dto.CommentDTO;
import com.example.rankback.dto.RoleUpdateRequest;
import com.example.rankback.dto.UserDTO;
import com.example.rankback.dto.UserSummaryDTO;
import com.example.rankback.dto.UserRatingDTO;
import com.example.rankback.dto.UserUpdateRequest;
import com.example.rankback.entity.Role;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.CommentService;
import com.example.rankback.service.RatingService;
import com.example.rankback.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final CommentService commentService;
    private final RatingService ratingService;

    public UserController(UserService userService, CommentService commentService, RatingService ratingService) {
        this.userService = userService;
        this.commentService = commentService;
        this.ratingService = ratingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return userService.getUsers(page, size);
    }

    /** The Role enum, so the frontend does not have to hardcode the values. */
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public List<String> getRoles() {
        return Arrays.stream(Role.values()).map(Role::name).toList();
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserDTO getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return userService.getUserDetail(principal.getUser().getUserId(), principal.getUser());
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserDTO updateCurrentUser(
            @Valid @RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return userService.updateUser(principal.getUser().getUserId(), request, principal.getUser());
    }

    /** Public profile of any user. */
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public UserSummaryDTO getUser(@PathVariable Integer userId) {
        return userService.getPublicProfile(userId);
    }

    /** Full profile; owner or admin only. */
    @GetMapping("/{userId}/detail")
    @PreAuthorize("isAuthenticated()")
    public UserDTO getUserDetail(@PathVariable Integer userId, @AuthenticationPrincipal UserPrincipal principal) {
        return userService.getUserDetail(userId, principal.getUser());
    }

    @PutMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public UserDTO updateUser(
            @PathVariable Integer userId,
            @Valid @RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return userService.updateUser(userId, request, principal.getUser());
    }

    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO updateRole(@PathVariable Integer userId, @Valid @RequestBody RoleUpdateRequest request) {
        return userService.updateRole(userId, request.role());
    }

    /** Profil sayfasindaki "Verdigim Oylar"; sahibi veya admin gorebilir. */
    @GetMapping("/{userId}/ratings")
    @PreAuthorize("isAuthenticated()")
    public List<UserRatingDTO> getUserRatings(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ratingService.getUserRatings(userId, principal.getUser(), page, size);
    }

    @GetMapping("/{userId}/comments")
    @PreAuthorize("isAuthenticated()")
    public List<CommentDTO> getUserComments(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return commentService.getUserComments(userId, page, size);
    }
}
