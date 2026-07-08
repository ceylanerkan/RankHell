// Veri çeken her sayfanın üç durumu: yükleniyor / hata / boş

export function Loading({ label = 'Yükleniyor...' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-red-500" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({ message = 'Bir şeyler ters gitti.' }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-8 text-center">
      <p className="text-lg font-semibold text-red-400">Hata</p>
      <p className="mt-1 text-sm text-slate-300">{message}</p>
    </div>
  )
}

export function EmptyState({ message = 'Henüz burada bir şey yok.' }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 px-4 py-12 text-center text-slate-400">
      {message}
    </div>
  )
}
