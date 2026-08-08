import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getItems, getCategories } from '../api/client'
import ItemCard from '../components/ItemCard'
import { Loading, ErrorState, EmptyState } from '../components/States'
import Button from '../components/ui/button/Button'
import Menu from '../components/ui/Menu'

export default function Items() {
  const [items, setItems] = useState(null)
  const [categories, setCategories] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [error, setError] = useState(null)

  // Seçili kategoriler URL'de virgülle ayrılır: ?category=1,3
  // Home'un kategori kutucukları tek id ile geliyor (?category=1); o da tek
  // elemanlı liste olarak okunur, eski linkler kırılmaz.
  const raw = searchParams.get('category')
  const selected = raw ? raw.split(',').filter(Boolean) : []

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  // Havuz bir kez çekilir, filtre istemcide uygulanır — çoklu seçim tek bir
  // categoryId parametresine sığmıyor. getItems'ın categoryId parametresi
  // duruyor; backend çoklu değeri desteklediğinde filtre oraya taşınabilir.
  useEffect(() => {
    getItems().then(setItems).catch((e) => setError(e.message))
  }, [])

  function writeSelected(next) {
    const params = new URLSearchParams(searchParams)
    if (next.length === 0) params.delete('category')
    else params.set('category', next.join(','))
    setSearchParams(params)
  }

  const toggle = (categoryId) => {
    const key = String(categoryId)
    writeSelected(selected.includes(key) ? selected.filter((v) => v !== key) : [...selected, key])
  }

  // Grup içi VEYA: seçili kategorilerden birine giren her öğe listede kalır.
  const visible = useMemo(
    () =>
      !items
        ? []
        : selected.length === 0
          ? items
          : items.filter((i) => i.categories?.some((c) => selected.includes(String(c.categoryId)))),
    // selected her render'da yeni dizi: kimlik yerine içeriği izlenir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, selected.join(',')],
  )

  return (
    <div>
      <h1 className="title-copper mb-4 font-display text-3xl font-extrabold text-cream">Keşfet</h1>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Menu label="Filtrele" title="Filtrele" count={selected.length}>
          {() => (
            <>
              <Menu.Group>
                <Menu.Title>Kategori</Menu.Title>
                {categories.map((c) => (
                  <Menu.Item
                    key={c.categoryId}
                    multi
                    selected={selected.includes(String(c.categoryId))}
                    onSelect={() => toggle(c.categoryId)}
                  >
                    {c.name}
                  </Menu.Item>
                ))}
              </Menu.Group>

              {selected.length > 0 && (
                <Menu.Foot>
                  <Button variant="link" onClick={() => writeSelected([])}>
                    Filtreleri temizle
                  </Button>
                </Menu.Foot>
              )}
            </>
          )}
        </Menu>

        {items && !error && (
          <span className="ml-auto text-sm font-medium tabular-nums text-faded">
            {visible.length} öğe
          </span>
        )}
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : !items ? (
        <Loading />
      ) : visible.length === 0 ? (
        <EmptyState message="Bu kategoride henüz item yok." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, i) => (
            <div key={item.itemId} className="animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
