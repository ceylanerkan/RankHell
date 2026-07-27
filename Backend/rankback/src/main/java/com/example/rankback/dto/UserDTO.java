package com.example.rankback.dto;

import java.time.LocalDateTime;

/** Full profile; only returned to the owner of the account or to an admin. */
public record UserDTO(
        Integer userId,
        String username,
        String email,
        String role,
        LocalDateTime createdAt,
        boolean termsAccepted,
        boolean kvkkAccepted
) {
}
