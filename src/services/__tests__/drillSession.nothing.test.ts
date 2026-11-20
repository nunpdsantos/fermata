/**
 * `sessionHasNothing` (audit 2, P6) is composeSession's own emptiness, for
 * any now and seed: pinned here against composeSession on random banks,
 * states, configs and pools (follow or topics), with planted edge cases.
 */
import { describe, expect, it } from 'vitest';
import { composeSession, sessionHasNothing, type SessionConfig } from '../drillSession';
import { applyAnswer } from '../drillScheduler';
import { generateDrillBank } from '../../core/utils/drillBank';
import { DRILL_FAMILIES, type DrillFamily, type ItemSrsState } from '../../core/types/drill';
import { mulberry32 } from '../../core/utils/prng';

const BANK = generateDrillBank({ includeRead: true });
const NOW = Date.UTC(2026, 10, 19, 9);
const families = (on: (f: DrillFamily) => boolean) => Object.fromEntries(DRILL_FAMILIES.map((f) => [f, on(f)])) as Record<DrillFamily, boolean>;

describe('sessionHasNothing = composeSession(...).length === 0', () => {
  it('the planted cases', () => {
    const cfg = (patch: Partial<SessionConfig>): SessionConfig => ({ length: 24, newPerSession: 4, families: families(() => true), ...patch });
    expect(sessionHasNothing(BANK, {}, cfg({}))).toBe(false);
    expect(sessionHasNothing(BANK, {}, cfg({ families: families(() => false) }))).toBe(true);
    expect(sessionHasNothing(BANK, {}, cfg({ newPerSession: 0 }))).toBe(true);
    // A fact met in a topic now off does not count; one in a topic on does.
    const triad = BANK.find((i) => i.family === 'triad')!;
    const met: Record<string, ItemSrsState> = { [triad.id]: applyAnswer(undefined, false, 1000, NOW - 1000, 's1') };
    expect(sessionHasNothing(BANK, met, cfg({ newPerSession: 0, families: families((f) => f === 'interval') }))).toBe(true);
    expect(sessionHasNothing(BANK, met, cfg({ newPerSession: 0, families: families((f) => f === 'triad') }))).toBe(false);
    // A saved state still at 'new' is in no bucket.
    const stuck: Record<string, ItemSrsState> = { [triad.id]: { ...met[triad.id], tier: 'new' } };
    expect(sessionHasNothing(BANK, stuck, cfg({ newPerSession: 0, families: families((f) => f === 'triad') }))).toBe(true);
    // Following: the pool is what is open plus every fact met.
    expect(sessionHasNothing(BANK, {}, cfg({}), () => false)).toBe(true);
    expect(sessionHasNothing(BANK, met, cfg({ newPerSession: 0 }), () => false)).toBe(false);
    expect(sessionHasNothing(BANK, {}, cfg({ newPerSession: 0 }), (i) => i.family === 'scale')).toBe(true);
  });

  it('agrees with composeSession on 400 random cases, at several nows and seeds', () => {
    const rand = mulberry32(20261119);
    let empty = 0;
    for (let n = 0; n < 400; n++) {
      const sample = BANK.filter(() => rand() < 0.04);
      const states: Record<string, ItemSrsState> = {};
      for (const item of sample) {
        if (rand() < 0.5) continue;
        let s = applyAnswer(undefined, rand() < 0.6, 1500, NOW - Math.floor(rand() * 9e8), `s${n}`);
        if (rand() < 0.3) s = applyAnswer(s, true, 1200, NOW - Math.floor(rand() * 4e8), `t${n}`);
        if (rand() < 0.05) s = { ...s, tier: 'new' };
        states[item.id] = s;
      }
      const config: SessionConfig = {
        length: ([12, 24, 40] as const)[Math.floor(rand() * 3)],
        newPerSession: rand() < 0.5 ? 0 : Math.floor(rand() * 9),
        families: families(() => rand() < 0.1),
      };
      const follow = rand() < 0.3;
      const picked = new Set(DRILL_FAMILIES.filter(() => rand() < 0.2));
      const unlocked = follow ? (i: { family: DrillFamily }) => picked.has(i.family) : null;
      const want = sessionHasNothing(sample, states, config, unlocked);
      if (want) empty++;
      for (const [now, seed] of [[NOW, 1], [NOW + 9e9, 77], [NOW - 9e9, 123456]]) {
        expect(composeSession(sample, states, config, now, seed, undefined, unlocked).length === 0, `case ${n}`).toBe(want);
      }
    }
    // Both answers occur often enough to mean something.
    expect(empty).toBeGreaterThan(60);
    expect(empty).toBeLessThan(340);
  });
});
