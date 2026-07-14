// Veri katmanı — sayfalar veriyi SADECE bu dosyadaki fonksiyonlardan alır.
// Şu an mock veri döndürüyor; backend API hazır olunca sadece bu dosyadaki
// fonksiyon gövdeleri fetch('http://localhost:8080/api/...') çağrılarına
// çevrilecek, sayfalara ve bileşenlere dokunulmayacak.

import { categories, items, users, ratings, polls, dailyRanking } from './mock/data'

// Ağ gecikmesini taklit eder — loading durumlarının gerçekçi görünmesi için.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

let nextRatingId = ratings.length + 1
let nextPollId = polls.length + 1
let nextPollItemId = 100

// ---------- Oturum (auth) ----------
// Gerçek API'de bu bir JWT token olacak; şimdilik kullanıcıyı localStorage'da tutuyoruz.

export function getSession() {
  const raw = localStorage.getItem('rankhell_user')
  return raw ? JSON.parse(raw) : null
}

export async function login({ email, password }) {
  await delay()
  const user = users.find((u) => u.email === email)
  if (!user || password.length < 8) {
    throw new Error('E-posta veya şifre hatalı')
  }
  const session = { userId: user.userId, username: user.username, email: user.email, role: user.role }
  localStorage.setItem('rankhell_user', JSON.stringify(session))
  return session
}

export async function register({ username, email, password }) {
  await delay()
  if (users.some((u) => u.email === email)) {
    throw new Error('Bu e-posta zaten kayıtlı')
  }
  if (users.some((u) => u.username === username)) {
    throw new Error('Bu kullanıcı adı alınmış')
  }
  const user = {
    userId: users.length + 1,
    username,
    email,
    role: 'USER',
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  const session = { userId: user.userId, username: user.username, email: user.email, role: user.role }
  localStorage.setItem('rankhell_user', JSON.stringify(session))
  return session
}

export function logout() {
  localStorage.removeItem('rankhell_user')
}

// ---------- Kategoriler ----------

export async function getCategories() {
  await delay(200)
  return [...categories]
}

// ---------- Item'lar ----------

export async function getItems(categoryId = null) {
  await delay()
  if (!categoryId) return [...items]
  return items.filter((i) => i.categories.some((c) => c.categoryId === Number(categoryId)))
}

export async function getTopItems(limit = 5) {
  await delay()
  return [...items].sort((a, b) => b.globalScore - a.globalScore).slice(0, limit)
}

export async function getDailyRanking() {
  await delay()
  return {
    date: dailyRanking.date,
    title: dailyRanking.title,
    entries: dailyRanking.entries
      .map((e) => ({ ...e, item: items.find((i) => i.itemId === e.itemId) }))
      .filter((e) => e.item),
  }
}

export async function getItem(itemId) {
  await delay()
  const item = items.find((i) => i.itemId === Number(itemId))
  if (!item) throw new Error('Item bulunamadı')
  return { ...item }
}

// ---------- Oylar ----------

export async function getMyRating(itemId) {
  await delay(150)
  const session = getSession()
  if (!session) return null
  const r = ratings.find((r) => r.userId === session.userId && r.itemId === Number(itemId))
  return r ? { ...r } : null
}

export async function rateItem(itemId, score) {
  await delay()
  const session = getSession()
  if (!session) throw new Error('Oy vermek için giriş yapmalısın')

  const item = items.find((i) => i.itemId === Number(itemId))
  if (!item) throw new Error('Item bulunamadı')

  const existing = ratings.find((r) => r.userId === session.userId && r.itemId === item.itemId)
  if (existing) {
    // Backend'de unique(user, item) kısıtı var: yeni oy değil, güncelleme yapılır
    const total = item.globalScore * item.totalVotes - existing.score + score
    item.globalScore = Number((total / item.totalVotes).toFixed(2))
    existing.score = score
  } else {
    const total = item.globalScore * item.totalVotes + score
    item.totalVotes += 1
    item.globalScore = Number((total / item.totalVotes).toFixed(2))
    ratings.push({
      ratingId: nextRatingId++,
      userId: session.userId,
      itemId: item.itemId,
      score,
      createdAt: new Date().toISOString(),
    })
  }
  return { ...item }
}

export async function getMyRatings() {
  await delay()
  const session = getSession()
  if (!session) return []
  return ratings
    .filter((r) => r.userId === session.userId)
    .map((r) => ({ ...r, item: items.find((i) => i.itemId === r.itemId) }))
}

// ---------- Anketler ----------

export async function getPolls() {
  await delay()
  return polls.map((p) => ({ ...p, itemCount: p.pollItems.length }))
}

export async function getPoll(pollId) {
  await delay()
  const poll = polls.find((p) => p.pollId === Number(pollId))
  if (!poll) throw new Error('Anket bulunamadı')
  return {
    ...poll,
    items: poll.pollItems
      .map((pi) => items.find((i) => i.itemId === pi.itemId))
      .filter(Boolean),
  }
}

export async function createPoll({ title, itemIds }) {
  await delay()
  const session = getSession()
  if (!session) throw new Error('Anket oluşturmak için giriş yapmalısın')

  const poll = {
    pollId: nextPollId++,
    creator: { userId: session.userId, username: session.username },
    title,
    createdAt: new Date().toISOString(),
    pollItems: itemIds.map((itemId) => ({ id: nextPollItemId++, itemId })),
  }
  polls.push(poll)
  return { ...poll }
}

export async function getMyPolls() {
  await delay()
  const session = getSession()
  if (!session) return []
  return polls.filter((p) => p.creator.userId === session.userId)
}
