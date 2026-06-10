/**
 * Drill Session — session composer and in-session queue helpers.
 * Pure, injectable now + seed, zero React imports.
 * Single rand instance drives shuffles in fixed call order (review first,
 * confidence second) for deterministic output per (inputs, seed).
 */
import type { DrillFamily, DrillItem, ItemSrsState } from '../core/types/drill';
import { isDue } from './drillScheduler';
import { mulberry32, seededShuffle } from '../core/utils/prng';

// ─── Public Types ─────────────────────────────────────────────────────────────

export interface SessionConfig {
  length: 12 | 24 | 40;
  newPerSession: number;       // 0..8; 0 = review-only mode
  families: Record<DrillFamily, boolean>;
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Deduplicate adjacent identical ids.
 * Swap the offender forward to the next non-colliding slot.
 * If no such slot exists, drop the duplicate.
 *
 * Exported for tests and for store-side requeue safety (requeueAfterMiss /
 * requeueSecondExposure may re-introduce an adjacent duplicate).
 */
export function dedupeAdjacent(ids: string[]): string[] {
  const out = ids.slice();
  let i = 0;
  while (i < out.length - 1) {
    if (out[i] === out[i + 1]) {
      // Find the next position j > i+1 where out[j] !== out[i]
      let j = i + 2;
      while (j < out.length && out[j] === out[i]) j++;
      if (j < out.length) {
        // Swap out[i+1] with out[j]
        [out[i + 1], out[j]] = [out[j], out[i + 1]];
      } else {
        // No valid slot found — drop the duplicate at i+1
        out.splice(i + 1, 1);
      }
      // Do NOT advance i: need to re-check position i+1 after the swap
    } else {
      i++;
    }
  }
  return out;
}

/** Pure insert: returns a new array with id inserted at pos. */
function insertAt(queue: string[], pos: number, id: string): string[] {
  const out = queue.slice();
  out.splice(pos, 0, id);
  return out;
}

// ─── composeSession ───────────────────────────────────────────────────────────

/**
 * Compose the initial question queue for a drill session.
 * Pure and deterministic per (bank, states, config, now, seed).
 *
 * Algorithm:
 *  1. pool   = bank filtered by config.families
 *  2. due    = pool items where isDue(state, now), sorted ascending by card.due
 *  3. learning = pool items with tier 'learning' NOT in due (carry-over)
 *  4. fresh  = pool items with NO state entry, sorted by rank, sliced to newPerSession
 *  5. confidence = remaining pool items with state and tier review|byHeart,
 *                  sorted ascending by card.due, then seeded-shuffled
 *  6. review = seededShuffle([...due, ...learning], rand)
 *     assemble: [...head(2), ...fresh, ...tail(rest), ...confidence]
 *     slice to config.length, then dedupeAdjacent
 *
 * A single rand = mulberry32(seed) drives both shuffles in fixed order:
 *   first review, then confidence.
 */
export function composeSession(
  bank: DrillItem[],
  states: Record<string, ItemSrsState>,
  config: SessionConfig,
  now: number,
  seed: number,
): string[] {
  const rand = mulberry32(seed);

  // 1. Family-filtered pool
  const pool = bank.filter((item) => config.families[item.family]);

  // 2. Due items (tier != 'new', card.due <= now), sorted most-overdue first
  const dueItems = pool
    .filter((item) => isDue(states[item.id], now))
    .sort((a, b) => states[a.id].card.due - states[b.id].card.due);

  const dueIds = new Set(dueItems.map((i) => i.id));

  // 3. Learning items NOT already in due
  const learningItems = pool.filter(
    (item) => !dueIds.has(item.id) && states[item.id]?.tier === 'learning',
  );

  // 4. Fresh items (no state entry), sorted by rank, capped at newPerSession.
  //    Items WITH states but tier 'new' are deliberately excluded from every
  //    bucket here — state must reach tier 'learning' via an answer before the
  //    item re-enters any bucket (store task: ensure the answer handler upgrades
  //    tier before the next session compose).
  const freshItems = pool
    .filter((item) => !states[item.id])
    .sort((a, b) => a.rank - b.rank)
    .slice(0, config.newPerSession);

  // 5. Confidence: remaining pool items with state and tier review|byHeart
  const confidenceItems = pool
    .filter((item) => {
      if (dueIds.has(item.id)) return false;
      // No learningIds/freshIds guard needed here: learning items have tier
      // 'learning' (not review|byHeart) and fresh items have no state — both
      // are excluded by the tier check below, making extra set lookups redundant.
      const s = states[item.id];
      return s !== undefined && (s.tier === 'review' || s.tier === 'byHeart');
    })
    .sort((a, b) => states[a.id].card.due - states[b.id].card.due);

  // 6. Assemble
  // Shuffle [due, learning] together for review block (rand call 1)
  const reviewItems = seededShuffle([...dueItems, ...learningItems], rand);
  const reviewIds = reviewItems.map((i) => i.id);

  const head = reviewIds.slice(0, 2);
  const tail = reviewIds.slice(2);

  // Shuffle confidence (rand call 2)
  const confidenceIds = seededShuffle(
    confidenceItems.map((i) => i.id),
    rand,
  );

  const assembled = [...head, ...freshItems.map((i) => i.id), ...tail, ...confidenceIds].slice(
    0,
    config.length,
  );

  return dedupeAdjacent(assembled);
}

// ─── requeue helpers ──────────────────────────────────────────────────────────

/**
 * Re-queue a missed item ~4–6 positions ahead (within-session relearning).
 * Pure — input queue is not mutated.
 *
 * @param queue   Current full queue (ids already answered + remaining).
 * @param index   Index of the item that was missed (current position in queue).
 * @param id      Id to reinsert.
 * @param rand    Seeded PRNG function (advances caller's shared state).
 */
export function requeueAfterMiss(
  queue: string[],
  index: number,
  id: string,
  rand: () => number,
): string[] {
  const offset = 4 + Math.floor(rand() * 3); // 4..6
  const pos = Math.min(index + offset, queue.length);
  return insertAt(queue, pos, id);
}

/**
 * Queue a new item's second exposure ~6–10 positions ahead.
 * Pure — input queue is not mutated.
 *
 * @param queue   Current full queue.
 * @param index   Index of the newly introduced item.
 * @param id      Id to reinsert.
 * @param rand    Seeded PRNG function (advances caller's shared state).
 */
export function requeueSecondExposure(
  queue: string[],
  index: number,
  id: string,
  rand: () => number,
): string[] {
  const offset = 6 + Math.floor(rand() * 5); // 6..10
  const pos = Math.min(index + offset, queue.length);
  return insertAt(queue, pos, id);
}
