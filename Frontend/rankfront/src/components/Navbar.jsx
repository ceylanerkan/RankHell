import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../api/client'
import Flame from './Flame'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-orange-500/10 text-orange-300 ring-1 ring-orange-500/30'
      : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
  }`

export default function Navbar() {
  const navigate = useNavigate()
  const session = getSession()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md">
      {/* Lav çizgisi: markanın ateş degradesi */}
      <div className="h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="group flex items-center gap-2">
          <Flame className="h-6 w-6 animate-flicker" />
          <span className="font-display text-xl font-extrabold tracking-tight text-white">
            Rank<span className="text-fire">Hell</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Ana Sayfa</NavLink>
          <NavLink to="/items" className={linkClass}>Keşfet</NavLink>
          <NavLink to="/polls" className={linkClass}>Anketler</NavLink>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <NavLink to="/profile" className={linkClass}>@{session.username}</NavLink>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-1.5 text-sm text-stone-400 transition hover:bg-stone-800/80 hover:text-white"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Giriş</NavLink>
              <Link to="/register" className="btn-fire px-3.5 py-1.5 text-sm">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
