package com.example.rankback.repository;

import com.example.rankback.entity.Duel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DuelRepository extends JpaRepository<Duel, Integer> {

    /** itemA/itemB/creator tek sorguda gelir; listede duello basina 3 ek sorgu olmaz. */
    @EntityGraph(attributePaths = {"itemA", "itemB", "creator"})
    Page<Duel> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"itemA", "itemB", "creator"})
    Optional<Duel> findWithSidesByDuelId(Integer duelId);

    /**
     * Oyu veritabaninda artirir. Once okuyup sonra yazsaydik, ayni anda gelen iki
     * oy ayni eski degeri okur ve biri kaybolurdu; tek UPDATE bunu engeller.
     *
     * flush/clear: ayni islem icinde hemen ardindan duello tekrar okundugu icin
     * kalici baglam eskimemis olmali.
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Duel d SET d.votesA = d.votesA + 1 WHERE d.duelId = :duelId")
    int incrementVotesA(@Param("duelId") Integer duelId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Duel d SET d.votesB = d.votesB + 1 WHERE d.duelId = :duelId")
    int incrementVotesB(@Param("duelId") Integer duelId);
}
