import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react'
import Button from '../../ui/button/Button'
import { pollModeLabel } from '../../../lib/pollModes'

// Oyun bandı: oynarken site navbar'ının yerini alan şerit. Solda çıkış, ortada
// anket adı + tur bilgisi, sağda oyun araçları, alt kenarında ilerleme çubuğu.
// Band night-deep — exceptions.md §7'ye göre bu bir sayfa kromu şeridi, içerik
// kartı değil; Card sistemine çekilmez.
//
// Tüm oyun modları (klasik, kör sıralama, sırada bracket/duel) aynı bandı
// kullanır. Moda özel araçlar children olarak gelir ve tam ekran butonunun
// soluna dizilir; tam ekran her modda olduğu için bandın kendisinde yaşar.
// Bu fazda primary buton YOK (Damga v1: faz başına tek primary; oynarken tek
// aksiyon oyun alanında, banttaki her şey düşük riskli ghost/icon).
//
// navbar'ı gizleyen useHiddenNav bilerek burada değil oyun bileşenlerinde:
// bandın varlığı değil, oyun fazında olmak gizliyor (oyun ekranı bandı
// çizmeden erken dönebiliyor).

// Bandın kimlik bloğu: anket adı + hangi modda kaçıncı turdayız. Masaüstünde
// ortada, dar ekranda ikonların altındaki kendi satırında görünür — iki yerde
// aynı görünsün diye tek bileşen.
function BandTitle({ title, modeKey, index, total }) {
  return (
    <>
      <h1 className="truncate font-display text-lg font-extrabold uppercase leading-tight tracking-wide text-cream sm:text-2xl">
        {title}
      </h1>
      <p className="mt-0.5 truncate text-[11px] font-bold uppercase tracking-widest text-faded sm:text-xs">
        {pollModeLabel(modeKey)} · {index + 1} / {total}
      </p>
    </>
  )
}

export default function PlayBand({ title, modeKey, index, total, progress, onQuit, children }) {
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

  return (
    // main'in px-6/py-8 kutusundan taşıp ekran genişliğine yayılır (Home
    // hero'sundaki full-bleed deseni), -mt-8 ile main'in üst boşluğunu yutup
    // navbar'ın bıraktığı yere oturur. Yatay taşmayı Shell'deki overflow-x-clip
    // engeller.
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
              çıkış + ikonlar arasında ~150px'e sıkışıp anket adı da tur sayacı
              da okunamıyordu. */}
          <div className="hidden min-w-0 text-center sm:block">
            <BandTitle title={title} modeKey={modeKey} index={index} total={total} />
          </div>

          {/* icon-line: bandın koyu şeridinde çerçeveli sessiz ikon — Damga v1'in
              yoğun zemin seçeneği. Moda özel araçlar solda, tam ekran sabit sağda. */}
          <div className="flex flex-1 justify-end gap-1.5 sm:gap-2">
            {children}
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
          <BandTitle title={title} modeKey={modeKey} index={index} total={total} />
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
  )
}
