// The Grade-5 technical set on the classical guitar (audit W10-03, decision
// D-04: syllabus-neutral — the items common to ABRSM, Trinity, LCM and the
// Madeira EAE programme, audit Track G R3/R9/R12/R16):
//
//   • scales in 3rds, 6ths, octaves and 10ths, broken and together;
//   • the chromatic scale;
//   • broken chords;
//   • tonic arpeggios (major / minor);
//   • the dominant-7th arpeggio of a key, resolving on the tonic;
//   • the diminished-7th arpeggio on a note.
//
// Patterns follow the ABRSM guitar syllabus (from 2019), pp. 10 and 14–15,
// read from the score examples themselves:
//   • 3rds and 10ths begin with the tonic as the lower note, 6ths with the
//     tonic as the UPPER note (p. 10); octaves with the tonic below;
//   • broken intervals play each pair low → high, going up and coming down;
//   • the dominant 7th climbs 1 3 5 7 … to the top root, comes down to the 3rd
//     (the leading note) and resolves up a semitone to the tonic;
//   • a broken chord climbs in groups of three chord tones, each group from its
//     lowest note: going up from 1, 3, 5 and the top 1; coming down from the 5
//     and the 3 below it; then the tonic alone;
//   • the chromatic scale is written with sharps going up, flats coming down.
//
// Right hand (TechniqueExercise.rightHand, TechniqueEvent.rh): ABRSM asks for
// tirando everywhere except fingers-only scales, and arpeggios / dominant /
// diminished sevenths "without over-ringing", broken chords "with
// over-ringing" (pp. 10, 24); Trinity Grade 5 gives the fingers — arpeggios
// ppppima, dominant and diminished 7ths ppimim…, sixths ip/mp, broken thirds im
// (Trinity Digital Grades technical work, 2023). Where a syllabus names the
// fingering for one item only, its extension to the others is marked
// basis: 'inferred'.
//
// Left hand: single lines are fingered by guitarFingering.ts (arpeggio lines
// with its arpeggio rules — no finger rolled across strings, the index as a
// flagged partial barré, chord-grip shapes with two fingers on one fret, a
// finger change allowed when the hand slides along a string, open strings
// welcome up to position IV, no little finger on the bass root where
// avoidable), double stops by the dyad search below.
//
// Pure and framework-agnostic.

import type { ChordQuality, Note, ScaleType } from '../types/music';
import type { GuitarTuning } from '../constants/guitarTunings';
import { TUNING_STANDARD } from '../constants/guitarTunings';
import { getPitchClass } from '../constants/notes';
import { buildChord, CHORD_FORMULAS } from '../constants/chords';
import { SCALE_FORMULAS, buildScale } from '../constants/scales';
import { spellDegree, parseDegree } from './degreeSpelling';
import { GUITAR_MAX_FRET, tuningOpenMidi } from './guitarPositions';
import type { LeftHandFinger } from './guitarPositions';
import { annotateBarres, fingerLine, reverseFingering } from './guitarFingering';
import type { FingeredNote, FingeringOptions, LinePitch, Shift } from './guitarFingering';
import { lowestTonicMidi, highestMidi, ROUTE_SCALE_TYPES } from './scaleRoutes';

export type IntervalKind = 'thirds' | 'sixths' | 'octaves' | 'tenths';

export type TechniqueKind =
  | IntervalKind
  | 'chromatic'
  | 'brokenChord'
  | 'tonicArpeggio'
  | 'dominantSeventh'
  | 'diminishedSeventh';

export type RightHandFingerName = 'p' | 'i' | 'm' | 'a';
export type RightHandStroke = 'tirando' | 'apoyando';

export interface TechniqueRightHand {
  /** Strokes the syllabus accepts. */
  strokes: RightHandStroke[];
  /** Whether notes may ring on: false = "without over-ringing", true = "with", null = not specified. */
  overRinging: boolean | null;
  /** The fingering in syllabus notation ('ppppima', 'ip/mp', 'im', 'p + im', 'by string'). */
  pattern: string;
  /** 'syllabus' = stated for this item; 'inferred' = our extension of a stated pattern. */
  basis: 'syllabus' | 'inferred';
  source: string;
}

