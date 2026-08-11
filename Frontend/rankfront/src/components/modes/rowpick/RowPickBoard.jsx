/**
 * Oyun ekranı: bant + satırlar + Tamamla.
 * ----------------------------------------------------------------
 * Kör Sıralama (BlindPlay) ile aynı format: oynarken site navbar'ı gizlenir
 * (useHiddenNav) ve yerini PlayBand alır — solda çıkış, ortada oyunun adı,
 * sağda tam ekran, alt kenarda ilerleme çubuğu. Oyun fazında sayfa künyesi
 * (başlık/açıklama) çizilmez; kimlik bandın işi.
 *
 * Banda `caption` geçilir: bu oyun tur tur ilerlemediği için "mod · kaçıncı tur"
 * satırı yerine kaç satırın kapandığı yazar.
 *
 * Damga v1: bu fazın tek `primary` butonu Tamamla. Her satır dolana kadar
 * disabled — eksik tahtayla sonuç ekranı açılmaz (aynı kontrol hook'ta da var).
 */

import PlayBand from '../../poll/play/PlayBand'
import Button from '../../ui/button/Button'
import RowPickRow from './RowPickRow'
import { useHiddenNav } from '../../../lib/chrome'

// Tahta TEK EKRANA SIĞAR (BlindPlay'in yuva sütunuyla aynı disiplin): kare
// boyutu sabit değil, oyun alanına kalan yükseklikten türer. Aksi hâlde
// "Tamamla" katlanmanın altında kalıyor, oyuncu üç satırı ve aksiyonu aynı
// anda göremiyordu.
//
// Ölçü sabit bir band yüksekliğine DAYANMAZ: oyun alanı bir size container,
// genişlik doğrudan 100cqh üzerinden hesaplanır. Kareler 3:2 olduğu için
// satır yüksekliği ≈ (sütun − iç boşluk)/1.5 + isim satırı; üç satır + aralık +
// alt aksiyon şeridi toplandığında genişlik ≈ (kalan yükseklik − RESERVE)/2 × 3.
const BOARD_MAX = '56rem' // max-w-4xl: geniş ekranda gereksiz büyümesin
const BOARD_RESERVE = '19rem' // isim satırları + satır araları + aksiyon şeridi

export default function RowPickBoard({
  title,
  rows,
  picks,
  picked,
  total,
  canComplete,
  onPick,
  onComplete,
  onQuit,
}) {
  useHiddenNav()

  return (
    // BlindPlay'deki kutu: -2rem main'in alt py-8'i (üst py-8'i bandın -mt-8'i
    // zaten yutuyor). Oyun alanı ekranın altına dayanır, sayfa yine kaydırılabilir.
    // Yükseklik KESİN olmalı (min-h değil): oyun alanı bir size container ve
    // içeriğini ölçmez — belirsiz yükseklikte 100cqh sıfıra düşerdi.
    <div className="flex h-[calc(100dvh-2rem)] flex-col">
      <PlayBand
        title={title}
        caption={`Her sıradan bir tane · ${picked} / ${total}`}
        progress={total ? Math.round((picked / total) * 100) : 0}
        onQuit={onQuit}
      />

      {/* Oyun alanı: banttan artan yükseklik. size container olduğu için
          içerideki ölçü 100cqh ile bunun gerçek boyunu okur. BlindPlay'le aynı:
          alanın KENDİ kaydırıcısı yok — taşarsa sayfanın kaydırıcısı çalışır,
          ekranda iki ayrı çubuk görünmez. */}
      <div className="flex min-h-0 flex-1 flex-col [container-type:size]">
        {/* m-auto (align-items değil): boş yer varken ızgara dikeyde ortalanır,
            taşarsa üstü kırpılmaz. */}
        {/* Genişlik yükseklikten türer, max-w-full onu ekranla sınırlar: dar
            ekranda hesap viewport'u aşsa bile yatay taşma olmaz, ızgara iki
            sütuna düşüp dikeyde kaydırılır. */}
        <div
          className="m-auto w-full max-w-full py-6"
          style={{
            width: `min(${BOARD_MAX}, ((100cqh - ${BOARD_RESERVE}) / 2) * 3 + 1.5rem)`,
          }}
        >
          <div className="flex flex-col gap-6">
            {rows.map((row) => (
              <RowPickRow key={row.rowId} row={row} pickedId={picks[row.rowId]} onPick={onPick} />
            ))}
          </div>

          {/* Şeritte yalnızca aksiyon var: sayaç bandın alt satırında ve
              ilerleme çubuğunda zaten yazıyor, burada tekrarı gürültüydü. */}
          <div className="mt-8 flex justify-center border-t border-line/60 pt-5">
            <Button variant="primary" onClick={onComplete} disabled={!canComplete}>
              Tamamla
            </Button>
          </div>

          {/* Sayaç görsel olarak kalkınca duyuru da kalkmasın: seçim ekran
              okuyucuya burada bildirilir (BlindPlay'deki sr-only deseni). */}
          <p aria-live="polite" className="sr-only">
            {total} satırdan {picked} tanesi seçildi
          </p>
        </div>
      </div>
    </div>
  )
}
