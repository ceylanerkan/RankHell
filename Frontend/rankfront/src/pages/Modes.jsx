// Modlar vitrini: her oyun modu bir kapak kartı. Liste gameModes.js'te yaşar;
// bu sayfa yalnızca onu dizer — yeni mod açıldığında burada değişiklik gerekmez.
import { useState } from 'react'
import ModeCoverCard from '../components/modes/ModeCoverCard'
import { GAME_MODES, readyModeLabels } from '../lib/gameModes'
import { joinTr } from '../lib/text'

export default function Modes() {
  // Tıklanan hazır-olmayan modun anahtarı: notu yalnızca o kart gösterir.
  const [notReady, setNotReady] = useState(null)

  // Metin listeden türer: bir mod açıldığında cümle kendiliğinden doğru kalır.
  const note = `Bu mod henüz hazır değil — şimdilik ${joinTr(readyModeLabels())} oynanabilir.`

  return (
    // Vitrin sayfanın tam genişliğini kullanır (üst sınır App'in max-w-[1600px]'i);
    // yalnızca başlık metni okunabilir ölçüde dar tutulur.
    <div className="w-full">
      <h1 className="title-copper font-display text-3xl font-extrabold text-cream">Modlar</h1>
      <p className="mb-8 mt-2 max-w-2xl text-sm text-faded">
        Sıralamanın farklı halleri. Bir kapağı seç, cehennemin kurallarını sen koy.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {GAME_MODES.map((mode, i) => {
          // Tek başına kalan son kart (mod sayısı tekse) iki sütunu birden kaplar:
          // ızgarada boş yarım sütun kalmaz.
          const isLoneLast = i === GAME_MODES.length - 1 && GAME_MODES.length % 2 === 1

          return (
            // animate-rise sarmalayıcıda: fill-mode kartın hover sinyalini ezmesin.
            <div
              key={mode.key}
              className={`animate-rise ${isLoneLast ? 'lg:col-span-2' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ModeCoverCard
                mode={mode}
                note={notReady === mode.key ? note : null}
                onNotReady={setNotReady}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
