// Anketin oynanabildiği modlar. Anahtar → görünen etiket eşlemesi tek yerde
// yaşar; anket künyesi, mod seçme ekranı ve oyun sayfası aynı sözlüğü okur.
// Anahtarlar mock/data.js'teki poll.modes değerleriyle birebir aynı.
export const POLL_MODES = {
  bracket: 'Turnuva Ağacı',
  duel: 'O mu, Bu mu?',
  blind: 'Kör Sıralama',
  tier: 'Tier List',
}

// Bilinmeyen bir anahtar gelirse (backend yeni mod eklediğinde) render kırılmaz.
export function pollModeLabel(key) {
  return POLL_MODES[key] ?? key
}
