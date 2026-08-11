package com.example.rankback.service;

import com.example.rankback.dto.AuthResponse;
import com.example.rankback.dto.LoginRequest;
import com.example.rankback.dto.RegisterRequest;
import com.example.rankback.entity.Role;
import com.example.rankback.entity.User;
import com.example.rankback.exception.DuplicateResourceException;
import com.example.rankback.repository.UserRepository;
import com.example.rankback.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final LoginAuditService loginAuditService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                        LoginAuditService loginAuditService,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtService jwtService) {
        this.userRepository = userRepository;
        this.loginAuditService = loginAuditService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String ipAddress) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered: " + request.email());
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username already taken: " + request.username());
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        user.setTermsAccepted(request.isTermsAccepted());
        user.setKvkkAccepted(request.isKvkkAccepted());
        // created_at UTC olarak açıkça set ediliyor (insertable=true artık).
        // agreement_date de aynı kaynaktan (UTC) geliyor → aynı satırda saat farkı yok.
        user.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
        if (request.isTermsAccepted() || request.isKvkkAccepted()) {
            user.setAgreementDate(LocalDateTime.now(ZoneOffset.UTC));
        }
        user.setRegisteredIp(ipAddress);

        User saved = userRepository.save(user);

        // Kayıt anında token da veriliyor, yani kullanıcı giriş yapmış sayılır:
        // audit izinde bu an da görünmeli. Aynı transaction'da yazılır, kayıt
        // geri alınırsa log da geri alınır.
        loginAuditService.recordSuccess(saved, ipAddress);

        return toAuthResponse(saved, jwtService.generateToken(saved));
    }

    /**
     * Bilinçli olarak @Transactional değil: başarısız denemenin kaydı
     * {@link LoginAuditService#recordFailure} içinde kendi transaction'ında
     * commit edilir, buradaki exception onu geri almasın diye.
     */
    public AuthResponse login(LoginRequest request, String ipAddress) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (AuthenticationException ex) {
            recordFailureQuietly(request.email(), ipAddress);
            throw ex;
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Authenticated user vanished: " + request.email()));

        // main'deki satir ici kayit yerine LoginAuditService: o da UTC yaziyor,
        // ustelik basarisiz denemeleri de kendi islemiyle kaydediyor.
        loginAuditService.recordSuccess(user, ipAddress);

        return toAuthResponse(user, jwtService.generateToken(user));
    }

    /**
     * Audit yazımındaki bir sorun, kullanıcıya dönecek olan kimlik doğrulama
     * hatasının yerini almasın: log'lanır ama yutulur.
     */
    private void recordFailureQuietly(String attemptedEmail, String ipAddress) {
        try {
            loginAuditService.recordFailure(attemptedEmail, ipAddress);
        } catch (RuntimeException auditError) {
            log.warn("Başarısız giriş denemesi kaydedilemedi (email={}): {}", attemptedEmail, auditError.toString());
        }
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(token, user.getUserId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }
}
