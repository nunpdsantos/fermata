/**
 * F10 — Harmonic function & cadence drill items.
 *
 * Sub-groups (sequential rank from FAMILY_BASE.function = 3800):
 *   1. chord-function: 5 keys × 6 numerals = 30 items
 *   2. cadences: 5 items
 *   3. v7-of: 15 items (one per major key)
 */

import type { Note } from '../../types/music';
import { noteToString } from '../../types/music';
import type { DrillItem } from '../../types/drill';
import {
  displayNote,
  shuffleStable,
  FAMILY_BASE,
  MAJOR_KEYS,
  KEY_PRIORITY,
} from './shared';
import { buildScale, getRelativeMinor } from '../../constants/scales';
import { getDiatonicChordsForScale } from '../../constants/chords';

// ---------------------------------------------------------------------------
// 1. Chord function items
// ---------------------------------------------------------------------------

// The 5 keys used for chord-function exercises
const FUNC_KEYS_ASCII = ['C', 'G', 'D', 'F', 'Bb'];

// Numerals covered in chord-function exercises (6 per key)
const FUNC_NUMERALS = ['I', 'ii', 'IV', 'V', 'vi', 'vii°'];

// Function assignments: I,vi → Tonic; ii,IV → Subdominant; V,vii° → Dominant
const NUMERAL_FUNCTION: Record<string, string> = {
  I: 'Tonic',
  vi: 'Tonic',
  ii: 'Subdominant (pre-dominant)',
  IV: 'Subdominant (pre-dominant)',
  V: 'Dominant',
  'vii°': 'Dominant',
};

const FUNCTION_LABELS = ['Tonic', 'Subdominant (pre-dominant)', 'Dominant'];

// Direction description for each function (for why explanation)
const FUNCTION_DIRECTION: Record<string, string> = {
  Tonic: 'home — creates rest',
  'Subdominant (pre-dominant)': 'away from tonic — builds tension toward V',
  Dominant: 'toward tonic — creates strong pull to resolve',
};

// ---------------------------------------------------------------------------
// 2. Cadence items
// ---------------------------------------------------------------------------

const CADENCES: Array<{ pair: string; pairDisplay: string; answer: string; uk: string }> = [
  { pair: 'V-I',   pairDisplay: 'V → I',  answer: 'Perfect authentic cadence', uk: 'perfect' },
  { pair: 'IV-I',  pairDisplay: 'IV → I', answer: 'Plagal cadence',            uk: 'plagal' },
  { pair: 'ii-V',  pairDisplay: 'ii → V', answer: 'Half cadence',              uk: 'imperfect' },
  { pair: 'I-V',   pairDisplay: 'I → V',  answer: 'Half cadence',              uk: 'imperfect' },
  { pair: 'V-vi',  pairDisplay: 'V → vi', answer: 'Deceptive cadence',         uk: 'interrupted' },
];

