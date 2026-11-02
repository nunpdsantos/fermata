/**
 * Learn scoring (unchanged by W4b): right first time 1, right on the second
 * try 0.5, otherwise 0; a set passes at 80 % of its questions.
 */
/** The pass mark of a set of n questions: 80 %, in the half points a set can score. */
export function passMark(n: number): number {
  return Math.ceil(n * 0.8 * 2) / 2;
}
