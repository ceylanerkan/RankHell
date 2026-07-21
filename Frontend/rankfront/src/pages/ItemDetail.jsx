import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getItem, getMyRating, rateItem, getSession } from '../api/client'
import StarRating from '../components/StarRating'
import CategoryBadge from '../components/CategoryBadge'
import { Loading, ErrorState } from '../components/States'
import Button from '../components/ui/button/Button'

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [myRating, setMyRating] = useState(null)
  const [error, setError] = useState(null)
  const [rateError, setRateError] = useState(null)
  const session = getSession()

  useEffect(() => {
    getItem(id).then(setItem).catch((e) => setError(e.message))
    getMyRating(id).then(setMyRating).catch(() => {})
  }, [id])

  async function handleRate(score) {
    setRateError(null)
    try {
      const updated = await rateItem(id, score)
      setItem(updated)
      setMyRating({ score })
    } catch (e) {
      setRateError(e.message)
    }
  }

  if (error) return <ErrorState message={error} />
  if (!item) return <Loading label="Item yükleniyor..." />

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="aspect-video w-full rounded-2xl object-cover shadow-[0_20px_44px_-16px_rgba(0,0,0,0.9)]"
        />
        {/* Görselin altındaki nötr yüzey ayrımı */}
        <div aria-hidden="true" className="absolute -inset-2 -z-10 rounded-xl bg-ash/[0.05] blur-2xl" />
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5">
          {item.categories?.map((c) => (
            <CategoryBadge key={c.categoryId} name={c.name} />
          ))}
        </div>

        <h1 className="mt-3 font-display text-4xl font-extrabold text-cream">{item.name}</h1>
        <p className="mt-3 text-cream/90">{item.description}</p>

        <div className="card-dark mt-6 flex items-center gap-4 p-4">
          <span className="font-display text-4xl font-extrabold tabular-nums text-brass-soft drop-shadow-[0_0_10px_rgba(185,145,63,0.22)]">
            {Number(item.globalScore).toFixed(2)}
          </span>
          <div>
            <StarRating value={item.globalScore} size="text-xl" />
            <p className="text-sm text-faded">{item.totalVotes} oy</p>
          </div>
        </div>

        <div className="card-glow mt-4 p-4">
          <p className="mb-2 font-display font-bold text-cream">
            {myRating ? `Senin puanın: ${myRating.score}` : 'Puanını ver'}
          </p>
          {session ? (
            <StarRating value={myRating?.score ?? 0} onRate={handleRate} size="text-3xl" />
          ) : (
            <p className="text-sm text-faded">
              Oy vermek için{' '}
              <Button variant="link" as={Link} to="/login">
                giriş yap
              </Button>
              .
            </p>
          )}
          {rateError && <p className="mt-2 text-sm text-cinder-soft">{rateError}</p>}
        </div>
      </div>
    </div>
  )
}
