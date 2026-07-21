import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import TierList from './pages/TierList'
import Polls from './pages/Polls'
import PollNew from './pages/PollNew'
import PollDetail from './pages/PollDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import DamgaTest from './pages/DamgaTest' // GEÇİCİ: Damga v1 buton testi, migrasyon bitince kaldırılacak

// Zemin rengi ve dokusu body üzerinde (index.css); main her rota
// değişiminde "rise" animasyonuyla girer — key bunun için.
function Shell() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Navbar />
      <main key={location.pathname} className="mx-auto w-full max-w-[1600px] flex-1 animate-rise px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/tiers" element={<TierList />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/polls/new" element={<PollNew />} />
          <Route path="/polls/:id" element={<PollDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/damga" element={<DamgaTest />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
