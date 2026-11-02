import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { noteToString } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { SCALE_FORMULAS, getScaleDegreeFunctionKey } from '../../core/constants/scales.ts';
import { scaleDegrees, formatDegree, degreeColorSlot } from '../../core/utils/degreeSpelling.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { DEGREE_COLORS, ON_DEGREE } from '../../design/tokens/colors.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';
import { SPRING_SNAPPY } from '../../design/tokens/motion';

export function ScaleDegreeBar() {
  const { t } = useTranslation();
  const { scale, diatonicChords } = useKeyContext();
  const selectedScale = useAppStore((s) => s.selectedScale);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const setSelectedChord = useAppStore((s) => s.setSelectedChord);

  const formula = SCALE_FORMULAS[selectedScale];
  const noteCount = scale.notes.length;
  const isCompact = noteCount > 8;
  const degreeColorsOn = useDegreeColorsEnabled();

  // Degree label and colour are read from each note's SPELLING (letter
  // distance + semitones): the label always names the note printed under it
  // ("b5 / Eb" in A blues, never "b5 / D#"), in one notation (b3 style), and
  // the colour follows the degree's function, not the note's position
  // (audit W1-05, W1-06, W1-11).
  const degrees = useMemo(() => scaleDegrees(scale.root, scale.notes), [scale]);

  return (
    <div className="flex items-stretch gap-1.5 max-sm:gap-1 max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-proximity" role="group" aria-label={t('explore.scaleDegreesGroup')}>
      {scale.notes.map((note, i) => {
        const degree = i + 1;
        // The diatonic chord built on this note, if any (a bebop passing tone
        // or an exotic degree whose thirds don't stack has none).
        const dc = diatonicChords.find((d) => getPitchClass(d.chord.root) === getPitchClass(note));
        const isSelected = !!selectedChord && !!dc &&
          noteToString(selectedChord.root) === noteToString(dc.chord.root) &&
          selectedChord.quality === dc.chord.quality;
        const isInteractive = !!dc;
        const colorKey = degreeColorSlot(degrees[i]);
        // D-28: the degree hue is a FILL with dark ink on it — never text.
        const fill = degreeColorsOn
          ? (DEGREE_COLORS[colorKey] ?? 'var(--card-active)')
          : 'var(--accent)';
        const intervalLabel = formatDegree(degrees[i]);
        const funcKey = noteCount === 7
          ? getScaleDegreeFunctionKey(i, formula[i] ?? 0)
          : null;
        const funcLabel = funcKey ? t(funcKey) : '';
        // Selected = the choice-chip state (accent fill, --on-accent text).
        const textColor = isSelected ? 'var(--on-accent)' : 'var(--text)';
        const dimColor = isSelected ? 'var(--on-accent)' : 'var(--text-dim)';

        return (
          <m.button
            key={`${noteToString(note)}-${i}`}
            {...(isInteractive
              ? { onClick: () => setSelectedChord(isSelected ? null : dc.chord) }
              : { disabled: true })}
            className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl flex-1 min-w-0 max-sm:min-w-[44px] max-sm:snap-start group transition-colors"
            style={{
              backgroundColor: isSelected ? 'var(--accent)' : 'var(--card)',
              border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              opacity: isInteractive ? undefined : 0.55,
              cursor: isInteractive ? undefined : 'default',
            }}
            whileTap={{ scale: 0.94 }}
            animate={isSelected ? { scale: 1.04 } : { scale: 1 }}
            transition={SPRING_SNAPPY}
            title={funcLabel}
            {...(isInteractive ? { 'aria-pressed': isSelected } : {})}
            aria-label={t('explore.degreeButton', { degree, interval: intervalLabel, note: noteToString(note) })}
          >
            <span className="text-caption leading-none" style={{ color: dimColor }} aria-hidden="true">
              {degree}
            </span>
            <span
              className="inline-flex items-center justify-center rounded-full text-caption font-bold leading-none"
              style={{ backgroundColor: fill, color: degreeColorsOn ? ON_DEGREE : 'var(--on-accent)', minWidth: 28, height: 28, padding: '0 4px' }}
            >
              {intervalLabel}
            </span>
            <span className="text-ui font-semibold leading-none" style={{ color: textColor }}>
              {noteToString(note)}
            </span>
            {!isCompact && (
              <span className="text-caption leading-none max-sm:hidden" style={{ color: dimColor }}>
                {funcLabel}
              </span>
            )}
          </m.button>
        );
      })}
    </div>
  );
}
