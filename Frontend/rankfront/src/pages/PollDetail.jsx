import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPoll } from '../api/client'
import PollHeader from '../components/poll/PollHeader'
import PollComments from '../components/poll/PollComments'
import PollWinners from '../components/poll/PollWinners'
import { Loading, ErrorState } from '../components/States'

// Anket künyesi. Seçenekler bilerek gösterilmez: onlar oyunun kendisi, bu
// sayfa karşılama ekranı. Oynama akışı (/polls/:id/play) ayrı bir iş.
export default function PollDetail() {
  const { id } = useParams()
  const [poll, setPoll] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPoll(id).then(setPoll).catch((e) => setError(e.message))
  }, [id])

  if (error) return <ErrorState message={error} />
  if (!poll) return <Loading label="Anket yükleniyor..." />

  return (
    <div>
      <PollHeader poll={poll} />

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
        <PollComments comments={poll.comments} className="lg:col-span-2" />
        <PollWinners />
      </div>
    </div>
  )
}
