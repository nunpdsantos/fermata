// The Grade-5 technical set on the classical guitar (audit W10-03, decision
// D-04: syllabus-neutral — the items common to ABRSM, Trinity, LCM and the
// Madeira EAE programme, audit Track G R3/R9/R12/R16):
//
//   • scales in 3rds and 6ths, broken (one note after the other) and together
//     (double stops), and scales in octaves;
//   • tonic arpeggios (major / minor) over two octaves;
//   • the dominant-7th arpeggio of a key, resolving to the tonic;
//   • the diminished-7th arpeggio on a note.
//
// Notes and spelling come from the engine (buildScale, buildChord); single
// lines are fingered by guitarFingering.ts (the scale-route engine), double
// stops by the dyad search below. Every exercise starts from the lowest note
// the tuning reaches, like the scales. Octave counts and the resolution note
// are parameters: syllabuses differ (the research did not establish one
// convention [verify]).
//
// Pure and framework-agnostic.

import type { ChordQuality, Note, ScaleType } from '../types/music';
import type { GuitarTuning } from '../constants/guitarTunings';
import { TUNING_STANDARD } from '../constants/guitarTunings';
import { buildChord, CHORD_FORMULAS } from '../constants/chords';
import { SCALE_FORMULAS, buildScale } from '../constants/scales';
import { spellDegree, parseDegree } from './degreeSpelling';
import { GUITAR_MAX_FRET, tuningOpenMidi } from './guitarPositions';
import type { LeftHandFinger } from './guitarPositions';
import { fingerLine, reverseFingering } from './guitarFingering';
import type { FingeredNote, LinePitch, Shift } from './guitarFingering';
import { lowestTonicMidi, highestMidi, ROUTE_SCALE_TYPES } from './scaleRoutes';

export type TechniqueKind =
  | 'thirds'
  | 'sixths'
  | 'octaves'
  | 'tonicArpeggio'
  | 'dominantSeventh'
  | 'diminishedSeventh';

/** One thing to play: a single note, or two at once (a double stop). */
export interface TechniqueEvent {
  /** Low → high. */
  notes: FingeredNote[];
  /** Degree of each note in the scale (interval scales) or chord tone 1/3/5/7 (arpeggios); 0 = resolution. */
  degrees: number[];
}

export interface TechniqueExercise {
  kind: TechniqueKind;
  style: 'broken' | 'together' | 'line';
  root: Note;
  /** The scale (interval scales) or the key (arpeggios). */
  scaleType: ScaleType;
  /** Arpeggios: the chord arpeggiated (the dominant for 'dominantSeventh'). */
  chord: { root: Note; quality: ChordQuality } | null;
  octaves: number;
  /** MIDI of the first (lowest) note. */
  startMidi: number;
  /** In playing order: up, then down (and the resolution, for the dominant 7th). */
  events: TechniqueEvent[];
  /** How many of `events` belong to the way up. */
  ascendingCount: number;
}

export interface TechniqueOptions {
  octaves?: number;
  tuning?: GuitarTuning;
  maxFret?: number;
  openStrings?: 'low-positions' | 'avoid';
}

// ─── Interval scales ────────────────────────────────────────────────────────

/** Scale-step distance and string gap of each interval scale (gap: strings between the two notes + 1). */
const INTERVAL_STEPS: Record<'thirds' | 'sixths' | 'octaves', { steps: number; gaps: readonly number[] }> = {
  thirds: { steps: 2, gaps: [1] },
  sixths: { steps: 5, gaps: [2] },
  octaves: { steps: 7, gaps: [2] },
};

interface ScaleTone extends LinePitch {
  degree: number;
}

/** Scale tones from `startMidi` upward, `count` of them (any length; octaves repeat). */
function scaleTones(root: Note, type: ScaleType, startMidi: number, count: number): ScaleTone[] {
  const notes = buildScale(root, type).notes;
  const semis = SCALE_FORMULAS[type];
  const out: ScaleTone[] = [];
  for (let i = 0; i < count; i++) {
    const o = Math.floor(i / 7);
    const d = i % 7;
    out.push({ midi: startMidi + 12 * o + semis[d], note: notes[d], degree: d + 1, openFree: d === 0 });
  }
  return out;
}

