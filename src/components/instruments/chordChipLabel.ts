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
 * a generated one by where it sits ("Open", "Fret 5"; at the capo, "Open");
 * an added bass keeps its "/G".
 */
export function chordChipLabel(entry: { shape: ChordShape; baseFret: number }, capo: number, t: TFunction): string {
  const named = LIBRARY_NAME.exec(entry.shape.shortName);
  if (named) return t(named[2] === 'shape' ? 'capo.shapeChip' : 'capo.barreChip', { shape: named[1] }) + (named[3] ?? '');
  const bass = GENERATED_NAME.exec(entry.shape.shortName)?.[1] ?? '';
  return (entry.baseFret === capo ? t('fretboard.chordOpen') : t('fretboard.chordFret', { fret: entry.baseFret })) + bass;
}
