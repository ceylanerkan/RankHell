-- user_login_logs.id: INT -> BIGINT
--
-- UserLoginLog entity'si id alanini Long tutuyor, V1__baseline.sql ise INT
-- olarak olusturmus. ddl-auto=validate bu uyusmazligi yakalayip uygulamayi
-- acilista durduruyordu:
--   "wrong column type in column [id] in table [user_login_logs];
--    found [int], but expecting [bigint]"
--
-- V1 dogrudan duzeltilmedi: migration'lar eklemelidir, uygulanmis bir dosyayi
-- degistirmek Flyway'in saglama toplamini bozar ve o dosyanin daha once
-- calistigi her veritabaninda hata verir.
--
-- id herhangi bir yabanci anahtar tarafindan referans edilmiyor, bu yuzden
-- tip degisikligi guvenli.

ALTER TABLE User_Login_Logs
    MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;
