import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/client'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Geçerli bir e-posta gir')
    if (password.length < 8) return setError('Şifre en az 8 karakter olmalı')

    setSubmitting(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-glow mx-auto max-w-sm p-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-cream">Giriş Yap</h1>

      <label className="mb-1 block text-sm font-semibold text-cream/90">E-posta</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ornek@mail.com"
        className="input-dark mb-4"
      />

      <label className="mb-1 block text-sm font-semibold text-cream/90">Şifre</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="En az 8 karakter"
        className="input-dark mb-4"
      />

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-fire w-full py-2.5">
        {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>

      <p className="mt-4 text-center text-sm text-faded">
        Hesabın yok mu?{' '}
        <Link to="/register" className="font-semibold text-zap hover:underline">
          Kayıt ol
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-faded/60">
        Deneme hesabı: arda@rankhell.dev / herhangi 8+ karakter
      </p>
    </form>
  )
}
