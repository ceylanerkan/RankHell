package com.example.rankback.controller;

import com.example.rankback.dto.AuthResponse;
import com.example.rankback.dto.LoginRequest;
import com.example.rankback.dto.RegisterRequest;
import com.example.rankback.entity.User;
import com.example.rankback.security.UserPrincipal;
import com.example.rankback.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(authService.register(request, httpRequest.getRemoteAddr()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(authService.login(request, httpRequest.getRemoteAddr()));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        User user = principal.getUser();
        return ResponseEntity.ok(new AuthResponse(null, user.getUserId(), user.getUsername(), user.getEmail(), user.getRole().name()));
    }
}
