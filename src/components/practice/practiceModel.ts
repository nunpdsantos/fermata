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

export interface PracticeEvent extends TechniqueEvent { numeral?: string }
export interface PracticeRoute {
  id: string;
  octaves: number;
  events: PracticeEvent[];
  overRinging: boolean | null;
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
  return { id: pattern, octaves: 1, overRinging: true, events: study.bars.flatMap((bar) => study.pattern.strokes.map((_, stroke) => {
    const notes = bar.notes.filter((n) => n.stroke === stroke);
    return { numeral: bar.numeral, degrees: [], rh: notes.map((n) => n.rh), notes: notes.map((n): FingeredNote => ({
      ...n, finger: n.lh, position: null, frame: null, shift: null, reach: null, segment: 0, barre: false,
    })) };
  })) };
}

export function routeFingerKey(root: Note, type: ScaleType, tuning: GuitarTuning, route: PracticeRoute, event: number, n: FingeredNote): string {
  return ['route:1', tuning.id, noteToString(root), type, route.id, route.octaves, event, n.stringIndex, n.fret].join('|');
}

/** One beat per event, including simultaneous dyads/pinches. Ring only within a bar/group. */
export function practiceSchedule(route: PracticeRoute, bpm: number): { notes: TimedNote[]; eventIndices: number[] } {
  const beat = 60 / Math.max(30, Math.min(240, bpm));
  const notes: TimedNote[] = [];
  const eventIndices: number[] = [];
  route.events.forEach((event, i) => {
    let beats = 0.9;
    if (route.overRinging) {
      const barEnd = event.numeral
        ? route.events.findIndex((e, j) => j > i && e.numeral !== event.numeral)
        : Math.min(route.events.length, Math.floor(i / 3) * 3 + 3);
      beats = (barEnd < 0 ? route.events.length : barEnd) - i - 0.1;
    }
    event.notes.forEach((n) => {
      notes.push({ note: n.pitched, at: i * beat, duration: Math.max(0.1, beats) * beat });
      eventIndices.push(i);
    });
  });
  return { notes, eventIndices };
}
