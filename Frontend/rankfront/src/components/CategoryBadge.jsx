// tone="night": görsel/koyu zemin üstünde ateş tonlu pill; varsayılan plazma pill
export default function CategoryBadge({ name, tone }) {
  const toneClass = tone === 'night' ? 'bg-night text-ember-soft' : 'bg-plasma/15 text-plasma-soft'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneClass}`}>
      {name}
    </span>
  )
}
