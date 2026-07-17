import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clapperboard, Tv, Gamepad2, Hamburger, Music2, Plus, ArrowRight } from 'lucide-react'
import { getTopItems, getCategories, getDailyRanking } from '../api/client'
import ItemCard from '../components/ItemCard'
import DuelWidget from '../components/DuelWidget'
import { Loading, ErrorState, EmptyState } from '../components/States'

// Kategori emojilerinin yerine geçen Lucide ikon eşlemesi (categoryId bazlı)
const CATEGORY_ICONS = {
  1: Clapperboard,
  2: Tv,
  3: Gamepad2,
  4: Hamburger,
  5: Music2,
}

// Günün sıralamasında dünle kıyas: yükseldi / düştü / sabit / yeni giriş
function DeltaBadge({ delta }) {
  if (delta === 'yeni')
    return <span className="text-xs font-extrabold uppercase tracking-wide text-plasma-soft">Yeni</span>
  if (delta > 0)
    return <span className="text-xs font-bold tabular-nums text-win">▲ {delta}</span>
  if (delta < 0)
    return <span className="text-xs font-bold tabular-nums text-danger">▼ {Math.abs(delta)}</span>
  return <span className="text-xs font-bold text-faded/70">—</span>
}

// Podyum sütunu: 2-1-3 dizilir, birinci en yüksek platformda alevle durur
// Renk dili: şampiyon asit yeşili, ikinci plazma, üçüncü turkuaz
function PodiumSpot({ item, rank, height, delay }) {
  const ringClass =
    rank === 1 ? 'ring-4 ring-acid' : rank === 2 ? 'ring-4 ring-plasma-soft/70' : 'ring-4 ring-zap/60'
  return (
    <Link
      to={`/items/${item.itemId}`}
      className="group flex animate-pop flex-col items-center gap-3"
      style={{ animationDelay: delay }}
    >
      <div className={`relative ${rank === 1 ? 'podium-flame' : ''}`}>
        {rank === 1 && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 animate-flame-dance text-3xl">
            🔥
          </span>
        )}
        <img
          src={item.imageUrl}
          alt={item.name}
          className={`h-20 w-20 rounded-full object-cover transition duration-300 group-hover:scale-105 sm:h-28 sm:w-28 ${ringClass}`}
        />
      </div>
      <div className="text-center">
        <p className="font-display font-bold text-cream transition group-hover:text-ember-soft">
          {item.name}
        </p>
        <span className="mt-1 inline-block rounded-md bg-zap/10 px-2 py-0.5 text-sm font-bold tabular-nums text-zap">
          ★ {Number(item.globalScore).toFixed(2)}
        </span>
      </div>
      <div
        className="stripe-neon flex w-full items-start justify-center rounded-t-xl bg-gradient-to-b from-ember-soft to-ember pt-3"
        style={{ height }}
      >
        <span className="font-display text-3xl font-extrabold text-night">#{rank}</span>
      </div>
    </Link>
  )
}

