/**
 * What the check says after a FIRST wrong try (W4b review B1).
 *
 * An item's `hint` is its explanation — why the answer is what it is — and is
 * shown only once the item is final, next to the answer. Before that, with a
 * ½-point try still to come, the learner gets a nudge that must not give the
 * answer away (no keyed option text, no target note list, no note name for a
 * note to identify, no description of the right melody). In order:
 *
 *  1. the item's own `nudge` (authored, or its template's `nudgeTemplate`);
 *  2. a method for the exercise type — how to work it out, never the result:
 *     note ID counts from a reference note whose LETTER is not the answer's;
 *     a chord build gives its interval recipe above the root, a scale build
 *     its pattern of whole and half steps (no note names); intervals, scale
 *     degrees and each kind of ear item have their way of counting/listening;
 *  3. otherwise (multiple choice without a nudge) a pointer back to the
 *     lesson section that teaches it — "Look again at: 2 · …", with Re-read —
 *     whose title is left out when it would itself name the answer.
 *
 * Pure functions (no React): the runner and the nudge corpus test use the
 * same ones.
 */
import type { ExerciseDefinition } from '../../../core/types/exercise';
import type { ChordQuality, NaturalNote, ScaleType } from '../../../core/types/music';
import { CHORD_FORMULAS, CHORD_LETTER_DISTANCES } from '../../../core/constants/chords';
import {
  MAJOR_DEGREE_SEMITONES, SCALE_DEGREE_FORMULAS, degreeSemitones, intervalNameOfDegree, parseDegree,
} from '../../../core/utils/degreeSpelling';
import type { IntervalQualityCode } from '../../../core/utils/degreeSpelling';
import { conceptForQuestion } from '../lesson/rereadSection';
import { exerciseStaff } from './exerciseStaff';
import { answerLeak, type LeakLang } from './answerLeak';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

// ─── Note ID: count from a reference note that is not the answer ────────────

const LETTERS = 'CDEFGAB';
const stepIndex = (letter: string, octave: number) => LETTERS.indexOf(letter) + 7 * octave;

/** Landmarks of each staff, in the order a teacher would point to them. */
const REFERENCES: Record<'treble' | 'bass', { key: string; letter: NaturalNote; octave: number }[]> = {
  treble: [
    { key: 'nudgeRefTrebleG', letter: 'G', octave: 4 },
    { key: 'nudgeRefTrebleE', letter: 'E', octave: 4 },
    { key: 'nudgeRefTrebleF', letter: 'F', octave: 5 },
    { key: 'nudgeRefTrebleC', letter: 'C', octave: 4 },
  ],
  bass: [
    { key: 'nudgeRefBassF', letter: 'F', octave: 3 },
    { key: 'nudgeRefBassG', letter: 'G', octave: 2 },
    { key: 'nudgeRefBassA', letter: 'A', octave: 3 },
    { key: 'nudgeRefBassC', letter: 'C', octave: 4 },
  ],
};

/**
 * The landmark to count from: the nearest one on the note's staff (the clef
 * it is drawn in) whose letter is not the note's — so the nudge never names
 * the answer; ties go to the earlier landmark.
 */
export function noteReference(letter: string, octave: number, clef: 'treble' | 'bass'): string {
  const target = stepIndex(letter, octave);
  const candidates = REFERENCES[clef].filter((r) => r.letter !== letter);
  let best = candidates[0];
  for (const r of candidates) {
    if (Math.abs(stepIndex(r.letter, r.octave) - target) < Math.abs(stepIndex(best.letter, best.octave) - target)) best = r;
  }
  return best.key;
}

// ─── Builds: interval recipe / step pattern ─────────────────────────────────

const ARTICLE_EN = (word: string) => (/^[aeiou]/i.test(word) ? 'an' : 'a');
const QUALITY_WORDS: Record<LeakLang, Partial<Record<IntervalQualityCode, string>>> = {
  en: { P: 'perfect', M: 'major', m: 'minor', A: 'augmented', d: 'diminished' },
  pt: { P: 'perfeita', M: 'maior', m: 'menor', A: 'aumentada', d: 'diminuta' },
  es: { P: 'justa', M: 'mayor', m: 'menor', A: 'aumentada', d: 'disminuida' },
};

function ordinalEn(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th'}`;
}

/** "a major 3rd" / "uma 3.ª maior" / "una 3.ª mayor". */
function intervalPhrase(number: number, quality: IntervalQualityCode, lang: LeakLang): string {
  const word = QUALITY_WORDS[lang][quality] ?? quality;
  if (lang === 'en') return `${ARTICLE_EN(word)} ${word} ${ordinalEn(number)}`;
  return `${lang === 'pt' ? 'uma' : 'una'} ${number}.ª ${word}`;
}

function listOf(items: string[], lang: LeakLang): string {
  if (items.length <= 1) return items.join('');
  const and = lang === 'en' ? 'and' : lang === 'pt' ? 'e' : 'y';
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
}

