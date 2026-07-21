import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItems, createPoll, getSession } from '../api/client'
import { Loading, ErrorState } from '../components/States'

export default function PollNew() {
  const navigate = useNavigate()
  const [items, setItems] = useState(null)
  const [title, setTitle] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const session = getSession()

  useEffect(() => {
    getItems().then(setItems).catch((e) => setError(e.message))
  }, [])

  function toggle(itemId) {
    setSelectedIds((ids) =>
      ids.includes(itemId) ? ids.filter((i) => i !== itemId) : [...ids, itemId]
    )
  }

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
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const active = selectedIds.includes(item.itemId)
          return (
            <button
              type="button"
              key={item.itemId}
              onClick={() => toggle(item.itemId)}
              className={`flex items-center gap-3 rounded-md border p-2 text-left transition duration-200 ${
                active
                  ? 'border-ember/70 bg-ember/10'
                  : 'border-line/60 bg-coal/70 hover:-translate-y-0.5 hover:border-line'
              }`}
            >
              <img
                src={item.imageUrl}
                alt=""
                className={`h-10 w-14 rounded object-cover transition ${active ? '' : 'saturate-[.8]'}`}
              />
              <span className="flex-1 text-sm text-cream">{item.name}</span>
              {active && <span className="pr-1 text-moss-soft">✓</span>}
            </button>
          )
        })}
      </div>

      {error && <p className="mt-4 text-sm text-cinder-soft">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-fire mt-6 w-full py-2.5">
        {submitting ? 'Oluşturuluyor...' : 'Anketi Oluştur'}
      </button>
    </form>
  )
}
