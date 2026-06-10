/**
 * Mastery selectors — pure aggregation of per-item SRS state into per-family
 * tier counts and a global "due today" count.
 *
 * Zero React, zero store, zero Date.now: `bank` + `items` + `now` are all
 * passed in, so every value is deterministic and unit-testable with seeded
 * states. The UI layer (MasteryMap / SessionSummary) selects from the store
 * and the memoized bank and feeds them here.
 */
import { DRILL_FAMILIES } from '../../core/types/drill';
import type { DrillFamily, DrillItem, ItemSrsState } from '../../core/types/drill';
import { isDue } from '../../services/drillScheduler';

/** Per-family tier breakdown. `total` is the family's full bank size; the four
 *  tier counts partition it (newCount + learning + review + byHeart === total). */
export interface FamilyMastery {
  /** Items with no SRS state OR an explicit 'new' tier — i.e. never promoted. */
  newCount: number;
  learning: number;
  review: number;
  byHeart: number;
  /** Every item of this family in the bank. */
  total: number;
}

/** Empty (all-zero) per-family record. */
function emptyMastery(): FamilyMastery {
  return { newCount: 0, learning: 0, review: 0, byHeart: 0, total: 0 };
}

/**
 * Aggregate the bank into per-family tier counts.
 *
 * An item's tier is its stored `state.tier` when a state exists, else 'new'
 * (an unseen item has no SRS row but is conceptually a 'new' fact). Every
 * family in DRILL_FAMILIES is present in the result even when its count is 0.
 */
export function computeMasteryByFamily(
  bank: DrillItem[],
  items: Record<string, ItemSrsState>,
): Record<DrillFamily, FamilyMastery> {
  const out = Object.fromEntries(
    DRILL_FAMILIES.map((f) => [f, emptyMastery()]),
  ) as Record<DrillFamily, FamilyMastery>;

  for (const item of bank) {
    const m = out[item.family];
    m.total += 1;
    const tier = items[item.id]?.tier ?? 'new';
    switch (tier) {
      case 'new':
        m.newCount += 1;
        break;
      case 'learning':
        m.learning += 1;
        break;
      case 'review':
        m.review += 1;
        break;
      case 'byHeart':
        m.byHeart += 1;
        break;
    }
  }

  return out;
}

/**
 * Count of items due for review right now across the WHOLE bank (all families,
 * regardless of which are enabled — this is a global "you have N waiting"
 * signal). 'new' / unseen items are never due (isDue handles both).
 */
export function dueTodayCount(
  bank: DrillItem[],
  items: Record<string, ItemSrsState>,
  now: number,
): number {
  let count = 0;
  for (const item of bank) {
    if (isDue(items[item.id], now)) count += 1;
  }
  return count;
}

/** Sum of byHeart counts across all families — the headline "mastered" number. */
export function totalByHeart(mastery: Record<DrillFamily, FamilyMastery>): number {
  let n = 0;
  for (const f of DRILL_FAMILIES) n += mastery[f].byHeart;
  return n;
}
