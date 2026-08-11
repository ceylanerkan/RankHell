import Card from '../ui/Card'
import CategoryBadge from '../CategoryBadge'
import PersonaPhoto from './PersonaPhoto'
import VoteBar from './VoteBar'
import { rankBadgeClass } from '../../lib/rank'
import { formatFollowers, genderLabel, roleLabel } from '../../lib/sector'

// Sektör ızgarasının kartı: bilet yüzeyi, üstte kare kapak, altta aksiyon barı.
//
// behavior="static" ZORUNLU: kart içinde buton var (oy barı), içinde buton
// taşıyan kart static kalır — iç içe tıklanabilir öğe üretilmez. Kartın
// gövdesinde başka tıklama hedefi yok; oy vermek dışında bir eylemi yok.
//
// Medya köşesi rounded (4px): kart 8px, iç katman = dış − 4. ItemCard burada
// rounded-xl kullanıyor, o sapma bilerek kopyalanmadı.
export default function PersonaCard({ persona, myVote, onVote, rank }) {
  return (
    <Card surface="ticket" behavior="static" className="flex h-full flex-col">
      <Card.Body className="flex h-full flex-col">
        <div className="relative">
          <PersonaPhoto persona={persona} />
          {rank != null && rank <= 3 && (
            <span
              className={`absolute left-2 top-2 inline-flex items-center rounded px-2 py-0.5 font-display text-sm font-extrabold ${rankBadgeClass(rank)}`}
            >
              #{rank}
            </span>
          )}
        </div>

        <h3 className="mt-3 font-display text-lg font-extrabold leading-snug text-cream">
          {persona.displayName}
        </h3>
        <p className="text-sm font-medium text-faded">@{persona.handle}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <CategoryBadge name={roleLabel(persona.role)} tone="night" />
          <CategoryBadge name={genderLabel(persona.gender)} tone="night" />
          <span className="text-xs font-bold tabular-nums text-faded/80">
            {formatFollowers(persona.followers)} takipçi
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm font-medium text-faded">{persona.bio}</p>
      </Card.Body>

      <Card.Perf />

      <Card.Stub className="items-center">
        <VoteBar persona={persona} myVote={myVote} onVote={onVote} />
      </Card.Stub>
    </Card>
  )
}
