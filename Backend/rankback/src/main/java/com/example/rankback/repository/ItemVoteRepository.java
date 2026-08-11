package com.example.rankback.repository;

import com.example.rankback.entity.ItemVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemVoteRepository extends JpaRepository<ItemVote, Integer> {

    Optional<ItemVote> findByUser_UserIdAndItem_ItemId(Integer userId, Integer itemId);

    long countByItem_ItemIdAndVoteValue(Integer itemId, Byte voteValue);

    /** Gunun siralamasi icin tek satirlik ozet: item + o gun aldigi oy sayisi. */
    interface ItemVoteTally {
        Integer getItemId();
        String getItemName();
        String getItemImageUrl();
        long getVoteCount();
    }

    /**
     * Verilen zaman araliginda her item'in kac oy aldigi, coktan aza.
     *
     * DATE(created_at) = CURDATE() yerine aralik kullaniliyor: aralik hem tasinabilir
     * (JPQL'de DATE() standart degil) hem de created_at uzerindeki indeksi kullanabilir.
     *
     * Yukari/asagi ayrimi yapilmaz, oy sayisi sayilir -- basliktaki soru "bugun en cok
     * oy toplayanlar", yani ilgi olculuyor, begeni degil.
     */
    @Query("""
            SELECT v.item.itemId AS itemId,
                   v.item.name AS itemName,
                   v.item.imageUrl AS itemImageUrl,
                   COUNT(v) AS voteCount
            FROM ItemVote v
            WHERE v.createdAt >= :start AND v.createdAt < :end
            GROUP BY v.item.itemId, v.item.name, v.item.imageUrl
            ORDER BY COUNT(v) DESC, v.item.itemId ASC
            """)
    List<ItemVoteTally> tallyBetween(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);
}
