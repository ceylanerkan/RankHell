import { ArrowBigDown, ArrowBigUp, MessageCircle, Repeat2, Share2 } from 'lucide-react'
import Button from '../ui/button/Button'
import { netScore } from '../../lib/sector'

// Fenomen kartının aksiyon barı. Dört öğeden yalnızca ilki çalışır:
// yorum, repost ve paylaş backend'i olmadığı için görünür ama pasif.
// Pasif hapların title'ı sarmalayıcı span'de: disabled <button> çoğu
// tarayıcıda fare olayı üretmez, tooltip butonun üstünde görünmezdi.
//
// Renk: aktif oy yönü ember (birincil aksiyon / aktif durum), gerisi faded.
// Downvote cinder'a boyanmaz — cinder yalnız hata ve yıkıcı aksiyon içindir,
// buradaki olumsuz oy normal bir seçim.

export default function VoteBar({ persona, myVote = 0, onVote }) {
  const score = netScore(persona)

  return (
    <div className="sector-actions">
      <div className="sector-actions__group">
        <Button
          variant="icon"
          size="sm"
          aria-label={`${persona.displayName} için olumlu oy`}
          aria-pressed={myVote === 1}
          onClick={() => onVote(1)}
        >
          <ArrowBigUp size={18} />
        </Button>
        <span className="sector-actions__count" aria-live="polite">
          {score}
        </span>
        <Button
          variant="icon"
          size="sm"
          aria-label={`${persona.displayName} için olumsuz oy`}
          aria-pressed={myVote === -1}
          onClick={() => onVote(-1)}
        >
          <ArrowBigDown size={18} />
        </Button>
      </div>

      {/* Pasif üçlü tek hapta: üçü de aynı sebeple kapalı, ayrı ayrı hap
          olmaları hem gereksiz bölünme hem de dört sütunlu ızgarada bara
          365px genişlik dayatıyordu — kartın taşıyabileceği en fazla
          genişlik 339px olduğu için bar sarıyor, kart uzuyordu. */}
      <span className="sector-actions__group" title="Yakında">
        <Button variant="icon" size="sm" disabled aria-label="Yorumlar — yakında">
          <MessageCircle size={17} />
        </Button>
        <span className="sector-actions__count">{persona.commentCount}</span>
        <Button variant="icon" size="sm" disabled aria-label="Yeniden paylaş — yakında">
          <Repeat2 size={17} />
        </Button>
        <Button variant="icon" size="sm" disabled aria-label="Paylaş — yakında">
          <Share2 size={16} />
        </Button>
      </span>
    </div>
  )
}
