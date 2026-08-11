-- Giris denemelerinin tamamini kaydedebilmek icin user_login_logs semasi.
--
-- V1 bu tabloyu yalnizca BASARILI girisler icin tasarlamisti. Artik basarisiz
-- denemeler de yaziliyor ve bu uc degisikligi gerektiriyor:
--
-- 1. user_id bos olabilmeli: bilinmeyen bir e-postayla giris denenirse
--    esleseecek kullanici yoktur, ama denemenin kaydi tutulmalidir.
-- 2. attempted_email: hangi e-postayla denendigi. Kullanici bulunamasa bile
--    saldiri desenini gormeyi saglar.
-- 3. success: denemenin sonucu. DEFAULT TRUE bilincli -- bu kolon eklenmeden
--    once yazilmis tum satirlar basarili girislerdi, yanlislikla "basarisiz"
--    damgalanmamalilar.

ALTER TABLE User_Login_Logs
    MODIFY COLUMN user_id INT NULL,
    ADD COLUMN attempted_email VARCHAR(100) NULL,
    ADD COLUMN success BOOLEAN NOT NULL DEFAULT TRUE;

-- Gecmis kayitlarin attempted_email'ini kullanicinin e-postasindan doldur.
UPDATE User_Login_Logs l
    JOIN Users u ON u.user_id = l.user_id
SET l.attempted_email = u.email
WHERE l.attempted_email IS NULL;
