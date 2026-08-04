import { Trophy, EyeOff } from 'lucide-react'
import Card from '../ui/Card'

// Kazanan seçimler — anketi oynamadan sonucu görmemek için kapalı gelir.
// Bu adımda kapağı açan bir aksiyon yok: oyun akışı (/play) henüz kurulmadı.
// Kesikli kenar kullanılmaz — burası boş yuva değil, gizlenmiş içerik.
export default function PollWinners({ className = '' }) {
  return (
    <Card surface="neutral" behavior="static" className={className}>
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-cream">
        <Trophy className="h-5 w-5 text-brass" aria-hidden="true" />
        Kazanan Seçimler
      </h2>

      <div className="mt-4 flex flex-col items-center gap-3 rounded-md bg-night-deep/40 px-4 py-10 text-center">
        <EyeOff className="h-7 w-7 text-ash" aria-hidden="true" />
        <p className="font-display font-bold text-faded">Spoiler koruması</p>
        <p className="max-w-[28ch] text-sm text-faded/80">
          Sonuçlar anketi kendin oynadıktan sonra açılacak.
        </p>
      </div>
    </Card>
  )
}
