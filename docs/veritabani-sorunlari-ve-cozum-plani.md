# RankHell — Veritabanı Sağlamlaştırma Planı

## Context

Backend'deki tüm entity'lere controller eklendikten sonra veritabanı bağlantısı kontrol edildi ve **Aiven MySQL sunucusuna hiç erişilemediği** tespit edildi. Bu incelemede, bağlantı sorununun yanı sıra ortak veritabanını riske atan bir dizi yapılandırma sorunu da ortaya çıktı: şema versiyonlanmıyor, testler canlı veritabanına bağlanıyor, zaman damgaları iki farklı saat kaynağından yazılıyor ve TLS zorunluluğu aslında uygulanmıyor.

Bu plan iki şeyi hedefliyor:
1. Ekibin veritabanına yeniden bağlanabilmesi (bloker, kod dışı).
2. Ortak veritabanının bir daha "uygulamayı ilk başlatanın entity'lerine göre şekillenen" bir yapı olmaktan çıkarılması.

Hedeflenen sonuç: şeması versiyonlu, testleri izole, zaman damgaları tutarlı ve bağlantı ayarları açık şekilde tanımlanmış bir backend.

**Kapsam dışı:** Frontend–backend entegrasyonu. Bu planda hiçbir frontend dosyasına dokunulmuyor.

---

## Bulgu özeti

| # | Önem | Sorun | Faz |
|---|---|---|---|
| 1 | 🔴 Bloker | Aiven MySQL sunucusuna TCP erişimi yok | Ön koşul |
| 2 | 🟠 Yüksek | `ddl-auto=update` ortak DB şemasını kontrolsüz değiştiriyor | Faz 2 |
| 3 | 🟠 Yüksek | Testler canlı ortak veritabanına bağlanıyor | Faz 3 |
| 4 | 🟡 Orta | Zaman damgaları UTC ve UTC+3 olarak karışık yazılıyor | Faz 4 |
| 5 | 🟡 Orta | `ssl-mode=REQUIRED` geçersiz parametre, TLS zorunlu değil | Faz 1 |
| 6 | 🟡 Orta | Hikari havuz limiti ayarsız, Aiven bağlantı limiti aşılabilir | Faz 1 |
| 7 | 🟡 Orta | FK'larda `ON DELETE` politikası yok, kullanıcı silinemiyor | Faz 5 |
| 8 | 🔵 Düşük | Konfigürasyon iki dosyada tekrarlanmış, `show-sql` açık | Faz 1 |
| 9 | 🔵 Düşük | Tablo isimlendirmesi tutarsız (`Users` vs `user_login_logs`) | Faz 5 |

---

## Ön koşul (Bloker) — Aiven erişimi geri kazanılmalı

**Bu adım kod değişikliği değil; iş arkadaşının Aiven konsolunda yapması gereken kontroller.** Sonraki fazların hiçbiri veritabanına erişmeden doğrulanamaz.

### Sorun
Sunucuya TCP bağlantısı kurulamıyor.

### Kanıt
| Test | Sonuç |
|---|---|
| DNS çözümleme | ✅ `rankhell-...aivencloud.com` → `159.223.208.192` |
| ICMP ping | ✅ yanıt veriyor |
| TCP 27869 (DB portu) | ❌ zaman aşımı (WinSock 10060) |
| TCP 3306 / 443 (aynı host) | ❌ zaman aşımı |
| TCP 443 → github.com (kontrol) | ✅ başarılı |
| `mysqlsh` bağlantısı | ❌ `MySQL Error 2003 (HY000) ... (10060)` |

Yerel ağ sorunu değil (kontrol bağlantısı çalışıyor) ve kimlik doğrulama sorunu değil (TCP el sıkışması hiç tamamlanmıyor). Host ICMP'ye yanıt veriyor ama denenen hiçbir TCP portu bağlantı kabul etmiyor.

