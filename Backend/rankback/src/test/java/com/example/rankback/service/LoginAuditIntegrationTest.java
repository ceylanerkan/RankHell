package com.example.rankback.service;

import com.example.rankback.dto.LoginRequest;
import com.example.rankback.dto.RegisterRequest;
import com.example.rankback.dto.UserLoginLogDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.AuthenticationException;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Giriş denetim kaydının (audit) uçtan uca doğrulaması.
 *
 * <p>Asıl doğrulanmak istenen şey: başarısız bir giriş denemesinin kaydı
 * gerçekten kalıcı oluyor mu ve admin sorgusunda görünüyor mu. İkincisi
 * önemsiz değil: user_id'si NULL olan satırlar, sorgu INNER JOIN'e
 * dönüşseydi listeden sessizce düşerdi.
 */
@SpringBootTest
@ActiveProfiles("test")
class LoginAuditIntegrationTest {

    private static final String IP = "203.0.113.9";

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Test
    void taninmayanEpostaIleBasarisizDenemeKaydedilirVeListelenir() {
        String email = "ghost@example.com";

        assertThrows(AuthenticationException.class,
                () -> authService.login(new LoginRequest(email, "wrong-password"), IP));

        UserLoginLogDTO row = findByEmail(userService.getAllLoginLogs(false, 0, 50), email);

        assertFalse(row.success(), "kayıt başarısız olarak işaretlenmeliydi");
        assertNull(row.userId(), "tanınmayan e-posta bir kullanıcıya bağlanmamalı");
        assertNull(row.username());
        assertEquals(IP, row.ipAddress());
    }

    @Test
    void bilinenKullanicininHataliParolasiOKullaniciyaBaglanir() {
        String email = "known@example.com";
        authService.register(new RegisterRequest("knownuser", email, "password123", true, true), IP);

        assertThrows(AuthenticationException.class,
                () -> authService.login(new LoginRequest(email, "totally-wrong"), IP));

        UserLoginLogDTO failure = findByEmail(userService.getAllLoginLogs(false, 0, 50), email);

        assertFalse(failure.success());
        assertNotNull(failure.userId(), "parola hatasında kayıt kullanıcıya bağlanmalı");
        assertEquals("knownuser", failure.username());
    }

    @Test
    void kayitVeBasariliGirisAyriAyriLoglanir() {
        String email = "audit@example.com";
        authService.register(new RegisterRequest("audituser", email, "password123", true, true), IP);
        authService.login(new LoginRequest(email, "password123"), IP);

        List<UserLoginLogDTO> rows = userService.getAllLoginLogs(true, 0, 50).stream()
                .filter(r -> email.equals(r.attemptedEmail()))
                .toList();

        assertEquals(2, rows.size(), "biri kayıt biri giriş olmak üzere iki satır beklenir");
        rows.forEach(r -> {
            assertTrue(r.success());
            assertEquals("audituser", r.username());
        });
    }

    @Test
    void girisZamaniUtcOlarakSaklanir() {
        String email = "utc@example.com";
        authService.register(new RegisterRequest("utcuser", email, "password123", true, true), IP);

        UserLoginLogDTO row = findByEmail(userService.getAllLoginLogs(true, 0, 50), email);

        // Sunucu UTC+3'te: yerel saat yazılsaydı fark ~3 saat olurdu.
        long farkDakika = Duration.between(row.loginTime(), LocalDateTime.now(ZoneOffset.UTC)).abs().toMinutes();
        assertTrue(farkDakika < 5, "giriş zamanı UTC değil, fark: " + farkDakika + " dakika");
    }

    private static UserLoginLogDTO findByEmail(List<UserLoginLogDTO> rows, String email) {
        return rows.stream()
                .filter(r -> email.equals(r.attemptedEmail()))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Kayıt listede bulunamadı: " + email));
    }
}
