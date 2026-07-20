package com.example.rankback.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Item_Tags", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"item_id", "tag_id"})
})
public class ItemTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;
}