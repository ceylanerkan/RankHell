import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/client'
import Button from '../components/ui/button/Button'

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

  return (
    <form onSubmit={handleSubmit} className="card-glow mx-auto max-w-sm p-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-cream">Kayıt Ol</h1>

      <label className="mb-1 block text-sm font-semibold text-cream/90">Kullanıcı adı</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="3-50 karakter"
        className="input-dark mb-4"
      />

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

      {error && <p className="mb-4 text-sm text-cinder-soft">{error}</p>}

      <Button type="submit" variant="primary" fullWidth loading={submitting}>
        Kayıt Ol
      </Button>

      <p className="mt-4 text-center text-sm text-faded">
        Zaten hesabın var mı?{' '}
        <Button variant="link" as={Link} to="/login">
          Giriş yap
        </Button>
      </p>
    </form>
  )
}