/** One thing to play: a single note, or two at once (a double stop). */
export interface TechniqueEvent {
  /** Low → high. */
  notes: FingeredNote[];
  /** Degree of each note: scale degree (interval scales), chord tone 1/3/5/7 (arpeggios, broken chords), semitone step 1–12 (chromatic); 0 = resolution. */
  degrees: number[];
  /** Right-hand finger for each note. */
  rh: RightHandFingerName[];
}

export interface TechniqueExercise {
  kind: TechniqueKind;
  style: 'broken' | 'together' | 'line';
  root: Note;
  /** The scale (interval scales), the key (arpeggios, broken chords) or 'chromatic'. */
  scaleType: ScaleType;
  /** Arpeggios and broken chords: the chord (the dominant for 'dominantSeventh'). */
  chord: { root: Note; quality: ChordQuality } | null;
  octaves: number;
  /** MIDI of the first (lowest) note. */
  startMidi: number;
  /** In playing order: up, then down (and the resolution, for the dominant 7th). */
  events: TechniqueEvent[];
  /** How many of `events` belong to the way up. */
  ascendingCount: number;
  rightHand: TechniqueRightHand;
}

export interface TechniqueOptions {
  octaves?: number;
  tuning?: GuitarTuning;
  maxFret?: number;
  openStrings?: 'low-positions' | 'avoid';
}

const ABRSM = 'ABRSM guitar syllabus from 2019, pp. 10, 14–15, 24';
const TRINITY = 'Trinity Digital Grades guitar technical work (2023), Grade 5';

/** Left-hand rules for arpeggio-like lines (guitarFingering.ts). */
const ARPEGGIO_RULES: FingeringOptions = {
  maxStringStep: 1,
  fingerChangeShifts: true,
  sharedFrets: true,
  openFreeUpTo: 4,
  littleFingerRootCost: 60,
};

interface Tone extends LinePitch {
  degree: number;
}

// ─── Right-hand helpers ─────────────────────────────────────────────────────

/** i m i m … (or any pair), `count` long, continuing from `offset`. */
function alternate(count: number, pair: readonly [RightHandFingerName, RightHandFingerName] = ['i', 'm'], offset = 0): RightHandFingerName[] {
  return Array.from({ length: count }, (_, k) => pair[(k + offset) % 2]);
}

/** The classical string rule: thumb on the 6th–4th strings, i on the 3rd, m on the 2nd, a on the 1st. */
export function rhByString(stringIndex: number): RightHandFingerName {
  return stringIndex <= 2 ? 'p' : stringIndex === 3 ? 'i' : stringIndex === 4 ? 'm' : 'a';
}

/**
 * Thumb and fingers combined (ABRSM ◆: thumb for the lower octave, fingers for
 * the upper octave): p below `split`, alternating i m from `split` up.
 */
export function rhThumbAndFingers(midis: readonly number[], split: number): RightHandFingerName[] {
  let k = 0;
  return midis.map((m) => (m < split ? 'p' : (['i', 'm'] as const)[k++ % 2]));
}

/**
 * Right hand for a scale route: fingers only (alternating i m or m a; ABRSM
 * and Trinity — from Grade 5 prepared tirando AND apoyando), or thumb and
 * fingers combined (ABRSM ◆; tirando).
 */
export function scaleRightHand(
  midis: readonly number[],
  scheme: 'im' | 'ma' | 'thumbAndFingers',
): { fingers: RightHandFingerName[]; strokes: RightHandStroke[] } {
  if (scheme === 'thumbAndFingers') {
    return { fingers: rhThumbAndFingers(midis, Math.min(...midis) + 12), strokes: ['tirando'] };
  }
  return { fingers: alternate(midis.length, scheme === 'im' ? ['i', 'm'] : ['m', 'a']), strokes: ['tirando', 'apoyando'] };
}

// ─── Interval scales ────────────────────────────────────────────────────────

const INTERVALS: Record<IntervalKind, { steps: number; gaps: readonly number[]; tonic: 'lower' | 'upper' }> = {
  thirds: { steps: 2, gaps: [1], tonic: 'lower' },
  sixths: { steps: 5, gaps: [2], tonic: 'upper' },
  octaves: { steps: 7, gaps: [2], tonic: 'lower' },
  tenths: { steps: 9, gaps: [3], tonic: 'lower' },
};

