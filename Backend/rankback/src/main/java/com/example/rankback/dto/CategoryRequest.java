package com.example.rankback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record CategoryRequest(
        @NotBlank(message = "Category name cannot be empty")
        @Size(min = 2, max = 100, message = "Category name must be between 2 and 100 characters")
        String name,

        @Size(max = 150, message = "Tagline 150 karakterden uzun olamaz")
        String tagline,

        @URL(message = "Geçerli bir resim URL'si girilmelidir.")
        @Size(max = 1000, message = "Image URL cannot exceed 1000 characters")
        String imageUrl
) {
}
