import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSector } from '../hooks/useSector'
import PersonaCard from '../components/sector/PersonaCard'
import { Loading, ErrorState, EmptyState } from '../components/States'
import Button from '../components/ui/button/Button'
import Menu from '../components/ui/Menu'
import {
  DEFAULT_SORT,
  GENDERS,
  ROLES,
  SORT_MODES,
  filterPersonas,
  isSortMode,
  sortLabel,
  sortPersonas,
} from '../lib/sector'

// Filtre ve sıralama, üstte iki menüde toplanır: dokununca açılır, kapalıyken
// tek satır yer kaplar. Filtre çoklu seçimdir ve seçince menü açık kalır;
// sıralama tek seçimdir, seçince kapanır.

// Filtre durumu URL'de yaşar: link paylaşılabilir, geri tuşu çalışır,
// sayfa yenilenince seçim kaybolmaz. Virgülle ayrılmış liste.
function readList(searchParams, key, allowed) {
  const raw = searchParams.get(key)
  if (!raw) return []
  return raw.split(',').filter((v) => Object.hasOwn(allowed, v))
}

export default function Sector() {
  const { personas, votes, vote, loading, error } = useSector()
  const [searchParams, setSearchParams] = useSearchParams()

  const roles = readList(searchParams, 'rol', ROLES)
  const genders = readList(searchParams, 'cinsiyet', GENDERS)
  const sortParam = searchParams.get('sirala')
  const sort = isSortMode(sortParam) ? sortParam : DEFAULT_SORT

  // Tek yazma noktası: mevcut parametreleri koru, boşalan anahtarı sil ki
  // URL "?rol=&cinsiyet=" gibi ölü parçalarla şişmesin.
  function writeParams(patch) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(patch)) {
      if (!value || value.length === 0) next.delete(key)
      else next.set(key, Array.isArray(value) ? value.join(',') : value)
    }
    setSearchParams(next)
  }

  const toggle = (key, current, value) =>
    writeParams({
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    })

  const visible = useMemo(
    () => (personas ? sortPersonas(filterPersonas(personas, { roles, genders }), sort) : []),
    // roles/genders her render'da yeni dizi: kimlik yerine içerikleri izlenir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [personas, roles.join(','), genders.join(','), sort],
  )

  return (
    <div>
      <h1 className="title-copper font-display text-3xl font-extrabold text-cream">
        Sektöre Hoş Geldin
      </h1>
      <p className="mb-6 mt-2 text-sm text-faded">
        Takipçisi az fenomenler burada yarışıyor. Oy ver, sıralamayı sen belirle.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Menu label="Filtrele" title="Filtrele" count={roles.length + genders.length}>
          {() => (
            <>
              <Menu.Group>
                <Menu.Title>Rol</Menu.Title>
                {Object.entries(ROLES).map(([key, text]) => (
                  <Menu.Item
                    key={key}
                    multi
                    selected={roles.includes(key)}
                    onSelect={() => toggle('rol', roles, key)}
                  >
                    {text}
                  </Menu.Item>
                ))}
              </Menu.Group>

              <Menu.Group>
                <Menu.Title>Cinsiyet</Menu.Title>
                {Object.entries(GENDERS).map(([key, text]) => (
                  <Menu.Item
                    key={key}
                    multi
                    selected={genders.includes(key)}
                    onSelect={() => toggle('cinsiyet', genders, key)}
                  >
                    {text}
                  </Menu.Item>
                ))}
              </Menu.Group>

              {(roles.length > 0 || genders.length > 0) && (
                <Menu.Foot>
                  <Button variant="link" onClick={() => writeParams({ rol: [], cinsiyet: [] })}>
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

        {!loading && !error && (
          <span className="ml-auto text-sm font-medium tabular-nums text-faded">
            {visible.length} kişi
          </span>
        )}
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <Loading label="Sektör yükleniyor..." />
      ) : visible.length === 0 ? (
        <EmptyState message="Bu filtrelerle kimse yok." />
      ) : (
        /* Kırılımlar .sector-grid içinde (index.css) — utility zinciri
           1400px'te lg'ye yeniliyordu, gerekçe orada yazılı. */
        <div className="sector-grid">
          {visible.map((persona, i) => (
            <div
              key={persona.personaId}
              className="animate-rise"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <PersonaCard
                persona={persona}
                myVote={votes[persona.personaId] ?? 0}
                onVote={(direction) => vote(persona.personaId, direction)}
                rank={sort === 'net' ? i + 1 : null}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
