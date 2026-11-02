// Left-hand fingering for a melodic line on the guitar (audit W10-03).
//
// Given a fixed sequence of sounding pitches (a scale, an arpeggio, a broken
// interval pattern), choose for every note a string, a fret and a left-hand
// finger so the whole line is playable the way classical guitarists finger
// scale studies: the hand sits in a POSITION (the fret under the index
// finger, Roman numerals: V = index at fret 5, as in guitarPositions.ts) and
// moves between positions by SHIFTS that have something to hold on to.
//
// The hand model is a FRAME: the four fingers on four different frets, at most
// five frets from the 1st to the 4th finger (one finger per fret, the
// guitarPositions.ts window plus its one-fret stretches):
//
//   compact      N   N+1 N+2 N+3   position N
//   stretchUp    N   N+1 N+2 N+4   position N, little finger reaches up
//   spreadUp     N   N+1 N+3 N+4   position N, hand spread (5-6-8-9 = 1-2-3-4)
//   stretchDown  N−1 N+1 N+2 N+3   position N, index reaches back
//
// and, for arpeggio lines only (option sharedFrets), the chord-grip shapes in
// which two neighbouring fingers share a fret on two strings — the lower
// string takes the lower finger (the Am grip's 2nd and 3rd fingers on fret 2):
//
//   share12      N   N   N+1 N+2
//   share23      N   N+1 N+1 N+2
//   share34      N   N+1 N+2 N+2
//   share23Up    N   N+1 N+1 N+3   little finger one fret out (the first-
//                                  position E grip: 1 on 1, 2 and 3 on 2, 4 on 4)
//
// A fretted note is played by the finger whose frame fret it is, so one finger
// never plays two frets while the hand stays put, and — outside the shared
// shapes — one fret never takes two fingers. The frame only changes at a shift, and a shift is allowed only
// when the hand has a guide (classical practice, audit Track G R21):
//
//   guide  the same finger stays on the same string and slides to the new fret;
//   index  on the same string, the index takes the next note after a 2nd/3rd/
//          4th finger going up (and the reverse coming down) — the usual scale
//          shift;
//   open   the shift happens while an open string sounds (the hand is free);
//   change (opt-in, arpeggios) on the same string, another finger lands on the
//          next note after the hand slides (3 → 4 up the 1st string to the
//          top of an open-position C arpeggio);
//   jump   (only into a note marked jumpOk: a broken chord's group start) the
//          hand repositions while the thumb returns to the bass — the earlier
//          group has rung its course ("with over-ringing").
//
// Everything else (jumping to another string and another position at once) is
// not offered. Two consecutive notes on different strings at the same fret
// would put one finger on both (the frame has one finger per fret): with the
// 2nd–4th finger that is a roll that lets both strings ring, which classical
// arpeggios avoid ("without over-ringing", ABRSM guitar syllabus p. 10), so it
// is not offered; with the index it is a partial barré — allowed, costed and
// flagged on the note (`barre`). The cheapest playable line under the costs below is found by an
// exact shortest-path search over (note, string, fret, frame); ties go to the
// first candidate in a fixed enumeration order, so the result is deterministic.
//
// Costs (integers, so sums are exact):
//   shift       guide 30 + 4·frets slid; index and change 30 (index from the
//               2nd finger: 40) + 3·frets between the two notes + 1·positions
//               moved; open 12 + 2·positions moved; jump 45 + 4·positions; at
//               most 7 positions per shift; 25 more for a shift straight
//               after another, 60 more when it is the same finger sliding
//               again (a melodic-minor descent sliding 2-2-2 down a string)
//   barré       15 per note the index takes at the fret of the note before,
//               on another string
//   stretch     10 per note played by a reaching finger (+6 below position V)
//   string      4 per string crossing, 15 more when a string is skipped
//   open string free at the start, on a note marked openFree (a scale's
//               tonic) and up to position I (openFreeUpTo; arpeggios use IV);
//               15 up to IV; 30 from V
//   root        littleFingerRootCost when the 4th finger plays the first note
//               and it is a chord root (the bass of an arpeggio)
//   shared fret 3 per note on the shared fret of a shared shape
//   group       a ringing group (LinePitch.group) is a grip held at once, so
//               — rules, not costs — its notes go on different strings, the
//               hand does not shift inside it, no 2nd–4th finger stops two of
//               its strings at one fret, two fingers on one fret keep the
//               lower finger on the lower string, and an index barré across
//               it never passes over one of its strings played open or at a
//               lower fret (the barré is flagged on both notes)
//               (openStrings 'avoid': closed-position routes — an open
//               string only where no fretted place reaches the pitch)
//   height      1 per position, per fretted note (nut-closest wins ties)
//
// Pure and framework-agnostic.

