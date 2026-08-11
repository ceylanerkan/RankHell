// Anketin oynanabildiği modlar. Anahtar → görünen etiket eşlemesi tek yerde
// yaşar; anket künyesi, mod seçme ekranı ve oyun sayfası aynı sözlüğü okur.
// Anahtarlar mock/data.js'teki poll.modes değerleriyle birebir aynı.
export const POLL_MODES = {
  classic: 'Klasik Puanlama',
  bracket: 'Turnuva Ağacı',
  duel: 'O mu, Bu mu?',
  blind: 'Kör Sıralama',
  tier: 'Tier List',
}

// Kurulum ekranının (/polls/:id/play) mod sırası. Sıra bilgisi burada yaşar,
// sayfa kendi listesini üretmez. Tier list burada yok: sıralama oyunu değil,
// kendi sayfası (/modlar/tier-list) var — künye çipleri onu göstermeye devam ediyor.
export const PLAY_MODES = ['classic', 'blind', 'bracket', 'duel']

// Şu an gerçekten oynanabilen modlar. Bir mod bitince buraya bir satır eklenir;
// kurulum ekranı kendi listesini tutmaz, hem BAŞLA butonu hem "hazır değil"
// notu buradan türer.
export const PLAYABLE_MODES = ['classic', 'blind', 'bracket', 'duel']

export function isPlayableMode(key) {
  return PLAYABLE_MODES.includes(key)
}

// Bilinmeyen bir anahtar gelirse (backend yeni mod eklediğinde) render kırılmaz.
export function pollModeLabel(key) {
  return POLL_MODES[key] ?? key
}

// Tur seçenekleri: turnuva/duel/klasik 2'nin kuvvetleriyle ilerler, kör
// sıralama 5-10 arası kısa tutulur. Havuzu aşan değerler listeye girmez.
//
// Duel için 2'nin kuvveti ZORUNLULUK DEĞİL, alışkanlık: "O mu, Bu mu?"da ağaç
// yok, n seçenek n-1 seçim demektir ve her sayı oynanır. Bu yüzden klasik gibi
// "Tümü (n)" seçeneği de alır ve largestPowerOfTwo o yola hiç girmez.
const POWER_ROUNDS = [8, 16, 32]
const BLIND_ROUNDS = [5, 10]

// Havuzu aşmayan en büyük 2'nin kuvveti (en az 2). Turnuva ağacı hook'u da
// bunu okur: bozuk bir config gelse bile ağaç 2'nin kuvvetinde kalmalı.
export function largestPowerOfTwo(count) {
  let value = 2
  while (value * 2 <= count) value *= 2
  return value
}

/**
 * Bir mod + seçenek havuzu için tur seçenekleri.
 * Hiçbir standart değer sığmazsa (ör. 7 seçenekli anket) liste boş kalmaz:
 * havuza sığan en büyük değere düşülür — kullanıcı anketleri de ekranı kırmaz.
 * @returns {{ value: number, label: string }[]} artan sırada
 */
export function roundOptionsFor(mode, itemCount) {
  const count = Number(itemCount) || 0
  if (count < 2) return []

  const base = mode === 'blind' ? BLIND_ROUNDS : POWER_ROUNDS
  let values = base.filter((value) => value <= count)
  if (values.length === 0) {
    values = [mode === 'blind' ? count : largestPowerOfTwo(count)]
  }

  const options = values.map((value) => ({ value, label: String(value) }))
  // Yapısal kısıtı olmayan modlarda tüm havuzu oynamak her zaman seçenek:
  // klasikte hepsini puanlarsın, duel'de hepsi sırayla meydan okur.
  if ((mode === 'classic' || mode === 'duel') && !values.includes(count)) {
    options.push({ value: count, label: `Tümü (${count})` })
  }
  return options
}

// Varsayılan tur: kör sıralamada 10, diğerlerinde sığan en büyük değer.
export function defaultRoundFor(mode, options) {
  if (options.length === 0) return 0
  if (mode === 'blind') {
    const ten = options.find((option) => option.value === 10)
    if (ten) return ten.value
  }
  return options[options.length - 1].value
}
