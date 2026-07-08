import { useState } from 'react'

// value: gösterilecek puan (0-5, ondalıklı olabilir)
// onRate verilirse yıldızlar tıklanabilir olur (oylama modu)
export default function StarRating({ value = 0, onRate, size = 'text-2xl' }) {
  const [hovered, setHovered] = useState(0)
  const shown = hovered || Math.round(value)

  return (
    <div className="inline-flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onRate}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => onRate && setHovered(star)}
          className={`${size} leading-none transition-transform ${
            onRate ? 'cursor-pointer hover:scale-125' : 'cursor-default'
          } ${star <= shown ? 'text-amber-400' : 'text-slate-600'}`}
          aria-label={`${star} yıldız`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
