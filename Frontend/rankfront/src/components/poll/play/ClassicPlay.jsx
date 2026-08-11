import { useEffect } from 'react'
import { Undo2, SkipForward } from 'lucide-react'
import Button from '../../ui/button/Button'
import Card from '../../ui/Card'
import CategoryBadge from '../../CategoryBadge'
import StarRating from '../../StarRating'
import PlayBand from './PlayBand'
import { useClassicGame } from '../../../hooks/useClassicGame'
import { useHiddenNav } from '../../../lib/chrome'

// Klasik Puanlama tur ekranı: ekranda tek seçenek durur, altındaki beş yıldızla
// puanlanır, kısa bir onay anından sonra sıradakine geçilir. Tüm state
// useClassicGame'de — burada yalnızca yerleşim ve geçiş var.
//
// Oynarken site navbar'ı gizlenir (useHiddenNav) ve yerini PlayBand alır; geri
// al / atla bu moda özel araçlar olduğu için banda children olarak verilir.

function Cover({ item }) {
  if (!item.imageUrl) {
    return (
      <div
        className="flex aspect-[3/2] w-full items-center justify-center rounded bg-night-deep text-sm text-faded"
        role="img"
        aria-label={`${item.name} görseli yok`}
      >
        Görsel yok
      </div>
    )
  }
  // 3:2 kadraj DuelWidget'takiyle aynı: /items görselleri zaten bu orana yakın,
  // kırpma en aza iniyor.
  return (
    <img
      src={item.imageUrl}
      alt={item.name}
      className="aspect-[3/2] w-full rounded object-cover object-center"
    />
  )
}

export default function ClassicPlay({ poll, roundCount, onFinish, onQuit }) {
  const { current, index, total, progress, status, currentScore, results, average, rate, skip, undo, canUndo } =
    useClassicGame({ items: poll.items, roundCount })

  useHiddenNav()

  // Son puandan sonra sonucu sayfaya devret: sonuç ekranı bu bileşenin değil,
  // PollPlay'in fazı. status bir daha 'done'dan çıkmadığı için tek kez çalışır.
  useEffect(() => {
    if (status === 'done') onFinish({ results, average })
  }, [status, results, average, onFinish])

  if (!current) return null

  const advancing = status === 'advancing'

  return (
    <div>
      <PlayBand
        title={poll.title}
        modeKey="classic"
        index={index}
        total={total}
        progress={progress}
        onQuit={onQuit}
      >
        <Button
          variant="icon-line"
          size="sm"
          aria-label="Son puanı geri al"
          disabled={!canUndo}
          onClick={undo}
        >
          <Undo2 className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="icon-line"
          size="sm"
          aria-label="Bu seçeneği atla"
          disabled={advancing}
          onClick={skip}
        >
          <SkipForward className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PlayBand>

      <div className="mx-auto mt-8 max-w-xl">
      {/* key: her seçenekte kart yeniden mount olur, animate-rise baştan oynar —
          geçiş için yeni bir animasyon/CSS sınıfı üretilmedi. */}
      <div key={current.itemId} className="animate-rise">
        {/* İçinde tıklanabilir öğe (yıldızlar) taşıdığı için kart static kalmak
            zorunda: iç içe tıklanabilir öğe üretilmez. */}
        <Card
          surface="raised"
          behavior="static"
          className={`transition-opacity duration-300 ${advancing ? 'opacity-60' : ''}`}
        >
          <Cover item={current} />

          <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight text-cream">
            {current.name}
          </h2>
          {current.description && (
            <p className="mt-1 line-clamp-2 text-sm text-faded">{current.description}</p>
          )}
          {current.categories?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {current.categories.map((category) => (
                <CategoryBadge key={category.categoryId} name={category.name} tone="night" />
              ))}
            </div>
          )}

          <div className="mt-5 border-t border-line/60 pt-5 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-faded">Puan ver</p>
            {/* Geçiş sırasında yıldızlar kapanır: ikinci tık hook'ta da yutulur,
                buradaki kilit niyeti görünür kılar (imleç kartla birlikte söner). */}
            <div className={`mt-3 ${advancing ? 'pointer-events-none' : ''}`}>
              <StarRating value={currentScore} onRate={rate} size="text-4xl" />
            </div>
          </div>
        </Card>
      </div>

      <p aria-live="polite" className="sr-only">
        {advancing
          ? `${current.name} için ${currentScore} yıldız verildi.`
          : `${index + 1} / ${total}: ${current.name}`}
      </p>
      </div>
    </div>
  )
}
