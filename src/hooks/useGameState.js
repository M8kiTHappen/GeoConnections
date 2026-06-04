import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { getDailyPuzzle, categoryBank } from '../data/puzzles'
import { getExtraCategories, saveGeneratedCategories, isValidCategory } from '../data/categoryStore'
import { generateNewCategory } from '../utils/generateCategory'

const MAX_MISTAKES = 4

// Current UTC day index — same formula used in getDailyPuzzle
function todayIndex() {
  const now = new Date()
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildTiles(puzzle) {
  const tiles = []
  puzzle.categories.forEach((cat) => {
    cat.tiles.forEach((label) => {
      tiles.push({
        id: `${cat.color}-${label}`,
        label,
        categoryColor: cat.color,
        categoryLabel: cat.label,
      })
    })
  })
  return tiles
}

const COLOR_EMOJI = {
  yellow: '🟨',
  green: '🟩',
  blue: '🟦',
  purple: '🟪',
}

export default function useGameState() {
  const dayIndex = useMemo(() => todayIndex(), [])

  // null = still loading from Firestore; [] = loaded (no extras yet)
  const [extraCategories, setExtraCategories] = useState(null)

  // ── Load extras from Firestore on mount ───────────────────────────────────
  const generationFired = useRef(false)

  useEffect(() => {
    async function init() {
      // 1. Read today's generated categories from Firestore
      const extras = await getExtraCategories(dayIndex)
      setExtraCategories(extras)

      // 2. If none exist yet, generate them now (first visitor of the day)
      if (extras.length === 0 && !generationFired.current) {
        generationFired.current = true

        const allKnown = [...categoryBank, ...extras]
        const existingTiles = new Set(allKnown.flatMap(c => c.tiles))

        const labelsByColor = {}
        for (const cat of allKnown) {
          if (!labelsByColor[cat.color]) labelsByColor[cat.color] = []
          labelsByColor[cat.color].push(cat.label)
        }

        const COLORS = ['yellow', 'green', 'blue', 'purple']
        const generated = await Promise.all(
          COLORS.map(color => generateNewCategory(color, labelsByColor[color] ?? []))
        )

        const valid = generated.filter(cat => cat && isValidCategory(cat, existingTiles))
        if (valid.length > 0) {
          await saveGeneratedCategories(dayIndex, valid)
          // Update state so today's puzzle can include them if needed
          setExtraCategories(valid)
        }
      }
    }

    init()
  }, [dayIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Puzzle (re-computes only when extras load) ────────────────────────────
  const puzzle = useMemo(
    () => (extraCategories !== null ? getDailyPuzzle(extraCategories) : null),
    [extraCategories]
  )

  const [tiles, setTiles] = useState([])
  const [selected, setSelected] = useState([])
  const [solvedColors, setSolvedColors] = useState([])
  const [mistakesLeft, setMistakesLeft] = useState(MAX_MISTAKES)
  const [guessHistory, setGuessHistory] = useState([])
  const [hint, setHint] = useState(null)
  const [shaking, setShaking] = useState(false)
  const [gameStatus, setGameStatus] = useState('playing')
  const [hintUsed, setHintUsed] = useState(false)

  // Initialise tiles once puzzle is ready
  useEffect(() => {
    if (puzzle) setTiles(shuffle(buildTiles(puzzle)))
  }, [puzzle])

  // ── Derived ────────────────────────────────────────────────────────────────
  const unsolvedTiles = useMemo(
    () => tiles.filter(t => !solvedColors.includes(t.categoryColor)),
    [tiles, solvedColors]
  )

  const solvedCategories = useMemo(
    () => solvedColors.map(color => puzzle?.categories.find(c => c.color === color)),
    [solvedColors, puzzle]
  )

  // ── Actions ────────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((tileId) => {
    if (gameStatus !== 'playing') return
    setHint(null)
    setSelected(prev => {
      if (prev.includes(tileId)) return prev.filter(id => id !== tileId)
      if (prev.length >= 4) return prev
      return [...prev, tileId]
    })
  }, [gameStatus])

  const shuffleTiles = useCallback(() => setTiles(prev => shuffle(prev)), [])
  const deselectAll = useCallback(() => setSelected([]), [])

  const useHint = useCallback(() => {
    if (hintUsed || gameStatus !== 'playing') return
    const unsolvedColorSet = new Set(unsolvedTiles.map(t => t.categoryColor))
    for (const color of unsolvedColorSet) {
      const group = unsolvedTiles.filter(t => t.categoryColor === color)
      if (group.length >= 2) {
        setSelected([group[0].id, group[1].id])
        setHintUsed(true)
        return
      }
    }
  }, [hintUsed, gameStatus, unsolvedTiles])

  const submitGuess = useCallback(() => {
    if (selected.length !== 4 || gameStatus !== 'playing') return

    const selectedTiles = tiles.filter(t => selected.includes(t.id))
    const colors = selectedTiles.map(t => t.categoryColor)
    const colorCounts = {}
    colors.forEach(c => (colorCounts[c] = (colorCounts[c] || 0) + 1))

    const sortedGuess = [...colors].sort()
    const alreadyGuessed = guessHistory.some(
      prev => JSON.stringify([...prev].sort()) === JSON.stringify(sortedGuess)
    )
    if (alreadyGuessed) {
      setHint('already-guessed')
      return
    }

    setGuessHistory(prev => [...prev, colors])
    const maxSameColor = Math.max(...Object.values(colorCounts))

    if (maxSameColor === 4) {
      const correctColor = colors[0]
      const newSolved = [...solvedColors, correctColor]
      setSolvedColors(newSolved)
      setSelected([])
      setHint(null)
      if (newSolved.length === 4) setGameStatus('won')
    } else {
      setHint(maxSameColor === 3 ? 'one-away' : null)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      const newMistakes = mistakesLeft - 1
      setMistakesLeft(newMistakes)
      setSelected([])
      if (newMistakes === 0) setGameStatus('lost')
    }
  }, [selected, tiles, solvedColors, guessHistory, mistakesLeft, gameStatus])

  // ── Share ──────────────────────────────────────────────────────────────────
  const buildShareText = useCallback(() => {
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
    const header = `GeoConnections – ${dateStr} (Puzzle #${dayIndex + 1})\n`
    const mistakeLine = gameStatus === 'won'
      ? `Solved with ${MAX_MISTAKES - mistakesLeft} mistake${MAX_MISTAKES - mistakesLeft !== 1 ? 's' : ''}!`
      : 'Did not finish 😔'
    const rows = guessHistory.map(colors => colors.map(c => COLOR_EMOJI[c]).join('')).join('\n')
    return `${header}${mistakeLine}\n\n${rows}`
  }, [guessHistory, gameStatus, mistakesLeft, dayIndex])

  return {
    puzzle,
    tiles,
    unsolvedTiles,
    solvedCategories,
    selected,
    mistakesLeft,
    maxMistakes: MAX_MISTAKES,
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
    loading: extraCategories === null,
  }
}
