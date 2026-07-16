import { useDuel } from '../hooks/useDuel'

// Hero'nun imza elementi: ziyaretçi scroll etmeden, kayıt olmadan oy verir.
// Veriyi SADECE useDuel'den alır — fetch/mock/localStorage'dan haberi yok.

// Baş harf placeholder'ı: görsel için dış servise gidilmiyor.
// Türkçe locale şart: 'İskender' baş harfi 'I' değil 'İ'.
function initialOf(name) {
  return name.trim().charAt(0).toLocaleUpperCase('tr-TR')
}

// Rakip kartı. Ton veriden değil A/B pozisyonundan türer: A parlak kor,
// B sönük köz — bar'daki eşlemenin aynısı, bu yüzden legend gerekmiyor.
function DuelSide({ item, side, voted, hasVoted, onVote }) {
  const tint = side === 'A' ? 'bg-ember/15 text-ember' : 'bg-ember-deep/30 text-ember-deep'
  const lost = hasVoted && !voted

  return (
    <button
      type="button"
      // disabled değil aria-disabled: disabled buton tab sırasından çıkar, klaviyeyle
      // oy veren kullanıcının odağı oy anında boşluğa düşerdi. İkinci oyu useDuel
      // zaten yutuyor, buradaki guard sadece niyeti açık etmek için.
      aria-disabled={hasVoted}
      onClick={hasVoted ? undefined : onVote}
      aria-label={`${item.name} için oy ver`}
      className={`duel-side p-3 sm:p-4 ${voted ? 'duel-side-won' : ''} ${lost ? 'opacity-60' : ''} ${
        hasVoted ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" className="mb-3 aspect-[4/3] w-full rounded-md object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className={`mb-3 flex aspect-[4/3] w-full items-center justify-center rounded-md font-display text-4xl font-extrabold sm:text-5xl ${tint}`}
        >
          {initialOf(item.name)}
        </span>
      )}
      <span className="block font-display text-sm font-bold leading-snug text-cream sm:text-base">
        {item.name}
      </span>
    </button>
  )
}

export default function DuelWidget() {
  const { duel, totalVotes, percentA, percentB, hasVoted, votedSide, vote, next, hasNext, error } =
    useDuel()

  // Yükleme/hata: States.jsx'teki Loading burada kullanılmıyor — spinner ikinci bir
  // animasyon olurdu. Sessiz iskelet, kart yüksekliğini tutup zıplamayı önlüyor.
  if (!duel) {
    return (
      <div className="duel-card p-5 sm:p-6" aria-busy={!error}>
        {error ? (
          <p className="text-sm font-semibold text-danger">{error}</p>
        ) : (
          <div aria-hidden="true" className="space-y-3">
            <div className="h-3 w-40 rounded bg-coal-light" />
            <div className="h-5 w-52 rounded bg-coal-light" />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="aspect-[4/3] rounded-md bg-coal-light" />
              <div className="aspect-[4/3] rounded-md bg-coal-light" />
            </div>
            <div className="h-2.5 rounded-[4px] bg-coal-light" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="duel-card p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-faded">{duel.title}</p>
      {/* Sayaç aria-live DEĞİL: sahte realtime 3-8sn'de bir artırıyor, ekran
          okuyucuyu sürekli konuşturur. Duyuru sadece kullanıcının kendi oyunda. */}
      <p className="mt-1 font-display text-lg font-extrabold text-cream">
        Bu düelloda <span className="tabular-nums text-ember">{totalVotes.toLocaleString('tr-TR')}</span> oy
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <DuelSide
          item={duel.itemA}
          side="A"
          voted={votedSide === 'A'}
          hasVoted={hasVoted}
          onVote={() => vote('A')}
        />
        <DuelSide
          item={duel.itemB}
          side="B"
          voted={votedSide === 'B'}
          hasVoted={hasVoted}
          onVote={() => vote('B')}
        />
      </div>

      {/* Tek orkestre an: oran barı. Sahte realtime de aynı geçişi kullanır.
          Bilgi yüzde yazılarında da var — reduced-motion'da bar zıplasa bile kayıp yok. */}
      <div aria-hidden="true" className="mt-4 flex h-2.5 overflow-hidden rounded-[4px] bg-night-deep">
        <div
          className="bg-ember transition-[width] duration-[400ms] ease-out"
          style={{ width: `${percentA}%` }}
        />
        <div
          className="bg-ember-deep transition-[width] duration-[400ms] ease-out"
          style={{ width: `${percentB}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs font-bold tabular-nums text-cream">
        <span>%{percentA}</span>
        <span>%{percentB}</span>
      </div>

      {error && <p className="mt-3 text-xs font-semibold text-danger">{error}</p>}

      {hasVoted && hasNext && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={next}
            className="text-sm font-semibold text-ember-soft transition hover:underline focus-visible:outline-ember"
          >
            Sıradaki düello →
          </button>
        </div>
      )}

      {/* Yüzde yok: sahte realtime her oynadığında yeniden okunmasın diye statik */}
      <p aria-live="polite" className="sr-only">
        {hasVoted ? `Oyun kaydedildi: ${votedSide === 'A' ? duel.itemA.name : duel.itemB.name}.` : ''}
      </p>
    </div>
  )
}
