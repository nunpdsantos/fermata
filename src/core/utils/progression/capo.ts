/**
 * Capo ideas (`capoOptions`). With a capo on fret f, a shape sounds f half
 * steps higher than it is fingered, so the shapes to play are the chords moved
 * DOWN f half steps: shape + capo = the chord that sounds. Standard tuning.
 * Each shape is spelled by `chordBelowCapo` (guitarChordShapes.ts), the one
 * rule the fretboard uses for its "B♭: the G shape, capo on fret 3" line.
 *
 * Whether a shape has an open grip is read from the app's own shape library
 * (`getChordShapesWithFallback` + `isPlayableChordShape`): a playable shape of
 * type 'open' at base fret 0 — and, for a slash chord, one of the grips the
 * board offers for it, with the bass as its lowest note (`chordShapesForCapo`).
 * No hand-typed list of "easy chords".
 */

import type { Chord } from '../../types/music';
import { getPitchClass } from '../../constants/notes';
import {
  chordBelowCapo,
  chordShapesForCapo,
  getChordShapesWithFallback,
  isPlayableChordShape,
  lowestSoundingPitchClass,
} from '../../constants/guitarChordShapes';
import { shiftKey } from './key';
import { toChord } from './chordInKey';
import type { CapoOption, ChordInput, MusicKey } from './types';

type Placed = ReturnType<typeof getChordShapesWithFallback>[number];

const isOpenGrip = (e: Placed): boolean => e.shape.type === 'open' && e.baseFret === 0 && isPlayableChordShape(e);

const openCache = new Map<string, boolean>();

function chordKey(chord: Chord): string {
  const notes = chord.notes.map((n) => `${n.natural}${n.accidental}`).join(' ');
  return `${chord.root.natural}${chord.root.accidental}|${chord.quality}|${notes}|${chord.algorithmicDisplayName ?? ''}|${
    chord.bassNote ? `${chord.bassNote.natural}${chord.bassNote.accidental}` : ''
  }`;
}

/** Does the app's shape library have a playable open grip for this chord (bass lowest for a slash chord)? */
export function hasOpenGrip(chord: Chord): boolean {
  const id = chordKey(chord);
  const cached = openCache.get(id);
  if (cached !== undefined) return cached;
  let shapes = getChordShapesWithFallback(chord);
  if (chord.bassNote) {
    // A slash chord: the grips the board itself offers for it, so the panel
    // never counts an open grip the board does not show (music audit 2, the
    // review of builder K: the board offers eight grips at most).
    const bassPc = getPitchClass(chord.bassNote);
    const board = chordShapesForCapo(chord, 0, 0);
    shapes = board.bassMatched ? board.shapes.filter((e) => lowestSoundingPitchClass(e) === bassPc) : [];
  }
  const open = shapes.some(isOpenGrip);
  openCache.set(id, open);
  return open;
}

/**
 * For capo fret 0 … maxFret (default 7): the shapes to play and which have an
 * open grip, ranked — every shape open first, then more open shapes, then the
 * lower fret. Fret 0 (no capo) is always in the list.
 *
 *   capoOptions([E♭, A♭, B♭], E♭ major)[0]
 *     → { fret: 1, shapeKey: D major, shapes: D G A (all open), allOpen: true, … }
 */
export function capoOptions(
  inputs: readonly ChordInput[],
  key: MusicKey,
  { maxFret = 7 }: { maxFret?: number } = {},
): CapoOption[] {
  const top = Math.max(0, Math.min(11, Math.floor(maxFret)));
  const options: CapoOption[] = [];
  for (let fret = 0; fret <= top; fret++) {
    const shapeKey = shiftKey(key, -fret);
    // Each shape is named as the fretboard names it with this capo on
    // (`chordBelowCapo`: the root as the key picker spells it), so the panel's
    // capo line and the neck's line agree for every chord (integration seam 3).
    const moved = inputs.map((input) => chordBelowCapo(toChord(input), fret));
    const shapes = moved.map((shape) => ({ shape, open: hasOpenGrip(shape) }));
    const distinct = new Map<string, boolean>();
    for (const s of shapes) distinct.set(chordKey(s.shape), s.open);
    const openCount = [...distinct.values()].filter(Boolean).length;
    options.push({
      fret,
      shapeKey,
      shapes,
      openCount,
      distinctCount: distinct.size,
      allOpen: distinct.size > 0 && openCount === distinct.size,
    });
  }
  return options.sort(
    (a, b) => Number(b.allOpen) - Number(a.allOpen) || b.openCount - a.openCount || a.fret - b.fret,
  );
}
