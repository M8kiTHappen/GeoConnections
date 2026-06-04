/**
 * Displays a visual history of guesses as colored emoji-style squares.
 * Each row = one guess, each square = one tile's category color.
 */

const COLOR_EMOJI = {
  yellow: '🟨',
  green: '🟩',
  blue: '🟦',
  purple: '🟪',
}

const COLOR_BG = {
  yellow: 'bg-map-ochre',
  green:  'bg-map-olive',
  blue:   'bg-map-sea',
  purple: 'bg-map-mauve',
}

export default function GuessHistory({ guessHistory }) {
  if (!guessHistory || guessHistory.length === 0) return null

  return (
    <div className="flex flex-col items-center gap-1.5 mt-2">
      <p
        className="text-xs text-ink-faded uppercase tracking-wider mb-1"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        Guess History
      </p>
      {guessHistory.map((guess, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5">
          {guess.map((color, colIdx) => (
            <span
              key={colIdx}
              title={color}
              className={`${COLOR_BG[color]} w-5 h-5 rounded-sm block opacity-85`}
              style={{ boxShadow: '1px 1px 3px rgba(40,20,5,0.3)' }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export { COLOR_EMOJI }
