/**
 * TIME-BOMB GUARD — review B2 (W9, 2026-10-31).
 *
 * The W9 release ships workbox `skipWaiting: true` ONCE, so installed clients
 * still on the previous autoUpdate build take it and reload themselves (their
 * page code never sends SKIP_WAITING; a waiting worker would sit until every
 * window closed). From the NEXT release on, prompt mode — the "new version —
 * reload" toast — must apply, which means removing the one-off.
 *
 * This test FAILS once ONE_OFF_SKIP_WAITING_EXPIRES (vite.config.ts) has
 * passed while the one-off is still on, so it cannot be forgotten. To clear
 * it: set ONE_OFF_SKIP_WAITING to false (or delete the block and the
 * `skipWaiting:` line), drop the one-off branch in e2e/pwa.spec.ts, and delete
 * the CLAUDE.md "next release" note.
 */
import { describe, it, expect } from 'vitest';
import viteConfig from '../../vite.config.ts?raw';
import claudeMd from '../../CLAUDE.md?raw';

interface OneOffState { on: boolean; expires: string | null; wired: boolean }

function readOneOff(source: string): OneOffState {
  return {
    on: /const ONE_OFF_SKIP_WAITING = true\b/.test(source),
    expires: source.match(/const ONE_OFF_SKIP_WAITING_EXPIRES = '(\d{4}-\d{2}-\d{2})'/)?.[1] ?? null,
    wired: /skipWaiting: ONE_OFF_SKIP_WAITING\b/.test(source),
  };
}

/** Why the build is not allowed to keep the one-off at `now` (null = fine). */
function oneOffProblem(state: OneOffState, now: number): string | null {
  if (!state.on) return null;
  if (!state.expires) return 'ONE_OFF_SKIP_WAITING is on but has no ONE_OFF_SKIP_WAITING_EXPIRES date';
  if (now > Date.parse(`${state.expires}T23:59:59Z`)) {
    return (
      `The W9 one-off skipWaiting expired on ${state.expires}. It was meant for ONE release: ` +
      'set ONE_OFF_SKIP_WAITING = false in vite.config.ts, drop the one-off branch in e2e/pwa.spec.ts ' +
      'and the CLAUDE.md "next release" note, so prompt-mode updates apply.'
    );
  }
  return null;
}

describe('one-off skipWaiting (review B2) is removed after one release', () => {
  const state = readOneOff(viteConfig);

  it('is still within its expiry window (fails once the date passes with the one-off on)', () => {
    expect(oneOffProblem(state, Date.now())).toBeNull();
  });

  it('while on, it is actually wired into workbox and documented in CLAUDE.md', () => {
    if (!state.on) return;
    expect(state.wired).toBe(true);
    expect(claudeMd).toMatch(/NEXT RELEASE MUST REMOVE the one-off skipWaiting/);
  });

  it('known positive: the guard trips the day after expiry, and only while the one-off is on', () => {
    const on: OneOffState = { on: true, expires: '2026-11-14', wired: true };
    expect(oneOffProblem(on, Date.parse('2026-11-14T12:00:00Z'))).toBeNull();
    expect(oneOffProblem(on, Date.parse('2026-11-15T00:00:01Z'))).toMatch(/expired on 2026-11-14/);
    expect(oneOffProblem({ ...on, on: false }, Date.parse('2027-01-01T00:00:00Z'))).toBeNull();
    expect(oneOffProblem({ ...on, expires: null }, 0)).toMatch(/no ONE_OFF_SKIP_WAITING_EXPIRES/);
    // The parser reads the real config (not a no-op that always says "off").
    expect(readOneOff("const ONE_OFF_SKIP_WAITING = true\nconst ONE_OFF_SKIP_WAITING_EXPIRES = '2026-11-14'\nskipWaiting: ONE_OFF_SKIP_WAITING,"))
      .toEqual({ on: true, expires: '2026-11-14', wired: true });
  });
});
