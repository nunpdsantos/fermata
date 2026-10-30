import { useEffect } from 'react';
import { Note, noteToString } from '../../core/types/music.ts';
import { DEGREE_COLORS, DEGREE_COLORS_DIM } from '../../design/tokens/colors.ts';

const INTERVAL_SHORT = [
  'R', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', '8',
] as const;

const KEY_TO_STEP: Record<string, number> = {
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '0': 10, '-': 11, '=': 12,
};

export interface ChromaticStripProps {
  /** The note that sits at block 0. Always shown with the anchor (tonic-blue) ring;
   * defaults to selected but the caller may render it deselected. */
  rootNote: Note;
  /** Note name to display at each block (caller controls spelling). */
  noteAtStep: (step: number) => Note;
  /** Steps from root currently turned on. Block 0 is always implicitly on. */
  activeSteps: Set<number>;
  onToggleStep: (step: number) => void;

  /** Optional in-key tinting + scale-degree labels. */
  inKeyPitchClasses?: Set<number>;
  /** Caller maps a pitch class (0-11) → diatonic scale degree (1-7) or undefined. */
  pitchClassToDegree?: (pc: number) => number | undefined;
  /** Pitch class for each step — for in-key check. */
  pitchClassAtStep?: (step: number) => number;
  /**
   * Interval label for each block, read from the note the block shows (A5 over
   * G♯, m6 over A♭). Without it the strip falls back to fixed semitone names.
   */
  intervalAtStep?: (step: number) => string;

  /** Enable keyboard shortcuts (1-9, 0, -, = → blocks 1-12). Default true. */
  keyboard?: boolean;
  className?: string;
}

/**
 * 13-block chromatic strip — one block per half-step from the chord root.
 * Click a block to toggle that interval. Block 0 (the anchor / chord root) wears
 * a permanent tonic-blue ring marking it as the interval-reference point, but is
 * toggleable like any other block — useful for naming chords whose root isn't the
 * strip's anchor (e.g. play D-F#-A on a strip anchored at C and Fermata's parser
 * recognises it as D major).
 * If `inKeyPitchClasses` is provided, in-key blocks get a tinted background and a
 * scale-degree number; out-of-key blocks stay neutral.
 */
export function ChromaticStrip({
  rootNote,
  noteAtStep,
  activeSteps,
  onToggleStep,
  inKeyPitchClasses,
  pitchClassToDegree,
  pitchClassAtStep,
  intervalAtStep,
  keyboard = true,
  className = '',
}: ChromaticStripProps) {
  useEffect(() => {
    if (!keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'SELECT' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const step = KEY_TO_STEP[e.key];
      if (step !== undefined) {
        e.preventDefault();
        onToggleStep(step);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [keyboard, onToggleStep]);

  return (
    <div
      className={`grid gap-1.5 ${className}`}
      style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
      role="group"
      aria-label={`Chromatic strip from ${noteToString(rootNote)}`}
    >
      {Array.from({ length: 13 }, (_, step) => {
        const note = noteAtStep(step);
        const noteLabel = noteToString(note);
        const intervalLabel = intervalAtStep ? intervalAtStep(step) : INTERVAL_SHORT[step];
        const isRoot = step === 0;
        const isActive = activeSteps.has(step);
        const pc = pitchClassAtStep ? pitchClassAtStep(step) : undefined;
        const inKey = inKeyPitchClasses && pc !== undefined ? inKeyPitchClasses.has(pc) : false;
        const degree = inKey && pitchClassToDegree && pc !== undefined ? pitchClassToDegree(pc) : undefined;

        const stateLabel = isRoot
          ? `Root, ${noteLabel}`
          : `${intervalLabel}, ${noteLabel}${isActive ? ', selected' : ''}${degree ? `, scale degree ${degree}` : ''}`;

        // Two orthogonal visual channels:
        //   1) Background tint encodes scale-degree / key context (degree colors when in-key).
        //   2) Outer ring (box-shadow) encodes chord-build state — accent ring for selected,
        //      tonic-blue ring for the locked root. The two channels never collide on the same
        //      property, so degree-5 amber doesn't get mistaken for "selected", etc.
        let bg: string;
        let border: string;
        if (inKey && degree) {
          const d = degree as 1 | 2 | 3 | 4 | 5 | 6 | 7;
          bg = DEGREE_COLORS_DIM[d];
          border = `color-mix(in srgb, ${DEGREE_COLORS[d]} 35%, transparent)`;
        } else {
          bg = 'var(--card)';
          border = 'var(--border)';
        }
        const ringColor = isRoot ? DEGREE_COLORS[1] : isActive ? 'var(--accent)' : null;
        const boxShadow = ringColor ? `0 0 0 2px ${ringColor}` : 'none';
        const text = 'var(--text)';

        return (
          <button
            key={step}
            type="button"
            onClick={() => onToggleStep(step)}
            aria-pressed={isActive}
            aria-label={stateLabel}
            className="relative rounded-lg px-1 py-2.5 text-center cursor-pointer transition-transform hover:brightness-110 active:scale-[0.97]"
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: text,
              boxShadow,
            }}
          >
            {degree && (
              <span
                className="absolute right-1.5 top-0.5 text-[9px] font-semibold"
                style={{ color: DEGREE_COLORS[degree as 1 | 2 | 3 | 4 | 5 | 6 | 7] }}
              >
                {degree}
              </span>
            )}
            <span className="block text-[10px] opacity-70">{step}</span>
            <span className="block text-base font-semibold mt-0.5">{noteLabel}</span>
            <span className="block text-[11px] opacity-80">{intervalLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
