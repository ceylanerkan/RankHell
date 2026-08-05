import { useEffect } from 'react'
import Card from '../../ui/Card'
import PlayBand from './PlayBand'
import { useDuelGame } from '../../../hooks/useDuelGame'
import { useHiddenNav } from '../../../lib/chrome'

// "O mu, Bu mu?" ekranı: ortada tek eşleşme (iki taraf + VS). Oyuncu bir tarafı
// seçer, KAZANAN SAHNEDE KALIR, elenenin yerine kuyruktan yeni bir seçenek
// gelir. Havuz tükenince ayakta kalan şampiyondur. Tüm state useDuelGame'de;
// burada yalnızca sahne var.
//
// Turnuva ağacının standartları burada birebir geçerli: aynı kart ölçüsü, aynı
// 700ms beat, kazananda animate-swell, kaybedende sönme, geçişte iki katmanlı
// tıklama kilidi. Yeni bir hareket ya da ölçü dili üretilmez.
//
// Bantta geri al/atla YOK (children geçilmiyor): atlanan bir seçim tahtta
// kimin kaldığını belirsiz bırakırdı — sonraki her eşleşme o karara bağlı.
//
// Yan panel yok: turnuvadaki BracketMap ağacın YAPISINI anlatıyordu, burada
// kuyruk düz bir sıra — konumu banttaki sayaç ve ilerleme çubuğu zaten söylüyor.
//
// EŞLEŞME TARAFLARI KART SİSTEMİNDEN GEÇER (BlindPlay'in sahne istisnasına
// girmezler): ekranın tek etkileşim hedefi onlar, hover'daki sol ember marker
// doğru sinyaldir.

// Sahne tek ekrana sığar: taraf genişliği sabit değil, oyun alanına kalan
// yükseklikten türer (BracketPlay ile aynı hesap). 3:2 görsel + isim şeridi
// ekranı taşırmaz.
const SIDE_MAX = '560px'
const SIDE_RESERVE = '7.5rem' // üst satır + isim şeridi + aralarındaki boşluk
const AREA_PAD_REM = 1 // oyun alanının py-2'si (üst+alt)

const stageVars = {
  '--duel-side': `min(${SIDE_MAX}, (100cqh - ${AREA_PAD_REM}rem - ${SIDE_RESERVE}) * 1.5)`,
}

// Bir eşleşme tarafı — BracketPlay'deki Side ile aynı kart. state: 'idle' seçim
// bekliyor · 'won' bu turu aldı · 'lost' elendi. Kazananda BRASS YOK: taraf
// tıklanabilir bir öğe ve pirinç tıklanabilir öğede kullanılmaz — ödül dili
// yalnızca sonuç ekranında konuşur. animate-pop da kullanılmaz: podyum rozeti
// için yazılmış yay bu ölçekteki bir kartta zıplama gibi okunuyor.
function Side({ item, state, onPick }) {
  return (
    <Card
      surface="raised"
      behavior="interactive"
      padding="none"
      onClick={onPick}
      aria-label={`${item.name} kazansın`}
      className={`flex w-full min-w-0 flex-col transition-opacity duration-300 ${
        state === 'lost' ? 'opacity-60' : ''
      } ${state === 'won' ? 'animate-swell' : ''}`}
    >
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" className="aspect-[3/2] w-full object-cover object-center" />
      ) : (
        <span
          aria-hidden="true"
          className="flex aspect-[3/2] w-full items-center justify-center bg-night-deep text-sm text-faded"
        >
          Görsel yok
        </span>
      )}
      {/* İsim şeridi görselin altına biner: sabit min yükseklik iki tarafın
          isim hizasını korur, uzun ad kartı diğerinden büyütmez. */}
      <span className="mt-auto flex min-h-[3.25rem] items-center justify-center bg-night-deep/85 px-3 py-2.5 text-center font-display text-[15px] font-bold leading-snug text-cream sm:text-[17px]">
        <span className="min-w-0 truncate">{item.name}</span>
      </span>
    </Card>
  )
}

