import { Play, Star, Bookmark, Share2, Flag } from 'lucide-react'
import CategoryBadge from '../CategoryBadge'
import Button from '../ui/button/Button'
import PollStats from './PollStats'
import { pollModeLabel } from '../../lib/pollModes'

// Anket künyesi: solda kimlik + aksiyonlar, sağda kapak.
// Bu adımda sayfa iskelet — her buton disabled, hiçbir handler yok.
// Sayfanın tek primary'si OYNA (Damga v1: view başına tek primary).

// Mod çipleri bilgi etiketi: anketin hangi modlarda oynanabildiğini söyler,
// tıklanmaz. Mod seçimi ayrı bir adımda tasarlanacak.
function ModeChip({ label }) {
  return (
    <span className="inline-block rounded border border-line px-2.5 py-1 text-xs font-semibold text-faded">
      {label}
    </span>
  )
}

function Cover({ src, alt }) {
  if (!src) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-xl bg-coal-light text-sm text-faded"
        role="img"
        aria-label="Kapak görseli yok"
      >
        Kapak yok
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className="aspect-video w-full rounded-xl object-cover shadow-[0_20px_44px_-16px_rgba(0,0,0,0.9)]"
    />
  )
}

export default function PollHeader({ poll }) {
  const { title, description, coverUrl, category, featured, modes = [], creator } = poll

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
      <div>
        <div className="flex flex-wrap items-center gap-1.5">
          {category && <CategoryBadge name={category.name} />}
          {featured && <CategoryBadge name="Editörün Seçimi" tone="brass" />}
        </div>

        <h1 className="title-copper mt-3 font-display text-4xl font-extrabold leading-tight text-cream">
          {title}
        </h1>

        {modes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {modes.map((mode) => (
              <ModeChip key={mode} label={pollModeLabel(mode)} />
            ))}
          </div>
        )}

        {description && <p className="mt-4 max-w-2xl text-cream/90">{description}</p>}

        <p className="mt-5 text-sm text-faded">
          Oluşturan <span className="font-bold text-cream">@{creator?.username ?? 'anonim'}</span>
        </p>

        <div className="mt-4">
          <PollStats poll={poll} />
        </div>

        {/* Aksiyon şeridi — bu adımda hepsi pasif. */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg" disabled>
            <Play className="h-5 w-5" aria-hidden="true" />
            Oyna
          </Button>
          <Button variant="secondary" disabled>
            <Star className="h-4 w-4" aria-hidden="true" />
            Puan Ver
          </Button>
          <Button variant="ghost" disabled>
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            Kaydet
          </Button>
          <Button variant="ghost" disabled>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Paylaş
          </Button>
          <Button variant="link" disabled>
            <Flag className="h-4 w-4" aria-hidden="true" />
            Bildir
          </Button>
        </div>
      </div>

      <Cover src={coverUrl} alt={`${title} kapak görseli`} />
    </div>
  )
}
