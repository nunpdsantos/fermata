/**
 * drillBank — deterministic generator for WS9 Drill Mode.
 *
 * All output is pure and deterministic: calling generateDrillBank() twice
 * returns deep-equal results (no Date.now, no Math.random).
 *
 * Display strings (prompts/choices) use unicode ♯/♭/𝄪/𝄫.
 * DrillAnswerSpec.correct stores the display string shown on the chip
 * (per spec: 'choice' answers store display form).
 */

import type { DrillFamily, DrillItem } from '../../types/drill';
import { genDegree } from './genDegree';
import { genCircle } from './genCircle';
import { genKeysig } from './genKeysig';
import { genInterval } from './genInterval';
import { genTriad } from './genTriad';
import { genScale } from './genScale';
import { genSeventh } from './genSeventh';
import { genRoman } from './genRoman';
import { genFunction } from './genFunction';

export function generateDrillBank(): DrillItem[] {
  const items = [
    ...genDegree(),
    ...genCircle(),
    ...genKeysig(),
    ...genInterval(),
    ...genTriad(),
    ...genScale(),
    ...genSeventh(),
    ...genRoman(),
    ...genFunction(),
  ];
  return items.sort((a, b) => a.rank - b.rank);
}

export function getItemsByFamily(bank: DrillItem[], family: DrillFamily): DrillItem[] {
  return bank.filter((i) => i.family === family);
}

// Public helpers re-exported so existing `import ... from '../drillBank'` keeps working
export { displayNote, keySignatureOf, MAJOR_KEYS, SHARP_ORDER, FLAT_ORDER } from './shared';

// ---------------------------------------------------------------------------
// i18n key registries — source of truth for translation parity
// These lists are maintained manually and tested bidirectionally against
// generateDrillBank() output. See drillBank.test.ts for the assertion.
// ---------------------------------------------------------------------------

/**
 * Every promptKey used across the full drill bank.
 * Maintained manually; tested bidirectionally against generateDrillBank() output.
 * When adding a new generator with new promptKeys, add them here too.
 */
export const DRILL_PROMPT_KEYS: readonly string[] = [
  // F1 — key signatures
  'drill.prompts.keyToCount',
  'drill.prompts.keyToAcc',
  'drill.prompts.sigToKeyMajor',
  'drill.prompts.sigToKeyMinor',
  'drill.prompts.relMinor',
  'drill.prompts.relMajor',
  // F2 — circle of fifths
  'drill.prompts.fifthUp',
  'drill.prompts.fifthDown',
  'drill.prompts.nextSharp',
  'drill.prompts.nextFlat',
  // F3 — degree names
  'drill.prompts.numToName',
  'drill.prompts.nameToNum',
  // F4 — intervals
  'drill.prompts.pairToName',
  'drill.prompts.noteAbove',
  'drill.prompts.letterThird',
  'drill.prompts.semitonesToName',
  // F5 — triads
  'drill.prompts.spellChord',
  'drill.prompts.nameChord',
  // F6 — scales
  'drill.prompts.spellScale',
  'drill.prompts.degreeOf',
  // F7 — sevenths (shares spellChord + nameChord with F5)
  // F8 — roman numerals
  'drill.prompts.degreeToChord',
  'drill.prompts.chordToDegree',
  'drill.prompts.pattern',
  'drill.prompts.isDiatonic',
  'drill.prompts.harmonicFact',
  // F9 — function & cadences
  'drill.prompts.chordFunction',
  'drill.prompts.cadence',
  'drill.prompts.v7Of',
];

/**
 * Every whyKey used across the full drill bank.
 * Maintained manually; tested bidirectionally against generateDrillBank() output.
 * When adding a new generator with new whyKeys, add them here too.
 */
export const DRILL_WHY_KEYS: readonly string[] = [
  // F1 key signatures
  'drill.why.keyToCount',
  'drill.why.lastSharp',
  'drill.why.penultimateFlat',
  'drill.why.sigToKey',
  'drill.why.relative',
  // F2 circle
  'drill.why.circleOrder',
  // F3 degree names
  'drill.why.degreeName',
  // F4 intervals
  'drill.why.intervalLetterFirst',
  'drill.why.semitoneFact',
  // F5 triads
  'drill.why.triadStack',
  // F6 scales
  'drill.why.scaleKeySig',
  'drill.why.harmonicRaise',
  // F7 sevenths
  'drill.why.seventhLadder',
  // F8 roman numerals
  'drill.why.diatonicMember',
  'drill.why.harmonicFact',
  // F9 function & cadences
  'drill.why.functionPull',
  'drill.why.cadenceDef',
  'drill.why.v7Derivation',
];
