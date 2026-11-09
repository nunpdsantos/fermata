import { render, cleanup } from '@testing-library/react';
import { createElement } from 'react';
import { CircleOfFifths } from '../CircleOfFifths';
import { expect, it } from 'vitest';
import { innerLabelLayout } from '../circleLabelLayout';
import { withGlyphs } from '../../../core/utils/accidentalGlyphs';
import { CIRCLE_MAJOR, CIRCLE_MINOR, CENTER, MINOR_INNER, MINOR_OUTER, SEG_GAP } from '../circleOfFifthsConstants';
import { buildScale } from '../../../core/constants/scales';
import { getDiatonicChordsForScale } from '../../../core/constants/chords';
import { getPitchClass } from '../../../core/constants/notes';
import { stringToNote, noteToString } from '../../../core/types/music';
// Boxes bound the visible ink, including the full em for musical glyphs.
const corners = (b: ReturnType<typeof innerLabelLayout>) => {
  const a = b.angle * Math.PI / 180;
  return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y]) => ({
    x: b.x + x*b.width/2*Math.cos(a)-y*b.height/2*Math.sin(a),
    y: b.y + x*b.width/2*Math.sin(a)+y*b.height/2*Math.cos(a),
  }));
};
type Point = { x: number; y: number };
function separated(a: Point[], b: Point[]) {
  return [a, b].some((p) => p.some((v, i) => {
    const next = p[(i + 1) % 4];
    const axis = { x: -(next.y-v.y), y: next.x-v.x };
    const project = (q: Point[]) => q.map((r) => r.x*axis.x+r.y*axis.y);
    const aa = project(a), bb = project(b);
    return Math.max(...aa) < Math.min(...bb) || Math.max(...bb) < Math.min(...aa);
  }));
}
for (const type of ['major', 'natural_minor'] as const) {
  for (const root of [...(type === 'major' ? CIRCLE_MAJOR : CIRCLE_MINOR), ...['C#','D#','F#','G#','A#','Cb','Ab','Db','Gb'].map(stringToNote)]) {
    it(`${root.natural}${root.accidental} ${type}: all inner labels fit wedges at 276px and never overlap`, () => {
      const chords = getDiatonicChordsForScale(buildScale(root, type));
      const boxes: Point[][] = [];
      for (let i = 0; i < 12; i++) {
        const match = chords.find(({ chord }) => ['minor','diminished'].includes(chord.quality) && getPitchClass(chord.root) === getPitchClass(CIRCLE_MINOR[i]));
        const paired = !!match;
        const name = match ? `${noteToString(match.chord.root)}${match.chord.quality === 'diminished' ? '°' : 'm'}` : `${noteToString(CIRCLE_MINOR[i])}m`;
        for (const numeral of [false, ...(paired ? [true] : [])]) {
          const lane = innerLabelLayout(i, numeral, paired, 276, name, match?.numeral);
          expect(lane.angle).toBe(0);
          const box = corners(lane);
          expect(lane.fontSize*276/300).toBeGreaterThanOrEqual(12);
          for (const p of box) {
            const r = Math.hypot(p.x-CENTER,p.y-CENTER);
            const angle = (Math.atan2(p.x-CENTER,CENTER-p.y)*180/Math.PI-i*30+540)%360-180;
            expect(r).toBeGreaterThan(MINOR_INNER);
            expect(r).toBeLessThan(MINOR_OUTER);
            expect(Math.abs(angle)).toBeLessThan(15-SEG_GAP);
          }
          boxes.push(box);
        }
      }
      boxes.forEach((a,i) => boxes.slice(i+1).forEach((b) => expect(separated(a,b)).toBe(true)));
      // At 12/6 o'clock the tangential extent is the limiting target size.
      expect(2*MINOR_OUTER*Math.sin((15-SEG_GAP)*Math.PI/180)*276/300).toBeGreaterThanOrEqual(36);
      expect((MINOR_OUTER-MINOR_INNER)*276/300).toBeGreaterThanOrEqual(36);
    });
  }
}
it('uses accidental glyphs without changing musical identifiers', () => {
  expect(withGlyphs('Bbm Ebm G#m B#°')).toBe('B♭m E♭m G♯m B♯°');
});

it('renders every wedge label horizontally, including its ancestors', () => {
  const { container } = render(createElement(CircleOfFifths));
  for (const label of container.querySelectorAll('g[role="button"] text')) {
    let element: Element | null = label;
    while (element && element.tagName.toLowerCase() !== 'svg') {
      expect(element.getAttribute('transform') ?? '').not.toMatch(/rotate|matrix/);
      element = element.parentElement;
    }
  }
  cleanup();
});
