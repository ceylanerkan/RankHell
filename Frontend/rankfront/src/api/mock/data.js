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
    imageUrl: '/items/godfather.jpg',
    globalScore: 4.72,
    totalVotes: 1843,
    categories: [{ categoryId: 1, name: 'Film' }],
  },
  {
    itemId: 2,
    name: 'Breaking Bad',
    description: 'Kimya öğretmeni Walter White\'ın karanlık dönüşümü.',
    imageUrl: '/items/breakingbad.jpg',
    globalScore: 4.85,
    totalVotes: 2517,
    categories: [{ categoryId: 2, name: 'Dizi' }],
  },
  {
    itemId: 3,
    name: 'The Witcher 3',
    description: 'Rivyalı Geralt\'ın açık dünya macerası.',
    imageUrl: '/items/witcher.jpg',
    globalScore: 4.61,
    totalVotes: 1292,
    categories: [{ categoryId: 3, name: 'Oyun' }],
  },
  {
    itemId: 4,
    name: 'İskender Kebap',
    description: 'Bursa\'nın dünyaca ünlü, tereyağlı ve yoğurtlu kebabı.',
    imageUrl: '/items/iskender.jpg',
    globalScore: 4.43,
    totalVotes: 674,
    categories: [{ categoryId: 4, name: 'Yemek' }],
  },
  {
    itemId: 5,
    name: 'The Dark Side of the Moon',
    description: 'Pink Floyd\'un 1973 tarihli kült albümü.',
    imageUrl: '/items/darkside.jpg',
    globalScore: 4.58,
    totalVotes: 958,
    categories: [{ categoryId: 5, name: 'Müzik' }],
  },
  {
    itemId: 6,
    name: 'Interstellar',
    description: 'Zaman, yerçekimi ve sevgi üzerine bir uzay destanı.',
    imageUrl: '/items/interstellar.jpg',
    globalScore: 4.49,
    totalVotes: 2103,
    categories: [{ categoryId: 1, name: 'Film' }],
  },
  {
    itemId: 7,
    name: 'Elden Ring',
    description: 'FromSoftware\'in açık dünya soulslike başyapıtı.',
    imageUrl: '/items/eldenring.jpg',
    globalScore: 4.55,
    totalVotes: 1730,
    categories: [{ categoryId: 3, name: 'Oyun' }],
  },
  {
    itemId: 8,
    name: 'Mantı',
    description: 'Kayseri usulü, sarımsaklı yoğurtla servis edilir.',
    imageUrl: '/items/manti.jpg',
    globalScore: 4.31,
    totalVotes: 412,
    categories: [{ categoryId: 4, name: 'Yemek' }],
  },
  {
    itemId: 9,
    name: 'Blade Runner 2049',
    description: 'Neon ışıklı distopik gelecekte bir replikant avcısının izini süren görsel şölen.',
    imageUrl: '/items/bladerunner.jpg',
    globalScore: 4.34,
    totalVotes: 1156,
    categories: [{ categoryId: 1, name: 'Film' }],
  },
  {
    itemId: 10,
    name: 'Yüzüklerin Efendisi: Yüzük Kardeşliği',
    description: 'Orta Dünya\'da Tek Yüzük\'ü yok etme yolculuğunun destansı başlangıcı.',
    imageUrl: '/items/lotr.jpg',
    globalScore: 4.78,
    totalVotes: 2680,
    categories: [{ categoryId: 1, name: 'Film' }],
  },
  {
    itemId: 11,
    name: 'Mad Max: Fury Road',
    description: 'Kıyamet sonrası çölde durmak bilmeyen bir hayatta kalma kovalamacası.',
    imageUrl: '/items/madmax.jpg',
    globalScore: 4.41,
    totalVotes: 1394,
    categories: [{ categoryId: 1, name: 'Film' }],
  },
  {
    itemId: 12,
    name: 'Game of Thrones',
    description: 'Demir Taht için verilen acımasız entrika ve iktidar savaşı.',
    imageUrl: '/items/got.jpg',
    globalScore: 4.29,
    totalVotes: 3120,
    categories: [{ categoryId: 2, name: 'Dizi' }],
  },
  {
    itemId: 13,
    name: 'Chernobyl',
    description: '1986 nükleer felaketini ve ardındaki insanlık dramını anlatan mini dizi.',
    imageUrl: '/items/chernobyl.jpg',
    globalScore: 4.81,
    totalVotes: 1502,
    categories: [{ categoryId: 2, name: 'Dizi' }],
  },
  {
    itemId: 14,
    name: 'The Sopranos',
    description: 'Mafya babası Tony Soprano\'nun terapi koltuğundaki çelişkileri.',
    imageUrl: '/items/sopranos.jpg',
    globalScore: 4.66,
    totalVotes: 1188,
    categories: [{ categoryId: 2, name: 'Dizi' }],
  },
  {
    itemId: 15,
    name: 'The Office',
    description: 'Bir kağıt şirketinde geçen, sahte belgesel formatında ofis komedisi.',
    imageUrl: '/items/office.jpg',
    globalScore: 4.63,
    totalVotes: 1975,
    categories: [{ categoryId: 2, name: 'Dizi' }],
  },
  {
    itemId: 16,
    name: 'The Legend of Zelda: Breath of the Wild',
    description: 'Hyrule\'ün uçsuz bucaksız açık dünyasında özgür keşif macerası.',
    imageUrl: '/items/zelda.jpg',
    globalScore: 4.74,
    totalVotes: 2044,
    categories: [{ categoryId: 3, name: 'Oyun' }],
  },
  {
    itemId: 17,
    name: 'Red Dead Redemption 2',
    description: 'Vahşi Batı\'nın son günlerinde bir çete üyesinin sürükleyici hikâyesi.',
    imageUrl: '/items/rdr2.jpg',
    globalScore: 4.69,
    totalVotes: 1867,
    categories: [{ categoryId: 3, name: 'Oyun' }],
  },
  {
    itemId: 18,
    name: 'Dark Souls',
    description: 'Zorluğuyla nam salmış, kasvetli ve ödüllendirici bir soulslike klasiği.',
    imageUrl: '/items/darksouls.jpg',
    globalScore: 4.52,
    totalVotes: 1421,
    categories: [{ categoryId: 3, name: 'Oyun' }],
  },
  {
    itemId: 19,
    name: 'Lahmacun',
    description: 'İnce hamur üzerine kıymalı harç; limon ve maydanozla dürüm yapılır.',
    imageUrl: '/items/lahmacun.jpg',
    globalScore: 4.38,
    totalVotes: 903,
    categories: [{ categoryId: 4, name: 'Yemek' }],
  },
  {
    itemId: 20,
    name: 'Baklava',
    description: 'Kat kat yufka, Antep fıstığı ve şerbetle taçlanan geleneksel tatlı.',
    imageUrl: '/items/baklava.jpg',
    globalScore: 4.62,
    totalVotes: 1287,
    categories: [{ categoryId: 4, name: 'Yemek' }],
  },
  {
    itemId: 21,
    name: 'Adana Kebap',
    description: 'Zırhla kıyılmış etin acılı, közde pişen meşhur şiş kebabı.',
    imageUrl: '/items/adana.jpg',
    globalScore: 4.51,
    totalVotes: 1042,
    categories: [{ categoryId: 4, name: 'Yemek' }],
  },
  {
    itemId: 22,
    name: 'Beethoven - 9. Senfoni',
    description: 'Sevinç Korosu\'yla doruğa çıkan, tarihin en görkemli senfonilerinden biri.',
    imageUrl: '/items/symphony.jpg',
    globalScore: 4.83,
    totalVotes: 771,
    categories: [{ categoryId: 5, name: 'Müzik' }],
  },
  {
    itemId: 23,
    name: 'Mozart - Requiem',
    description: 'Bestecinin tamamlayamadan öldüğü, ölümü anlatan görkemli ayin müziği.',
    imageUrl: '/items/score.jpg',
    globalScore: 4.71,
    totalVotes: 645,
    categories: [{ categoryId: 5, name: 'Müzik' }],
  },
  {
    itemId: 24,
    name: 'Vivaldi - Dört Mevsim',
    description: 'Dört keman konçertosunda mevsimlerin sesini resmeden barok başyapıt.',
    imageUrl: '/items/violin.jpg',
    globalScore: 4.60,
    totalVotes: 812,
    categories: [{ categoryId: 5, name: 'Müzik' }],
  },
  {
    itemId: 25,
    name: 'Bach - Toccata ve Füg',
    description: 'Borulu orgun gücünü sergileyen, ikonik ve dramatik org eseri.',
    imageUrl: '/items/organ.jpg',
    globalScore: 4.57,
    totalVotes: 583,
    categories: [{ categoryId: 5, name: 'Müzik' }],
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

// Düello: iki rakip, tek oy. Anonim oylanır — item rating'lerinden ayrı bir akış,
// hero'da kayıt olmadan tek tıkla oy verilsin diye.
// imageUrl null ise widget düz renk + baş harf placeholder'ı çizer; backend gerçek
// URL yollamaya başlayınca component değişmeden çalışır.
// Not: renk veriye yazılmaz — taraf tonu A/B pozisyonundan türetilir (tek renk ailesi).
export const duels = [
  {
    duelId: 1,
    title: 'Kebap masasında son söz',
    itemA: { name: 'Adana Kebap', imageUrl: '/duels/adana.jpg' },
    itemB: { name: 'İskender', imageUrl: '/duels/iskender.jpg' },
    votesA: 796,
    votesB: 488, // 1.284 oy · %62 — %38
  },
  {
    duelId: 2,
    title: 'Altın çağın iki devi',
    itemA: { name: 'Breaking Bad', imageUrl: '/duels/breakingbad.jpg' },
    itemB: { name: 'The Wire', imageUrl: '/duels/wire.jpg' },
    votesA: 1120,
    votesB: 954,
  },
  {
    duelId: 3,
    title: 'Açık dünyanın tahtı',
    itemA: { name: 'Elden Ring', imageUrl: '/duels/eldenring.jpg' },
    itemB: { name: 'The Witcher 3', imageUrl: '/duels/witcher.jpg' },
    votesA: 688,
    votesB: 731,
  },
  {
    duelId: 4,
    title: 'Sinemanın ağır topları',
    itemA: { name: 'The Godfather', imageUrl: '/duels/godfather.jpg' },
    itemB: { name: 'Interstellar', imageUrl: '/duels/interstellar.jpg' },
    votesA: 1502,
    votesB: 1187,
  },
  {
    duelId: 5,
    title: 'Fincanda biten kavga',
    itemA: { name: 'Çay', imageUrl: '/duels/cay.jpg' },
    itemB: { name: 'Türk Kahvesi', imageUrl: '/duels/kahve.jpg' },
    votesA: 2210,
    votesB: 1640,
  },
]

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
