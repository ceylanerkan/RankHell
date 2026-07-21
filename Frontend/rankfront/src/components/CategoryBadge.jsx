// tone="night": görsel/koyu zemin üstünde bakır detay; varsayılan nötr kül pill
export default function CategoryBadge({ name, tone }) {
  const toneClass = tone === 'night' ? 'bg-night text-copper-soft' : 'bg-ash/15 text-ash'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneClass}`}>
      {name}
    </span>
  )
}
