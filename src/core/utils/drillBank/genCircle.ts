/**
 * F2 — Circle of fifths items.
 *
 * Rank layout within circle family (base 100, stride 2):
 *   next-sharp:  100–110  (6 items, i=0..5)
 *   next-flat:   118–128  (6 items, i=0..5, offset +18)
 *   fifth-up:    136–158  (12 items, i=0..11, offset +36)
 *   fifth-down:  160–182  (12 items, i=0..11, offset +60)
 *   All < 200 (keysig base).
 */

import { SHARP_ORDER, FLAT_ORDER } from './shared';
import { displayNote, shuffleStable, FAMILY_BASE } from './shared';
import { noteToString } from '../../types/music';
import type { DrillItem } from '../../types/drill';

/**
 * The 12 canonical circle positions used for fifth-up/fifth-down items.
 * Display strings (♯/♭). Order: C G D A E B F♯ D♭ A♭ E♭ B♭ F
 */
const CIRCLE_DISPLAY = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];

/** ASCII lookup matching CIRCLE_DISPLAY (for id construction). */
const CIRCLE_ASCII = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

export function genCircle(): DrillItem[] {
  const items: DrillItem[] = [];

  // --- next-sharp chain (6 consecutive pairs) ---
  for (let i = 0; i < SHARP_ORDER.length - 1; i++) {
    const curr = SHARP_ORDER[i];
    const next = SHARP_ORDER[i + 1];
    const currDisplay = displayNote(curr);
    const nextDisplay = displayNote(next);
    const currAscii = noteToString(curr);

    const otherSharps = SHARP_ORDER.filter((_, j) => j !== i && j !== i + 1).map(displayNote);
    const lures = shuffleStable(otherSharps, `circle:next-sharp:${currAscii}:lures`).slice(0, 3);
    const choices = shuffleStable([nextDisplay, ...lures], `circle:next-sharp:${currAscii}:choices`);

    items.push({
      id: `circle:next-sharp:${currAscii}`,
      family: 'circle',
      promptKey: 'drill.prompts.nextSharp',
      promptParams: { acc: currDisplay },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct: nextDisplay },
      whyKey: 'drill.why.circleOrder',
      whyParams: { acc: currDisplay },
      rank: FAMILY_BASE.circle + i * 2,
    });
  }

  // --- next-flat chain (6 consecutive pairs) ---
  for (let i = 0; i < FLAT_ORDER.length - 1; i++) {
    const curr = FLAT_ORDER[i];
    const next = FLAT_ORDER[i + 1];
    const currDisplay = displayNote(curr);
    const nextDisplay = displayNote(next);
    const currAscii = noteToString(curr);

    const otherFlats = FLAT_ORDER.filter((_, j) => j !== i && j !== i + 1).map(displayNote);
    const lures = shuffleStable(otherFlats, `circle:next-flat:${currAscii}:lures`).slice(0, 3);
    const choices = shuffleStable([nextDisplay, ...lures], `circle:next-flat:${currAscii}:choices`);

    items.push({
      id: `circle:next-flat:${currAscii}`,
      family: 'circle',
      promptKey: 'drill.prompts.nextFlat',
      promptParams: { acc: currDisplay },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct: nextDisplay },
      whyKey: 'drill.why.circleOrder',
      whyParams: { acc: currDisplay },
      rank: FAMILY_BASE.circle + 18 + i * 2,
    });
  }

  // --- fifth-up / fifth-down for 12 circle positions ---
  for (let i = 0; i < CIRCLE_DISPLAY.length; i++) {
    const asciiKey = CIRCLE_ASCII[i];
    const currDisplay = CIRCLE_DISPLAY[i];

    const upIdx = (i + 1) % 12;
    const downIdx = (i + 11) % 12;
    const upDisplay = CIRCLE_DISPLAY[upIdx];
    const downDisplay = CIRCLE_DISPLAY[downIdx];

    // Lures for fifth-up: fourth-up (= fifth-down, common confusion), two steps up/down
    const luresUpRaw = [
      downDisplay,
      CIRCLE_DISPLAY[(i + 2) % 12],
      CIRCLE_DISPLAY[(i + 10) % 12],
    ];
    const luresUp = shuffleStable(
      luresUpRaw.filter((l) => l !== upDisplay),
      `circle:fifth-up:${asciiKey}:lures`,
    ).slice(0, 3);
    const choicesUp = shuffleStable(
      [upDisplay, ...luresUp].slice(0, 4),
      `circle:fifth-up:${asciiKey}:choices`,
    );

    items.push({
      id: `circle:fifth-up:${asciiKey}`,
      family: 'circle',
      promptKey: 'drill.prompts.fifthUp',
      promptParams: { note: currDisplay },
      input: { format: 'choice', choices: choicesUp },
      answer: { kind: 'choice', correct: upDisplay },
      whyKey: 'drill.why.circleOrder',
      whyParams: { note: currDisplay },
      rank: FAMILY_BASE.circle + 36 + i * 2,
    });

    // Lures for fifth-down: fifth-up (common confusion), two steps down/up
    const luresDownRaw = [
      upDisplay,
      CIRCLE_DISPLAY[(i + 10) % 12],
      CIRCLE_DISPLAY[(i + 2) % 12],
    ];
    const luresDown = shuffleStable(
      luresDownRaw.filter((l) => l !== downDisplay),
      `circle:fifth-down:${asciiKey}:lures`,
    ).slice(0, 3);
    const choicesDown = shuffleStable(
      [downDisplay, ...luresDown].slice(0, 4),
      `circle:fifth-down:${asciiKey}:choices`,
    );

    items.push({
      id: `circle:fifth-down:${asciiKey}`,
      family: 'circle',
      promptKey: 'drill.prompts.fifthDown',
      promptParams: { note: currDisplay },
      input: { format: 'choice', choices: choicesDown },
      answer: { kind: 'choice', correct: downDisplay },
      whyKey: 'drill.why.circleOrder',
      whyParams: { note: currDisplay },
      rank: FAMILY_BASE.circle + 60 + i * 2,
    });
  }

  return items;
}
