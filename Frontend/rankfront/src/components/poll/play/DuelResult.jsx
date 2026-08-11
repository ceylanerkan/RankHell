import { Link } from 'react-router-dom'
import Button from '../../ui/button/Button'
import { EmptyState } from '../../States'
import Champion from './Champion'

// "O mu, Bu mu?" sonucu: sadece şampiyon. PlayResult kullanılmaz (omurgası
// puandır), BracketResult da kullanılmaz (omurgası eleme turlarıdır).
//
// ELEME LİSTESİ YOK: bu modda elenme sırası bir başarı sıralaması değildir —
// geç gelip hemen elenen bir seçenek, erken gelip üç tur dayanandan üstte
// çıkardı. Sahte bir sıra uydurmaktansa tek gerçek söylenir: ayakta kalan bu.

export default function DuelResult({ poll, champion, contenders = 0, onReplay, onSetup }) {
  return (
    // Sonuç ekranı kurulum/oyun ekranlarından bir kademe geniş: diğer iki
    // sonuç ekranıyla aynı kutu.
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-faded">Sonuç</p>
        <h1 className="title-copper mt-1 font-display text-3xl font-extrabold leading-tight text-cream">
          {poll.title}
        </h1>
        <p className="mt-2 text-sm text-faded">
          {contenders} seçenek sırayla karşılaştı, ayakta kalan bu
        </p>
      </div>

      {champion ? (
        <Champion item={champion} />
      ) : (
        <EmptyState message="Düello tamamlanmadı — gösterilecek bir sonuç yok." />
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="lg" onClick={onReplay}>
          Tekrar oyna
        </Button>
        <Button variant="secondary" size="lg" as={Link} to={`/polls/${poll.pollId}`}>
          Ankete dön
        </Button>
      </div>
      <div className="mt-3 text-center">
        <Button variant="link" onClick={onSetup}>
          Kurulumu değiştir
        </Button>
      </div>
    </div>
  )
}
