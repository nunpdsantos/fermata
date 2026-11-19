/** One event model drives the neck, staff, teacher fingerings and audio. */
import { noteToString, type Note, type ScaleType } from '../../core/types/music';
import type { GuitarTuning } from '../../core/constants/guitarTunings';
import type { FingeredNote } from '../../core/utils/guitarFingering';
import { fullRoute, getScaleRoute, ROUTE_SCALE_TYPES } from '../../core/utils/scaleRoutes';
import {
  brokenChord, brokenChordAvailability, chromaticScale, diminishedSeventhArpeggio,
  dominantSeventhArpeggio, intervalScale, scaleRightHand, tonicArpeggio,
  type TechniqueEvent, type TechniqueExercise,
} from '../../core/utils/guitarTechnique';
import { rightHandStudy } from '../../core/utils/rightHandPatterns';
import type { TimedNote } from '../../core/services/audio';
import { getPositionWalk, type WalkStop } from '../../core/utils/positionWalk';
import { scaleDegreeMap } from '../../core/utils/guitarPositions';

export interface PracticeEvent extends TechniqueEvent { numeral?: string }
export interface PracticeRoute {
  id: string;
  octaves: number;
  events: PracticeEvent[];
  overRinging: boolean | null;
  stops?: WalkStop[];
}
export interface PracticeItem {
  id: string;
  route: PracticeRoute | null;
  reason?: string;
}

export function keyMode(type: ScaleType): 'major' | 'minor' | null {
  if (type === 'major') return 'major';
  if (['natural_minor', 'harmonic_minor', 'melodic_minor'].includes(type)) return 'minor';
  return null;
}

export function scalePractice(root: Note, type: ScaleType, tuning: GuitarTuning, octaves: number, scheme: 'im' | 'ma'): PracticeRoute | null {
  const route = getScaleRoute(root, type, { tuning, octaves });
  if (!route) return null;
  const notes = fullRoute(route);
  const rh = scaleRightHand(notes.map((n) => n.midi), scheme);
  return { id: 'scale', octaves, overRinging: false, events: notes.map((n, i) => ({ notes: [n], degrees: [n.degree], rh: [rh.fingers[i]] })) };
}

export function positionWalkPractice(root: Note, type: ScaleType, tuning: GuitarTuning): PracticeRoute | null {
  const walk = getPositionWalk(root, type, { tuning });
  if (!walk) return null;
  const degrees = scaleDegreeMap(root, type);
  const rh = scaleRightHand(walk.notes.map((n) => n.midi), 'im');
  return { id: 'position-walk', octaves: Math.max(...walk.stops.map((s) => s.octaves)),
    stops: walk.stops, overRinging: false,
    events: walk.notes.map((n, i) => ({ notes: [n], degrees: [degrees.get(n.midi % 12)!.degreeIndex + 1], rh: [rh.fingers[i]] })) };
}

const fromTechnique = (ex: TechniqueExercise | null, id: string): PracticeRoute | null => ex && ({
  id, octaves: ex.octaves, events: ex.events, overRinging: ex.rightHand.overRinging,
});

