# RankHell Kart Sistemi — Claude Code Uygulama Planı

> TARİHSEL BELGE — ilk plan. Bazı teknik varsayımları (Next.js, globals.css)
> Faz 0'da gerçek repoyla düzeltildi. Güncel kurallar:
> `card-system-decisions.md` + `CLAUDE.md`.

Föy v2.1 (`rankhell-kart-sistemi-ornek-v2.html`) referans alınır. Sınıf sözleşmesi: her kart bir **surface** (`neutral | raised | ticket`) + bir **behavior** (`static | interactive | navigation | selectable | disabled`) alır, behavior her zaman açık yazılır.

Plan yedi faz. Tüm çalışma mevcut **`frontend-setup`** branch'inde yapılır — yeni branch açılmaz. Her faz kendi commit'iyle (veya commit grubuyla) biter, bir sonrakine geçmeden görsel doğrulama yapılır; böylece bir faz ters giderse `git revert` ile sadece o faz geri alınabilir. Claude Code'a her faz **ayrı oturumda, tek prompt** olarak verilir — "plan first, then implement" kuralın her promptta tekrarlanır.

---

## Faz 0 — Zemin (15 dk, kod yok)

Amaç: Claude Code'un halüsinasyon üretmeden çalışabileceği bir referans zemini kurmak.

1. Mevcut `frontend-setup` branch'ine geç ve güncel olduğundan emin ol: `git checkout frontend-setup && git pull`. Yeni branch açılmaz; tüm fazlar bu branch üzerinde ilerler. Çalışma alanı temiz olsun — commit'lenmemiş değişiklik varsa önce onlar kapatılır ki kart sistemi commit'leri başka işlerle karışmasın.
2. Föyü repo'ya kopyala: `docs/design/card-system.html`. Claude Code her fazda bu dosyayı okuyarak çalışır — spesifikasyon senin sohbet geçmişinde değil, repoda yaşamalı.
3. Gerçek palet hex'lerini çıkar: mevcut Tailwind config / globals.css'ten Ember, Brass, Moss, Cinder ve obsidyen arka plan değerlerini bir listeye yaz. **Föydeki hex'ler yaklaşıktır; repoda gerçek değerler kazanır.** Bu listeyi föyün başına yorum olarak ekle.
4. Envanter: repodaki kart benzeri her bileşeni listele (PollCard, ItemCard, DuelCard, CategoryTile, ProfileCard, FilterBar, CommentBlock, ListRow, StatPanel, EmptyState, auth kartları vb.) ve her birine hedef surface + behavior ata. Bu tablo Faz 3–4'ün yol haritası olur.

> Claude Code promptu: "docs/design/card-system.html dosyasını oku. Kod yazma. src/components altındaki kart benzeri tüm bileşenleri listele ve her birine föydeki matrise göre hedef surface+behavior öner. Emin olmadıklarını ayrı işaretle."

---

## Faz 1 — Token katmanı (tek commit)

Amaç: Tüm değerlerin tek kaynaktan gelmesi. Bu faz bitmeden hiçbir bileşene dokunulmaz.

`globals.css`'e (veya Tailwind v4 kullanılıyorsa `@theme` bloğuna) şu token grupları:

| Grup | Token'lar |
|---|---|
| Yüzey | `--ob-0..3` (sayfa, neutral, raised/ticket, hover) — gerçek palet değerleriyle |
| Yapı | `--line`, `--line-strong`, `--muted`, `--text` |
| Aksan | `--ember`, `--brass`, `--moss` (mevcut değerler, yeni üretim yok) |
| Radius | `--r-0/2/4/8` — tavan 8, `rounded-lg`+ sınıfları kart bağlamında yasak |
| Padding | `--p-compact:12 / default:20 / spacious:28` |
| Elevation | `--e-1` (sıfır blur, 1px), `--lift` (üst iç ışık) — başka gölge tanımlanmaz |

