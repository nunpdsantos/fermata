import { withGlyphs } from '../../core/utils/accidentalGlyphs';
import { CENTER, SIZE, MINOR_INNER, MINOR_OUTER, SEG_GAP } from './circleOfFifthsConstants';

/** Horizontal label boxes in the inner wedges. At the diagonal wedges the
 * name and numeral need different radii AND a small tangential nudge. */
export function innerLabelLayout(index: number, numeral: boolean, paired: boolean, size = 276, name = '', degree = '') {
  const fontSize = Math.max(numeral ? 10 : 11, (numeral ? 12 : 12.5) * SIZE / size);
  const cap = numeral ? 19.5 : 27;
  const text = withGlyphs(numeral ? degree : name);
  const width = text ? Math.min(cap, [...text].reduce((w, c) =>
    w + (c === 'm' ? 0.91 : c === 'i' || c === '°' ? 0.34 : c === 'v' ? 0.52 : 0.7), 0) * fontSize) : cap;
  const radians = index * Math.PI / 6;
  let x = 65 * Math.sin(radians), y = -65 * Math.cos(radians);
  if (paired) {
    const positions = [
      [[0, -67], [0, -49]],
      [[33.5, -58.02], [25.25, -43.73]],
      [[49.45, -25.2], [58.03, -39.14]],
      [[67.24, -5.88], [70.54, 8.04]],
      [[49.45, 25.2], [58.03, 39.14]],
      [[33.5, 58.02], [25.25, 43.73]],
      [[0, 67], [0, 49]],
      [[-33.5, 58.02], [-25.25, 43.73]],
      [[-49.45, 25.2], [-58.03, 39.14]],
      [[-67.24, -5.88], [-70.54, 8.04]],
      [[-49.45, -25.2], [-58.03, -39.14]],
      [[-33.5, -58.02], [-25.25, -43.73]],
    ];
    [x, y] = positions[index][Number(numeral)];
    // Prefer a vertical stack when both actual text advances fit. Long
    // accidental names use the staggered pair above, without rotation.
    if (name && degree) {
      const stacks = [
        [0, -72.16, -57.84], [32, -63.16, -48.84], [56.5, -40.16, -25.84],
        [65.5, -6.66, 7.66], [56.5, 26.34, 40.66], [31, 50.34, 64.66],
        [0, 57.84, 72.16], [-31, 50.34, 64.66], [-56.5, 26.34, 40.66],
        [-65.5, -6.66, 7.66], [-56.5, -40.16, -25.84], [-32, -62.66, -48.34],
      ];
      const [sx, ny, vy] = stacks[index];
      const fits = (label: string, isNumeral: boolean, cy: number) => {
        const box = innerLabelLayout(index, isNumeral, false, size, label, label);
        return [-1, 1].every((dx) => [-1, 1].every((dy) => {
          const px = sx + dx * box.width / 2, py = cy + dy * box.height / 2;
          const radius = Math.hypot(px, py);
          const angle = (Math.atan2(px, -py) * 180 / Math.PI - index * 30 + 540) % 360 - 180;
          return radius > MINOR_INNER && radius < MINOR_OUTER && Math.abs(angle) < 15 - SEG_GAP;
        }));
      };
      if (fits(name, false, ny) && fits(degree, true, vy)) {
        x = sx; y = numeral ? vy : ny;
      }
    }
  }
  return {
    x: CENTER + x, y: CENTER + y, angle: 0, width,
    // Bound INK by a full em, not the font's line box (1.4em includes
    // inter-line leading). Source Serif's capitals span <=0.72em. The full
    // em also leaves room for the fallback musical accidental glyphs.
    height: fontSize,
    fontSize,
  };
}

