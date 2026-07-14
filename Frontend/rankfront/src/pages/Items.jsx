import { useEffect, useState } from 'react'
import { getItems, getCategories } from '../api/client'
import ItemCard from '../components/ItemCard'
import { Loading, ErrorState, EmptyState } from '../components/States'

export default function Items() {
  const [items, setItems] = useState(null)
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setItems(null)
    getItems(selected).then(setItems).catch((e) => setError(e.message))
  }, [selected])

  const filterClass = (active) =>
    `rounded-full px-4 py-1.5 text-sm font-bold transition duration-200 ${
      active
        ? 'bg-ember text-night shadow-[0_3px_0_var(--color-ember-deep)]'
        : 'bg-coal text-faded ring-1 ring-line hover:-translate-y-0.5 hover:text-cream hover:ring-ember/40'
    }`

  return (
    <div>
      <h1 className="title-ember mb-4 font-display text-3xl font-extrabold text-cream">Keşfet</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <button className={filterClass(selected === null)} onClick={() => setSelected(null)}>
          Tümü
        </button>
        {categories.map((c) => (
          <button
            key={c.categoryId}
            className={filterClass(selected === c.categoryId)}
            onClick={() => setSelected(c.categoryId)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : !items ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState message="Bu kategoride henüz item yok." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.itemId} className="animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
