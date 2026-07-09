import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPoll } from '../api/client'
import ItemCard from '../components/ItemCard'
import { Loading, ErrorState, EmptyState } from '../components/States'

export default function PollDetail() {
  const { id } = useParams()
  const [poll, setPoll] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPoll(id).then(setPoll).catch((e) => setError(e.message))
  }, [id])

  if (error) return <ErrorState message={error} />
  if (!poll) return <Loading label="Anket yükleniyor..." />

  const ranked = [...poll.items].sort((a, b) => b.globalScore - a.globalScore)

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-white">{poll.title}</h1>
      <p className="mt-1 mb-6 text-sm text-stone-400">
        @{poll.creator.username} · {new Date(poll.createdAt).toLocaleDateString('tr-TR')}
      </p>

      {ranked.length === 0 ? (
        <EmptyState message="Bu ankete henüz seçenek eklenmemiş." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {ranked.map((item, i) => (
            <div key={item.itemId} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <ItemCard item={item} rank={i + 1} />
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm text-stone-500">
        Sıralama, seçeneklerin genel puanına göredir. Oy vermek için bir seçeneğe tıkla.
      </p>
    </div>
  )
}
