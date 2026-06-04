/**
 * categoryStore.js
 * ─────────────────
 * Reads and writes AI-generated categories to Firestore.
 *
 * Firestore structure:
 *   dailyCategories/{dayIndex}
 *     categories: [{ color, label, tiles }, ...]
 *     generatedAt: timestamp
 */

import { db } from '../firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const COLLECTION = 'dailyCategories'

/**
 * Fetch AI-generated categories for the given day from Firestore.
 * Returns an array of { color, label, tiles } objects, or [] if none exist yet.
 */
export async function getExtraCategories(dayIndex) {
  try {
    const ref = doc(db, COLLECTION, String(dayIndex))
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return snap.data().categories ?? []
    }
    return []
  } catch (err) {
    console.warn('[GeoConnections] Firestore read failed:', err)
    return []
  }
}

/**
 * Write a set of generated categories for the given day to Firestore.
 * Skips the write if the document already exists (first writer wins).
 */
export async function saveGeneratedCategories(dayIndex, categories) {
  try {
    const ref = doc(db, COLLECTION, String(dayIndex))
    const snap = await getDoc(ref)
    if (snap.exists()) return // another user already generated today's batch

    await setDoc(ref, {
      categories,
      generatedAt: serverTimestamp(),
    })
  } catch (err) {
    console.warn('[GeoConnections] Firestore write failed:', err)
  }
}

/**
 * Validate a single AI-generated category object.
 * Returns true if it passes the schema check.
 */
export function isValidCategory(cat, existingTiles) {
  if (
    !cat ||
    typeof cat.label !== 'string' || cat.label.trim() === '' ||
    !Array.isArray(cat.tiles) || cat.tiles.length !== 4 ||
    cat.tiles.some(t => typeof t !== 'string' || t.trim() === '')
  ) {
    console.warn('[GeoConnections] Category failed schema check — skipped:', cat)
    return false
  }

  if (existingTiles) {
    const conflict = cat.tiles.find(t => existingTiles.has(t))
    if (conflict) {
      console.warn(`[GeoConnections] Tile "${conflict}" already exists — skipped`)
      return false
    }
  }

  return true
}