/** The chord's notes as intervals above its root, in words — no note names. */
export function chordRecipe(quality: string, lang: LeakLang): string | null {
  const semis = CHORD_FORMULAS[quality as ChordQuality];
  const letters = CHORD_LETTER_DISTANCES[quality as ChordQuality];
  if (!semis || !letters || semis.length !== letters.length) return null;
  const parts: string[] = [];
  for (let i = 1; i < semis.length; i++) {
    const number = letters[i] + 1 + (semis[i] >= 12 && letters[i] < 7 ? 7 : 0);
    const n = number - 1;
    const reference = MAJOR_DEGREE_SEMITONES[n % 7] + 12 * Math.floor(n / 7);
    const name = intervalNameOfDegree({ number, alteration: semis[i] - reference });
    if (name.quality === 'AA' || name.quality === 'dd') return null;
    parts.push(intervalPhrase(number, name.quality, lang));
  }
  return parts.length ? listOf(parts, lang) : null;
}

const STEP_SYMBOLS: Record<LeakLang, Record<number, string>> = {
  en: { 1: 'H', 2: 'W', 3: 'W+H' },
  pt: { 1: 'mT', 2: 'T', 3: 'T+mT' },
  es: { 1: 'S', 2: 'T', 3: 'T+S' },
};

/** The scale's whole/half-step pattern from its first note up to the octave, or null. */
export function scaleSteps(scaleType: string, lang: LeakLang): { steps: string; wide: boolean } | null {
  const formula = SCALE_DEGREE_FORMULAS[scaleType as ScaleType];
  if (!formula || formula.length < 2) return null;
  const semis = formula.map((d) => degreeSemitones(parseDegree(d)));
  const gaps: number[] = [];
  for (let i = 1; i <= semis.length; i++) gaps.push((i < semis.length ? semis[i] : 12) - semis[i - 1]);
  if (gaps.some((g) => !STEP_SYMBOLS[lang][g])) return null;
  return { steps: gaps.map((g) => STEP_SYMBOLS[lang][g]).join('-'), wide: gaps.includes(3) };
}

// ─── The nudge ──────────────────────────────────────────────────────────────

/** How the item can be worked out, for its type — or null (multiple choice). */
export function methodNudge(exercise: ExerciseDefinition, t: TFunc, lang: LeakLang): string | null {
  const cfg = exercise.config;
  switch (cfg.type) {
    case 'note_id':
      return t('lesson.nudgeNoteId', { ref: t(`lesson.${noteReference(cfg.note, cfg.octave, exerciseStaff(cfg)?.clef ?? 'treble')}`) });
    case 'chord_build': {
      const recipe = chordRecipe(cfg.quality, lang);
      return recipe ? t('lesson.nudgeChord', { intervals: recipe }) : null;
    }
    case 'scale_build': {
      const s = scaleSteps(cfg.scaleType, lang);
      return s ? t(s.wide ? 'lesson.nudgeScaleWide' : 'lesson.nudgeScale', { steps: s.steps }) : null;
    }
    case 'interval_id':
      return t(cfg.answer === 'step' ? 'lesson.nudgeIntervalStep' : cfg.answer === 'number' ? 'lesson.nudgeIntervalNumber' : 'lesson.nudgeInterval');
    case 'scale_degree_id':
      return t('lesson.nudgeDegree');
    case 'ear_training':
      return t(`lesson.nudgeEar${cfg.mode[0].toUpperCase()}${cfg.mode.slice(1)}`);
    default:
      return null;
  }
}

/** The nudge text after a first miss: the item's own, else its type's method; null = point to the lesson. */
export function nudgeFor(exercise: ExerciseDefinition, t: TFunc, lang: LeakLang): string | null {
  if (exercise.nudge && exercise.nudge.trim()) return exercise.nudge;
  return methodNudge(exercise, t, lang);
}

export interface SectionPointer {
  /** Concept index (0-based) — the lesson section `c{index}`. */
  index: number;
  /** Its title, or null when the title would itself give the answer away. */
  title: string | null;
}

/**
 * The lesson section a question is about (the same choice as the result
 * screen's "Re-read ›"), with its title only when the title does not name
 * the answer.
 */
export function sectionPointer(
  exercise: ExerciseDefinition,
  concepts: readonly { title: string; explanation: string }[],
  answer: string,
  others: string[],
  lang: LeakLang,
): SectionPointer | null {
  if (concepts.length === 0) return null;
  const index = conceptForQuestion(`${exercise.prompt} ${exercise.hint ?? ''}`, { concepts }, answer);
  const title = concepts[index]?.title ?? null;
  if (title === null) return null;
  const leaks = answerLeak({ prompt: exercise.prompt, hint: title, answer, others, lang });
  return { index, title: leaks ? null : title };
}
