package com.example.rankback.dto;

import java.time.LocalDateTime;

/**
 * Bir kullanicinin verdigi tek bir puan, item bilgisiyle birlikte.
 *
 * <p>{@link RatingDTO}'dan farki: orada item'in sadece id'si var, burada isim ve
 * gorsel de var. Profil sayfasi listeyi item adiyla gosterdigi icin, aksi halde
 * her satir icin ayri bir item istegi atmak gerekirdi.
 */
public record UserRatingDTO(
        Integer ratingId,
        Integer itemId,
        String itemName,
        String itemImageUrl,
        Byte score,
        LocalDateTime createdAt
) {
}
