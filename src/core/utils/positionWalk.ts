// A generated study of one scale in successive closed classical positions.
// Each stop contains a complete tonic-to-tonic ascent. In-key connecting
// notes descend to a guide, slide on ONE string with ONE finger, then lead
// to the next ascent. This is not an exam-book fingering or a melodic-minor
// up/down exercise: connectors keep the selected scale's ascending form.
import type { Note, ScaleType } from '../types/music';
import type { GuitarTuning } from '../constants/guitarTunings';
import { TUNING_STANDARD } from '../constants/guitarTunings';
import { getPitchClass } from '../constants/notes';
import { GUITAR_MAX_FRET, MAX_POSITION, tuningOpenMidi } from './guitarPositions';
import { fingerLine, makeFrame, type FingeredNote, type HandFrameKind } from './guitarFingering';
import { scaleLine } from './scaleRoutes';

export interface WalkStop {
  position: number;
  octaves: number;
  /** Inclusive range of the complete ascending scale, excluding connectors. */
  start: number;
  end: number;
}
export interface PositionWalk {
  notes: FingeredNote[];
  stops: WalkStop[];
}
interface Candidate { position: number; octaves: number; notes: FingeredNote[] }
const KINDS: HandFrameKind[] = ['compact', 'stretchUp', 'spreadUp', 'stretchDown'];

/** Re-run exact places and frames through the engine, including every join. */
function validate(notes: FingeredNote[], tuning: GuitarTuning, maxFret: number) {
  return fingerLine(notes, { tuning, maxFret, pins: new Map(notes.map((n, i) => [i, n])) });
}

/** Bridge from a's top to b's bottom, then play b's whole ascent. */
function connect(a: Candidate, b: Candidate, tuning: GuitarTuning, maxFret: number): FingeredNote[] | null {
  let best: FingeredNote[] | null = null;
  for (let i = a.notes.length - 1; i >= 0; i--) {
    const from = a.notes[i];
    for (let j = 0; j < b.notes.length; j++) {
      const to = b.notes[j];
      if (from.stringIndex !== to.stringIndex || from.finger !== to.finger || to.fret <= from.fret || to.fret - from.fret > 5) continue;
      const bridge = [...a.notes.slice(i).reverse(), ...b.notes.slice(0, j + 1).reverse(), ...b.notes.slice(1)];
      if (best && bridge.length >= best.length) continue;
      const checked = validate(bridge, tuning, maxFret);
      if (checked && checked.filter((n) => n.shift).length === 1 && checked.some((n) => n.shift?.kind === 'guide')) best = checked;
    }
  }
  return best;
}

/** Up to four positions, at least two; null if no connected full scales fit.
 * Prefer more stops, then two-octave scales, then fewer connecting notes.
 * All 37 scale formulas are eligible; no missing degree is silently skipped.
 */
export function getPositionWalk(root: Note, scaleType: ScaleType, options: { tuning?: GuitarTuning; maxFret?: number } = {}): PositionWalk | null {
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const open = tuningOpenMidi(tuning);
  const pc = getPitchClass(root);
  const candidates: Candidate[] = [];
  for (let position = 1; position <= Math.min(MAX_POSITION, maxFret - 3); position++) {
    for (const kind of KINDS) {
      const frame = makeFrame(kind, kind === 'stretchDown' ? position - 1 : position);
      if (frame.frets[0] < 1 || frame.frets[3] > maxFret) continue;
      const low = Math.min(...open) + frame.frets[0];
      const high = Math.max(...open) + frame.frets[3];
      for (let tonic = low + (pc - low % 12 + 12) % 12; tonic + 12 <= high; tonic += 12) {
        for (const octaves of [2, 1]) {
          if (tonic + octaves * 12 > high) continue;
          const notes = fingerLine(scaleLine(root, scaleType, tonic, octaves), { tuning, maxFret, fixedFrame: frame });
          if (notes) { candidates.push({ position, octaves, notes }); break; }
        }
      }
    }
  }
  // Directed acyclic search: every next position is 2–5 frets higher.
  // Keep the best path to each candidate for each number of stops; unlike a
  // greedy choice, this cannot strand a walk at an early attractive position.
  interface Path { notes: FingeredNote[]; stops: WalkStop[] }
  const score = (p: Path) => p.stops.length * 10000 + p.stops.reduce((sum, s) => sum + s.octaves, 0) * 100 - p.notes.length;
  const paths: Map<number, Path>[] = candidates.map((c) => new Map([[1, {
    notes: c.notes, stops: [{ position: c.position, octaves: c.octaves, start: 0, end: c.notes.length - 1 }],
  }]]));
  let best: Path | null = null;
  for (const [bi, b] of candidates.entries()) {
    for (let ai = 0; ai < bi; ai++) {
      const a = candidates[ai];
      const distance = b.position - a.position;
      if (distance < 2 || distance > 5) continue;
      const bridge = connect(a, b, tuning, maxFret);
      if (!bridge) continue;
      for (const [count, path] of paths[ai]) {
        if (count === 4) continue;
        const notes = [...path.notes, ...bridge.slice(1)];
        const next: Path = { notes,
          stops: [...path.stops, { position: b.position, octaves: b.octaves, start: notes.length - b.notes.length, end: notes.length - 1 }] };
        const previous = paths[bi].get(count + 1);
        if (!previous || score(next) > score(previous)) paths[bi].set(count + 1, next);
      }
    }
    for (const [count, path] of paths[bi]) if (count >= 2 && (!best || score(path) > score(best))) best = path;
  }
  if (!best) return null;
  const notes = validate(best.notes, tuning, maxFret);
  return notes ? { notes, stops: best.stops } : null;
}
