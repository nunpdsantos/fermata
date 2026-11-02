/**
 * Which lesson section a missed question sends the learner back to ("Re-read
 * ›" on the result screen, W4b). Exercises carry no link to a concept, so it
 * is the concept whose title and explanation share the most content words
 * with the question (its prompt, hint and answer), in the language the lesson
 * is shown in; ties go to the earlier concept, and a question that shares
 * nothing with any concept goes to the first one. A heuristic, pinned on a
 * few real lessons by its test.
 */
import type { CurriculumModule } from '../../../core/types/curriculum';

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

/** The concept index (0-based) a question is about. */
export function conceptForQuestion(question: string, module: Pick<CurriculumModule, 'concepts'>): number {
  const q = contentWords(question);
  let best = 0;
  let bestScore = 0;
  module.concepts.forEach((c, i) => {
    const words = contentWords(`${c.title} ${c.title} ${c.explanation}`);
    let score = 0;
    for (const w of q) if (words.has(w)) score++;
    if (score > bestScore) {
      best = i;
      bestScore = score;
    }
  });
  return best;
}