/** Null means no suggested route under the engine's grip rules, not necessarily an out-of-range pitch. */
export function technicalSet(root: Note, type: ScaleType, tuning: GuitarTuning): PracticeItem[] {
  const mode = keyMode(type);
  const options = { tuning, octaves: 2 };
  const items: PracticeItem[] = [{ id: 'scale', route: scalePractice(root, type, tuning, 2, 'im'), reason: ROUTE_SCALE_TYPES.includes(type) ? 'noRoute' : 'heptatonic' }];
  for (const id of ['tonicArpeggio', 'dominantSeventh', 'diminishedSeventh'] as const) {
    const ex = !mode ? null : id === 'tonicArpeggio' ? tonicArpeggio(root, mode, options)
      : id === 'dominantSeventh' ? dominantSeventhArpeggio(root, mode, options) : diminishedSeventhArpeggio(root, options);
    items.push({ id, route: fromTechnique(ex, id), reason: mode ? 'noRoute' : 'majorMinor' });
  }
  for (const kind of ['thirds', 'sixths', 'octaves'] as const) {
    for (const style of ['broken', 'together'] as const) {
      const id = `${kind}-${style}`;
      items.push({ id, route: fromTechnique(intervalScale(root, type, kind, style, { tuning }), id), reason: ROUTE_SCALE_TYPES.includes(type) ? 'noPair' : 'heptatonic' });
    }
  }
  items.push({ id: 'chromatic', route: fromTechnique(chromaticScale(root, options), 'chromatic'), reason: 'noRoute' });
  for (const startOctave of [0, 1]) {
    const id = startOctave ? 'brokenChord-upper' : 'brokenChord';
    const av = mode ? brokenChordAvailability(root, mode, { tuning, startOctave }) : null;
    items.push({ id, route: av?.available && mode ? fromTechnique(brokenChord(root, mode, { tuning, startOctave }), id) : null,
      reason: !av ? 'majorMinor' : av.available ? undefined : av.reason });
  }
  return items;
}

export function rightHandPractice(root: Note, type: ScaleType, tuning: GuitarTuning, pattern: string): PracticeRoute | null {
  const mode = keyMode(type);
  if (!mode || tuning.id !== 'standard') return null;
  const study = rightHandStudy(root, mode, pattern);
  if (!study) return null;
  return { id: pattern, octaves: 1, overRinging: true, events: study.bars.flatMap((bar) => {
    // The grip is held for the whole bar (its notes ring on): a left-hand finger the bar gives to two or more
    // strings at one fret lies across them, a barré (music audit 2, M41: the pinch (p+a) of B major put the
    // index on strings 5 and 1 at fret 2 with no cue).
    const under = barreNotes(bar.notes.map((n) => ({ stringIndex: n.stringIndex, fret: n.fret, finger: n.lh })));
    return study.pattern.strokes.map((_, stroke) => {
      const notes = bar.notes.filter((n) => n.stroke === stroke);
      return { numeral: bar.numeral, degrees: [], rh: notes.map((n) => n.rh), notes: notes.map((n): FingeredNote => ({
        ...n, finger: n.lh, position: null, frame: null, shift: null, reach: null, segment: 0,
        barre: under.has(`${n.stringIndex}:${n.fret}`),
      })) };
    });
  }) };
}

/** A fretted place and the left-hand finger on it. */
export interface HeldPlace { stringIndex: number; fret: number; finger: number }

/** One finger laid across several strings at one fret: `from` / `to` are string NUMBERS (1 = thinnest), from < to. */
export interface BarreCue { finger: number; fret: number; from: number; to: number }

/** The barrés among places held together: a finger on two or more strings at one fret. */
export function barresAmong(places: readonly HeldPlace[]): BarreCue[] {
  const byFinger = new Map<string, number[]>();
  for (const p of places) {
    if (p.fret <= 0 || p.finger <= 0) continue;
    const k = `${p.finger}:${p.fret}`;
    const strings = byFinger.get(k) ?? [];
    if (!strings.includes(p.stringIndex)) strings.push(p.stringIndex);
    byFinger.set(k, strings);
  }
  const cues: BarreCue[] = [];
  for (const [k, strings] of byFinger) {
    if (strings.length < 2) continue;
    const [finger, fret] = k.split(':').map(Number);
    cues.push({ finger, fret, from: 6 - Math.max(...strings), to: 6 - Math.min(...strings) });
  }
  return cues.sort((a, b) => a.fret - b.fret || a.from - b.from);
}

/** `string:fret` of every place under one of the barrés among `places`. */
function barreNotes(places: readonly HeldPlace[]): Set<string> {
  const cues = barresAmong(places);
  return new Set(places.filter((p) => cues.some((c) => c.finger === p.finger && c.fret === p.fret)).map((p) => `${p.stringIndex}:${p.fret}`));
}

