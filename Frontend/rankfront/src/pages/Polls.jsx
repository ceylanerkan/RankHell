import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPolls } from '../api/client'
import { Loading, ErrorState, EmptyState } from '../components/States'
import Button from '../components/ui/button/Button'
import Card from '../components/ui/Card'

export default function Polls() {
  const [polls, setPolls] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPolls().then(setPolls).catch((e) => setError(e.message))
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="title-copper font-display text-3xl font-extrabold text-cream">Anketler</h1>
        <Button variant="primary" size="sm" as={Link} to="/polls/new">
          + Yeni Anket
        </Button>
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
            <Card
              key={poll.pollId}
              surface="neutral"
              behavior="navigation"
              to={`/polls/${poll.pollId}`}
              padding="compact"
              className="flex animate-rise items-center justify-between gap-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div>
                <h2 className="font-display font-bold text-cream">
                  {poll.title}
                </h2>
                <p className="mt-1 text-sm text-faded">
                  @{poll.creator.username} · {poll.itemCount} seçenek ·{' '}
                  {new Date(poll.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <span className="rh-card-go text-lg" aria-hidden="true">
                →
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
