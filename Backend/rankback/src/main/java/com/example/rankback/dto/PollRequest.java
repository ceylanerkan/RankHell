package com.example.rankback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Anket olusturma/guncelleme istegi.
 *
 * <p>title disindaki her sey opsiyoneldir: olusturma formu su an yalnizca
 * baslik ve secenekleri soruyor, kalan alanlar ilerde eklenecek.
 * featured burada YOK - editoryal bir karar, sahibi kendi anketini
 * one cikaramaz.
 */
public record PollRequest(
        @NotBlank(message = "Title cannot be empty")
        @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
        String title,

        @Size(max = 1000, message = "Description cannot exceed 1000 characters")
        String description,

        @Size(max = 500, message = "Cover URL cannot exceed 500 characters")
        String coverUrl,

        Integer categoryId,

        /** classic, bracket, duel, blind, tier */
        List<String> modes,

        /** Optional; replaces the poll's items when provided. */
        List<Integer> itemIds
) {
}
