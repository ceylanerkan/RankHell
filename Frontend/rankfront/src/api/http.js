// Ağ katmanı — client.js'in altında duran ince bir sarmalayıcı.
// Tek sorumluluğu: URL birleştirmek, JWT'yi eklemek, hataları anlamlı
// Error nesnelerine çevirmek. İş mantığı burada YOK.

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const TOKEN_KEY = 'rankhell_token'
const USER_KEY = 'rankhell_user'

// ---------- Oturum saklama ----------
// Token ve kullanıcı ayrı tutulur: token isteklerde, kullanıcı ise
// arayüzde (Navbar, profil) senkron okunabilmek için lazım.

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function readUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null // bozuk kayıt: oturumsuz say, patlama
  }
}

// ---------- Hata çevirisi ----------
// Backend ApiError döndürüyor: { status, message, fieldErrors }.
// Mesajlar İngilizce; arayüz tamamen Türkçe olduğu için bilinen durumları
// çeviriyoruz, tanımadıklarımızda sunucunun mesajına düşüyoruz.

const HATA_MESAJLARI = {
  401: 'E-posta veya şifre hatalı',
  403: 'Bu işlem için yetkin yok',
  404: 'Kayıt bulunamadı',
  409: 'Bu kayıt zaten mevcut',
  500: 'Sunucuda bir hata oluştu',
}

class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function hataYarat(response) {
  let govde = null
  try {
    govde = await response.json()
  } catch {
    // gövdesi olmayan yanıt (ör. 403) — sorun değil
  }

  // Alan bazlı doğrulama hatası varsa onu göster: kullanıcıya en yararlısı o
  if (govde?.fieldErrors) {
    const ilk = Object.values(govde.fieldErrors)[0]
    if (ilk) return new ApiError(ilk, response.status, govde.fieldErrors)
  }

  const mesaj = HATA_MESAJLARI[response.status] ?? govde?.message ?? 'Beklenmeyen bir hata oluştu'
  return new ApiError(mesaj, response.status, govde?.fieldErrors)
}

// ---------- İstek ----------

async function istek(yol, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${yol}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    // fetch yalnızca ağ seviyesinde patlar (sunucu kapalı, CORS reddi, DNS)
    throw new ApiError('Sunucuya ulaşılamıyor. Backend çalışıyor mu?', 0)
  }

  if (!response.ok) throw await hataYarat(response)

  if (response.status === 204) return null
  const metin = await response.text()
  return metin ? JSON.parse(metin) : null
}

export const http = {
  get: (yol, opts) => istek(yol, { ...opts, method: 'GET' }),
  post: (yol, body, opts) => istek(yol, { ...opts, method: 'POST', body }),
  put: (yol, body, opts) => istek(yol, { ...opts, method: 'PUT', body }),
  del: (yol, opts) => istek(yol, { ...opts, method: 'DELETE' }),
}

export { ApiError }
