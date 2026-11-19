/**
 * Explanation clauses by key (audit A12, 2026-11-18).
 *
 * Three why-templates take a whole clause as a parameter ("{{chord}} pulls
 * {{direction}} — …"). The bank used to put the English clause itself in
 * whyParams, and the Portuguese and Spanish sentences printed it as it was
 * ("C maior puxa home — creates rest — …"). Now the bank puts a short TOKEN
 * there, and the view prints the clause for that token in the learner's
 * language, English included (`drillTerms.clauses.<template>.<param>.<token>`,
 * src/i18n/drillTerms/, loaded with the Drill view). Never graded.
 *
 * This registry lists every token each clause parameter may carry; it is
 * tested both ways against generateDrillBank() and against the text bundle in
 * all three languages (drillClauses.test.ts).
 */
export const DRILL_CLAUSES = {
  'drill.why.functionPull': { direction: ['tonic', 'subdominant', 'dominant'] },
  'drill.why.seventhLadder': { step: ['major7', 'dominant7', 'minor7', 'half_diminished7', 'diminished7'] },
  'drill.why.triadStack': { stack: ['major', 'minor', 'diminished', 'augmented'] },
} as const satisfies Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>;

export type FunctionDirectionToken = (typeof DRILL_CLAUSES)['drill.why.functionPull']['direction'][number];

/** The clause tokens of one why-template's parameter, or undefined when that parameter is not a clause. */
export function clauseTokens(whyKey: string, param: string): readonly string[] | undefined {
  const params = (DRILL_CLAUSES as Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>)[whyKey];
  return params?.[param];
}

/** The text key of a clause: `drillTerms.clauses.functionPull.direction.tonic`. */
export function clauseKey(whyKey: string, param: string, token: string): string {
  return `drillTerms.clauses.${whyKey.replace(/^drill\.why\./, '')}.${param}.${token}`;
}
