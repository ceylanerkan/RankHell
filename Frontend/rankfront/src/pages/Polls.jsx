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
        <h1 className="text-2xl font-bold text-white">Anketler</h1>
        <Link
          to="/polls/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
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
          {polls.map((poll) => (
            <Link
              key={poll.pollId}
              to={`/polls/${poll.pollId}`}
              className="block rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-red-500/50"
            >
              <h2 className="font-semibold text-slate-100">{poll.title}</h2>
              <p className="mt-1 text-sm text-slate-400">
                @{poll.creator.username} · {poll.itemCount} seçenek ·{' '}
                {new Date(poll.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