export default function Home() {
  const [items, setItems] = useState(null)
  const [categories, setCategories] = useState(null)
  const [daily, setDaily] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTopItems(6).then(setItems).catch((e) => setError(e.message))
    getCategories().then(setCategories).catch(() => setCategories([]))
    getDailyRanking().then(setDaily).catch(() => setDaily({ entries: [] }))
  }, [])

  const podium = items?.slice(0, 3)
  const dailyDate = daily?.date
    ? new Date(daily.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
    : null

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────
          Yüzeysiz: çerçeve/hale/blur yok. Sayfanın açılışı doğrudan zeminde
          durur, tek yükseltilmiş yüzey düello widget'ı. Alt ayrım navbar'ın
          border-b border-line/60 hattının aynısı — ağırlık kutudan değil
          tipografiden ve boşluktan gelir. */}
      <section className="mb-12 border-b border-line/60 pb-12">
        {/* Masaüstü: söz solda / düello sağda. Mobil: tek kolon, widget başlığın altına iner.
            Sağ kolon oransal (0.8fr): sabit cap'te geniş ekranda ortada ölü boşluk
            kalıyordu; oranla büyüyünce görseller de irileşiyor. minmax alt sınırı
            widget'ın sıkışmasını engeller. */}
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(380px,0.8fr)] lg:items-center lg:gap-16">
          <div>
            {/* 7xl xl'de açılır, lg'de değil: lg (1024) tam kolonun daraldığı
                nokta, orada 72px başlığı üç satıra kırıyordu. */}
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-cream sm:text-6xl xl:text-7xl">
              Her şeyi <span className="text-ember">sırala</span>,
              <br className="hidden sm:block" /> herkesle yarıştır
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-faded">
              Filmden yemeğe her şeye puan ver, topluluğun sıralamasını gör, kendi anketini oluştur.
            </p>
            {/* Tek birincil eylem: btn-fire daha iri. İkincil aynı yükseklikte ama sönük. */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/items" className="btn-fire group px-7 py-3 text-base">
                Keşfetmeye Başla
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
              <Link to="/polls/new" className="btn-ghost px-5 py-3">
                Anket Oluştur
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <DuelWidget />
        </div>
      </section>

      {/* ── Kategoriler ──────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="title-ember mb-5 font-display text-2xl font-extrabold text-cream">
          Bugün ne sıralıyoruz?
        </h2>
        {!categories ? (
          <Loading label="Kategoriler yükleniyor..." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat.categoryId]
              return (
                // animate-rise sarmalayıcıda: fill-mode kartın hover kalkışını ezmesin
                <div key={cat.categoryId} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                  <Link
                    to="/items"
                    className="card-ticket group flex h-full flex-col items-center gap-2 p-5 text-center"
                  >
                    {Icon && (
                      <Icon
                        className="h-9 w-9 text-ember-soft drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)] transition group-hover:animate-wiggle"
                        strokeWidth={2}
                      />
                    )}
                    <span className="font-display font-extrabold text-cream">{cat.name}</span>
                    <span className="text-xs font-semibold text-faded">{cat.tagline}</span>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Zirvedekiler: alevli podyum ──────────────────────── */}
      {podium?.length === 3 && (
        <section className="mb-12">
          <h2 className="title-ember mb-8 font-display text-2xl font-extrabold text-cream">
            Zirvedekiler
          </h2>
          <div className="mx-auto grid max-w-2xl grid-cols-3 items-end gap-3 sm:gap-6">
            <PodiumSpot item={podium[1]} rank={2} height="5rem" delay="120ms" />
            <PodiumSpot item={podium[0]} rank={1} height="7rem" delay="0ms" />
            <PodiumSpot item={podium[2]} rank={3} height="4rem" delay="240ms" />
          </div>
        </section>
      )}

      {/* ── Günün Sıralaması ─────────────────────────────────── */}
      {daily?.entries?.length > 0 && (
        <section className="mb-12">
          <div className="card-glow p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="badge-day">
                {dailyDate} • Günün Sıralaması
              </span>
              <p className="text-sm text-faded">Bugün en çok oy toplayanlar</p>
            </div>
            <ol className="divide-y divide-line/40">
              {daily.entries.map((entry, i) => (
                <li key={entry.itemId}>
                  <div className="flex items-center gap-3 py-3 sm:gap-4">
                    <span className="w-6 shrink-0 text-center font-display text-lg font-extrabold text-ember">
                      {i + 1}
                    </span>
                    <img
                      src={entry.item.imageUrl}
                      alt={entry.item.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display font-bold text-cream">{entry.item.name}</p>
                      <p className="text-xs tabular-nums text-faded">+{entry.votesToday} oy</p>
                    </div>
                    <DeltaBadge delta={entry.delta} />
                    <Link
                      to={`/items/${entry.itemId}`}
                      className="shrink-0 text-sm font-semibold text-zap transition hover:underline"
                    >
                      Sen de oyla →
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── Liderlik Tablosu ─────────────────────────────────── */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="title-ember font-display text-2xl font-extrabold text-cream">Liderlik Tablosu</h2>
        <Link to="/items" className="text-sm font-semibold text-zap transition hover:underline">
          Tümünü gör →
        </Link>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : !items ? (
        <Loading label="Sıralama yükleniyor..." />
      ) : items.length === 0 ? (
        <EmptyState message="Henüz puanlanmış bir şey yok. İlk oyu sen ver!" />
      ) : (
        <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
          {items.map((item, i) => (
            <div
              key={item.itemId}
              className="w-72 shrink-0 snap-start animate-rise sm:w-80"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <ItemCard item={item} rank={i + 1} />
            </div>
          ))}
          {/* Şeridin sonu: devamı için liste sayfasına yönlendiren kart */}
          <Link
            to="/items"
            className="card-ticket group flex w-72 shrink-0 snap-start flex-col items-center justify-center gap-3 p-6 text-center sm:w-80"
          >
            <span className="font-display text-lg font-extrabold text-cream">
              Daha fazlası mı lazım?
            </span>
            <span className="text-sm font-semibold text-faded">
              Tüm sıralamayı liste sayfasında keşfet.
            </span>
            <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2 font-display font-extrabold text-night shadow-[0_4px_0_var(--color-ember-deep)]">
              Tümünü gör
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      )}

      {/* ── Meydan okuma banner'ı: plazma neon panel ─────────── */}
      <section className="glow-plasma relative mt-12 overflow-hidden rounded-2xl bg-night-deep p-8 sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
          <span className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-plasma/20 blur-3xl" />
          <span className="absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-ember/15 blur-3xl" />
        </div>
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-cream">Kendi arenanı kur!</h2>
            <p className="mt-2 max-w-xl font-semibold text-faded">
              Fikrin mi var? Anketini aç, herkes oylasın, kavga çıksın 😈
            </p>
          </div>
          <Link to="/polls/new" className="btn-fire px-6 py-3">
            Anket Oluştur →
          </Link>
        </div>
      </section>
    </div>
  )
}
