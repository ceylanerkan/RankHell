import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSession, rateItem } from '../api/client'
import { buildQueue } from '../lib/queue'

// Klasik Puanlama oyununun tek state kaynağı. ClassicPlay bu hook dışında hiçbir
// şey bilmez — ne karıştırma, ne zamanlayıcı, ne oy kaydı. useDuel ile aynı
// sözleşme: veri/yan etki burada, bileşen sadece çizer.

// Puandan sonra sıradaki seçeneğe geçiş süresi. Kartın solma geçişi (300ms)
// bitip bir an duruyor: seçim onaylandı hissi oluşuyor ama akış yavaşlamıyor.
const ADVANCE_MS = 700

/**
 * @param {{ items: object[], roundCount: number }} params
 * @returns oyunun tüm durumu + rate/restart aksiyonları
 */
export function useClassicGame({ items, roundCount }) {
  // Kuyruk bir kez kurulur ve oyun boyunca sabit kalır: "tekrar oyna" bileşeni
  // yeniden mount ettiği için yeni karıştırma zaten oradan doğar.
  const [queue] = useState(() => buildQueue(items, roundCount))
  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState({}) // itemId -> 1..5
  const [status, setStatus] = useState('rating') // rating | advancing | done
  const timerRef = useRef(null)

  // Vazgeç / unmount: bekleyen geçiş zamanlayıcısı kapalı kalan ekrana state yazmasın.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const total = queue.length
  const current = status === 'done' ? null : (queue[index] ?? null)

  const rate = useCallback(
    (score) => {
      // Geçiş sırasındaki ikinci tık yutulur: aynı seçenek iki kez puanlanmaz.
      if (status !== 'rating') return
      const item = queue[index]
      if (!item) return

      setScores((prev) => ({ ...prev, [item.itemId]: score }))
      setStatus('advancing')

      // Girişliyse puan item'ın genel skoruna da işlenir. Bilerek await
      // EDİLMİYOR: oyunun ritmi ağ gecikmesine bağlanmaz ve kayıt hatası
      // oyunu kesmez — puan her hâlükârda bu oturumun sonucunda sayılır.
      if (getSession()) {
        rateItem(item.itemId, score).catch(() => {})
      }

      timerRef.current = setTimeout(() => {
        if (index + 1 >= total) {
          setStatus('done')
        } else {
          setIndex((i) => i + 1)
          setStatus('rating')
        }
      }, ADVANCE_MS)
    },
    [status, queue, index, total],
  )

  // Atla: puan yazılmadan sıradakine geçilir. Geçiş animasyonu yok — onaylanacak
  // bir seçim de yok, bekletmek sadece yavaşlatırdı.
  const skip = useCallback(() => {
    if (status !== 'rating') return
    if (index + 1 >= total) setStatus('done')
    else setIndex((i) => i + 1)
  }, [status, index, total])

  // Geri al: puan verdikten hemen sonra (geçiş sürerken) o puanı siler ve aynı
  // seçenekte kalır; puanlamayı bekleyen bir seçenekteysek bir öncekine döner.
  // Kayıt yapılmış bir puanı geri almaz — genel skor yeniden puanlanınca
  // güncellenir (rateItem mükerrer oyu güncelleme olarak işliyor).
  const canUndo = status === 'advancing' || (status === 'rating' && index > 0)
  const undo = useCallback(() => {
    if (status === 'done') return
    const target = status === 'advancing' ? index : index - 1
    if (target < 0) return
    clearTimeout(timerRef.current)
    const item = queue[target]
    setScores((prev) => {
      const next = { ...prev }
      delete next[item.itemId]
      return next
    })
    setIndex(target)
    setStatus('rating')
  }, [status, index, queue])

  // Sonuç sıralaması: puan azalan, eşitlikte genel skor azalan, o da eşitse ada
  // göre — aynı puanlar rastgele dizilmesin, sıralama her okumada aynı çıksın.
  // Atlanan seçenekler listeye girmez: puanlanmadılar, sıralanamazlar.
  const results = useMemo(
    () =>
      queue
        .filter((item) => scores[item.itemId] !== undefined)
        .map((item) => ({ item, score: scores[item.itemId] }))
        .sort(
          (a, b) =>
            b.score - a.score ||
            (b.item.globalScore ?? 0) - (a.item.globalScore ?? 0) ||
            a.item.name.localeCompare(b.item.name, 'tr'),
        ),
    [queue, scores],
  )

  const ratedCount = Object.keys(scores).length
  const average = ratedCount
    ? Object.values(scores).reduce((sum, value) => sum + value, 0) / ratedCount
    : 0

  // İlerleme "kaç seçenek kapandı" üzerinden: atlanan da sayılır, yoksa atlarken
  // bar donardı. Geçiş sürerken (advancing) mevcut seçenek kapanmış sayılır.
  const resolved = total ? index + (status === 'rating' ? 0 : 1) : 0
  const progress = total ? Math.round((resolved / total) * 100) : 0

  return {
    current,
    index,
    total,
    ratedCount,
    progress,
    status,
    currentScore: current ? (scores[current.itemId] ?? 0) : 0,
    results,
    average,
    rate,
    skip,
    undo,
    canUndo,
  }
}
