import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getItem, getMyRating, rateItem, getSession } from '../api/client'
import StarRating from '../components/StarRating'
import CategoryBadge from '../components/CategoryBadge'
import { Loading, ErrorState } from '../components/States'

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
          className="aspect-video w-full rounded-2xl object-cover ring-1 ring-stone-800"
        />
        {/* Görselin altındaki köz parıltısı */}
        <div aria-hidden="true" className="absolute -inset-2 -z-10 rounded-3xl bg-orange-600/10 blur-2xl" />
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5">
          {item.categories?.map((c) => (
            <CategoryBadge key={c.categoryId} name={c.name} />
          ))}
        </div>

        <h1 className="mt-3 font-display text-4xl font-extrabold text-white">{item.name}</h1>
        <p className="mt-3 text-stone-300">{item.description}</p>

        <div className="card-dark mt-6 flex items-center gap-4 p-4">
          <span className="font-display text-4xl font-extrabold tabular-nums text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.35)]">
            {Number(item.globalScore).toFixed(2)}
          </span>
          <div>
            <StarRating value={item.globalScore} size="text-xl" />
            <p className="text-sm text-stone-400">{item.totalVotes} oy</p>
          </div>
        </div>

        <div className="card-dark mt-4 p-4">
          <p className="mb-2 font-display font-bold text-white">
            {myRating ? `Senin puanın: ${myRating.score}` : 'Puanını ver'}
          </p>
          {session ? (
            <StarRating value={myRating?.score ?? 0} onRate={handleRate} size="text-3xl" />
          ) : (
            <p className="text-sm text-stone-400">
              Oy vermek için{' '}
              <a href="/login" className="font-semibold text-orange-400 hover:underline">
                giriş yap
              </a>
              .
            </p>
          )}
          {rateError && <p className="mt-2 text-sm text-red-400">{rateError}</p>}
        </div>
      </div>
    </div>
  )
}