import type { Note, PitchedNote } from '../types/music';
import type { GuitarTuning } from '../constants/guitarTunings';
import { TUNING_STANDARD } from '../constants/guitarTunings';
import { GUITAR_MAX_FRET, tuningOpenMidi } from './guitarPositions';
import type { LeftHandFinger } from './guitarPositions';

// ─── Types ──────────────────────────────────────────────────────────────────

/** A spelled sounding pitch of a line. */
export interface LinePitch {
  midi: number;
  note: Note;
  /** An open string costs nothing on this note (a scale's tonic). */
  openFree?: boolean;
  /** A chord root (arpeggios): the little finger on it costs littleFingerRootCost. */
  root?: boolean;
  /**
   * Notes that ring on together (a broken chord's group of three, played
   * "with over-ringing"): consecutive notes with the same group id form one
   * grip held at once — see `group` in the header.
   */
  group?: number;
  /** Largest string change into this note, overriding maxStringStep (a broken chord's closing tonic). */
  leap?: number;
  /** The hand may reposition into this note without a guide (kind 'jump'): a broken chord's group start. */
  jumpOk?: boolean;
}

export type HandFrameKind = 'compact' | 'stretchUp' | 'spreadUp' | 'stretchDown' | 'share12' | 'share23' | 'share34' | 'share23Up';

export interface HandFrame {
  kind: HandFrameKind;
  /** Fret under fingers 1–4. */
  frets: readonly [number, number, number, number];
  /** Classical position: the fret the index finger is placed for (stretchDown: one above its fret). */
  position: number;
}

/**
 * 'guide', 'index', 'open', 'change', 'jump': see the header. 'shape' (double stops only): the
 * hand keeps the same two fingers in the same shape and moves it to the next
 * pair of strings (an octave shape crossing from strings 5–3 to 4–2).
 */
export type ShiftKind = 'guide' | 'index' | 'open' | 'change' | 'jump' | 'shape';

export interface Shift {
  kind: ShiftKind;
  fromPosition: number;
  toPosition: number;
  /** String the shift happens on (the guide string; the open string for 'open'). */
  stringIndex: number;
  /** Finger that slides ('guide'), or the finger that lands on the new note. */
  finger: LeftHandFinger;
}

/**
 * The hand re-spreads in the same position around a finger held down (the
 * turn at the top of a melodic-minor scale: the 4th finger stays on the top
 * note while the index reaches back a fret).
 */
export interface Reach {
  position: number;
  /** The held note's finger and fret (the previous note). */
  anchorFinger: LeftHandFinger;
  anchorFret: number;
  stringIndex: number;
}

export interface FingeredNote {
  midi: number;
  note: Note;
  /** Sounding pitch, app octave convention (MIDI = 12 + 12·octave + pitch class). */
  pitched: PitchedNote;
  /** 0 = 6th string (lowest) … 5 = 1st string. */
  stringIndex: number;
  fret: number;
  /** 0 = open string. */
  finger: LeftHandFinger;
  /** Hand position while this note sounds; null before the hand is first placed (open-string start). */
  position: number | null;
  frame: HandFrame | null;
  /** Hand-position segment: increases by one at every shift. */
  segment: number;
  /** The shift that brings the hand to this note, if any. */
  shift: Shift | null;
  /** A re-spread in the same position that brings the hand to this note, if any. */
  reach: Reach | null;
  /**
   * A partial barré: the index takes this note at the same fret as the note
   * before on another string, or — in a ringing group — as another note of
   * its group (then both notes are flagged).
   */
  barre: boolean;
}

