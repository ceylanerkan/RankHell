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
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl font-black text-white">
          {session.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">@{session.username}</h1>
          <p className="text-sm text-slate-400">{session.email} · {session.role}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Verdiğim Oylar</h2>
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
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-3 transition hover:border-red-500/50"
                >
                  <span className="text-slate-200">{r.item?.name}</span>
                  <StarRating value={r.score} size="text-base" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Anketlerim</h2>
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
                  className="block rounded-lg border border-slate-800 bg-slate-900 p-3 transition hover:border-red-500/50"
                >
                  <span className="text-slate-200">{p.title}</span>
                  <p className="text-xs text-slate-500">
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
