# RankHell Kart Sistemi — İstisnalar (Faz 7)

Sisteme (`Card.jsx` + `card.css`) **çekilmeyen** bileşenler ve neden sistem dışı
oldukları. Bir bileşen buradaysa Card primitive'ine göç ettirilmez; kart
kurallarıyla (radius tavanı, glow yasağı, ember marker) çelişse bile bilinçli
istisnadır. Listeye yeni satır yalnızca ayrı bir kararla eklenir.

Kaynak kurallar: [`card-system-decisions.md`](./card-system-decisions.md) + `CLAUDE.md`.

---

## 1 — DuelWidget (hero düello kartı)

Hero'daki tek yükseltilmiş yüzey; kendi etkileşim dili (oy → bar hareketi) var ve
sayfanın geri kalanından bilinçli olarak sakin durur. **Brass istisnası:** oydan
sonra kazanan tarafın yüzdesi iri ve `brass-soft` gösterilir — brass burada
"tıklanabilir öğe rengi" değil **sonuç/ödül sinyali**dir, o yüzden "brass
tıklanabilir öğede kullanılmaz" kuralı bu widget'ta geçerli değildir. Card'a
çevrilmez.

## 2 — TierList satırları (WIP)

Tier satırları ve `.tier-slot` yuvaları sürükle-bırak veri modeli gelene kadar
placeholder. Şu an statik; drag-drop uygulandığında etkileşim modeli baştan
kurulacağı için sisteme **şimdi** çekilmez. **Yeniden-denetim şartı:** sürükle-bırak
eklendiğinde bu satır yeniden değerlendirilip ya Card'a göç eder ya da kalıcı
istisna olarak burada gerekçelendirilir.

## 3 — ErrorState emoji (💀)

`States.jsx` içindeki ErrorState bir `neutral + static` Card'dır (sisteme
uygun), ama başlığındaki 💀 emoji dekoratif bir vurgudur. Sistem "kart başına tek
kor / sinyal" dediği için emoji bir kural ihlali gibi görünür; hata durumunun
insani/oyunbaz tonunu taşıdığından **içerik** olarak serbesttir, sinyal katmanı
değildir.

## 4 — Kategori ikonu: drop-shadow + wiggle

Home kategori kutucuklarındaki Lucide ikonu iki efekt taşır: `drop-shadow`
(gölge) ve `group-hover:animate-wiggle` (hover'da rotate mikro-animasyonu). Kart
sistemi glow/blur/scale ve "hover'da hareket" yasağı koyar; bu ikisi **kartın
kendisinde değil, içindeki ikon içeriğinde** yaşadığı için istisnadır — kartın
yüzeyi kurala uyar, süs ikon seviyesinde kalır. Faz 6e'de birebir taşındığı için
korundu.

## 5 — Home bilet ailesi (liderlik şeridi)

`ticket + navigation` yalnızca Home liderlik şeridindeki **tek aile** için
geçerli: ItemCard + "daha fazlası" kartı — ikisi de aynı rayda, aynı makbuz dili.
"Aile" = bu şerit; sayfa başına tek bilet ailesi kuralı bunu tanımlar. Üçüncü bir
`ticket+navigation` kullanımı (örn. kategori kutucuğu) whitelist dışıdır ve
dev'de uyarı basar (bkz. [KARAR 3](./card-system-decisions.md)).

## 6 — Dropzone ailesi (EmptyState + .tier-slot)

Kesikli kenar = "burada henüz bir şey yok" deseni. EmptyState ve `.tier-slot`
Card'a çevrilmez; kart değil **boş yuva/placeholder** ailesidir. Kesikli kenarın
kart sisteminde tek meşru yeri budur (disabled kart solid kenar alır, kesikli
değil). `dropzone` sınıf ailesi olarak belgelenir, surface × behavior matrisine
girmez.

## 7 — night-deep bantları + toast/modal (e-2)

Navbar/footer `night-deep` (#0b0b0d) bantları sayfa kromudur (chrome), içerik
kartı değil — sisteme çekilmez, kendi en-koyu tonunu korur. İleride gelecek
toast/modal overlay'leri de sistem dışıdır: yüzen katman gölgesi (`e-2`) kart
`e-1`'inden ayrıdır ve overlay bağlamına aittir; kart yüzeyi diliyle
karıştırılmaz.
