import { useTranslation } from 'react-i18next';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import { earReference } from './exerciseHelpers';
import { noteToString } from '../../../core/types/music';
import { translateScaleType } from '../../../i18n/content/musicTerms';
import type { ContentLanguage } from '../../../i18n/content/types';

/** The sentence that says what is played first (D-11), or null. */
export function useReferenceLine(exercise: ExerciseDefinition): string | null {
  const { t, i18n } = useTranslation();
  const cfg = exercise.config;
  if (cfg.type !== 'ear_training') return null;
  const ref = earReference(cfg);
  if (!ref) return null;
  if (ref.kind === 'pitch') return t(ref.pitches[0].natural === 'G' ? 'exercise.referenceNoteG' : 'exercise.referenceNote');
  const lang = (['pt', 'es'].includes(i18n.language?.slice(0, 2)) ? i18n.language.slice(0, 2) : 'en') as ContentLanguage;
  const key = `${noteToString(ref.key)} ${lang === 'en' ? 'major' : translateScaleType('major', lang)}`;
  return t(cfg.mode === 'melody' ? 'exercise.referenceKeyMelody' : 'exercise.referenceKeyChords', { key });
}
