import useGameState from './hooks/useGameState'
import GameBoard from './components/GameBoard'
import GuessHistory from './components/GuessHistory'
import ResultsScreen from './components/ResultsScreen'

export default function App() {
  const {
    puzzle,
    loading,
    unsolvedTiles,
    solvedCategories,
    selected,
    mistakesLeft,
    maxMistakes,
    guessHistory,
    hint,
    shaking,
    gameStatus,
    toggleSelect,
    shuffleTiles,
    deselectAll,
    submitGuess,
    useHint,
    hintUsed,
    buildShareText,
  } = useGameState()

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-faded italic text-sm" style={{ fontFamily: 'IM Fell English, serif' }}>
          Unrolling the map…
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="w-full border-b-2 border-ink/20 py-4 px-4 flex flex-col items-center">
        <h1
          className="text-3xl sm:text-4xl font-black tracking-widest text-ink"
          style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.12em' }}
        >
          GeoConnections
        </h1>
        <p className="text-xs text-ink-faded mt-1 italic" style={{ fontFamily: 'IM Fell English, serif' }}>
          {dateStr}
        </p>
      </header>

      {/* Main content */}
      <main className="w-full max-w-lg px-4 py-6 flex flex-col gap-4">
        {/* Card wrapper with map-border styling */}
        <div className="map-card rounded-sm p-4 bg-parchment/40 flex flex-col gap-4">
          <p
            className="text-center text-sm text-ink-light italic"
            style={{ fontFamily: 'IM Fell English, serif' }}
          >
            Group four geography terms in each category
          </p>

          {gameStatus === 'playing' ? (
            <>
              <GameBoard
                unsolvedTiles={unsolvedTiles}
                solvedCategories={solvedCategories}
                selected={selected}
                mistakesLeft={mistakesLeft}
                maxMistakes={maxMistakes}
                hint={hint}
                shaking={shaking}
                gameStatus={gameStatus}
                hintUsed={hintUsed}
                onTileClick={toggleSelect}
                onShuffle={shuffleTiles}
                onDeselect={deselectAll}
                onSubmit={submitGuess}
                onHint={useHint}
              />
              <GuessHistory guessHistory={guessHistory} />
            </>
          ) : (
            <>
              {unsolvedTiles.length > 0 && (
                <GameBoard
                  unsolvedTiles={unsolvedTiles}
                  solvedCategories={solvedCategories}
                  selected={[]}
                  mistakesLeft={mistakesLeft}
                  maxMistakes={maxMistakes}
                  hint={null}
                  shaking={false}
                  gameStatus={gameStatus}
                  hintUsed={hintUsed}
                  onTileClick={() => {}}
                  onShuffle={() => {}}
                  onDeselect={() => {}}
                  onSubmit={() => {}}
                  onHint={() => {}}
                />
              )}
              <ResultsScreen
                puzzle={puzzle}
                guessHistory={guessHistory}
                gameStatus={gameStatus}
                mistakesLeft={mistakesLeft}
                maxMistakes={maxMistakes}
                buildShareText={buildShareText}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-5 text-center text-xs text-ink-faded italic" style={{ fontFamily: 'IM Fell English, serif' }}>
        A geography puzzle · New puzzle each day
      </footer>
    </div>
  )
}
