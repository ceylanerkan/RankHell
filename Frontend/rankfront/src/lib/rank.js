// Sıralama rozeti renkleri tek yerde yaşar: ilk üç sıra pirinç ailesinin
// açık / ana / koyu derecelerini alır, gerisi nötr metal kalır. ItemCard ve
// oyun sonucu listesi aynı merdiveni okur — ikinci bir eşleme türemesin.
export function rankBadgeClass(rank) {
  if (rank === 1) return 'bg-brass-soft text-night shadow-[0_0_12px_rgba(185,145,63,0.25)]'
  if (rank === 2) return 'bg-brass text-night'
  if (rank === 3) return 'bg-brass-deep text-cream'
  return 'bg-night-deep text-ash'
}
