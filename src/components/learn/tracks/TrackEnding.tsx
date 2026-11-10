import { useTranslation } from 'react-i18next';
import type { TrackId } from '../../../data/tracks';
import { TRACK_ENDINGS, type TrackEndingStep } from './trackEndings';
import { Button } from '../../ui/Button';
import { executeTheoryQuery } from '../../../utils/queryExecutor';
import { keepLessonInstrument } from '../../../services/lessonInstrument';

interface TrackEndingProps {
  track: TrackId;
  accent: string;
  /** Opens a level's page (LearnView's navigation). */
  onOpenLevel: (levelId: string) => void;
}

/**
 * The card a track's last lesson ends on (wave 2), where a lesson of the nine
 * levels has "Next lesson": a track never runs on into another unit.
 */
export function TrackEnding({ track, accent, onOpenLevel }: TrackEndingProps) {
  const { t } = useTranslation();
  const steps = TRACK_ENDINGS[track];
  if (!steps) return null;
  const run = (step: TrackEndingStep) => {
    if (step.kind === 'explore') {
      keepLessonInstrument();
      executeTheoryQuery(step.query);
    } else {
      onOpenLevel(step.levelId);
    }
  };
  return (
    <section
      className="mb-10 rounded-2xl px-4 py-4 flex flex-col gap-3"
      style={{ backgroundColor: 'var(--card)', border: `1.5px solid ${accent}` }}
      aria-labelledby="track-ending-title"
      data-testid="track-ending"
    >
      <div>
        <h2 id="track-ending-title" className="text-body font-semibold" style={{ color: 'var(--text)' }}>
          {t('tracks.end.title')}
        </h2>
        <p className="text-ui mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {t('tracks.end.line', { track: t(`tracks.${track}.title`) })}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 max-sm:flex-col">
        {steps.map((step, i) => (
          <Button
            key={step.label}
            variant={i === 0 ? 'primary' : 'secondary'}
            onClick={() => run(step)}
            className="max-sm:w-full"
          >
            {t(step.label)}
          </Button>
        ))}
      </div>
    </section>
  );
}
