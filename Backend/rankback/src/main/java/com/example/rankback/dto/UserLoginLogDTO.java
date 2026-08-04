package com.example.rankback.dto;

import java.time.LocalDateTime;

/**
 * Giriş denemesi kaydı.
 *
 * <p>userId ve username null olabilir: tanınmayan bir e-posta ile yapılan
 * başarısız denemenin bağlı olduğu bir kullanıcı yoktur, o durumda
 * attemptedEmail tek ipucudur.
 *
 * <p>loginTime UTC'dir.
 */
public record UserLoginLogDTO(
        Long id,
        Integer userId,
        String username,
        String attemptedEmail,
        String ipAddress,
        LocalDateTime loginTime,
        boolean success
) {
}
