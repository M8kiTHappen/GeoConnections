/**
 * A single clickable tile — styled as a weathered map label.
 */
export default function Tile({ tile, selected, shaking, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center justify-center rounded-sm text-center text-sm sm:text-base',
        'w-full aspect-square sm:aspect-auto sm:h-20 px-2 py-3',
        'transition-all duration-150 select-none tile-shadow',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink/50',
        selected
          ? 'bg-ink text-parchment scale-95'
          : 'bg-parchment-tile text-ink hover:bg-parchment-hover active:scale-95',
        shaking && selected ? 'animate-shake' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, letterSpacing: '0.03em' }}
      aria-pressed={selected}
    >
      <span className="leading-tight">{tile.label}</span>
    </button>
  )
}
