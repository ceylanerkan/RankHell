// "Her Sıradan Bir Tanesini Seç" vitrininin sözlükleri ve saf mantığı.
// sector.js ile aynı disiplin: etiket eşlemesi ve hesap tek yerde yaşar, sayfa
// kendi listesini üretmez. Buradaki hiçbir fonksiyon girdiyi mutasyona uğratmaz.
//
// Kategori sözlüğü YOK: kategoriler ortak havuzdan (api/client getCategories)
// gelir, burada ikinci bir kopyası tutulmaz.

// Sıralama modları. Anahtarlar URL'e (?sirala=) yazıldığı için kısa tutuldu.
export const SORT_MODES = {
  populer: 'En çok oynanan',
  yeni: 'En yeni',
}

export const DEFAULT_SORT = 'populer'

// Bilinmeyen anahtar render'ı kırmaz (sortLabel deseni): veri yeni bir mod
// getirirse etiket yerine anahtarın kendisi basılır, sayfa ayakta kalır.
export function sortLabel(key) {
  return SORT_MODES[key] ?? key
}

export function isSortMode(key) {
  return Object.hasOwn(SORT_MODES, key)
}

// Grup içi VEYA: seçili kategorilerden birine giren her oyun listede kalır.
// categories: kategori id'lerinin dizisi (URL'den geldiği için string).
export function filterGames(games, { categories = [] } = {}) {
  if (categories.length === 0) return [...games]
  return games.filter((game) =>
    game.categories?.some((c) => categories.includes(String(c.categoryId))),
  )
}

export function sortGames(games, sort) {
  const copy = [...games]
  if (sort === 'yeni') {
    return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return copy.sort((a, b) => b.plays - a.plays)
}

// ---------- Oyunun kendisi ----------
// picks: { [rowId]: optionId }. Satır kimliğiyle anahtarlanır, sırayla değil —
// satırların dizideki yeri değişse de seçim doğru satırda kalır.

// Her satırda bir seçim var mı? Boş oyun (satırsız fixture) tamamlanmış
// sayılmaz: "Tamamla" düğmesi hiçbir zaman boşa basılmasın.
export function isComplete(rows = [], picks = {}) {
  if (rows.length === 0) return false
  return rows.every((row) => picks[row.rowId] !== undefined)
}

export function pickedCount(rows = [], picks = {}) {
  return rows.filter((row) => picks[row.rowId] !== undefined).length
}

// Sonuç ekranı ham id ile uğraşmasın diye seçimleri satır sırasına göre
// çözer: [{ row, option }]. Seçilmemiş satır listeye girmez.
export function resolvePicks(rows = [], picks = {}) {
  return rows
    .map((row) => ({
      row,
      option: row.options?.find((o) => o.optionId === picks[row.rowId]),
    }))
    .filter((entry) => entry.option !== undefined)
}
