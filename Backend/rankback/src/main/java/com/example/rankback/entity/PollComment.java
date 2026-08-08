package com.example.rankback.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Bir ankete yazilan yorum.
 *
 * <p>{@link ItemComment}'ten ayri bir tablodur: o item'lara ait ve yanit
 * (parent) zinciri tasir; anket yorumlari duz bir listedir ve istege bagli
 * bir puan (score) tasiyabilir.
 */
@Entity
@Getter
@Setter
@Table(name = "poll_comments")
public class PollComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private CustomPoll poll;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 500, message = "Comment cannot exceed 500 characters")
    @Column(name = "body", nullable = false, length = 500)
    private String body;

    /** Yorumla birlikte verilen puan; zorunlu degil. */
    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 5, message = "Score must be at most 5")
    @Column(name = "score")
    private Byte score;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
