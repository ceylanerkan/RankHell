// Tier listesi iskeleti: S → F satırları, şimdilik boş yuvalarla.
// Veri modeli gelince yuvalar gerçek öğelerle dolacak (sürükle-bırak planlı);
// o yüzden satır tanımı tek kaynak olarak dışa aktarılıyor.
const TIERS = [
  { id: 'S', tagline: 'Efsane', badge: 'bg-brass-soft text-night', row: 'glow-brass animate-status-breathe' },
  { id: 'A', tagline: 'Harika', badge: 'bg-brass text-night', row: 'ring-1 ring-brass/30' },
  { id: 'B', tagline: 'İyi', badge: 'bg-copper-deep text-cream', row: 'ring-1 ring-copper/30' },
  { id: 'C', tagline: 'İdare eder', badge: 'bg-ash-deep text-cream', row: 'ring-1 ring-ash/30' },
  { id: 'D', tagline: 'Zayıf', badge: 'bg-iron text-cream', row: 'ring-1 ring-ash-deep/30' },
  { id: 'F', tagline: 'Felaket', badge: 'bg-night-deep text-faded ring-1 ring-iron/30', row: 'ring-1 ring-iron/30' },
]

const SLOTS = 5 // satır başına boş yuva sayısı

export { TIERS }

export default function TierList() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="title-copper font-display text-3xl font-extrabold text-cream">
          Tier Listesi
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full bg-ash/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ash ring-1 ring-ash/35">
          ⚡ Yakında: sürükle-bırak ile doldur
        </span>
      </div>
      <p className="mb-8 text-sm text-faded">
        Cehennemin acımasız hiyerarşisi: en tepede efsaneler, en dipte felaketler.
      </p>

      <div className="space-y-3">
        {TIERS.map((tier, i) => (
          <div
            key={tier.id}
            className={`flex animate-rise items-stretch gap-3 rounded-2xl bg-coal/70 p-3 backdrop-blur sm:gap-4 ${tier.row}`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {/* Tier rozeti: kocaman harf — şampiyon harfi neon nabız atar */}
            <div
              className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-xl font-display sm:w-20 ${tier.badge}`}
            >
              <span className={`text-3xl font-extrabold sm:text-4xl ${tier.id === 'S' ? 'animate-rank-pulse' : ''}`}>
                {tier.id}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                {tier.tagline}
              </span>
            </div>

            {/* Boş yuvalar: yatay kayan şerit */}
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 sm:gap-3">
              {Array.from({ length: SLOTS }, (_, slot) => (
                <div key={slot} className="tier-slot">
                  ?
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-faded/70">
        Yuvalar şimdilik boş — sıralamaya hazır ol 😈
      </p>
    </div>
  )
}