/** Scale tone at step j from the tonic at `tonicMidi` (j may be negative). */
function toneAt(root: Note, type: ScaleType, tonicMidi: number, j: number): Tone {
  const notes = buildScale(root, type).notes;
  const semis = SCALE_FORMULAS[type];
  const d = ((j % 7) + 7) % 7;
  const o = Math.floor(j / 7);
  return { midi: tonicMidi + 12 * o + semis[d], note: notes[d], degree: d + 1, openFree: d === 0 };
}

/**
 * The pairs of an interval scale. With the tonic as the lower note, the lower
 * voice climbs from the tonic to the tonic `octaves` higher; with the tonic as
 * the upper note (6ths), the upper voice does. Coming down, the pairs return
 * without repeating the top one. Melodic minor goes up melodic and comes down
 * natural (W10-09).
 */
function intervalPairs(root: Note, type: ScaleType, steps: number, tonic: 'lower' | 'upper', octaves: number, tonicMidi: number) {
  const n = 7 * octaves + 1;
  const offset = tonic === 'lower' ? 0 : -steps;
  const downType: ScaleType = type === 'melodic_minor' ? 'natural_minor' : type;
  const pair = (t: ScaleType, i: number) => [toneAt(root, t, tonicMidi, offset + i), toneAt(root, t, tonicMidi, offset + i + steps)] as const;
  const up = Array.from({ length: n }, (_, i) => pair(type, i));
  const down = Array.from({ length: n - 1 }, (_, k) => pair(downType, n - 2 - k));
  return { up, down };
}

/**
 * A scale in 3rds, 6ths, octaves or 10ths, together (double stops) or broken
 * (each pair low → high, going up and coming down — ABRSM's examples). 3rds,
 * 10ths and octaves begin with the tonic as the lower note, 6ths with the
 * tonic as the upper note (ABRSM p. 10); `tonicVoice` overrides.
 *
 * Broken intervals are fingered with the double-stop hand shapes (the hand
 * holds the shape and plays its notes in turn). One octave by default, from
 * the lowest playable pair — an octave higher when the bottom pairs cannot be
 * stopped (3rds and 6ths in E and F minor: nothing but the 6th string reaches
 * G♯2 / A♭2). Null when the neck cannot hold it or the scale is not heptatonic.
 */
export function intervalScale(
  root: Note,
  type: ScaleType,
  kind: IntervalKind,
  style: 'broken' | 'together',
  options: TechniqueOptions & { tonicVoice?: 'lower' | 'upper' } = {},
): TechniqueExercise | null {
  if (!ROUTE_SCALE_TYPES.includes(type)) return null;
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const octaves = options.octaves ?? 1;
  const { steps, gaps } = INTERVALS[kind];
  const tonicVoice = options.tonicVoice ?? INTERVALS[kind].tonic;
  const lowestOpen = Math.min(...tuningOpenMidi(tuning));
  const top = highestMidi(tuning, maxFret);

  for (let k = 0; k < 4; k++) {
    const tonicMidi = lowestTonicMidi(root, tuning) + 12 * k;
    const { up, down } = intervalPairs(root, type, steps, tonicVoice, octaves, tonicMidi);
    const all = [...up, ...down];
    if (Math.max(...all.map(([, hi]) => hi.midi)) > top) return null;
    if (Math.min(...all.map(([lo]) => lo.midi)) < lowestOpen) continue;
    const dyads = fingerDyads(all, gaps, { tuning, maxFret, openStrings: options.openStrings });
    if (dyads === null) continue;
    const degreesOf = (i: number) => [all[i][0].degree, all[i][1].degree];
    const syllabus = (kind === 'sixths' && style === 'together') || (kind === 'thirds' && style === 'broken');
    const rightHand: TechniqueRightHand = {
      strokes: ['tirando'],
      overRinging: null,
      pattern: style === 'together' ? 'ip/mp' : 'im',
      basis: syllabus ? 'syllabus' : 'inferred',
      source: `${TRINITY} (sixths ip/mp, broken thirds im); ${ABRSM} (interval scales tirando)`,
    };
    const base = { kind, style, root, scaleType: type, chord: null, octaves, startMidi: all[0][0].midi, rightHand } as const;
    if (style === 'together') {
      const upper = alternate(dyads.length);
      const events = dyads.map((pair, i) => ({ notes: pair, degrees: degreesOf(i), rh: ['p', upper[i]] as RightHandFingerName[] }));
      return { ...base, events, ascendingCount: up.length };
    }
    // Broken: low then high, both ways; a shift belongs to the note played first.
    const rh = alternate(2 * dyads.length);
    const events: TechniqueEvent[] = dyads.flatMap(([lo, hi], i) => [
      { notes: [lo], degrees: [degreesOf(i)[0]], rh: [rh[2 * i]] },
      { notes: [{ ...hi, shift: null }], degrees: [degreesOf(i)[1]], rh: [rh[2 * i + 1]] },
    ]);
    return { ...base, events, ascendingCount: 2 * up.length };
  }
  return null;
}

