/**
 * Pure answer grading for Drill mode.
 *
 * ENCODING CONTRACT (see src/core/types/drill.ts): input chips and all
 * prompt-facing strings are UNICODE display (♯ ♭ 𝄪 𝄫); answer.notes /
 * answer.spelled are canonical ASCII (#, b, ##, bb — matching noteToString).
 * Grading normalizes whatever the user tapped (display OR ascii) back to ASCII
 * before comparing.
 *
 * Near-miss = "same sound, wrong spelling": pitch classes match but the
 * canonical spelling differs (e.g. D♭ where the key wants C♯). A near-miss is
 * graded WRONG (correct: false) but carries nearMiss: true so the feedback
 * strip can show the gentler "right note, wrong name" message.
 */
import type { DrillItem } from '../../core/types/drill';
import { getPitchClass } from '../../core/constants/notes';
import { stringToNote } from '../../core/types/music';

export type AnswerPayload =
  | { format: 'choice'; choice: string }
  | { format: 'noteChips'; notes: string[] } // DISPLAY strings as tapped
  | { format: 'accidentalSlots'; spelled: string[] }
  | { format: 'rootQuality'; root: string; quality: string };

export interface GradeResult {
  correct: boolean;
  nearMiss: boolean;
}

/** Unicode display accidentals → canonical ASCII (𝄪/𝄫 before ♯/♭ — they are
 * standalone glyphs, but order the replacements defensively). */
export function normalizeDisplay(s: string): string {
  return s
    .replace(/𝄪/g, '##')
    .replace(/𝄫/g, 'bb')
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b');
}

/** Pitch class (0–11) of an ASCII spelling like 'C#', 'Bbb'. */
function pcOf(ascii: string): number {
  return getPitchClass(stringToNote(ascii));
}

/** Multiset equality of two pitch-class arrays (order-insensitive, counts duplicates). */
function pcMultisetsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<number, number>();
  for (const pc of a) counts.set(pc, (counts.get(pc) ?? 0) + 1);
  for (const pc of b) {
    const n = counts.get(pc);
    if (n === undefined || n === 0) return false;
    counts.set(pc, n - 1);
  }
  return true;
}

/** Multiset equality of two string arrays (order-insensitive). */
function stringMultisetsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<string, number>();
  for (const s of a) counts.set(s, (counts.get(s) ?? 0) + 1);
  for (const s of b) {
    const n = counts.get(s);
    if (n === undefined || n === 0) return false;
    counts.set(s, n - 1);
  }
  return true;
}

export function gradeAnswer(item: DrillItem, payload: AnswerPayload): GradeResult {
  switch (payload.format) {
    case 'choice': {
      const correctAnswer = item.answer.kind === 'choice' ? item.answer.correct : null;
      return { correct: payload.choice === correctAnswer, nearMiss: false };
    }

    case 'noteChips': {
      if (item.answer.kind !== 'notes') return { correct: false, nearMiss: false };
      const expected = item.answer.notes; // ASCII
      const got = payload.notes.map(normalizeDisplay);
      if (got.length !== expected.length) return { correct: false, nearMiss: false };
      // Exact spelling, order-insensitive → correct.
      if (stringMultisetsEqual(got, expected)) return { correct: true, nearMiss: false };
      // Same sound, different spelling → near-miss.
      if (pcMultisetsEqual(got.map(pcOf), expected.map(pcOf))) {
        return { correct: false, nearMiss: true };
      }
      return { correct: false, nearMiss: false };
    }

    case 'accidentalSlots': {
      if (item.answer.kind !== 'accidentals') return { correct: false, nearMiss: false };
      const expected = item.answer.spelled; // ASCII, in scale order
      const got = payload.spelled.map(normalizeDisplay);
      if (got.length !== expected.length) return { correct: false, nearMiss: false };
      // Order-sensitive exact match.
      if (got.every((s, i) => s === expected[i])) return { correct: true, nearMiss: false };
      // Per-position pitch-class equality with ≥1 spelling difference → near-miss.
      if (got.every((s, i) => pcOf(s) === pcOf(expected[i]))) {
        return { correct: false, nearMiss: true };
      }
      return { correct: false, nearMiss: false };
    }

    case 'rootQuality': {
      if (item.answer.kind !== 'rootQuality') return { correct: false, nearMiss: false };
      const root = normalizeDisplay(payload.root);
      const qualityMatches = payload.quality === item.answer.quality;
      if (root === item.answer.root && qualityMatches) {
        return { correct: true, nearMiss: false };
      }
      // Same pitch-class root + same quality but a different spelling → near-miss.
      if (qualityMatches && pcOf(root) === pcOf(item.answer.root)) {
        return { correct: false, nearMiss: true };
      }
      return { correct: false, nearMiss: false };
    }

    default: {
      // Exhaustiveness guard: adding a new AnswerPayload variant without a
      // case above becomes a compile error here.
      const _exhaustive: never = payload;
      throw new Error(`unhandled answer payload: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
