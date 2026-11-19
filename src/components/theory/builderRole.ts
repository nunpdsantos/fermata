import type { TFunction } from 'i18next';
import type { Chord, ChordIdentification, Note, Scale } from '../../core/types/music.ts';
import type { DiatonicChord } from '../../hooks/useKeyContext.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { getPitchClass, getSimplestSpelling } from '../../core/constants/notes.ts';
import { buildChord } from '../../core/constants/chords.ts';
import { degreeOf, formatDegree, letterDistance, type Degree } from '../../core/utils/degreeSpelling.ts';
import { numeralFor } from '../../core/utils/progression/chordInKey.ts';
import '../../i18n/exploreTools';

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
 * A root's degree the way the staff strip writes degrees — read from the
 * note's letter against the major scale on the tonic: 1, ♭3, ♯4, 7 (fix pass:
 * it said "the vii° of C Major" for a B MAJOR chord, "the v" for E7 in A
 * minor, "the 3" for E♭ in C blues — a chord's numeral, or a bare number,
 * where a note's place was meant).
 */
function degreeText(scale: Scale, note: Note): string {
  return withGlyphs(formatDegree(degreeOf(scale.root, note), '1'));
}

/**
 * Audit 2026-11-18, Q2: a chord is in the key when EVERY one of its tones is
 * a note of the selected scale (by pitch: E♯ is F). Its place is then named
 * as the app names chords in a key — the scale's own triad keeps its numeral
 * (V, vii°), any other chord takes the numeral of its root's degree with its
 * own suffix (V7, Imaj7, iiø7, Isus4, I5; `numeralFor`, the progression
 * engine's rule). A chord with a tone outside names its root's DEGREE (the
 * scale's note on that pitch, or the root as spelled when the scale has no
 * such note) and the notes outside. No nested brackets.
 */
export function builderRole(chord: Chord | null, scale: Scale, diatonicChords: readonly DiatonicChord[], t: TFunction): BuilderRole | null {
  if (!chord) return null;
  const rootPc = getPitchClass(chord.root);
  // Display names, never internal ids (audit W1-10: was "C diminished whole_half").
  const keyLabel = `${withGlyphs(scale.root)} ${t(`scaleName.${scale.type}`)}`;
  const scalePcs = new Set(scale.notes.map(getPitchClass));
  const outside = tonesOf(chord).filter((n) => !scalePcs.has(getPitchClass(n)));
  const notes = outside.map((n) => withGlyphs(n)).join(', ');
  const scaleNote = scale.notes.find((n) => getPitchClass(n) === rootPc);
  if (!scaleNote) {
    return { text: t('exploreTools.rootOutside', { degree: degreeText(scale, chord.root), key: keyLabel, notes }), inKey: false };
  }
  if (outside.length === 0) {
    const match = diatonicChords.find((dc) => getPitchClass(dc.chord.root) === rootPc && dc.chord.quality === chord.quality);
    const numeral = match?.numeral ?? numeralFor(scaleDegree(scale, scaleNote, diatonicChords), chord);
    return { text: `${numeral} ${t('chordBuilder.ofKey', { key: keyLabel })}`, inKey: true };
  }
  return { text: t('exploreTools.rootInKey', { degree: degreeText(scale, scaleNote), key: keyLabel, notes }), inKey: false };
}

const sameReading = (a: ChordIdentification, b: ChordIdentification) =>
  getPitchClass(a.chord.root) === getPitchClass(b.chord.root) && a.chord.quality === b.chord.quality;

/**
 * "Other interpretations" (fix pass, item 6): never the main reading again;
 * first every reading as exact as it (a diminished 7th or an augmented triad
 * reads the same on each of its notes: C E♭ G♭ B𝄫 is also E♭, G♭ and A dim7),
 * then the closest others, four at least. Each reading's root is spelled as
 * the main chord spells that note (E♭, G♭), a double accidental by its
 * simplest name (B𝄫 → A), and its chord by the app's spelling (`buildChord`).
 * It used to list `results.slice(1)`, which repeated the main reading
 * whenever the builder's root was not the parser's first, and dropped that one.
 */
export function otherReadings(main: ChordIdentification | undefined, results: readonly ChordIdentification[]): ChordIdentification[] {
  if (!main) return [];
  const pool: ChordIdentification[] = [];
  for (const r of results) if (!sameReading(r, main) && !pool.some((p) => sameReading(p, r))) pool.push(r);
  // In the order their roots rise from the main one (C dim7: E♭, G♭, A).
  const above = (r: ChordIdentification) => (getPitchClass(r.chord.root) - getPitchClass(main.chord.root) + 12) % 12;
  const exact = pool.filter((r) => r.confidence === 'exact' && r.score === main.score).sort((a, b) => above(a) - above(b));
  const rest = pool.filter((r) => !exact.includes(r));
  const spell = (r: ChordIdentification): ChordIdentification => {
    const pc = getPitchClass(r.chord.root);
    const tone = main.chord.notes.find((n) => getPitchClass(n) === pc);
    const plain = (n: Note | undefined) => !!n && n.accidental.length < 2;
    const root = plain(tone) ? tone! : plain(r.chord.root) ? r.chord.root : getSimplestSpelling(pc as Parameters<typeof getSimplestSpelling>[0]);
    return { ...r, chord: buildChord(root, r.chord.quality) };
  };
  return [...exact, ...rest].slice(0, Math.max(4, exact.length)).map(spell);
}

/** How a reading matches the notes built, in the learner's language. */
export function matchText(r: ChordIdentification, t: TFunction): string {
  const missing = r.missingNotes?.length ?? 0;
  const extra = r.extraNotes?.length ?? 0;
  if (r.score >= 95 || (missing === 0 && extra === 0)) return t('exploreTools.match.perfect');
  if (missing === 0) return t('exploreTools.match.added', { count: extra });
  if (extra === 0) return t('exploreTools.match.missing', { count: missing });
  return t('exploreTools.match.both', { missing, extra });
}
