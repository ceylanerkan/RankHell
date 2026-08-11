package com.example.rankback.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Iki item'i karsi karsiya getiren anonim oylama ("O mu, Bu mu?").
 *
 * Oy sayilari ayri bir oy tablosunda degil, dogrudan burada sayac olarak
 * tutulur: oylama giris istemiyor, dolayisiyla kaydedilecek bir kullanici
 * yok. Sayaclar DuelRepository'deki atomik UPDATE ile artirilir, boylece
 * ayni anda gelen iki oy birbirini ezmez.
 */
@Entity
@Getter
@Setter
@Table(name = "duels")
public class Duel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "duel_id")
    private Integer duelId;

    @NotBlank(message = "Title cannot be empty")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_a_id", nullable = false)
    private Item itemA;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_b_id", nullable = false)
    private Item itemB;

    @Column(name = "votes_a", nullable = false)
    private Integer votesA = 0;

    @Column(name = "votes_b", nullable = false)
    private Integer votesB = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
