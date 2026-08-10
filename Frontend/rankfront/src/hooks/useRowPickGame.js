import { useCallback, useEffect, useMemo, useState } from 'react'
import { isComplete, pickedCount, resolvePicks } from '../lib/rowPick'

// "Her Sıradan Bir Tanesini Seç" oyununun tek state kaynağı. useBlindGame ile
// aynı sözleşme: hesap burada, bileşen sadece çizer.
//
// Kuyruk/zamanlayıcı YOK: bu oyun tur tur ilerlemiyor, tüm ızgara tek ekranda
// duruyor ve oyuncu "Tamamla"ya basana kadar seçimini istediği kadar
// değiştirebiliyor. Bu yüzden hook'un tuttuğu tek şey satır→seçenek eşlemesi.

/**
 * @param {{ rows?: object[] }} game — satırsız oyunlarda rows undefined gelir
 * @returns oyunun tüm durumu + pick/complete/replay aksiyonları
 */
export function useRowPickGame(game) {
  const rows = useMemo(() => game?.rows ?? [], [game])
  const [picks, setPicks] = useState({})
  const [phase, setPhase] = useState('play') // play | result

  // Başka bir oyuna geçilince (aynı rota, farklı gameId) tahta sıfırlanır:
  // yoksa önceki oyunun seçimleri yeni satırlarda asılı kalırdı.
  useEffect(() => {
    setPicks({})
    setPhase('play')
  }, [game?.gameId])

  const pick = useCallback((rowId, optionId) => {
    // Aynı kareye tekrar tıklamak seçimi kaldırır; başka kareye tıklamak
    // seçimi taşır. Satır başına tek seçim olduğu için ikisi de tek atama.
    setPicks((prev) => (prev[rowId] === optionId ? omit(prev, rowId) : { ...prev, [rowId]: optionId }))
  }, [])

  const complete = useCallback(() => {
    // Eksik tahtayla sonuç ekranı açılmaz: buton zaten disabled, burada da yutulur.
    setPhase((prev) => (isComplete(rows, picks) ? 'result' : prev))
  }, [rows, picks])

  const replay = useCallback(() => {
    setPicks({})
    setPhase('play')
  }, [])

  const results = useMemo(
    () => (phase === 'result' ? resolvePicks(rows, picks) : []),
    [phase, rows, picks],
  )

  return {
    rows,
    picks,
    phase,
    picked: pickedCount(rows, picks),
    total: rows.length,
    canComplete: isComplete(rows, picks),
    results,
    pick,
    complete,
    replay,
  }
}

function omit(obj, key) {
  const next = { ...obj }
  delete next[key]
  return next
}
