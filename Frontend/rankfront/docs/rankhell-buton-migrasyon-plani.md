# RankHell · Damga v1 Buton Migrasyonu — Uygulanabilir Plan

Bu plan üç isteğini karşılar:

1. **Hatasız migrasyon** → Adım 2–3: önce envanter + onay, sonra rota rota geçiş, her adımda commit ve kontrol. Hata olursa tek komutla geri dönülür.
2. **Gelecekte otomatik doğru varyant seçimi** → Adım 4: karar ağacı kök `CLAUDE.md`'ye yazılır. CLAUDE.md her Claude Code oturumunun başında otomatik yüklenir; yani yeni bir özellik yazdırdığında Claude Code kuralı zaten bilir ve varyantı kendisi seçer. "Doğru yer" iki parçadır: **tek kapı komponent** (`src/components/ui/button/`) + **kök CLAUDE.md kuralı**.
3. **Her şey Claude Code sohbetinden** → Aşağıdaki her adım kopyala-yapıştır bir prompt. Tek manuel işin: bu üç dosyayı indirmek (tarayıcı zaten `~/Downloads`'a koyar). Gerisi terminal.

> Prompt'lar senin "önce plan, sonra uygulama" kuralınla yazıldı. Her prompt'u sırayla, bir önceki bitince gönder.

**Nasıl kullanılır (özet):** Dosyalar Claude Code sohbetine atılmaz — sadece `~/Downloads`'a indirilir; Adım 0 prompt'u onları repoya kendisi taşır. Prompt *yazmazsın*, buradan kopyalayıp yapıştırırsın. Hepsini birden gönderme: adımlar arasında onay kapıları var, hatasızlık bu kapılardan gelir. Kestirme: Adım 1 bittikten sonra plan repoda olduğu için kalan adımları şu tek cümleyle tetikleyebilirsin: `docs/rankhell-buton-migrasyon-plani.md'deki Adım 2'yi uygula` (3 ve 5 için de aynı).

---

## Adım 0 — Dosyaları yerleştir + güvenlik ağı

`Button.jsx`, `button.css` ve bu planı indir. Sonra Claude Code'a:

```
Damga v1 buton sistemine geçiyoruz. Önce hazırlık, henüz hiçbir sayfayı değiştirme:

1. feat/damga-buttons adında yeni bir branch aç.
2. ~/Downloads/Button.jsx ve ~/Downloads/button.css dosyalarını
   src/components/ui/button/ altına taşı (klasör yoksa oluştur).
   ~/Downloads/rankhell-buton-migrasyon-plani.md dosyasını docs/ altına taşı.
3. Dosyaları oku, içeriğini özetle ve commit'le. Başka bir şey yapma.
```

*(Proje yapın `src/` kullanmıyorsa Claude Code zaten fark edip doğru yere koyacaktır — özetinde teyit et.)*

---

## Adım 1 — Bağla, eşle, doğrula

```
docs/rankhell-buton-migrasyon-plani.md dosyasını oku. Şimdi kurulum adımı — plan yap, onayımı al, sonra uygula:

1. Projenin ne olduğunu tespit et (Vite mi Next mi, JS mi TS mi) ve
   button.css'i doğru yerden global olarak bağla (ör. ana CSS dosyasına @import).
   Proje TypeScript ise Button.jsx'i .tsx'e çevir, davranışı değiştirme.
2. button.css'teki --btn-* tokenları YER TUTUCU. Repodaki Kor & Obsidyen
   design system spec'ini ve varsa mevcut CSS renk değişkenlerini bul.
   Palet zaten CSS değişkeni olarak tanımlıysa tokenları doğrudan onlara
   bağla (ör. --btn-accent: var(--ember)); değilse spec'teki hex
   değerlerini yaz. Eşlemeyi bana tablo olarak göster, onayımdan sonra
   uygula. Eşleyemediğin token olursa sor, uydurma.
3. Geçici bir test sayfası/rotasında 8 varyantı da render et
   (hero-primary, primary, secondary, ghost, danger, icon, icon-line, link),
   dev sunucusunu başlat ve konsolda hata olmadığını doğrula.
4. Build'in kırılmadığını kontrol et, commit'le. Test sayfasını silme,
   migrasyon bitince sileceğiz.
```

Bu noktada tarayıcıda test sayfasına bakıp hover/bas/Tab davranışlarını spec sayfasındakiyle karşılaştır. Bir tuhaflık varsa düzelttir, sonra devam et.

---

## Adım 2 — Envanter + migrasyon haritası (henüz kod değişmiyor)

Hatasızlığın anahtarı bu adım: önce **ne değişeceğini** görüp onaylıyorsun.

```
Migrasyon envanteri çıkar, hiçbir dosyayı DEĞİŞTİRME:

1. Frontend'de buton gibi davranan her şeyi bul: <button>, role="button",
   buton gibi stillenmiş <a> ve <div>'ler, eski buton class'ları.
2. Bana bir tablo ver: dosya + satır | mevcut görünüm/görev |
   önerilen Damga varyantı + size | notlar.
   Varyant seçerken docs/rankhell-buton-migrasyon-plani.md sonundaki
   karar ağacını kullan.
3. Emin olamadıklarını ayrı bir "kararsızlar" listesinde topla,
   her biri için iki seçenek + gerekçe sun.
4. Eski buton stillerinin (CSS/Tailwind class'ları) nerede tanımlı
   olduğunu da listele — migrasyon sonunda ölü kod olarak sileceğiz.
Tabloyu onaylamadan hiçbir değişiklik yapma.
```

**Onaylarken dikkat:** landing'deki pill butonlardan yalnızca ana çağrı `hero-primary` kalır; "Anket Oluştur" gibi ikincil pill'ler `secondary`'ye döner ve **pill görünümünü kaybeder** (köşe dili kuralı: pill sadece vitrin). Bu bilinçli bir görsel değişiklik — tabloda görünce şaşırma, onayla ya da tartış.

---

## Adım 3 — Migrasyon (rota rota, commit commit)

```
Onayladığım envanter tablosuna göre migrasyona başla. Kurallar:

1. Rota/sayfa bazında ilerle: bir rotayı bitir, dev'de görsel olarak
   kontrol etmem için bana haber ver, onayımdan sonra commit'leyip
   sıradakine geç.
2. Davranış DEĞİŞMEZ: onClick, href, disabled, form submit, aria
   öznitelikleri birebir korunur. Sadece görünüm Damga'ya geçer.
3. Async aksiyonlara (oy verme, kaydetme, silme) loading prop'unu bağla;
   kendi spinner'ı olan yerlerdeki spinner'ları kaldır.
4. icon varyantı kullandığın her yerde aria-label ekle.
5. Her rotada Supabase'e giden çağrılara ve backend koduna DOKUNMA —
   arkadaşımın alanı, sadece frontend değişir.
6. Tüm rotalar bitince: eski buton stillerini ve Adım 1'deki test
   sayfasını sil, tam build + lint çalıştır, sonucu raporla.
```

Her rotadan sonra 30 saniyelik tur: hover, bas, Tab, bir tane loading tetikle. Sorun görürsen aynı sohbette yazman yeterli; commit'ler küçük olduğu için `git revert` ile tek adım geri alınır.

---

## Adım 4 — Kalıcı kural: CLAUDE.md

Bu adım 2. isteğinin cevabı. Kök `CLAUDE.md` her oturum başında otomatik yüklendiği için buraya yazılan karar ağacı, gelecekte Claude Code'a yazdıracağın her yeni özellikte kendiliğinden devrede olur.

```
Proje kökündeki CLAUDE.md dosyasına (yoksa oluştur) aşağıdaki bloğu ekle,
mevcut içeriği koru, commit'le:

## Buton Sistemi — Damga v1
- Sitedeki HER buton src/components/ui/button/Button üzerinden kullanılır.
  Ham <button>/<a> stillenmez, yeni buton stili yazılmaz.
- Varyant karar ağacı:
  - Landing/marketing vitrini, sayfada tek → hero-primary
  - Görünümün ana aksiyonu (oy ver, kaydet, yayınla) → primary (görünüm başına 1)
  - Ana aksiyonun yanındaki gerçek ikinci yol → secondary
  - Kart içi / toolbar / tekrarlayan, düşük riskli aksiyon → ghost
  - Yıkıcı ve geri alınamaz aksiyon → danger (daima onay adımıyla)
  - Yer dar ve anlam açık → icon (aria-label zorunlu; yoğun zeminde icon-line)
  - Satır içi / üçüncül aksiyon → link (navigasyonsa href ver)
- Async aksiyonlarda loading prop'u kullanılır; spinner eklenmez.
- Renkler yalnızca button.css'teki --btn-* tokenlarından gelir;
  komponent içinde renk override edilmez.
- Boyutlar: sm 32 / md 40 / lg 48; hero 56 ve pill — pill başka hiçbir
  varyanta taşınmaz.
```

Kural repoya commit'lendiği için ekip arkadaşının Claude Code oturumlarında da geçerli olur — sistem ikinizde de aynı davranır.

---

## Adım 5 — Kapanış ve güvence

```
Migrasyonu kapat:

1. Tüm rotaları gezen kısa bir kontrol listesi raporu çıkar:
   her rotada kaç buton var, hangi varyantlar, primary sayısı
   görünüm başına 1'i aşıyor mu, aria-label'sız icon kaldı mı.
2. git log ile migrasyon commit'lerini özetle.
3. feat/damga-buttons branch'ini main'e merge etmek için PR aç,
   açıklamasına önce/sonra özetini yaz.
```

Geri dönüş planı: her şey tek branch'te olduğu için en kötü senaryoda `git checkout main` ile eski hâl 5 saniyede geri gelir; tek bir rotayı geri almak istersen o rotanın commit'ini revert ettirmen yeterli.

---

## Karar ağacı (Claude Code'un Adım 2'de kullanacağı referans)

| Durum | Varyant |
|---|---|
| Landing/marketing ana çağrısı, sayfada tek | `hero-primary` |
| Görünümün ana aksiyonu — oy ver, kaydet, yayınla, gönder | `primary` |
| Ana aksiyonun yanındaki gerçek ikinci yol | `secondary` |
| Kart içi, toolbar, "atla/daha sonra/kapat", tekrarlayan aksiyon | `ghost` |
| Sil, kaldır, hesabı kapat — geri alınamaz | `danger` |
| Yer dar + ikon evrensel (ara, kapat, bildirim) | `icon` / yoğun zeminde `icon-line` |
| Paragraf içi, footer, "tümünü gör" | `link` |

Ezber kuralı: **çentik görüyorsan taahhüt var** (primary/secondary/danger) — geri dönüşü kolay olmayan her aksiyon çentikli bir varyanta gider; sessiz kalabilenler ghost/icon/link'te kalır.
