// Sitedeki oyun modları: /modlar sayfasının tek kaynağı. Sıra, etiket ve
// "hazır mı" bilgisi burada yaşar; sayfa kendi listesini üretmez — bir mod
// bitince buraya ready: true + to eklenir, kapak kartı ve "hazır değil" notu
// kendiliğinden doğru kalır.
//
// pollModes.js ile karıştırma: orası bir ANKETİN oynanma biçimlerini
// (klasik/kör/turnuva/düello) tanımlar. Burası ayrı bir eksen — kendi
// sayfası olan bağımsız modlar.
export const GAME_MODES = [
  {
    key: 'tier',
    badge: 'TIER LIST',
    label: 'Tier List',
    description: "Seçenekleri S'den F'ye katmanlara yerleştir, kendi hiyerarşini kur.",
    to: '/modlar/tier-list',
    ready: true,
  },
  {
    key: 'rowpick',
    badge: 'SIRA SEÇİMİ',
    label: 'Her Sıradan Bir Tanesini Seç',
    description: 'Her satırdan yalnızca bir tane alabilirsin. Gerisi elenir.',
    to: '/modlar/sira-secimi',
    ready: true,
  },
  {
    key: 'colpick',
    badge: 'SÜTUN SEÇİMİ',
    label: 'Hangi Sütunu Seçersin',
    description: 'Sütunlardan birini seç; o sütundaki her şey senin olur.',
    ready: false,
  },
  {
    key: 'kme',
    badge: 'ÜÇLEME',
    label: 'Öp Öldür Evlen',
    description: 'Üç isim, üç kader. Kimi öpersin, kimi öldürürsün, kimle evlenirsin?',
    ready: false,
  },
  {
    key: 'squad',
    badge: 'KADRO',
    label: 'Oynat Yedek Bırak Sat',
    description: 'Üç karar, tek kadro: kimi sahaya sürer, kimi yedeğe atar, kimi satarsın?',
    ready: false,
  },
]

// Şu an gerçekten oynanabilen modların etiketleri — "hazır değil" notu bu
// listeden türer, elle yazılmış bayat bir string geride kalmaz.
export function readyModeLabels() {
  return GAME_MODES.filter((mode) => mode.ready).map((mode) => mode.label)
}
