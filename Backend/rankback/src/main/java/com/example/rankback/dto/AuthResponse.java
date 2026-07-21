package com.example.rankback.dto;

public record AuthResponse(String token, Integer userId, String username, String email, String role) {
}
