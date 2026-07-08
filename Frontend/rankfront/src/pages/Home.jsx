import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopItems } from '../api/client'
import ItemCard from '../components/ItemCard'
import { Loading, ErrorState, EmptyState } from '../components/States'

export default function Home() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTopItems(6).then(setItems).catch((e) => setError(e.message))
  }, [])

  return (
    <div>
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 p-8 ring-1 ring-red-500/20 sm:p-12">
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          Her şeyi <span className="text-red-500">sırala</span>, herkesle yarıştır.
        </h1>
        <p className="mt-3 max-w-xl text-slate-300">
          Filmden yemeğe her şeye puan ver, topluluğun sıralamasını gör, kendi anketini oluştur.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/items" className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500">
            Keşfetmeye Başla
          </Link>
          <Link to="/polls/new" className="rounded-lg border border-slate-600 px-4 py-2 font-semibold text-slate-200 transition hover:border-slate-400">
            Anket Oluştur
          </Link>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🏆 Liderlik Tablosu</h2>
        <Link to="/items" className="text-sm text-red-400 hover:underline">Tümünü gör →</Link>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : !items ? (
        <Loading label="Sıralama yükleniyor..." />
      ) : items.length === 0 ? (
        <EmptyState message="Henüz puanlanmış bir şey yok. İlk oyu sen ver!" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ItemCard key={item.itemId} item={item} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
