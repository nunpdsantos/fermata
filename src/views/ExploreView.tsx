import { useCallback, useState, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { KeySelector } from '../components/navigation/KeySelector.tsx';
import { ScaleDegreeBar } from '../components/theory/ScaleDegreeBar.tsx';
import { ScaleComparison } from '../components/theory/ScaleComparison.tsx';
import { ChordGrid } from '../components/theory/ChordGrid.tsx';
import { ChordBrowser } from '../components/theory/ChordBrowser.tsx';
import { ChordBuilderPanel } from '../components/theory/ChordBuilderPanel.tsx';
import { CircleOfFifths } from '../components/theory/CircleOfFifths.tsx';
import { DetailPanel } from '../components/panels/DetailPanel.tsx';
import { useKeyContext } from '../hooks/useKeyContext.ts';
import { noteToString } from '../core/types/music.ts';
import { SCALE_TYPE_NAMES } from '../core/constants/scales.ts';
import { useAppStore } from '../state/store.ts';
import { DEGREE_COLORS } from '../design/tokens/colors.ts';
import { useDegreeColorsEnabled } from '../hooks/useDegreeColors.ts';
import {
  playScale,
  resumeAudio,
} from '../core/services/audio.ts';
import { getSynthConfig } from '../services/synthConfig.ts';
import { generateScaleSummary, copyToClipboard } from '../utils/exportHelpers.ts';
import { toast } from '../state/toastStore.ts';
import { getScaleNotesWithOctaves } from '../core/utils/pianoLayout.ts';
import { getKeySignatureForScale } from '../utils/notationHelpers.ts';
import { StaffNotationSkeleton } from '../components/notation/StaffNotationSkeleton.tsx';

const StaffNotation = lazy(() =>
  import('../components/notation/StaffNotation.tsx').then((m) => ({ default: m.StaffNotation }))
);

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function ExploreView() {
  const { t } = useTranslation();
  const { scale, diatonicChords } = useKeyContext();
  const selectedScale = useAppStore((s) => s.selectedScale);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const setDetailPanelOpen = useAppStore((s) => s.setDetailPanelOpen);
  const setSelectedChord = useAppStore((s) => s.setSelectedChord);
  const detailPanelOpen = useAppStore((s) => s.detailPanelOpen);
  const synthPreset = useAppStore((s) => s.synthPreset);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const [chordMode, setChordMode] = useState<'diatonic' | 'all' | 'build'>('diatonic');

  const handleShowScale = () => {
    setSelectedChord(null);
    setDetailPanelOpen(true);
  };

  const handleQuickPlay = useCallback(async () => {
    await resumeAudio();
    const config = getSynthConfig(synthPreset);
    playScale(scale.notes, baseOctave, true, false, 0.25, () => {}, () => {}, config);
  }, [scale, synthPreset, baseOctave]);

  const degreeColorsOn = useDegreeColorsEnabled();
  const tonicColor = degreeColorsOn ? DEGREE_COLORS[1] : 'var(--accent)';
  const tonicAlpha = (hex: string): string =>
    degreeColorsOn
      ? `${DEGREE_COLORS[1]}${hex}`
      : `color-mix(in srgb, var(--accent) ${Math.round((parseInt(hex, 16) / 255) * 100)}%, transparent)`;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <m.div
          variants={stagger}
          initial={false}
          animate="show"
          className="max-w-4xl mx-auto px-5 max-sm:px-3 py-5 max-sm:py-3 space-y-7 max-sm:space-y-4"
        >
          {/* ─── Key / Scale Selector ──────────────────────────── */}
          <m.div variants={fadeUp}>
            <KeySelector />
          </m.div>

          {/* ─── Hero: Current Scale Context ───────────────────── */}
          <m.div
            variants={fadeUp}
            className="relative rounded-2xl overflow-hidden"
            style={{
              backgroundColor: tonicAlpha('06'),
              border: `1px solid ${tonicAlpha('12')}`,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Subtle gradient wash */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 20% 50%, ${tonicAlpha('08')} 0%, transparent 60%)`,
              }}
            />

            <div className="relative px-5 max-sm:px-3 py-4 max-sm:py-3 flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
              <div>
                <h2 className="text-xl font-bold learn-serif" style={{ color: 'var(--text)' }}>
                  {noteToString(scale.root)}{' '}
                  <span className="font-normal" style={{ color: 'var(--text-muted)' }}>
                    {SCALE_TYPE_NAMES[selectedScale]}
                  </span>
                </h2>
                <p className="text-xs mt-1 explore-prose" style={{ color: 'var(--text-dim)' }}>
                  {t('explore.notes', { count: scale.notes.length })} &middot;{' '}
                  {scale.notes.map((n) => noteToString(n)).join(' ')}
                </p>
              </div>

              <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-stretch max-sm:gap-1.5">
                <button
                  onClick={handleQuickPlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 max-sm:py-2 rounded-xl text-xs font-semibold transition-all duration-150 hover:scale-[1.03] active:scale-[0.97] max-sm:justify-center"
                  style={{
                    backgroundColor: tonicAlpha('15'),
                    color: tonicColor,
                    border: `1px solid ${tonicAlpha('30')}`,
                  }}
                  aria-label={t('explore.playScaleAscending')}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {t('common.play')}
                </button>
                <button
                  onClick={handleShowScale}
                  className="flex items-center gap-1.5 px-3 py-1.5 max-sm:py-2 rounded-xl text-xs font-medium transition-all duration-150 active:scale-[0.97] max-sm:justify-center"
                  style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'color-mix(in srgb, var(--card) 40%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
                  }}
                >
                  {t('common.details')}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <button
                  onClick={async () => {
                    const text = generateScaleSummary(scale, diatonicChords, selectedChord);
                    const ok = await copyToClipboard(text);
                    if (ok) toast(t('toast.copiedToClipboard'), 'success');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 max-sm:py-2 rounded-xl text-xs font-medium transition-all duration-150 active:scale-[0.97] max-sm:justify-center"
                  style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'color-mix(in srgb, var(--card) 40%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
                  }}
                  aria-label={t('explore.copyScaleSummary')}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {t('common.copy')}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 max-sm:py-2 rounded-xl text-xs font-medium transition-all duration-150 active:scale-[0.97] no-print max-sm:justify-center"
                  style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'color-mix(in srgb, var(--card) 40%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
                  }}
                  aria-label={t('explore.printScaleDiagram')}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                  </svg>
                  {t('common.print')}
                </button>
              </div>
            </div>
          </m.div>

          {/* ─── Scale Degrees ──────────────────────────────────── */}
          <m.div variants={fadeUp}>
            <h3 className="type-section mb-2.5">
              {t('explore.scaleDegrees')}
            </h3>
            <ScaleDegreeBar />
          </m.div>

          {/* ─── Staff Notation ─────────────────────────────────── */}
          <m.div variants={fadeUp}>
            <h3 className="type-section mb-2.5">
              {t('explore.staffNotation')}
            </h3>
            <div className="rounded-xl p-3" style={{ border: '1px solid color-mix(in srgb, var(--card) 50%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 30%, transparent)', boxShadow: 'var(--shadow-sm)' }}>
              <Suspense fallback={<StaffNotationSkeleton height={130} />}>
                <StaffNotation
                  notes={getScaleNotesWithOctaves(scale.notes, 4)}
                  keySignature={getKeySignatureForScale(scale.root, selectedScale) ?? undefined}
                  noteColors={degreeColorsOn ? Object.fromEntries(
                    scale.notes.map((_, i) => [i, DEGREE_COLORS[(i + 1) as keyof typeof DEGREE_COLORS] ?? 'var(--text-muted)'])
                  ) : undefined}
                  height={130}
                  duration="q"
                />
              </Suspense>
            </div>
          </m.div>

          {/* ─── Scale Comparison ────────────────────────────────── */}
          <m.div variants={fadeUp}>
            <ScaleComparison />
          </m.div>

          {/* ─── Chord Grid + Circle of Fifths ─────────────────── */}
          <m.div
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <h3 className="type-section">
                  {t('explore.chords')}
                </h3>
                <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--card)' }}>
                  <button
                    onClick={() => setChordMode('diatonic')}
                    className="px-2 py-0.5 text-2xs font-medium transition-colors max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
                    style={{
                      backgroundColor: chordMode === 'diatonic' ? 'var(--card-hover)' : 'transparent',
                      color: chordMode === 'diatonic' ? 'var(--text)' : 'var(--text-dim)',
                    }}
                  >
                    {t('explore.diatonic')}
                  </button>
                  <button
                    onClick={() => setChordMode('all')}
                    className="px-2 py-0.5 text-2xs font-medium transition-colors max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
                    style={{
                      backgroundColor: chordMode === 'all' ? 'var(--card-hover)' : 'transparent',
                      color: chordMode === 'all' ? 'var(--text)' : 'var(--text-dim)',
                    }}
                  >
                    {t('explore.allChords')}
                  </button>
                  <button
                    onClick={() => setChordMode('build')}
                    className="px-2 py-0.5 text-2xs font-medium transition-colors max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
                    style={{
                      backgroundColor: chordMode === 'build' ? 'var(--card-hover)' : 'transparent',
                      color: chordMode === 'build' ? 'var(--text)' : 'var(--text-dim)',
                    }}
                  >
                    {t('explore.build')}
                  </button>
                </div>
              </div>
              {chordMode === 'diatonic' && <ChordGrid />}
              {chordMode === 'all' && <ChordBrowser />}
              {chordMode === 'build' && <ChordBuilderPanel />}
            </div>
            <div>
              <h3 className="type-section mb-2.5">
                {t('explore.circleOfFifths')}
              </h3>
              <div className="rounded-xl p-3" style={{ border: '1px solid color-mix(in srgb, var(--card) 50%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 30%, transparent)', boxShadow: 'var(--shadow-sm)' }}>
                <CircleOfFifths />
              </div>
            </div>
          </m.div>
        </m.div>
      </div>

      {/* Detail panel */}
      {detailPanelOpen && <DetailPanel />}
    </div>
  );
}
