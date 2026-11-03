/**
 * Which notes of a rhythm share a beam (review W4b). VexFlow's default beam
 * groups know nothing of an additive meter's grouping — they cut 7/8 into
 * 2+2+2+1 whatever the music says — so the staff beams by this instead.
 *
 * Each bar is cut into beam spans: the groups of an additive meter (7/8 as
 * 2+2+3, declared on the pattern or read from its accents — see
 * meterGrouping), the dotted quarter in compound time (6/8, 9/8, 12/8), the
 * beat in simple time (2/4, 3/4, 4/4, 5/4: the quarter; 2/2: the half).
 * Eighths and sixteenths that START in the same span, with no rest, longer
 * value or triplet between them, share one beam; a beam never crosses a span
 * or a barline. A longer note may sound across a span boundary — it is not
 * split. Eighth-note triplets keep their own beam, three to a group.
 *
 * Pure: RhythmStaff draws exactly these beams, and the tests check them for
 * every rhythm in the curriculum without rendering.
 */
import { meterGrouping, parseRhythm, parseTimeSignature, type RhythmBase } from '../../core/utils/rhythm';
import type { RhythmPattern } from '../../core/types/exercise';

export interface RhythmBeam {
  /** Indices into the pattern's values, all bars flattened — the order RhythmStaff draws them in. */
  notes: number[];
  /** An eighth-note triplet (drawn with its 3). */
  triplet: boolean;
}

/** Ticks per quarter note: every supported value (dots and triplets included) is a whole number of them. */
const TICKS = 48;
const BEAMABLE: ReadonlySet<RhythmBase> = new Set<RhythmBase>(['8', '16']);

/**
 * One bar's beam spans in quarter notes: 7/8 as 2+2+3 → [1, 1, 1.5];
 * 6/8 → [1.5, 1.5]; 4/4 → [1, 1, 1, 1]; 5/4 → [1, 1, 1, 1, 1]; 2/2 → [2, 2].
 */
export function beamSpans(pattern: RhythmPattern): number[] {
  const [beats, unit] = parseTimeSignature(pattern.time);
  // A quarter (or longer) unit: one span per beat — inside any declared
  // grouping (5/4 as 3+2), so no beam crosses a group either.
  if (unit <= 4) return Array.from({ length: beats }, () => 4 / unit);
  return meterGrouping(pattern).groups.map((g) => (g * 4) / unit);
}

/** The beams of a rhythm, in drawing order (bar by bar, left to right). */
export function rhythmBeams(pattern: RhythmPattern): RhythmBeam[] {
  const { bars } = parseRhythm(pattern);
  // Where each span starts, in ticks from the barline: [0, 48, 96] for 7/8 2+2+3.
  const starts: number[] = [];
  beamSpans(pattern).reduce((at, span) => {
    starts.push(at);
    return at + Math.round(span * TICKS);
  }, 0);
  const spanAt = (tick: number) => {
    let s = 0;
    while (s + 1 < starts.length && starts[s + 1] <= tick) s++;
    return s;
  };

  const beams: RhythmBeam[] = [];
  let index = 0;
  for (const bar of bars) {
    let run: number[] = [];
    let runSpan = -1;
    let triplet: number[] = [];
    const close = () => {
      if (run.length > 1) beams.push({ notes: run, triplet: false });
      run = [];
    };
    let tick = 0;
    for (const token of bar) {
      if (token.triplet) {
        close();
        triplet.push(index);
        if (triplet.length === 3) {
          beams.push({ notes: triplet, triplet: true });
          triplet = [];
        }
      } else if (token.rest || !BEAMABLE.has(token.base)) {
        close();
      } else {
        const span = spanAt(tick);
        if (span !== runSpan) close();
        run.push(index);
        runSpan = span;
      }
      tick += Math.round(token.quarters * TICKS);
      index++;
    }
    close();
  }
  return beams;
}
