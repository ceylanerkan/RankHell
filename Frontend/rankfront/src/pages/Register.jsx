import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/client'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    // Backend validasyon kurallarının aynısı (User entity)
    if (username.trim().length < 3 || username.trim().length > 50)
      return setError('Kullanıcı adı 3-50 karakter arası olmalı')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Geçerli bir e-posta gir')
    if (password.length < 8) return setError('Şifre en az 8 karakter olmalı')

    setSubmitting(true)
    try {
      await register({ username: username.trim(), email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const inputClass =
    'mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-red-500'

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Kayıt Ol</h1>

      <label className="mb-1 block text-sm font-medium text-slate-300">Kullanıcı adı</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="3-50 karakter"
        className={inputClass}
      />

      <label className="mb-1 block text-sm font-medium text-slate-300">E-posta</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ornek@mail.com"
        className={inputClass}
      />

      <label className="mb-1 block text-sm font-medium text-slate-300">Şifre</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="En az 8 karakter"
        className={inputClass}
      />

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
      >
        {submitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
      </button>

      <p className="mt-4 text-center text-sm text-slate-400">
        Zaten hesabın var mı?{' '}
        <Link to="/login" className="text-red-400 hover:underline">Giriş yap</Link>
      </p>
    </form>
  )
}
