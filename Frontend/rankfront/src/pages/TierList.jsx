// Tier listesi iskeleti: S → F satırları, şimdilik boş yuvalarla.
// Veri modeli gelince yuvalar gerçek öğelerle dolacak (sürükle-bırak planlı);
// o yüzden satır tanımı tek kaynak olarak dışa aktarılıyor.
const TIERS = [
  { id: 'S', tagline: 'Efsane', badge: 'bg-acid text-night', row: 'glow-acid animate-acid-breathe' },
  { id: 'A', tagline: 'Harika', badge: 'bg-ember text-night', row: 'ring-1 ring-ember/30' },
  { id: 'B', tagline: 'İyi', badge: 'bg-flame text-night', row: 'ring-1 ring-flame/25' },
  { id: 'C', tagline: 'İdare eder', badge: 'bg-plasma text-white', row: 'ring-1 ring-plasma/30' },
  { id: 'D', tagline: 'Zayıf', badge: 'bg-zap-deep text-night', row: 'ring-1 ring-zap/20' },
  { id: 'F', tagline: 'Felaket', badge: 'bg-coal-light text-faded', row: 'ring-1 ring-line' },
]

const SLOTS = 5 // satır başına boş yuva sayısı

export { TIERS }

export default function TierList() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="title-ember font-display text-3xl font-extrabold text-cream">
          Tier Listesi
        </h1>
        <span className="badge-day">⚡ Yakında: sürükle-bırak ile doldur</span>
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
              <span className={`text-3xl font-extrabold sm:text-4xl ${tier.id === 'S' ? 'animate-neon-pulse' : ''}`}>
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
