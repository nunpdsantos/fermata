/**
 * Which lesson section a missed question sends the learner back to ("Re-read
 * ›" on the result screen, and the check's pointer after a first miss, W4b).
 * Exercises carry no link to a concept, so it is the concept whose title and
 * explanation share the most content words with the question (its prompt
 * and explanation) and its answer, in the language the lesson is shown in.
 *
 * Ties — common on statement-style stems ("Which statement is true?") —
 * go to the concept most specific to the keyed answer: the answer's words
 * that the concept shares, each weighted by how few concepts use it (a word
 * only one concept uses counts 1, one that three use counts ⅓). Only then
 * the earlier concept; a question that shares nothing goes to the first. A
 * heuristic, pinned on real lessons by its test.
 */
import type { CurriculumConcept } from '../../../core/types/curriculum';

// Function words that carry no topic (EN / PT / ES); words of < 4 letters are skipped anyway.
const STOP = new Set([
  // en
  'this', 'that', 'these', 'those', 'which', 'what', 'when', 'where', 'with', 'from', 'into', 'than', 'then', 'they',
  'them', 'their', 'there', 'have', 'does', 'each', 'every', 'only', 'also', 'more', 'most', 'much', 'many', 'some',
  'other', 'about', 'between', 'because', 'would', 'could', 'should', 'your', 'yours', 'make', 'makes', 'note', 'notes',
  'true', 'statement', 'following', 'called', 'name', 'like', 'just', 'same', 'used', 'uses', 'using',
  // pt
  'esta', 'este', 'isto', 'essa', 'esse', 'qual', 'quais', 'quando', 'onde', 'como', 'para', 'pela', 'pelo', 'pelas',
  'pelos', 'entre', 'porque', 'mais', 'muito', 'muitos', 'cada', 'todo', 'toda', 'todos', 'todas', 'também', 'sobre',
  'outra', 'outro', 'nota', 'notas', 'afirmação', 'verdadeira', 'seguinte', 'chama', 'mesmo', 'mesma', 'teu', 'tua',
  // es
  'esto', 'cual', 'cuál', 'cuáles', 'cuando', 'donde', 'dónde', 'cómo', 'para', 'entre', 'porque', 'más', 'mucho',
  'muchos', 'cada', 'todos', 'todas', 'también', 'sobre', 'otra', 'otro', 'afirmación', 'verdadera', 'siguiente',
  'llama', 'mismo', 'misma', 'notas',
]);

export function contentWords(text: string): Set<string> {
  const words = text.toLowerCase().match(/[\p{L}\p{N}#♯♭]+/gu) ?? [];
  return new Set(words.filter((w) => w.length >= 4 && !STOP.has(w)));
}

/** The concept index (0-based) a question is about; `answer` is the keyed answer, in words. */
export function conceptForQuestion(
  question: string,
  module: { concepts: readonly Pick<CurriculumConcept, 'title' | 'explanation'>[] },
  answer = '',
): number {
  const q = contentWords(`${question} ${answer}`);
  const a = contentWords(answer);
  const sets = module.concepts.map((c) => contentWords(`${c.title} ${c.title} ${c.explanation}`));
  const usedBy = (w: string) => sets.filter((s) => s.has(w)).length;
  let best = 0;
  let bestScore = 0;
  let bestSpecific = 0;
  sets.forEach((words, i) => {
    let score = 0;
    for (const w of q) if (words.has(w)) score++;
    let specific = 0;
    for (const w of a) if (words.has(w)) specific += 1 / usedBy(w);
    if (score > bestScore || (score === bestScore && score > 0 && specific > bestSpecific + 1e-9)) {
      best = i;
      bestScore = score;
      bestSpecific = specific;
    }
  });
  return best;
}