/**
 * The events whose notes sound together with event `i`, as [start, end): a right-hand bar (one chord, held and
 * let ring), a ringing group of three (a broken chord, "with over-ringing"), else the event alone. The ONE rule
 * the schedule rings by, the editor checks fingers by, and the barré cues read.
 */
export function ringWindow(route: PracticeRoute, i: number): [number, number] {
  if (!route.overRinging) return [i, i + 1];
  const numeral = route.events[i].numeral;
  if (numeral) {
    let start = i;
    while (start > 0 && route.events[start - 1].numeral === numeral) start--;
    const end = route.events.findIndex((e, j) => j > i && e.numeral !== numeral);
    return [start, end < 0 ? route.events.length : end];
  }
  const start = Math.floor(i / 3) * 3;
  return [start, Math.min(route.events.length, start + 3)];
}

type FingerOf = (event: number, n: FingeredNote) => number;
const suggested: FingerOf = (_, n) => n.finger;

/** The notes held at the same instant as event `i` (its ringing window), each with its event. */
export function heldWith(route: PracticeRoute, i: number): { event: number; note: FingeredNote }[] {
  const [start, end] = ringWindow(route, i);
  return route.events.slice(start, end).flatMap((e, k) => e.notes.map((note) => ({ event: start + k, note })));
}

/**
 * Two notes held at once that one finger cannot both stop (music audit 2, M37). At one fret, `between` is the
 * note between them that sounds open or lower, which the finger laid across would stop too.
 */
export interface FingerClash {
  finger: number;
  a: { event: number; note: FingeredNote };
  b: { event: number; note: FingeredNote };
  between?: FingeredNote;
}

/**
 * Where one finger is given to two places held at the same instant that it cannot stop together: two different
 * frets, or one fret across a string between them that sounds open or lower (a barré lies across every string
 * between its ends). One finger on several strings at ONE fret, with nothing lower between, is a barré: allowed.
 */
export function fingerClashes(held: readonly { event: number; note: FingeredNote }[], fingerOf: FingerOf = suggested): FingerClash[] {
  const fretted = held.filter(({ note }) => note.fret > 0).map((h) => ({ ...h, finger: fingerOf(h.event, h.note) })).filter((h) => h.finger > 0);
  const clashes: FingerClash[] = [];
  for (let x = 0; x < fretted.length; x++) for (let y = x + 1; y < fretted.length; y++) {
    const a = fretted[x];
    const b = fretted[y];
    if (a.finger !== b.finger || a.note.stringIndex === b.note.stringIndex) continue;
    const lo = Math.min(a.note.stringIndex, b.note.stringIndex);
    const hi = Math.max(a.note.stringIndex, b.note.stringIndex);
    const pair = { finger: a.finger, a: { event: a.event, note: a.note }, b: { event: b.event, note: b.note } };
    if (a.note.fret !== b.note.fret) {
      clashes.push(pair);
      continue;
    }
    const between = held.find(({ note }) => note.stringIndex > lo && note.stringIndex < hi && note.fret < a.note.fret)?.note;
    if (between) clashes.push({ ...pair, between });
  }
  return clashes;
}

/** The left-hand fingers (1–4) event `i`'s note `n` can take without a clash with the notes held with it. */
export function allowedFingers(route: PracticeRoute, i: number, n: FingeredNote, fingerOf: FingerOf = suggested): number[] {
  const held = heldWith(route, i);
  return [1, 2, 3, 4].filter((f) => !fingerClashes(held, (e, m) => (m === n ? f : fingerOf(e, m))).some((c) => c.a.note === n || c.b.note === n));
}

