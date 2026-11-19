/**
 * Selecting a chord as it was written (second audit, 2026-11-18, and the
 * review of b94d761, item 7).
 *
 * A slash chord whose bass is one of the chord's own tones IS an inversion:
 * C/E is C major in first inversion, C/G the second, G7/F the third. Explore
 * shows inversions with its Voicing chips, and the instrument, the staff and
 * the sound all read the inverted notes (`useKeyContext` `invertedNotes`); a
 * chord kept with a slash bass instead plays the bass an octave below the
 * whole root-position chord (`chordVoicingPitches`: E3 and E4 for C/E) with
 * the chip on Root. So C/E is selected as C major, inversion 1.
 *
 * Kept as written: a bass that is not a chord tone (C/D, Dm7/G — a true
 * slash chord), a chord the parser built with its own name ("Cm(add9)/G",
 * whose name carries the bass), and anything in Simple view, which has no
 * inversions and resets them (wave 1).
 *
 * Used by every way a chord is opened by name: Quick Search, a lesson's Try
 * This and its instrument (`applyResolvedTheoryQuery`), a shared link.
 */
import type { Chord } from '../core/types/music';
import { getPitchClass } from '../core/constants/notes';
import { useAppStore } from '../state/store';
import { resolveExploreDetail } from '../state/exploreDetail';
import { getLearnerProfile } from '../state/learnerProfile';

/** The inversion a slash chord's bass names (0 = the root), or null when it is not one of the chord's tones. */
export function inversionOfBass(chord: Chord): number | null {
  if (!chord.bassNote || chord.algorithmicDisplayName || chord.notes.length === 0) return null;
  // A bass that is not a chord tone is put first by the parser
  // (`chordFromParsed`: C/D → D C E G): that is a true slash chord.
  if (getPitchClass(chord.notes[0]) !== getPitchClass(chord.root)) return null;
  const at = chord.notes.findIndex((n) => getPitchClass(n) === getPitchClass(chord.bassNote!));
  return at >= 0 ? at : null;
}

/** Does Explore show its Simple view (no inversions) now? */
export function exploreIsSimple(): boolean {
  return resolveExploreDetail(useAppStore.getState().exploreDetail, getLearnerProfile()) === 'simple';
}

/** Select a chord in the store as written: C/E as C major, first inversion (see the header). */
export function selectChordAsWritten(chord: Chord): void {
  const store = useAppStore.getState();
  const inversion = inversionOfBass(chord);
  if (inversion === null || exploreIsSimple()) {
    store.setSelectedChord(chord);
    return;
  }
  const plain: Chord = { ...chord };
  delete plain.bassNote;
  store.setSelectedChord(plain);
  if (inversion > 0) store.setChordInversion(inversion);
}