export default function DuelPlay({ poll, roundCount, onFinish, onQuit }) {
  const {
    left,
    right,
    size,
    picks,
    totalMatches,
    remaining,
    progress,
    status,
    winnerSide,
    champion,
    pick,
  } = useDuelGame({ items: poll.items, roundCount })

  useHiddenNav()

  // Kuyruk bitince sonucu sayfaya devret: sonuç ekranı bu bileşenin değil,
  // PollPlay'in fazı.
  useEffect(() => {
    if (status === 'done') onFinish({ champion, contenders: size })
  }, [status, champion, size, onFinish])

  if (!left || !right) return null

  const advancing = status === 'advancing'
  const sideState = (side) => (advancing ? (winnerSide === side ? 'won' : 'lost') : 'idle')

  return (
    // Oyun ekranı görünür alanı doldurur: -2rem, main'in alt py-8'i (üst py-8'i
    // bandın -mt-8'i zaten yutuyor).
    <div className="flex h-[calc(100dvh-2rem)] flex-col">
      <PlayBand
        title={poll.title}
        modeKey="duel"
        index={picks}
        total={totalMatches}
        progress={progress}
        onQuit={onQuit}
      />

      {/* Oyun alanı: banttan artan yükseklik. size container olduğu için
          içerideki ölçüler 100cqh üzerinden bunun gerçek boyunu okur. */}
      <div className="min-h-0 flex-1 [container-type:size]">
        <div className="flex h-full items-center justify-center px-4 py-2" style={stageVars}>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:gap-4">
            {/* Turnuvadaki tur başlığının yerinde, aynı tipografi: oyun
                içindeki tek "bölüm etiketi" o dili konuşsun. */}
            <p className="text-xs font-bold uppercase tracking-widest text-faded">
              Kalan {remaining} seçim
            </p>

            {/* key her tarafta AYRI: yalnızca değişen yuva remount olur, o
                taraf animate-rise ile girer. Sahnede kalan kartın DOM'u
                korunduğu için hiç oynamaz — "kalıcı olan" ile "yeni gelen"
                farkı hareketin kendisinden okunur.
                rise sarmalayıcıda, swell kartta: ikisi de animation yazdığı
                için aynı elemanda çakışırlardı.
                Geçiş sürerken tıklama kilitlenir — ikinci tık hook'ta da
                yutulur, buradaki kilit niyeti görünür kılar. */}
            <div
              className={`flex w-full items-center justify-center gap-3 sm:gap-5 ${
                advancing ? 'pointer-events-none' : ''
              }`}
            >
              {/* Sarmalayıcı BracketPlay'de kartın kendisinin taşıdığı ölçüyü
                  taşır (w-full + max-w): flex-1 verilseydi kartlar kendi
                  yarılarının ortasına kaçar, VS'in iki yanındaki boşluk
                  turnuvadakinden geniş açılırdı. */}
              <div
                key={left.itemId}
                className="flex w-full min-w-0 max-w-[var(--duel-side)] animate-rise"
              >
                <Side item={left} state={sideState('A')} onPick={() => pick('A')} />
              </div>
              {/* Nötr metal: ayraç bir yapı öğesi, sinyal değil. */}
              <span
                aria-hidden="true"
                className="shrink-0 font-display text-sm font-extrabold uppercase tracking-widest text-ash sm:text-base"
              >
                VS
              </span>
              <div
                key={right.itemId}
                className="flex w-full min-w-0 max-w-[var(--duel-side)] animate-rise"
              >
                <Side item={right} state={sideState('B')} onPick={() => pick('B')} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {advancing
          ? `${winnerSide === 'A' ? left.name : right.name} kazandı.`
          : `Kalan ${remaining} seçim: ${left.name} mi, ${right.name} mi?`}
      </p>
    </div>
  )
}