/**
 * The barrés the hand holds at event `i`, from the fingers shown (a teacher's included): one finger across two or
 * more strings at one fret among the notes held with it — and, where the route marks it, the index rolling from
 * one string to the next at one fret between two single notes in turn (guitarFingering's partial barré).
 *
 * A grip held through a ringing window (a right-hand bar, a broken chord's group of three) keeps its barré down
 * on every step of it, so its cue stands on every step, whether or not that step plucks a string under it (the
 * review of 19 November 2026: in 1,136 right-hand bars holding a barré, 1,232 of 4,406 strokes showed none, as if
 * the finger lifted). Elsewhere, and for a roll, only a barré under which event `i` has a note.
 */
export function barreCues(route: PracticeRoute, i: number, fingerOf: FingerOf = suggested): BarreCue[] {
  const held = heldWith(route, i);
  const at = (event: number, note: FingeredNote): HeldPlace => ({ stringIndex: note.stringIndex, fret: note.fret, finger: fingerOf(event, note) });
  const mine = route.events[i].notes.map((n) => at(i, n));
  const onMine = (c: BarreCue) => mine.some((p) => p.finger === c.finger && p.fret === c.fret && 6 - p.stringIndex >= c.from && 6 - p.stringIndex <= c.to);
  const grip = barresAmong(held.map(({ event, note }) => at(event, note))).filter((c) => route.overRinging || onMine(c));
  // A roll is the route's own partial barré (guitarFingering's `barre` on the second note), kept while the index
  // is still the finger shown on both; another finger moving to the next string at one fret lifts and lands.
  const index = (event: number) => route.events[event].notes.length === 1 && fingerOf(event, route.events[event].notes[0]) === 1;
  // (A right-hand bar holds its own grip: nothing rolls in from the bar before.)
  const rolled = !route.events[i].numeral && i > 0 && route.events[i].notes[0].barre && index(i) && index(i - 1)
    ? [{ event: i - 1, note: route.events[i - 1].notes[0] }] : [];
  if (!rolled.length) return grip;
  // The roll, taken together with what is held now (it may widen a barré of the window at the same fret).
  const rolls = barresAmong([...rolled, ...held].map(({ event, note }) => at(event, note))).filter(onMine);
  return [...grip.filter((g) => !rolls.some((r) => r.finger === g.finger && r.fret === g.fret)), ...rolls]
    .sort((a, b) => a.fret - b.fret || a.from - b.from);
}

export function routeFingerKey(root: Note, type: ScaleType, tuning: GuitarTuning, route: PracticeRoute, event: number, n: FingeredNote): string {
  return ['route:1', tuning.id, noteToString(root), type, route.id, route.octaves, event, n.stringIndex, n.fret].join('|');
}

/**
 * One beat per event, including simultaneous dyads/pinches. Ring only within a bar/group, and a string sounds one
 * note: a new pluck on a string ends what it was sounding (music audit 2, M40: p i m i plucked the open G again
 * at 3.0 s while the first G was scheduled to ring to 3.9 s). Every note ends a tenth of a beat before the event
 * that ends it — the next event (no ringing), the end of its bar or group, or the next pluck on its string —
 * and the voice's own short release follows, never a click.
 */
export function practiceSchedule(route: PracticeRoute, bpm: number): { notes: TimedNote[]; eventIndices: number[] } {
  const beat = 60 / Math.max(30, Math.min(240, bpm));
  const notes: TimedNote[] = [];
  const eventIndices: number[] = [];
  route.events.forEach((event, i) => {
    const [, end] = ringWindow(route, i);
    event.notes.forEach((n) => {
      const next = route.events.findIndex((e, j) => j > i && e.notes.some((m) => m.stringIndex === n.stringIndex));
      const until = next < 0 ? end : Math.min(end, next);
      notes.push({ note: n.pitched, at: i * beat, duration: Math.max(0.1, until - i - 0.1) * beat });
      eventIndices.push(i);
    });
  });
  return { notes, eventIndices };
}