// ─── Double stops ───────────────────────────────────────────────────────────
//
// A double stop is two notes on two strings at once. The hand is in a
// position p (index finger over fret p); finger k sits at its home fret
// p+k−1, or one fret lower so it can share a fret with the finger below on
// the next string (two fingertips side by side, as in the open A-major grip),
// or — the 4th finger only — one fret higher (a stretch), or — the index only
// — one fret lower (a reach back). Two fingers never span more frets than
// they are apart plus one (|fret gap| − |finger gap| ≤ 1: the 3rd and 4th
// fingers cannot hold frets 4 and 7). While the hand stays in a position no
// finger moves to another fret; it changes position only with a guide finger
// that keeps its string and slides, or — 'shape' — by moving the same
// two-finger shape to the next pair of strings (how an octave scale crosses
// from strings 5–3 to 4–2), at most 3 positions. Costs as for single lines
// where they apply (guitarFingering.ts), plus 4 for a shared fret, 4 per
// string the pair moves, and 3 per fret above the 9th (keeps an octave scale
// from climbing one string pair to the top of the neck when the next pair
// lies under the hand).

interface DyadState {
  sLow: number;
  fLow: number;
  kLow: LeftHandFinger;
  sHigh: number;
  fHigh: number;
  kHigh: LeftHandFinger;
  /** Hand position; null when both notes are open strings. */
  p: number | null;
  cost: number;
  prev: number;
  shift: Shift | null;
}

/** Offsets of a finger from its home fret that the dyad model allows. */
function fingerOffsets(k: number): number[] {
  if (k === 1) return [0, -1];
  if (k === 4) return [0, -1, 1];
  return [0, -1];
}

/** Hand positions under which finger k may press fret f. */
function positionsFor(k: number, f: number): number[] {
  return fingerOffsets(k).map((o) => f - (k - 1) - o);
}

function fingerDyads(
  pairs: readonly (readonly [LinePitch, LinePitch])[],
  gaps: readonly number[],
  opts: { tuning: GuitarTuning; maxFret: number; openStrings?: 'low-positions' | 'avoid' },
): FingeredNote[][] | null {
  const open = tuningOpenMidi(opts.tuning);
  const avoidOpen = opts.openStrings === 'avoid';
  const reachable = (midi: number) => open.some((o) => midi - o >= 1 && midi - o <= opts.maxFret);
  const layers: DyadState[][] = [];

  for (let i = 0; i < pairs.length; i++) {
    const [lo, hi] = pairs[i];
    const layer: DyadState[] = [];
    const index = new Map<string, number>();
    const offer = (st: DyadState) => {
      const key = `${st.sLow}:${st.kLow}:${st.kHigh}:${st.p}`;
      const at = index.get(key);
      if (at === undefined) {
        index.set(key, layer.length);
        layer.push(st);
      } else if (st.cost < layer[at].cost) layer[at] = st;
    };
    for (let sLow = 0; sLow < open.length; sLow++) {
      for (const gap of gaps) {
        const sHigh = sLow + gap;
        if (sHigh >= open.length) continue;
        const fLow = lo.midi - open[sLow];
        const fHigh = hi.midi - open[sHigh];
        if (fLow < 0 || fHigh < 0 || fLow > opts.maxFret || fHigh > opts.maxFret) continue;
        if (avoidOpen && ((fLow === 0 && reachable(lo.midi)) || (fHigh === 0 && reachable(hi.midi)))) continue;
        for (const shape of dyadShapes(fLow, fHigh)) {
          const own =
            shape.squeeze * 4 + shape.stretch * (10 + ((shape.p ?? 5) < 5 ? 6 : 0)) + (shape.p ?? 0) +
            3 * (Math.max(0, fLow - 9) + Math.max(0, fHigh - 9)) +
            openCost(fLow, lo, shape.p) + openCost(fHigh, hi, shape.p);
          const base = { sLow, fLow, kLow: shape.kLow, sHigh, fHigh, kHigh: shape.kHigh, p: shape.p };
          if (i === 0) {
            offer({ ...base, cost: own, prev: -1, shift: null });
            continue;
          }
          layers[i - 1].forEach((prev, pi) => {
            const move = dyadMove(prev, base);
            if (move === null) return;
            offer({ ...base, cost: prev.cost + own + move.cost + 4 * Math.abs(sLow - prev.sLow), prev: pi, shift: move.shift });
          });
        }
      }
    }
    if (layer.length === 0) return null;
    layers.push(layer);
  }

  const last = layers[layers.length - 1];
  let best = 0;
  for (let k = 1; k < last.length; k++) if (last[k].cost < last[best].cost) best = k;
  const path: DyadState[] = [];
  for (let i = layers.length - 1, k = best; i >= 0; i--) {
    path.push(layers[i][k]);
    k = layers[i][k].prev;
  }
  path.reverse();

  let segment = 0;
  return path.map((st, i) => {
    if (st.shift) segment++;
    const [lo, hi] = pairs[i];
    const mk = (p: LinePitch, s: number, f: number, k: LeftHandFinger): FingeredNote => ({
      midi: p.midi,
      note: p.note,
      pitched: { ...p.note, octave: Math.floor((p.midi - 12) / 12) },
      stringIndex: s,
      fret: f,
      finger: k,
      position: st.p,
      frame: null,
      segment,
      shift: st.shift,
      reach: null,
      barre: false,
    });
    return [mk(lo, st.sLow, st.fLow, st.kLow), mk(hi, st.sHigh, st.fHigh, st.kHigh)];
  });
}

