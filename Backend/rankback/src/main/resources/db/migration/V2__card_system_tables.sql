-- =============================================================================
-- V2__card_system_tables.sql
-- Amaç : V1 baseline'da bulunmayan yeni tabloların eklenmesi.
--        Item_Tags, Item_Comments, Item_Votes tabloları ve eksik kolonların
--        ALTER ile eklenmesi.
--
-- Bu dosya Flyway tarafından gerçekten ÇALIŞTIRILIR.
-- Canlı DB'de bu tablolar yoksa oluşturur, varsa hata verir → sorun yok,
-- IF NOT EXISTS kullandık.
-- =============================================================================

-- Item_Tags: Bir item'ın birden fazla tag'i olabilir
CREATE TABLE IF NOT EXISTS Item_Tags (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    tag_id  INT NOT NULL,
    CONSTRAINT uk_item_tag     UNIQUE (item_id, tag_id),
    CONSTRAINT fk_itemtag_item FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    CONSTRAINT fk_itemtag_tag  FOREIGN KEY (tag_id)  REFERENCES Tags(tag_id)   ON DELETE CASCADE
);

-- Item_Votes: Upvote / Downvote sistemi (vote_value: 1 veya -1)
CREATE TABLE IF NOT EXISTS Item_Votes (
    vote_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    item_id    INT NOT NULL,
    vote_value TINYINT NOT NULL COMMENT '1 for Upvote, -1 for Downvote',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_item_vote UNIQUE (user_id, item_id),
    CONSTRAINT fk_itemvote_user  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_itemvote_item  FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    CONSTRAINT chk_vote_value    CHECK (vote_value IN (1, -1))
);

-- Item_Comments: Nested comment desteği (parent_comment_id ile)
CREATE TABLE IF NOT EXISTS Item_Comments (
    comment_id        INT AUTO_INCREMENT PRIMARY KEY,
    item_id           INT          NOT NULL,
    user_id           INT          NOT NULL,
    parent_comment_id INT          DEFAULT NULL,
    content           VARCHAR(500) NOT NULL,
    created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    is_deleted        BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_comment_item   FOREIGN KEY (item_id)           REFERENCES Items(item_id)         ON DELETE CASCADE,
    CONSTRAINT fk_comment_user   FOREIGN KEY (user_id)           REFERENCES Users(user_id)         ON DELETE CASCADE,
    CONSTRAINT fk_comment_parent FOREIGN KEY (parent_comment_id) REFERENCES Item_Comments(comment_id) ON DELETE CASCADE
);

-- =============================================================================
-- MEVCUT TABLOLARA EKSIK KOLONLARIN EKLENMESİ
-- Her ALTER sadece kolon yoksa çalışır (prosedür koşulu).
-- =============================================================================

-- Users tablosuna 'role' kolonu eksikse ekle
-- (entity'de Role enum'u var; baseline'da bazı ortamlarda oluşmamış olabilir)
SET @col_exists = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'Users'
      AND COLUMN_NAME  = 'role'
);
SET @sql = IF(@col_exists = 0,
    "ALTER TABLE Users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER' AFTER password_hash",
    'SELECT ''role column already exists'' AS info'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Custom_Polls.created_at → DEFAULT CURRENT_TIMESTAMP güvencesi
-- (Baseline'da DEFAULT yoksa sıralar doğru kaydedilmez)
SET @cp_default = (
    SELECT COLUMN_DEFAULT FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'Custom_Polls'
      AND COLUMN_NAME  = 'created_at'
);
SET @sql2 = IF(@cp_default IS NULL,
    'ALTER TABLE Custom_Polls MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'SELECT ''Custom_Polls.created_at default OK'' AS info'
);
PREPARE stmt2 FROM @sql2; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;