### Kontrol sırası
1. **Servis durumu:** Aiven konsolunda servis `POWERED OFF` / `REBUILDING` mi? Ücretsiz ve deneme planlarında kullanılmayan servisler otomatik kapatılır; DNS kaydı ayakta kalır ama düğüm durur — gözlenen tablo tam olarak budur. **En olası neden.**
2. **Allowed IP addresses:** Allowlist'te ekibin güncel public IP'leri var mı? Liste dışı trafik sessizce düşürülür. (Herkes kendi IP'sini `curl ifconfig.me` ile alıp eklemeli.)
3. **Bağlantı bilgileri:** Servis yeniden oluşturulduysa host/port değişmiş olabilir. Konsoldaki değerler `application-mysql.properties` içindekilerle karşılaştırılmalı (dosyadaki port: `27869`).

### Çıkış kriteri
```
mysqlsh --sql --uri 'mysql://<user>:<pass>@<host>:<port>/rankhell' -e "SELECT VERSION(); SHOW TABLES;"
```
komutu tablo listesini döndürüyor.

> ⚠️ **Şema doğrulaması yapılamadı.** DB erişilemez olduğu için tabloların/kolonların entity'lerle uyumu kontrol edilemedi. Aşağıdaki bulgular kod ve konfigürasyon üzerinden statik olarak tespit edildi. Erişim geri geldiğinde Faz 2'nin ilk adımı bu doğrulamayı yapar.

---

## Faz 1 — Bağlantı konfigürasyonunun temizlenmesi

Bağımsız faz; Aiven erişimi beklenmeden yazılabilir, ancak doğrulaması erişim gerektirir.

### Değişecek dosyalar
- `Backend/rankback/src/main/resources/application.properties`
- `Backend/rankback/src/main/resources/application-mysql.properties` (git-ignored, her geliştiricide ayrı)

### Yapılacaklar

**1.1 — TLS zorunluluğu (Bulgu 5).**
`application-mysql.properties:2` içindeki JDBC URL'inde `ssl-mode=REQUIRED` kullanılıyor. Bu MySQL **komut satırı** parametresi; JDBC sürücüsünün karşılığı `sslMode`. Sürücü tanımadığı parametreyi yok sayıyor ve varsayılan `PREFERRED` moduna düşüyor. Aiven sunucu tarafında TLS zorunlu tuttuğu için bağlantı bugün yine şifreli kuruluyor, ama istemci tarafında zorunluluk uygulanmıyor.

→ `ssl-mode=REQUIRED` yerine `sslMode=REQUIRED`. Sertifika doğrulaması da isteniyorsa `sslMode=VERIFY_CA` + Aiven CA sertifikası bir truststore'a eklenir.

**1.2 — Kimlik bilgisi tekrarının kaldırılması (Bulgu 8).**
Kullanıcı adı ve şifre hem JDBC URL'inin içinde hem de ayrı `spring.datasource.username` / `password` satırlarında duruyor. Biri değiştirilip diğeri unutulursa teşhisi zor bir hata çıkar.

→ URL'den kimlik bilgileri çıkarılır, yalnızca ayrı property'lerde tutulur. Property'ler de env değişkeninden okunacak şekilde yazılır (`jwt.secret` için zaten kullanılan desen):
```properties
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

**1.3 — Bağlantı havuzu limiti (Bulgu 6).**
HikariCP varsayılanı örnek başına 10 bağlantı; Aiven ücretsiz planlarında toplam limit ~20-25. İki geliştirici aynı anda çalıştırdığında (devtools yeniden başlatmalarıyla birlikte) limit dolar ve "too many connections" alınır.

→ `spring.datasource.hikari.maximum-pool-size=5` eklenir. Aiven konsolundan planın gerçek `max_connections` değeri teyit edilir.

**1.4 — Tekrarlanan property'lerin tekilleştirilmesi (Bulgu 8).**
`ddl-auto`, `hibernate.dialect` ve `show-sql` her iki dosyada birden tanımlı.

→ Ortak değerler yalnızca `application.properties`'te; `application-mysql.properties` sadece datasource'a özel satırları içerir. `show-sql` ortak/paylaşımlı ortamda `false` yapılır (lokal profilde açık kalabilir).

**1.5 — Profil sabitlemesinin kaldırılması (Bulgu 3'ün ön adımı).**
`application.properties:6` içindeki `spring.profiles.active=mysql` satırı dosyadan silinir; profil `SPRING_PROFILES_ACTIVE` ortam değişkeninden verilir. Bu satır sabit kaldığı sürece Faz 3'teki test izolasyonu çalışmaz.

---

## Faz 2 — Flyway ile şema kontrolü (Bulgu 2)

### Sorun
`application.properties` ve `application-mysql.properties` ikisinde de `ddl-auto=update`; `pom.xml`'de migration aracı yok. Sonuç: uygulamayı ilk başlatan kişinin lokal entity'leri **ortak veritabanının şemasını değiştiriyor.** Ayrıca `update` mevcut kolonları hiçbir zaman `ALTER`/`DROP` etmez — entity'de değişen bir kolon tanımı DB'ye yansımaz ve şema sessizce ayrışır.

Somut örnek: son değişiklikte eklenen `Item_Tags`, `Item_Comments`, `Item_Votes` tabloları ve dört entity'deki `created_at` düzeltmesi henüz hiçbir yere uygulanmadı; şu anda uygulamayı ilk çalıştıracak kişi tarafından ortak DB'ye yazılacak.

### Adımlar

**2.1 — Mevcut şemanın tespiti.**
Aiven erişimi geri geldiğinde, canlı şema entity'lerle karşılaştırılır:
```
mysqlsh --sql --uri '...' -e "SHOW TABLES; SHOW CREATE TABLE Items; SHOW CREATE TABLE Users;"
```
Hangi tabloların gerçekten var olduğu ve `created_at` kolonlarının `DEFAULT CURRENT_TIMESTAMP` taşıyıp taşımadığı not edilir. Baseline bu çıktıya göre yazılır.

**2.2 — Flyway bağımlılığı.**
`Backend/rankback/pom.xml` içine `flyway-core` ve `flyway-mysql` eklenir. (Spring Boot parent 4.1.0 sürümü yönetiyor, `<version>` yazılmaz.)

**2.3 — Baseline migration.**
`src/main/resources/db/migration/V1__baseline.sql` — 2.1'de tespit edilen **mevcut canlı şemanın** birebir karşılığı. Üretimi:
```
mysqldump --no-data --skip-add-drop-table -h <host> -P <port> -u <user> -p rankhell
```
Var olan bir veritabanına Flyway'i tanıtmak için:
```properties
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=1
```

**2.4 — Yeni yapıların migration'ı.**
`V2__card_system_tables.sql` — baseline'da bulunmayan her şey:
- `Item_Tags`, `Item_Comments`, `Item_Votes` tabloları (entity tanımlarıyla birebir: unique constraint'ler, FK'lar, `is_deleted`, `created_at DEFAULT CURRENT_TIMESTAMP`)
- Baseline'da `created_at` default'u eksik olan tablolarda `ALTER TABLE ... MODIFY` ile default eklenmesi

Referans entity dosyaları: `entity/ItemTag.java`, `entity/ItemComment.java`, `entity/ItemVote.java`, `entity/Rating.java`, `entity/CustomPoll.java`.

**2.5 — Hibernate'in şema yazma yetkisinin alınması.**
`ddl-auto=update` → `ddl-auto=validate`. Bu andan itibaren entity ile şema uyuşmazlığı uygulamayı **açılışta hata verdirir** — sessiz ayrışma biter.

### Karar notu
Bu fazdan sonra her entity değişikliği beraberinde bir `V<n>__*.sql` dosyası gerektirir. Ekip içinde şu kural netleştirilmeli: *migration dosyası olmayan entity değişikliği merge edilmez.*

---

## Faz 3 — Test izolasyonu (Bulgu 3)

### Sorun
`src/test/java/com/example/rankback/RankbackApplicationTests.java` sade bir `@SpringBootTest`; hiçbir property override'ı yok. `spring.profiles.active=mysql` sabit yazılı olduğu için `mvn test` çalıştıran herkesin context'i **canlı Aiven veritabanına** bağlanıyor — Faz 2 öncesinde bu, `ddl-auto=update` ile ortak şemayı da değiştiriyor demek.

### Adımlar

**3.1** — `pom.xml`'e `com.h2database:h2` (`<scope>test</scope>`) eklenir.

**3.2** — `src/test/resources/application-test.properties` oluşturulur:
```properties
spring.datasource.url=jdbc:h2:mem:rankhell;MODE=MySQL;DATABASE_TO_LOWER=TRUE
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.flyway.enabled=false
jwt.secret=test-only-secret-key-at-least-32-bytes-long
```
`ddl-auto=create-drop` yalnızca test profilinde; Flyway testlerde devre dışı (MySQL'e özgü DDL H2'de çalışmaz).

**3.3** — `RankbackApplicationTests` sınıfına `@ActiveProfiles("test")` eklenir.

**3.4** — Faz 1.5 ile birlikte: hiçbir test artık ortak DB'ye bağlanamaz.

### Bilinen sınırlama
H2 `MODE=MySQL` altında bile MySQL'e birebir eşdeğer değil; `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` davranışı ve büyük/küçük harf duyarlılığı farklıdır. Bu yüzden Faz 2'deki migration'lar H2'de değil, gerçek MySQL'de doğrulanmalı (bkz. Doğrulama bölümü).

---

## Faz 4 — Zaman damgası tutarlılığı (Bulgu 4)

### Sorun
JDBC URL'inde `connectionTimeZone` / `serverTimezone` tanımlı değil. Aiven sunucuları UTC, geliştirici makineleri UTC+3. Zaman damgaları iki ayrı kaynaktan geliyor:

- `Users.created_at` → DB tarafında `CURRENT_TIMESTAMP` (UTC)
- `Users.agreement_date` → `service/AuthService.java` içinde `LocalDateTime.now()` (UTC+3)

Yani **aynı satırdaki iki tarih 3 saat farkla** kaydediliyor. Sıralama, tarih filtreleri ve "kaç dakika önce" tipi gösterimler buradan bozulur.

### Adımlar

**4.1 — Bağlantı saat dilimi sabitlenir.**
JDBC URL'ine `connectionTimeZone=UTC&preserveInstants=true` eklenir.

**4.2 — Tek bir zaman kaynağı seçilir.**
Öneri: **uygulama tarafı**. Halihazırda `CommentService`, `VoteService`, `RatingService`, `PollService` ve `AuthService` değeri `LocalDateTime.now()` ile set ediyor; tutarsız kalan tek yer `Users.created_at`'in DB default'una bırakılmış olması.

→ `entity/User.java` içindeki `created_at` alanından `insertable = false` kaldırılır (diğer dört entity'de bu düzeltme yapıldı) ve `AuthService.register` değeri açıkça set eder. DB default'u yedek olarak yerinde kalır.

**4.3 — `LocalDateTime.now()` çağrıları `LocalDateTime.now(ZoneOffset.UTC)` yapılır** — ya da tercih edilirse alan tipleri `Instant`'a çevrilir (daha temiz ama DTO'ları da etkiler, ayrı bir iş olarak ele alınabilir).

### ⚠️ Veriyi etkileyen değişiklik
`connectionTimeZone=UTC` mevcut satırların **okunma şeklini** değiştirir: bugüne kadar yerel saatle yazılmış değerler 3 saat kaymış görünür. Veri hacmi hâlâ küçükken yapılmalı; gerekiyorsa tek seferlik düzeltme UPDATE'i de bir Flyway migration'ı olarak yazılır.

---

## Faz 5 — Şema tasarımı düzeltmeleri (Bulgu 7, 9)

Bu faz **ekip kararı gerektirir**, doğrudan uygulanmamalı.

**5.1 — FK silme politikası (Bulgu 7).**
`Users`; `Item_Votes`, `Ratings`, `Item_Comments`, `Custom_Polls` ve `user_login_logs` tarafından referans alınıyor ve hiçbirinde `ON DELETE` kuralı yok. Bir kullanıcıyı silme girişimi constraint hatasıyla başarısız olur — bu yüzden kullanıcı silme endpoint'i yazılmadı. Aynı durum `Category` ve `Tag` için de geçerli (bu ikisinde bağlantı satırları servis katmanında elle siliniyor).

Önerilen yön: `Item` ve `ItemComment`'te olduğu gibi `User`'a da `is_deleted` alanı + `@SQLRestriction` eklenip **hard delete hiç kullanılmaması**. KVKK silme talebi gerekirse ayrıca bir anonimleştirme akışı tasarlanır. Karar verilirse `V<n>__user_soft_delete.sql` migration'ı ve `UserController`'a silme endpoint'i eklenir.

**5.2 — Tablo isimlendirmesi (Bulgu 9).**
On entity PascalCase (`Users`, `Items`, `Item_Categories`), yalnızca `UserLoginLog` snake_case (`user_login_logs`). Linux MySQL'de (`lower_case_table_names=0`) tablo adları büyük/küçük harf duyarlıdır; dump başka bir işletim sistemine geri yüklenirse davranış değişir.

Öneri: **şimdilik dokunulmasın.** Tablo yeniden adlandırma, çalışan bir sistemde kazandırdığından fazlasını riske atar. Faz 2'den sonra bir migration'la tek seferde yapılabilir; karar ekibe bırakılıyor.

---

## Doğrulama

Sırayla, her faz sonunda:

**Ön koşul**
```
mysqlsh --sql --uri 'mysql://...' -e "SELECT VERSION(); SHOW TABLES;"
```
→ tablo listesi dönmeli.

**Faz 1**
```
cd Backend/rankback && ./mvnw -o test-compile
```
→ derleme temiz. Ardından uygulama env değişkenleriyle açılır, log'da datasource hatası olmamalı.

**Faz 2**
```
./mvnw -o spring-boot:run
```
→ Açılışta Flyway `V1`/`V2` uyguladığını log'lamalı, ardından Hibernate `validate` hatasız geçmeli. Uygulama ayağa kalkıyorsa entity–şema uyumu kanıtlanmış olur (bu, `validate`'in tek işi).
```
mysqlsh --sql --uri '...' -e "SELECT version, description, success FROM flyway_schema_history;"
```
→ tüm satırlar `success = 1`.

**Faz 3**
```
./mvnw -o test
```
→ `contextLoads` geçmeli. Kritik kontrol: **ağ bağlantısı kapalıyken de geçmeli** — geçiyorsa testler artık ortak DB'ye bağlanmıyor demektir.

**Faz 4**
Bir kullanıcı kaydı oluşturulup:
```sql
SELECT user_id, created_at, agreement_date, TIMESTAMPDIFF(MINUTE, created_at, agreement_date) AS fark
FROM Users ORDER BY user_id DESC LIMIT 1;
```
→ `fark` sıfıra yakın olmalı (şu an ~180 dakika bekleniyor).

**Uçtan uca duman testi**
Faz 2 sonrası, yeni tabloların gerçekten çalıştığı doğrulanır — kayıt ol → giriş yap → `POST /api/items/{id}/comments` → `PUT /api/items/{id}/votes` → `PUT /api/items/{id}/ratings` → `GET /api/items/{id}` çağrısında `globalScore` ve `totalVotes` güncellenmiş olmalı.

---

## Değişecek dosyalar

| Dosya | Faz |
|---|---|
| `Backend/rankback/src/main/resources/application.properties` | 1, 2 |
| `Backend/rankback/src/main/resources/application-mysql.properties` | 1, 4 |
| `Backend/rankback/pom.xml` | 2, 3 |
| `Backend/rankback/src/main/resources/db/migration/V1__baseline.sql` *(yeni)* | 2 |
| `Backend/rankback/src/main/resources/db/migration/V2__card_system_tables.sql` *(yeni)* | 2 |
| `Backend/rankback/src/test/resources/application-test.properties` *(yeni)* | 3 |
| `Backend/rankback/src/test/java/com/example/rankback/RankbackApplicationTests.java` | 3 |
| `Backend/rankback/src/main/java/com/example/rankback/entity/User.java` | 4 |
| `Backend/rankback/src/main/java/com/example/rankback/service/AuthService.java` | 4 |

---

## İyi haber

Kimlik bilgileri sızmamış: `application-mysql.properties`, `Backend/rankback/.gitignore:36` ile ignore edilmiş, dosya hiçbir commit'te yok ve tüm git geçmişinde (`git grep` ile `git rev-list --all` üzerinde) şifre stringi bulunamadı. Faz 1.2'deki env değişkeni önerisi bu durumu daha da sağlamlaştırmak için; acil bir sızıntı müdahalesi gerekmiyor.
