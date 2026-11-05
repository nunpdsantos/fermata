import type { FingeredNote } from '../../core/utils/guitarFingering';
import type { PracticeRoute } from './practiceModel';

/** The same passage drives both dots and the fret window. Never clip a dot
 * because the current event happens to occupy a narrower or higher range. */
export function practiceNeckLayout(route: PracticeRoute, index: number) {
  const current = route.events[index];
  const guide = current.notes.find((n) => n.shift?.kind === 'guide');
  const departure = guide && index > 0 ? route.events[index - 1].notes.find((n) => n.stringIndex === guide.stringIndex) : undefined;
  // A right-hand bar is one chord; other routes hold one generated hand
  // segment until a shift. Position alone is insufficient on a return visit.
  const inShape = (event: number, note: FingeredNote) => current.numeral
    ? route.events[event].numeral === current.numeral
    : current.notes.some((n) => n.segment === note.segment && n.position === note.position &&
      JSON.stringify(n.frame?.frets) === JSON.stringify(note.frame?.frets));
  const places = new Map<string, { event: number; note: FingeredNote; currentShape: boolean }>();
  const start = Math.max(0, index - 3);
  route.events.slice(start, index + 5).forEach((e, j) => {
    e.notes.forEach((note) => {
      const event = start + j;
      const key = `${note.stringIndex}:${note.fret}`;
      const currentShape = inShape(event, note);
      // Context from another shape never overwrites the current fingering.
      if (currentShape || !places.get(key)?.currentShape) places.set(key, { event, note, currentShape });
    });
  });
  current.notes.forEach((note) => places.set(`${note.stringIndex}:${note.fret}`, { event: index, note, currentShape: true }));
  if (departure) places.set(`${departure.stringIndex}:${departure.fret}`, { event: index - 1, note: departure, currentShape: true });
  const fretted = [...places.values()].map(({ note }) => note.fret).filter((f) => f > 0);
  const high = Math.max(5, ...fretted);
  const low = Math.min(fretted.length ? Math.min(...fretted) : 1, high - 4);
  const frets = Array.from({ length: high - low + 1 }, (_, i) => high - i);
  return { guide, departure, places, frets, low };
}

/** The arrow follows the hand's actual direction, including a return slide. */
export const shiftArrow = (shift: FingeredNote['shift']) => shift && shift.toPosition < shift.fromPosition ? '↘' : '↗';
