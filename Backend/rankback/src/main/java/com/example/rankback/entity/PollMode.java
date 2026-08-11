package com.example.rankback.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Bir anketin oynanabildigi tek bir mod (classic, bracket, duel, blind, tier).
 *
 * Bu daha once @ElementCollection idi. Hibernate element koleksiyonlari icin
 * PRIMARY KEY'siz tablo uretir; Aiven MySQL bunu reddedince tablo hic
 * olusmadi ve hata ancak ilk /api/polls isteginde ortaya cikti. Bilesik
 * anahtarli gercek bir entity'ye cevrilerek sorun kaynagindan giderildi.
 *
 * Disariya karsi bu sinif gorunmez: CustomPoll.getModes()/setModes() hala
 * Set&lt;String&gt; ile calisir, servis ve DTO katmani degismedi.
 */
@Entity
@Table(name = "poll_modes")
@Getter
@Setter
@NoArgsConstructor
public class PollMode {

    @EmbeddedId
    private PollModeId id;

    /**
     * @MapsId: id.pollId alani bu iliskiden doldurulur, elle atanmaz.
     * Boylece anket kaydedilirken uretilen poll_id otomatik olarak anahtara gecer.
     */
    @MapsId("pollId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "poll_id", nullable = false)
    private CustomPoll poll;

    public PollMode(CustomPoll poll, String mode) {
        this.poll = poll;
        this.id = new PollModeId(poll.getPollId(), mode);
    }

    public String getMode() {
        return id == null ? null : id.getMode();
    }
}
