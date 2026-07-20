package com.example.rankback.service;

import com.example.rankback.dto.AuthResponse;
import com.example.rankback.dto.LoginRequest;
import com.example.rankback.dto.RegisterRequest;
import com.example.rankback.entity.Role;
import com.example.rankback.entity.User;
import com.example.rankback.entity.UserLoginLog;
import com.example.rankback.exception.DuplicateResourceException;
import com.example.rankback.repository.UserLoginLogRepository;
import com.example.rankback.repository.UserRepository;
import com.example.rankback.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserLoginLogRepository userLoginLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                        UserLoginLogRepository userLoginLogRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtService jwtService) {
        this.userRepository = userRepository;
        this.userLoginLogRepository = userLoginLogRepository;
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
        if (request.isTermsAccepted() || request.isKvkkAccepted()) {
            user.setAgreementDate(LocalDateTime.now());
        }
        user.setRegisteredIp(ipAddress);

        User saved = userRepository.save(user);
        return toAuthResponse(saved, jwtService.generateToken(saved));
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Authenticated user vanished: " + request.email()));

        userLoginLogRepository.save(UserLoginLog.builder()
                .user(user)
                .ipAddress(ipAddress)
                .loginTime(LocalDateTime.now())
                .build());

        return toAuthResponse(user, jwtService.generateToken(user));
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(token, user.getUserId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }
}