function openCost(fret: number, p: LinePitch, position: number | null): number {
  if (fret !== 0 || p.openFree || position === null || position <= 1) return 0;
  return position <= 4 ? 15 : 30;
}

interface DyadShape {
  kLow: LeftHandFinger;
  kHigh: LeftHandFinger;
  p: number | null;
  squeeze: number;
  stretch: number;
}

/** Every way to finger frets (fLow, fHigh) on two strings, in a fixed order. */
function dyadShapes(fLow: number, fHigh: number): DyadShape[] {
  const out: DyadShape[] = [];
  if (fLow === 0 && fHigh === 0) return [{ kLow: 0, kHigh: 0, p: null, squeeze: 0, stretch: 0 }];
  const options = (f: number): { k: LeftHandFinger; ps: number[] }[] =>
    f === 0 ? [{ k: 0, ps: [] }] : ([1, 2, 3, 4] as const).map((k) => ({ k, ps: positionsFor(k, f) }));
  for (const a of options(fLow)) {
    for (const b of options(fHigh)) {
      if (a.k !== 0 && a.k === b.k) continue; // one finger, one note
      if (a.k !== 0 && b.k !== 0) {
        // Fingers rise with the fret; on one fret the lower string takes the lower finger.
        if (fHigh > fLow && b.k < a.k) continue;
        if (fHigh < fLow && b.k > a.k) continue;
        if (fHigh === fLow && b.k !== a.k + 1) continue;
        // Two fingers reach at most one fret beyond their own distance.
        if (Math.abs(fHigh - fLow) - Math.abs(b.k - a.k) >= 2) continue;
      }
      const candidates = a.k === 0 ? b.ps : b.k === 0 ? a.ps : a.ps.filter((p) => b.ps.includes(p));
      for (const p of [...new Set(candidates)].sort((x, y) => x - y)) {
        if (p < 1) continue;
        const dev = (k: number, f: number) => (k === 0 ? 0 : f - (p + k - 1));
        const dl = dev(a.k, fLow);
        const dh = dev(b.k, fHigh);
        const squeeze = (dl === -1 && a.k > 1 ? 1 : 0) + (dh === -1 && b.k > 1 ? 1 : 0);
        const stretch = (dl === 1 || (dl === -1 && a.k === 1) ? 1 : 0) + (dh === 1 || (dh === -1 && b.k === 1) ? 1 : 0);
        out.push({ kLow: a.k, kHigh: b.k, p, squeeze, stretch });
      }
    }
  }
  return out;
}

