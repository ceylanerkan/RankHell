# RankHell Kart Sistemi — Faz 0 Kararları

Bu dosya Claude Code'un Faz 0 raporundaki üç açık noktayı kapatır ve planı **gerçek repoya** göre düzeltir. Repo'ya `docs/design/card-system-decisions.md` olarak koy — Faz 2 promptu bu dosyayı referans alacak. Plandaki/föydeki bir bilgi bu dosyayla çelişirse **bu dosya kazanır**.

---

## KARAR 1 — "Cinder" isim çakışması: föy yanlış, proje kazanır

Föyde yapı rengine "Cinder" dendi; gerçek projede `--color-cinder` (#d64535) **danger/hata kırmızısı**. İsim föyün hatası — kavramı yeniden adlandırıyoruz:

- Yapı rolünün adı artık **"Iron/Line"**: kenar `--color-line`, güçlü kenar `--color-iron`, muted metin `--color-faded`.
- `--color-cinder` kart sisteminde **yalnızca danger** anlamı taşır (silme onayı, hata durumu). Asla kenar, ayraç, muted metin, dekorasyon olarak kullanılmaz.
- Renk görevleri tablosunun son satırı şöyle okunur: **Iron/Line = yapı** · **Cinder = tehlike** (yeni beşinci rol).

## KARAR 2 — ob-3 (hover kademesi): yeni renk türetilmez, Seçenek A

Palette 3 kullanılabilir zemin var (night / coal / coal-light), föy 4 istiyordu. Karar:

| Föy kavramı | Gerçek token |
|---|---|
| ob-0 sayfa | `night` #121212 |
| — en koyu bant (navbar/footer) | `night-deep` #0b0b0d (sistem dışı, olduğu gibi kalır) |
| ob-1 neutral | `coal` #1a1a1d |
| ob-2 raised/ticket | `coal-light` #26262b |
| ob-3 hover | **ayrı token YOK** |

Hover davranışı buna göre:
- **neutral + etkileşimli** hover → zemin `coal` → `coal-light` (bir kademe çıkar, doğal çalışır)
- **raised + etkileşimli** hover → zemin **değişmez** (`coal-light` kalır); hover sinyali kenar (`line`→`iron`) + `e-1` + ember marker'dan gelir
- **active** (basılma) → her iki yüzeyde zemin `coal`'a iner + 1px translateY

Gerekçe: "yeni renk üretme yok" kuralı sistemin bel kemiği; onu ilk engelde delmek yerine raised hover'ı kenar+marker'a emanet ediyoruz. Sert görünümle de uyumlu. İleride gerçekten yetersiz kalırsa `--color-coal-lighter` tek istisna olarak **ayrı kararla** eklenir — Claude Code kendiliğinden ekleyemez.

## KARAR 3 — ticket + navigation: matris değişir, whitelist'le sınırlı izin

Çelişkinin çözümü: föyün §04 whitelist'i asıl niyeti yansıtıyor; matristeki "—" fazla temkinliydi. Tüm kartın tıklanabilir olması (browse UX'i) bu üç imza bileşenin var oluş sebebi — onları static'e çevirip linki içeri gömmek kullanılabilirliği bozar.

**Yeni ticket satırı:** static ✓ · interactive sınırlı · **navigation sınırlı** · selectable — · disabled sınırlı

"Navigation sınırlı" = yalnızca şu üç bileşen: **ItemCard**, **Home kategori kutucukları**, **"Daha fazlası" kartı**. Dördüncü bir ticket+navigation kullanımı ihlaldir. Card primitive'i bu kombinasyonu reddetmez ama dev ortamında uyarı basar ("ticket+navigation whitelist dışında kullanılıyor olabilir").

---

## Stack düzeltmesi (plandaki hatalar)

Faz 0 gerçeği: proje **JS + Vite + react-router**, Next.js değil; token'lar **`src/index.css` içindeki `@theme`** bloğunda (Tailwind v4, ayrı config yok). Buna göre plandaki her yerde:

- `globals.css` → **`src/index.css` (@theme)**
- `next/link` → **`react-router-dom`'dan `Link`**
- `components/ui/Card.tsx` → **`src/components/ui/Card.jsx`**
- Bileşen adları (PollCard, FilterBar...) literal dosya değil; hedefler aşağıdaki gerçek envantere göre.

## Gerçek göç haritası (Faz 3–6 hedefleri)