/**
 * The pairs of an interval scale: up, the lower voice climbs the scale from
 * the tonic to the tonic `octaves` higher with the upper voice `steps` scale
 * steps above; down, the pairs come back without repeating the top one.
 * Melodic minor goes up melodic and comes down natural (W10-09).
 */
function intervalPairs(root: Note, type: ScaleType, steps: number, octaves: number, start: number) {
  const n = 7 * octaves + 1;
  const upTones = scaleTones(root, type, start, n + steps);
  const downType: ScaleType = type === 'melodic_minor' ? 'natural_minor' : type;
  const downTones = scaleTones(root, downType, start, n + steps);
  const up = Array.from({ length: n }, (_, i) => [upTones[i], upTones[i + steps]] as const);
  const down = Array.from({ length: n - 1 }, (_, k) => {
    const i = n - 2 - k;
    return [downTones[i], downTones[i + steps]] as const;
  });
  return { up, down };
}

/**
 * A scale in 3rds, 6ths or octaves, together (double stops) or broken (the
 * same two notes one after the other: low then high going up, high then low
 * coming down). Broken intervals are fingered with the double-stop hand
 * shapes — the hand holds the shape and plays its notes in turn, which is
 * what lets broken octaves move up the neck at all.
 *
 * One octave by default, from the lowest tonic — or an octave higher when the
 * bottom pair cannot be stopped on two strings (3rds and 6ths in E and F
 * minor: nothing but the 6th string reaches G♯2 / A♭2). Null when the neck
 * cannot hold it or the scale is not heptatonic.
 */
