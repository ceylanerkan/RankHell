/**
 * Satırdaki tek seçenek karesi.
 * ----------------------------------------------------------------
 * Sözleşme: KARENİN İÇİNDE GÖRSEL VE İSİMDEN BAŞKA HİÇBİR ŞEY YOK.
 * Açıklama, puan, oy sayısı eklenmez — modun kimliği "bak ve seç".
 *
 * Kart sistemi:
 *   - raised + selectable: seçili durumu Card'ın kendi `is-selected`'i çizer
 *     (kenar korlaşır, sol marker açılır). Buraya seçim rengi yazılmaz.
 *   - `rh-card-pick`: card.css'te tanımlı seçim kutucuğu; seçiliyken kor dolar.
 *   - Görsel yuvası radius 4px (kart 8px − 4) ve `object-contain`: bunlar logo,
 *     kırpılırsa marka tanınmaz. Zemin night-deep, logolar parlak renkli
 *     olduğu için koyu zeminde okunur (public/fastfood/CREDITS.md).
 *   - Kart başına tek kor: içeride başka ember yok.
 *
 * Görsel gelmezse PersonaPhoto'daki desen: onError → markanın baş harfi.
 *
 * Erişilebilirlik: rol yazılmaz. Card zaten `aria-pressed` taşıyan bir buton
 * üretiyor ve seçim geri alınabildiği için doğru semantik bu — üstüne
 * role="radio" yazmak aria-pressed ile çelişirdi.
 */

import { useEffect, useState } from 'react'
import Card from '../../ui/Card'

export default function RowPickOption({ option, selected, onSelect }) {
  const [failed, setFailed] = useState(false)

  // Aynı DOM düğümü başka bir seçeneğe düşebilir: bayrak sıfırlanmazsa yeni
  // markanın sağlam logosu da gizlenirdi.
  useEffect(() => {
    setFailed(false)
  }, [option.imageUrl])

  const showLogo = Boolean(option.imageUrl) && !failed

  return (
    <Card
      surface="raised"
      behavior="selectable"
      selected={selected}
      onClick={onSelect}
      padding="compact"
      // min-w-0: grid öğesinin varsayılan min-width:auto'su logonun kendi
      // genişliğini taban alıyor ve dar ekranda sütunu taşırıyordu.
      className="h-full min-w-0 text-left"
    >
      <div className="flex h-full flex-col">
        <div className="aspect-[3/2] w-full overflow-hidden rounded bg-night-deep p-3">
          {showLogo ? (
            <img
              src={option.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
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

        <div className="mt-2 flex items-center gap-2">
          <span className="rh-card-pick" aria-hidden="true" />
          <span className="min-w-0 truncate text-sm font-bold text-cream">{option.name}</span>
        </div>
      </div>
    </Card>
  )
}