/** The hand move between two double stops, or null when it has no guide. */
function dyadMove(
  prev: DyadState,
  next: Omit<DyadState, 'cost' | 'prev' | 'shift'>,
): { cost: number; shift: Shift | null } | null {
  const fingersOf = (d: Omit<DyadState, 'cost' | 'prev' | 'shift'>) =>
    [
      { k: d.kLow, s: d.sLow, f: d.fLow },
      { k: d.kHigh, s: d.sHigh, f: d.fHigh },
    ].filter((x) => x.k !== 0);
  const a = fingersOf(prev);
  const b = fingersOf(next);
  if (prev.p === null || next.p === null || prev.p === next.p) {
    // The hand stays: no finger may move to another fret.
    for (const x of a) for (const y of b) if (x.k === y.k && x.f !== y.f) return null;
    return { cost: 0, shift: null };
  }
  const moved = Math.abs(next.p - prev.p);
  if (moved > 7) return null;
  const guide = b.find((y) => a.some((x) => x.k === y.k && x.s === y.s));
  if (guide) {
    return {
      cost: 20 + 4 * moved,
      shift: { kind: 'guide', fromPosition: prev.p, toPosition: next.p, stringIndex: guide.s, finger: guide.k },
    };
  }
  // The same two fingers, the same shape, moved to the next pair of strings.
  const sameShape =
    a.length === 2 && b.length === 2 &&
    prev.kLow === next.kLow && prev.kHigh === next.kHigh &&
    next.fHigh - next.fLow === prev.fHigh - prev.fLow &&
    Math.abs(next.sLow - prev.sLow) === 1 &&
    moved <= 3;
  if (!sameShape) return null;
  return {
    cost: 30 + 4 * moved,
    shift: { kind: 'shape', fromPosition: prev.p, toPosition: next.p, stringIndex: next.sLow, finger: next.kLow },
  };
}

// ─── Arpeggios ──────────────────────────────────────────────────────────────

const CHORD_TONE = [1, 3, 5, 7];

/** Chord tone k (0 = root) of a chord from its root at `rootMidi`, any octave. */
function chordToneAt(notes: readonly Note[], semis: readonly number[], rootMidi: number, k: number): Tone {
  const n = notes.length;
  const i = ((k % n) + n) % n;
  return {
    midi: rootMidi + 12 * Math.floor(k / n) + semis[i],
    note: notes[i],
    degree: CHORD_TONE[i],
    openFree: i === 0,
    root: i === 0,
  };
}

function arpeggioRightHand(kind: TechniqueKind, octaves: number, upCount: number, total: number): { rh: RightHandFingerName[]; rightHand: TechniqueRightHand } {
  if (kind === 'tonicArpeggio' && octaves === 2 && upCount === 7) {
    const up: RightHandFingerName[] = ['p', 'p', 'p', 'p', 'i', 'm', 'a'];
    return {
      rh: [...up, ...[...up].reverse().slice(1)],
      rightHand: {
        strokes: ['tirando'],
        overRinging: false,
        pattern: 'ppppima',
        basis: 'syllabus',
        source: `${TRINITY} (arpeggios ppppima, tirando; the descent mirrors it — inferred); ${ABRSM} (tirando, without over-ringing)`,
      },
    };
  }
  if (kind === 'dominantSeventh' || kind === 'diminishedSeventh') {
    return {
      rh: ['p', 'p', ...alternate(total - 2)],
      rightHand: {
        strokes: ['tirando'],
        overRinging: false,
        pattern: 'ppimim…',
        basis: 'syllabus',
        source: `${TRINITY} (ppimim…, read as p p then i m alternating); ${ABRSM} (tirando, without over-ringing)`,
      },
    };
  }
  return {
    rh: [],
    rightHand: {
      strokes: ['tirando'],
      overRinging: false,
      pattern: 'by string',
      basis: 'inferred',
      source: `${ABRSM} (tirando, without over-ringing); fingers by string (p 6–4, i 3, m 2, a 1)`,
    },
  };
}

