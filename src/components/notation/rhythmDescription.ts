import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parseRhythm, type RhythmToken } from '../../core/utils/rhythm';
import type { RhythmPattern } from '../../core/types/exercise';

/** The text alternative: every value in words, bars separated. */
export function useRhythmDescription(pattern: RhythmPattern): string {
  const { t } = useTranslation();
  return useMemo(() => {
    const parsed = parseRhythm(pattern);
    const word = (tk: RhythmToken) => {
      let w = t(`lesson.rhythm_${tk.base}`);
      if (tk.dotted) w = t('lesson.rhythmDotted', { value: w });
      if (tk.rest) w = t('lesson.rhythmRest', { value: w });
      if (tk.triplet) w = t('lesson.rhythmTriplet', { value: w });
      if (tk.accent) w = t('lesson.rhythmAccent', { value: w });
      if (tk.tie) w = t('lesson.rhythmTied', { value: w });
      return w;
    };
    const values = parsed.bars.map((bar) => bar.map(word).join(', ')).join(' | ');
    return t('exercise.rhythmLabel', { time: pattern.time, values });
  }, [pattern, t]);
}
