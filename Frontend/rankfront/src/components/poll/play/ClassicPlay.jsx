import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Undo2, SkipForward, Maximize2, Minimize2 } from 'lucide-react'
import Button from '../../ui/button/Button'
import Card from '../../ui/Card'
import CategoryBadge from '../../CategoryBadge'
import StarRating from '../../StarRating'
import { useClassicGame } from '../../../hooks/useClassicGame'
import { useHiddenNav } from '../../../lib/chrome'
import { pollModeLabel } from '../../../lib/pollModes'

// Klasik Puanlama tur ekranı: ekranda tek seçenek durur, altındaki beş yıldızla
// puanlanır, kısa bir onay anından sonra sıradakine geçilir. Tüm state
// useClassicGame'de — burada yalnızca yerleşim ve geçiş var.
//
// Oynarken site navbar'ı gizlenir (useHiddenNav) ve yerini oyun bandı alır:
// solda çıkış, ortada anket adı + tur bilgisi, sağda oyun araçları. Band
// night-deep — exceptions.md §7'ye göre bu bir sayfa kromu şeridi, içerik
// kartı değil; Card sistemine çekilmez.
// Bu fazda primary buton YOK (Damga v1: faz başına tek primary; oynarken tek
// aksiyon yıldızlar, banttaki her şey düşük riskli ghost/icon).

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

// Bandın kimlik bloğu: anket adı + hangi modda kaçıncı turdayız. Masaüstünde
// ortada, dar ekranda ikonların altındaki kendi satırında görünür — iki yerde
// aynı görünsün diye tek bileşen.
function BandTitle({ title, index, total }) {
  return (
    <>
      <h1 className="truncate font-display text-lg font-extrabold uppercase leading-tight tracking-wide text-cream sm:text-2xl">
        {title}
      </h1>
      <p className="mt-0.5 truncate text-[11px] font-bold uppercase tracking-widest text-faded sm:text-xs">
        {pollModeLabel('classic')} · {index + 1} / {total}
      </p>
    </>
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

  // Tam ekran tarayıcının state'i: ESC ile de çıkılabildiği için ikon
  // fullscreenchange'i dinler, kendi bayrağına güvenmez.
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement))
  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])
  const toggleFullscreen = useCallback(() => {
    // İzin verilmeyen bağlamda (iOS Safari) sessizce yut: oyun akışı kesilmez.
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    else document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])

  if (!current) return null

  const advancing = status === 'advancing'

  return (
    <div>
      {/* Oyun bandı: main'in px-6/py-8 kutusundan taşıp ekran genişliğine
          yayılır (Home hero'sundaki full-bleed deseni), -mt-8 ile main'in üst
          boşluğunu yutup navbar'ın bıraktığı yere oturur. Yatay taşmayı
          Shell'deki overflow-x-clip engeller. */}
      <div className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 border-b border-line/60 bg-night-deep">
        <div className="mx-auto max-w-[1600px] px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 justify-start">
            <Button variant="ghost" size="sm" onClick={onQuit}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden uppercase tracking-widest sm:inline">Çıkış</span>
            </Button>
          </div>

          {/* Masaüstünde başlık ortada: iki yandaki flex-1 sütun sayesinde
              gerçekten ortalı kalır, başlık uzasa da ikonlar yerinden oynamaz.
              Dar ekranda bu satırdan çıkar (aşağıda kendi satırında) — yoksa
              çıkış + üç ikon arasında ~150px'e sıkışıp anket adı da tur sayacı
              da okunamıyordu. */}
          <div className="hidden min-w-0 text-center sm:block">
            <BandTitle title={poll.title} index={index} total={total} />
          </div>

          {/* icon-line: bandın koyu şeridinde çerçeveli sessiz ikon — Damga v1'in
              yoğun zemin seçeneği. Üçü de gerçekten çalışan aksiyon. */}
          <div className="flex flex-1 justify-end gap-1.5 sm:gap-2">
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
            <Button
              variant="icon-line"
              size="sm"
              aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-2 min-w-0 text-center sm:hidden">
          <BandTitle title={poll.title} index={index} total={total} />
        </div>
        </div>

        {/* İlerleme bandın alt kenarına yaslı: DuelWidget'ın oran barıyla aynı
            hareket dili (400ms ease-out). Kor burada sinyal değil veri. */}
        <div aria-hidden="true" className="h-1 bg-night">
          <div
            className="h-full bg-ember transition-[width] duration-[400ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

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
