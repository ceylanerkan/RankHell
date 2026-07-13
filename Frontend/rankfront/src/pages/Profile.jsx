import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyRatings, getMyPolls, getSession } from '../api/client'
import StarRating from '../components/StarRating'
import { Loading, ErrorState, EmptyState } from '../components/States'

export default function Profile() {
  const session = getSession()
  const [ratings, setRatings] = useState(null)
  const [polls, setPolls] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) return
    getMyRatings().then(setRatings).catch((e) => setError(e.message))
    getMyPolls().then(setPolls).catch((e) => setError(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!session) return <ErrorState message="Profilini görmek için giriş yapmalısın." />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 font-display text-2xl font-extrabold text-white shadow-lg shadow-orange-950/50">
          {session.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">@{session.username}</h1>
          <p className="text-sm text-stone-400">{session.email} · {session.role}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="title-ember mb-3 font-display text-lg font-extrabold text-white">Verdiğim Oylar</h2>
          {!ratings ? (
            <Loading />
          ) : ratings.length === 0 ? (
            <EmptyState message="Henüz hiç oy vermedin." />
          ) : (
            <div className="space-y-2">
              {ratings.map((r) => (
                <Link
                  key={r.ratingId}
                  to={`/items/${r.itemId}`}
                  className="card-dark flex items-center justify-between rounded-md p-3 transition duration-200 hover:translate-x-1 hover:border-orange-500/50"
                >
                  <span className="text-stone-200">{r.item?.name}</span>
                  <StarRating value={r.score} size="text-base" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="title-ember mb-3 font-display text-lg font-extrabold text-white">Anketlerim</h2>
          {!polls ? (
            <Loading />
          ) : polls.length === 0 ? (
            <EmptyState message="Henüz anket oluşturmadın." />
          ) : (
            <div className="space-y-2">
              {polls.map((p) => (
                <Link
                  key={p.pollId}
                  to={`/polls/${p.pollId}`}
                  className="card-dark block rounded-md p-3 transition duration-200 hover:translate-x-1 hover:border-orange-500/50"
                >
                  <span className="text-stone-200">{p.title}</span>
                  <p className="text-xs text-stone-500">
                    {new Date(p.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
