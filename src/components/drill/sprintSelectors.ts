/**
 * Sprint selectors — pure eligibility + key helpers for the 60s timed mode.
 *
 * Sprint only quizzes facts you already know: items in tiers review|byHeart
 * whose family is enabled. Personal bests are keyed by the sorted set of
 * enabled family names joined with ',' so a given topic mix has a stable record.
 */
import type { DrillFamily, DrillItem, ItemSrsState } from '../../core/types/drill';

/** Minimum eligible items required to start a sprint (else show empty-state). */
export const MIN_SPRINT_ITEMS = 5;

/**
 * Items eligible for a sprint: enabled family AND a stored tier of review or
 * byHeart. Order follows the bank (stable); the caller shuffles with its own
 * seed. Returns a fresh array (never mutates the bank).
 */
export function eligibleSprintItems(
  bank: DrillItem[],
  items: Record<string, ItemSrsState>,
  families: Record<DrillFamily, boolean>,
): DrillItem[] {
  return bank.filter((item) => {
    if (!families[item.family]) return false;
    const tier = items[item.id]?.tier;
    return tier === 'review' || tier === 'byHeart';
  });
}

/**
 * Personal-best key for the current enabled-family set: sorted family names
 * joined with ','. Stable regardless of toggle order. Empty string if none
 * enabled (a sprint can't start in that case anyway).
 */
export function sprintFamiliesKey(families: Record<DrillFamily, boolean>): string {
  return Object.keys(families)
    .filter((f) => families[f as DrillFamily])
    .sort()
    .join(',');
}
