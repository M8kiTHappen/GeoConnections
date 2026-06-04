/**
 * generateCategory.js
 * ────────────────────
 * Calls the Anthropic API (via Vite dev proxy or direct) to generate
 * one new geography-themed category for the given color slot.
 *
 * Returns { color, label, tiles } on success, or null on failure.
 *
 * Requires VITE_ANTHROPIC_API_KEY in the environment.
 */

const ANTHROPIC_URL = '/api/anthropic'
const MODEL = 'claude-haiku-4-5-20251001'

const COLOR_DESCRIPTIONS = {
  yellow: 'easiest / most obvious connection (e.g. all on the same river, all capital cities of island nations)',
  green:  'medium difficulty (e.g. all cities founded in the same decade, all landlocked countries in Asia)',
  blue:   'harder (e.g. cities that share a geographic superlative, cities sharing a national bird)',
  purple: 'hardest / most surprising connection (e.g. cities with names meaning "holy" in their origin language)',
}

/**
 * Build the prompt for one color slot.
 */
function buildPrompt(color, existingLabels) {
  const desc = COLOR_DESCRIPTIONS[color]
  const avoid = existingLabels.length
    ? `\nAvoid these category themes already in use: ${existingLabels.slice(-20).join('; ')}.`
    : ''

  return `You are a puzzle designer for a geography-themed word-connection game similar to NYT Connections.
Create ONE new category for the "${color}" difficulty slot (${desc}).${avoid}

Rules:
- The category must have EXACTLY 4 tiles.
- Every tile must be a real geography word: a city, country, state/province, landmark, river, mountain, ocean, desert, or similar.
- All 4 tiles must share a clear, specific geographical connection described by the label.
- The label should be a short clue phrase (≤ 8 words) that hints at the connection WITHOUT giving it away completely.
- Tiles must NOT duplicate commonly known puzzle tiles such as: Cairo, Lima, Seoul, Paris, London, Moscow, Tokyo, Beijing, Berlin, Rome, Madrid, Amsterdam, Vienna, Athens, Delhi.
- Return ONLY valid JSON — no markdown, no explanation — in this exact shape:
{
  "color": "${color}",
  "label": "Short clue phrase here",
  "tiles": ["Tile1", "Tile2", "Tile3", "Tile4"]
}`
}

/**
 * Parse and lightly validate the model's JSON response.
 */
function parseResponse(text, color) {
  let json
  try {
    // Strip any accidental markdown fences
    const cleaned = text.replace(/```(?:json)?/gi, '').trim()
    json = JSON.parse(cleaned)
  } catch {
    console.warn('[GeoConnections] generateCategory: JSON parse failed', text)
    return null
  }

  if (
    json.color !== color ||
    typeof json.label !== 'string' || json.label.trim() === '' ||
    !Array.isArray(json.tiles) || json.tiles.length !== 4 ||
    json.tiles.some((t) => typeof t !== 'string' || t.trim() === '')
  ) {
    console.warn('[GeoConnections] generateCategory: schema mismatch', json)
    return null
  }

  return {
    color: json.color,
    label: json.label.trim(),
    tiles: json.tiles.map((t) => t.trim()),
  }
}

/**
 * Fetch one AI-generated category for `color`.
 *
 * @param {string} color - 'yellow' | 'green' | 'blue' | 'purple'
 * @param {string[]} existingLabels - labels already in the bank (to avoid themes)
 * @returns {Promise<{color, label, tiles}|null>}
 */
export async function generateNewCategory(color, existingLabels = []) {
  const body = {
    model: MODEL,
    max_tokens: 256,
    messages: [
      { role: 'user', content: buildPrompt(color, existingLabels) },
    ],
  }

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.warn('[GeoConnections] generateCategory: API error', res.status)
      return null
    }

    const data = await res.json()
    const text = data?.content?.[0]?.text ?? ''
    return parseResponse(text, color)
  } catch (err) {
    console.warn('[GeoConnections] generateCategory: fetch failed', err)
    return null
  }
}
