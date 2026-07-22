// Kart sistemi doğrulama sayfası — yalnızca geliştirme aracı.
// Faz 7'de silinir veya docs'a taşınır (ilk plan git geçmişinde, 8d673d8 öncesi).
import { useState } from 'react'
import Card from '../../components/ui/Card'

function Label({ children }) {
  return (
    <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-faded">{children}</p>
  )
}

export default function DevCards() {
  const [selected, setSelected] = useState(true)

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-2 font-display text-3xl font-extrabold text-cream">
        Kart Sistemi — /dev/cards
      </h1>
      <p className="mb-10 text-sm text-faded">
        surface × behavior doğrulama sayfası. docs/design/card-system.html ile yan yana
        karşılaştır.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label>neutral · static</Label>
          <Card surface="neutral" behavior="static">
            <h3 className="font-display font-bold text-cream">Bu hafta</h3>
            <p className="mt-1 text-sm text-faded">318 yeni oy · 12 yeni anket</p>
          </Card>
        </div>

        <div>
          <Label>raised · static</Label>
          <Card surface="raised" behavior="static">
            <h3 className="font-display font-bold text-cream">Kebap masasında son söz</h3>
            <p className="mt-1 text-sm text-faded">1.341 oy</p>
          </Card>
        </div>

        <div>
          <Label>ticket · static (result)</Label>
          <Card surface="ticket" behavior="static">
            <Card.Body>
              <h3 className="font-display font-bold text-cream">Oyun kaydedildi</h3>
              <p className="mt-1 text-sm text-faded">Adana Kebap</p>
            </Card.Body>
            <Card.Perf />
            <Card.Stub>
              <span className="text-xs font-semibold uppercase tracking-wide text-moss-soft">
                onaylandı
              </span>
              <span className="font-mono text-lg font-bold text-brass-soft">1.341</span>
            </Card.Stub>
          </Card>
        </div>

        <div>
          <Label>neutral · navigation (compact)</Label>
          <Card surface="neutral" behavior="navigation" to="/items" padding="compact">
            <div className="flex items-center justify-between gap-3">
              <span className="font-display font-bold text-cream">Tüm yorumlar</span>
              <span className="rh-card-go" aria-hidden="true">→</span>
            </div>
          </Card>
        </div>

        <div>
          <Label>raised · interactive</Label>
          <Card surface="raised" behavior="interactive" onClick={() => {}}>
            <h3 className="font-display font-bold text-cream">Sıradaki düello</h3>
            <p className="mt-1 text-sm text-faded">Oy vermek için tıkla</p>
          </Card>
        </div>

        <div>
          <Label>raised · disabled</Label>
          <Card surface="raised" behavior="disabled">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-cream">Müzik anketi</h3>
              <span className="text-sm text-faded">—</span>
            </div>
            <p className="mt-1 text-sm text-faded">Oylama kapandı</p>
          </Card>
        </div>

        <div>
          <Label>raised · selectable</Label>
          <Card surface="raised" behavior="selectable" selected={false} onClick={() => {}}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-cream">İskender</h3>
                <p className="mt-1 text-sm text-faded">Bursa ekolü</p>
              </div>
              <span className="rh-card-pick" aria-hidden="true" />
            </div>
          </Card>
        </div>

        <div>
          <Label>raised · selectable + selected</Label>
          <Card
            surface="raised"
            behavior="selectable"
            selected={selected}
            onClick={() => setSelected((s) => !s)}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-cream">Adana Kebap</h3>
                <p className="mt-1 text-sm text-faded">Oyun bu — tıkla, aç/kapa</p>
              </div>
              <span className="rh-card-pick" aria-hidden="true" />
            </div>
          </Card>
        </div>

        <div>
          <Label>ticket · navigation (whitelist)</Label>
          <Card surface="ticket" behavior="navigation" to="/items">
            <Card.Body>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-cream">Senin sıralaman</h3>
                <span className="font-mono text-sm text-brass-soft">#7</span>
              </div>
              <p className="mt-1 text-sm text-faded">Antalya'nın en iyi 10 çiğ köftecisi</p>
            </Card.Body>
            <Card.Perf />
            <Card.Stub>
              <span className="text-xs font-semibold uppercase tracking-wide text-faded">
                senin listen
              </span>
              <span className="rh-card-go" aria-hidden="true">→</span>
            </Card.Stub>
          </Card>
        </div>

        <div>
          <Label>dropzone (.tier-slot deseni — Card değil)</Label>
          <div className="flex aspect-square w-20 items-center justify-center rounded-xl border-2 border-dashed border-line bg-night-deep/50 text-lg font-bold text-faded/50">
            ?
          </div>
        </div>
      </div>
    </div>
  )
}