export interface FingeringOptions {
  tuning?: GuitarTuning;
  maxFret?: number;
  /** Largest string change between consecutive notes (default 1 — scales and arpeggios alike). */
  maxStringStep?: number;
  /** Allow 'change' shifts (same string, another finger lands). Default false. */
  fingerChangeShifts?: boolean;
  /** Highest position in which an open string is free (default 1). */
  openFreeUpTo?: number;
  /** Cost of the 4th finger on the first note when it is marked root (default 0). */
  littleFingerRootCost?: number;
  /** Allow the shared-fret shapes share12/23/34 (arpeggio lines). Default false. */
  sharedFrets?: boolean;
  /**
   * Places to prefer, pitch by pitch (MIDI → string/fret): every note played
   * elsewhere costs `referenceWeight`. Keeps a melodic-minor descent on the
   * ascent's strings where the notes are shared.
   */
  reference?: ReadonlyMap<number, { stringIndex: number; fret: number }>;
  referenceWeight?: number;
  /**
   * 'low-positions' (default): open strings are free at the start, on
   * openFree notes and in position I, costly higher up. 'avoid': closed-position playing,
   * an open string only where no fretted place reaches the pitch.
   */
  openStrings?: 'low-positions' | 'avoid';
  /**
   * Pin the first / last note to a string and fret — and, when given, to the
   * finger that holds it and the hand position (a turnaround keeps the finger
   * down; the hand may re-spread around it within the same position).
   */
  start?: NotePin;
  end?: NotePin;
}

export interface NotePin {
  stringIndex: number;
  fret: number;
  finger?: LeftHandFinger;
  position?: number | null;
  /** Exact hand frame (for an open string: the frame the hand holds while it sounds). */
  frame?: HandFrame | null;
}

// ─── Frames ─────────────────────────────────────────────────────────────────

const FRAME_OFFSETS: Record<HandFrameKind, readonly [number, number, number, number]> = {
  compact: [0, 1, 2, 3],
  stretchUp: [0, 1, 2, 4],
  spreadUp: [0, 1, 3, 4],
  stretchDown: [0, 2, 3, 4],
  share12: [0, 0, 1, 2],
  share23: [0, 1, 1, 2],
  share34: [0, 1, 2, 2],
  share23Up: [0, 1, 1, 3],
};
const FRAME_KINDS: readonly HandFrameKind[] = ['compact', 'stretchUp', 'spreadUp', 'stretchDown'];
const SHARED_KINDS: readonly HandFrameKind[] = ['share12', 'share23', 'share34', 'share23Up'];
/** Fingers that reach outside the compact window in each frame (1-based). */
const REACHING: Record<HandFrameKind, ReadonlySet<number>> = {
  compact: new Set(),
  stretchUp: new Set([4]),
  spreadUp: new Set([3, 4]),
  stretchDown: new Set([1]),
  share12: new Set(),
  share23: new Set(),
  share34: new Set(),
  share23Up: new Set([4]),
};

export function makeFrame(kind: HandFrameKind, firstFret: number): HandFrame {
  const o = FRAME_OFFSETS[kind];
  return {
    kind,
    frets: [firstFret + o[0], firstFret + o[1], firstFret + o[2], firstFret + o[3]],
    position: kind === 'stretchDown' ? firstFret + 1 : firstFret,
  };
}

const frameId = (f: HandFrame | null) => (f === null ? '-' : `${f.kind}@${f.frets[0]}`);

/** Every frame that holds `fret`, in a fixed order (compact first, low first; shared shapes last). */
function framesHolding(fret: number, maxFret: number, shared: boolean): HandFrame[] {
  const out: HandFrame[] = [];
  const seen = new Set<string>();
  for (const kind of shared ? [...FRAME_KINDS, ...SHARED_KINDS] : FRAME_KINDS) {
    const o = FRAME_OFFSETS[kind];
    for (let j = 0; j < 4; j++) {
      const first = fret - o[j];
      if (first < 1 || first + o[3] > maxFret) continue;
      const frame = makeFrame(kind, first);
      if (seen.has(frameId(frame))) continue;
      seen.add(frameId(frame));
      out.push(frame);
    }
  }
  return out;
}

