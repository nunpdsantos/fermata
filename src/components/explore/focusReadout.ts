/**
 * The instrument READ-OUT for the linked focus note (W11-B, D-25):
 * "B — 3rd of G · leading note of C Major · string 5 fret 2, string 2 open".
 *
 * Pure: the caller passes the key context, the selected chord, where the
 * instrument lights the note, and `t`. Every name goes through the spelling
 * engine (the chord's own spelling for its tones, then the scale's, then the
 * context spelling) and every degree / chord-tone label is read from the
 * spelled letter — never from a semitone count.
 */
import { noteToString, type Chord, type Note, type Scale } from '../../core/types/music.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { CHORD_SYMBOLS, getChordShortIntervalLabels } from '../../core/constants/chords.ts';
import { SCALE_FORMULAS, getScaleDegreeFunctionKey } from '../../core/constants/scales.ts';
import { degreeOf, formatDegree } from '../../core/utils/degreeSpelling.ts';
import type { FocusNote } from '../../state/focusNoteStore.ts';

type T = (key: string, opts?: Record<string, unknown>) => string;

export interface ReadoutInput {
  focus: FocusNote;
  scale: Scale;
  chord: Chord | null;
  /** Context-aware spelling (chord > scale > key signature). */
  spellPitchClass: (pc: number) => Note;
  /** Where the instrument lights the note ("string 5 fret 2", "B4"), if any. */
  locations?: readonly string[];
  t: T;
}

export interface ReadoutParts {
  note: string;
  chordRole: string | null;
  keyRole: string;
  locations: string | null;
}

/** "C Major", "A Natural Minor": the key as the rest of Explore names it. */
export function keyName(scale: Scale, t: T): string {
  return `${withGlyphs(scale.root)} ${t(`scaleName.${scale.type}`)}`;
}

/** "G", "Dm", "Bdim", "G7": the chord symbol the chord cards print. */
export function chordSymbol(chord: Chord): string {
  if (chord.algorithmicDisplayName) return withGlyphs(`${noteToString(chord.root)}${chord.algorithmicDisplayName}`);
  const base = `${noteToString(chord.root)}${CHORD_SYMBOLS[chord.quality] ?? ''}`;
  return withGlyphs(chord.bassNote ? `${base}/${noteToString(chord.bassNote)}` : base);
}

/** "root", "3rd", "5th", "b7", "#5": what a chord tone is, from the chord's own formula. */
function chordToneRole(chord: Chord, pc: number, t: T): string | null {
  const labels = chord.algorithmicIntervalLabels ?? getChordShortIntervalLabels(chord.quality);
  const idx = chord.notes.findIndex((n) => getPitchClass(n) === pc);
  const symbol = chordSymbol(chord);
  if (idx < 0) {
    if (chord.bassNote && getPitchClass(chord.bassNote) === pc) return t('explore.readout.bassOf', { chord: symbol });
    return null;
  }
  const label = labels[idx] ?? '';
  if (label === 'R' || label === '1') return t('explore.readout.rootOf', { chord: symbol });
  // Unaltered tones read as ordinals ("3rd"), altered ones keep their label ("b7").
  const plain = /^\d+$/.test(label) ? t(`explore.readout.tone${label}`, { defaultValue: label }) : withGlyphs(label);
  return t('explore.readout.toneOf', { tone: plain, chord: symbol });
}

/** "leading note of C Major", "b3 of A Blues", "not in C Major". */
function keyRole(scale: Scale, pc: number, t: T): string {
  const key = keyName(scale, t);
  const i = scale.notes.findIndex((n) => getPitchClass(n) === pc);
  if (i < 0) return t('explore.readout.notIn', { key });
  const deg = degreeOf(scale.root, scale.notes[i]);
  if (scale.notes.length === 7) {
    const fnKey = getScaleDegreeFunctionKey(i, SCALE_FORMULAS[scale.type]?.[i] ?? 0);
    if (fnKey) return t('explore.readout.fnOf', { fn: t(fnKey.replace('degreeShort.', 'explore.fn.')), key });
  }
  if (deg.number === 1 && deg.alteration === 0) return t('explore.readout.fnOf', { fn: t('explore.fn.tonic'), key });
  return t('explore.readout.degreeOf', { degree: withGlyphs(formatDegree(deg, '1')), key });
}

/** The note's name in context: a chord tone as the chord spells it, else the scale's, else the context spelling. */
export function focusNoteName(focus: FocusNote, scale: Scale, chord: Chord | null, spellPitchClass: (pc: number) => Note): string {
  const fromChord = chord ? [...chord.notes, ...(chord.bassNote ? [chord.bassNote] : [])].find((n) => getPitchClass(n) === focus.pc) : undefined;
  const fromScale = scale.notes.find((n) => getPitchClass(n) === focus.pc);
  return withGlyphs(fromChord ?? fromScale ?? spellPitchClass(focus.pc));
}

export function readoutParts({ focus, scale, chord, spellPitchClass, locations, t }: ReadoutInput): ReadoutParts {
  return {
    note: focusNoteName(focus, scale, chord, spellPitchClass),
    chordRole: chord ? chordToneRole(chord, focus.pc, t) : null,
    keyRole: keyRole(scale, focus.pc, t),
    locations: locations && locations.length > 0 ? locations.join(', ') : null,
  };
}

/**
 * The read-out from longest to shortest: the dock bar shows the first that
 * fits its room (on a phone, two lines), so it never grows the bar.
 */
export function readoutVariants(p: ReadoutParts): string[] {
  const join = (parts: (string | null)[]) => {
    const rest = parts.filter(Boolean).join(' · ');
    return rest ? `${p.note} — ${rest}` : p.note;
  };
  const out = [
    join([p.chordRole, p.keyRole, p.locations]),
    join([p.chordRole, p.keyRole]),
    join([p.chordRole ?? p.keyRole]),
    p.note,
  ];
  return out.filter((s, i) => out.indexOf(s) === i);
}
