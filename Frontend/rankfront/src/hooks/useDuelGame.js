import { useCallback, useEffect, useRef, useState } from 'react'
import { buildQueue } from '../lib/queue'

// "O mu, Bu mu?" oyununun tek state kaynağı. DuelPlay bu hook dışında hiçbir
// şey bilmez — ne karıştırma, ne zamanlayıcı. Diğer üç oyun hook'uyla aynı
// sözleşme: veri burada, bileşen sadece çizer.
//
// TURNUVADAN FARKI: ağaç yok, kuyruk var. Kazanan sahnede KALIR, elenen gider
// ve yerine kuyruktan sıradaki gelir. Havuz tükenince ayakta kalan şampiyondur.
// Bu yüzden 2'nin kuvveti şartı da yok: n seçenek = n-1 seçim, her sayı oynanır
// (largestPowerOfTwo bilerek çağrılmaz).
//
// KÖR SIRALAMA VE TURNUVA GİBİ: burada rateItem ÇAĞRILMAZ. Seçilen taraf
// oyuncunun kendi tercihidir, item'ın genel puanına dokunmaz. Klasikten
// kopyalarken bu satırı geri getirme.
//
// Geri al ve atla yok: atlanan bir seçim tahtta kimin kaldığını belirsiz
// bırakırdı — sonraki her eşleşme o karara bağlı.

// Kazanan seçildikten sonra sıradaki eşleşmeye geçiş süresi. Dört oyun aynı
// beat'i konuşur.
const ADVANCE_MS = 700

/**
 * @param {{ items: object[], roundCount: number }} params
 * @returns oyunun tüm durumu + pick aksiyonu
 */
export function useDuelGame({ items, roundCount }) {
  // Katılımcılar bir kez kurulur ve oyun boyunca sabit kalır: "tekrar oyna"
  // bileşeni yeniden mount ettiği için yeni karıştırma zaten oradan doğar.
  // Kuyruğun tamamı baştan çekilir; sıradaki rakip nextIndex ile okunur.
  const [queue] = useState(() => {
    const pool = Array.isArray(items) ? items : []
    const requested = Number(roundCount) > 0 ? Number(roundCount) : pool.length
    const capped = Math.min(requested, pool.length)
    return capped < 2 ? [] : buildQueue(pool, capped)
  })

  const size = queue.length

  // Sahnedeki iki taraf. Kuyruğun ilk ikisi açılış eşleşmesi.
  const [left, setLeft] = useState(() => queue[0] ?? null)
  const [right, setRight] = useState(() => queue[1] ?? null)
  const [nextIndex, setNextIndex] = useState(2)
  // Çözülmüş seçim sayısı. Sayaç ve ilerleme bundan türer, paralel bir yapı
  // tutulmaz.
  const [picks, setPicks] = useState(0)
  const [champion, setChampion] = useState(null)
  const [status, setStatus] = useState(size >= 2 ? 'choosing' : 'done')
  // Geçiş sürerken hangi taraf kazandı: kaybedenin sönmesi için gerekli.
  const [winnerSide, setWinnerSide] = useState(null)
  const timerRef = useRef(null)

  // Vazgeç / unmount: bekleyen geçiş zamanlayıcısı kapalı kalan ekrana state yazmasın.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const totalMatches = size > 1 ? size - 1 : 0

  // İlerleme klasik/kör/turnuvayla aynı formül: geçiş sürerken mevcut seçim
  // kapanmış sayılır.
  const resolved = totalMatches ? picks + (status === 'choosing' ? 0 : 1) : 0
  const progress = totalMatches ? Math.round((resolved / totalMatches) * 100) : 0
  // Sahnenin üstündeki "Kalan N seçim": bu seçim dahil, yapılacak seçim sayısı.
  const remaining = totalMatches - resolved

  const pick = useCallback(
    (side) => {
      // Geçiş sırasındaki ikinci tık yutulur: tek eşleşme iki kazanan üretmez.
      if (status !== 'choosing') return
      if (!left || !right) return

      const winner = side === 'A' ? left : right

      setWinnerSide(side)
      setStatus('advancing')

      timerRef.current = setTimeout(() => {
        setWinnerSide(null)
        setPicks((p) => p + 1)

        const challenger = queue[nextIndex]
        if (!challenger) {
          // Kuyruk bitti: sahnede kalan taraf şampiyon.
          setChampion(winner)
          setStatus('done')
          return
        }

        // KAZANAN YERİNDE KALIR: yalnızca elenenin yuvası değişir. Sahnede
        // hangi kartın kaldığı böylece kendiliğinden okunur.
        if (side === 'A') setRight(challenger)
        else setLeft(challenger)

        setNextIndex((i) => i + 1)
        setStatus('choosing')
      }, ADVANCE_MS)
    },
    [status, left, right, queue, nextIndex],
  )

  return {
    left,
    right,
    size,
    picks,
    totalMatches,
    remaining,
    progress,
    status,
    winnerSide,
    champion,
    pick,
  }
}
