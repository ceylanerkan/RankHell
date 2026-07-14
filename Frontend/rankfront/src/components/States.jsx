// Veri çeken her sayfanın üç durumu: yükleniyor / hata / boş
import Flame from './Flame'

export function Loading({ label = 'Yükleniyor...' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-faded">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-coal-light border-t-ember" />
        <Flame className="h-5 w-5 animate-flicker" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({ message = 'Bir şeyler ters gitti.' }) {
  return (
    <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-10 text-center">
      <p className="font-display text-lg font-bold text-danger">💀 Hata</p>
      <p className="mt-1 text-sm text-cream">{message}</p>
    </div>
  )
}

export function EmptyState({ message = 'Henüz burada bir şey yok.' }) {
  return (
    <div className="rounded-xl border border-dashed border-plasma/30 bg-plasma/[0.05] px-4 py-12 text-center text-faded">
      <span className="mb-2 block text-3xl">👻</span>
      {message}
    </div>
  )
}
