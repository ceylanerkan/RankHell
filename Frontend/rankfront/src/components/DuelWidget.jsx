import { useDuel } from '../hooks/useDuel'

// Hero'nun imza elementi: ziyaretçi scroll etmeden, kayıt olmadan oy verir.
// Veriyi SADECE useDuel'den alır — fetch/mock/localStorage'dan haberi yok.

// Baş harf placeholder'ı: görsel için dış servise gidilmiyor.
// Türkçe locale şart: 'İskender' baş harfi 'I' değil 'İ'.
function initialOf(name) {
  return name.trim().charAt(0).toLocaleUpperCase('tr-TR')
}

// Rakip kartı. Görsel kartı kenardan kenara doldurur, isim altındaki koyu şeride
// biner: prominence oranı zorlayarak değil, çerçeveyi kaldırarak geliyor.
// aspect-[3/2]: kaynak görsellerin yarısı (tüm yemekler) zaten tam 3:2 — hiç
// kırpılmıyorlar; kalan yatay görseller için de en az agresif gerçekçi kadraj.
// Ton veriden değil A/B pozisyonundan türer: A parlak kor, B sönük köz —
// bar'daki eşlemenin aynısı, bu yüzden legend gerekmiyor.
function DuelSide({ item, side, percent, voted, hasVoted, onVote }) {
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
      className={`duel-side ${voted ? 'duel-side-won' : ''} ${lost ? 'opacity-60' : ''} ${
        hasVoted ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" className="aspect-[3/2] w-full object-cover object-center" />
      ) : (
        <span
          aria-hidden="true"
          className={`flex aspect-[3/2] w-full items-center justify-center font-display text-4xl font-extrabold sm:text-5xl ${tint}`}
        >
          {initialOf(item.name)}
        </span>
      )}
      {/* İsim + sonuç tek şeritte: oydan sonra kazananın yüzdesi iri ve kor,
          kaybedeninki küçük ve sönük — hiyerarşi rakamın kütlesinden geliyor.
          Sabit yükseklik (min-h) şart: yoksa kazananın iri yüzdesi şeridi
          uzatır, grid iki kartı eşitlerken kaybedenin görseli aşağı kayar ve
          isim hizası bozulur. mt-auto şeridi her hâlükârda dibe sabitler. */}
      <span className="mt-auto flex min-h-[3.25rem] items-center justify-between gap-2 bg-night-deep/85 px-3 py-2.5">
        <span className="min-w-0 truncate font-display text-[15px] font-bold leading-snug text-cream sm:text-[17px]">
          {item.name}
        </span>
        {hasVoted && (
          <span
            className={`shrink-0 font-display font-extrabold tabular-nums ${
              voted ? 'text-2xl text-ember' : 'text-sm text-faded'
            }`}
          >
            %{percent}
          </span>
        )}
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
      <div className="duel-card p-4 sm:p-5" aria-busy={!error}>
        {error ? (
          <p className="text-sm font-semibold text-danger">{error}</p>
        ) : (
          <div aria-hidden="true" className="space-y-3">
            <div className="h-3 w-40 rounded bg-coal-light" />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="aspect-[3/2] rounded-md bg-coal-light" />
              <div className="aspect-[3/2] rounded-md bg-coal-light" />
            </div>
            <div className="h-1.5 rounded-full bg-coal-light" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="duel-card overflow-hidden">
      {/* p-4/p-5: dar padding görsellere daha çok alan bırakır — widget'ın
          kütlesi çerçevede değil içerikte. */}
      <div className="p-4 sm:p-5">
        {/* Sayaç aria-live DEĞİL: sahte realtime 3-8sn'de bir artırıyor, ekran
            okuyucuyu sürekli konuşturur. Duyuru sadece kullanıcının kendi oyunda. */}
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <p className="font-display text-base font-extrabold text-cream sm:text-lg">{duel.title}</p>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-faded">
            {totalVotes.toLocaleString('tr-TR')} oy
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DuelSide
            item={duel.itemA}
            side="A"
            percent={percentA}
            voted={votedSide === 'A'}
            hasVoted={hasVoted}
            onVote={() => vote('A')}
          />
          <DuelSide
            item={duel.itemB}
            side="B"
            percent={percentB}
            voted={votedSide === 'B'}
            hasVoted={hasVoted}
            onVote={() => vote('B')}
          />
        </div>

        {/* Tek orkestre an: oran barı. Sahte realtime de aynı geçişi kullanır.
            Bilgi kartlardaki yüzdelerde de var — reduced-motion'da bar zıplasa bile kayıp yok. */}
        <div aria-hidden="true" className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-night-deep">
          <div
            className="bg-ember transition-[width] duration-[400ms] ease-out"
            style={{ width: `${percentA}%` }}
          />
          <div
            className="bg-ember-deep transition-[width] duration-[400ms] ease-out"
            style={{ width: `${percentB}%` }}
          />
        </div>

        {error && <p className="mt-3 text-xs font-semibold text-danger">{error}</p>}
      </div>

      {/* Oy vermeden de geçilebilir: ilgilenmediği eşleşmede sıkışan ziyaretçi
          hero'nun tek etkileşimli anını terk ediyordu. next() sadece index'i
          döngüsel ilerletir — atlanan düello oylanmamış kalır, oy durumu bozulmaz. */}
      {hasNext && (
        <button
          type="button"
          onClick={next}
          className="duel-next group flex w-full items-center justify-center gap-1.5 border-t border-line/60 px-5 py-3 text-sm font-semibold"
        >
          {hasVoted ? 'Sıradaki düello' : 'Atla'}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </button>
      )}

      {/* Yüzde yok: sahte realtime her oynadığında yeniden okunmasın diye statik */}
      <p aria-live="polite" className="sr-only">
        {hasVoted ? `Oyun kaydedildi: ${votedSide === 'A' ? duel.itemA.name : duel.itemB.name}.` : ''}
      </p>
    </div>
  )
}
