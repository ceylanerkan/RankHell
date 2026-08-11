/**
 * "Her Sıradan Bir Tanesini Seç" sonuç sahnesi.
 * ----------------------------------------------------------------
 * Modun ORTAK sonuç ekranı: bu oyuna değil moda aittir. Satır sayısından
 * bağımsız çalışır (3 satırlık fastfood da, 6 satırlık kahvaltı masası da aynı
 * sahneyi kullanır) — seçimler yan yana dizilir, sarılmadan taşar.
 *
 * Sahnedir, Card'a sarılmaz (docs/design/exceptions.md §7d — Champion §7c ile
 * aynı gerekçe): sonuç ekranının ödül anı, içerik kartı değil. Brass burada
 * "tıklanabilir öğe rengi" değil sonuç/ödül sinyali; öğeler zaten tıklanabilir
 * değil.
 *
 * Şampiyon sahnesinden farkı: burada TEK kazanan yok. Seçimler birbirinin
 * rakibi değil, aynı menünün parçaları — bu yüzden 1-2-3 hiyerarşisi (PodiumSpot
 * sütunları, 🔥 alevi, sıra numarası) kullanılmaz, hepsi eşit ölçüdedir.
 */

import Button from '../../ui/button/Button'

export default function RowPickPodium({ results, onReplay, children }) {
  return (
    <div className="mt-8">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-brass-soft">
        Senin seçimin
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {results.map(({ row, option }) => (
          <div key={row.rowId} className="w-40 animate-pop text-center sm:w-48">
            {/* Satır etiketi burada da yazılmaz (tahtadaki kararla aynı):
                logo hangi satırdan geldiğini zaten söylüyor. */}
            <div className="aspect-[3/2] w-full rounded-lg border-2 border-brass bg-night-deep p-3">
              {option.imageUrl ? (
                <img
                  src={option.imageUrl}
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-full w-full items-center justify-center font-display text-3xl font-extrabold text-copper-soft"
                >
                  {option.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {/* İsim plaketi: Champion'ın plaketiyle aynı yapı, yan yana üç
                sütuna sığsın diye küçültülmüş ölçüde. */}
            <p className="mt-3 truncate rounded-md border border-brass-deep bg-coal-light px-3 py-2 font-display text-base font-extrabold text-cream">
              {option.name}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" onClick={onReplay}>
          Tekrar oyna
        </Button>
        {children}
      </div>
    </div>
  )
}
