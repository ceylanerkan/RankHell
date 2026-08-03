import { Link } from 'react-router-dom'

// Podyum sütunu: 2-1-3 dizilir, pirinç ailesi ödül hiyerarşisini taşır.
// Kart sistemi dışı bilinçli istisna (docs/design/exceptions.md): kendi ödül
// dili var, Card primitive'ine çekilmez. Brass burada "tıklanabilir öğe rengi"
// değil sonuç/ödül sinyalidir.
//
// score: rozette gösterilecek puan (varsayılan item'ın genel skoru).
// digits: puanın ondalık basamağı — genel skor 2, oyunda verilen puan 0.
// size: 'md' Home liderlik podyumu (varsayılan) · 'lg' oyun sonucu ekranı.
//   Sonuç ekranında podyum sayfanın kahramanı, Home'da bir bölüm başlığının
//   altındaki şerit — ölçek farkı buradan geliyor. Renk, oran ve etkileşim
//   dili iki boyutta da birebir aynı; yalnızca ölçüler değişir.
const SIZES = {
  md: {
    avatar: 'h-20 w-20 sm:h-28 sm:w-28',
    flame: '-top-7 text-3xl',
    name: 'text-base',
    badge: 'text-sm',
    rank: 'text-3xl',
  },
  // lg yalnızca sm ve üstünde büyür: 375px'te üç sütuna ~98px düşüyor, büyük
  // avatar orada komşusuna değiyordu. Dar ekranda md ile aynı ölçüde kalır.
  lg: {
    avatar: 'h-20 w-20 sm:h-36 sm:w-36',
    flame: '-top-7 text-3xl sm:-top-9 sm:text-4xl',
    name: 'text-base sm:text-xl',
    badge: 'text-sm sm:text-base',
    rank: 'text-3xl sm:text-5xl',
  },
}

export default function PodiumSpot({ item, rank, height, delay, score, digits = 2, size = 'md' }) {
  const shown = score ?? item.globalScore
  const s = SIZES[size] ?? SIZES.md
  const ringClass =
    rank === 1 ? 'ring-4 ring-brass-soft' : rank === 2 ? 'ring-4 ring-brass/75' : 'ring-4 ring-brass-deep/70'

  return (
    <Link
      to={`/items/${item.itemId}`}
      className="group flex animate-pop flex-col items-center gap-3"
      style={{ animationDelay: delay }}
    >
      <div className={`relative ${rank === 1 ? 'podium-flame' : ''}`}>
        {rank === 1 && (
          <span className={`absolute left-1/2 -translate-x-1/2 animate-flame-dance ${s.flame}`}>
            🔥
          </span>
        )}
        <img
          src={item.imageUrl}
          alt={item.name}
          className={`rounded-full object-cover transition duration-300 group-hover:scale-105 ${s.avatar} ${ringClass}`}
        />
      </div>
      <div className="text-center">
        <p className={`font-display font-bold text-cream transition group-hover:text-brass-soft ${s.name}`}>
          {item.name}
        </p>
        <span
          className={`mt-1 inline-block rounded-md bg-brass/10 px-2 py-0.5 font-bold tabular-nums text-brass-soft ${s.badge}`}
        >
          ★ {Number(shown).toFixed(digits)}
        </span>
      </div>
      <div
        className="stripe-neon flex w-full items-start justify-center rounded-t-xl bg-gradient-to-b from-brass-soft via-brass to-brass-deep pt-3"
        style={{ height }}
      >
        <span className={`font-display font-extrabold text-night ${s.rank}`}>#{rank}</span>
      </div>
    </Link>
  )
}
