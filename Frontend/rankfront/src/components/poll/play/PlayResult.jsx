import { Link } from 'react-router-dom'
import Button from '../../ui/button/Button'
import Card from '../../ui/Card'
import PodiumSpot from '../../PodiumSpot'
import StarRating from '../../StarRating'
import { EmptyState } from '../../States'
import { rankBadgeClass } from '../../../lib/rank'

// Oyun sonucu: üstte ilk üç için podyum, altında verdiğin puana göre sıralı tam
// liste. Sıralama satırları için sistem henüz kapalı değil (DESIGN_SYSTEM §8),
// bu yüzden Home'daki "Günün Sıralaması" satır deseni birebir takip edildi.
// Brass yalnızca derece/ödül sinyali olarak yaşıyor; satırlar tıklanabilir
// değil (brass tıklanabilir öğede kullanılmaz — podyum belgelenmiş istisna).

export default function PlayResult({ poll, results, average, onReplay, onSetup }) {
  const top3 = results.slice(0, 3)

  return (
    // Sonuç ekranı kurulum/oyun ekranlarından bir kademe geniş: podyum sayfanın
    // kahramanı ve üç sütun 672px'te birbirine giriyordu.
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-faded">Sonuç</p>
        <h1 className="title-copper mt-1 font-display text-3xl font-extrabold leading-tight text-cream">
          {poll.title}
        </h1>
        <p className="mt-2 text-sm text-faded">
          {results.length} seçenek puanlandı · ortalaman{' '}
          <span className="font-bold tabular-nums text-brass-soft">{average.toFixed(1)}</span>
        </p>
      </div>

      {/* Podyum üç basamak ister: daha kısa turlarda doğrudan listeye geçilir. */}
      {top3.length === 3 && (
        <div className="mb-10 grid grid-cols-3 items-end gap-4 sm:gap-8">
          <PodiumSpot item={top3[1].item} rank={2} height="6.5rem" delay="120ms" score={top3[1].score} digits={0} size="lg" />
          <PodiumSpot item={top3[0].item} rank={1} height="9rem" delay="0ms" score={top3[0].score} digits={0} size="lg" />
          <PodiumSpot item={top3[2].item} rank={3} height="5.5rem" delay="240ms" score={top3[2].score} digits={0} size="lg" />
        </div>
      )}

      {/* Her seçenek atlanmışsa sıralanacak bir şey kalmaz. */}
      {results.length === 0 ? (
        <EmptyState message="Hiçbir seçeneği puanlamadın — sıralanacak bir şey yok." />
      ) : (
      <Card surface="neutral" behavior="static">
        <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-faded">Senin sıralaman</h2>
        <ol className="divide-y divide-line/40">
          {results.map(({ item, score }, i) => (
            <li key={item.itemId} className="flex items-center gap-3 py-3 sm:gap-4">
              <span
                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded font-display text-sm font-extrabold ${rankBadgeClass(i + 1)}`}
              >
                {i + 1}
              </span>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded object-cover shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                />
              )}
              <p className="min-w-0 flex-1 truncate font-display font-bold text-cream">{item.name}</p>
              {/* Yıldızlar burada salt okunur (onRate yok): pirinç dolar,
                  butonlar disabled gelir — satır tıklanabilir olmaz. */}
              <div className="hidden sm:block">
                <StarRating value={score} size="text-sm" />
              </div>
              <span className="w-4 shrink-0 text-right font-display text-sm font-extrabold tabular-nums text-brass-soft">
                {score}
              </span>
            </li>
          ))}
        </ol>
      </Card>
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
