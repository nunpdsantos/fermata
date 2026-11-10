import { useTranslation } from 'react-i18next';
import type { TrackInfo } from '../../../data/tracks';
import { Card } from '../../ui/Card';
import { ProgressBar } from '../ProgressBar';
import { LEVEL_ACCENTS, accentText } from '../../../design/tokens/learnColors';
import { trackProgress } from './trackOverview';

interface TrackCardProps {
  track: TrackInfo;
  completedModules: readonly string[];
  onOpen: (track: TrackInfo) => void;
}

/**
 * One starting track on Learn's overview (wave 2): its title, one line,
 * "3 of 5 lessons" and a bar; opens the track's own page. Static data only.
 * No entrance animation: a card that fades in would move nothing, but the
 * overview's own header does that already and the sweep measures at rest.
 */
export function TrackCard({ track, completedModules, onOpen }: TrackCardProps) {
  const { t } = useTranslation();
  const accent = LEVEL_ACCENTS[track.levelId];
  const { done, total } = trackProgress(track, completedModules);
  return (
    <Card
      variant="interactive"
      accentColor={accent}
      accentEdge="all"
      accentStrength="strong"
      tappable
      padding="none"
      onClick={() => onOpen(track)}
      className="w-full text-left px-4 py-3.5 transition-all duration-200 group hover:scale-[1.005]"
      data-testid={`track-card-${track.id}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-body font-semibold learn-serif" style={{ color: 'var(--text)' }}>
            {t(`tracks.${track.id}.title`)}
          </h3>
          <p className="text-ui mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t(`tracks.${track.id}.line`)}
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar percent={total > 0 ? (done / total) * 100 : 0} color={accent} height={4} />
            </div>
            <span className="text-caption tabular-nums shrink-0" style={{ color: 'var(--text-muted)' }} data-testid="track-progress">
              {t('tracks.progress', { done, total })}
            </span>
          </div>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accentText(accent)}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 group-hover:translate-x-0.5 transition-transform"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Card>
  );
}

interface TrackSectionProps {
  heading: string;
  tracks: TrackInfo[];
  completedModules: readonly string[];
  onOpen: (track: TrackInfo) => void;
  testId: string;
  className?: string;
}

/** A heading ("Start here" / "Other ways in") and its track cards. */
export function TrackSection({ heading, tracks, completedModules, onOpen, testId, className = '' }: TrackSectionProps) {
  if (tracks.length === 0) return null;
  const id = `${testId}-heading`;
  return (
    <section className={className} aria-labelledby={id} data-testid={testId}>
      <h2 id={id} className="type-section mb-3">{heading}</h2>
      <div className="grid gap-3">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} completedModules={completedModules} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
