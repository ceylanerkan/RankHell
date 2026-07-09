import { Link } from 'react-router-dom'
import CategoryBadge from './CategoryBadge'

// İlk üç sıra podyum rengi alır: altın / gümüş / bronz
function rankBadgeClass(rank) {
  if (rank === 1)
    return 'bg-gradient-to-br from-amber-200 to-yellow-500 text-stone-950 shadow-[0_0_18px_rgba(251,191,36,0.45)]'
  if (rank === 2)
    return 'bg-gradient-to-br from-slate-100 to-slate-400 text-stone-900'
  if (rank === 3)
    return 'bg-gradient-to-br from-orange-300 to-amber-700 text-stone-950'
  return 'bg-black/70 text-amber-300 ring-1 ring-white/10'
}

export default function ItemCard({ item, rank }) {
  return (
    <Link
      to={`/items/${item.itemId}`}
      className="group card-dark relative block overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-950/50"
    >
      {/* Hover'da beliren ateş çizgisi */}
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover saturate-[.9] transition duration-300 group-hover:scale-105 group-hover:saturate-110"
        />
        {rank != null && (
          <span
            className={`absolute left-2 top-2 -rotate-6 rounded-lg px-2.5 py-1 font-display text-sm font-extrabold transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110 ${rankBadgeClass(rank)}`}
          >
            #{rank}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-stone-100 transition group-hover:text-orange-300">
            {item.name}
          </h3>
          <span className="shrink-0 rounded-md bg-amber-400/10 px-2 py-0.5 text-sm font-bold tabular-nums text-amber-400 ring-1 ring-amber-400/20">
            ★ {Number(item.globalScore).toFixed(2)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-stone-400">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {item.categories?.map((c) => (
              <CategoryBadge key={c.categoryId} name={c.name} />
            ))}
          </div>
          <span className="text-xs tabular-nums text-stone-500">{item.totalVotes} oy</span>
        </div>
      </div>
    </Link>
  )
}