Kabul kriteri: `grep -rn "shadow-\|blur\|rounded-xl\|rounded-2xl" src/components` yeni token dışı değer döndürmüyor (mevcut ihlaller Faz 3–4'te temizlenecek, burada sadece yenisi eklenmiyor).

---

## Faz 2 — Card primitive (tek bileşen, tek commit)

`components/ui/Card.tsx` — sistemin tamamı burada yaşar, alt bileşenler görünüm kuralı yazmaz.

**API:**

```
surface:  'neutral' | 'raised' | 'ticket'        (default: 'neutral')
behavior: 'static' | 'interactive' | 'navigation' | 'selectable' | 'disabled'  (default: 'static')
padding:  'compact' | 'default' | 'spacious'     (default: 'default')
selected?: boolean   → yalnızca behavior='selectable' ile geçerli, aksi halde dev'de uyarı
href?: string        → yalnızca behavior='navigation' ile; Card <Link> olarak render edilir
```

**Semantik kurallar (Claude Code'un en çok hata yapacağı yer, prompta açık yaz):**
- `navigation` → `next/link` sarmalı, `interactive`/`selectable` → `<button>` ya da `role`+`tabIndex`; `static`/`disabled` → düz `<div>`.
- Kartın içine ikinci bir tıklanabilir öğe koyulacaksa iç içe `<a>`/`<button>` üretme — bu durumda kartın kendisi static kalır, aksiyon içerideki butonda yaşar.
- `disabled`: solid `--line` kenar (kesikli değil), `cursor-not-allowed`, hover/active/focus tepkisi yok, medya grayscale.
- `focus-visible`: yalnızca interactive/navigation/selectable'da `2px --ember outline, offset 2`. `outline:none` hiçbir yerde yazılmaz.
- Ember marker (`::before`, 2px sol şerit) yalnızca üç etkileşimli davranışta var olur.
- `prefers-reduced-motion` tüm geçişleri kapatır.

**Ticket alt yapısı:** `Card.Body`, `Card.Perf`, `Card.Stub` alt bileşenleri; çentik CSS `mask` ile (föydeki hazır kod taşınır), border-radius'a dokunulmaz. `ticket` + `navigation/selectable` kombinasyonu prop seviyesinde reddedilir; `ticket+interactive` ve `ticket+disabled` "sınırlı" — izinli ama primitive içinde yorumla işaretli.

Kabul kriteri: geçici bir `/dev/cards` sayfasında föydeki 8 örnek kombinasyon birebir yeniden üretilebiliyor ve föyle yan yana ekran görüntüsü eşleşiyor.

---

## Faz 3 — Raised ailesi göçü (bileşen başına küçük commit)

Sıra, riski küçükten büyüğe: **CategoryTile → ProfileCard → PollCard → ItemCard → DuelCard.**

Her bileşen için aynı döngü:
1. Claude Code önce planını yazar (hangi sınıflar silinecek, hangi prop'lar gelecek), sen onaylarsın.
2. Bileşen `Card` primitive'ine bağlanır; yerel border/radius/shadow/hover CSS'i **silinir**, override edilmez.
3. Tarayıcıda önce/sonra karşılaştırması — kart hover'da kalkmıyor, büyümüyor, basınca 1px gömülüyor mu?

DuelCard en sona: hero'daki vitrin varyantı **sistem dışı** kalır, göç kapsamına girmez (Faz 7'de istisna olarak belgelenir).

## Faz 4 — Neutral ailesi göçü

FilterBar, CommentBlock, ListRow, StatPanel, EmptyState, auth kartları. Kurallar:
- ListRow → `padding='compact'`, auth/EmptyState → `spacious` meşru; geri kalan her şey `default`.
- Bilgi panelleri ve auth `behavior='static'` — hover'da hiçbir şey olmamalı; olan varsa hata.

## Faz 5 — Renk denetimi (kod yazmadan önce rapor)

> Claude Code promptu: "Kod değiştirme. src altında ember/turuncu kullanan her satırı listele ve her birini şu üç sınıfa ayır: (a) etkileşim sinyali — meşru, (b) veri (önde giden yüzde/bar) — meşru, (c) dekorasyon veya kart başına ikinci kor — ihlal. Sadece rapor ver."

Rapor onaylandıktan sonra ihlaller tek commit'te temizlenir. Aynı denetim brass için: brass tıklanabilir hiçbir öğede kalmamalı.

## Faz 6 — Ticket yayılımı

Önce **tek** bileşen: VoteReceipt. Çentik + perforasyon gerçek içerikle doğrulanınca sırayla ItemCard varyantı, özel sıralama kartı, "daha fazlası" kartı. Sayfa bazında kontrol: hiçbir route'ta birden fazla bilet ailesi görünmüyor.

## Faz 7 — İstisnalar ve kapanış

`docs/design/exceptions.md`: hero düello kartı, navbar bandı, toast/modal (`e-2`), tier sürükleme satırları, medya karoları, skeleton — neden sistem dışı olduklarıyla birlikte. Dropzone deseni (kesikli kenar = "burada henüz bir şey yok") tier boş yuvasında uygulanır. `/dev/cards` sayfası ya silinir ya da `docs`'a taşınır.

**CLAUDE.md güncellemesi (kapanışın son commit'i):** Kart sisteminin ihlal edilemez kuralları CLAUDE.md'ye kısa bir blok olarak eklenir — hazır metin `claude-md-kart-sistemi-bolumu.md` dosyasında. Kural: CLAUDE.md'ye yalnızca sözleşme ve yasaklar girer; föy, matris ve istisnaların tamamı `docs/design/` altında kalır, CLAUDE.md oraya işaret eder. CLAUDE.md şişerse Claude Code kuralları atlamaya başlar; bu blok 25 satırı geçmemeli.

---

## Kalıcı korkuluklar (her Claude Code promptunun sonuna eklenecek blok)

```
KURALLAR:
- Önce plan yaz, onayımı bekle, sonra uygula.
- frontend-setup branch'inde çalış; yeni branch açma, branch değiştirme.
- Buton sistemine ve palet hex değerlerine DOKUNMA. Butonlar kapsam dışı; primary butonun glow'u korunur. Renk denetimi (Faz 5) yalnızca kart içeriğine bakar, buton bileşenlerine değil.
- Yeni renk/token üretme; yalnızca globals.css'teki token'ları kullan.
- Blur, glow, scale, translate-up, rounded-xl+ yasak. Radius tavanı 8px.
- Ember marker yalnızca interactive/navigation/selectable'da.
- Disabled: solid kenar. Kesikli kenar yalnızca dropzone/placeholder.
- Bir dosyada görünüm kuralı yazma; kural Card.tsx'te yaşar.
- Diff'i küçük tut: faz başına tek konu.
```

## Bitti sayılma kriterleri

- Föydeki 8 kombinasyon `/dev/cards`'ta birebir; klavye ile gezilebiliyor, focus halkası görünüyor.
- `grep` denetimleri temiz: token dışı shadow/blur/radius yok, kart başına tek kor.
- Tüm kart bileşenleri primitive'den türüyor; yerel border/hover CSS'i kalmadı.
- İstisnalar yazılı. Yazılmayan istisna, altı ay sonra sistemin kendisi olur.

## Tahmini efor

Faz 0–2 bir oturum (sistemin kalbi), Faz 3–4 iki-üç kısa oturum (mekanik göç), Faz 5–7 bir oturum. Aceleye gelecek tek yer yok; en pahalı hata Faz 2'de semantiği (link/button/div ayrımı) yanlış kurmak — orada yavaşla.
