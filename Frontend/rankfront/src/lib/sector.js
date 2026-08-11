// Sektöre Hoş Geldin bölümünün sözlükleri ve saf mantığı. pollModes.js ile aynı
// disiplin: etiket eşlemesi ve hesap tek yerde yaşar, sayfa kendi listesini
// üretmez. Buradaki hiçbir fonksiyon girdiyi mutasyona uğratmaz.

// Filtre grubu 1 — kişinin sektördeki rolü. Anahtarlar mock/data.js'teki
// persona.role değerleriyle birebir aynı.
export const ROLES = {
  youtuber: 'YouTuber',
  yayinci: 'Yayıncı',
  influencer: 'Influencer',
}

// Filtre grubu 2 — cinsiyet.
export const GENDERS = {
  kadin: 'Kadın',
  erkek: 'Erkek',
}

// Sıralama modları. Anahtarlar URL'e (?sirala=) yazıldığı için kısa tutuldu.
export const SORT_MODES = {
  net: 'Net skor',
  new: 'Yeni',
  controversial: 'Tartışmalı',
}

export const DEFAULT_SORT = 'net'

// Bilinmeyen anahtar render'ı kırmaz (pollModeLabel deseni): veri yeni bir rol
// getirirse etiket yerine anahtarın kendisi basılır, sayfa ayakta kalır.
export function roleLabel(key) {
  return ROLES[key] ?? key
}

export function genderLabel(key) {
  return GENDERS[key] ?? key
}

export function sortLabel(key) {
  return SORT_MODES[key] ?? key
}

export function isSortMode(key) {
  return Object.hasOwn(SORT_MODES, key)
}

// ── Skorlar ────────────────────────────────────────────────────────

export function netScore(persona) {
  return persona.upvotes - persona.downvotes
}

// Tartışma skoru (Reddit'in klasik "controversial" formülü):
// toplam oy, azınlık/çoğunluk oranı kadar kuvvete yükseltilir. Oran 1'e
// yaklaştıkça (up ≈ down) hacim tam ağırlığıyla sayılır; tek taraflı kartlarda
// üs küçülür ve skor sönür. Böylece 500/490 olan kart, 5/5 olanın önüne geçer.
export function controversyScore(persona) {
  const { upvotes: up, downvotes: down } = persona
  const total = up + down
  if (total === 0 || up === 0 || down === 0) return 0
  const balance = Math.min(up, down) / Math.max(up, down)
  return total ** balance
}

// ── Filtre ─────────────────────────────────────────────────────────

// Grup içi VEYA, gruplar arası VE. Boş grup = o boyutta filtre yok.
// roles/genders dizi değilse (URL bozuksa) filtre uygulanmaz, liste tam gelir.
export function filterPersonas(list, { roles = [], genders = [] } = {}) {
  const byRole = Array.isArray(roles) && roles.length > 0
  const byGender = Array.isArray(genders) && genders.length > 0
  if (!byRole && !byGender) return [...list]

  return list.filter(
    (p) => (!byRole || roles.includes(p.role)) && (!byGender || genders.includes(p.gender)),
  )
}

// ── Sıralama ───────────────────────────────────────────────────────

// Eşitlikte ikincil ölçüt hep aynı: toplam oy (daha çok konuşulan önde).
// Böylece aynı skorlu kartlar her render'da yer değiştirmez.
const totalVotes = (p) => p.upvotes + p.downvotes

export function sortPersonas(list, mode = DEFAULT_SORT) {
  const next = [...list]

  if (mode === 'new') {
    return next.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  if (mode === 'controversial') {
    return next.sort(
      (a, b) => controversyScore(b) - controversyScore(a) || totalVotes(b) - totalVotes(a),
    )
  }

  // Varsayılan: net skor. Bilinmeyen mod da buraya düşer.
  return next.sort((a, b) => netScore(b) - netScore(a) || totalVotes(b) - totalVotes(a))
}

// ── Biçimlendirme ──────────────────────────────────────────────────

// Takipçi sayısı: 4200 → "4,2B", 120000 → "120B", 1200000 → "1,2M".
// Ondalık yalnızca anlamlıysa gösterilir (12000 → "12B", "12,0B" değil).
export function formatFollowers(n) {
  if (!Number.isFinite(n)) return '—'
  if (n < 1000) return String(n)

  const [value, suffix] = n < 1_000_000 ? [n / 1000, 'B'] : [n / 1_000_000, 'M']
  const decimals = value < 100 && !Number.isInteger(value) ? 1 : 0
  return `${value.toLocaleString('tr-TR', { maximumFractionDigits: decimals })}${suffix}`
}
