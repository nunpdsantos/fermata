/**
 * DATED GUARD — review B2 (W9; policy corrected 2026-10-31).
 *
 * Every release until 2026-11-14 ships workbox `skipWaiting: true`
 * (ONE_OFF_SKIP_WAITING in vite.config.ts). Installed clients still running
 * the old autoUpdate page code only listen for the worker's `activated` event
 * and never send SKIP_WAITING; with skipWaiting on, they take whichever
 * release they meet next and reload as before. Turning it off in the release
 * right after W9 would strand any client that had not yet loaded a
 * skipWaiting release, so it stays on across releases for a dated window and
 * is removed in the FIRST release AFTER the expiry date (prompt mode, the
 * "new version — reload" toast, from then on).
 *
 * This test turns RED at 00:00 UTC on the day after ONE_OFF_SKIP_WAITING_EXPIRES
 * (2026-11-15) while the switch is still on — intentionally, for every PR,
 * until it is removed. To clear it: set ONE_OFF_SKIP_WAITING to false (or
 * delete the block and the `skipWaiting:` line), drop the transition branch in
 * e2e/pwa.spec.ts, and delete the CLAUDE.md "KEEP the transition skipWaiting
 * ON" note — each sits inside an `ONE-OFF-SKIPWAITING:BEGIN … END` block.
 *
 * The wording checks read ONLY those marked blocks, so unrelated edits
 * elsewhere in the three files cannot trip them.
 */
import { describe, it, expect } from 'vitest';
import viteConfig from '../../vite.config.ts?raw';
import claudeMd from '../../CLAUDE.md?raw';
import pwaSpec from '../../e2e/pwa.spec.ts?raw';

interface OneOffState { on: boolean; expires: string | null; wired: boolean }

function readOneOff(source: string): OneOffState {
  return {
    on: /const ONE_OFF_SKIP_WAITING = true\b/.test(source),
    expires: source.match(/const ONE_OFF_SKIP_WAITING_EXPIRES = '(\d{4}-\d{2}-\d{2})'/)?.[1] ?? null,
    wired: /skipWaiting: ONE_OFF_SKIP_WAITING\b/.test(source),
  };
}

/** Why the build is not allowed to keep skipWaiting at `now` (null = fine). */
function oneOffProblem(state: OneOffState, now: number): string | null {
  if (!state.on) return null;
  if (!state.expires) return 'ONE_OFF_SKIP_WAITING is on but has no ONE_OFF_SKIP_WAITING_EXPIRES date';
  if (now > Date.parse(`${state.expires}T23:59:59Z`)) {
    return (
      `The transition skipWaiting window ended on ${state.expires}. Remove it in this release: ` +
      'set ONE_OFF_SKIP_WAITING = false in vite.config.ts, drop the transition branch in e2e/pwa.spec.ts ' +
      'and the CLAUDE.md "KEEP the transition skipWaiting ON" note, so prompt-mode updates apply.'
    );
  }
  return null;
}

const BLOCK = /ONE-OFF-SKIPWAITING:BEGIN([\s\S]*?)ONE-OFF-SKIPWAITING:END/g;

/** The marked policy block of a file (the only text the wording checks read). */
function policyBlock(text: string): string {
  return [...text.matchAll(BLOCK)].map((m) => m[1]).join('\n');
}

/** What is wrong with a file's policy block (empty = fine). */
function policyBlockProblems(text: string, expires: string): string[] {
  const blocks = [...text.matchAll(BLOCK)];
  if (blocks.length !== 1) return [`expected exactly one ONE-OFF-SKIPWAITING block, found ${blocks.length}`];
  const block = blocks[0][1];
  const problems: string[] = [];
  if (!block.includes(expires)) problems.push(`does not name the date ${expires}`);
  if (!/first release after/i.test(block)) problems.push('does not say "first release after"');
  if (/next release|release after W9/i.test(block)) problems.push('says "next release" / "release after W9"');
  return problems;
}

describe('transition skipWaiting (review B2): on in every release until its date, then removed', () => {
  const state = readOneOff(viteConfig);

  it('is still within its window (turns red the day after the date while it is on — intentional)', () => {
    expect(oneOffProblem(state, Date.now())).toBeNull();
  });

  it('while on, it is actually wired into workbox and documented in CLAUDE.md', () => {
    if (!state.on) return;
    expect(state.wired).toBe(true);
    expect(claudeMd).toMatch(/KEEP the transition skipWaiting ON until 2026-11-14/);
  });

  it('every policy block says "keep on until the date, remove in the first release after it" — never "the next release"', () => {
    for (const [name, text] of [['vite.config.ts', viteConfig], ['CLAUDE.md', claudeMd], ['e2e/pwa.spec.ts', pwaSpec]] as const) {
      const problems = policyBlockProblems(text, state.expires ?? '2026-11-14');
      expect(problems, name).toEqual([]);
    }
    expect(policyBlock(claudeMd)).toMatch(/KEEP the transition skipWaiting ON until 2026-11-14/);
  });

  it('known positives for the block check: missing / duplicated block and "next release" wording all fail; text OUTSIDE a block is ignored', () => {
    const wrap = (body: string) => `x\nONE-OFF-SKIPWAITING:BEGIN\n${body}\nONE-OFF-SKIPWAITING:END\ny`;
    const good = 'keep on until 2026-11-14, remove in the first release after 2026-11-14';
    expect(policyBlockProblems(wrap(good), '2026-11-14')).toEqual([]);
    expect(policyBlockProblems(`next release!\n${wrap(good)}\nnext release!`, '2026-11-14')).toEqual([]);
    expect(policyBlockProblems('no block here', '2026-11-14')).toEqual(['expected exactly one ONE-OFF-SKIPWAITING block, found 0']);
    expect(policyBlockProblems(wrap(good) + wrap(good), '2026-11-14')).toEqual(['expected exactly one ONE-OFF-SKIPWAITING block, found 2']);
    expect(policyBlockProblems(wrap(`${good}. Remove it in the next release.`), '2026-11-14')).toContain('says "next release" / "release after W9"');
    expect(policyBlockProblems(wrap('In the release after W9: set it false.'), '2026-11-14')).toContain('says "next release" / "release after W9"');
    expect(policyBlockProblems(wrap('keep it on for a while'), '2026-11-14')).toEqual(
      expect.arrayContaining(['does not name the date 2026-11-14', 'does not say "first release after"']),
    );
  });

  it('known positive: the guard trips the day after expiry, and only while the switch is on', () => {
    const on: OneOffState = { on: true, expires: '2026-11-14', wired: true };
    expect(oneOffProblem(on, Date.parse('2026-11-14T12:00:00Z'))).toBeNull();
    expect(oneOffProblem(on, Date.parse('2026-11-15T00:00:01Z'))).toMatch(/window ended on 2026-11-14/);
    expect(oneOffProblem({ ...on, on: false }, Date.parse('2027-01-01T00:00:00Z'))).toBeNull();
    expect(oneOffProblem({ ...on, expires: null }, 0)).toMatch(/no ONE_OFF_SKIP_WAITING_EXPIRES/);
    // The parser reads the real config (not a no-op that always says "off").
    expect(readOneOff("const ONE_OFF_SKIP_WAITING = true\nconst ONE_OFF_SKIP_WAITING_EXPIRES = '2026-11-14'\nskipWaiting: ONE_OFF_SKIP_WAITING,"))
      .toEqual({ on: true, expires: '2026-11-14', wired: true });
    expect(readOneOff(viteConfig).expires).toBe('2026-11-14');
  });
});
