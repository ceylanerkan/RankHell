import { useCallback, useEffect, useState } from 'react'
import { getPersonas, votePersona } from '../api/client'

// Sektöre Hoş Geldin bölümünün tek veri kaynağı. Sayfa ve kartlar bu hook
// dışında hiçbir şey bilmez — ne fetch, ne mock, ne localStorage. Backend
// gerçek veriye geçtiğinde api/client.js'teki getPersonas/votePersona
// gövdeleri değişir, burası ve bileşenler aynı kalır.
//
// Filtreleme ve sıralama BİLEREK burada değil: onlar saf fonksiyon (lib/sector.js)
// ve durumları URL'de yaşıyor (pages/Sector.jsx). Hook yalnızca veriyi ve oyu tutar.

// Verilen oylar: { "1": 1, "3": -1 }. Dizi değil map, çünkü hangi yöne oy
// verildiği de lazım — sayfa yenilenince buton aktif hâlinde kalsın.
const STORAGE_KEY = 'rankhell_sector_votes'

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

// Bir kişinin sayaçlarını verilen delta'larla günceller, diziyi kopyalayarak
// döndürür. Oy değişiminde iki sayaç birden oynayabilir (up→down geçişi).
function bumpVotes(list, personaId, upDelta, downDelta) {
  if (!list) return list
  return list.map((p) =>
    p.personaId === personaId
      ? { ...p, upvotes: p.upvotes + upDelta, downvotes: p.downvotes + downDelta }
      : p,
  )
}

export function useSector() {
  const [personas, setPersonas] = useState(null)
  const [votes, setVotes] = useState(readVotes)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    getPersonas()
      .then((list) => alive && setPersonas(list))
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [])

  // direction: 1 (upvote) | -1 (downvote).
  // Aynı yöne ikinci tık oyu geri alır, ters yöne tık tarafı değiştirir.
  const vote = useCallback(
    (personaId, direction) => {
      const previous = votes[personaId] ?? 0
      const next = previous === direction ? 0 : direction

      // İyimser güncelleme: sayı tıklamayla aynı anda değişmeli, ağ gecikmesi
      // beklenmez. Hata gelirse aşağıda geri alınıyor.
      const upDelta = (next === 1 ? 1 : 0) - (previous === 1 ? 1 : 0)
      const downDelta = (next === -1 ? 1 : 0) - (previous === -1 ? 1 : 0)

      setPersonas((prev) => bumpVotes(prev, personaId, upDelta, downDelta))

      const nextVotes = { ...votes }
      if (next === 0) delete nextVotes[personaId]
      else nextVotes[personaId] = next
      setVotes(nextVotes)
      persistVotes(nextVotes)

      votePersona(personaId, next, previous).catch((e) => {
        setPersonas((prev) => bumpVotes(prev, personaId, -upDelta, -downDelta))
        setVotes((prev) => {
          const reverted = { ...prev }
          if (previous === 0) delete reverted[personaId]
          else reverted[personaId] = previous
          persistVotes(reverted)
          return reverted
        })
        setError(e.message)
      })
    },
    [votes],
  )

  return {
    personas,
    votes,
    vote,
    loading: personas === null && error === null,
    error,
  }
}
