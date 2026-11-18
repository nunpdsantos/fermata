import type { TFunction } from 'i18next';
import type { Chord, Note, Scale } from '../../core/types/music.ts';
import type { DiatonicChord } from '../../hooks/useKeyContext.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { degreeOf, letterDistance, type Degree } from '../../core/utils/degreeSpelling.ts';
import { numeralFor } from '../../core/utils/progression/chordInKey.ts';

/** What Build's "Detected" line says about the chord's place in the selected scale. */
export interface BuilderRole {
  /** The words as shown. */
  text: string;
  /** Every tone of the chord is a note of the scale. */
  inKey: boolean;
}

/** Every pitch the chord sounds (the slash bass included), each once, as the chord spells it. */
function tonesOf(chord: Chord): Note[] {
  const all = chord.bassNote ? [chord.bassNote, ...chord.notes] : chord.notes;
  return all.filter((n, i) => all.findIndex((m) => getPitchClass(m) === getPitchClass(n)) === i);
}

/**
 * The degree of a scale note, its ♭ / ♯ as the app numbers that scale: the
 * prefix of the scale's own chord on that degree (church modes against the
 * parallel major — Mixolydian ♭VII —, major and the minor scales plain —
 * minor's VII); a seven-note scale with no chord on that degree plain as
 * well; any other scale (pentatonic, blues, symmetric, a bebop passing tone)
 * against the major scale, as the staff strip writes its degrees (♭3).
 */
function scaleDegree(scale: Scale, note: Note, diatonicChords: readonly DiatonicChord[]): Degree {
  const number = letterDistance(scale.root.natural, note.natural) + 1;
  const triad = diatonicChords.find((dc) => getPitchClass(dc.chord.root) === getPitchClass(note));
  if (triad) {
    const prefix = triad.numeral.match(/^[♭♯]*/)?.[0] ?? '';
    return { number, alteration: [...prefix].reduce((a, c) => a + (c === '♭' ? -1 : 1), 0) };
  }
  if (scale.notes.length === 7) return { number, alteration: 0 };
  return { number, alteration: degreeOf(scale.root, note).alteration };
}

/**
 * Audit 2026-11-18, Q2: a chord is in the key when EVERY one of its tones is
 * a note of the selected scale (by pitch: E♯ is F). Its place is then named
 * as the app names chords in a key — the scale's own triad keeps its numeral
 * (V, vii°), any other chord takes the numeral of its root's degree with its
 * own suffix (V7, Imaj7, iiø7, Isus4, I5; `numeralFor`, the progression
 * engine's rule). A chord with a tone outside says which, in plain words.
 * No nested brackets (it read "(non-diatonic (root is the V of C Major))").
 */
export function builderRole(chord: Chord | null, scale: Scale, diatonicChords: readonly DiatonicChord[], t: TFunction): BuilderRole | null {
  if (!chord) return null;
  const rootPc = getPitchClass(chord.root);
  // Display names, never internal ids (audit W1-10: was "C diminished whole_half").
  const keyLabel = `${withGlyphs(scale.root)} ${t(`scaleName.${scale.type}`)}`;
  const scalePcs = new Set(scale.notes.map(getPitchClass));
  const outside = tonesOf(chord).filter((n) => !scalePcs.has(getPitchClass(n)));
  const scaleNote = scale.notes.find((n) => getPitchClass(n) === rootPc);
  if (!scaleNote) return { text: t('chordBuilder.outOfKey', { key: keyLabel }), inKey: false };
  if (outside.length === 0) {
    const match = diatonicChords.find((dc) => getPitchClass(dc.chord.root) === rootPc && dc.chord.quality === chord.quality);
    const numeral = match?.numeral ?? numeralFor(scaleDegree(scale, scaleNote, diatonicChords), chord);
    return { text: `${numeral} ${t('chordBuilder.ofKey', { key: keyLabel })}`, inKey: true };
  }
  return {
    text: t('chordBuilder.nonDiatonicAt', {
      numeral: diatonicChords.find((dc) => getPitchClass(dc.chord.root) === rootPc)?.numeral
        ?? `${degreeOf(scale.root, scaleNote).number}`,
      key: keyLabel,
      notes: outside.map((n) => withGlyphs(n)).join(', '),
    }),
    inKey: false,
  };
}
