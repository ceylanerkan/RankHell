// Turnuva ağacının tur adları. Oyun ekranı (üstteki tur başlığı) ve sonuç
// ekranı (eleme grupları) aynı sözlüğü okusun diye lib'e alındı — iki yerde
// yazılsaydı "Yarı Final" ile "Son 4" zamanla yan yana düşerdi.

/**
 * Bir turun adı. n = o turda yarışan katılımcı sayısı (her zaman 2'nin kuvveti).
 * @param {number} n
 */
export function roundLabel(n) {
  if (n === 2) return 'Final'
  if (n === 4) return 'Yarı Final'
  if (n === 8) return 'Çeyrek Final'
  return `Son ${n}`
}

/**
 * Sonuç ekranındaki eleme grubunun başlığı. n = elendiği turdaki katılımcı
 * sayısı. Finalde elenen tek kişi "Final" değil FİNALİST'tir: grup başlığı
 * turun adını değil oyuncunun nereye kadar geldiğini söyler.
 * @param {number} n
 */
export function groupLabel(n) {
  if (n === 2) return 'Finalist'
  return roundLabel(n)
}
