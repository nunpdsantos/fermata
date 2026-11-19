import type { TFunction } from 'i18next';
import type { ChordShape } from '../../core/constants/guitarChordShapes.ts';

/** A hand-made grip's library name: its CAGED letter and kind, then an added bass ("E barre/G"). */
const LIBRARY_NAME = /^([CAGED]) (shape|barre)(\/.+)?$/;
/** A generated voicing's own name ("Open", "Pos 5"), then an added bass. */
const GENERATED_NAME = /^(?:Open|Pos \d+)(\/.+)?$/;

/**
 * The name a learner reads on a grip's chip (QA audit Q1, 2026-11-18), never
 * the library's or the generator's own ("AMaj13 barre", "Pos 5" reached the
 * screen, and in English whatever the language). A hand-made grip is named by
 * the CAGED shape it comes from ("A barre", "pestana de A", "cejilla de A");
 * a generated one by where it is drawn ("Open" at the nut or the capo, else
 * "Fret 9": its lowest fretted fret, the fret the anchor badge shows — a bass
 * added at fret 9 to a grip built at fret 2 is "Fret 9", not "Fret 2",
 * independent review of a611beb); an added bass keeps its "/G".
 */
export function chordChipLabel(entry: { shape: ChordShape; baseFret: number }, capo: number, t: TFunction): string {
  const named = LIBRARY_NAME.exec(entry.shape.shortName);
  if (named) return t(named[2] === 'shape' ? 'capo.shapeChip' : 'capo.barreChip', { shape: named[1] }) + (named[3] ?? '');
  const bass = GENERATED_NAME.exec(entry.shape.shortName)?.[1] ?? '';
  if (entry.baseFret === capo) return t('fretboard.chordOpen') + bass;
  const fretted = entry.shape.strings.flatMap((p) => (p.fret === null || entry.baseFret + p.fret <= capo ? [] : [entry.baseFret + p.fret]));
  return t('fretboard.chordFret', { fret: fretted.length ? Math.min(...fretted) : entry.baseFret }) + bass;
}
