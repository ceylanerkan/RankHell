/**
 * GEÇİCİ — Damga v1 buton doğrulama sayfası (rota: /damga).
 * Migrasyon planı Adım 1.3: 8 varyantı da render eder, konsol hatası
 * ve görsel/davranış kontrolü içindir. Migrasyon bitince silinecek
 * (plan Adım 3, madde 6). Rotası App.jsx'ten de kaldırılacak.
 */
import { useState } from 'react';
import Button from '../components/ui/button/Button';

// icon varyantları için basit çizgi ikon (emoji yok)
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function Row({ title, hint, children }) {
  return (
    <section className="border-t border-line pt-5">
      <h2 className="font-display text-sm font-bold uppercase tracking-widest text-faded">
        {title}
      </h2>
      {hint && <p className="mt-1 text-xs text-faded/70">{hint}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}

export default function DamgaTest() {
  const [loading, setLoading] = useState(false);

  // gerçek async akışı taklit et: loading prop'unu tetikle
  const fakeAsync = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };

  return (
    <div className="space-y-8 pb-16">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold text-cream">
          Damga v1 — Buton Doğrulama
        </h1>
        <p className="text-sm text-faded">
          Geçici test sayfası. 8 varyant, boyutlar ve durumlar. Hover / bas /
          Tab (focus braketi) / loading davranışlarını burada kontrol et.
        </p>
      </header>

      <Row title="1 · hero-primary" hint="Sadece vitrin: pill + dönen madeni para. Boyut skalasına girmez.">
        <Button variant="hero-primary" href="#">Keşfetmeye Başla</Button>
        <Button variant="hero-primary" onClick={fakeAsync} loading={loading}>
          Oyla ve Kazan
        </Button>
        <Button variant="hero-primary" disabled>Pasif</Button>
      </Row>

      <Row title="2 · primary" hint="Görünümün ana aksiyonu. Çentikli, dolu ember plaka.">
        <Button variant="primary" size="sm">sm</Button>
        <Button variant="primary" size="md">md (varsayılan)</Button>
        <Button variant="primary" size="lg">lg</Button>
        <Button variant="primary" onClick={fakeAsync} loading={loading}>Oy ver</Button>
        <Button variant="primary" disabled>Pasif</Button>
      </Row>

      <Row title="3 · secondary" hint="Ana aksiyonun yanındaki gerçek ikinci yol. Yanmamış plaka.">
        <Button variant="secondary" size="sm">sm</Button>
        <Button variant="secondary" size="md">İncele</Button>
        <Button variant="secondary" size="lg">lg</Button>
        <Button variant="secondary" disabled>Pasif</Button>
      </Row>

      <Row title="4 · ghost" hint="Sessiz seçenek: kart içi / toolbar / atla-kapat.">
        <Button variant="ghost" size="sm">sm</Button>
        <Button variant="ghost">Daha sonra</Button>
        <Button variant="ghost" size="lg">lg</Button>
        <Button variant="ghost" disabled>Pasif</Button>
      </Row>

      <Row title="5 · danger" hint="Yıkıcı, geri alınamaz. Tehlike şeridi + çentik.">
        <Button variant="danger">Sil</Button>
        <Button variant="danger" onClick={fakeAsync} loading={loading}>Hesabı kapat</Button>
        <Button variant="danger" disabled>Pasif</Button>
      </Row>

      <Row title="6 · icon" hint="Yer dar, anlam açık. aria-label ZORUNLU.">
        <Button variant="icon" aria-label="Ara" size="sm"><SearchIcon /></Button>
        <Button variant="icon" aria-label="Ara"><SearchIcon /></Button>
        <Button variant="icon" aria-label="Ara" size="lg"><SearchIcon /></Button>
        <Button variant="icon" aria-label="Ara" disabled><SearchIcon /></Button>
      </Row>

      <Row title="7 · icon-line" hint="Yoğun/görsel zeminde çerçeveli ikon.">
        <Button variant="icon-line" aria-label="Ara" size="sm"><SearchIcon /></Button>
        <Button variant="icon-line" aria-label="Ara"><SearchIcon /></Button>
        <Button variant="icon-line" aria-label="Ara" size="lg"><SearchIcon /></Button>
        <Button variant="icon-line" aria-label="Ara" disabled><SearchIcon /></Button>
      </Row>

      <Row title="8 · link" hint="Satır içi / üçüncül. arrow prop'u ileri götüren ok ekler.">
        <Button variant="link" href="#">Tüm oyları incele</Button>
        <Button variant="link" href="#" arrow>Tümünü gör</Button>
        <Button variant="link" disabled>Pasif</Button>
      </Row>

      <Row title="fullWidth" hint="Mobil form altları için tam genişlik.">
        <div className="w-full max-w-sm">
          <Button variant="primary" fullWidth>Kaydet</Button>
        </div>
      </Row>
    </div>
  );
}
