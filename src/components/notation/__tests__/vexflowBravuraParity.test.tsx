/**
 * Audit W9-10 / D-22: notation loads VexFlow's Bravura-only entry
 * ('vexflow/bravura', ~294 KiB gzipped less) instead of the full entry with
 * five music fonts. Allowed only if notation renders IDENTICALLY: both
 * entries select the same fonts (setFonts('Bravura', 'Academico')); the full
 * one merely also registers Gonville / Petaluma / Petaluma Script, which
 * nothing selects.
 *
 * Proof here: the app's own StaffNotation renders the same staves through
 * each entry in jsdom and the SVG — every glyph, position and path — must be
 * byte-identical (auto-generated element ids normalised).
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import type { PitchedNote } from '../../../core/types/music';
import loaderSource from '../../../utils/vexflowLoader.ts?raw';

vi.mock('../../../utils/vexflowLoader', () => ({ loadVexFlow: vi.fn() }));
import { loadVexFlow } from '../../../utils/vexflowLoader';
import { StaffNotation } from '../StaffNotation';

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});
afterEach(cleanup);

const p = (natural: PitchedNote['natural'], accidental: PitchedNote['accidental'], octave: number): PitchedNote => ({ natural, accidental, octave });

const SCORES: Array<{ name: string; props: Parameters<typeof StaffNotation>[0] }> = [
  { name: 'Eb major scale, treble, key signature', props: { notes: [p('E', 'b', 4), p('F', '', 4), p('G', '', 4), p('A', 'b', 4), p('B', 'b', 4), p('C', '', 5), p('D', '', 5)], keySignature: 'Eb', width: 480 } },
  { name: 'accidentals incl. double sharp / flat, bass clef', props: { notes: [p('F', '#', 3), p('C', '##', 3), p('B', 'bb', 2), p('G', '', 2)], clef: 'bass', width: 420 } },
  { name: 'stacked chord with accidentals', props: { notes: [p('C', '#', 4), p('E', '#', 4), p('G', '#', 4)], chord: true, duration: 'w', width: 300 } },
];

async function svgWith(entry: () => Promise<unknown>, props: Parameters<typeof StaffNotation>[0]): Promise<string> {
  vi.mocked(loadVexFlow).mockImplementation(entry as typeof loadVexFlow);
  const { container, unmount } = render(<StaffNotation {...props} />);
  await waitFor(() => expect(container.querySelectorAll('svg text').length).toBeGreaterThan(0));
  const html = container.querySelector('svg')!.outerHTML.replace(/ id="[^"]*"/g, '');
  unmount();
  return html;
}

describe('VexFlow Bravura-only entry renders identically (W9-10)', () => {
  for (const { name, props } of SCORES) {
    it(name, async () => {
      const full = await svgWith(() => import('vexflow'), props);
      const bravura = await svgWith(() => import('vexflow/bravura'), props);
      // Known positive: real music glyphs were drawn (SMuFL treble or bass clef).
      expect(full).toMatch(/[]/);
      expect(bravura).toBe(full);
    });
  }

  it('the app loads the Bravura-only entry', () => {
    expect(loaderSource).toMatch(/import\('vexflow\/bravura'\)/);
    expect(loaderSource).not.toMatch(/import\('vexflow'\)/);
  });
});
