import { Link } from 'react-router-dom'
import CategoryBadge from './CategoryBadge'

// İlk üç sıra pirinç ailesinin açık / ana / koyu derecelerini alır.
function rankBadgeClass(rank) {
  if (rank === 1)
    return 'bg-brass-soft text-night shadow-[0_0_12px_rgba(185,145,63,0.25)]'
  if (rank === 2)
    return 'bg-brass text-night'
  if (rank === 3)
    return 'bg-brass-deep text-cream'
  return 'bg-night-deep/80 text-ash backdrop-blur'
}

// Arcade bileti: koyu metal yüzey; sıralama vurgusu yalnızca rozetlerde yaşar.
export default function ItemCard({ item, rank }) {
  return (
    <Link to={`/items/${item.itemId}`} className="card-ticket group flex h-full flex-col p-2.5">
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:saturate-110"
        />
        {/* Alt kenar: puan rozetinin okunması için hafif karartma */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-deep/70 to-transparent" />
        {rank != null && (
          <span
            className={`absolute left-2 top-2 inline-flex -rotate-6 items-center gap-1 rounded px-2.5 py-1 font-display text-sm font-extrabold transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110 ${rankBadgeClass(rank)}`}
          >
            #{rank}
            {rank === 1 && <span className="animate-flicker text-xs">🔥</span>}
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded-full bg-night-deep/75 px-2.5 py-1 text-sm font-bold tabular-nums text-brass-soft backdrop-blur">
          ★ {Number(item.globalScore).toFixed(2)}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        <h3 className="font-display text-lg font-extrabold leading-snug text-cream">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm font-medium text-faded">{item.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex flex-wrap gap-1.5">
            {item.categories?.map((c) => (
              <CategoryBadge key={c.categoryId} name={c.name} tone="night" />
            ))}
          </div>
          <span className="text-xs font-bold tabular-nums text-faded/80">{item.totalVotes} oy</span>
        </div>
      </div>
    </Link>
  )
}
