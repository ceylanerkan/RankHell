import { Play, Layers, MessageSquare, CalendarDays } from 'lucide-react'
import StarRating from '../StarRating'

// Anket künyesinin sayı satırı. Salt okunur: StarRating'e onRate geçilmez,
// böylece yıldızlar mevcut bileşenin pasif (cursor-default) haline düşer.
// Puan 5'lik skalada — items ile aynı dil, ikinci bir skala üretilmez.

function Stat({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-4 w-4 text-ash" aria-hidden="true" />
      {children}
    </span>
  )
}

export default function PollStats({ poll }) {
  const {
    globalScore = 0,
    totalRatings = 0,
    playCount = 0,
    pollItems = [],
    comments = [],
    createdAt,
  } = poll

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-faded">
      <span className="inline-flex items-center gap-2">
        <StarRating value={globalScore} size="text-base" />
        <span className="font-bold tabular-nums text-brass-soft">
          {Number(globalScore).toFixed(2)}
        </span>
        <span className="tabular-nums">· {totalRatings} oy</span>
      </span>

      <Stat icon={Play}>
        <span className="tabular-nums">{playCount.toLocaleString('tr-TR')} oynanma</span>
      </Stat>

      <Stat icon={Layers}>
        <span className="tabular-nums">{pollItems.length} seçenek</span>
      </Stat>

      <Stat icon={MessageSquare}>
        <span className="tabular-nums">{comments.length} yorum</span>
      </Stat>

      {createdAt && (
        <Stat icon={CalendarDays}>
          <span className="tabular-nums">
            {new Date(createdAt).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </Stat>
      )}
    </div>
  )
}
