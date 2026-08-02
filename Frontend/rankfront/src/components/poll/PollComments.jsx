import { MessageSquare } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/button/Button'

// Yorum paneli — bu adımda salt okunur: mevcut yorumlar listelenir, giriş
// alanı ve gönder butonu pasif. Panel içinde buton taşıdığı için kartın
// kendisi static kalır (kart sistemi kuralı: iç içe tıklanabilir öğe yok).

function CommentRow({ comment }) {
  const { user, body, score, createdAt } = comment
  return (
    <Card surface="raised" behavior="static" padding="compact">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-sm font-bold text-cream">@{user?.username ?? 'anonim'}</span>
        <span className="shrink-0 text-xs tabular-nums text-faded">
          {new Date(createdAt).toLocaleDateString('tr-TR')}
          {score != null && <span className="ml-2 text-brass-soft">★ {score}</span>}
        </span>
      </div>
      <p className="mt-2 text-sm text-cream/90">{body}</p>
    </Card>
  )
}

export default function PollComments({ comments = [], className = '' }) {
  return (
    <Card surface="neutral" behavior="static" className={className}>
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-cream">
        <MessageSquare className="h-5 w-5 text-ash" aria-hidden="true" />
        Yorumlar
        <span className="rounded-full bg-night px-2 py-0.5 text-xs font-bold tabular-nums text-faded">
          {comments.length}
        </span>
      </h2>

      <div className="mt-4 flex items-start gap-3">
        <textarea
          rows={2}
          disabled
          placeholder="Yorum yazmak yakında açılacak"
          className="input-dark resize-none disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Yorumunuzu girin"
        />
        <Button variant="secondary" disabled>
          Gönder
        </Button>
      </div>

      {comments.length > 0 && (
        <div className="mt-5 space-y-3">
          {comments.map((comment) => (
            <CommentRow key={comment.commentId} comment={comment} />
          ))}
        </div>
      )}
    </Card>
  )
}
