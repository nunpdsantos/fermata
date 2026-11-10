import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { CurriculumLevel, CurriculumUnit } from '../../../core/types/curriculum';
import { LearnBreadcrumb } from '../LearnBreadcrumb';
import { IconButton } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ModuleRow } from '../ModuleRow';
import { ProgressBar } from '../ProgressBar';
import { accentText } from '../../../design/tokens/learnColors';

interface TrackDetailProps {
  /** The track's unit (`unit.track` set), from its level's data. */
  unit: CurriculumUnit;
  level: CurriculumLevel;
  completedModules: readonly string[];
  onOpenModule: (moduleId: string) => void;
  onBack: () => void;
}

/**
 * A starting track's own page (wave 2): Learn / <track>, its title and
 * description, "3 of 5 lessons", and its lessons in order with the next one
 * marked. A track is not part of its level, so the breadcrumb names no
 * level. Its lessons have no prerequisites: none is shown locked.
 */
export function TrackDetail({ unit, level, completedModules, onOpenModule, onBack }: TrackDetailProps) {
  const { t } = useTranslation();
  const accent = level.accentColor;
  const done = new Set(completedModules);
  const count = unit.modules.filter((mod) => done.has(mod.id)).length;
  const next = unit.modules.find((mod) => !done.has(mod.id))?.id ?? null;
  const total = unit.modules.length;
  const trackId = unit.track ?? 'sound';

  return (
    <div className="max-w-2xl mx-auto px-5 max-sm:px-3 py-6 max-sm:py-4 pb-24" data-testid={`track-page-${trackId}`}>
      <div className="mb-6 flex items-center gap-2">
        <IconButton
          onClick={onBack}
          aria-label={t('common.back')}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          }
        />
        <LearnBreadcrumb
          accentColor={accent}
          segments={[
            { label: t('nav.learn'), onClick: onBack },
            { label: unit.title },
          ]}
        />
      </div>

      <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
        <span className="type-label" style={{ color: accentText(accent) }}>
          {t('tracks.eyebrow', { count: total })}
        </span>
        <h1 className="text-2xl font-bold learn-serif mt-1 mb-1.5" style={{ color: 'var(--text)' }}>
          {unit.title}
        </h1>
        <p className="text-ui mb-4" style={{ color: 'var(--text-muted)' }}>
          {unit.description}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={total > 0 ? (count / total) * 100 : 0} color={accent} />
          </div>
          <span className="text-ui tabular-nums" style={{ color: 'var(--text-muted)' }} data-testid="track-progress">
            {t('tracks.progress', { done: count, total })}
          </span>
        </div>
      </m.div>

      <ol className="space-y-1" aria-label={t('tracks.lessonsLabel')}>
        {unit.modules.map((mod, i) => (
          <li key={mod.id} data-next={mod.id === next || undefined} aria-current={mod.id === next ? 'step' : undefined}>
            <ModuleRow
              module={mod}
              index={i}
              isCompleted={done.has(mod.id)}
              isLocked={false}
              accentColor={accent}
              onClick={() => onOpenModule(mod.id)}
              badge={mod.id === next ? <Badge className="shrink-0" accentColor={accent}>{t('tracks.next')}</Badge> : undefined}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
