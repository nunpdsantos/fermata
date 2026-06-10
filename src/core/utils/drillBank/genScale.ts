/**
 * F7 — Scale drill items.
 *
 * Per key/type:
 *   - scale:spell:<tonicAscii>:<type>    (accidentalSlots)
 *   - scale:degree-of:<tonicAscii>:<mode>:<n>  (choice, n=2..7)
 *
 * Rank layout: FAMILY_BASE.scale = 1700, stride 10 per key.
 * Minor key tonic ASCII uses LOWERCASE (same as genKeysig).
 * Scales containing ## or bb are FILTERED out.
 */

import type { Note } from '../../types/music';
import { noteToString } from '../../types/music';
import type { DrillItem } from '../../types/drill';
import type { NaturalNote } from '../../types/music';
import {
  N,
  displayNote,
  shuffleStable,
  FAMILY_BASE,
  KEY_PRIORITY,
  MAJOR_KEYS,
} from './shared';
import { buildScale, getRelativeMinor } from '../../constants/scales';

// Scale types for the minor drill
const MINOR_TYPES = ['natural_minor', 'harmonic_minor', 'melodic_minor'] as const;

// ---- scale display names ----
const SCALE_TYPE_DISPLAY: Record<string, string> = {
  major: 'major',
  natural_minor: 'natural minor',
  harmonic_minor: 'harmonic minor',
  melodic_minor: 'melodic minor',
};

// Rank base for a major tonic key string
function keyRankBase(keyAscii: string): number {
  const idx = KEY_PRIORITY.indexOf(keyAscii);
  if (idx === -1) return FAMILY_BASE.scale + KEY_PRIORITY.length * 10;
  return FAMILY_BASE.scale + idx * 10;
}

/** Check if a scale's notes contain double accidentals (## or bb) */
function hasDoubleAccidental(notes: Note[]): boolean {
  return notes.some((n) => n.accidental === '##' || n.accidental === 'bb');
}

