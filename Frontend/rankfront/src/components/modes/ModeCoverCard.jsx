/**
 * /modlar vitrinindeki mod kapağı.
 * ----------------------------------------------------------------
 * Düzen: rozet → başlık → açıklama → mini önizleme → CTA satırı.
 *
 * Kart sistemi sözleşmesi:
 *   - Tıklama hedefi kartın KENDİSİdir; içine Damga butonu konmaz
 *     (iç içe tıklanabilir öğe yasak). CTA satırı Home'daki "Daha fazlası
 *     mı lazım?" kartıyla aynı `.rh-card-go` deseni.
 *   - Hazır mod → navigation (Link), hazır olmayan → interactive (button):
 *     tıklanınca kart içinde aria-live bir not belirir, sayfa değişmez.
 *   - Kart başına tek kor: hover'daki sol ember marker. İçeride ember yok.
 */

import Card from '../ui/Card'
import {
  TierPreview,
  RowPickPreview,
  ColumnPickPreview,
  KissMarryPreview,
  SquadPreview,
} from './ModePreview'

// gameModes.js anahtarı → önizleme (PollPlay'deki MODE_ICON deseni).
const MODE_PREVIEW = {
  tier: TierPreview,
  rowpick: RowPickPreview,
  colpick: ColumnPickPreview,
  kme: KissMarryPreview,
  squad: SquadPreview,
}

export default function ModeCoverCard({ mode, note, onNotReady }) {
  const Preview = MODE_PREVIEW[mode.key]

  const cardProps = mode.ready
    ? { behavior: 'navigation', to: mode.to }
    : { behavior: 'interactive', onClick: () => onNotReady(mode.key) }

  return (
    <Card
      surface="raised"
      padding="spacious"
      className="group flex h-full flex-col sm:min-h-[260px]"
      {...cardProps}
    >
      <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="inline-flex w-fit items-center rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-copper-soft ring-1 ring-line">
            {mode.badge}
          </span>
          {/* Başlık/açıklama span: kart interactive'ken kök öğe <button>,
              içine <h2>/<p> (flow content) girmez — Home kategori
              kutucuklarındaki desenin aynısı. */}
          <span className="mt-4 font-display text-2xl font-extrabold text-cream sm:text-3xl">
            {mode.label}
          </span>
          {/* Kart genişledi; satır uzunluğu okunabilir kalsın diye metin sınırlı. */}
          <span className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-faded sm:text-base">
            {mode.description}
          </span>
        </div>

        {Preview && <Preview />}
      </div>

      {/* CTA satırı kartın dibine yapışır: kartlar farklı metin uzunluklarında
          da aynı hizada bitsin (h-full + mt-auto). */}
      <div className="mt-auto pt-6">
        {mode.ready ? (
          <span className="flex items-center gap-2 font-display text-sm font-extrabold text-cream">
            Şimdi Oyna
            <span className="rh-card-go" aria-hidden="true">
              →
            </span>
          </span>
        ) : (
          <span className="font-display text-sm font-extrabold text-faded">Yakında</span>
        )}

        {/* Not yalnızca tıklanınca doğar; yer tutmadığı için kart yüksekliği
            ızgarada zaten eşitlendiğinden (h-full) düzen zıplamaz. */}
        {note && (
          <span role="status" className="mt-2 block text-xs text-faded">
            {note}
          </span>
        )}
      </div>
    </Card>
  )
}
