import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../api/client'
import Flame from './Flame'

const linkClass = ({ isActive }) =>
  `relative px-3 py-2 font-display text-base font-semibold transition ${
    isActive
      ? 'text-amber-300 after:absolute after:inset-x-3 after:bottom-0 after:h-px after:rounded-full after:bg-gradient-to-r after:from-red-500 after:via-orange-400 after:to-amber-400 after:shadow-[0_0_8px_rgba(249,115,22,0.8)]'
      : 'text-stone-400 hover:text-stone-100'
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
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <Flame className="h-7 w-7 animate-flicker" />
          <span className="font-display text-2xl font-extrabold tracking-tight text-white">
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
                className="px-3 py-2 font-display text-base text-stone-400 transition hover:text-stone-100"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Giriş</NavLink>
              <Link to="/register" className="btn-fire px-4 py-2 font-display text-base">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
