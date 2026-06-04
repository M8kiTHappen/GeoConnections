import Tile from './Tile'

/**
 * Color theme map — aged-map palette.
 * bg/text used in solved banners and ResultsScreen.
 */
const COLOR_THEME = {
  yellow: {
    bg:    'bg-map-ochre',
    text:  'text-map-ochre-text',
    label: 'Easiest',
  },
  green: {
    bg:    'bg-map-olive',
    text:  'text-map-olive-text',
    label: 'Medium',
  },
  blue: {
    bg:    'bg-map-sea',
    text:  'text-map-sea-text',
    label: 'Hard',
  },
  purple: {
    bg:    'bg-map-mauve',
    text:  'text-map-mauve-text',
    label: 'Hardest',
  },
}

/**
 * Solved category banner — slides in with aged-map colours.
 */
function SolvedBanner({ category }) {
  const theme = COLOR_THEME[category.color]
  return (
    <div
      className={`${theme.bg} ${theme.text} rounded-sm px-4 py-3 animate-slideDown`}
      style={{ boxShadow: '2px 2px 6px rgba(40,20,5,0.30)' }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest opacity-70"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        {category.color} · {theme.label}
      </p>
      <p
        className="font-bold text-sm sm:text-base leading-tight mt-0.5"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        {category.label}
      </p>
      <p className="text-xs sm:text-sm mt-1 opacity-80 italic">
        {category.tiles.join(' · ')}
      </p>
    </div>
  )
}

/**
 * Mistake dots styled as worn wax seals.
 */
function MistakeDots({ remaining, max }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-sm text-ink-light"
        style={{ fontFamily: 'IM Fell English, serif' }}
      >
        Mistakes remaining:
      </span>
      <div className="flex gap-2">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`inline-block w-4 h-4 rounded-full transition-all duration-500 ${
              i < remaining
                ? 'bg-ink scale-100 opacity-90'
                : 'bg-parchment-dark scale-75 opacity-40'
            }`}
            style={{ boxShadow: i < remaining ? '1px 1px 3px rgba(0,0,0,0.4)' : 'none' }}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Shared button base class — parchment-aged outline style.
 */
const outlineBtn =
  'px-5 py-2 rounded-sm border-2 border-ink/70 text-ink font-semibold text-sm ' +
  'hover:bg-ink/10 active:bg-ink/20 disabled:opacity-35 disabled:cursor-not-allowed ' +
  'transition-colors tracking-wide'

/**
 * The main interactive game board.
 */
export default function GameBoard({
  unsolvedTiles,
  solvedCategories,
  selected,
  mistakesLeft,
  maxMistakes,
  hint,
  shaking,
  gameStatus,
  hintUsed,
  onTileClick,
  onShuffle,
  onDeselect,
  onSubmit,
  onHint,
}) {
  const canSubmit  = selected.length === 4 && gameStatus === 'playing'
  const canDeselect = selected.length > 0  && gameStatus === 'playing'
  const canHint    = !hintUsed             && gameStatus === 'playing'

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Solved category banners */}
      {solvedCategories.map((cat) => (
        <SolvedBanner key={cat.color} category={cat} />
      ))}

      {/* Tile grid */}
      {unsolvedTiles.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {unsolvedTiles.map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              selected={selected.includes(tile.id)}
              shaking={shaking && selected.includes(tile.id)}
              onClick={() => onTileClick(tile.id)}
            />
          ))}
        </div>
      )}

      {/* Hint / feedback message */}
      <div className="h-6 flex items-center justify-center">
        {hint === 'one-away' && (
          <p
            className="text-sm font-semibold text-ink-light italic animate-pop"
            style={{ fontFamily: 'IM Fell English, serif' }}
          >
            One away…
          </p>
        )}
        {hint === 'already-guessed' && (
          <p
            className="text-sm text-ink-faded italic animate-pop"
            style={{ fontFamily: 'IM Fell English, serif' }}
          >
            Already guessed!
          </p>
        )}
      </div>

      {/* Mistake dots */}
      <div className="flex justify-center">
        <MistakeDots remaining={mistakesLeft} max={maxMistakes} />
      </div>

      {/* Action buttons */}
      <div
        className="flex items-center justify-center gap-3 flex-wrap"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        <button onClick={onShuffle} disabled={gameStatus !== 'playing'} className={outlineBtn}>
          Shuffle
        </button>

        <button onClick={onDeselect} disabled={!canDeselect} className={outlineBtn}>
          Deselect All
        </button>

        <button
          onClick={onHint}
          disabled={!canHint}
          title={hintUsed ? 'Hint already used' : 'Reveal two tiles from the same group'}
          className={
            outlineBtn +
            (hintUsed
              ? ' border-ink-faded text-ink-faded'
              : ' border-map-ochre text-map-ochre-text bg-map-ochre/10 hover:bg-map-ochre/25')
          }
        >
          {hintUsed ? 'Hint Used' : 'Hint'}
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="px-6 py-2 rounded-sm bg-ink text-parchment font-semibold text-sm tracking-wide
                     hover:bg-ink-light active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed
                     transition-all"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export { COLOR_THEME }