const CADENCE_CHOICES = [
  'Perfect authentic cadence',
  'Plagal cadence',
  'Half cadence',
  'Deceptive cadence',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function majorTonicNote(keyStr: string): Note {
  const found = MAJOR_KEYS.find((k) => noteToString(k) === keyStr);
  if (!found) throw new Error(`genFunction: unknown key "${keyStr}"`);
  return found;
}

export function genFunction(): DrillItem[] {
  const items: DrillItem[] = [];
  let rank = FAMILY_BASE.function;

  // ---------------------------------------------------------------------------
  // 1. chord-function items (30)
  // ---------------------------------------------------------------------------

  for (const keyStr of FUNC_KEYS_ASCII) {
    const tonic = majorTonicNote(keyStr);
    const scale = buildScale(tonic, 'major');
    const diatonic = getDiatonicChordsForScale(scale);
    const keyDisplay = `${displayNote(tonic)} major`;

    // Build numeral → chord-display map from diatonic chords
    const numeralToEntry = new Map<string, { root: Note; quality: string }>();
    for (const entry of diatonic) {
      numeralToEntry.set(entry.numeral, { root: entry.chord.root, quality: entry.chord.quality });
    }

    for (const numeral of FUNC_NUMERALS) {
      const entry = numeralToEntry.get(numeral);
      if (!entry) continue; // should never happen for these 6 numerals in major keys

      const chordStr = `${displayNote(entry.root)} ${entry.quality}`;
      const chordWithNumeral = `${chordStr} (${numeral})`;
      const fn = NUMERAL_FUNCTION[numeral];
      if (!fn) continue;

      const choices = shuffleStable(FUNCTION_LABELS, `function:chord-function:${keyStr}:${numeral}:choices`);

      items.push({
        id: `function:chord-function:${keyStr}:${numeral}`,
        family: 'function',
        promptKey: 'drill.prompts.chordFunction',
        promptParams: { key: keyDisplay, chord: chordWithNumeral },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct: fn },
        whyKey: 'drill.why.functionPull',
        whyParams: { chord: chordStr, direction: FUNCTION_DIRECTION[fn] ?? '' },
        rank: rank++,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2. cadence items (5)
  // ---------------------------------------------------------------------------

  for (const cadence of CADENCES) {
    const choices = shuffleStable(CADENCE_CHOICES, `function:cadence:${cadence.pair}:choices`);

    items.push({
      id: `function:cadence:${cadence.pair}`,
      family: 'function',
      promptKey: 'drill.prompts.cadence',
      promptParams: { pair: cadence.pairDisplay },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct: cadence.answer },
      whyKey: 'drill.why.cadenceDef',
      whyParams: { answer: cadence.answer, uk: cadence.uk },
      rank: rank++,
    });
  }

  // ---------------------------------------------------------------------------
  // 3. v7-of items (15 — one per major key)
  // ---------------------------------------------------------------------------

  for (const tonic of MAJOR_KEYS) {
    const tonicStr = noteToString(tonic);
    const scale = buildScale(tonic, 'major');
    const deg5 = scale.notes[4]; // degree 5 = perfect 5th above tonic
    const answer = `${displayNote(deg5)}7`;

    // Lure pool: use degree 4 V7, relative-minor's V7, adjacent circle-key V7 — all real traps
    const deg4 = scale.notes[3];
    const lure1 = `${displayNote(deg4)}7`; // IV7 (confusable neighbor)

    const relMinorTonic = getRelativeMinor(tonic);
    const relMinorScale = buildScale(relMinorTonic, 'major'); // relative MAJOR scale of the relative minor
    const relMinorDeg5 = relMinorScale.notes[4];
    const lure2 = `${displayNote(relMinorDeg5)}7`; // V7 of relative-minor's own major context

    // Circle neighbor: the key a perfect 5th below (previous key in circle of fifths)
    // = the key whose degree 5 IS this tonic. We find it by looking at KEY_PRIORITY neighbors.
    const idx = KEY_PRIORITY.indexOf(tonicStr);
    const neighborIdx = ((idx - 1) + KEY_PRIORITY.length) % KEY_PRIORITY.length;
    const neighborStr = KEY_PRIORITY[neighborIdx];
    const neighborTonic = MAJOR_KEYS.find((k) => noteToString(k) === neighborStr);
    const neighborScale = neighborTonic ? buildScale(neighborTonic, 'major') : scale;
    const neighborDeg5 = neighborScale.notes[4];
    const lure3 = `${displayNote(neighborDeg5)}7`;

    // Build unique choices (correct + up to 3 lures, deduplicated)
    const rawChoices = [answer, lure1, lure2, lure3];
    const unique = [...new Set(rawChoices)];
    // If deduplication collapsed below 4, fill from deg2/deg7
    if (unique.length < 4) {
      const deg2 = scale.notes[1];
      unique.push(`${displayNote(deg2)}7`);
    }
    const choices = shuffleStable(unique.slice(0, 4), `function:v7-of:${tonicStr}:choices`);

    const keyDisplay = displayNote(tonic);
    const fiveDisplay = displayNote(deg5);

    items.push({
      id: `function:v7-of:${tonicStr}`,
      family: 'function',
      promptKey: 'drill.prompts.v7Of',
      promptParams: { key: keyDisplay },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct: answer },
      whyKey: 'drill.why.v7Derivation',
      whyParams: { key: keyDisplay, five: fiveDisplay, answer },
      rank: rank++,
    });
  }

  return items;
}
