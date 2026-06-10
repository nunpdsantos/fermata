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

export function generateDrillBank(): DrillItem[] {
  const items = [...genDegree(), ...genCircle(), ...genKeysig(), ...genInterval(), ...genTriad(), ...genScale()];
  return items.sort((a, b) => a.rank - b.rank);
}

export function getItemsByFamily(bank: DrillItem[], family: DrillFamily): DrillItem[] {
  return bank.filter((i) => i.family === family);
}

// Public helpers re-exported so existing `import ... from '../drillBank'` keeps working
export { displayNote, keySignatureOf, MAJOR_KEYS, SHARP_ORDER, FLAT_ORDER } from './shared';
