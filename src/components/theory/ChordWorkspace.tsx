/**
 * ChordWorkspace — unified chord surface for Explore.
 *
 * Owns the chord-picker mode (Diatonic | All | Build) and composes the three
 * pickers above a SINGLE staff and a single below-staff detail block. The one
 * staff shows the selected chord when there is one (honouring the global
 * inversion via `invertedNotes`), otherwise the current scale. This retires the
 * duplicate staves that previously lived inside ChordDetail and
 * ChordBuilderStaff.
 */
import { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChordGrid } from './ChordGrid.tsx';
import { ChordBrowser } from './ChordBrowser.tsx';
import { ChordBuilderPanel } from './ChordBuilderPanel.tsx';
import { CurrentChordPanel } from '../panels/CurrentChordPanel.tsx';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';
import { noteToString } from '../../core/types/music.ts';
import { SCALE_TYPE_NAMES } from '../../core/constants/scales.ts';
import { DEGREE_COLORS } from '../../design/tokens/colors.ts';
import { getVoicedChordNotes, getScaleNotesWithOctaves } from '../../core/utils/pianoLayout.ts';
import { getKeySignatureForScale } from '../../utils/notationHelpers.ts';
import { StaffNotationSkeleton } from '../notation/StaffNotationSkeleton.tsx';

const StaffNotation = lazy(() =>
  import('../notation/StaffNotation.tsx').then((m) => ({ default: m.StaffNotation }))
);

export function ChordWorkspace() {
  const { t } = useTranslation();
  const { scale, invertedNotes } = useKeyContext();
  const selectedChord = useAppStore((s) => s.selectedChord);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const degreeColorsOn = useDegreeColorsEnabled();
  const [mode, setMode] = useState<'diatonic' | 'all' | 'build'>('diatonic');

  return (
    <div className="space-y-6">
      {/* ─── Chord picker (mode tabs) ───────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-2.5">
          <h3 className="type-section">
            {t('explore.chords')}
          </h3>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--card)' }}>
            <button
              onClick={() => setMode('diatonic')}
              aria-pressed={mode === 'diatonic'}
              className="px-2 py-0.5 text-2xs font-medium transition-colors max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
              style={{
                backgroundColor: mode === 'diatonic' ? 'var(--card-hover)' : 'transparent',
                color: mode === 'diatonic' ? 'var(--text)' : 'var(--text-dim)',
              }}
            >
              {t('explore.diatonic')}
            </button>
            <button
              onClick={() => setMode('all')}
              aria-pressed={mode === 'all'}
              className="px-2 py-0.5 text-2xs font-medium transition-colors max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
              style={{
                backgroundColor: mode === 'all' ? 'var(--card-hover)' : 'transparent',
                color: mode === 'all' ? 'var(--text)' : 'var(--text-dim)',
              }}
            >
              {t('explore.allChords')}
            </button>
            <button
              onClick={() => setMode('build')}
              aria-pressed={mode === 'build'}
              className="px-2 py-0.5 text-2xs font-medium transition-colors max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
              style={{
                backgroundColor: mode === 'build' ? 'var(--card-hover)' : 'transparent',
                color: mode === 'build' ? 'var(--text)' : 'var(--text-dim)',
              }}
            >
              {t('explore.build')}
            </button>
          </div>
        </div>
        {mode === 'diatonic' && <ChordGrid />}
        {mode === 'all' && <ChordBrowser />}
        {mode === 'build' && <ChordBuilderPanel />}
      </div>

      {/* ─── One staff: chord if selected, else scale ───────── */}
      <div>
        <h3 className="type-section mb-2.5">
          {t('explore.staffNotation')}
        </h3>
        <div className="rounded-xl p-3" style={{ border: '1px solid color-mix(in srgb, var(--card) 50%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 30%, transparent)', boxShadow: 'var(--shadow-sm)' }}>
          <Suspense fallback={<StaffNotationSkeleton height={selectedChord ? 120 : 130} />}>
            {selectedChord ? (
              <StaffNotation
                notes={getVoicedChordNotes(invertedNotes.length > 0 ? invertedNotes : selectedChord.notes, 4)}
                height={120}
                duration="w"
                chord
              />
            ) : (
              <StaffNotation
                notes={getScaleNotesWithOctaves(scale.notes, 4)}
                keySignature={getKeySignatureForScale(scale.root, selectedScale) ?? undefined}
                noteColors={degreeColorsOn ? Object.fromEntries(
                  scale.notes.map((_, i) => [i, DEGREE_COLORS[(i + 1) as keyof typeof DEGREE_COLORS] ?? 'var(--text-muted)'])
                ) : undefined}
                height={130}
                duration="q"
              />
            )}
          </Suspense>
        </div>
      </div>

      {/* ─── Below the staff: chord panel or scale summary ──── */}
      {selectedChord ? (
        <CurrentChordPanel chord={selectedChord} />
      ) : (
        <div className="space-y-1">
          <p className="text-base font-bold learn-serif" style={{ color: 'var(--text)' }}>
            {noteToString(scale.root)}{' '}
            <span className="font-normal" style={{ color: 'var(--text-muted)' }}>
              {SCALE_TYPE_NAMES[selectedScale]}
            </span>
          </p>
          <p className="text-xs explore-prose" style={{ color: 'var(--text-dim)' }}>
            {scale.notes.map(noteToString).join(' ')}
          </p>
        </div>
      )}
    </div>
  );
}
