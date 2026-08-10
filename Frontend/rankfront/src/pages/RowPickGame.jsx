// Tek bir "Her Sıradan Bir Tanesini Seç" oyununun ekranı.
//
// Üç görünüm tek route'ta yaşar:
//   satırsız oyun → künye + "yakında" bloğu (mekanik henüz o oyunda yok)
//   play          → RowPickBoard: anket oyunlarıyla aynı format (navbar gizli,
//                   yerinde PlayBand); künyeyi bant taşıdığı için sayfa başlığı
//                   çizilmez
//   result        → sayfa kromu geri gelir, ortak sonuç sahnesi çizilir
//                   (PollPlay'in sonuç fazıyla aynı davranış)
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getRowPickGame } from '../api/client'
import { Loading, ErrorState } from '../components/States'
import RowPickBoard from '../components/modes/rowpick/RowPickBoard'
import RowPickPodium from '../components/modes/rowpick/RowPickPodium'
import Button from '../components/ui/button/Button'
import { useRowPickGame } from '../hooks/useRowPickGame'

export default function RowPickGame() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [error, setError] = useState(null)
  const { rows, picks, phase, picked, total, canComplete, results, pick, complete, replay } =
    useRowPickGame(game)

  useEffect(() => {
    setGame(null)
    setError(null)
    getRowPickGame(gameId).then(setGame).catch((e) => setError(e.message))
  }, [gameId])

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <Button variant="link" as={Link} to="/modlar/sira-secimi">
          ← Tüm oyunlar
        </Button>
        <div className="mt-4">
          <ErrorState message={error} />
        </div>
      </div>
    )
  }

  if (!game) return <Loading label="Oyun yükleniyor..." />

  // Oyun fazı: sayfa künyesi ve geri linki yok — ikisi de bandın işi.
  if (rows.length > 0 && phase === 'play') {
    return (
      <RowPickBoard
        title={game.title}
        rows={rows}
        picks={picks}
        picked={picked}
        total={total}
        canComplete={canComplete}
        onPick={pick}
        onComplete={complete}
        onQuit={() => navigate('/modlar/sira-secimi')}
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Button variant="link" as={Link} to="/modlar/sira-secimi">
        ← Tüm oyunlar
      </Button>

      <section className="mt-4 border-b border-line/60 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="title-copper font-display text-3xl font-extrabold text-cream">
            {game.title}
          </h1>
          {rows.length === 0 && (
            <span className="inline-flex items-center gap-2 rounded-full bg-ash/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ash ring-1 ring-ash/35">
              ⚡ Yakında: satırlar dolacak
            </span>
          )}
        </div>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-faded">{game.description}</p>
        <p className="mt-3 text-xs font-bold tabular-nums text-faded/80">
          {game.rowCount} satır · {game.optionCount} seçenek
        </p>
      </section>

      {phase === 'result' && (
        <RowPickPodium results={results} onReplay={replay}>
          <Button variant="link" as={Link} to="/modlar/sira-secimi">
            Tüm oyunlar
          </Button>
        </RowPickPodium>
      )}
    </div>
  )
}
