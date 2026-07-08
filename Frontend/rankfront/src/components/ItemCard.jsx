import { Link } from 'react-router-dom'
import CategoryBadge from './CategoryBadge'

export default function ItemCard({ item, rank }) {
  return (
    <Link
      to={`/items/${item.itemId}`}
      className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {rank != null && (
          <span className="absolute left-2 top-2 rounded-lg bg-black/70 px-2.5 py-1 text-sm font-bold text-amber-400">
            #{rank}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-100 group-hover:text-red-400">{item.name}</h3>
          <span className="shrink-0 rounded-md bg-amber-400/10 px-2 py-0.5 text-sm font-bold text-amber-400">
            ★ {Number(item.globalScore).toFixed(2)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {item.categories?.map((c) => (
              <CategoryBadge key={c.categoryId} name={c.name} />
            ))}
          </div>
          <span className="text-xs text-slate-500">{item.totalVotes} oy</span>
        </div>
      </div>
    </Link>
  )
}
