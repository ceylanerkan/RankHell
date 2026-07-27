package com.example.rankback.dto;

import java.time.LocalDateTime;

public record UserLoginLogDTO(
        Long id,
        Integer userId,
        String username,
        String ipAddress,
        LocalDateTime loginTime
) {
}