/** The finger (1–4) a frame puts on `fret`, or 0 when no finger is there (the lower one on a shared fret). */
export function fingerInFrame(frame: HandFrame, fret: number): LeftHandFinger {
  const i = frame.frets.indexOf(fret);
  return (i < 0 ? 0 : i + 1) as LeftHandFinger;
}

/** Every finger a frame puts on `fret` (two on a shared fret). */
function fingersInFrame(frame: HandFrame, fret: number): LeftHandFinger[] {
  const out: LeftHandFinger[] = [];
  frame.frets.forEach((f, i) => {
    if (f === fret) out.push((i + 1) as LeftHandFinger);
  });
  return out;
}

// ─── Costs ──────────────────────────────────────────────────────────────────

const COST = {
  shiftGuide: 30,
  shiftIndex: 30,
  shiftIndexFrom2: 40,
  shiftOpen: 12,
  shiftJump: 45,
  perFretSlid: 4,
  perFretIndex: 3,
  perPositionIndex: 1,
  perPositionOpen: 2,
  maxShift: 7,
  backToBack: 25,
  repeatSlide: 60,
  barre: 15,
  shared: 3,
  stretch: 10,
  stretchLow: 6,
  crossing: 4,
  skip: 15,
  openMid: 15,
  openHigh: 30,
  height: 1,
} as const;

function openStringCost(free: boolean, frame: HandFrame | null, freeUpTo: number): number {
  if (free || frame === null || frame.position <= freeUpTo) return 0;
  return frame.position <= 4 ? COST.openMid : COST.openHigh;
}

function stretchCost(frame: HandFrame, finger: number): number {
  if (!REACHING[frame.kind].has(finger)) return 0;
  return COST.stretch + (frame.position < 5 ? COST.stretchLow : 0);
}

// ─── Search ─────────────────────────────────────────────────────────────────

interface Held {
  s: number;
  f: number;
  finger: LeftHandFinger;
}

interface State {
  s: number;
  f: number;
  finger: LeftHandFinger;
  frame: HandFrame | null;
  cost: number;
  prev: number; // index into the previous layer, −1 for the first note
  shift: Shift | null;
  /** The notes of the current ringing group so far, this one included (empty outside groups). */
  held: Held[];
}

/**
 * Can `n` join the notes `held` of its ringing group (all held at once)?
 * Returns the extra cost (a barré), or null when no hand can hold the grip.
 */
function joinGroup(held: readonly Held[], n: Held): number | null {
  let cost = 0;
  for (const m of held) {
    if (m.s === n.s) return null;
    if (m.f === 0 || n.f === 0 || m.f !== n.f) continue;
    if (m.finger === n.finger) {
      if (n.finger >= 2) return null; // the 2nd–4th finger cannot stop two strings
      const lo = Math.min(m.s, n.s);
      const hi = Math.max(m.s, n.s);
      // An index barré lies across every string between its ends.
      if (held.some((x) => x.s > lo && x.s < hi && x.f < n.f)) return null;
      cost += COST.barre;
    } else if (Math.sign(n.s - m.s) !== Math.sign(n.finger - m.finger)) {
      return null; // two fingers on one fret: the lower string takes the lower finger
    }
  }
  return cost;
}

const heldKey = (held: readonly Held[]) => held.map((h) => `${h.s}.${h.f}.${h.finger}`).join(',');

/**
 * Classify the hand move from `p` to a fretted note `(s, f, finger)` in
 * `frame`; null when no sensible shift exists.
 */
