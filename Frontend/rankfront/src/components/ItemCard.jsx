import CategoryBadge from './CategoryBadge'
import Card from './ui/Card'

// İlk üç sıra pirinç ailesinin açık / ana / koyu derecelerini alır.
function rankBadgeClass(rank) {
  if (rank === 1)
    return 'bg-brass-soft text-night shadow-[0_0_12px_rgba(185,145,63,0.25)]'
  if (rank === 2)
    return 'bg-brass text-night'
  if (rank === 3)
    return 'bg-brass-deep text-cream'
  return 'bg-night-deep text-ash'
}

// Arcade bileti: koyu metal yüzey; sıralama vurgusu yalnızca rozetlerde yaşar.
export default function ItemCard({ item, rank }) {
  return (
    <Card
      surface="ticket"
      behavior="navigation"
      to={`/items/${item.itemId}`}
      ticketNavWhitelisted
      className="group flex h-full flex-col"
    >
      <Card.Body className="flex h-full flex-col">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:saturate-110"
          />
        </div>

        <div className="flex flex-1 flex-col pt-3">
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
      </Card.Body>

      <Card.Perf />

      <Card.Stub>
        {rank != null && (
          <span
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 font-display text-sm font-extrabold ${rankBadgeClass(rank)}`}
          >
            #{rank}
            {rank === 1 && <span className="animate-flicker text-xs">🔥</span>}
          </span>
        )}
        <span className="ml-auto rounded-full bg-night px-2.5 py-1 text-sm font-bold tabular-nums text-brass-soft">
          ★ {Number(item.globalScore).toFixed(2)}
        </span>
      </Card.Stub>
    </Card>
  )
}
