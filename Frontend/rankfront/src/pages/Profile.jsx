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
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-copper-soft font-display text-2xl font-extrabold text-night-deep shadow-[0_4px_0_var(--color-copper-deep)]">
          {session.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-cream">@{session.username}</h1>
          <p className="text-sm text-faded">{session.email} · {session.role}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="title-copper mb-3 font-display text-lg font-extrabold text-cream">Verdiğim Oylar</h2>
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
                  className="card-dark flex items-center justify-between p-3 transition duration-200 hover:translate-x-1 hover:bg-coal-light/50"
                >
                  <span className="text-cream">{r.item?.name}</span>
                  <StarRating value={r.score} size="text-base" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="title-copper mb-3 font-display text-lg font-extrabold text-cream">Anketlerim</h2>
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
                  className="card-dark block p-3 transition duration-200 hover:translate-x-1 hover:bg-coal-light/50"
                >
                  <span className="text-cream">{p.title}</span>
                  <p className="text-xs text-faded/70">
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