function shiftBetween(
  p: State,
  s: number,
  f: number,
  finger: LeftHandFinger,
  frame: HandFrame,
  dir: number,
  fingerChange: boolean,
  jumpOk: boolean,
): { shift: Shift; cost: number } | null {
  const from = p.frame!;
  if (from.position === frame.position) return null; // one frame per position
  const moved = Math.abs(frame.position - from.position);
  if (moved > COST.maxShift) return null;
  const base = { fromPosition: from.position, toPosition: frame.position };
  if (p.f === 0) {
    return {
      shift: { ...base, kind: 'open', stringIndex: p.s, finger },
      cost: COST.shiftOpen + COST.perPositionOpen * moved,
    };
  }
  if (p.s !== s) {
    return jumpOk
      ? { shift: { ...base, kind: 'jump', stringIndex: s, finger }, cost: COST.shiftJump + 4 * moved }
      : null;
  }
  if (p.finger === finger) {
    return {
      shift: { ...base, kind: 'guide', stringIndex: s, finger },
      cost: COST.shiftGuide + COST.perFretSlid * Math.abs(f - p.f),
    };
  }
  const up = dir > 0 && finger === 1 && p.finger >= 2;
  const down = dir < 0 && p.finger === 1 && finger >= 2;
  if (up || down) {
    const other = up ? p.finger : finger;
    return {
      shift: { ...base, kind: 'index', stringIndex: s, finger },
      cost:
        (other === 2 ? COST.shiftIndexFrom2 : COST.shiftIndex) +
        COST.perFretIndex * Math.abs(f - p.f) +
        COST.perPositionIndex * moved,
    };
  }
  if (fingerChange) {
    return {
      shift: { ...base, kind: 'change', stringIndex: s, finger },
      cost: COST.shiftIndex + COST.perFretIndex * Math.abs(f - p.f) + COST.perPositionIndex * moved,
    };
  }
  return null;
}

/** App octave convention: the octave of the sounding pitch class. */
function pitchedOf(p: LinePitch): PitchedNote {
  return { ...p.note, octave: Math.floor((p.midi - 12) / 12) };
}

/**
 * The cheapest playable fingering of `line`, or null when none exists (a
 * pitch off the neck, or no sensible shift between two notes).
 */
export function fingerLine(line: readonly LinePitch[], options: FingeringOptions = {}): FingeredNote[] | null {
  return fingerLineScored(line, options)?.notes ?? null;
}

