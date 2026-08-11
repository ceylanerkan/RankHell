package com.example.rankback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * poll_modes tablosunun bilesik birincil anahtari.
 *
 * Anahtarin (poll_id, mode) olmasi iki isi birden goruyor: satirlari benzersiz
 * kilar (ayni ankete ayni mod iki kez eklenemez) ve tabloya gercek bir PRIMARY
 * KEY kazandirir. Ikincisi sart, cunku Aiven MySQL 'sql_require_primary_key'
 * ile calisiyor ve anahtarsiz tablo olusturulmasini reddediyor.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class PollModeId implements Serializable {

    @Column(name = "poll_id", nullable = false)
    private Integer pollId;

    @Column(name = "mode", nullable = false, length = 20)
    private String mode;

    public PollModeId(Integer pollId, String mode) {
        this.pollId = pollId;
        this.mode = mode;
    }
}
