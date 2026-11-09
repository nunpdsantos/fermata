/**
 * The session header's "n of N" (and its "Again" mark) — read off the queue.
 *
 * Rule (brief 2026-11-09): the total shown when a session starts never grows.
 * A missed question comes back (and a new fact gets its second look): that
 * re-ask is marked "Again" instead of raising the total.
 *
 * The total is the session's PLANNED questions: its distinct facts, capped at
 * the session length (the composer queues each fact once; re-asks only insert
 * copies of facts already queued, so the distinct count never changes).
 *
 * The store ends a session after `length` answers or when the queue runs out —
 * unchanged. So:
 *  - a short session (fewer facts than its length) has room: a re-ask comes on
 *    top of the planned questions and the counter holds (e.g. "4 of 4 · Again");
 *  - once that room (length − total) is used up — at once in a full session —
 *    a re-ask takes the place of the last planned question, as it always did,
 *    and the counter moves on ("9 of 24 · Again").
 * Either way the count ends exactly on "N of N" and never passes it.
 */
export interface SessionCounter {
  /** 1-based number of the question on screen. */
  current: number;
  total: number;
  /** The question on screen was already asked in this session. */
  again: boolean;
}

/**
 * @param queue  The session queue (answered ids before `at`, still to come after).
 * @param at     Queue position of the question on screen.
 * @param length The session length setting (the store's answer cap).
 * @param known  Ids the bank still has (a stale id from an older bank is skipped).
 */
export function sessionCounter(
  queue: readonly string[],
  at: number,
  length: number,
  known: (id: string) => boolean,
): SessionCounter {
  const distinct = new Set(queue.filter(known)).size;
  const total = Math.max(1, Math.min(length, distinct));
  const room = Math.max(0, length - total);

  const seen = new Set<string>();
  let firsts = 0;
  let reasks = 0;
  for (let i = 0; i < Math.min(at, queue.length); i++) {
    const id = queue[i];
    if (!known(id)) continue;
    if (seen.has(id)) reasks++;
    else {
      seen.add(id);
      firsts++;
    }
  }
  const id = queue[at];
  const again = id !== undefined && seen.has(id);
  // Questions that used up a planned slot so far: every first ask, and the
  // re-asks beyond the session's spare room.
  const steps = firsts + Math.max(0, reasks - room);
  const current = again && reasks < room ? steps : steps + 1;
  return { current: Math.min(total, Math.max(1, current)), total, again };
}
