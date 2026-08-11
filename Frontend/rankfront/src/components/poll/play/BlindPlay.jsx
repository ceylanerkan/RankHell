import { useEffect } from 'react'
import Card from '../../ui/Card'
import PlayBand from './PlayBand'
import { useBlindGame } from '../../../hooks/useBlindGame'
import { useHiddenNav } from '../../../lib/chrome'

// Kör Sıralama tur ekranı: solda numaralı yuva sütunu, ortada sıradaki seçenek.
// Oyuncu seçeneği boş bir yuvaya koyar; dolu yuva bir daha seçilemez, geri al
// yok — verilen sıra kalıcı. Tüm state useBlindGame'de; burada yalnızca sahne var.
//
// Bantta geri al/atla YOK (children geçilmiyor): N seçenek ↔ N yuva birebir
// eşleşiyor, atlanan seçenek dolmayan yuva demek olurdu.
//
// SAHNE KART DEĞİL: ortadaki görsel + isim plaketi bir içerik kartı değil, oyun
// sahnesi — bandın (exceptions.md §7) devamı. Card'a sarılırsa oyun ekranı bir
// liste satırı gibi görünüyor; referans düzende görsel sayfanın kahramanı.
// Yuvalar ise gerçek etkileşim hedefi olduğu için Card sisteminden geçer.

// Yuva sütunu TEK EKRANA SIĞAR: kutu boyutu sabit değil, oyun alanına kalan
// yükseklikten türer. Tur sayısı 5 de olsa 10 da olsa, ekran ne kadar kısa
// olursa olsun oyuncu bütün yuvaları kaydırmadan görür — kaydırmak "elimdeki
// seçenek" ile "nereye koyacağım"ı aynı anda görmeyi bozardı.
//
// Ölçü sabit sayıya (band yüksekliği vb.) DAYANMAZ: dış sarmalayıcı 100dvh'lik
// bir flex sütun, oyun alanı da onun flex-1'i. Alan bir "size container"
// olduğu için kutu doğrudan 100cqh üzerinden hesaplanır — bant dar ekranda iki
// satıra insa bile pay kendiliğinden doğru kalır ve altta boşluk kalmaz.
const SLOT_MAX = '4rem' // tavan: geniş ekranda / az turda gereksiz büyümesin
const SLOT_MIN = '1.25rem' // taban: patolojik kısa ekranda görünmez olmasın
const SLOT_GAP_REM = 0.375
const AREA_PAD_REM = 1 // oyun alanının py-2'si (üst+alt)
// Sahne aynı mantıkla: 3:2 görsel + isim plaketi alana sığsın diye genişlik
// yükseklikten sınırlanır (kalan yükseklik × 1.5 = 3:2 karşılığı).
const STAGE_MAX = '560px'
const STAGE_RESERVE = '5rem' // isim plaketi + arasındaki boşluk

function playAreaVars(count) {
  const gaps = (count - 1) * SLOT_GAP_REM
  return {
    '--blind-slot': `clamp(${SLOT_MIN}, (100cqh - ${AREA_PAD_REM}rem - ${gaps}rem) / ${count}, ${SLOT_MAX})`,
    '--blind-stage': `min(${STAGE_MAX}, (100cqh - ${AREA_PAD_REM}rem - ${STAGE_RESERVE}) * 1.5)`,
  }
}

// Yuva: numaralı kare. Boşken tıklanabilir hedef (interactive → <button>,
// hover'da sistemin sol ember marker'ı), dolduğunda seçeneğin görselini taşır
// (static → <div>, sekme durağı bırakmaz). Dolu yuvada numara gösterilmez:
// sütundaki konum zaten sırayı söylüyor, görsel de neyin nereye gittiğini.
function Slot({ rank, item, currentName, onPlace }) {
  // Kutu küçülünce numara da küçülür, yoksa kısa ekranda rakam kutuyu taşardı.
  const box = 'h-[var(--blind-slot)] w-[var(--blind-slot)] shrink-0'
  const numeral =
    'font-display font-extrabold tabular-nums text-[min(1.125rem,calc(var(--blind-slot)*0.4))]'

  if (item) {
    return (
      <Card
        surface="raised"
        behavior="static"
        padding="none"
        className={`flex animate-pop items-center justify-center ${box}`}
        aria-label={`${rank}. sıra: ${item.name}`}
        title={`${rank}. ${item.name}`}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className={`${numeral} text-cream`}>{rank}</span>
        )}
      </Card>
    )
  }

  return (
    <Card
      surface="raised"
      behavior="interactive"
      padding="none"
      onClick={onPlace}
      aria-label={`${currentName} seçeneğini ${rank}. sıraya yerleştir`}
      className={`flex items-center justify-center ${box}`}
    >
      {/* Numara nötr metal: yuva tıklanabilir bir öğe ve pirinç tıklanabilir
          öğede kullanılmaz — derece rengi yalnızca sonuç ekranında konuşur. */}
      <span className={`${numeral} text-ash`}>{rank}</span>
    </Card>
  )
}

