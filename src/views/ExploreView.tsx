import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { KeySelector } from '../components/navigation/KeySelector.tsx';
import { ScaleDegreeBar } from '../components/theory/ScaleDegreeBar.tsx';
import { ScaleComparison } from '../components/theory/ScaleComparison.tsx';
import { ChordWorkspace } from '../components/theory/ChordWorkspace.tsx';
import { CircleOfFifths } from '../components/theory/CircleOfFifths.tsx';
import { useKeyContext } from '../hooks/useKeyContext.ts';
import { noteToString } from '../core/types/music.ts';
import { useAppStore } from '../state/store.ts';
import { Button } from '../components/ui/Button.tsx';
import {
  playScale,
  resumeAudio,
  cancelScheduledAudio,
} from '../core/services/audio.ts';
import { getSynthConfig } from '../services/synthConfig.ts';
import { generateScaleSummary, copyToClipboard } from '../utils/exportHelpers.ts';
import { toast } from '../state/toastStore.ts';

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
  const synthPreset = useAppStore((s) => s.synthPreset);
  const baseOctave = useAppStore((s) => s.baseOctave);

  const handleQuickPlay = useCallback(async () => {
    await resumeAudio();
    // Play again restarts cleanly instead of layering a second scale (W8-01).
    // Audio only: stopPlayback() would also clear other components' visual
    // timeouts (e.g. the chord panel's arpeggio un-lighting its keys — B2).
    cancelScheduledAudio();
    const config = getSynthConfig(synthPreset);
    playScale(scale.notes, baseOctave, true, false, 0.25, () => {}, () => {}, config);
  }, [scale, synthPreset, baseOctave]);

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
          <m.div variants={fadeUp} className="card-base px-5 max-sm:px-4 py-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <h2 className="learn-serif" style={{ color: 'var(--text)' }}>
                  {noteToString(scale.root)}{' '}
                  <span style={{ color: 'var(--text-muted)' }}>
                    {t(`scaleName.${selectedScale}`)}
                  </span>
                </h2>
                <p className="text-caption mt-1 explore-prose" style={{ color: 'var(--text-dim)' }}>
                  {t('explore.notes', { count: scale.notes.length })} &middot;{' '}
                  {scale.notes.map((n) => noteToString(n)).join(' ')}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Play is THE action here: primary (walnut fill, --on-accent
                    text). It used to be tonic-blue text at 2.1:1 (W11-A). */}
                <Button
                  variant="primary"
                  onClick={handleQuickPlay}
                  aria-label={t('explore.playScaleAscending')}
                  startIcon={
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  }
                >
                  {t('common.play')}
                </Button>
                <Button
                  onClick={async () => {
                    const text = generateScaleSummary(scale, diatonicChords, selectedChord);
                    const ok = await copyToClipboard(text);
                    if (ok) toast(t('toast.copiedToClipboard'), 'success');
                  }}
                  aria-label={t('explore.copyScaleSummary')}
                  startIcon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  }
                >
                  {t('common.copy')}
                </Button>
                <Button
                  className="no-print"
                  onClick={() => window.print()}
                  aria-label={t('explore.printScaleDiagram')}
                  startIcon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                    </svg>
                  }
                >
                  {t('common.print')}
                </Button>
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

          {/* ─── Scale Comparison ────────────────────────────────── */}
          <m.div variants={fadeUp}>
            <ScaleComparison />
          </m.div>

          {/* ─── Chord Workspace + Circle of Fifths ────────────── */}
          <m.div
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"
          >
            <ChordWorkspace />
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
    </div>
  );
}
