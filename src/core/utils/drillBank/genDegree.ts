/**
 * F4 — Scale degree name items (simplest family, no key dependency).
 */

import { SCALE_DEGREE_NAMES } from '../../constants/scales';
import type { DrillItem } from '../../types/drill';
import { FAMILY_BASE, shuffleStable } from './shared';

export function genDegree(): DrillItem[] {
  const items: DrillItem[] = [];

  for (let i = 0; i < SCALE_DEGREE_NAMES.length; i++) {
    const num = i + 1;
    const name = SCALE_DEGREE_NAMES[i];

    // num → name
    {
      const others = SCALE_DEGREE_NAMES.filter((_, j) => j !== i);
      const lures = shuffleStable(others, `degree:num-to-name:${num}:lures`).slice(0, 3);
      const choices = shuffleStable([name, ...lures], `degree:num-to-name:${num}:choices`);
      items.push({
        id: `degree:num-to-name:${num}`,
        family: 'degree',
        promptKey: 'drill.prompts.numToName',
        promptParams: { num },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct: name },
        whyKey: 'drill.why.degreeName',
        whyParams: { num, name },
        rank: FAMILY_BASE.degree + i * 2,
      });
    }

    // name → num
    {
      const allNums = ['1', '2', '3', '4', '5', '6', '7'];
      const otherNums = allNums.filter((n) => n !== String(num));
      const lures = shuffleStable(otherNums, `degree:name-to-num:${name}:lures`).slice(0, 3);
      const choices = shuffleStable([String(num), ...lures], `degree:name-to-num:${name}:choices`);
      items.push({
        id: `degree:name-to-num:${name}`,
        family: 'degree',
        promptKey: 'drill.prompts.nameToNum',
        promptParams: { name },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct: String(num) },
        whyKey: 'drill.why.degreeName',
        whyParams: { num, name },
        rank: FAMILY_BASE.degree + i * 2 + 1,
      });
    }
  }

  return items;
}
