/**
 * Review W4b — the staff DRAWS the beams rhythmBeams computes: RhythmStaff
 * renders every rhythm in the curriculum through real VexFlow (jsdom SVG),
 * and each drawn beam (a `g.vf-beam`, holding one `g.vf-stem` per note it
 * joins) and each flag is counted against rhythmBeams. VexFlow's own default
 * groups cut 7/8 as 2+2+2+1; the 2+2+3 lesson must come out 2+2+3.
 */
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import type { RhythmPattern } from '../../../core/types/exercise';
import { parseRhythm } from '../../../core/utils/rhythm';
import { rhythmBeams } from '../rhythmBeams';
import { curriculumRhythms } from './curriculumRhythms';

vi.mock('../../../utils/vexflowLoader', () => ({ loadVexFlow: () => import('vexflow/bravura') }));
import { RhythmStaff } from '../RhythmStaff';

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  // jsdom lays nothing out: give the staff its usual width so it draws.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 520, height: 110, x: 0, y: 0, top: 0, left: 0, right: 520, bottom: 110, toJSON: () => ({}),
  } as DOMRect);
});
afterAll(() => vi.restoreAllMocks());
afterEach(cleanup);

/** Notes per drawn beam (in drawing order) and the number of flags. */
async function drawn(pattern: RhythmPattern): Promise<{ beams: number[]; flags: number }> {
  const { container, unmount } = render(<RhythmStaff pattern={pattern} />);
  await waitFor(() => expect(container.querySelectorAll('svg .vf-stavenote').length).toBeGreaterThan(0));
  const svg = container.querySelector('svg')!;
  const beams = [...svg.querySelectorAll('g.vf-beam')].map((g) => g.querySelectorAll('g.vf-stem').length);
  const flags = svg.querySelectorAll('g.vf-flag').length;
  unmount();
  return { beams, flags };
}

/** What rhythmBeams says should be drawn: its beams (plain ones first, then triplets, as RhythmStaff draws them) and a flag on every sounded eighth/sixteenth left unbeamed. */
function expected(pattern: RhythmPattern): { beams: number[]; flags: number } {
  const groups = rhythmBeams(pattern);
  const beamed = new Set(groups.flatMap((g) => g.notes));
  const flags = parseRhythm(pattern).bars.flat().filter((t, i) => !t.rest && (t.base === '8' || t.base === '16') && !beamed.has(i)).length;
  return { beams: [...groups.filter((g) => !g.triplet), ...groups.filter((g) => g.triplet)].map((g) => g.notes.length), flags };
}

describe('RhythmStaff draws the meter-grouped beams (review W4b)', () => {
  it('7/8 grouped 2+2+3: three beams a bar, of 2, 2 and 3 eighths, and no flag (VexFlow\'s default drew 2+2+2 and a flagged 7th)', async () => {
    const lesson = curriculumRhythms().find((r) => r.where === 'l4u14m2 concept 1')!.pattern;
    expect(await drawn(lesson)).toEqual({ beams: [2, 2, 3, 2, 2, 3], flags: 0 });
  });

  it('every rhythm in the curriculum: the drawn beams and flags are exactly rhythmBeams', async () => {
    const bad: string[] = [];
    for (const { where, pattern } of curriculumRhythms()) {
      const got = await drawn(pattern);
      const want = expected(pattern);
      if (JSON.stringify(got) !== JSON.stringify(want)) bad.push(`${where} ${pattern.time} '${pattern.notes}': drew ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
    }
    expect(bad).toEqual([]);
  }, 30000);
});
