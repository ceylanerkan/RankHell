import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPolls } from '../api/client'
import { Loading, ErrorState, EmptyState } from '../components/States'

export default function Polls() {
  const [polls, setPolls] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPolls().then(setPolls).catch((e) => setError(e.message))
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="title-ember font-display text-3xl font-extrabold text-white">Anketler</h1>
        <Link to="/polls/new" className="btn-fire px-4 py-2 text-sm">
          + Yeni Anket
        </Link>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : !polls ? (
        <Loading label="Anketler yükleniyor..." />
      ) : polls.length === 0 ? (
        <EmptyState message="Henüz hiç anket yok. İlkini sen oluştur!" />
      ) : (
        <div className="space-y-3">
          {polls.map((poll, i) => (
            <Link
              key={poll.pollId}
              to={`/polls/${poll.pollId}`}
              className="group card-dark flex animate-rise items-center justify-between gap-4 p-4 transition duration-200 hover:translate-x-1 hover:border-orange-500/50"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div>
                <h2 className="font-display font-bold text-stone-100 transition group-hover:text-orange-300">
                  {poll.title}
                </h2>
                <p className="mt-1 text-sm text-stone-400">
                  @{poll.creator.username} · {poll.itemCount} seçenek ·{' '}
                  {new Date(poll.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <span className="text-lg text-stone-600 transition duration-200 group-hover:translate-x-1 group-hover:text-orange-400">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
