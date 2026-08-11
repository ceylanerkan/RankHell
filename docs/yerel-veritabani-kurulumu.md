# Yerel Veritabanı Kurulumu

Ortak Aiven sunucusu ara ara erişilemez oluyor ve geliştirme testleri ortak
veritabanına test verisi yazıyordu. Bu kurulumla geliştirme tamamen kendi
bilgisayarında döner; ortak veritabanı sadece takım verisi için kalır.

Gereken: **MySQL Server 8.x** (Windows kurulumunda MySQL Shell ile birlikte gelir).

## 1. Veritabanını ve kullanıcıyı oluştur

Bir kez çalıştırılır. Root şifreni soracak:

```powershell
& "C:\Program Files\MySQL\MySQL Shell 8.0\bin\mysqlsh.exe" --sql --uri "mysql://root@localhost:3306" -e "CREATE DATABASE IF NOT EXISTS rankhell CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'rankhell'@'localhost' IDENTIFIED BY 'rankhell_dev'; GRANT ALL PRIVILEGES ON rankhell.* TO 'rankhell'@'localhost'; FLUSH PRIVILEGES;"
```

Uygulamaya root verilmiyor; sadece `rankhell` veritabanına yetkili ayrı bir
kullanıcı açılıyor.

> Buradaki şifre gizli bilgi değil — yalnızca `localhost`'taki geliştirme
> veritabanına ait. Ortak/yayın ortamlarının şifresi dosyaya yazılmaz, ortam
> değişkeninden gelir (`DB_USERNAME` / `DB_PASSWORD`).

## 2. Backend'i yerel profille başlat

```bash
cd Backend/rankback
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

İlk açılışta Hibernate 15 tabloyu kurar. Ayarlar:
[application-local.properties](../Backend/rankback/src/main/resources/application-local.properties)

Profili vermezsen varsayılan `mysql` profili (Aiven) devreye girer.

## 3. Tohum verisini yükle

Boş veritabanında site bomboş görünür. Örnek veri:

```powershell
& "C:\Program Files\MySQL\MySQL Shell 8.0\bin\mysqlsh.exe" --sql --uri "mysql://rankhell:rankhell_dev@localhost:3306/rankhell" --file=docs/db/seed-local.sql
```

Tekrar çalıştırılabilir (hepsi `INSERT IGNORE`). Yüklediği:

| Veri | Adet |
|---|---|
| Kategori | 5 |
| Item | 30 |
| Kullanıcı | 20 |
| Anket | 2 |
| Düello | 5 |
| Item oyu | 66 (dün + bugün) |

Oylar bilerek dün ve bugüne yayıldı ki **Günün Sıralaması**'ndaki rozetlerin
hepsi görünsün: yükselen, düşen ve "yeni".

### Kullanıcılar

Hepsinin şifresi `rankhell123`.

| Kullanıcı | E-posta | Rol |
|---|---|---|
| erkan | erkan@rankhell.dev | ADMIN |
| arda | arda@rankhell.dev | USER |
| kullanici3 … kullanici20 | kullaniciN@rankhell.dev | USER |

> `erkan` ve `arda` API üzerinden kaydedildi (şifreleri gerçek BCrypt).
> Diğer 18'i aynı hash'i paylaşır — yalnızca oy verisi üretebilmek için varlar,
> çünkü `item_votes`'ta `UNIQUE(user_id, item_id)` kısıtı var.

## Sıfırdan başlamak

```sql
DROP DATABASE rankhell;
```

Sonra 1. adımdan devam et.

## Dikkat: yerel MySQL, Aiven'den daha hoşgörülü

Aiven `sql_require_primary_key = ON` ile çalışıyor, yerel kurulum `OFF`.
Birincil anahtarı olmayan bir tablo yerelde sorunsuz oluşur, Aiven'de reddedilir
— ve Hibernate bunu yalnızca `WARN` yazıp geçtiği için uygulama sağlıklı görünüp
ilk istekte patlar. (`poll_modes` tam olarak böyle patladı.)

Yani **yerelde çalışması Aiven'de çalışacağı anlamına gelmez.** Yeni bir entity
eklerken tablosunun birincil anahtarı olduğundan emin ol.

İlgili: [veritabani-sorunlari-ve-cozum-plani.md](veritabani-sorunlari-ve-cozum-plani.md)
