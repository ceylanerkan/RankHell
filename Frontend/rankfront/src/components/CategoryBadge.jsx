export default function CategoryBadge({ name }) {
  return (
    <span className="inline-block rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 ring-1 ring-red-500/30">
      {name}
    </span>
  )
}
