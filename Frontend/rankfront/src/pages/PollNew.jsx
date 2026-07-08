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
      <h1 className="mb-6 text-2xl font-bold text-white">Yeni Anket</h1>

      <label className="mb-1 block text-sm font-medium text-slate-300">Anket başlığı</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={255}
        placeholder="Örn: Gelmiş geçmiş en iyi oyun hangisi?"
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-red-500"
      />

      <p className="mb-2 mt-6 text-sm font-medium text-slate-300">
        Seçenekler ({selectedIds.length} seçildi)
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const active = selectedIds.includes(item.itemId)
          return (
            <button
              type="button"
              key={item.itemId}
              onClick={() => toggle(item.itemId)}
              className={`flex items-center gap-3 rounded-lg border p-2 text-left transition ${
                active
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-600'
              }`}
            >
              <img src={item.imageUrl} alt="" className="h-10 w-14 rounded object-cover" />
              <span className="text-sm text-slate-200">{item.name}</span>
            </button>
          )
        })}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-lg bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
      >
        {submitting ? 'Oluşturuluyor...' : 'Anketi Oluştur'}
      </button>
    </form>
  )
}
