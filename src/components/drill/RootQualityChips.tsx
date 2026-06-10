import { useRef, useState } from 'react';
import { m } from 'framer-motion';
import type { ChordQuality } from '../../core/types/music';
import { CHORD_QUALITY_NAMES } from '../../core/constants/chords';
import { SPRING_MICRO } from '../../design/tokens/motion';
import { normalizeDisplay } from './grading';

interface RootQualityChipsProps {
  /** Candidate roots as display strings (the chord tones — root ID is the skill). */
  roots: string[];
  /** Candidate qualities; labelled via CHORD_QUALITY_NAMES. */
  qualities: ChordQuality[];
  disabled: boolean;
  /** Fires when a quality is tapped (root must already be chosen). */
  onAnswer: (answer: { root: string; quality: ChordQuality }) => void;
  /** During feedback: the canonical correct root (ASCII) + quality to highlight. */
  feedback?: { correctRoot: string; correctQuality: ChordQuality };
}

/**
 * Two-stage chord identification: pick the ROOT, then pick the QUALITY.
 *
 * Stage 1 shows the root chips; once a root is chosen, stage 2 reveals the
 * quality chips. Tapping a different root before committing a quality just
 * re-selects the root. The answer fires on the quality tap (the natural last
 * action), keeping the zero-submit idiom.
 *
 * The parent keys this component by item id, so a new question remounts it
 * fresh (root cleared, guard re-armed) without a transition effect.
 */
export function RootQualityChips({
  roots,
  qualities,
  disabled,
  onAnswer,
  feedback,
}: RootQualityChipsProps) {
  const [root, setRoot] = useState<string | null>(null);
  // Commit guard: prevents a double-tap on a quality from re-grading.
  const locked = useRef(false);

  const pickRoot = (r: string) => {
    if (disabled || locked.current) return;
    setRoot(r);
  };

  const pickQuality = (q: ChordQuality) => {
    if (disabled || locked.current || root === null) return;
    locked.current = true;
    onAnswer({ root, quality: q });
  };

  const correctRootAscii = feedback?.correctRoot;

  return (
    <div className="flex flex-col gap-4">
      {/* Stage 1 — root */}
      <div>
        <div role="group" aria-label="root" className="grid grid-cols-3 gap-2">
          {roots.map((r, i) => {
            const isChosen = root === r;
            const showCorrect = disabled && correctRootAscii !== undefined && normalizeDisplay(r) === correctRootAscii;
            const showWrong = disabled && isChosen && correctRootAscii !== undefined && normalizeDisplay(r) !== correctRootAscii;

            let stateClass = '';
            if (showCorrect) stateClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
            else if (showWrong) stateClass = 'bg-red-500/15 border-red-500/40 text-red-300';
            const neutral = !showCorrect && !showWrong;
            const activeSelect = !disabled && isChosen;

            return (
              <m.button
                key={`${r}-${i}`}
                type="button"
                whileTap={!disabled ? { scale: 0.96, transition: SPRING_MICRO } : undefined}
                onClick={() => pickRoot(r)}
                disabled={disabled}
                aria-disabled={disabled}
                aria-pressed={isChosen}
                className={`min-h-[44px] px-2 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${stateClass} ${
                  disabled ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={
                  neutral
                    ? {
                        backgroundColor: activeSelect
                          ? 'var(--accent-dim)'
                          : 'color-mix(in srgb, var(--card) 60%, transparent)',
                        borderColor: activeSelect
                          ? 'var(--accent)'
                          : 'color-mix(in srgb, var(--border) 50%, transparent)',
                        color: activeSelect ? 'var(--accent)' : 'var(--text)',
                      }
                    : undefined
                }
              >
                {r}
              </m.button>
            );
          })}
        </div>
      </div>

      {/* Stage 2 — quality (revealed once a root is chosen, or always during feedback) */}
      {(root !== null || disabled) && (
        <div>
          <div role="group" aria-label="quality" className="grid grid-cols-2 gap-2">
            {qualities.map((q) => {
              const showCorrect = disabled && feedback?.correctQuality === q;
              let stateClass = '';
              if (showCorrect) stateClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
              const neutral = !showCorrect;

              return (
                <m.button
                  key={q}
                  type="button"
                  whileTap={!disabled ? { scale: 0.97, transition: SPRING_MICRO } : undefined}
                  onClick={() => pickQuality(q)}
                  disabled={disabled}
                  aria-disabled={disabled}
                  className={`min-h-[44px] px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${stateClass} ${
                    disabled ? 'cursor-default' : 'cursor-pointer'
                  }`}
                  style={
                    neutral
                      ? {
                          backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
                          borderColor: 'color-mix(in srgb, var(--border) 50%, transparent)',
                          color: 'var(--text-muted)',
                        }
                      : undefined
                  }
                >
                  {CHORD_QUALITY_NAMES[q]}
                </m.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