function arpeggioExercise(
  kind: TechniqueKind,
  root: Note,
  scaleType: ScaleType,
  chordRoot: Note,
  quality: ChordQuality,
  options: TechniqueOptions,
): TechniqueExercise | null {
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const octaves = options.octaves ?? 2;
  const start = lowestTonicMidi(chordRoot, tuning);
  const notes = buildChord(chordRoot, quality).notes;
  const semis = CHORD_FORMULAS[quality];
  const upLine = Array.from({ length: notes.length * octaves + 1 }, (_, k) => chordToneAt(notes, semis, start, k));
  if (upLine[upLine.length - 1].midi > highestMidi(tuning, maxFret)) return null;
  const rules: FingeringOptions = { ...ARPEGGIO_RULES, tuning, maxFret, openStrings: options.openStrings };

  // Up, then down the same way (the ascent reversed, like the scales). The
  // dominant 7th comes down only to its 3rd — the leading note — and resolves
  // up a semitone to the tonic (ABRSM p. 14).
  const up = fingerLine(upLine, rules);
  if (up === null) return null;
  const isDominant = kind === 'dominantSeventh';
  const down = reverseFingering(up).slice(1, isDominant ? -1 : undefined);
  const lineDegrees = [...upLine, ...[...upLine].reverse().slice(1, isDominant ? -1 : undefined)].map((t) => t.degree);
  let fingered = [...up, ...down];
  if (isDominant) {
    const last = fingered[fingered.length - 1];
    const resolution: LinePitch = { midi: last.midi + 1, note: root, openFree: true };
    const step = fingerLine([last, resolution], {
      ...rules,
      start: { stringIndex: last.stringIndex, fret: last.fret, frame: last.frame },
    });
    if (step === null) return null;
    fingered.push({ ...step[1], segment: last.segment + (step[1].shift ? 1 : 0) });
    lineDegrees.push(0);
  }
  fingered = annotateBarres(fingered);
  const { rh, rightHand } = arpeggioRightHand(kind, octaves, upLine.length, fingered.length);
  return {
    kind,
    style: 'line',
    root,
    scaleType,
    chord: { root: chordRoot, quality },
    octaves,
    startMidi: start,
    events: fingered.map((n, i) => ({ notes: [n], degrees: [lineDegrees[i]], rh: [rh[i] ?? rhByString(n.stringIndex)] })),
    ascendingCount: upLine.length,
    rightHand,
  };
}

/** The tonic arpeggio of a major or minor key, from the lowest tonic, up and down (2 octaves by default). */
export function tonicArpeggio(root: Note, mode: 'major' | 'minor', options: TechniqueOptions = {}): TechniqueExercise | null {
  return arpeggioExercise('tonicArpeggio', root, mode === 'major' ? 'major' : 'natural_minor', root, mode, options);
}

/**
 * The dominant-7th arpeggio of a key (major, or minor with the raised 7th),
 * from the lowest dominant: up 1 3 5 7 … to the top root, down to the 3rd
 * (the leading note), resolving up a semitone on the tonic (ABRSM p. 14). The
 * resolution is the last event, degree 0.
 */
export function dominantSeventhArpeggio(
  keyRoot: Note,
  mode: 'major' | 'minor' = 'major',
  options: TechniqueOptions = {},
): TechniqueExercise | null {
  const dominant = spellDegree(keyRoot, parseDegree('5'));
  return arpeggioExercise('dominantSeventh', keyRoot, mode === 'major' ? 'major' : 'harmonic_minor', dominant, 'dominant7', options);
}

/** The diminished-7th arpeggio on `root` (1 ♭3 ♭5 𝄫7), from its lowest note, up and down. */
export function diminishedSeventhArpeggio(root: Note, options: TechniqueOptions = {}): TechniqueExercise | null {
  return arpeggioExercise('diminishedSeventh', root, 'harmonic_minor', root, 'diminished7', options);
}

// ─── Broken chords ──────────────────────────────────────────────────────────

/**
 * A broken chord (ABRSM p. 14): groups of three chord tones, each from its
 * lowest note — going up from every chord tone between the tonic and the top
 * tonic, coming down from the chord tones below the top tonic down to the 3rd
 * — then the tonic alone. One octave by default; `startOctave: 1` starts an
 * octave above the lowest tonic (ABRSM Grade 5: "E minor starting an octave
 * above lowest tonic"). Played "with over-ringing".
 */
