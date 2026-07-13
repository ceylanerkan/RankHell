package com.example.rankback.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Tags")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Integer tagId;

    @Column(nullable = false, unique = true, length = 50)
    private String name;
}
