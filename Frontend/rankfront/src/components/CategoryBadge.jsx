export default function CategoryBadge({ name }) {
  return (
    <span className="inline-block rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-300 ring-1 ring-orange-500/30">
      {name}
    </span>
  )
}
