import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { noteToString } from '../../core/types/music.ts';
import { CHORD_SYMBOLS } from '../../core/constants/chords.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { DEGREE_COLORS, DEGREE_INKS } from '../../design/tokens/colors.ts';
import { qualityName } from '../../utils/qualityName.ts';
import { toContentLanguage } from '../drill/drillText.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';

export function ChordGrid() {
  const { t, i18n } = useTranslation();
  const lang = toContentLanguage(i18n.language);
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
        <p className="text-ui font-medium mb-0.5">{t('explore.noDiatonicChords')}</p>
        <p className="text-caption">{t('explore.noDiatonicChordsHint')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }} role="group" aria-label={t('explore.diatonicChordsGroup')}>
      {diatonicChords.map(({ chord, numeral, degree }, i) => {
        const deg = degree as keyof typeof DEGREE_COLORS;
        // The degree hue is a FILL (the top line); the numeral is written in
        // the same hue's ink shade (D-28: never a 400 hue as text on cream).
        const color = degreeColorsOn ? DEGREE_COLORS[deg] : 'var(--accent)';
        const ink = degreeColorsOn ? DEGREE_INKS[deg] : 'var(--accent-text)';
        const rootLabel = noteToString(chord.root);
        const qualityLabel = CHORD_SYMBOLS[chord.quality] ?? chord.quality;
        const qualityFull = qualityName(chord.quality, lang);
        const isSelected =
          selectedChord !== null &&
          noteToString(selectedChord.root) === rootLabel &&
          selectedChord.quality === chord.quality;

        return (
          <m.button
            key={degree}
            onClick={() => setSelectedChord(isSelected ? null : chord)}
            // Cards are never narrower than 96 px and their text wraps rather
            // than clips ("Diminished" / "Disminuido" were cut off at 61 px).
            className="relative flex flex-col items-center gap-1 p-2.5 rounded-xl group text-center [overflow-wrap:anywhere]"
            // Selected = the choice-chip state (accent fill, --on-accent text).
            style={{
              backgroundColor: isSelected ? 'var(--accent)' : 'var(--card)',
              border: isSelected ? '1.5px solid var(--accent)' : '1.5px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
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
            aria-label={t('explore.chordButton', { root: rootLabel, quality: qualityFull, degree })}
          >
            {/* Degree hue as a fill line */}
            <div
              className="absolute top-0 left-2 right-2 h-[3px] rounded-b"
              style={{ backgroundColor: color }}
            />

            <span className="text-ui font-bold" style={{ color: isSelected ? 'var(--on-accent)' : ink }}>
              {numeral}
            </span>
            <span className="text-body font-semibold" style={{ color: isSelected ? 'var(--on-accent)' : 'var(--text)' }}>
              {rootLabel}
              <span className="font-normal" style={{ color: isSelected ? 'var(--on-accent)' : 'var(--text-dim)' }}>{qualityLabel}</span>
            </span>
            <span className="text-caption" style={{ color: isSelected ? 'var(--on-accent)' : 'var(--text-dim)' }}>
              {qualityFull}
            </span>
          </m.button>
        );
      })}
    </div>
  );
}
