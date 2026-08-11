package com.example.rankback.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Getter
@Setter
@Table(name = "Custom_Polls")
public class CustomPoll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poll_id")
    private Integer pollId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @NotBlank(message = "Title cannot be empty")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(name = "description", length = 1000)
    private String description;

    @Size(max = 500, message = "Cover URL cannot exceed 500 characters")
    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    /** Karma havuzlu anketlerde null: tek bir kategoriye sigmaz, rozet cizilmez. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    /** Editorun secimi rozeti. */
    @Column(name = "featured")
    private Boolean featured = false;

    /**
     * Anketin oynanabildigi modlar (classic, bracket, duel, blind, tier).
     * Ayri bir poll_modes tablosunda tutulur; virgullu tek kolon yerine ayri
     * tablo secildi ki mod bazli sorgu ilerde mumkun olsun.
     *
     * @ElementCollection degil gercek bir entity: element koleksiyonlari
     * PRIMARY KEY'siz tablo uretir, Aiven MySQL de anahtarsiz tablo kabul
     * etmez. Ayrinti icin bkz. PollMode.
     */
    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<PollMode> modeLinks = new LinkedHashSet<>();

    /** Anketin kendisine verilen puanlarin ortalamasi (item'lardan bagimsiz). */
    @Column(name = "global_score", precision = 3, scale = 2)
    private BigDecimal globalScore = BigDecimal.ZERO;

    @Column(name = "total_ratings")
    private Integer totalRatings = 0;

    @Column(name = "play_count")
    private Integer playCount = 0;

    @Column(name = "created_at", updatable = false, columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PollItem> pollItems;

    /** Modlari duz metin olarak verir; cagiran taraf PollMode'u hic gormez. */
    public Set<String> getModes() {
        return modeLinks.stream()
                .map(PollMode::getMode)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    /**
     * Modlari toptan degistirir. Koleksiyon referansi yenilenmez, icerigi
     * guncellenir: orphanRemoval ancak Hibernate'in yonettigi ayni koleksiyon
     * ornegi uzerinde calisir, referans degistirilirse silinenler tabloda kalir.
     */
    public void setModes(Set<String> newModes) {
        Set<String> hedef = newModes == null ? Set.of() : newModes;
        modeLinks.removeIf(link -> !hedef.contains(link.getMode()));

        Set<String> mevcut = getModes();
        hedef.stream()
                .filter(mode -> !mevcut.contains(mode))
                .forEach(mode -> modeLinks.add(new PollMode(this, mode)));
    }
}
