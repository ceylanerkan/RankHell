import { useEffect } from 'react'
import Card from '../../ui/Card'
import PlayBand from './PlayBand'
import BracketMap from './BracketMap'
import { useBracketGame } from '../../../hooks/useBracketGame'
import { roundLabel } from '../../../lib/bracket'
import { useHiddenNav } from '../../../lib/chrome'

// Turnuva Ağacı tur ekranı: ortada tek eşleşme (iki taraf + VS), sağda ağacın
// mini haritası. Oyuncu bir tarafı seçer, kazanan üst tura çıkar, tek şampiyon
// kalana kadar sürer. Tüm state useBracketGame'de; burada yalnızca sahne var.
//
// Bantta geri al/atla YOK (children geçilmiyor): atlanan bir eşleşme üst tura
// kimin çıkacağını boş bırakırdı — ağacın tamamı o karara bağlı.
//
// EŞLEŞME TARAFLARI KART SİSTEMİNDEN GEÇER (BlindPlay'in sahne istisnasına
// girmezler): burada görsel bir dekor değil, ekranın tek etkileşim hedefi —
// tıklanabilir olduğu için hover'daki sol ember marker doğru sinyaldir.
//
// Tur adı bantta değil BURADA: PlayBand bütün modların ortak şeridi, moda özel
// bir string için dosyası değiştirilmez.

// Sahne tek ekrana sığar: taraf genişliği sabit değil, oyun alanına kalan
// yükseklikten türer (BlindPlay'deki yaklaşımın aynısı). 3:2 görsel + isim
// şeridi ekranı taşırmaz, 8'lik de 32'lik de ağaç aynı düzeni korur.
const SIDE_MAX = '560px'
const SIDE_RESERVE = '7.5rem' // tur başlığı + isim şeridi + aralarındaki boşluk
const AREA_PAD_REM = 1 // oyun alanının py-2'si (üst+alt)

const stageVars = {
  '--bracket-side': `min(${SIDE_MAX}, (100cqh - ${AREA_PAD_REM}rem - ${SIDE_RESERVE}) * 1.5)`,
}

// Bir eşleşme tarafı. state: 'idle' seçim bekliyor · 'won' bu tur seçildi ·
// 'lost' elendi. Kazananda BRASS YOK: taraf tıklanabilir bir öğe ve pirinç
// tıklanabilir öğede kullanılmaz — ödül dili yalnızca sonuç ekranında konuşur.
// Kazanma sinyali animate-swell (kart hafifçe kabarıp yerine döner), kaybetme
// sinyali sönme. Burada animate-pop KULLANILMAZ: podyum rozeti için yazılmış
// yay, 536px'lik bir kartta önce yarı boyuna çöküp hedefin üstüne sıçradığı
// için zıplama gibi okunuyordu.
function Side({ item, state, onPick }) {
  return (
    <Card
      surface="raised"
      behavior="interactive"
      padding="none"
      onClick={onPick}
      aria-label={`${item.name} kazansın`}
      className={`flex w-full min-w-0 max-w-[var(--bracket-side)] flex-col transition-opacity duration-300 ${
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
      {/* İsim şeridi görselin altına biner (DuelWidget'ın rakip kartıyla aynı
          dil): sabit min yükseklik iki tarafın isim hizasını korur, uzun ad
          kartı diğerinden büyütmez. mt-auto şeridi her hâlükârda dibe basar. */}
      <span className="mt-auto flex min-h-[3.25rem] items-center justify-center bg-night-deep/85 px-3 py-2.5 text-center font-display text-[15px] font-bold leading-snug text-cream sm:text-[17px]">
        <span className="min-w-0 truncate">{item.name}</span>
      </span>
    </Card>
  )
}

export default function BracketPlay({ poll, roundCount, onFinish, onQuit }) {
  const {
    rounds,
    size,
    roundIndex,
    matchIndex,
    roundSize,
    matchesInRound,
    matchOrdinal,
    totalMatches,
    matchA,
    matchB,
    winnerSide,
    progress,
    status,
    results,
    pick,
  } = useBracketGame({ items: poll.items, roundCount })

  useHiddenNav()

  // Final bitince sonucu sayfaya devret: sonuç ekranı bu bileşenin değil,
  // PollPlay'in fazı. scored:false — turnuvada puan yok, eleme sırası var.
  useEffect(() => {
    if (status === 'done') onFinish({ results, scored: false })
  }, [status, results, onFinish])

  if (!matchA || !matchB) return null

  const advancing = status === 'advancing'
  const label = roundLabel(roundSize)
  const sideState = (side) => (advancing ? (winnerSide === side ? 'won' : 'lost') : 'idle')

  return (
    // Oyun ekranı görünür alanı doldurur: -2rem, main'in alt py-8'i (üst py-8'i
    // bandın -mt-8'i zaten yutuyor).
    <div className="flex h-[calc(100dvh-2rem)] flex-col">
      <PlayBand
        title={poll.title}
        modeKey="bracket"
        index={matchOrdinal}
        total={totalMatches}
        progress={progress}
        onQuit={onQuit}
      />

      {/* Oyun alanı: banttan artan yükseklik. size container olduğu için
          içerideki ölçüler 100cqh üzerinden bunun gerçek boyunu okur. */}
      <div className="min-h-0 flex-1 [container-type:size]">
        <div
          className="flex h-full items-center justify-center gap-4 px-4 py-2 lg:gap-10"
          style={stageVars}
        >
          {/* Haritanın görünmez ikizi: sahneyi gerçekten ekranın ortasında
              tutar (yoksa eşleşme harita kadar sola kayıyordu). */}
          <BracketMap
            mirror
            rounds={rounds}
            size={size}
            roundIndex={roundIndex}
            matchIndex={matchIndex}
          />

          <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:gap-4">
            {/* Tur başlığı: kurulum ekranındaki SectionTitle ile aynı tipografi
                — oyun içindeki tek "bölüm etiketi" o dili konuşsun. */}
            <p className="text-xs font-bold uppercase tracking-widest text-faded">
              {label} · {matchIndex + 1}/{matchesInRound}
            </p>

            {/* key: her eşleşmede sahne yeniden mount olur, animate-rise baştan
                oynar. Geçiş sürerken tıklama kilitlenir — ikinci tık hook'ta da
                yutulur, buradaki kilit niyeti görünür kılar. */}
            <div
              key={`${roundIndex}-${matchIndex}`}
              className={`flex w-full animate-rise items-center justify-center gap-3 sm:gap-5 ${
                advancing ? 'pointer-events-none' : ''
              }`}
            >
              <Side
                item={matchA}
                side="A"
                state={sideState('A')}
                onPick={() => pick('A')}
              />
              {/* Nötr metal: ayraç bir yapı öğesi, sinyal değil. */}
              <span
                aria-hidden="true"
                className="shrink-0 font-display text-sm font-extrabold uppercase tracking-widest text-ash sm:text-base"
              >
                VS
              </span>
              <Side
                item={matchB}
                side="B"
                state={sideState('B')}
                onPick={() => pick('B')}
              />
            </div>
          </div>

          <BracketMap
            rounds={rounds}
            size={size}
            roundIndex={roundIndex}
            matchIndex={matchIndex}
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {advancing
          ? `${winnerSide === 'A' ? matchA.name : matchB.name} kazandı.`
          : `${label}, ${matchIndex + 1} / ${matchesInRound}: ${matchA.name} mi, ${matchB.name} mi?`}
      </p>
    </div>
  )
}
