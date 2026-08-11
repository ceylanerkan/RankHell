package com.example.rankback.controller;

import com.example.rankback.dto.UserLoginLogDTO;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** user_login_logs: audit trail, readable by the account owner or an admin. */
@RestController
@RequestMapping("/api")
public class UserLoginLogController {

    private final UserService userService;

    public UserLoginLogController(UserService userService) {
        this.userService = userService;
    }

    /** success=false ile başarısız denemeler süzülebilir (brute force takibi). */
    @GetMapping("/login-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserLoginLogDTO> getAllLoginLogs(
            @RequestParam(required = false) Boolean success,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return userService.getAllLoginLogs(success, page, size);
    }

    @GetMapping("/users/{userId}/login-logs")
    @PreAuthorize("isAuthenticated()")
    public List<UserLoginLogDTO> getUserLoginLogs(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        return userService.getLoginLogs(userId, principal.getUser(), page, size);
    }
}
