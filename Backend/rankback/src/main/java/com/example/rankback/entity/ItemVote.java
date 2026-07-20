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
@Table(name = "Item_Votes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "item_id"})
})
public class ItemVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_id")
    private Integer voteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "vote_value", nullable = false)
    private Byte voteValue;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
