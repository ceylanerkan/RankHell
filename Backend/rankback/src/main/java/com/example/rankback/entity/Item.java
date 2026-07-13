package com.example.rankback.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "Items")
@SQLRestriction("is_deleted = false")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Integer itemId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "global_score", precision = 3, scale = 2)
    private BigDecimal globalScore = BigDecimal.ZERO;

    @Column(name = "total_votes")
    private Integer totalVotes = 0;

    // Oylama sistemi için sayaçlar
    @Column(name = "upvote_count", nullable = false)
    private Integer upvoteCount = 0;

    @Column(name = "downvote_count", nullable = false)
    private Integer downvoteCount = 0;

    // Soft Delete kısıtlaması
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;
}