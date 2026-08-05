import { Link } from 'react-router-dom'
import Button from '../../ui/button/Button'
import Card from '../../ui/Card'
import { EmptyState } from '../../States'
import Champion from './Champion'
import { groupLabel } from '../../../lib/bracket'

// Turnuva sonucu: üstte şampiyon, altında ne kadar ilerlediğine göre gruplanmış
// liste. PlayResult kullanılmaz — o ekranın omurgası puandır (podyum, yıldız,
// ortalama), turnuvada puan diye bir şey yok.
//
// SIRA NUMARASI YOK: aynı turda elenen dört seçenek arasında "3." ve "6." diye
// bir fark yoktur, ikisi de çeyrek finalde durdu. Sahte bir sıra uydurmak
// yerine grup başlığı gerçeği söyler.
//
// ŞAMPİYON SAHNESİ ortak: Champion.jsx'te yaşar, "O mu, Bu mu?" sonucuyla
// paylaşılır (docs/design/exceptions.md §7c).

// Elenenleri turlarına göre grupla. results ters kronolojik geldiği için aynı
// turda elenenler zaten yan yana: tek geçişte gruplanır, sıralama gerekmez.
function groupByRound(entries) {
  const groups = []
  for (const entry of entries) {
    const last = groups[groups.length - 1]
    if (last && last.size === entry.roundSize) last.items.push(entry.item)
    else groups.push({ size: entry.roundSize, items: [entry.item] })
  }
  return groups
}

export default function BracketResult({ poll, results, onReplay, onSetup }) {
  const champion = results[0]?.roundSize == null ? results[0].item : null
  const groups = groupByRound(champion ? results.slice(1) : results)

  return (
    // Sonuç ekranı kurulum/oyun ekranlarından bir kademe geniş: PlayResult ile
    // aynı kutu, iki sonuç ekranı aynı genişlikte açılsın.
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-faded">Sonuç</p>
        <h1 className="title-copper mt-1 font-display text-3xl font-extrabold leading-tight text-cream">
          {poll.title}
        </h1>
        <p className="mt-2 text-sm text-faded">
          {results.length} seçenek yarıştı, tek şampiyon kaldı
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState message="Turnuva tamamlanmadı — gösterilecek bir sonuç yok." />
      ) : (
        <>
          {champion && <Champion item={champion} />}

          {groups.length > 0 && (
            <Card surface="neutral" behavior="static">
              {groups.map((group) => (
                <section key={group.size} className="mt-5 first:mt-0">
                  <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-faded">
                    {groupLabel(group.size)}
                  </h2>
                  <ul className="divide-y divide-line/40">
                    {group.items.map((item) => (
                      <li key={item.itemId} className="flex items-center gap-3 py-3 sm:gap-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded object-cover shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                          />
                        )}
                        <p className="min-w-0 flex-1 truncate font-display font-bold text-cream">
                          {item.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </Card>
          )}
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="lg" onClick={onReplay}>
          Tekrar oyna
        </Button>
        <Button variant="secondary" size="lg" as={Link} to={`/polls/${poll.pollId}`}>
          Ankete dön
        </Button>
      </div>
      <div className="mt-3 text-center">
        <Button variant="link" onClick={onSetup}>
          Kurulumu değiştir
        </Button>
      </div>
    </div>
  )
}
