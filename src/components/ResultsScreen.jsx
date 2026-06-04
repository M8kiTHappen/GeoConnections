import { useState } from 'react'
import { COLOR_THEME } from './GameBoard'
import { COLOR_EMOJI } from './GuessHistory'

export default function ResultsScreen({ puzzle, guessHistory, gameStatus, mistakesLeft, maxMistakes, buildShareText }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — fail silently
    }
  }

  const won = gameStatus === 'won'
  const mistakesMade = maxMistakes - mistakesLeft

  return (
    <div className="flex flex-col items-center gap-5 py-4 animate-slideDown">
      {/* Headline */}
      <div className="text-center">
        {won ? (
          <>
            <p className="text-4xl">🌍</p>
            <h2
              className="text-2xl font-bold mt-2 text-ink"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              You Solved It!
            </h2>
            <p className="text-ink-faded text-sm mt-1 italic" style={{ fontFamily: 'IM Fell English, serif' }}>
              {mistakesMade === 0
                ? 'Perfect — no mistakes!'
                : `${mistakesMade} mistake${mistakesMade !== 1 ? 's' : ''} made`}
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl">😔</p>
            <h2
              className="text-2xl font-bold mt-2 text-ink"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Better Luck Next Time
            </h2>
            <p className="text-ink-faded text-sm mt-1 italic" style={{ fontFamily: 'IM Fell English, serif' }}>
              Here are the answers:
            </p>
          </>
        )}
      </div>

      {/* All category reveals */}
      <div className="w-full flex flex-col gap-2">
        {puzzle.categories.map((cat) => {
          const theme = COLOR_THEME[cat.color]
          return (
            <div
              key={cat.color}
              className={`${theme.bg} ${theme.text} rounded-sm px-4 py-3`}
              style={{ boxShadow: '2px 2px 6px rgba(40,20,5,0.25)' }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest opacity-70"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {cat.color} · {theme.label}
              </p>
              <p
                className="font-bold text-sm sm:text-base leading-tight mt-0.5"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {cat.label}
              </p>
              <p className="text-xs sm:text-sm mt-1 opacity-80 italic">
                {cat.tiles.join(' · ')}
              </p>
            </div>
          )
        })}
      </div>

      {/* Emoji grid */}
      <div className="flex flex-col items-center gap-1">
        <p
          className="text-xs text-ink-faded uppercase tracking-wider mb-1"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Your Guesses
        </p>
        {guessHistory.map((guess, i) => (
          <div key={i} className="flex gap-1">
            {guess.map((color, j) => (
              <span key={j} className="text-xl leading-none">
                {COLOR_EMOJI[color]}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Share button */}
      <button
        onClick={handleCopy}
        style={{ fontFamily: 'Cinzel, serif' }}
        className={`px-8 py-3 rounded-sm font-bold text-sm tracking-wide transition-all duration-200 ${
          copied
            ? 'bg-map-olive text-map-olive-text scale-95'
            : 'bg-ink text-parchment hover:bg-ink-light active:scale-95'
        }`}
      >
        {copied ? '✓ Copied!' : '📋 Copy Results'}
      </button>
    </div>
  )
}
