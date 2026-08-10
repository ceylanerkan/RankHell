import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom'
import { ChromeContext } from './lib/chrome'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import Sector from './pages/Sector'
import Modes from './pages/Modes'
import TierList from './pages/TierList'
import RowPick from './pages/RowPick'
import RowPickGame from './pages/RowPickGame'
import Polls from './pages/Polls'
import PollNew from './pages/PollNew'
import PollDetail from './pages/PollDetail'
import PollPlay from './pages/PollPlay'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
// /dev/cards yalnızca geliştirmede: prod build'e girmez (tree-shake).
import DevCards from './pages/dev/Cards'

// Zemin rengi ve dokusu body üzerinde (index.css); main her rota
// değişiminde "rise" animasyonuyla girer — key bunun için.
function Shell() {
  const location = useLocation()
  const navigationType = useNavigationType()
  // Rota değişiminde sayfayı başa al: SPA geçişlerinde tarayıcı scroll
  // pozisyonunu koruduğu için (ör. footer'dan tıklayınca) yeni sayfa aksi
  // halde en altta açılıyordu. Geri/ileri (POP) hariç: orada kullanıcının
  // önceki scroll pozisyonu korunsun diye başa almıyoruz.
  useEffect(() => {
    if (navigationType === 'POP') return
    window.scrollTo(0, 0)
  }, [location.pathname, navigationType])

  // Oyun oynanırken navbar gizlenir: oyun ekranı kendi bandını tepeye koyar.
  // Değer yalnızca setter taşır (tüketici okumaz), bu yüzden kimliği sabit —
  // navHidden değişimi context tüketicilerini yeniden render etmez.
  const [navHidden, setNavHidden] = useState(false)
  const chrome = useMemo(() => ({ setNavHidden }), [])

  return (
    <ChromeContext.Provider value={chrome}>
    <div className="flex min-h-screen flex-col overflow-x-clip">
      {!navHidden && <Navbar />}
      <main key={location.pathname} className="mx-auto w-full max-w-[1600px] flex-1 animate-rise px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/sektor" element={<Sector />} />
          <Route path="/modlar" element={<Modes />} />
          <Route path="/modlar/tier-list" element={<TierList />} />
          <Route path="/modlar/sira-secimi" element={<RowPick />} />
          <Route path="/modlar/sira-secimi/:gameId" element={<RowPickGame />} />
          {/* Tier list modlar altına taşındı; eski link ve yer imleri kırılmasın. */}
          <Route path="/tiers" element={<Navigate to="/modlar/tier-list" replace />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/polls/new" element={<PollNew />} />
          <Route path="/polls/:id" element={<PollDetail />} />
          <Route path="/polls/:id/play" element={<PollPlay />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          {import.meta.env.DEV && <Route path="/dev/cards" element={<DevCards />} />}
        </Routes>
      </main>
      <Footer />
    </div>
    </ChromeContext.Provider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