/** As fingerLine, with the total cost of the fingering (to compare alternatives). */
export function fingerLineScored(
  line: readonly LinePitch[],
  options: FingeringOptions = {},
): { notes: FingeredNote[]; cost: number } | null {
  if (line.length === 0) return { notes: [], cost: 0 };
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const maxStep = options.maxStringStep ?? 1;
  const refWeight = options.referenceWeight ?? 5;
  const openPolicy = options.openStrings ?? 'low-positions';
  const freeUpTo = options.openFreeUpTo ?? 1;
  const fingerChange = options.fingerChangeShifts ?? false;
  const littleRoot = options.littleFingerRootCost ?? 0;
  const shared = options.sharedFrets ?? false;
  const open = tuningOpenMidi(tuning);

  const layers: State[][] = [];
  for (let i = 0; i < line.length; i++) {
    const { midi } = line[i];
    const prevLayer = i > 0 ? layers[i - 1] : null;
    const dir = i > 0 ? Math.sign(midi - line[i - 1].midi) : 0;
    const pin = i === 0 ? options.start : i === line.length - 1 ? options.end : undefined;
    // Two notes of one ringing group never share a string.
    const sameGroup = i > 0 && line[i].group !== undefined && line[i].group === line[i - 1].group;
    const layer: State[] = [];
    const index = new Map<string, number>();
    const offer = (st: State) => {
      const key = `${st.s}:${st.f}:${st.finger}:${frameId(st.frame)}:${heldKey(st.held)}`;
      const at = index.get(key);
      if (at === undefined) {
        index.set(key, layer.length);
        layer.push(st);
      } else if (st.cost < layer[at].cost) {
        layer[at] = st;
      }
    };

    for (let s = 0; s < open.length; s++) {
      const f = midi - open[s];
      if (f < 0 || f > maxFret) continue;
      if (pin && (pin.stringIndex !== s || pin.fret !== f)) continue;
      const ref = options.reference?.get(midi);
      const refCost = ref && (ref.stringIndex !== s || ref.fret !== f) ? refWeight : 0;

      if (f === 0) {
        // Closed-position style: an open string only when nothing can fret the pitch.
        if (openPolicy === 'avoid' && open.some((o) => midi - o >= 1 && midi - o <= maxFret)) continue;
        // Open string: the hand keeps whatever frame it had.
        if (prevLayer === null) {
          offer({ s, f, finger: 0, frame: pin?.frame ?? null, cost: refCost, prev: -1, shift: null, held: line[i].group === undefined ? [] : [{ s, f, finger: 0 }] });
          continue;
        }
        prevLayer.forEach((p, pi) => {
          if (!stringStepOk(p.s, s, dir, line[i].leap ?? maxStep)) return;
          const me: Held = { s, f, finger: 0 };
          const join = sameGroup ? joinGroup(p.held, me) : 0;
          if (join === null) return;
          if (pin?.position !== undefined && (p.frame?.position ?? null) !== pin.position) return;
          if (pin?.frame !== undefined && frameId(pin.frame) !== frameId(p.frame)) return;
          const cost = p.cost + join + refCost + crossingCost(p.s, s) + openStringCost(line[i].openFree === true, p.frame, freeUpTo);
          const held = line[i].group === undefined ? [] : sameGroup ? [...p.held, me] : [me];
          offer({ s, f, finger: 0, frame: p.frame, cost, prev: pi, shift: null, held });
        });
        continue;
      }

      for (const frame of pin?.frame ? [pin.frame] : framesHolding(f, maxFret, shared)) {
       for (const finger of fingersInFrame(frame, f)) {
        if (pin?.finger !== undefined && pin.finger !== finger) continue;
        if (pin?.position !== undefined && pin.position !== frame.position) continue;
        const rootCost = i === 0 && finger === 4 && line[i].root ? littleRoot : 0;
        const sharedCost = fingersInFrame(frame, f).length > 1 ? COST.shared : 0;
        const own = refCost + rootCost + sharedCost + stretchCost(frame, finger) + COST.height * frame.position;
        const me: Held = { s, f, finger };
        if (prevLayer === null) {
          offer({ s, f, finger, frame, cost: own, prev: -1, shift: null, held: line[i].group === undefined ? [] : [me] });
          continue;
        }
        prevLayer.forEach((p, pi) => {
          if (!stringStepOk(p.s, s, dir, line[i].leap ?? maxStep)) return;
          const join = sameGroup ? joinGroup(p.held, me) : 0;
          if (join === null) return;
          // A ringing group is held in one hand shape: no shift inside it.
          if (sameGroup && p.frame !== null && frameId(p.frame) !== frameId(frame)) return;
          let cost = p.cost + own + join + crossingCost(p.s, s);
          // Same fret, next string, same finger: a roll (fingers 2–4, never)
          // or a partial barré (the index, costed). Two fingers on one fret
          // (a shared shape): the lower string takes the lower finger.
          if (p.f === f && p.s !== s && p.f > 0) {
            if (p.finger === finger) {
              if (finger >= 2) return;
              cost += COST.barre;
            } else if (Math.sign(s - p.s) !== Math.sign(finger - p.finger)) {
              return;
            }
          }
          let shift: Shift | null = null;
          if (p.frame !== null && frameId(p.frame) !== frameId(frame)) {
            const move = shiftBetween(p, s, f, finger, frame, dir, fingerChange, line[i].jumpOk === true);
            if (move === null) return;
            cost += move.cost + (p.shift !== null ? COST.backToBack : 0);
            if (p.shift?.kind === 'guide' && move.shift.kind === 'guide' && p.shift.finger === move.shift.finger) {
              cost += COST.repeatSlide;
            }
            shift = move.shift;
          }
          const held = line[i].group === undefined ? [] : sameGroup ? [...p.held, me] : [me];
          offer({ s, f, finger, frame, cost, prev: pi, shift, held });
        });
       }
      }
    }
    if (layer.length === 0) return null;
    layers.push(layer);
  }

  // Cheapest final state (first in enumeration order on ties).
  const last = layers[layers.length - 1];
  let best = 0;
  for (let k = 1; k < last.length; k++) if (last[k].cost < last[best].cost) best = k;

  const path: State[] = [];
  for (let i = layers.length - 1, k = best; i >= 0; i--) {
    const st = layers[i][k];
    path.push(st);
    k = st.prev;
  }
  path.reverse();

  let segment = 0;
  const notes = annotateGroupBarres(annotateBarres(
    path.map((st, i) => {
      if (st.shift) segment++;
      return {
        midi: line[i].midi,
        note: line[i].note,
        pitched: pitchedOf(line[i]),
        stringIndex: st.s,
        fret: st.f,
        finger: st.finger,
        position: st.frame?.position ?? null,
        frame: st.frame,
        segment,
        shift: st.shift,
        reach: null,
        barre: false,
      };
    }),
  ), line);
  return { notes, cost: last[best].cost };
}

