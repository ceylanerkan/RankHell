-- Duello sistemi, anket yorumlari, anket modlari ve anket kunye alanlari.
--
-- ddl-auto=validate oldugu icin bu tablolar Hibernate tarafindan olusturulmaz;
-- kolon tipleri entity'lerin urettigi DDL ile birebir ayni tutulmalidir, yoksa
-- uygulama acilista dogrulama hatasi verir.

-- 1. Anket kunye alanlari (Custom_Polls'a ek kolonlar)
-- V1'de tablo yalnizca poll_id/creator_id/title/created_at ile dogmustu.

ALTER TABLE Custom_Polls
    ADD COLUMN description   VARCHAR(1000) NULL,
    ADD COLUMN cover_url     VARCHAR(500)  NULL,
    ADD COLUMN category_id   INT           NULL,
    ADD COLUMN featured      BIT(1)        NULL,
    ADD COLUMN global_score  DECIMAL(3, 2) NULL,
    ADD COLUMN total_ratings INT           NULL,
    ADD COLUMN play_count    INT           NULL;

ALTER TABLE Custom_Polls
    ADD CONSTRAINT fk_poll_category FOREIGN KEY (category_id) REFERENCES Categories (category_id);

-- 2. Anketin oynanabildigi modlar (classic, bracket, duel, blind, tier)
--
-- Bilesik birincil anahtar sart: Aiven MySQL sql_require_primary_key ile
-- calisiyor ve anahtarsiz tabloyu reddediyor. (poll_id, mode) ayni zamanda
-- ayni modun ayni ankete iki kez eklenmesini de engelliyor.

CREATE TABLE IF NOT EXISTS poll_modes
(
    poll_id INT         NOT NULL,
    mode    VARCHAR(20) NOT NULL,
    PRIMARY KEY (poll_id, mode),
    CONSTRAINT fk_poll_modes_poll FOREIGN KEY (poll_id) REFERENCES Custom_Polls (poll_id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 3. Anket yorumlari
-- Item_Comments'ten ayri: orada yanit zinciri var, burada duz liste + puan.

CREATE TABLE IF NOT EXISTS poll_comments
(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id    INT          NOT NULL,
    user_id    INT          NOT NULL,
    body       VARCHAR(500) NOT NULL,
    score      TINYINT      NULL,
    created_at DATETIME(6)  NULL,
    CONSTRAINT fk_poll_comment_poll FOREIGN KEY (poll_id) REFERENCES Custom_Polls (poll_id) ON DELETE CASCADE,
    CONSTRAINT fk_poll_comment_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE,
    CONSTRAINT chk_poll_comment_score CHECK (score >= 1 AND score <= 5)
) ENGINE = InnoDB;

-- 4. Duellolar ("O mu, Bu mu?")
--
-- Oy sayilari ayri bir oy tablosunda degil burada sayac olarak tutulur: oylama
-- anonim, kaydedilecek kullanici yok. Sayaclar tek UPDATE ile artirilir.

CREATE TABLE IF NOT EXISTS duels
(
    duel_id    INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    item_a_id  INT          NOT NULL,
    item_b_id  INT          NOT NULL,
    votes_a    INT          NOT NULL DEFAULT 0,
    votes_b    INT          NOT NULL DEFAULT 0,
    creator_id INT          NOT NULL,
    created_at DATETIME(6)  NULL,
    CONSTRAINT fk_duel_item_a FOREIGN KEY (item_a_id) REFERENCES Items (item_id) ON DELETE CASCADE,
    CONSTRAINT fk_duel_item_b FOREIGN KEY (item_b_id) REFERENCES Items (item_id) ON DELETE CASCADE,
    CONSTRAINT fk_duel_creator FOREIGN KEY (creator_id) REFERENCES Users (user_id) ON DELETE CASCADE
) ENGINE = InnoDB;
