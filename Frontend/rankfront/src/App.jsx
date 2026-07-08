import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import Polls from './pages/Polls'
import PollNew from './pages/PollNew'
import PollDetail from './pages/PollDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/polls/new" element={<PollNew />} />
            <Route path="/polls/:id" element={<PollDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
