/**
 * F5 — Interval drill items.
 *
 * Sub-groups (ranked sequentially from FAMILY_BASE.interval = 600):
 *   1. letter-third items   (7)
 *   2. natural ascending pairs (42)
 *   3. semitone facts        (12)
 *   4. note-above            (up to 96, minus skipped)
 *   5. altered pairs         (~24)
 */

import type { Note } from '../../types/music';
import { noteToString } from '../../types/music';
import type { DrillItem } from '../../types/drill';
import {
  N,
  displayNote,
  shuffleStable,
  FAMILY_BASE,
  PRACTICAL_ROOTS,
} from './shared';
import { nameIntervalBetween, noteAtIntervalAbove } from './intervalEngine';
import { ABBREVIATION_TO_SEMITONES } from '../../constants/intervals';
import { NATURAL_NOTE_ORDER, getPitchClass, PITCH_CLASS_SPELLINGS } from '../../constants/notes';

// Interval labels for semitone facts (post-WS6 authoritative: index 8 = 'Minor 6th')
const INTERVAL_LABELS: Record<number, string> = {
  0: 'Perfect Unison',
  1: 'Minor 2nd',
  2: 'Major 2nd',
  3: 'Minor 3rd',
  4: 'Major 3rd',
  5: 'Perfect 4th',
  6: 'Tritone',
  7: 'Perfect 5th',
  8: 'Minor 6th',
  9: 'Major 6th',
  10: 'Minor 7th',
  11: 'Major 7th',
  12: 'Octave',
};

// Abbreviation display names for note-above prompts
const ABBR_DISPLAY: Record<string, string> = {
  m3: 'minor 3rd',
  M3: 'major 3rd',
  P4: 'perfect 4th',
  P5: 'perfect 5th',
  m6: 'minor 6th',
  M6: 'major 6th',
  m7: 'minor 7th',
  M7: 'major 7th',
};

// Abbreviation to interval number (which scale degree letter to land on)
const ABBR_TO_NUMBER: Record<string, number> = {
  m3: 3,
  M3: 3,
  P4: 4,
  P5: 5,
  m6: 6,
  M6: 6,
  m7: 7,
  M7: 7,
};

// All 7 naturals as Notes
const NATURALS: Note[] = NATURAL_NOTE_ORDER.map((l) => N(l));

// Note-above roots: PRACTICAL_ROOTS minus Gb, Db
const NOTE_ABOVE_ROOTS: Note[] = PRACTICAL_ROOTS.filter(
  (r) => !(r.natural === 'G' && r.accidental === 'b') && !(r.natural === 'D' && r.accidental === 'b'),
);

// Abbreviated intervals to generate note-above items for
const NOTE_ABOVE_ABBRS: string[] = ['m3', 'M3', 'P4', 'P5', 'm6', 'M6', 'm7', 'M7'];

// Hardcoded altered confusable pairs: [lower, upper]
// These are real confusions (same semitone count different spelling, or boundary M3/P4)
// Every pair produces non-null nameIntervalBetween — tested in invariant suite
const ALTERED_PAIRS: [Note, Note][] = [
  [N('C'), N('E', '#')],          // A3
  [N('C'), N('F')],                // P4
  [N('C', '#'), N('E')],           // m3
  [N('E'), N('G', '#')],           // M3
  [N('E', 'b'), N('G')],           // M3
  [N('F', '#'), N('C', '#')],      // P5
  [N('A'), N('C')],                 // m3
  [N('A'), N('C', '#')],           // M3
  [N('B', 'b'), N('D', 'b')],      // m3
  [N('B'), N('D')],                 // m3
  [N('G'), N('B', 'b')],           // m3
  [N('G', '#'), N('B')],           // m3
  [N('D'), N('F', '#')],           // M3
  [N('D', 'b'), N('F')],           // M3
  [N('F'), N('A', 'b')],           // m3
  [N('F'), N('A')],                 // M3
  [N('E'), N('G')],                 // m3
  [N('B'), N('F')],                 // d5
  [N('F'), N('B')],                 // A4
  [N('G'), N('D')],                 // P5
  [N('C'), N('G')],                 // P5
  [N('A'), N('E')],                 // P5
  [N('E', 'b'), N('B', 'b')],      // P5
  [N('A', 'b'), N('E', 'b')],      // P5
];

// Sequential rank counter — reset on each genInterval() call for determinism
let rankCounter = FAMILY_BASE.interval;
function nextRank(): number {
  return rankCounter++;
}

