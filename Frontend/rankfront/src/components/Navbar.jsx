import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../api/client'
import Flame from './Flame'

// Orta menü: sade büyük harf sekmeler; aktif sayfanın altında Ember çizgisi.
const itemClass = ({ isActive }) =>
  `relative font-sans text-lg font-medium uppercase tracking-[0.12em] transition duration-200 ${
    isActive ? 'text-cream' : 'text-faded hover:text-cream'
  }`

const navItems = [
  { to: '/', end: true, label: 'ANA SAYFA' },
  { to: '/items', label: 'KEŞFET' },
  { to: '/tiers', label: 'TIER LIST' },
  { to: '/polls', label: 'ANKETLER' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const session = getSession()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar sticky top-0 border-b border-line/60 backdrop-blur-md">
      {/* Arka plan: çapraz uyarı deseni (hazard stripes) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, #0a0908 0px, #0a0908 24px, #18110E 24px, #18110E 52px)',
        }}
      />
      {/* Üst kenarda ince bakır detay çizgisi */}
      <div
        aria-hidden
        className="relative h-px bg-gradient-to-r from-transparent via-copper/45 to-transparent"
      />
      <nav className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-20">
          <Link to="/" className="group flex items-center gap-2">
            <Flame className="h-10 w-10 animate-flicker" />
            <span className="font-display text-3xl font-extrabold tracking-tight text-cream">
              Rank<span className="text-fire">Hell</span>
            </span>
          </Link>

          <div className="flex items-center gap-10">
          {navItems.map(({ to, end, label }) => (
            <NavLink key={to} to={to} end={end} className={itemClass}>
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-ember" />
                  )}
                </>
              )}
            </NavLink>
          ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Arama çubuğu: şimdilik sadece görsel, işlevsiz */}
          <div className="hidden w-56 items-center gap-2.5 rounded-full bg-night/70 px-4 py-2.5 ring-1 ring-line/50 transition duration-200 focus-within:ring-ember/60 md:flex">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0 text-faded"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Ara..."
              aria-label="Ara"
              className="w-full min-w-0 bg-transparent font-display text-base text-cream placeholder:text-faded focus:outline-none"
            />
          </div>
          {session ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 ring-1 transition duration-200 ${
                    isActive
                      ? 'bg-coal ring-ember/60'
                      : 'ring-line/60 hover:bg-coal hover:ring-copper/50'
                  }`
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-copper-soft font-display text-base font-extrabold text-night-deep">
                  {session.username.charAt(0).toUpperCase()}
                </span>
                <span className="hidden font-display text-base font-semibold text-cream sm:inline">
                  {session.username}
                </span>
              </NavLink>
              <button
                onClick={handleLogout}
                aria-label="Çıkış yap"
                title="Çıkış yap"
                className="flex h-12 w-12 items-center justify-center rounded-full text-faded ring-1 ring-line/60 transition duration-200 hover:bg-danger/15 hover:text-danger hover:ring-danger/60"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost px-4 py-1.5 font-display text-sm">Giriş</NavLink>
              <Link to="/register" className="btn-fire px-4 py-1.5 text-sm">Kayıt Ol</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
