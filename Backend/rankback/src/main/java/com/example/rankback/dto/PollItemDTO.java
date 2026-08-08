package com.example.rankback.dto;

import java.math.BigDecimal;

/**
 * Bir anketteki secenek.
 *
 * <p>Puan ve oy sayisi da tasinir: anket detay sayfasi secenekleri puana gore
 * siraliyor. Bunlar olmasaydi istemcinin her secenek icin ayri bir item istegi
 * atmasi gerekirdi (ag uzerinde N+1).
 */
public record PollItemDTO(
        Integer id,
        Integer itemId,
        String name,
        String imageUrl,
        String description,
        BigDecimal globalScore,
        Integer totalVotes
) {
}
