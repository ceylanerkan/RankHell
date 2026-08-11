// Oyun kuyruğu yardımcıları. İki oyun hook'u (useClassicGame, useBlindGame) aynı
// karıştırma/kırpma davranışını paylaşsın diye lib'e alındı — kopyalansaydı iki
// oyunun kuyruk semantiği zamanla sessizce ayrışırdı.

// Fisher-Yates.
export function shuffle(list) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = next[i]
    next[i] = next[j]
    next[j] = tmp
  }
  return next
}

// Havuz karıştırılır, tur sayısı kadarı alınır. roundCount havuzdan büyükse
// (bozuk config) havuz sınırı kazanır — oyun yine oynanır.
export function buildQueue(items, roundCount) {
  const pool = Array.isArray(items) ? items : []
  const requested = Number(roundCount)
  const size = requested > 0 ? Math.min(requested, pool.length) : pool.length
  return shuffle(pool).slice(0, size)
}