/** Flag both notes of every index barré inside a ringing group. */
function annotateGroupBarres(notes: FingeredNote[], line: readonly LinePitch[]): FingeredNote[] {
  return notes.map((n, i) => {
    const g = line[i].group;
    if (g === undefined || n.barre || n.finger !== 1 || n.fret === 0) return n;
    const partner = notes.some((m, j) => j !== i && line[j].group === g && m.finger === 1 && m.fret === n.fret && m.stringIndex !== n.stringIndex);
    return partner ? { ...n, barre: true } : n;
  });
}

/**
 * Flag the partial barrés of a fingered passage: a note the index takes at the
 * same fret as the note before, on another string. Recomputed on the final
 * order (a reversed or joined passage pairs its notes differently).
 */
export function annotateBarres(notes: readonly FingeredNote[]): FingeredNote[] {
  return notes.map((n, i) => {
    const p = i > 0 ? notes[i - 1] : null;
    const barre = p !== null && n.fret > 0 && p.fret === n.fret && p.stringIndex !== n.stringIndex && p.finger === 1 && n.finger === 1;
    return n.barre === barre ? n : { ...n, barre };
  });
}

function stringStepOk(from: number, to: number, dir: number, maxStep: number): boolean {
  if (Math.abs(to - from) > maxStep) return false;
  if (dir > 0) return to >= from; // a higher pitch never moves to a lower string
  if (dir < 0) return to <= from;
  return true;
}

function crossingCost(from: number, to: number): number {
  const d = Math.abs(to - from);
  if (d === 0) return 0;
  return COST.crossing + (d > 1 ? COST.skip * (d - 1) : 0);
}

/**
 * The fingered passage played backwards: same places, shifts re-attached to
 * the note they now lead to. (Reaches are added by callers after reversing —
 * fingerLine never produces one — so the result carries none.)
 */
export function reverseFingering(notes: readonly FingeredNote[]): FingeredNote[] {
  const rev = [...notes].reverse();
  const lastSegment = notes.length > 0 ? notes[notes.length - 1].segment : 0;
  let carried: HandFrame | null = null;
  const reversed = rev.map((n, i) => {
    // In reverse, the shift that led INTO note k now leads OUT of it into the
    // note before it (now after it).
    const leading = i > 0 ? rev[i - 1].shift : null;
    // An open-string start (hand not yet placed) becomes an open-string END:
    // the hand is still where the previous note left it.
    const frame = n.frame ?? carried;
    carried = frame;
    return {
      ...n,
      frame,
      position: frame?.position ?? null,
      segment: lastSegment - n.segment,
      reach: null,
      shift: leading
        ? {
            kind: leading.kind,
            fromPosition: leading.toPosition,
            toPosition: leading.fromPosition,
            stringIndex: leading.stringIndex,
            finger: leading.kind === 'guide' ? leading.finger : n.finger,
          }
        : null,
    };
  });
  return annotateBarres(reversed);
}
