import { useRef, useState } from 'react';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { NaturalNote } from '../../core/types/music';
import { SPRING_MICRO } from '../../design/tokens/motion';
import { normalizeDisplay } from './grading';

interface AccidentalSlotsProps {
  /** The seven scale letters in degree order (degree 1 first). */
  letters: NaturalNote[];
  disabled: boolean;
  /** Fires when "Done" is tapped; one display spelling per slot, in order. */
  onAnswer: (spelled: string[]) => void;
  /** During feedback: the canonical correct spellings (ASCII) per slot, in order. */
  feedback?: { correctSpelled: string[] };
}

/** Cycle order for a slot: natural → sharp → flat → natural. */
const ACCIDENTAL_CYCLE = ['', '#', 'b'] as const;
const GLYPH: Record<(typeof ACCIDENTAL_CYCLE)[number], string> = {
  '': '♮',
  '#': '♯',
  b: '♭',
};

/** Display name for a slot, e.g. C♯ / D♭ / E♮. */
function slotDisplay(letter: NaturalNote, step: number): string {
  const acc = ACCIDENTAL_CYCLE[step];
  return `${letter}${GLYPH[acc]}`;
}

/** Unicode display spelling submitted to grading; natural drops the glyph
 * (C / C♯ / D♭) so normalizeDisplay() maps it straight to the ASCII answer. */
function slotSpelling(letter: NaturalNote, step: number): string {
  const acc = ACCIDENTAL_CYCLE[step];
  return acc === '' ? letter : `${letter}${GLYPH[acc]}`;
}

/**
 * Seven tap-to-cycle slots for spelling a scale.
 *
 * Each slot is pre-filled natural and cycles ♮→♯→♭ on tap, rendering the
 * resulting note name (C♯, not a bare ♯). A single "Done" button grades — the
 * one deliberate exception to the zero-submit rule, since a scale has no
 * natural "last tap" to auto-fire on.
 *
 * The parent keys this component by item id, so a new question remounts it
 * fresh (all-natural slots, guard re-armed) without a transition effect.
 */
export function AccidentalSlots({
  letters,
  disabled,
  onAnswer,
  feedback,
}: AccidentalSlotsProps) {
  const { t } = useTranslation();
  // steps[i] indexes ACCIDENTAL_CYCLE for slot i. Pre-filled natural (0).
  const [steps, setSteps] = useState<number[]>(() => letters.map(() => 0));
  // Commit guard: prevents a double-tap on Done from re-grading.
  const locked = useRef(false);

  const cycle = (i: number) => {
    if (disabled || locked.current) return;
    setSteps((prev) => {
      const next = prev.slice();
      next[i] = (next[i] + 1) % ACCIDENTAL_CYCLE.length;
      return next;
    });
  };

  const submit = () => {
    if (disabled || locked.current) return;
    locked.current = true;
    onAnswer(letters.map((l, i) => slotSpelling(l, steps[i])));
  };

  return (
    <div className="flex flex-col gap-3">
      <div role="group" className="grid grid-cols-7 gap-1.5 max-sm:gap-1">
        {letters.map((letter, i) => {
          const spelling = slotSpelling(letter, steps[i]);
          const correctAscii = feedback?.correctSpelled[i];
          const showCorrect = disabled && correctAscii !== undefined && normalizeDisplay(spelling) === correctAscii;
          const showWrong = disabled && correctAscii !== undefined && normalizeDisplay(spelling) !== correctAscii;

          let stateClass = '';
          if (showCorrect) {
            stateClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
          } else if (showWrong) {
            stateClass = 'bg-red-500/15 border-red-500/40 text-red-300';
          }
          const neutral = !showCorrect && !showWrong;

          return (
            <m.button
              key={`${letter}-${i}`}
              type="button"
              whileTap={!disabled ? { scale: 0.94, transition: SPRING_MICRO } : undefined}
              onClick={() => cycle(i)}
              disabled={disabled}
              aria-disabled={disabled}
              aria-label={slotDisplay(letter, steps[i])}
              className={`min-h-[44px] px-0.5 rounded-lg text-sm font-semibold border transition-all duration-150 ${stateClass} ${
                disabled ? 'cursor-default' : 'cursor-pointer'
              }`}
              style={
                neutral
                  ? {
                      backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--border) 50%, transparent)',
                      color: 'var(--text)',
                    }
                  : undefined
              }
            >
              {slotDisplay(letter, steps[i])}
            </m.button>
          );
        })}
      </div>

      {!disabled && (
        <m.button
          type="button"
          whileTap={{ scale: 0.98, transition: SPRING_MICRO }}
          onClick={submit}
          className="min-h-[44px] rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
        >
          {t('drill.done')}
        </m.button>
      )}
    </div>
  );
}