export function genInterval(): DrillItem[] {
  // Reset for determinism
  rankCounter = FAMILY_BASE.interval;
  const items: DrillItem[] = [];
  const seenIds = new Set<string>();

  function pushItem(item: DrillItem): void {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      items.push(item);
    }
  }

  // ---- Sub-group 1: letter-third items (7) ----
  for (const root of NATURALS) {
    const rootLetter = root.natural;
    const thirdIdx = (NATURAL_NOTE_ORDER.indexOf(rootLetter) + 2) % 7;
    const thirdNatural = NATURAL_NOTE_ORDER[thirdIdx];
    const correct = thirdNatural;

    const candidateLetters: string[] = [correct];
    // Adjacent letters around the third
    const below1 = NATURAL_NOTE_ORDER[(thirdIdx - 1 + 7) % 7];
    const above1 = NATURAL_NOTE_ORDER[(thirdIdx + 1) % 7];
    const below2 = NATURAL_NOTE_ORDER[(thirdIdx - 2 + 7) % 7];
    for (const c of [below1, above1, below2]) {
      if (!candidateLetters.includes(c)) candidateLetters.push(c);
      if (candidateLetters.length >= 4) break;
    }

    const choices = shuffleStable(candidateLetters.slice(0, 4), `interval:letter-third:${rootLetter}:choices`);
    pushItem({
      id: `interval:letter-third:${rootLetter}`,
      family: 'interval',
      promptKey: 'drill.prompts.letterThird',
      promptParams: { letter: rootLetter },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct },
      whyKey: 'drill.why.intervalLetterFirst',
      whyParams: { letter: rootLetter, answer: correct },
      rank: nextRank(),
    });
  }

  // ---- Sub-group 2: natural ascending pairs (42) ----
  for (const lower of NATURALS) {
    for (const upper of NATURALS) {
      if (lower.natural === upper.natural) continue;
      const named = nameIntervalBetween(lower, upper);
      if (!named) continue;

      const correct = named.label;
      const id = `interval:pair-to-name:${lower.natural}:${upper.natural}`;

      const lures = buildPairLures(named);
      const candidates = [...new Set([correct, ...lures])].slice(0, 4);
      const choices = shuffleStable(candidates, `${id}:choices`);

      const li = NATURAL_NOTE_ORDER.indexOf(lower.natural);
      const ui = NATURAL_NOTE_ORDER.indexOf(upper.natural);
      const letterCount = ((ui - li + 7) % 7) + 1;
      const letterText = `${lower.natural}–${upper.natural} = ${letterCount} letters`;

      pushItem({
        id,
        family: 'interval',
        promptKey: 'drill.prompts.pairToName',
        promptParams: { lower: lower.natural, upper: upper.natural },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct },
        whyKey: 'drill.why.intervalLetterFirst',
        whyParams: { letters: letterText, answer: correct },
        rank: nextRank(),
      });
    }
  }

  // ---- Sub-group 3: semitone facts (12) ----
  for (let n = 1; n <= 12; n++) {
    const correct = INTERVAL_LABELS[n] ?? `${n} semitones`;
    const lures = buildSemitoneNeighbors(n);
    const candidates = [...new Set([correct, ...lures])].slice(0, 4);
    const choices = shuffleStable(candidates, `interval:semitones-to-name:${n}:choices`);
    pushItem({
      id: `interval:semitones-to-name:${n}`,
      family: 'interval',
      promptKey: 'drill.prompts.semitonesToName',
      promptParams: { n },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct },
      whyKey: 'drill.why.semitoneFact',
      whyParams: { n, answer: correct },
      rank: nextRank(),
    });
  }

  // ---- Sub-group 4: note-above ----
  for (const root of NOTE_ABOVE_ROOTS) {
    for (const abbr of NOTE_ABOVE_ABBRS) {
      const semitones = ABBREVIATION_TO_SEMITONES[abbr];
      const number = ABBR_TO_NUMBER[abbr];
      const result = noteAtIntervalAbove(root, number, semitones);
      if (!result) continue;

      const rootAscii = noteToString(root);
      const id = `interval:note-above:${rootAscii}:${abbr}`;
      const correctDisplay = displayNote(result);

      const choiceDisplays = buildNoteAboveChoices(result);
      const candidates = [...new Set([correctDisplay, ...choiceDisplays])].slice(0, 4);
      const choices = shuffleStable(candidates, `${id}:choices`);

      const fullLabel = ABBR_DISPLAY[abbr] ?? abbr;
      pushItem({
        id,
        family: 'interval',
        promptKey: 'drill.prompts.noteAbove',
        promptParams: { interval: fullLabel, root: displayNote(root) },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct: correctDisplay },
        whyKey: 'drill.why.intervalLetterFirst',
        whyParams: { interval: fullLabel, root: displayNote(root), answer: correctDisplay },
        rank: nextRank(),
      });
    }
  }

  // ---- Sub-group 5: altered confusable pairs ----
  for (const [lower, upper] of ALTERED_PAIRS) {
    const named = nameIntervalBetween(lower, upper);
    if (!named) continue;

    const lowerAscii = noteToString(lower);
    const upperAscii = noteToString(upper);
    const id = `interval:pair-to-name:${lowerAscii}:${upperAscii}`;
    if (seenIds.has(id)) continue;

    const correct = named.label;
    const lures = buildPairLures(named);
    const candidates = [...new Set([correct, ...lures])].slice(0, 4);
    const choices = shuffleStable(candidates, `${id}:choices`);

    const li = NATURAL_NOTE_ORDER.indexOf(lower.natural);
    const ui = NATURAL_NOTE_ORDER.indexOf(upper.natural);
    const letterCount = ((ui - li + 7) % 7) + 1;
    const letterText = `${displayNote(lower)}–${displayNote(upper)} = ${letterCount} letters`;

    pushItem({
      id,
      family: 'interval',
      promptKey: 'drill.prompts.pairToName',
      promptParams: { lower: displayNote(lower), upper: displayNote(upper) },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct },
      whyKey: 'drill.why.intervalLetterFirst',
      whyParams: { letters: letterText, answer: correct },
      rank: nextRank(),
    });
  }

  return items;
}

