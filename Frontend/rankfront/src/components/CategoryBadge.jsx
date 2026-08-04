// tone="night": görsel/koyu zemin üstünde bakır detay
// tone="brass": seçki / ödül sinyali (ör. "Editörün Seçimi") — sayfa başına tek
// varsayılan: nötr kül pill
const TONE_CLASS = {
  night: 'bg-night text-copper-soft',
  brass: 'bg-brass-deep/25 text-brass-soft',
}

export default function CategoryBadge({ name, tone }) {
  const toneClass = TONE_CLASS[tone] ?? 'bg-ash/15 text-ash'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneClass}`}>
      {name}
    </span>
  )
}
