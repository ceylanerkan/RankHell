/**
 * /modlar kapak kartlarındaki mini soyut önizlemeler.
 * ----------------------------------------------------------------
 * Hepsi salt sunum (aria-hidden): modun mekaniğini tek bakışta anlatan
 * küçük şemalar. Kart sistemi kuralları burada da geçerli:
 *   - Radius: kart 8px → iç katman 4px (rounded), yuvalar 2px (rounded-sm).
 *   - Blur / glow / scale yok, yeni renk yok.
 *   - KOR YOK: kapak kartının tek koru hover'daki sol ember marker'dır.
 *   - BRASS YOK: kartlar tıklanabilir; brass tıklanabilir öğede kullanılmaz.
 *     Tier merdiveninin harf rozetleri bu yüzden iron/faded taşır — gerçek
 *     Tier sayfası (TierList.jsx) brass'lı halini korur.
 * Yapı rolü line / iron / ash-deep / faded üzerinden konuşur.
 */

// Önizleme çerçevesi: kartın içindeki küçük "ekran".
function Frame({ children }) {
  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 flex-col justify-center gap-2 rounded border border-line bg-coal p-3 sm:gap-2.5 sm:p-4"
    >
      {children}
    </div>
  )
}

// Boş/dolu yuva: tek ölçü, tüm önizlemeler aynı ızgara diliyle konuşsun.
function Slot({ className = '', children }) {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-sm font-display text-[10px] font-extrabold sm:h-8 sm:w-8 sm:text-xs ${className}`}
    >
      {children}
    </span>
  )
}

// Tier List: azalan dolulukta S / A / B satırları.
const TIER_ROWS = [
  { id: 'S', filled: 3 },
  { id: 'A', filled: 2 },
  { id: 'B', filled: 1 },
]

export function TierPreview() {
  return (
    <Frame>
      {TIER_ROWS.map((row) => (
        <span key={row.id} className="flex items-center gap-2 sm:gap-2.5">
          <Slot className="bg-iron text-faded">{row.id}</Slot>
          {Array.from({ length: 3 }, (_, i) => (
            <Slot key={i} className={i < row.filled ? 'bg-line' : 'bg-coal-light'} />
          ))}
        </span>
      ))}
    </Frame>
  )
}

// Her Sıradan Bir Tanesini Seç: her satırda tek bir yuva seçili.
const ROW_PICKS = [1, 3, 0]

export function RowPickPreview() {
  return (
    <Frame>
      {ROW_PICKS.map((picked, row) => (
        <span key={row} className="flex items-center gap-2 sm:gap-2.5">
          {Array.from({ length: 4 }, (_, col) => (
            <Slot key={col} className={col === picked ? 'bg-ash-deep' : 'bg-line'} />
          ))}
        </span>
      ))}
    </Frame>
  )
}

// Hangi Sütunu Seçersin: sütunlardan biri işaretli.
const PICKED_COLUMN = 2

export function ColumnPickPreview() {
  return (
    <Frame>
      <span className="flex items-start gap-2 sm:gap-2.5">
        {Array.from({ length: 4 }, (_, col) => (
          <span
            key={col}
            className={`flex flex-col gap-2 sm:gap-2.5 rounded-sm p-0.5 ${
              col === PICKED_COLUMN ? 'ring-1 ring-copper/50' : ''
            }`}
          >
            {Array.from({ length: 3 }, (_, row) => (
              <Slot key={row} className={col === PICKED_COLUMN ? 'bg-ash-deep' : 'bg-line'} />
            ))}
          </span>
        ))}
      </span>
    </Frame>
  )
}

// Harf yuvalı önizlemeler: kararın baş harfleri (Öp/Öldür/Evlen · Oynat/Yedek bırak/Sat).
function LetterPreview({ letters }) {
  return (
    <Frame>
      <span className="flex items-center gap-2 sm:gap-2.5">
        {letters.map((letter, i) => (
          <Slot key={i} className="bg-line text-faded">
            {letter}
          </Slot>
        ))}
      </span>
    </Frame>
  )
}

export function KissMarryPreview() {
  return <LetterPreview letters={['Ö', 'Ö', 'E']} />
}

// Üç seçenek: Oynat · Yedek Bırak · Sat ("yedek bırak" tek karardır).
export function SquadPreview() {
  return <LetterPreview letters={['O', 'Y', 'S']} />
}
