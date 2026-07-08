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
      <img
        src={item.imageUrl}
        alt={item.name}
        className="aspect-video w-full rounded-2xl object-cover ring-1 ring-slate-800"
      />

      <div>
        <div className="flex flex-wrap gap-1.5">
          {item.categories?.map((c) => (
            <CategoryBadge key={c.categoryId} name={c.name} />
          ))}
        </div>

        <h1 className="mt-3 text-3xl font-black text-white">{item.name}</h1>
        <p className="mt-3 text-slate-300">{item.description}</p>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <span className="text-4xl font-black text-amber-400">
            {Number(item.globalScore).toFixed(2)}
          </span>
          <div>
            <StarRating value={item.globalScore} size="text-xl" />
            <p className="text-sm text-slate-400">{item.totalVotes} oy</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="mb-2 font-semibold text-white">
            {myRating ? `Senin puanın: ${myRating.score}` : 'Puanını ver'}
          </p>
          {session ? (
            <StarRating value={myRating?.score ?? 0} onRate={handleRate} size="text-3xl" />
          ) : (
            <p className="text-sm text-slate-400">
              Oy vermek için <a href="/login" className="text-red-400 hover:underline">giriş yap</a>.
            </p>
          )}
          {rateError && <p className="mt-2 text-sm text-red-400">{rateError}</p>}
        </div>
      </div>
    </div>
  )
}
