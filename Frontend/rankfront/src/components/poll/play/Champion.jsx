// Şampiyon sahnesi: tek kazananı olan modların (turnuva ağacı, "O mu, Bu mu?")
// sonuç ekranlarının ortak ödül anı. İki ekran aynı görüntüyü paylaşsın diye
// buraya alındı — kopyalansaydı iki şampiyonun dili zamanla ayrışırdı.
//
// SAHNEDİR, Card'a sarılmaz (docs/design/exceptions.md §7c): bir içerik satırı
// değil, ekranın ödül anı. Tıklanabilir DEĞİL — pirinç burada "tıklanabilir öğe
// rengi" değil sonuç/ödül sinyalidir.

export default function Champion({ item }) {
  return (
    <div className="mx-auto mb-10 w-full max-w-sm text-center">
      {/* mb-9: alev görselin üstüne taşar, etiketle çakışmaması için aradaki
          boşluk alevin boyuna göre açılır. */}
      <p className="mb-9 text-xs font-bold uppercase tracking-widest text-brass-soft">Şampiyon</p>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute -top-7 left-1/2 -translate-x-1/2 animate-flame-dance text-3xl"
        >
          🔥
        </span>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="aspect-[3/2] w-full rounded-lg border-2 border-brass object-cover object-center"
          />
        ) : (
          <div
            className="flex aspect-[3/2] w-full items-center justify-center rounded-lg border-2 border-brass bg-night-deep text-sm text-faded"
            role="img"
            aria-label={`${item.name} görseli yok`}
          >
            Görsel yok
          </div>
        )}
      </div>
      {/* İsim plaketi: kör sıralamanın sahne plaketiyle aynı yapı, kenarı
          pirinç — tek fark ödül sinyali. */}
      <p className="mt-4 truncate rounded-md border border-brass-deep bg-coal-light px-5 py-2 font-display text-xl font-extrabold text-cream sm:text-2xl">
        {item.name}
      </p>
    </div>
  )
}