export function brokenChord(
  root: Note,
  mode: 'major' | 'minor',
  options: TechniqueOptions & { startOctave?: number } = {},
): TechniqueExercise | null {
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const octaves = options.octaves ?? 1;
  const start = lowestTonicMidi(root, tuning) + 12 * (options.startOctave ?? 0);
  const notes = buildChord(root, mode).notes;
  const semis = CHORD_FORMULAS[mode];
  const top = 3 * octaves;
  const groupStarts = [
    ...Array.from({ length: top + 1 }, (_, k) => k),
    ...Array.from({ length: top - 1 }, (_, k) => top - 1 - k),
  ];
  const line: Tone[] = [
    ...groupStarts.flatMap((k) => [0, 1, 2].map((j) => chordToneAt(notes, semis, start, k + j))),
    chordToneAt(notes, semis, start, 0),
  ];
  if (Math.max(...line.map((t) => t.midi)) > highestMidi(tuning, maxFret)) return null;
  // The closing tonic drops an octave from the last group's top note, which
  // takes a two-string step (E4 on the 2nd string → E3 on the 4th).
  const fingered = fingerLine(line, { ...ARPEGGIO_RULES, maxStringStep: 2, tuning, maxFret, openStrings: options.openStrings });
  if (fingered === null) return null;
  return {
    kind: 'brokenChord',
    style: 'line',
    root,
    scaleType: mode === 'major' ? 'major' : 'natural_minor',
    chord: { root, quality: mode },
    octaves,
    startMidi: start,
    events: fingered.map((n, i) => ({ notes: [n], degrees: [line[i].degree], rh: [rhByString(n.stringIndex)] })),
    ascendingCount: 3 * (top + 1),
    rightHand: {
      strokes: ['tirando'],
      overRinging: true,
      pattern: 'by string',
      basis: 'inferred',
      source: `${ABRSM} (broken chords: tirando, with over-ringing); fingers by string (p 6–4, i 3, m 2, a 1)`,
    },
  };
}

// ─── Chromatic scale ────────────────────────────────────────────────────────

const SHARP_NAMES: readonly Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(
  (s) => ({ natural: s[0], accidental: s.slice(1) }) as Note,
);
const FLAT_NAMES: readonly Note[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].map(
  (s) => ({ natural: s[0], accidental: s.slice(1) }) as Note,
);

/**
 * The chromatic scale from the lowest `start`, `octaves` octaves (2 by
 * default, as ABRSM Grade 5 asks), up and back down the same way; written
 * with sharps going up and flats coming down (ABRSM p. 14), the start note
 * keeping its own spelling. Right hand: thumb and fingers combined (ABRSM ◆).
 *
 * Fingered with open strings (the default style). openStrings: 'avoid' returns
 * null: with strings a 4th apart a closed position cannot hold five semitones
 * per string, so every string crossing would need a shift onto another
 * string, which the fingering model does not offer (a shift needs a guide).
 */
export function chromaticScale(start: Note, options: TechniqueOptions = {}): TechniqueExercise | null {
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const octaves = options.octaves ?? 2;
  if (options.openStrings === 'avoid') return null;
  const first = lowestTonicMidi(start, tuning);
  const pc0 = getPitchClass(start);
  const count = 12 * octaves + 1;
  if (first + 12 * octaves > highestMidi(tuning, maxFret)) return null;
  const spell = (midi: number, names: readonly Note[]): Note => ((midi - first) % 12 === 0 ? start : names[(pc0 + midi - first) % 12]);
  const upLine: Tone[] = Array.from({ length: count }, (_, k) => ({
    midi: first + k,
    note: spell(first + k, SHARP_NAMES),
    degree: (k % 12) + 1,
    openFree: k % 12 === 0,
  }));
  const up = fingerLine(upLine, { tuning, maxFret });
  if (up === null) return null;
  const down = reverseFingering(up)
    .slice(1)
    .map((n) => {
      const note = spell(n.midi, FLAT_NAMES);
      return { ...n, note, pitched: { ...note, octave: n.pitched.octave } };
    });
  const fingered = [...up, ...down];
  const rh = rhThumbAndFingers(fingered.map((n) => n.midi), first + 12);
  return {
    kind: 'chromatic',
    style: 'line',
    root: start,
    scaleType: 'chromatic',
    chord: null,
    octaves,
    startMidi: first,
    events: fingered.map((n, i) => ({ notes: [n], degrees: [((n.midi - first) % 12) + 1], rh: [rh[i]] })),
    ascendingCount: count,
    rightHand: {
      strokes: ['tirando'],
      overRinging: null,
      pattern: 'p + im',
      basis: 'syllabus',
      source: `${ABRSM} (Grade 5 chromatic: thumb and fingers combined — thumb for the lower octave, fingers for the upper; tirando)`,
    },
  };
}

/** All the notes of an exercise in playing order (double stops low → high). */
export function techniqueNotes(ex: TechniqueExercise): FingeredNote[] {
  return ex.events.flatMap((e) => e.notes);
}
