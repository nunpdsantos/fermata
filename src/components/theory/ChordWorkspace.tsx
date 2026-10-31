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
import { Suspense, lazy, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChordGrid } from './ChordGrid.tsx';
import { ChordBrowser } from './ChordBrowser.tsx';
import { ChordBuilderPanel } from './ChordBuilderPanel.tsx';
import { CurrentChordPanel } from '../panels/CurrentChordPanel.tsx';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';
import { noteToString } from '../../core/types/music.ts';
import { DEGREE_COLORS } from '../../design/tokens/colors.ts';
import { getVoicedChordNotes, getScaleNotesWithOctaves } from '../../core/utils/pianoLayout.ts';
import { getKeySignatureForScale } from '../../utils/notationHelpers.ts';
import { degreeOf, degreeColorSlot } from '../../core/utils/degreeSpelling.ts';
import { StaffNotationSkeleton } from '../notation/StaffNotationSkeleton.tsx';
import { Segment } from '../ui/Segment.tsx';

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

  // The scale staff draws every note plus the octave tonic on top. Each note is
  // coloured by its FUNCTION, read from its spelled letter (a pentatonic's G is
  // the dominant, not "the 4th note"), and the top tonic is coloured like the
  // tonic (audit W1-06, W1-18).
  const scaleStaffNotes = useMemo(() => getScaleNotesWithOctaves(scale.notes, 4), [scale]);
  const scaleStaffColors = useMemo(
    () => Object.fromEntries(
      scaleStaffNotes.map((n, i) => [i, DEGREE_COLORS[degreeColorSlot(degreeOf(scale.root, n))]]),
    ),
    [scaleStaffNotes, scale.root],
  );

  return (
    <div className="space-y-6">
      {/* ─── Chord picker (mode tabs) ───────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-2.5 flex-wrap">
          <h3 className="type-section">
            {t('explore.chords')}
          </h3>
          {/* A Segment in tabs mode: it switches the panel below (D-28). */}
          <Segment
            mode="tabs"
            label={t('explore.chords')}
            value={mode}
            onChange={setMode}
            options={[
              { value: 'diatonic', label: t('explore.diatonic'), id: 'chords-tab-diatonic', controls: 'chords-panel' },
              { value: 'all', label: t('explore.allChords'), id: 'chords-tab-all', controls: 'chords-panel' },
              { value: 'build', label: t('explore.build'), id: 'chords-tab-build', controls: 'chords-panel' },
            ]}
          />
        </div>
        <div id="chords-panel" role="tabpanel" aria-labelledby={`chords-tab-${mode}`}>
          {mode === 'diatonic' && <ChordGrid />}
          {mode === 'all' && <ChordBrowser />}
          {mode === 'build' && <ChordBuilderPanel />}
        </div>
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
                followInstrument
              />
            ) : (
              <StaffNotation
                notes={scaleStaffNotes}
                keySignature={getKeySignatureForScale(scale.root, selectedScale) ?? undefined}
                noteColors={degreeColorsOn ? scaleStaffColors : undefined}
                height={130}
                duration="q"
                followInstrument
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
              {t(`scaleName.${selectedScale}`)}
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
