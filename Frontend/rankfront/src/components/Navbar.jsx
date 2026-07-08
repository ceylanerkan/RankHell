import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../api/client'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-red-500/15 text-red-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`

export default function Navbar() {
  const navigate = useNavigate()
  const session = getSession()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-black tracking-tight text-white">
          Rank<span className="text-red-500">Hell</span>
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
                className="rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Giriş</NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