export function intervalScale(
  root: Note,
  type: ScaleType,
  kind: 'thirds' | 'sixths' | 'octaves',
  style: 'broken' | 'together',
  options: TechniqueOptions = {},
): TechniqueExercise | null {
  if (!ROUTE_SCALE_TYPES.includes(type)) return null;
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const octaves = options.octaves ?? 1;
  const { steps, gaps } = INTERVAL_STEPS[kind];
  const lowest = lowestTonicMidi(root, tuning);

  for (const start of [lowest, lowest + 12]) {
    const { up, down } = intervalPairs(root, type, steps, octaves, start);
    if (up[up.length - 1][1].midi > highestMidi(tuning, maxFret)) return null;
    const dyads = fingerDyads([...up, ...down], gaps, { tuning, maxFret, openStrings: options.openStrings });
    if (dyads === null) continue;
    const src = (i: number) => (i < up.length ? up[i] : down[i - up.length]);
    const base = { kind, style, root, scaleType: type, chord: null, octaves, startMidi: start } as const;
    if (style === 'together') {
      const events = dyads.map((pair, i) => ({ notes: pair, degrees: [src(i)[0].degree, src(i)[1].degree] }));
      return { ...base, events, ascendingCount: up.length };
    }
    // Broken: low → high going up, high → low coming down; a shift belongs to
    // the first note of the pair it brings the hand to.
    const events: TechniqueEvent[] = [];
    dyads.forEach(([lo, hi], i) => {
      const [dLo, dHi] = [src(i)[0].degree, src(i)[1].degree];
      const order = i < up.length ? [[lo, dLo], [hi, dHi]] : [[hi, dHi], [lo, dLo]];
      order.forEach(([n, d], j) => {
        const note = n as FingeredNote;
        events.push({ notes: [{ ...note, shift: j === 0 ? note.shift : null }], degrees: [d as number] });
      });
    });
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
// — one fret lower (a reach back). While the hand stays in a position no
// finger moves to another fret; it changes position only with a guide finger
// that keeps its string and slides. Same costs as single lines where they
// apply (guitarFingering.ts), plus 4 for a shared fret and 4 per string the
// pair moves. One more move is allowed for double stops: the 'shape' shift —
// the same two fingers keep their shape and move to the next pair of strings
// (how an octave scale crosses from strings 5–3 to 4–2), at most 3 positions,
// cost 30 + 4 per position.

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
      // Fingers rise with the fret; on one fret the lower string takes the lower finger.
      if (a.k !== 0 && b.k !== 0) {
        if (fHigh > fLow && b.k < a.k) continue;
        if (fHigh < fLow && b.k > a.k) continue;
        if (fHigh === fLow && b.k !== a.k + 1) continue;
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

/** Chord tones from `startMidi` up over `octaves` octaves (root repeated on top). */
function chordLine(root: Note, quality: ChordQuality, startMidi: number, octaves: number): ScaleTone[] {
  const notes = buildChord(root, quality).notes;
  const semis = CHORD_FORMULAS[quality];
  const tones = [1, 3, 5, 7];
  const out: ScaleTone[] = [];
  for (let o = 0; o < octaves; o++) {
    notes.forEach((n, i) => out.push({ midi: startMidi + 12 * o + semis[i], note: n, degree: tones[i], openFree: i === 0 }));
  }
  out.push({ midi: startMidi + 12 * octaves, note: notes[0], degree: 1, openFree: true });
  return out;
}

function arpeggioExercise(
  kind: TechniqueKind,
  root: Note,
  scaleType: ScaleType,
  chordRoot: Note,
  quality: ChordQuality,
  options: TechniqueOptions,
  resolution: LinePitch | null,
): TechniqueExercise | null {
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const octaves = options.octaves ?? 2;
  const start = lowestTonicMidi(chordRoot, tuning);
  const upLine = chordLine(chordRoot, quality, start, octaves);
  if (upLine[upLine.length - 1].midi > highestMidi(tuning, maxFret)) return null;
  // Up, then down the same way (the ascent reversed, like the scales).
  const up = fingerLine(upLine, { tuning, maxFret, maxStringStep: 1, openStrings: options.openStrings });
  if (up === null) return null;
  const fingered = [...up, ...reverseFingering(up).slice(1)];
  const line: (LinePitch & { degree: number })[] = [...upLine, ...[...upLine].reverse().slice(1)];
  if (resolution) {
    // The resolution is fingered from where the descent ends.
    const last = fingered[fingered.length - 1];
    const step = fingerLine([last, resolution], {
      tuning,
      maxFret,
      maxStringStep: 1,
      openStrings: options.openStrings,
      start: { stringIndex: last.stringIndex, fret: last.fret, frame: last.frame },
    });
    if (step === null) return null;
    fingered.push({ ...step[1], segment: last.segment + (step[1].shift ? 1 : 0) });
    line.push({ ...resolution, degree: 0 });
  }
  return {
    kind,
    style: 'line',
    root,
    scaleType,
    chord: { root: chordRoot, quality },
    octaves,
    startMidi: start,
    events: fingered.map((n, i) => ({ notes: [n], degrees: [line[i].degree] })),
    ascendingCount: upLine.length,
  };
}

/** The tonic arpeggio of a major or minor key, from the lowest tonic, up and down (2 octaves by default). */
export function tonicArpeggio(root: Note, mode: 'major' | 'minor', options: TechniqueOptions = {}): TechniqueExercise | null {
  return arpeggioExercise('tonicArpeggio', root, mode === 'major' ? 'major' : 'natural_minor', root, mode, options, null);
}

/**
 * The dominant-7th arpeggio of a key (major, or minor with the raised 7th),
 * from the lowest dominant, up and down, then resolving to the tonic a perfect
 * fourth above the dominant it ended on (the bass's V → I). Syllabuses word
 * the resolution differently [verify]; the note is the last event, degree 0.
 */
export function dominantSeventhArpeggio(
  keyRoot: Note,
  mode: 'major' | 'minor' = 'major',
  options: TechniqueOptions = {},
): TechniqueExercise | null {
  const dominant = spellDegree(keyRoot, parseDegree('5'));
  const tuning = options.tuning ?? TUNING_STANDARD;
  const start = lowestTonicMidi(dominant, tuning);
  const resolution: LinePitch = { midi: start + 5, note: keyRoot, openFree: true };
  return arpeggioExercise(
    'dominantSeventh',
    keyRoot,
    mode === 'major' ? 'major' : 'harmonic_minor',
    dominant,
    'dominant7',
    options,
    resolution,
  );
}

/** The diminished-7th arpeggio on `root` (1 ♭3 ♭5 𝄫7), from its lowest note, up and down. */
export function diminishedSeventhArpeggio(root: Note, options: TechniqueOptions = {}): TechniqueExercise | null {
  return arpeggioExercise('diminishedSeventh', root, 'harmonic_minor', root, 'diminished7', options, null);
}

/** All the notes of an exercise in playing order (double stops low → high). */
export function techniqueNotes(ex: TechniqueExercise): FingeredNote[] {
  return ex.events.flatMap((e) => e.notes);
}