// ---------------------------------------------------------------------------
// Choice builder helpers
// ---------------------------------------------------------------------------

const ORDINAL = ['Unison', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const PERFECT_NUMBERS = new Set([1, 4, 5, 8]);

function buildPairLures(named: { number: number; quality: string }): string[] {
  const lures: string[] = [];
  const { number, quality } = named;
  const ordinal = ORDINAL[number - 1] ?? `${number}th`;

  // Quality flip (m↔M, aug/dim sibling)
  if (quality === 'minor') lures.push(`Major ${ordinal}`);
  else if (quality === 'major') lures.push(`Minor ${ordinal}`);
  else if (quality === 'augmented' && number === 4) {
    lures.push('Diminished 5th');
    lures.push('Perfect 4th');
    lures.push('Perfect 5th');
  } else if (quality === 'diminished' && number === 5) {
    lures.push('Augmented 4th');
    lures.push('Perfect 4th');
    lures.push('Perfect 5th');
  } else if (quality === 'perfect') {
    lures.push(`Augmented ${ordinal}`);
    lures.push(`Diminished ${ordinal}`);
  } else if (quality === 'augmented') {
    lures.push(`Perfect ${ordinal}`);
  } else if (quality === 'diminished') {
    lures.push(`Minor ${ordinal}`);
  }

  // Adjacent number same quality
  if (number > 1) {
    const prevOrdinal = ORDINAL[number - 2] ?? `${number - 1}th`;
    if (PERFECT_NUMBERS.has(number - 1)) lures.push(`Perfect ${prevOrdinal}`);
    else lures.push(`Major ${prevOrdinal}`);
  }
  if (number < 7) {
    const nextOrdinal = ORDINAL[number] ?? `${number + 1}th`;
    if (PERFECT_NUMBERS.has(number + 1)) lures.push(`Perfect ${nextOrdinal}`);
    else lures.push(`Major ${nextOrdinal}`);
  }

  return lures;
}

function buildSemitoneNeighbors(n: number): string[] {
  const lures: string[] = [];
  if (n > 1) lures.push(INTERVAL_LABELS[n - 1] ?? `${n - 1} semitones`);
  if (n < 12) lures.push(INTERVAL_LABELS[n + 1] ?? `${n + 1} semitones`);
  if (n !== 6) lures.push(INTERVAL_LABELS[6]); // Tritone confusable
  return lures;
}

function buildNoteAboveChoices(correct: Note): string[] {
  const correctDisplay = displayNote(correct);
  const lures: string[] = [];

  // Enharmonic of correct (if display differs)
  const pc = getPitchClass(correct);
  for (const spelling of PITCH_CLASS_SPELLINGS[pc] ?? []) {
    const d = displayNote(spelling);
    if (d !== correctDisplay && !lures.includes(d)) {
      lures.push(d);
    }
  }

  // The letter above/below with plausible accidentals
  const correctIdx = NATURAL_NOTE_ORDER.indexOf(correct.natural);
  const aboveLetter = NATURAL_NOTE_ORDER[(correctIdx + 1) % 7];
  const belowLetter = NATURAL_NOTE_ORDER[(correctIdx - 1 + 7) % 7];
  for (const letter of [aboveLetter, belowLetter]) {
    for (const acc of ['', '#', 'b'] as const) {
      const d = displayNote(N(letter, acc));
      if (!lures.includes(d) && d !== correctDisplay) lures.push(d);
    }
  }

  return lures;
}
