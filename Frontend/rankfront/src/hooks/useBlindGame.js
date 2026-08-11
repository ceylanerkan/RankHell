import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildQueue } from '../lib/queue'

// Kör Sıralama oyununun tek state kaynağı. BlindPlay bu hook dışında hiçbir şey
// bilmez — ne karıştırma, ne zamanlayıcı. useClassicGame ile aynı sözleşme:
// veri burada, bileşen sadece çizer.
//
// KLASİKTEN TEK ANLAMLI FARK: burada rateItem ÇAĞRILMAZ. Kör sıralama yalnızca
// oyuncunun kendi sırasıdır, item'ların genel puanına dokunmaz. Klasikten
// kopyalarken bu satırı geri getirme.
//
// Geri al ve atla da yok: N seçenek ↔ N yuva birebir eşleşiyor, atlanan bir
// seçenek dolmayan bir yuva demek olurdu.

// Yerleştirmeden sonra sıradaki seçeneğe geçiş süresi. Klasik puanlamayla aynı
// beat: iki oyun aynı geçiş dilini konuşsun.
const ADVANCE_MS = 700

/**
 * @param {{ items: object[], roundCount: number }} params
 * @returns oyunun tüm durumu + place aksiyonu
 */
export function useBlindGame({ items, roundCount }) {
  // Kuyruk bir kez kurulur ve oyun boyunca sabit kalır: "tekrar oyna" bileşeni
  // yeniden mount ettiği için yeni karıştırma zaten oradan doğar.
  const [queue] = useState(() => buildQueue(items, roundCount))
  const [index, setIndex] = useState(0)
  // Yuva sayısı roundCount'tan DEĞİL kuyruk uzunluğundan türer: buildQueue
  // havuzu aşan turu kırpıyor, eşleşme bozulursa sonda boş yuva kalırdı.
  const [slots, setSlots] = useState(() => Array(queue.length).fill(null))
  const [status, setStatus] = useState('placing') // placing | advancing | done
  const timerRef = useRef(null)

  // Vazgeç / unmount: bekleyen geçiş zamanlayıcısı kapalı kalan ekrana state yazmasın.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const total = queue.length
  const current = status === 'done' ? null : (queue[index] ?? null)

  const place = useCallback(
    (slotIndex) => {
      // Geçiş sırasındaki ikinci tık yutulur: tek seçenek iki yuvaya girmez.
      if (status !== 'placing') return
      if (slotIndex < 0 || slotIndex >= total) return
      // Dolu yuva: UI'da zaten tıklanabilir değil, burada da yutulur.
      if (slots[slotIndex]) return
      const item = queue[index]
      if (!item) return

      setSlots((prev) => {
        const next = [...prev]
        next[slotIndex] = item
        return next
      })
      setStatus('advancing')

      timerRef.current = setTimeout(() => {
        if (index + 1 >= total) {
          setStatus('done')
        } else {
          setIndex((i) => i + 1)
          setStatus('placing')
        }
      }, ADVANCE_MS)
    },
    [status, slots, queue, index, total],
  )

  // Son yerleştirmenin hangi yuvaya gittiği: ayrı state tutulmaz, geçiş
  // sürerken kuyruktaki mevcut seçenek zaten yuvalarda aranabilir (duyuru için).
  const placedSlot =
    status === 'advancing' && current
      ? slots.findIndex((slot) => slot?.itemId === current.itemId)
      : -1

  // Sonuç sıralaması: dizinin kendisi sıralamadır, sıralama işlemi yok. Puan
  // alanı bilerek üretilmez — kör sıralamada puan diye bir şey yok.
  const results = useMemo(
    () => slots.filter(Boolean).map((item, i) => ({ item, rank: i + 1 })),
    [slots],
  )

  const placedCount = slots.filter(Boolean).length

  // İlerleme klasikle aynı formül: geçiş sürerken mevcut seçenek kapanmış sayılır.
  const resolved = total ? index + (status === 'placing' ? 0 : 1) : 0
  const progress = total ? Math.round((resolved / total) * 100) : 0

  return {
    current,
    index,
    total,
    slots,
    placedCount,
    placedSlot,
    progress,
    status,
    results,
    place,
  }
}
