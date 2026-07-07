package com.example.rankback.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Getter
@Setter
@Table(name = "Items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Integer itemId;

    @NotBlank(message = "Item name cannot be empty")
    @Size(min = 2, max = 255, message = "Item name must be between 2 and 255 characters")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "global_score", precision = 3, scale = 2)
    private BigDecimal globalScore = BigDecimal.ZERO;

    @Column(name = "total_votes")
    private Integer totalVotes = 0;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ItemCategory> itemCategories;

}
