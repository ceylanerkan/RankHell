// Veri çeken her sayfanın üç durumu: yükleniyor / hata / boş
import Flame from './Flame'
import Card from './ui/Card'

export function Loading({ label = 'Yükleniyor...' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-faded">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-coal-light border-t-copper" />
        <Flame className="h-5 w-5 animate-flicker" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({ message = 'Bir şeyler ters gitti.' }) {
  return (
    <Card surface="neutral" behavior="static" padding="spacious">
      <div className="text-center">
        <p className="font-display text-lg font-bold text-cinder-soft">💀 Hata</p>
        <p className="mt-1 text-sm text-cream">{message}</p>
      </div>
    </Card>
  )
}

export function EmptyState({ message = 'Henüz burada bir şey yok.' }) {
  return (
    <div className="rounded-xl border border-dashed border-ash/30 bg-ash/[0.05] px-4 py-12 text-center text-faded">
      <span className="mb-2 block text-3xl">👻</span>
      {message}
    </div>
  )
}
