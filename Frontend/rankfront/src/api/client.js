// Veri katmanı — sayfalar veriyi SADECE bu dosyadaki fonksiyonlardan alır.
// Artık tamamı gerçek backend'e bağlı (http.js üzerinden). Sayfaların ve
// bileşenlerin beklediği veri şekilleri korunur; backend farklı bir şekil
// döndürdüğünde çeviri burada yapılır, yukarıya sızmaz.

import { http, saveSession, clearSession, readUser } from './http'

// Backend sayfalı çalışıyor (varsayılan 20), arayüz ise tüm listeyi bekliyor.
// Veri büyürse burada gerçek sayfalamaya geçilmeli.
const LISTE_BOYUTU = 200

// ---------- Oturum (auth) ----------

export function getSession() {
  return readUser()
}

function sessionFrom(yanit) {
  return {
    userId: yanit.userId,
    username: yanit.username,
    email: yanit.email,
    role: yanit.role,
  }
}

export async function login({ email, password }) {
  const yanit = await http.post('/api/auth/login', { email, password }, { auth: false })
  const session = sessionFrom(yanit)
  saveSession(yanit.token, session)
  return session
}

export async function register({ username, email, password, isTermsAccepted, isKvkkAccepted }) {
  const yanit = await http.post(
    '/api/auth/register',
    {
      username,
      email,
      password,
      isTermsAccepted: !!isTermsAccepted,
      isKvkkAccepted: !!isKvkkAccepted,
    },
    { auth: false },
  )
  const session = sessionFrom(yanit)
  saveSession(yanit.token, session)
  return session
}

export function logout() {
  clearSession()
}

// ---------- Kategoriler ----------

export async function getCategories() {
  return http.get('/api/categories', { auth: false })
}

// ---------- Item'lar ----------

export async function getItems(categoryId = null) {
  const params = new URLSearchParams({ size: String(LISTE_BOYUTU) })
  if (categoryId) params.set('categoryId', String(categoryId))
  return http.get(`/api/items?${params}`, { auth: false })
}

export async function getTopItems(limit = 5) {
  return http.get(`/api/items/top?limit=${limit}`, { auth: false })
}

export async function getItem(itemId) {
  return http.get(`/api/items/${itemId}`, { auth: false })
}

export async function getDailyRanking(limit = 5) {
  const yanit = await http.get(`/api/ranking/daily?limit=${limit}`, { auth: false })
  return {
    date: yanit.date,
    title: yanit.title,
    // Backend alanları düz gönderiyor, liste ise entry.item.name okuyor.
    // delta null = dün sıralamada yoktu; rozet bunu "yeni" diye gösteriyor.
    entries: (yanit.entries ?? []).map((e) => ({
      itemId: e.itemId,
      votesToday: e.votesToday,
      delta: e.delta ?? 'yeni',
      item: { itemId: e.itemId, name: e.itemName, imageUrl: e.itemImageUrl },
    })),
  }
}

// ---------- Oylar (1-5 yıldız) ----------

export async function getMyRating(itemId) {
  if (!getSession()) return null
  try {
    return await http.get(`/api/items/${itemId}/ratings/me`)
  } catch (err) {
    // 404: henüz oy vermemiş. 401/403: oturum düşmüş. Üçü de "puan yok" demek.
    if ([401, 403, 404].includes(err.status)) return null
    throw err
  }
}

export async function rateItem(itemId, score) {
  if (!getSession()) throw new Error('Oy vermek için giriş yapmalısın')

  await http.put(`/api/items/${itemId}/ratings`, { score })
  // Backend özet (ortalama + sayı) döndürüyor; sayfa ise güncellenmiş item
  // bekliyor, o yüzden item'ı tazeleyip onu veriyoruz.
  return getItem(itemId)
}

export async function getMyRatings() {
  const session = getSession()
  if (!session) return []

  const satirlar = await http.get(`/api/users/${session.userId}/ratings?size=${LISTE_BOYUTU}`)
  // Profil sayfası r.item.name bekliyor; backend alanları düz gönderiyor.
  return satirlar.map((r) => ({
    ratingId: r.ratingId,
    itemId: r.itemId,
    score: r.score,
    createdAt: r.createdAt,
    item: { itemId: r.itemId, name: r.itemName, imageUrl: r.itemImageUrl },
  }))
}

// ---------- Düellolar ----------
// Oylama bilerek giriş istemiyor: widget anasayfa hero'sunda, ziyaretçiyi
// yakalamak için var. Oy hakkı localStorage'da tutuluyor (bkz. useDuel).

export async function getDuels() {
  return http.get(`/api/duels?size=${LISTE_BOYUTU}`, { auth: false })
}

export async function voteDuel(duelId, side) {
  if (side !== 'A' && side !== 'B') throw new Error('Geçersiz taraf')
  return http.post(`/api/duels/${duelId}/votes`, { side }, { auth: false })
}

export async function createDuel({ title, itemAId, itemBId }) {
  if (!getSession()) throw new Error('Düello oluşturmak için giriş yapmalısın')
  return http.post('/api/duels', { title, itemAId, itemBId })
}

// ---------- Anketler ----------

// Backend creatorId/creatorUsername'i düz gönderiyor, arayüz iç içe creator
// nesnesi bekliyor. Ayrıca seçenek listesi iki isimle okunuyor: PollStats
// pollItems.length, diğer bileşenler items — ikisini de veriyoruz.
function pollToUI(poll) {
  const items = (poll.items ?? []).map((pi) => ({
    itemId: pi.itemId,
    name: pi.name,
    imageUrl: pi.imageUrl,
    description: pi.description,
    globalScore: pi.globalScore,
    totalVotes: pi.totalVotes,
    categories: [],
  }))

  return {
    pollId: poll.pollId,
    title: poll.title,
    description: poll.description,
    coverUrl: poll.coverUrl,
    category: poll.category ? { categoryId: poll.category.categoryId, name: poll.category.name } : null,
    featured: poll.featured,
    modes: poll.modes ?? [],
    globalScore: poll.globalScore ?? 0,
    totalRatings: poll.totalRatings ?? 0,
    playCount: poll.playCount ?? 0,
    createdAt: poll.createdAt,
    creator: { userId: poll.creatorId, username: poll.creatorUsername },
    items,
    pollItems: items,
    itemCount: items.length,
    comments: (poll.comments ?? []).map((c) => ({
      commentId: c.commentId,
      user: { userId: c.userId, username: c.username },
      body: c.body,
      score: c.score,
      createdAt: c.createdAt,
    })),
    winners: [],
  }
}

export async function getPolls() {
  const polls = await http.get(`/api/polls?size=${LISTE_BOYUTU}`, { auth: false })
  return polls.map(pollToUI)
}

export async function getPoll(pollId) {
  return pollToUI(await http.get(`/api/polls/${pollId}`, { auth: false }))
}

export async function createPoll({ title, itemIds }) {
  if (!getSession()) throw new Error('Anket oluşturmak için giriş yapmalısın')
  return pollToUI(await http.post('/api/polls', { title, itemIds }))
}

export async function getMyPolls() {
  const session = getSession()
  if (!session) return []
  const polls = await http.get(
    `/api/polls?creatorId=${session.userId}&size=${LISTE_BOYUTU}`,
    { auth: false },
  )
  return polls.map(pollToUI)
}
