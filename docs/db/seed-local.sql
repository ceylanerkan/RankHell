-- RankHell yerel gelistirme tohum verisi
-- Kaynak: Frontend/rankfront/src/api/mock/data.js (elle yazilmadi, uretildi)
-- Tekrar calistirilabilir: hepsi INSERT IGNORE.

SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- kategoriler
INSERT IGNORE INTO categories (category_id, name, tagline, image_url) VALUES (1, 'Film', 'Kült mü, klişe mi?', NULL);
INSERT IGNORE INTO categories (category_id, name, tagline, image_url) VALUES (2, 'Dizi', 'Final hak etti mi?', NULL);
INSERT IGNORE INTO categories (category_id, name, tagline, image_url) VALUES (3, 'Oyun', 'Efsane mi, hype mı?', NULL);
INSERT IGNORE INTO categories (category_id, name, tagline, image_url) VALUES (4, 'Yemek', 'Damak kavgası burada', NULL);
INSERT IGNORE INTO categories (category_id, name, tagline, image_url) VALUES (5, 'Müzik', 'Kulaklar jüri', NULL);

-- item'lar
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (1, 'The Godfather', 'Corleone ailesinin suç imparatorluğunu anlatan efsane film.', '/items/godfather.jpg', 4.72, 1843, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (2, 'Breaking Bad', 'Kimya öğretmeni Walter White''ın karanlık dönüşümü.', '/items/breakingbad.jpg', 4.85, 2517, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (3, 'The Witcher 3', 'Rivyalı Geralt''ın açık dünya macerası.', '/items/witcher.jpg', 4.61, 1292, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (4, 'İskender Kebap', 'Bursa''nın dünyaca ünlü, tereyağlı ve yoğurtlu kebabı.', '/items/iskender.jpg', 4.43, 674, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (5, 'The Dark Side of the Moon', 'Pink Floyd''un 1973 tarihli kült albümü.', '/items/darkside.jpg', 4.58, 958, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (6, 'Interstellar', 'Zaman, yerçekimi ve sevgi üzerine bir uzay destanı.', '/items/interstellar.jpg', 4.49, 2103, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (7, 'Elden Ring', 'FromSoftware''in açık dünya soulslike başyapıtı.', '/items/eldenring.jpg', 4.55, 1730, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (8, 'Mantı', 'Kayseri usulü, sarımsaklı yoğurtla servis edilir.', '/items/manti.jpg', 4.31, 412, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (9, 'Blade Runner 2049', 'Neon ışıklı distopik gelecekte bir replikant avcısının izini süren görsel şölen.', '/items/bladerunner.jpg', 4.34, 1156, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (10, 'Yüzüklerin Efendisi: Yüzük Kardeşliği', 'Orta Dünya''da Tek Yüzük''ü yok etme yolculuğunun destansı başlangıcı.', '/items/lotr.jpg', 4.78, 2680, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (11, 'Mad Max: Fury Road', 'Kıyamet sonrası çölde durmak bilmeyen bir hayatta kalma kovalamacası.', '/items/madmax.jpg', 4.41, 1394, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (12, 'Game of Thrones', 'Demir Taht için verilen acımasız entrika ve iktidar savaşı.', '/items/got.jpg', 4.29, 3120, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (13, 'Chernobyl', '1986 nükleer felaketini ve ardındaki insanlık dramını anlatan mini dizi.', '/items/chernobyl.jpg', 4.81, 1502, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (14, 'The Sopranos', 'Mafya babası Tony Soprano''nun terapi koltuğundaki çelişkileri.', '/items/sopranos.jpg', 4.66, 1188, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (15, 'The Office', 'Bir kağıt şirketinde geçen, sahte belgesel formatında ofis komedisi.', '/items/office.jpg', 4.63, 1975, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (16, 'The Legend of Zelda: Breath of the Wild', 'Hyrule''ün uçsuz bucaksız açık dünyasında özgür keşif macerası.', '/items/zelda.jpg', 4.74, 2044, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (17, 'Red Dead Redemption 2', 'Vahşi Batı''nın son günlerinde bir çete üyesinin sürükleyici hikâyesi.', '/items/rdr2.jpg', 4.69, 1867, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (18, 'Dark Souls', 'Zorluğuyla nam salmış, kasvetli ve ödüllendirici bir soulslike klasiği.', '/items/darksouls.jpg', 4.52, 1421, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (19, 'Lahmacun', 'İnce hamur üzerine kıymalı harç; limon ve maydanozla dürüm yapılır.', '/items/lahmacun.jpg', 4.38, 903, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (20, 'Baklava', 'Kat kat yufka, Antep fıstığı ve şerbetle taçlanan geleneksel tatlı.', '/items/baklava.jpg', 4.62, 1287, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (21, 'Adana Kebap', 'Zırhla kıyılmış etin acılı, közde pişen meşhur şiş kebabı.', '/items/adana.jpg', 4.51, 1042, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (22, 'Beethoven - 9. Senfoni', 'Sevinç Korosu''yla doruğa çıkan, tarihin en görkemli senfonilerinden biri.', '/items/symphony.jpg', 4.83, 771, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (23, 'Mozart - Requiem', 'Bestecinin tamamlayamadan öldüğü, ölümü anlatan görkemli ayin müziği.', '/items/score.jpg', 4.71, 645, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (24, 'Vivaldi - Dört Mevsim', 'Dört keman konçertosunda mevsimlerin sesini resmeden barok başyapıt.', '/items/violin.jpg', 4.6, 812, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (25, 'Bach - Toccata ve Füg', 'Borulu orgun gücünü sergileyen, ikonik ve dramatik org eseri.', '/items/organ.jpg', 4.57, 583, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (26, 'Türk Çayı', 'İnce belli bardakta, tavşan kanı demlenen günlük ritüel.', '/items/cay.jpg', 4.66, 1508, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (27, 'Türk Kahvesi', 'Kumda pişen, yanında lokumuyla servis edilen köpüklü klasik.', '/items/kahve.jpg', 4.55, 1194, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (28, 'İskender', NULL, '/duels/iskender.jpg', 0, 0, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (29, 'The Wire', NULL, '/duels/wire.jpg', 0, 0, 0, 0, 0);
INSERT IGNORE INTO items (item_id, name, description, image_url, global_score, total_votes, upvote_count, downvote_count, is_deleted) VALUES (30, 'Çay', NULL, '/duels/cay.jpg', 0, 0, 0, 0, 0);

-- item-kategori baglari
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (1, 1);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (2, 2);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (3, 3);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (4, 4);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (5, 5);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (6, 1);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (7, 3);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (8, 4);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (9, 1);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (10, 1);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (11, 1);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (12, 2);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (13, 2);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (14, 2);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (15, 2);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (16, 3);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (17, 3);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (18, 3);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (19, 4);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (20, 4);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (21, 4);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (22, 5);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (23, 5);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (24, 5);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (25, 5);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (26, 4);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (27, 4);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (28, 4);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (29, 2);
INSERT IGNORE INTO item_categories (item_id, category_id) VALUES (30, 4);

-- ek tohum kullanicilari (sifre: rankhell123)
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (3, 'kullanici3', 'kullanici3@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (4, 'kullanici4', 'kullanici4@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (5, 'kullanici5', 'kullanici5@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (6, 'kullanici6', 'kullanici6@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (7, 'kullanici7', 'kullanici7@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (8, 'kullanici8', 'kullanici8@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (9, 'kullanici9', 'kullanici9@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (10, 'kullanici10', 'kullanici10@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (11, 'kullanici11', 'kullanici11@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (12, 'kullanici12', 'kullanici12@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (13, 'kullanici13', 'kullanici13@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (14, 'kullanici14', 'kullanici14@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (15, 'kullanici15', 'kullanici15@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (16, 'kullanici16', 'kullanici16@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (17, 'kullanici17', 'kullanici17@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (18, 'kullanici18', 'kullanici18@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (19, 'kullanici19', 'kullanici19@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
INSERT IGNORE INTO users (user_id, username, email, password_hash, role, is_terms_accepted, is_kvkk_accepted, created_at) VALUES (20, 'kullanici20', 'kullanici20@rankhell.dev', '$2a$10$.GP7IOlMCkhJqy/.Pm7T0.khPMn.A4xO9RVaGOnQC9rHDRKN3WFs.', 'USER', 1, 1, '2026-06-01 09:00:00');
UPDATE users SET role = 'ADMIN' WHERE username = 'erkan';

-- anketler
INSERT IGNORE INTO custom_polls (poll_id, creator_id, title, description, cover_url, category_id, featured, global_score, total_ratings, play_count, created_at) VALUES (1, 2, 'Ekranın en iyisi hangisi?', 'Listeler kavga çıkarır. Bu sefer sırayı sen kur — tek bir yapım tepede kalacak.', '/items/godfather.jpg', NULL, 1, 4.2, 7, 819, '2026-06-15 11:00:00');
INSERT IGNORE INTO poll_modes (poll_id, mode) VALUES (1, 'bracket');
INSERT IGNORE INTO poll_modes (poll_id, mode) VALUES (1, 'duel');
INSERT IGNORE INTO poll_modes (poll_id, mode) VALUES (1, 'blind');
INSERT IGNORE INTO poll_modes (poll_id, mode) VALUES (1, 'tier');
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 1);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 6);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 9);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 10);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 11);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 2);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 12);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 13);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 14);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (1, 15);
INSERT IGNORE INTO custom_polls (poll_id, creator_id, title, description, cover_url, category_id, featured, global_score, total_ratings, play_count, created_at) VALUES (2, 1, 'Hangi yemek Türkiye''nin en iyisi?', 'Masada son söz kimin? Sofranın tartışmasız birincisini seçmek sandığından zor.', '/items/iskender.jpg', 4, 0, 3.6, 12, 2214, '2026-06-20 16:45:00');
INSERT IGNORE INTO poll_modes (poll_id, mode) VALUES (2, 'duel');
INSERT IGNORE INTO poll_modes (poll_id, mode) VALUES (2, 'tier');
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (2, 4);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (2, 8);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (2, 19);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (2, 20);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (2, 21);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (2, 26);
INSERT IGNORE INTO poll_items (poll_id, item_id) VALUES (2, 27);

-- duellolar
INSERT IGNORE INTO duels (duel_id, title, item_a_id, item_b_id, votes_a, votes_b, creator_id, created_at) VALUES (1, 'Kebap masasında son söz', 21, 28, 796, 488, 1, '2026-07-01 10:00:00');
INSERT IGNORE INTO duels (duel_id, title, item_a_id, item_b_id, votes_a, votes_b, creator_id, created_at) VALUES (2, 'Altın çağın iki devi', 2, 29, 1120, 954, 1, '2026-07-01 10:00:00');
INSERT IGNORE INTO duels (duel_id, title, item_a_id, item_b_id, votes_a, votes_b, creator_id, created_at) VALUES (3, 'Açık dünyanın tahtı', 7, 3, 688, 731, 1, '2026-07-01 10:00:00');
INSERT IGNORE INTO duels (duel_id, title, item_a_id, item_b_id, votes_a, votes_b, creator_id, created_at) VALUES (4, 'Sinemanın ağır topları', 1, 6, 1502, 1187, 1, '2026-07-01 10:00:00');
INSERT IGNORE INTO duels (duel_id, title, item_a_id, item_b_id, votes_a, votes_b, creator_id, created_at) VALUES (5, 'Fincanda biten kavga', 30, 27, 2210, 1640, 1, '2026-07-01 10:00:00');

-- gunun siralamasi icin oylar (dun + bugun)
-- dun
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (1, 1, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (2, 1, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (3, 1, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (4, 1, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (5, 1, -1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (6, 1, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (1, 2, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (2, 2, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (3, 2, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (4, 2, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (5, 2, -1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (6, 2, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (7, 2, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (8, 2, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (9, 2, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (10, 2, -1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (1, 4, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (2, 4, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (1, 6, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (2, 6, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (3, 6, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (4, 6, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (1, 7, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (2, 7, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (3, 7, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (4, 7, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (5, 7, -1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (6, 7, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (7, 7, 1, '2026-08-10 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (8, 7, 1, '2026-08-10 10:00:00');
-- bugun
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (7, 1, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (8, 1, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (9, 1, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (10, 1, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (11, 1, -1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (11, 2, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (12, 2, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (13, 2, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (14, 2, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (15, 2, -1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (16, 2, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (17, 2, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (18, 2, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (19, 2, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (3, 4, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (4, 4, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (5, 4, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (6, 4, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (7, 4, -1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (8, 4, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (9, 4, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (9, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (10, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (11, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (12, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (13, 7, -1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (14, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (15, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (16, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (17, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (18, 7, -1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (19, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (20, 7, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (1, 9, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (2, 9, 1, '2026-08-11 10:00:00');
INSERT IGNORE INTO item_votes (user_id, item_id, vote_value, created_at) VALUES (3, 9, 1, '2026-08-11 10:00:00');

SET FOREIGN_KEY_CHECKS = 1;
