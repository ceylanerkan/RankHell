package com.example.rankback.dto;

import com.example.rankback.entity.Role;
import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(
        @NotNull(message = "Role cannot be null")
        Role role
) {
}
