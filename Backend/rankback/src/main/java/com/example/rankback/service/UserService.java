package com.example.rankback.service;

import com.example.rankback.dto.UserDTO;
import com.example.rankback.dto.UserLoginLogDTO;
import com.example.rankback.dto.UserSummaryDTO;
import com.example.rankback.dto.UserUpdateRequest;
import com.example.rankback.entity.Role;
import com.example.rankback.entity.User;
import com.example.rankback.entity.UserLoginLog;
import com.example.rankback.exception.DuplicateResourceException;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.UserLoginLogRepository;
import com.example.rankback.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserLoginLogRepository userLoginLogRepository;

    public UserService(UserRepository userRepository, UserLoginLogRepository userLoginLogRepository) {
        this.userRepository = userRepository;
        this.userLoginLogRepository = userLoginLogRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size)).getContent().stream()
                .map(UserService::toDTO)
                .toList();
    }

    /** Public profile: no email, no consent flags. */
    @Transactional(readOnly = true)
    public UserSummaryDTO getPublicProfile(Integer userId) {
        User user = findOrThrow(userId);
        return new UserSummaryDTO(user.getUserId(), user.getUsername(), user.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public UserDTO getUserDetail(Integer userId, User currentUser) {
        requireSelfOrAdmin(userId, currentUser);
        return toDTO(findOrThrow(userId));
    }

    @Transactional
    public UserDTO updateUser(Integer userId, UserUpdateRequest request, User currentUser) {
        requireSelfOrAdmin(userId, currentUser);
        User user = findOrThrow(userId);

        if (!user.getUsername().equals(request.username()) && userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username already taken: " + request.username());
        }
        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered: " + request.email());
        }

        user.setUsername(request.username());
        user.setEmail(request.email());
        return toDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO updateRole(Integer userId, Role role) {
        User user = findOrThrow(userId);
        user.setRole(role);
        return toDTO(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserLoginLogDTO> getLoginLogs(Integer userId, User currentUser, int page, int size) {
        requireSelfOrAdmin(userId, currentUser);
        findOrThrow(userId);
        return userLoginLogRepository
                .findByUser_UserIdOrderByLoginTimeDesc(userId, PageRequest.of(page, size))
                .getContent().stream()
                .map(UserService::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserLoginLogDTO> getAllLoginLogs(int page, int size) {
        return userLoginLogRepository.findAllByOrderByLoginTimeDesc(PageRequest.of(page, size))
                .getContent().stream()
                .map(UserService::toDTO)
                .toList();
    }

    private void requireSelfOrAdmin(Integer userId, User currentUser) {
        if (!currentUser.getUserId().equals(userId) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You can only access your own account");
        }
    }

    private User findOrThrow(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    static UserDTO toDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.isTermsAccepted(),
                user.isKvkkAccepted());
    }

    private static UserLoginLogDTO toDTO(UserLoginLog log) {
        return new UserLoginLogDTO(
                log.getId(),
                log.getUser().getUserId(),
                log.getUser().getUsername(),
                log.getIpAddress(),
                log.getLoginTime());
    }
}
