/**
 * "Use my instrument" stays on for the next instrument question of the same
 * visit once the learner turned it on (wave 3, brief T): in memory only,
 * never saved.
 */
let wanted = false;

export function answerWanted(): boolean {
  return wanted;
}

export function setAnswerWanted(on: boolean): void {
  wanted = on;
}
