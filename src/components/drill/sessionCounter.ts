/**
 * The session header's "n of N" (and its "Again" mark) — read off the queue.
 *
 * Rules (brief 2026-11-09 + seat review):
 *  - The total is fixed when a session starts: every fact once, plus the
 *    second look each NEW fact is certain to get (the store re-queues a new
 *    fact after its first answer, right or wrong), capped at the session
 *    length. A perfect first session reads 1 of 8 … 8 of 8; the second looks
 *    wear "Again".
 *  - A re-ask beyond that plan (a miss on a fact already seen, or a second
 *    miss on a new one) never raises the total. While the session has room
 *    for it (fewer planned questions than its length) it comes on top of the
 *    plan and the header reads "Extra 1", "Extra 2", … with "Again" — the
 *    number moves, so no two questions in a row ever show the same header.
 *    Once the room is used (at once in a full session) it takes the place of
 *    the last planned question, as the store always did, and the counter moves
 *    on ("9 of 24 · Again").
 *  - The store's session-end rule (`length` answers or the queue runs out),
 *    drillWork and scheduling are unchanged.
 * Rare case: when the store finds no slot for a new fact's second look (it is
 * never put next to itself or a sibling), that look is dropped from the plan
 * at once, so the count still ends on "N of N".
 */
export interface SessionCounter {
  /** 1-based number of the question on screen (meaningless while `extra` > 0). */
  current: number;
  total: number;
  /** The question on screen was already asked in this session. */
  again: boolean;
  /** 0 = a counted question; k = the k-th extra re-ask outside the plan. */
  extra: number;
}

/**
 * @param queue     The session queue (answered ids before `answered`, still to come after).
 * @param at        Queue position of the question on screen.
 * @param length    The session length setting (the store's answer cap).
 * @param known     Ids the bank still has (a stale id from an older bank is skipped).
 * @param isNew     The fact was new in this session (no state before it, or introduced by it).
 * @param answered  Positions before this index have been answered (the store's pointer).
 */
export function sessionCounter(
  queue: readonly string[],
  at: number,
  length: number,
  known: (id: string) => boolean,
  isNew: (id: string) => boolean = () => false,
  answered: number = at,
): SessionCounter {
  const occurrences = new Map<string, number[]>();
  queue.forEach((id, i) => {
    if (!known(id)) return;
    const list = occurrences.get(id);
    if (list) list.push(i);
    else occurrences.set(id, [i]);
  });
  // Planned asks per fact: 2 for a new fact (its second look), else 1 — and 1
  // once a new fact's only ask is answered with no second look queued.
  const plan = new Map<string, number>();
  for (const [id, places] of occurrences) {
    const secondLookLost = places.length === 1 && places[0] < answered;
    plan.set(id, isNew(id) && !secondLookLost ? 2 : 1);
  }
  let planned = 0;
  for (const asks of plan.values()) planned += asks;
  const total = Math.max(1, Math.min(length, planned));
  const room = Math.max(0, length - total);

  const seen = new Map<string, number>();
  let plannedDone = 0;
  let extrasDone = 0;
  for (let i = 0; i < Math.min(at, queue.length); i++) {
    const id = queue[i];
    if (!known(id)) continue;
    const k = (seen.get(id) ?? 0) + 1;
    seen.set(id, k);
    if (k <= (plan.get(id) ?? 1)) plannedDone++;
    else extrasDone++;
  }
  const id = queue[at];
  const k = id === undefined ? 1 : (seen.get(id) ?? 0) + 1;
  const again = k > 1;
  const inPlan = id === undefined || k <= (plan.get(id) ?? 1);
  // Questions that used up a counted slot so far: the planned ones, and the
  // extras beyond the session's spare room.
  const steps = plannedDone + Math.max(0, extrasDone - room);
  if (!inPlan && extrasDone < room) {
    return { current: Math.min(total, Math.max(1, steps)), total, again, extra: extrasDone + 1 };
  }
  return { current: Math.min(total, Math.max(1, steps + 1)), total, again, extra: 0 };
}