| Faz | Hedef | Dönüşüm |
|---|---|---|
| 3a | Polls.jsx anket satırı, Profile.jsx iki satır | `card-dark` → **neutral + navigation + compact** |
| 3b | ItemDetail skor paneli, ErrorState | `card-dark`/özel → **neutral + static** |
| 4a | Login/Register form kabuğu | `card-glow` → **raised + static + spacious** — glow/blur SİLİNİR, bilinçli görsel değişiklik |
| 4b | ItemDetail "Puanını ver", Home "Günün Sıralaması" | `card-glow` → **raised + static** — glow silinir; içlerindeki buton/StarRating'e dokunulmaz, kartlar static kalır |
| 5 | Renk denetimi | rapor + düzeltme (kapsam: kart içerikleri; butonlar ve danger-cinder kapsam dışı) |
| 6a | PollNew seçenek toggle'ları | düz button → **raised + selectable** (zemin coal→coal-light'a çıkar, karar gereği) |
| 6b | ItemCard → kategori kutucukları → "daha fazlası" | `card-ticket` → **ticket + navigation** (whitelist) — çentik+perforasyon burada gelir |
| 7 | İstisnalar | DuelWidget, PodiumSpot, "Kendi arenanı kur" banner'ı (glow-metal), TierList satırları (WIP), night-deep bantları → `exceptions.md`. EmptyState + `.tier-slot` zaten dropzone deseni: Card'a çevrilmez, `dropzone` sınıf ailesi olarak belgelenir. |

Sıralama mantığı: en az riskli (neutral satırlar) önce, imza (ticket üçlüsü) sisteme güven geldikten sonra, glow silme işlemleri (görsel olarak en fark edilir değişiklik) ortada tek grupta.

---

## Düzeltilmiş FAZ 2 promptu (bunu kullan, plandakini değil)

```
docs/design/card-system.html, docs/design/card-system-decisions.md ve
docs/DESIGN_SYSTEM.md dosyalarını oku. Çelişki görürsen decisions.md kazanır;
emin olamazsan bana sor.

src/components/ui/Card.jsx oluştur (proje JS + Vite + react-router; TS yok,
Next yok). Token'lar src/index.css @theme'de — YENİ TOKEN EKLEME.

API:
- surface: 'neutral' | 'raised' | 'ticket' (default 'neutral')
- behavior: 'static' | 'interactive' | 'navigation' | 'selectable' | 'disabled' (default 'static')
- padding: 'compact' | 'default' | 'spacious' (default 'default')
- selected: bool — yalnızca selectable ile, aksi halde console.warn
- to: string — yalnızca navigation ile; react-router Link olarak render

Zemin eşlemesi (decisions.md KARAR 2):
- neutral: bg coal; etkileşimli hover'da coal-light
- raised/ticket: bg coal-light; hover'da ZEMİN DEĞİŞMEZ — sinyal:
  kenar line→iron + e-1 (0 blur, 1px koyu) + ember sol marker
- active: her yüzeyde bg coal + translateY(1px)
- Üst iç ışık (--lift) yalnızca raised/ticket'ta

Semantik:
- navigation → react-router <Link>; interactive/selectable → <button>;
  static/disabled → <div>. İç içe tıklanabilir öğe ÜRETME — içinde buton
  taşıyan kart static kalır.
- disabled: solid line kenar (kesikli değil), cursor-not-allowed, hiçbir
  hover/active/focus tepkisi yok, medya grayscale.
- focus-visible: yalnızca üç etkileşimli davranışta 2px ember outline,
  offset 2. outline:none yazılmaz.
- prefers-reduced-motion geçişleri kapatır.

Ticket: Card.Body / Card.Perf / Card.Stub; çentik föydeki CSS mask koduyla.
ticket+selectable reddedilir. ticket+navigation İZİNLİ ama dev'de
console.warn ile "whitelist: ItemCard, kategori kutucuğu, daha-fazlası"
hatırlatması basar (decisions.md KARAR 3).

DİKKAT — cinder: --color-cinder danger kırmızısıdır. Kenar/yapı için
line/iron/faded kullan; cinder'ı kart sisteminde yalnızca danger bağlamı
taşır (bu fazda hiç kullanma).

src/pages/dev/Cards.jsx (route: /dev/cards) oluştur ve şu kombinasyonları
gerçek token'larla kur: neutral+static, raised+static, ticket+static(result),
neutral+navigation(compact), raised+interactive, raised+selectable,
raised+selectable+selected, raised+disabled, ticket+navigation, ve bir
dashed dropzone örneği (.tier-slot ile aynı desen).

Önce dosya planını ve Card API taslağını göster; kodu onayımdan sonra yaz.

KURALLAR:
- Önce plan yaz, onayımı bekle, sonra uygula.
- frontend-setup branch'inde çalış; yeni branch açma.
- Buton sistemine ve palet hex'lerine DOKUNMA. Yeni renk/token üretme.
- Blur, glow, scale, rounded-xl+ yasak. Radius tavanı 8px.
- Görünüm kuralları yalnızca Card.jsx'te yaşar.
```

## Föy ve CLAUDE.md'de güncellenecekler (not)

Föy repoda referans olarak kalıyor; şu üç fark decisions.md ile geçersiz kılındı (föyü yeniden üretmeye gerek yok, Claude Code'a "decisions kazanır" dendi):
1. Matris ticket satırı → navigation "sınırlı"
2. "Cinder" etiketi → Iron/Line; cinder = danger
3. ob-3 → yok; raised hover zemini sabit

CLAUDE.md bloğunun güncel hali ayrıca düzeltildi (`claude-md-kart-sistemi-bolumu.md` v2) — Faz 2 sonrası onu yapıştır.
