import { useCallback, useEffect, useRef, useState } from 'react'
import { getDuels, voteDuel } from '../api/client'

// Hero düello widget'ının tek veri kaynağı. DuelWidget bu hook dışında hiçbir şey
// bilmez — ne fetch, ne mock, ne localStorage. Backend gerçek veriye geçtiğinde
// api/client.js'teki getDuels/voteDuel gövdeleri değişir, burası ve component aynı kalır.

// Verilen oylar: { "1": "A", "3": "B" }. Dizi değil map, çünkü hangi tarafa oy
// verildiği de lazım — sayfa yenilenince "kazandı" efekti yerinde kalsın.
const STORAGE_KEY = 'rankhell_duel_votes'

function readVotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {} // gizli sekme / bozuk JSON: oy hakkı açık kalsın, patlamasın
  }
}

function persistVotes(votes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes))
  } catch {
    // kota dolu veya storage kapalı — oy yine de bu oturumda sayılır
  }
}

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

// Bir düellonun oyunu artırır/azaltır, diziyi kopyalayarak döndürür
function bumpVotes(list, index, side, amount) {
  if (!list?.[index]) return list
  const next = [...list]
  const duel = { ...next[index] }
  if (side === 'A') duel.votesA += amount
  else duel.votesB += amount
  next[index] = duel
  return next
}

export function useDuel() {
  const [duels, setDuels] = useState(null)
  const [index, setIndex] = useState(0)
  const [votes, setVotes] = useState(readVotes)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    let alive = true
    getDuels()
      .then((list) => alive && setDuels(list))
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [])

  const duel = duels?.[index] ?? null
  const hasDuel = Boolean(duel)

  // ── Sahte realtime ──────────────────────────────────────────────────
  // Gerçek realtime bağlanınca SADECE bu blok silinecek.
  // setInterval değil, kendini yeniden kuran setTimeout: aralık her turda
  // 3-8sn arası rastgele olmalı, setInterval sabit periyot verirdi.
  // hasDuel'e bağlı (duel'e değil) — yoksa her oy artışı efekti yeniden kurar.
  useEffect(() => {
    if (!hasDuel) return

    function schedule() {
      timerRef.current = setTimeout(() => {
        setDuels((prev) => bumpVotes(prev, index, Math.random() < 0.5 ? 'A' : 'B', randomInt(1, 3)))
        schedule()
      }, randomInt(3000, 8000))
    }
    schedule()

    return () => clearTimeout(timerRef.current)
  }, [hasDuel, index])

  const vote = useCallback(
    (side) => {
      if (!duel || votes[duel.duelId]) return
      const { duelId } = duel
      const at = index

      // İyimser güncelleme: bar tıklamayla aynı anda kaymalı. voteDuel await
      // edilseydi ağ gecikmesi + 400ms bar animasyonu üst üste biner, "canlı"
      // hissi ölürdü. Hata gelirse aşağıda geri alınıyor.
      setDuels((prev) => bumpVotes(prev, at, side, 1))
      const nextVotes = { ...votes, [duelId]: side }
      setVotes(nextVotes)
      persistVotes(nextVotes)

      voteDuel(duelId, side).catch((e) => {
        setDuels((prev) => bumpVotes(prev, at, side, -1))
        setVotes((prev) => {
          const reverted = { ...prev }
          delete reverted[duelId]
          persistVotes(reverted)
          return reverted
        })
        setError(e.message)
      })
    },
    [duel, votes, index],
  )

  const next = useCallback(() => {
    setError(null)
    setIndex((i) => (duels?.length ? (i + 1) % duels.length : i))
  }, [duels])

  const totalVotes = duel ? duel.votesA + duel.votesB : 0
  // percentB = 100 - percentA: ikisi ayrı yuvarlanırsa %62 + %39 = %101 olabilir
  const percentA = totalVotes > 0 ? Math.round((duel.votesA / totalVotes) * 100) : 50
  const percentB = 100 - percentA
  const votedSide = duel ? (votes[duel.duelId] ?? null) : null

  return {
    duel,
    totalVotes,
    percentA,
    percentB,
    hasVoted: votedSide !== null,
    votedSide,
    vote,
    next,
    hasNext: (duels?.length ?? 0) > 1,
    error,
  }
}
