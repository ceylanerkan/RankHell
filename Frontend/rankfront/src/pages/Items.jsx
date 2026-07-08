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
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active
        ? 'bg-red-600 text-white'
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
    }`

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-white">Keşfet</h1>

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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
