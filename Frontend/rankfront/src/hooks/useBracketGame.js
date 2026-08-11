import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildQueue } from '../lib/queue'
import { largestPowerOfTwo } from '../lib/pollModes'

// Turnuva Ağacı oyununun tek state kaynağı. BracketPlay bu hook dışında hiçbir
// şey bilmez — ne karıştırma, ne zamanlayıcı. useClassicGame/useBlindGame ile
// aynı sözleşme: veri burada, bileşen sadece çizer.
//
// KÖR SIRALAMA GİBİ: burada rateItem ÇAĞRILMAZ. Eşleşmede seçilen taraf
// oyuncunun kendi tercihidir, item'ın genel puanına dokunmaz.
//
// Geri al ve atla yok: atlanan bir eşleşme üst tura kimin çıkacağını boş
// bırakırdı — ağacın tamamı o karara bağlı.

// Kazanan seçildikten sonra sıradaki eşleşmeye geçiş süresi. Üç oyun aynı
// beat'i konuşur.
const ADVANCE_MS = 700

/**
 * @param {{ items: object[], roundCount: number }} params
 * @returns oyunun tüm durumu + pick aksiyonu
 */
export function useBracketGame({ items, roundCount }) {
  // Katılımcılar bir kez kurulur ve oyun boyunca sabit kalır: "tekrar oyna"
  // bileşeni yeniden mount ettiği için yeni karıştırma zaten oradan doğar.
  //
  // Ağaç 2'nin kuvvetinde olmak ZORUNDA: roundOptionsFor('bracket', n) zaten
  // öyle bir değer veriyor, buradaki largestPowerOfTwo bozuk bir config'e
  // (ör. backend 12 gönderirse) karşı son savunma — bye/tek kalan üretmeyiz.
  const [seeds] = useState(() => {
    const pool = Array.isArray(items) ? items : []
    const requested = Number(roundCount) > 0 ? Number(roundCount) : pool.length
    const capped = Math.min(requested, pool.length)
    return capped < 2 ? [] : buildQueue(pool, largestPowerOfTwo(capped))
  })

  const size = seeds.length

  // Turlar: rounds[0] ilk turun dizilimi, sonraki turlar kazananlarla dolar.
  // Ağaç haritası da sonuç da bu tek diziden türer, paralel bir yapı tutulmaz.
  const [rounds, setRounds] = useState(() => (size >= 2 ? [seeds] : []))
  const [roundIndex, setRoundIndex] = useState(0)
  const [matchIndex, setMatchIndex] = useState(0)
  // Kaybedenler kronolojik + elendikleri turun büyüklüğü: sonuç ekranındaki
  // grup başlığı ("Yarı Final", "Son 16") bu sayıdan türer.
  const [eliminated, setEliminated] = useState([])
  const [status, setStatus] = useState(size >= 2 ? 'choosing' : 'done')
  // Geçiş sürerken hangi taraf kazandı: kaybedenin sönmesi için gerekli,
  // ayrı bir "son maç" state'i tutmaya değmez.
  const [winnerSide, setWinnerSide] = useState(null)
  const timerRef = useRef(null)

  // Vazgeç / unmount: bekleyen geçiş zamanlayıcısı kapalı kalan ekrana state yazmasın.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const done = status === 'done'
  const currentRound = rounds[roundIndex] ?? []
  const roundSize = currentRound.length
  const matchesInRound = roundSize / 2

  const matchA = done ? null : (currentRound[matchIndex * 2] ?? null)
  const matchB = done ? null : (currentRound[matchIndex * 2 + 1] ?? null)

  // Kaçıncı maçtayız (0 tabanlı). Alt turların maçları toplamı = size - roundSize
  // (8'lik ağaçta yarı finale gelindiğinde 4 maç geride kalmıştır), üstüne bu
  // turdaki sıra eklenir. Ayrı bir sayaç tutulmaz: turdan türeyince ıraksayamaz.
  const matchOrdinal = size ? size - roundSize + matchIndex : 0
  const totalMatches = size > 1 ? size - 1 : 0

  // İlerleme klasik/kör sıralamayla aynı formül: geçiş sürerken mevcut maç
  // kapanmış sayılır.
  const resolved = totalMatches ? matchOrdinal + (status === 'choosing' ? 0 : 1) : 0
  const progress = totalMatches ? Math.round((resolved / totalMatches) * 100) : 0

  const pick = useCallback(
    (side) => {
      // Geçiş sırasındaki ikinci tık yutulur: tek eşleşme iki kazanan üretmez.
      if (status !== 'choosing') return
      // Tur dizisi doğrudan rounds'tan okunur: türetilmiş currentRound her
      // render'da yeni referans olurdu, callback boşuna yeniden kurulurdu.
      const round = rounds[roundIndex] ?? []
      const a = round[matchIndex * 2]
      const b = round[matchIndex * 2 + 1]
      if (!a || !b) return

      const winner = side === 'A' ? a : b
      const loser = side === 'A' ? b : a

      setRounds((prev) => {
        const next = prev.map((round) => [...round])
        if (!next[roundIndex + 1]) next[roundIndex + 1] = []
        // matchIndex sırayla ilerlediği için delikli dizi oluşmaz.
        next[roundIndex + 1][matchIndex] = winner
        return next
      })
      setEliminated((prev) => [...prev, { item: loser, roundSize }])
      setWinnerSide(side)
      setStatus('advancing')

      timerRef.current = setTimeout(() => {
        setWinnerSide(null)
        if (matchIndex + 1 < matchesInRound) {
          setMatchIndex((i) => i + 1)
          setStatus('choosing')
        } else if (matchesInRound === 1) {
          // Final oynandı: üst turda tek kişi kaldı, şampiyon belli.
          // roundIndex bilerek artırılmaz — sayaç ve harita son turda kalır.
          setStatus('done')
        } else {
          setRoundIndex((r) => r + 1)
          setMatchIndex(0)
          setStatus('choosing')
        }
      }, ADVANCE_MS)
    },
    [status, rounds, matchIndex, matchesInRound, roundIndex, roundSize],
  )

  // Son turda tek kişi kaldıysa şampiyon odur.
  const last = rounds[rounds.length - 1]
  const champion = last && last.length === 1 ? last[0] : null

  // Sonuç: şampiyon başta, ardından elenenler TERS kronolojik — en son elenen
  // (finalist) en üstte. Aynı turda elenenler arasında sıra iddia edilmez;
  // sonuç ekranı onları tek grup olarak gösterir.
  const results = useMemo(() => {
    if (!size) return []
    const list = champion ? [{ item: champion, roundSize: null }] : []
    for (let i = eliminated.length - 1; i >= 0; i -= 1) list.push(eliminated[i])
    return list
  }, [champion, eliminated, size])

  return {
    rounds,
    size,
    roundIndex,
    matchIndex,
    roundSize,
    matchesInRound,
    matchOrdinal,
    totalMatches,
    matchA,
    matchB,
    winnerSide,
    progress,
    status,
    champion,
    results,
    pick,
  }
}
