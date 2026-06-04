/**
 * A single clickable tile — styled as a weathered map label.
 */
export default function Tile({ tile, selected, shaking, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center justify-center rounded-sm text-center text-xs sm:text-sm',
        'w-full min-h-[4rem] sm:h-20 px-1.5 py-2',
        'transition-all duration-150 select-none tile-shadow',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink/50',
        selected
          ? 'bg-ink text-parchment scale-95'
          : 'bg-parchment-tile text-ink hover:bg-parchment-hover active:scale-95',
        shaking && selected ? 'animate-shake' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, letterSpacing: '0.01em' }}
      aria-pressed={selected}
    >
      <span className="leading-tight break-words w-full">{tile.label}</span>
    </button>
  )
}
