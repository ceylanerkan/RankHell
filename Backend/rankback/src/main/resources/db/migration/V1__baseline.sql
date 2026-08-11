-- =============================================================================
-- V1__baseline.sql
-- Amaç : Flyway'i mevcut canlı veritabanına tanıtmak için baseline migration.
--        Bu dosya, veritabanında ZATEN VAR OLAN tabloların yetkili tanımıdır.
--        baseline-on-migrate=true ile açılışta flyway_schema_history'ye V1 olarak
--        işaretlenir, tablolara dokunulmaz.
--
-- ÖNEMLİ: Flyway bu dosyayı çalıştırmaz (baseline), sadece checksum'ını kaydeder.
--         Canlı şemada eksik tablo/kolon varsa V2 migration'ı düzeltir.
-- =============================================================================

-- 1. BAĞIMSIZ ANA TABLOLAR

CREATE TABLE IF NOT EXISTS Users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    is_terms_accepted BOOLEAN  NOT NULL DEFAULT FALSE,
    is_kvkk_accepted  BOOLEAN  NOT NULL DEFAULT FALSE,
    agreement_date    DATETIME,
    registered_ip     VARCHAR(45),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL UNIQUE,
    image_url   VARCHAR(1000),
    tagline     VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name   VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Items (
    item_id        INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    image_url      VARCHAR(500),
    global_score   DECIMAL(3, 2) DEFAULT 0.00,
    total_votes    INT           DEFAULT 0,
    upvote_count   INT NOT NULL  DEFAULT 0,
    downvote_count INT NOT NULL  DEFAULT 0,
    is_deleted     BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Custom_Polls (
    poll_id    INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT          NOT NULL,
    title      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_poll_creator FOREIGN KEY (creator_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 2. BAĞIMLI TABLOLAR VE İLİŞKİ TABLOLARI

CREATE TABLE IF NOT EXISTS User_Login_Logs (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    ip_address VARCHAR(45)  NOT NULL,
    login_time DATETIME     NOT NULL,
    CONSTRAINT fk_user_login FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Ratings (
    rating_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT     NOT NULL,
    item_id    INT     NOT NULL,
    score      TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_item_rating UNIQUE (user_id, item_id),
    CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_item FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Item_Categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    item_id     INT NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT uk_item_category UNIQUE (item_id, category_id),
    CONSTRAINT fk_itemcat_item     FOREIGN KEY (item_id)     REFERENCES Items(item_id)      ON DELETE CASCADE,
    CONSTRAINT fk_itemcat_category FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Poll_Items (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    item_id INT NOT NULL,
    CONSTRAINT uk_poll_item     UNIQUE (poll_id, item_id),
    CONSTRAINT fk_pollitem_poll FOREIGN KEY (poll_id) REFERENCES Custom_Polls(poll_id) ON DELETE CASCADE,
    CONSTRAINT fk_pollitem_item FOREIGN KEY (item_id) REFERENCES Items(item_id)        ON DELETE CASCADE
);
