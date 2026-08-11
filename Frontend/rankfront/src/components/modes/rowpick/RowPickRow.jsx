/**
 * Tahtanın bir satırı: etiket + seçenek ızgarası.
 * ----------------------------------------------------------------
 * Satır başına tek seçim kuralı burada değil hook'ta yaşıyor (useRowPickGame);
 * bu bileşen yalnızca hangi karenin seçili olduğunu çizer.
 *
 * Izgara HER BOYUTTA 3 sütun: satır başına 3 seçenek var ve modun anlamı "bir
 * satır = bir sıra". Dar ekranda 2'ye düşseydi satır ikiye bölünür, hangi
 * seçeneklerin aynı satıra ait olduğu okunamazdı; kareler küçülür ama bölünmez.
 *
 * Satır ETİKETİ YAZILMAZ: kareler zaten hamburger/pizza/tavuk logoları, üstüne
 * "HAMBURGER" yazmak görselin söylediğini tekrar etmek olurdu. Etiket veride
 * duruyor ve ekran okuyucuya grup adı olarak veriliyor — görsel olarak değil.
 */

import RowPickOption from './RowPickOption'

export default function RowPickRow({ row, pickedId, onPick }) {
  return (
    <section role="group" aria-label={row.label}>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {row.options.map((option) => (
          <RowPickOption
            key={option.optionId}
            option={option}
            selected={pickedId === option.optionId}
            onSelect={() => onPick(row.rowId, option.optionId)}
          />
        ))}
      </div>
    </section>
  )
}
