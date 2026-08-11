// Turnuva ağacının mini haritası: oyun alanının sağında duran, her turu bir
// sütun olarak gösteren şema. Amacı okunmak değil KONUM vermek — "kaçıncı
// turdayız, ne kadar kaldı". İsimler burada yok, isimler ortadaki eşleşmede.
//
// Maçlar kutu değil ÇUBUK: 32'lik bir ağaçta ilk sütunda 16 maç var, kutu
// olsaydı hiçbiri okunmazdı. Çubuk yalnızca üç şey söyler:
//   oynandı (iron) · sıradaki (ember) · henüz oynanmadı (line)
// Kor burada sinyal değil VERİ — banttaki ilerleme çubuğuyla aynı dil.
//
// Harita SIKI bir küme olarak durur, ekran boyunca yayılmaz: sütunlar aynı
// yüksekliği paylaşıp justify-around ile dağıldığı için üst turların çubukları
// kendiliğinden alt turdakilerin ortasına denk gelir — piramit görüntüsü çizgi
// çizmeden doğar. Yükseklik ilk sütunun maç sayısından türer; yayılsaydı
// çubuklar ağaç değil dağınık noktalar gibi okunurdu.

const SLOT_MAX = '1.5rem' // geniş ekranda / az maçta gereksiz seyrelmesin
const SLOT_MIN = '0.375rem' // kısa ekranda çubuklar üst üste binmesin
const AREA_PAD_REM = 2 // oyun alanının py-2'si + pay

/**
 * mirror: görünmez ikiz. Harita sahnenin sağında dururken sahne aksi hâlde
 * haritanın genişliği kadar sola kayıyordu; solda aynı bileşenin invisible
 * kopyası durunca eşleşme gerçekten ekranın ortasında kalır. Genişliği ayrı
 * bir sabitten hesaplamak yerine ikizi çizmek iki tarafın ölçüsünün zamanla
 * ayrışmasını imkânsız kılar.
 */
export default function BracketMap({ rounds, size, roundIndex, matchIndex, mirror = false }) {
  if (size < 2) return null

  // Sütun başına maç sayısı: 8'lik ağaçta [4, 2, 1].
  const columns = []
  for (let n = size; n >= 2; n /= 2) columns.push(n / 2)

  const first = columns[0]
  const style = {
    '--bracket-slot': `clamp(${SLOT_MIN}, (100cqh - ${AREA_PAD_REM}rem) / ${first}, ${SLOT_MAX})`,
  }

  return (
    // aria-hidden: aynı bilgi bandın sayacında ve sr-only duyuruda zaten var,
    // ekran okuyucuya ikinci kez okutulmaz.
    <div
      aria-hidden="true"
      className={`hidden shrink-0 gap-1.5 lg:flex ${mirror ? 'invisible' : ''}`}
      style={{ ...style, height: `calc(var(--bracket-slot) * ${first})` }}
    >
      {columns.map((matches, r) => (
        <div key={r} className="flex flex-col justify-around">
          {Array.from({ length: matches }, (_, m) => {
            const played = Boolean(rounds[r + 1]?.[m])
            const active = r === roundIndex && m === matchIndex
            const tone = active ? 'bg-ember' : played ? 'bg-iron' : 'bg-line/60'
            return (
              <span
                key={m}
                className={`h-[min(0.5rem,calc(var(--bracket-slot)*0.45))] w-5 rounded-sm ${tone}`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