export function genScale(): DrillItem[] {
  const items: DrillItem[] = [];

  // ---- Major scales ----
  for (const majorTonic of MAJOR_KEYS) {
    const tonicAscii = noteToString(majorTonic);
    const scale = buildScale(majorTonic, 'major');

    if (hasDoubleAccidental(scale.notes)) continue;

    const baseRank = keyRankBase(tonicAscii);
    const scaleDisplay = `${displayNote(majorTonic)} major`;

    // --- spell item ---
    const letters = scale.notes.map((n) => n.natural) as NaturalNote[];
    const spelledAscii = scale.notes.map(noteToString);

    items.push({
      id: `scale:spell:${tonicAscii}:major`,
      family: 'scale',
      promptKey: 'drill.prompts.spellScale',
      promptParams: { scale: scaleDisplay },
      input: { format: 'accidentalSlots', letters },
      answer: { kind: 'accidentals', spelled: spelledAscii },
      whyKey: 'drill.why.scaleKeySig',
      whyParams: { scale: scaleDisplay, accs: spelledAscii.join(' ') },
      rank: baseRank,
    });

    // --- degree-of items (n=2..7) ---
    for (let n = 2; n <= 7; n++) {
      const degreeNote = scale.notes[n - 1];
      const correct = displayNote(degreeNote);
      const choices = buildDegreeChoices(scale.notes, n - 1, correct);

      items.push({
        id: `scale:degree-of:${tonicAscii}:major:${n}`,
        family: 'scale',
        promptKey: 'drill.prompts.degreeOf',
        promptParams: { num: n, key: scaleDisplay },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct },
        whyKey: 'drill.why.scaleKeySig',
        whyParams: { scale: scaleDisplay, accs: spelledAscii.join(' ') },
        rank: baseRank + n - 1,
      });
    }
  }

  // ---- Minor scales ----
  for (const majorTonic of MAJOR_KEYS) {
    const minorTonic = getRelativeMinor(majorTonic);
    const minorTonicAscii = noteToString(minorTonic).toLowerCase();
    const majorKeyAscii = noteToString(majorTonic);
    for (const type of MINOR_TYPES) {
      const scale = buildScale(minorTonic, type);

      if (hasDoubleAccidental(scale.notes)) continue;

      const typeName = SCALE_TYPE_DISPLAY[type];
      const scaleDisplay = `${displayNote(minorTonic)} ${typeName}`;
      const spelledAscii = scale.notes.map(noteToString);
      const letters = scale.notes.map((n) => n.natural) as NaturalNote[];

      // Rank layout: majors use FAMILY_BASE.scale + idx*10; minors get a separate range
      // after all major keys: FAMILY_BASE.scale + KEY_PRIORITY.length * 10 + (idx * 3 + typeIdx) * 10
      const typeIdx = MINOR_TYPES.indexOf(type);
      const majorKeyIdx = KEY_PRIORITY.indexOf(majorKeyAscii);
      if (majorKeyIdx === -1) throw new Error(`genScale: unknown major key "${majorKeyAscii}" in KEY_PRIORITY`);
      const minorKeyRankBase = FAMILY_BASE.scale + (KEY_PRIORITY.length + majorKeyIdx * 3 + typeIdx) * 10;

      // --- spell item ---
      const isHarmonicOrMelodic = type === 'harmonic_minor' || type === 'melodic_minor';

      // Find raised notes for harmonic/melodic
      const naturalMinorScale = buildScale(minorTonic, 'natural_minor');
      const raisedNotes = isHarmonicOrMelodic
        ? scale.notes.filter((n, i) => noteToString(n) !== noteToString(naturalMinorScale.notes[i]))
        : [];
      const raisedDisplay = raisedNotes.map(displayNote).join(', ');

      const whyKey = isHarmonicOrMelodic ? 'drill.why.harmonicRaise' : 'drill.why.scaleKeySig';
      const whyParams: Record<string, string | number> = isHarmonicOrMelodic
        ? { scale: scaleDisplay, raised: raisedDisplay }
        : { scale: scaleDisplay, accs: spelledAscii.join(' ') };

      items.push({
        id: `scale:spell:${minorTonicAscii}:${type}`,
        family: 'scale',
        promptKey: 'drill.prompts.spellScale',
        promptParams: { scale: scaleDisplay },
        input: { format: 'accidentalSlots', letters },
        answer: { kind: 'accidentals', spelled: spelledAscii },
        whyKey,
        whyParams,
        rank: minorKeyRankBase,
      });

      // --- degree-of items for natural_minor only (keeps parity with major) ---
      if (type === 'natural_minor') {
        for (let n = 2; n <= 7; n++) {
          const degreeNote = scale.notes[n - 1];
          const correct = displayNote(degreeNote);
          const choices = buildDegreeChoices(scale.notes, n - 1, correct);

          items.push({
            id: `scale:degree-of:${minorTonicAscii}:natural_minor:${n}`,
            family: 'scale',
            promptKey: 'drill.prompts.degreeOf',
            promptParams: { num: n, key: scaleDisplay },
            input: { format: 'choice', choices },
            answer: { kind: 'choice', correct },
            whyKey: 'drill.why.scaleKeySig',
            whyParams: { scale: scaleDisplay, accs: spelledAscii.join(' ') },
            rank: minorKeyRankBase + n,
          });
        }
      }
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Degree choice builder
// ---------------------------------------------------------------------------

function buildDegreeChoices(notes: Note[], degreeIdx: number, correct: string): string[] {
  const lures: string[] = [];

  // Adjacent degrees' notes
  if (degreeIdx > 0) lures.push(displayNote(notes[degreeIdx - 1]));
  if (degreeIdx < notes.length - 1) lures.push(displayNote(notes[degreeIdx + 1]));

  // Accidental-flip of correct note
  const note = notes[degreeIdx];
  if (note.accidental === '#') lures.push(displayNote(N(note.natural, '')));
  else if (note.accidental === '') lures.push(displayNote(N(note.natural, '#')));
  else if (note.accidental === 'b') lures.push(displayNote(N(note.natural, '')));
  else lures.push(displayNote(N(note.natural, 'b')));

  // Unique, correct included
  const candidates = [correct, ...lures.filter((l) => l !== correct)];
  return shuffleStable([...new Set(candidates)].slice(0, 4), `scale:degree-choices:${correct}:${degreeIdx}`);
}
