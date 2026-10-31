import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { noteToString } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { SCALE_FORMULAS, getScaleDegreeFunctionKey } from '../../core/constants/scales.ts';
import { scaleDegrees, formatDegree, degreeColorSlot } from '../../core/utils/degreeSpelling.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { DEGREE_COLORS } from '../../design/tokens/colors.ts';
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
    <div className="flex items-stretch gap-1.5 max-sm:gap-0.5 max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-proximity" role="group" aria-label="Scale degrees" style={{ boxShadow: 'var(--shadow-sm)' }}>
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
        const color = degreeColorsOn
          ? (DEGREE_COLORS[colorKey] ?? 'var(--text-muted)')
          : 'var(--accent)';
        const intervalLabel = formatDegree(degrees[i]);
        const funcKey = noteCount === 7
          ? getScaleDegreeFunctionKey(i, formula[i] ?? 0)
          : null;
        const funcLabel = funcKey ? t(funcKey) : '';

        return (
          <m.button
            key={`${noteToString(note)}-${i}`}
            {...(isInteractive
              ? { onClick: () => setSelectedChord(isSelected ? null : dc.chord) }
              : { disabled: true })}
            className="flex flex-col items-center gap-1 py-2.5 max-sm:py-2.5 rounded-xl flex-1 min-w-0 max-sm:min-w-[36px] max-sm:snap-start group transition-colors"
            style={{
              padding: isCompact ? '0.5rem 0.25rem' : undefined,
              paddingLeft: isCompact ? '0.375rem' : undefined,
              paddingRight: isCompact ? '0.375rem' : undefined,
              backgroundColor: isSelected ? `${color}18` : 'transparent',
              border: isSelected ? `1px solid ${color}40` : '1px solid transparent',
              opacity: isInteractive ? undefined : 0.5,
              cursor: isInteractive ? undefined : 'default',
            }}
            whileTap={{ scale: 0.94 }}
            animate={isSelected ? { scale: 1.04 } : { scale: 1 }}
            transition={SPRING_SNAPPY}
            title={funcLabel}
            {...(isInteractive ? { 'aria-pressed': isSelected } : {})}
            aria-label={`Degree ${degree}, ${intervalLabel}, ${noteToString(note)}`}
          >
            <span
              className="text-[9px] font-bold leading-none rounded-full"
              style={{ color: 'var(--text-dim)', fontSize: isCompact ? 8 : undefined }}
              aria-hidden="true"
            >
              {degree}
            </span>
            <span
              className="text-sm font-bold leading-none"
              style={{ color, fontSize: isCompact ? 11 : undefined }}
            >
              {intervalLabel}
            </span>
            <span className="text-xs font-medium leading-none"
              style={{ color: 'var(--text)', fontSize: isCompact ? 10 : undefined }}
            >
              {noteToString(note)}
            </span>
            {!isCompact && (
              <span
                className="text-[9px] leading-none transition-colors max-sm:hidden"
                style={{ color: isSelected ? 'var(--text-muted)' : 'var(--text-dim)' }}
              >
                {funcLabel}
              </span>
            )}
          </m.button>
        );
      })}
    </div>
  );
}
