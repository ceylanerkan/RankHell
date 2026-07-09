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
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-stone-900 via-stone-950 to-red-950/60 p-8 sm:p-12">
        {/* Dekor katmanı: köz parıltıları, hayalet #1 ve süzülen madalyalar */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-600/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />
          <span className="absolute -bottom-10 -right-4 font-display text-[11rem] font-extrabold leading-none text-white/[0.045] sm:text-[15rem]">
            #1
          </span>
          <span className="absolute right-16 top-10 hidden animate-float text-5xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] md:block">
            🥇
          </span>
          <span className="absolute right-44 top-28 hidden animate-float-slow text-4xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] md:block">
            🥈
          </span>
          <span className="absolute right-14 top-48 hidden animate-float text-3xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] [animation-delay:1.4s] md:block">
            🥉
          </span>
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            Topluluk Sıralama Arenası
          </span>

          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Her şeyi <span className="text-fire">sırala</span>,
            <br className="hidden sm:block" /> herkesle yarıştır.
          </h1>
          <p className="mt-3 max-w-xl text-lg text-stone-300">
            Filmden yemeğe her şeye puan ver, topluluğun sıralamasını gör, kendi anketini oluştur.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/items" className="btn-fire group">
              Keşfetmeye Başla
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <Link to="/polls/new" className="btn-ghost">
              Anket Oluştur
            </Link>
          </div>
        </div>
      </section>

      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-white">🏆 Liderlik Tablosu</h2>
        <Link to="/items" className="text-sm font-semibold text-orange-400 transition hover:text-orange-300 hover:underline">
          Tümünü gör →
        </Link>
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
            <div key={item.itemId} className="animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
              <ItemCard item={item} rank={i + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
