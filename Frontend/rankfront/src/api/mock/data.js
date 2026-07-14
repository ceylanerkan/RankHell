// Sahte (mock) veri — alan adları backend entity'leriyle birebir aynı tutuldu.
// Backend API hazır olduğunda bu dosya silinecek, client.js fetch'e geçecek.

export const categories = [
  { categoryId: 1, name: 'Film', emoji: '🎬', tagline: 'Kült mü, klişe mi?' },
  { categoryId: 2, name: 'Dizi', emoji: '📺', tagline: 'Final hak etti mi?' },
  { categoryId: 3, name: 'Oyun', emoji: '🎮', tagline: 'Efsane mi, hype mı?' },
  { categoryId: 4, name: 'Yemek', emoji: '🍔', tagline: 'Damak kavgası burada' },
  { categoryId: 5, name: 'Müzik', emoji: '🎵', tagline: 'Kulaklar jüri' },
]

export const items = [
  {
    itemId: 1,
    name: 'The Godfather',
    description: 'Corleone ailesinin suç imparatorluğunu anlatan efsane film.',
    imageUrl: 'https://picsum.photos/seed/godfather/600/400',
    globalScore: 4.72,
    totalVotes: 1843,
    categories: [{ categoryId: 1, name: 'Film' }],
  },
  {
    itemId: 2,
    name: 'Breaking Bad',
    description: 'Kimya öğretmeni Walter White\'ın karanlık dönüşümü.',
    imageUrl: 'https://picsum.photos/seed/breakingbad/600/400',
    globalScore: 4.85,
    totalVotes: 2517,
    categories: [{ categoryId: 2, name: 'Dizi' }],
  },
  {
    itemId: 3,
    name: 'The Witcher 3',
    description: 'Rivyalı Geralt\'ın açık dünya macerası.',
    imageUrl: 'https://picsum.photos/seed/witcher3/600/400',
    globalScore: 4.61,
    totalVotes: 1292,
    categories: [{ categoryId: 3, name: 'Oyun' }],
  },
  {
    itemId: 4,
    name: 'İskender Kebap',
    description: 'Bursa\'nın dünyaca ünlü, tereyağlı ve yoğurtlu kebabı.',
    imageUrl: 'https://picsum.photos/seed/iskender/600/400',
    globalScore: 4.43,
    totalVotes: 674,
    categories: [{ categoryId: 4, name: 'Yemek' }],
  },
  {
    itemId: 5,
    name: 'The Dark Side of the Moon',
    description: 'Pink Floyd\'un 1973 tarihli kült albümü.',
    imageUrl: 'https://picsum.photos/seed/darkside/600/400',
    globalScore: 4.58,
    totalVotes: 958,
    categories: [{ categoryId: 5, name: 'Müzik' }],
  },
  {
    itemId: 6,
    name: 'Interstellar',
    description: 'Zaman, yerçekimi ve sevgi üzerine bir uzay destanı.',
    imageUrl: 'https://picsum.photos/seed/interstellar/600/400',
    globalScore: 4.49,
    totalVotes: 2103,
    categories: [{ categoryId: 1, name: 'Film' }],
  },
  {
    itemId: 7,
    name: 'Elden Ring',
    description: 'FromSoftware\'in açık dünya soulslike başyapıtı.',
    imageUrl: 'https://picsum.photos/seed/eldenring/600/400',
    globalScore: 4.55,
    totalVotes: 1730,
    categories: [{ categoryId: 3, name: 'Oyun' }],
  },
  {
    itemId: 8,
    name: 'Mantı',
    description: 'Kayseri usulü, sarımsaklı yoğurtla servis edilir.',
    imageUrl: 'https://picsum.photos/seed/manti/600/400',
    globalScore: 4.31,
    totalVotes: 412,
    categories: [{ categoryId: 4, name: 'Yemek' }],
  },
]

// Günün sıralaması — bugün en çok oy toplayan item'lar (vitrin verisi).
// delta: dünkü sıraya göre değişim (+n / -n / 0), 'yeni' = listeye yeni girdi.
export const dailyRanking = {
  date: '2026-07-14',
  title: 'Günün Sıralaması',
  entries: [
    { itemId: 2, votesToday: 128, delta: 0 },
    { itemId: 7, votesToday: 97, delta: 2 },
    { itemId: 1, votesToday: 84, delta: -1 },
    { itemId: 4, votesToday: 61, delta: 'yeni' },
    { itemId: 6, votesToday: 45, delta: -2 },
  ],
}

export const users = [
  { userId: 1, username: 'arda', email: 'arda@rankhell.dev', role: 'USER', createdAt: '2026-06-01T10:00:00' },
  { userId: 2, username: 'erkan', email: 'erkan@example.com', role: 'ADMIN', createdAt: '2026-05-20T09:30:00' },
]

// Rating: bir kullanıcı bir item'a tek oy (backend'de unique kısıt var)
export const ratings = [
  { ratingId: 1, userId: 1, itemId: 2, score: 5, createdAt: '2026-06-10T14:20:00' },
  { ratingId: 2, userId: 1, itemId: 4, score: 4, createdAt: '2026-06-12T19:05:00' },
]

export const polls = [
  {
    pollId: 1,
    creator: { userId: 2, username: 'erkan' },
    title: 'Gelmiş geçmiş en iyi film hangisi?',
    createdAt: '2026-06-15T11:00:00',
    pollItems: [
      { id: 1, itemId: 1 },
      { id: 2, itemId: 6 },
    ],
  },
  {
    pollId: 2,
    creator: { userId: 1, username: 'arda' },
    title: 'Hangi yemek Türkiye\'nin en iyisi?',
    createdAt: '2026-06-20T16:45:00',
    pollItems: [
      { id: 3, itemId: 4 },
      { id: 4, itemId: 8 },
    ],
  },
]
