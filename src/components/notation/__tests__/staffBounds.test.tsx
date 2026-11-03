import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { StaffNotation } from '../StaffNotation';
import { staffTrim } from '../../explore/staffTrim';
import { useAppStore } from '../../../state/store';
import type { PitchedNote } from '../../../core/types/music';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});
afterEach(cleanup);

const pitch = (natural: PitchedNote['natural'], octave: number): PitchedNote => ({ natural, accidental: '', octave });

// Independent outline measurements of the bundled Bravura font, in its
// 1000 units/em. VexFlow draws the default clef at 30pt = 40px. These come
// from the font outlines, not staffLayout/staffTrim's bounding constants.
const outlines = {
  '\uE050': { above: 1098, below: 658.215 },
  '\uE052': { above: 1098, below: 878 },
  '\uE062': { above: 262, below: 635 },
  '\uE064': { above: 262, below: 744 },
};

function assertInk(svg: SVGSVGElement, top: number, bottom: number) {
  const contains = (lo: number, hi: number, label: string) => {
    expect(lo, `${label}: top`).toBeGreaterThanOrEqual(top);
    expect(hi, `${label}: bottom`).toBeLessThanOrEqual(bottom);
  };
  // VexFlow draws the five lines as horizontal paths, snapped by +0.5px.
  const lines = [...svg.querySelectorAll('g.vf-stave > path')].filter((p) => /^M[\d. -]+L[\d. -]+$/.test(p.getAttribute('d') ?? ''));
  const horizontal = lines.map((p) => (p.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number))
    .filter((v) => v.length === 4 && v[1] === v[3] && v[0] !== v[2]);
  expect(horizontal).toHaveLength(5);
  horizontal.forEach((v) => contains(v[1] - 0.5, v[1] + 0.5, 'staff stroke'));
  const clef = svg.querySelector('g.vf-clef text')!;
  const outline = outlines[clef.textContent as keyof typeof outlines];
  expect(outline).toBeDefined();
  const y = Number(clef.getAttribute('y'));
  contains(y - outline.above * 0.04, y + outline.below * 0.04, 'complete clef (including 8vb)');
  const heads = svg.querySelectorAll('g.vf-notehead text');
  if (svg.querySelector('g.vf-stavenote')) expect(heads.length).toBeGreaterThan(0);
  heads.forEach((head) => {
    const y = Number(head.getAttribute('y'));
    contains(y - 8, y + 8, 'notehead / ledger line');
  });
  const accidentalOutlines: Record<string, [number, number]> = {
    '\uE260': [439, 175], '\uE261': [341, 335], '\uE262': [350, 348],
    '\uE263': [127.1, 125], '\uE264': [437, 175],
  };
  [...svg.querySelectorAll('text')].filter((t) => t.textContent! in accidentalOutlines).forEach((text) => {
    const [above, below] = accidentalOutlines[text.textContent!];
    const y = Number(text.getAttribute('y'));
    contains(y - above * 0.04, y + below * 0.04, 'accidental outline');
  });
  // Stems and ledger strokes have actual coordinates even in jsdom.
  svg.querySelectorAll('g.vf-stem path, g.vf-ledgerline path').forEach((path) => {
    const coords = (path.getAttribute('d')?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const ys = coords.filter((_, i) => i % 2 === 1);
    if (ys.length) contains(Math.min(...ys) - 1, Math.max(...ys) + 1, 'stem / ledger stroke');
  });
}

for (const instrument of ['piano', 'guitar'] as const) {
  for (const kind of ['strip', 'chord'] as const) {
    for (const [position, written] of [
      ['on staff', [pitch('E', 4), pitch('B', 4), pitch('F', 5)]],
      ['above', [pitch('A', 5), pitch('C', 6)]],
      ['below', [pitch('C', 3), pitch('C', 4)]],
    ] as const) {
      it(`${instrument} ${kind} at 80px: contains ${position}, all five strokes and the entire clef`, async () => {
        useAppStore.setState({ instrument });
        const notes = written.map((n) => ({ ...n, octave: n.octave - (instrument === 'guitar' ? 1 : 0) }));
        const { container } = render(<StaffNotation notes={notes} width={kind === 'strip' ? 700 : 132} height={80} duration="w" chord={kind === 'chord'} followInstrument />);
        await waitFor(() => expect(container.querySelector('g.vf-stavenote')).not.toBeNull());
        const svg = container.querySelector('svg')!;
        const trim = staffTrim(notes, instrument, 80);
        expect(Number(svg.getAttribute('height'))).toBe(trim.height);
        assertInk(svg, trim.top, trim.height - trim.bottom);
      });
    }
  }
}

for (const instrument of ['piano', 'guitar'] as const) {
  for (const keySignature of ['C#', 'Cb']) {
    it(`${instrument} ${keySignature}: trimming preserves every key-signature glyph`, async () => {
      useAppStore.setState({ instrument });
      const notes = [pitch('B', instrument === 'guitar' ? 3 : 4)];
      const { container } = render(<StaffNotation notes={notes} keySignature={keySignature} height={80} width={500} duration="w" followInstrument />);
      await waitFor(() => expect(container.querySelector('g.vf-stavenote')).not.toBeNull());
      const svg = container.querySelector('svg')!;
      expect(svg.querySelectorAll('g.vf-keysignature text')).toHaveLength(7);
      const trim = staffTrim(notes, instrument, 80, keySignature);
      assertInk(svg, trim.top, trim.height - trim.bottom);
    });
  }
}

describe('other callers, including authored notation', () => {
  for (const height of [84, 100, 140, 150]) {
    for (const clef of ['treble', 'bass'] as const) {
      it(`${height}px ${clef}: contains high/low quarter notes and their stems`, async () => {
        const { container } = render(<StaffNotation notes={[pitch('C', 2), pitch('C', 6)]} clef={clef} height={height} width={500} />);
        await waitFor(() => expect(container.querySelector('g.vf-stavenote')).not.toBeNull());
        const svg = container.querySelector('svg')!;
        assertInk(svg, 0, Number(svg.getAttribute('height')));
      });
    }
  }
  it('explicit Drill annotation reserves the 8 without transposing written notes', async () => {
    const { container } = render(<StaffNotation notes={[pitch('E', 4)]} annotation="8vb" height={80} width={300} duration="w" />);
    await waitFor(() => expect(container.querySelector('g.vf-stavenote')).not.toBeNull());
    const svg = container.querySelector('svg')!;
    expect(svg.querySelector('g.vf-clef text')?.textContent).toBe('\uE052');
    assertInk(svg, 0, Number(svg.getAttribute('height')));
  });
  for (const accidental of ['#', 'b', '##', 'bb'] as const) {
    it(`contains high and low ${accidental} accidentals after trimming (Drill)`, async () => {
      const notes = [{ ...pitch('F', 3), accidental }, { ...pitch('F', 6), accidental }];
      const { container } = render(<StaffNotation notes={notes} annotation="8vb" height={150} width={500} duration="w" />);
      await waitFor(() => expect(container.querySelector('g.vf-stavenote')).not.toBeNull());
      const svg = container.querySelector('svg')!;
      expect([...svg.querySelectorAll('g.vf-stavenote text')].filter((t) => /^[\uE260-\uE264]$/.test(t.textContent!))).toHaveLength(2);
      const trim = staffTrim(notes.map((n) => ({ ...n, octave: n.octave - 1 })), 'guitar', 150);
      assertInk(svg, trim.top, trim.height - trim.bottom);
    });
  }
  it('an empty staff still reserves the staff and clef', async () => {
    const { container } = render(<StaffNotation notes={[]} height={20} width={300} />);
    await waitFor(() => expect(container.querySelector('g.vf-clef')).not.toBeNull());
    const svg = container.querySelector('svg')!;
    assertInk(svg, 0, Number(svg.getAttribute('height')));
  });
});
