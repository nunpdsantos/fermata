import { Suspense, lazy, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Chord, Note, PitchedNote } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { invertChord } from '../../core/constants/chords.ts';
import { StaffNotationSkeleton } from '../notation/StaffNotationSkeleton.tsx';

const StaffNotation = lazy(() =>
  import('../notation/StaffNotation.tsx').then((m) => ({ default: m.StaffNotation }))
);

export interface ChordBuilderStaffProps {
  /** Selected notes in anchor order (lowest first by interval from the strip). */
  notes: Note[];
  /** Identified chord, if any — required for inversion to work. */
  detectedChord?: Chord;
}

type Mode = 'chord' | 'arpeggio';
type Register = 'low' | 'mid' | 'high';

const REGISTERS: Register[] = ['low', 'mid', 'high'];

/**
 * Staff renderer for whatever the user built on the chromatic strip.
 *
 * Three orthogonal controls:
 * - Mode: stacked chord (compact) vs. horizontal arpeggio
 * - Register: low (bass clef, octave 2-3), mid (treble, 4-5), high (treble, 5-6)
 * - Inversion: 0 = root position, 1 = first inversion, … (uses Fermata's
 *   `invertChord` helper; only available when the parser identified a chord)
 *
 * Lazy-loads VexFlow on first paint.
 */
export function ChordBuilderStaff({ notes, detectedChord }: ChordBuilderStaffProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('chord');
  const [register, setRegister] = useState<Register>('mid');
  const [inversion, setInversion] = useState<number>(0);

  // Inversion only makes sense when a chord is identified and has ≥3 notes.
  const maxInversion = detectedChord && detectedChord.notes.length >= 3 ? detectedChord.notes.length - 1 : 0;
  const canInvert = maxInversion > 0;
  // Clamp at render time; state can hold a stale value when the chord
  // shrinks. Avoids a setState-in-effect cascade.
  const safeInversion = Math.min(inversion, maxInversion);

  const displayNotes = useMemo<Note[]>(() => {
    if (canInvert && safeInversion > 0 && detectedChord) {
      return invertChord(detectedChord, safeInversion).notes;
    }
    return notes;
  }, [canInvert, safeInversion, detectedChord, notes]);

  const pitched = useMemo(() => pitchNotes(displayNotes, register), [displayNotes, register]);
  const clef = register === 'low' ? 'bass' : 'treble';

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {t('chordBuilder.staff')}
        </span>

        <Toggle
          options={[
            { value: 'chord',    label: t('chordBuilder.staffChord') },
            { value: 'arpeggio', label: t('chordBuilder.staffArpeggio') },
          ]}
          value={mode}
          onChange={setMode}
        />

        <Toggle
          options={REGISTERS.map((r) => ({ value: r, label: t(`chordBuilder.register.${r}`) }))}
          value={register}
          onChange={setRegister}
        />

        {canInvert && (
          <Toggle
            options={Array.from({ length: maxInversion + 1 }, (_, i) => ({
              value: i,
              label: i === 0 ? t('chordBuilder.inversion.root') : t('chordBuilder.inversion.nth', { n: i }),
            }))}
            value={safeInversion}
            onChange={setInversion}
          />
        )}
      </div>

      <Suspense fallback={<StaffNotationSkeleton height={120} />}>
        <StaffNotation
          notes={pitched}
          height={120}
          clef={clef}
          duration={mode === 'chord' ? 'w' : 'q'}
          chord={mode === 'chord'}
        />
      </Suspense>
    </div>
  );
}

interface ToggleProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

function Toggle<T extends string | number>({ options, value, onChange }: ToggleProps<T>) {
  return (
    <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-2 py-0.5 text-2xs font-medium transition-colors"
            aria-pressed={active}
            style={{
              backgroundColor: active ? 'var(--card-hover)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-dim)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Pick a starting octave so the anchor lands inside the active clef's staff.
 * The first note's pitch class drives the choice; subsequent notes keep
 * ascending (octave bumps when the pitch class wraps).
 *
 * - low (bass clef):  pcs below F (0-4 = C/C♯/D/D♯/E) → octave 3, F+ → octave 2.
 * - mid (treble):     pcs below E (0-3) → octave 5, E+ → octave 4.
 * - high (treble 8va): one octave above mid.
 */
function pitchNotes(notes: Note[], register: Register): PitchedNote[] {
  if (notes.length === 0) return [];
  const firstPc = getPitchClass(notes[0]);
  let octave: number;
  if (register === 'low') {
    octave = firstPc < 5 ? 3 : 2;
  } else if (register === 'high') {
    octave = firstPc < 4 ? 6 : 5;
  } else {
    octave = firstPc < 4 ? 5 : 4;
  }
  const out: PitchedNote[] = [];
  let lastPc = -1;
  for (const n of notes) {
    const pc = getPitchClass(n);
    if (lastPc !== -1 && pc <= lastPc) octave += 1;
    out.push({ ...n, octave });
    lastPc = pc;
  }
  return out;
}
