import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItems, getCategories, createPoll, getSession } from '../api/client'
import { Loading, ErrorState, EmptyState } from '../components/States'
import Button from '../components/ui/button/Button'
import Card from '../components/ui/Card'
import Menu from '../components/ui/Menu'

export default function PollNew() {
  const navigate = useNavigate()
  const [items, setItems] = useState(null)
  const [categories, setCategories] = useState([])
  // Keşfet'teki filtre URL'de yaşar (link paylaşılabilir olsun diye); burası
  // bir form, yarım kalmış seçim linklenmez — filtre yerel state'te kalır.
  const [selectedCats, setSelectedCats] = useState([])
  const [title, setTitle] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const session = getSession()

  useEffect(() => {
    getItems().then(setItems).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  function toggle(itemId) {
    setSelectedIds((ids) =>
      ids.includes(itemId) ? ids.filter((i) => i !== itemId) : [...ids, itemId]
    )
  }

  function toggleCat(categoryId) {
    const key = String(categoryId)
    setSelectedCats((cats) =>
      cats.includes(key) ? cats.filter((v) => v !== key) : [...cats, key]
    )
  }

  // Keşfet ile aynı kural — grup içi VEYA: seçili kategorilerden birine giren
  // her öğe listede kalır. Filtre yalnızca görünürlüğü etkiler; filtrelenen
  // öğe daha önce işaretlendiyse seçimde kalmaya devam eder.
  const visible = useMemo(
    () =>
      !items
        ? []
        : selectedCats.length === 0
          ? items
          : items.filter((i) => i.categories?.some((c) => selectedCats.includes(String(c.categoryId)))),
    [items, selectedCats],
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    // Backend kuralı: başlık 3-255 karakter
    if (title.trim().length < 3) return setError('Başlık en az 3 karakter olmalı')
    if (selectedIds.length < 2) return setError('En az 2 seçenek eklemelisin')

    setSubmitting(true)
    try {
      const poll = await createPoll({ title: title.trim(), itemIds: selectedIds })
      navigate(`/polls/${poll.pollId}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (!session) {
    return <ErrorState message="Anket oluşturmak için önce giriş yapmalısın." />
  }
  if (!items) return <Loading />

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <h1 className="title-copper mb-6 font-display text-3xl font-extrabold text-cream">Yeni Anket</h1>

      <label className="mb-1 block text-sm font-semibold text-cream/90">Anket başlığı</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={255}
        placeholder="Örn: Gelmiş geçmiş en iyi oyun hangisi?"
        className="input-dark"
      />

      <p className="mb-2 mt-6 text-sm font-semibold text-cream/90">
        Seçenekler{' '}
        <span className={selectedIds.length > 0 ? 'text-ember-soft' : ''}>
          ({selectedIds.length} seçildi)
        </span>
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Menu label="Filtrele" title="Filtrele" count={selectedCats.length}>
          {() => (
            <>
              <Menu.Group>
                <Menu.Title>Kategori</Menu.Title>
                {categories.map((c) => (
                  <Menu.Item
                    key={c.categoryId}
                    multi
                    selected={selectedCats.includes(String(c.categoryId))}
                    onSelect={() => toggleCat(c.categoryId)}
                  >
                    {c.name}
                  </Menu.Item>
                ))}
              </Menu.Group>

              {selectedCats.length > 0 && (
                <Menu.Foot>
                  <Button variant="link" onClick={() => setSelectedCats([])}>
                    Filtreleri temizle
                  </Button>
                </Menu.Foot>
              )}
            </>
          )}
        </Menu>

        <span className="ml-auto text-sm font-medium tabular-nums text-faded">
          {visible.length} öğe
        </span>
      </div>

      {visible.length === 0 ? (
        <EmptyState message="Bu kategoride henüz item yok." />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {visible.map((item) => {
            const active = selectedIds.includes(item.itemId)
            return (
              <Card
                key={item.itemId}
                surface="raised"
                behavior="selectable"
                selected={active}
                onClick={() => toggle(item.itemId)}
                padding="compact"
                className="flex items-center gap-3"
              >
                <img src={item.imageUrl} alt="" className="h-10 w-14 rounded object-cover" />
                <span className="flex-1 text-sm text-cream">{item.name}</span>
                <span className="rh-card-pick" aria-hidden="true" />
              </Card>
            )
          })}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-cinder-soft">{error}</p>}

      <Button type="submit" variant="primary" fullWidth loading={submitting} className="mt-6">
        Anketi Oluştur
      </Button>
    </form>
  )
}