export default function BlindPlay({ poll, roundCount, onFinish, onQuit }) {
  const { current, index, total, slots, placedSlot, progress, status, results, place } =
    useBlindGame({ items: poll.items, roundCount })

  useHiddenNav()

  // Son yerleştirmeden sonra sonucu sayfaya devret: sonuç ekranı bu bileşenin
  // değil, PollPlay'in fazı. scored:false — bu sonuçta puan yok, sıra var.
  useEffect(() => {
    if (status === 'done') onFinish({ results, scored: false })
  }, [status, results, onFinish])

  if (!current) return null

  const advancing = status === 'advancing'

  return (
    // Oyun ekranı görünür alanı doldurur: -2rem, main'in alt py-8'i (üst py-8'i
    // bandın -mt-8'i zaten yutuyor). Böylece oyun alanı tam ekranın altına
    // dayanır — altta boşluk kalmaz, sayfa yine de kaydırılabilir kalır.
    <div className="flex h-[calc(100dvh-2rem)] flex-col">
      <PlayBand
        title={poll.title}
        modeKey="blind"
        index={index}
        total={total}
        progress={progress}
        onQuit={onQuit}
      />

      {/* Oyun alanı: banttan artan yükseklik. size container olduğu için
          içerideki ölçüler 100cqh üzerinden bunun gerçek boyunu okur. */}
      <div className="min-h-0 flex-1 [container-type:size]">
        {/* Yuva sütunu solda (order-first), sahne ortada — ama DOM'da sahne
            önce: ekran okuyucu önce "neyi yerleştiriyorum"u, sonra "nereye"yi
            duysun. Dikey ortalama sütunla sahneyi aynı eksende tutar. */}
        <div
          className="flex h-full items-center justify-center gap-4 py-2 sm:gap-8 lg:gap-14"
          style={playAreaVars(total)}
        >
          {/* key: her seçenekte sahne yeniden mount olur, animate-rise baştan oynar. */}
          <div
            key={current.itemId}
            className={`flex min-w-0 flex-1 animate-rise flex-col items-center gap-4 sm:gap-5 ${
              advancing ? 'opacity-60' : ''
            } max-w-[var(--blind-stage)] transition-opacity duration-300`}
          >
            {/* Çerçeve metal (iron): görseli zeminden ayıran bir YAPI öğesi,
                sinyal değil — sahne statik, kor yalnızca etkileşimde ve veride
                konuşur (yuvaların hover marker'ı, banttaki ilerleme çubuğu). */}
            {current.imageUrl ? (
              <img
                src={current.imageUrl}
                alt={current.name}
                className="aspect-[3/2] w-full rounded-lg border-2 border-iron object-cover object-center"
              />
            ) : (
              <div
                className="flex aspect-[3/2] w-full items-center justify-center rounded-lg border-2 border-iron bg-night-deep text-sm text-faded"
                role="img"
                aria-label={`${current.name} görseli yok`}
              >
                Görsel yok
              </div>
            )}

            {/* İsim plaketi: referanstaki gibi görselin altında duran tek satır.
                Nötr metal — dolu ember/pirinç bir zemin burada butonla ya da
                dereceyle karışırdı, oysa bu yalnızca seçeneğin adı. */}
            <p className="max-w-full truncate rounded-md border border-iron bg-coal-light px-5 py-2 text-center font-display text-lg font-extrabold text-cream sm:text-2xl">
              {current.name}
            </p>
          </div>

          {/* Geçiş sürerken yuvalar kapanır: ikinci tık hook'ta da yutulur,
              buradaki kilit niyeti görünür kılar. gap-1.5 = SLOT_GAP_REM. */}
          <ol
            aria-label="Sıralama yuvaları"
            className={`order-first flex flex-col gap-1.5 ${advancing ? 'pointer-events-none' : ''}`}
          >
            {slots.map((item, i) => (
              <li key={i} className="flex">
                <Slot
                  rank={i + 1}
                  item={item}
                  currentName={current.name}
                  onPlace={() => place(i)}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {advancing
          ? `${current.name}, ${placedSlot + 1}. sıraya yerleştirildi.`
          : `${index + 1} / ${total}: ${current.name} — boş bir sıra seç.`}
      </p>
    </div>
  )
}
