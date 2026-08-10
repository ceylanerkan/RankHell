// "Her Sıradan Bir Tanesini Seç" modunun vitrini: başlık bandı → filtre satırı
// → oyun kartları. Oyunun mekaniği (satır ızgarası, tek seçim, eleme) burada
// değil; her kart kendi oyun ekranına götürür (şimdilik boş iskelet).
//
// Filtre ve sıralama durumu URL'de yaşar: link paylaşılabilir, geri tuşu
// çalışır, sayfa yenilenince seçim kaybolmaz — Sektör sayfasıyla aynı desen.
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getRowPickGames, getCategories } from '../api/client'
import RowPickGameCard from '../components/modes/rowpick/RowPickGameCard'
import { Loading, ErrorState, EmptyState } from '../components/States'
import Button from '../components/ui/button/Button'
import Menu from '../components/ui/Menu'
import { DEFAULT_SORT, SORT_MODES, filterGames, isSortMode, sortGames, sortLabel } from '../lib/rowPick'

export default function RowPick() {
  const [games, setGames] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // Seçili kategoriler URL'de virgülle ayrılır: ?kategori=1,3
  const rawCategories = searchParams.get('kategori')
  const selected = rawCategories ? rawCategories.split(',').filter(Boolean) : []
  const sortParam = searchParams.get('sirala')
  const sort = isSortMode(sortParam) ? sortParam : DEFAULT_SORT

  useEffect(() => {
    getRowPickGames().then(setGames).catch((e) => setError(e.message))
    getCategories().then(setCategories).catch(() => {})
  }, [])

  // Tek yazma noktası: mevcut parametreleri koru, boşalan anahtarı sil ki URL
  // "?kategori=&sirala=" gibi ölü parçalarla şişmesin.
  function writeParams(patch) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(patch)) {
      if (!value || value.length === 0) next.delete(key)
      else next.set(key, Array.isArray(value) ? value.join(',') : value)
    }
    setSearchParams(next)
  }

  const toggle = (categoryId) => {
    const key = String(categoryId)
    writeParams({
      kategori: selected.includes(key) ? selected.filter((v) => v !== key) : [...selected, key],
    })
  }

  const visible = useMemo(
    () => (games ? sortGames(filterGames(games, { categories: selected }), sort) : []),
    // selected her render'da yeni dizi: kimlik yerine içeriği izlenir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [games, selected.join(','), sort],
  )

  return (
    <div>
      {/* ── Başlık bandı ──────────────────────────────────────
          Yüzeysiz: çerçeve/hale/blur yok. Alt ayrım hattı navbar ve Home
          hero'sunun kullandığı border-line/60'ın aynısı; ağırlık kutudan
          değil tipografiden ve boşluktan gelir. */}
      <section className="mb-6 border-b border-line/60 pb-6">
        <span className="inline-flex w-fit items-center rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-copper-soft ring-1 ring-line">
          SIRA SEÇİMİ
        </span>
        <h1 className="title-copper mt-4 font-display text-3xl font-extrabold text-cream sm:text-4xl">
          Her Sıradan Bir Tanesini Seç
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-faded sm:text-base">
          Her satırdan yalnızca bir tane alabilirsin. Gerisi elenir. Bir oyun seç, kimin kalacağına
          sen karar ver.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Menu label="Filtrele" title="Filtrele" count={selected.length}>
          {() => (
            <>
              <Menu.Group>
                <Menu.Title>Kategori</Menu.Title>
                {categories.map((c) => (
                  <Menu.Item
                    key={c.categoryId}
                    multi
                    selected={selected.includes(String(c.categoryId))}
                    onSelect={() => toggle(c.categoryId)}
                  >
                    {c.name}
                  </Menu.Item>
                ))}
              </Menu.Group>

              {selected.length > 0 && (
                <Menu.Foot>
                  <Button variant="link" onClick={() => writeParams({ kategori: [] })}>
                    Filtreleri temizle
                  </Button>
                </Menu.Foot>
              )}
            </>
          )}
        </Menu>

        <Menu label={sortLabel(sort)} title="Sırala">
          {({ close }) => (
            <>
              <Menu.Title>Sırala</Menu.Title>
              {Object.entries(SORT_MODES).map(([key, text]) => (
                <Menu.Item
                  key={key}
                  selected={sort === key}
                  onSelect={() => {
                    writeParams({ sirala: key === DEFAULT_SORT ? '' : key })
                    close()
                  }}
                >
                  {text}
                </Menu.Item>
              ))}
            </>
          )}
        </Menu>

        {games && !error && (
          <span className="ml-auto text-sm font-medium tabular-nums text-faded">
            {visible.length} oyun
          </span>
        )}
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : !games ? (
        <Loading label="Oyunlar yükleniyor..." />
      ) : visible.length === 0 ? (
        <EmptyState message="Bu filtrelerle oyun yok." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((game, i) => (
            // animate-rise sarmalayıcıda: fill-mode kartın hover sinyalini ezmesin.
            <div key={game.gameId} className="animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
              <RowPickGameCard game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
