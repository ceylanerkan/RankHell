/**
 * "Her Sıradan Bir Tanesini Seç" vitrinindeki oyun kartı.
 * ----------------------------------------------------------------
 * Düzen: kapak → başlık → açıklama → meta satırı (kategori · ölçü · oynanma).
 *
 * Kart sistemi sözleşmesi:
 *   - Yüzey RAISED, bilet DEĞİL: bilet yüzeyi oy/sonuç kartlarına ve
 *     navigation whitelist'ine (ItemCard, "daha fazlası") ayrılmış; oyun kapağı
 *     ikisine de girmiyor. ItemCard'ın düzeni örnek alındı, yüzeyi değil.
 *   - Kapak radius'u 4px (kart 8px − 4). ItemCard'ın rounded-xl'i tekrarlanmaz.
 *   - Kapakta hover büyümesi yok: kart sisteminde scale yasak, tek sinyal
 *     Card'ın kendi sol ember marker'ı.
 *   - Kart başına tek kor: içeride ember yok.
 */

import CategoryBadge from '../../CategoryBadge'
import Card from '../../ui/Card'

export default function RowPickGameCard({ game }) {
  return (
    <Card
      surface="raised"
      behavior="navigation"
      to={`/modlar/sira-secimi/${game.gameId}`}
      className="group flex h-full flex-col"
    >
      <div className="aspect-video overflow-hidden rounded">
        <img src={game.coverUrl} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="font-display text-lg font-extrabold leading-snug text-cream">
          {game.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm font-medium text-faded">{game.description}</p>

        {/* Ölçü satırı: oyunun ızgarası tek bakışta okunsun. */}
        <p className="mt-3 text-xs font-bold tabular-nums text-faded/80">
          {game.rowCount} satır · {game.optionCount} seçenek
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {game.categories?.map((c) => (
              <CategoryBadge key={c.categoryId} name={c.name} tone="night" />
            ))}
          </div>
          <span className="flex items-center gap-2 text-xs font-bold tabular-nums text-faded/80">
            {game.plays.toLocaleString('tr-TR')} oynanma
            <span className="rh-card-go" aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </div>
    </Card>
  )
}
