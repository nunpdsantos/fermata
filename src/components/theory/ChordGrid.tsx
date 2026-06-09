import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { noteToString } from '../../core/types/music.ts';
import { CHORD_SYMBOLS, CHORD_QUALITY_NAMES } from '../../core/constants/chords.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { DEGREE_COLORS } from '../../design/tokens/colors.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';

export function ChordGrid() {
  const { t } = useTranslation();
  const { diatonicChords } = useKeyContext();
  const setSelectedChord = useAppStore((s) => s.setSelectedChord);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const degreeColorsOn = useDegreeColorsEnabled();

  if (diatonicChords.length === 0) {
    return (
      <div
        className="px-4 py-8 text-center rounded-xl border"
        style={{
          color: 'var(--text-dim)',
          borderColor: 'color-mix(in srgb, var(--card-hover) 50%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--bg) 30%, transparent)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-40">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <p className="text-xs font-medium mb-0.5">{t('explore.noDiatonicChords')}</p>
        <p className="text-2xs">{t('explore.noDiatonicChordsHint')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2" role="group" aria-label="Diatonic chords">
      {diatonicChords.map(({ chord, numeral, degree }, i) => {
        const color = degreeColorsOn
          ? DEGREE_COLORS[degree as keyof typeof DEGREE_COLORS]
          : 'var(--accent)';
        const rootLabel = noteToString(chord.root);
        const qualityLabel = CHORD_SYMBOLS[chord.quality] ?? chord.quality;
        const qualityFull = CHORD_QUALITY_NAMES[chord.quality] ?? chord.quality;
        const isSelected =
          selectedChord !== null &&
          noteToString(selectedChord.root) === rootLabel &&
          selectedChord.quality === chord.quality;

        return (
          <m.button
            key={degree}
            onClick={() => setSelectedChord(isSelected ? null : chord)}
            className="relative flex flex-col items-center gap-1.5 p-3 max-sm:p-2 rounded-xl overflow-hidden group"
            style={{
              backgroundColor: isSelected ? `${color}18` : 'var(--card)',
              border: isSelected ? `1.5px solid ${color}60` : '1.5px solid var(--card-hover)',
              boxShadow: isSelected ? `0 0 20px ${color}10` : 'var(--shadow-sm)',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            // one-off spring (400/25) — balances the staggered reveal so
            // adjacent chips don't feel identical; tighter than GENTLE but
            // less damped than SNAPPY. Only used here.
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.04, y: -2, boxShadow: 'var(--shadow-md)' }}
            whileTap={{ scale: 0.96 }}
            aria-pressed={isSelected}
            aria-label={`${rootLabel} ${chord.quality} chord, degree ${degree}`}
          >
            {/* Subtle top accent line */}
            <div
              className="absolute top-0 left-2 right-2 h-px opacity-50"
              style={{ backgroundColor: color }}
            />

            <span
              className="text-[11px] font-bold"
              style={{ color }}
            >
              {numeral}
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {rootLabel}
              <span className="font-normal" style={{ color: 'var(--text-dim)' }}>{qualityLabel}</span>
            </span>
            <span className="text-[9px] transition-colors" style={{ color: 'var(--text-dim)' }}>
              {qualityFull}
            </span>
          </m.button>
        );
      })}
    </div>
  );
}
