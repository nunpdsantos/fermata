/**
 * ReviewQueue — amber-themed card list showing modules due for spaced repetition review.
 * Displayed in LevelsOverview between Continue banner and level grid.
 */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import type { CurriculumProgress } from '../../core/types/curriculum';
import { LEVEL_METADATA } from '../../data/curriculumLoader';
import { getDueReviewModuleIds } from '../../services/spacedRepetition';
import { formatNextReview, getIntervalLabel } from '../../services/spacedRepetition';
import { Card } from '../ui/Card';
import { palette } from '../../design/tokens/palette';

const AMBER = palette.warning;
const MAX_SHOWN = 5;

interface ReviewQueueProps {
  progress: CurriculumProgress;
  onStartReview: (moduleId: string) => void;
}

/** Resolve a module ID like 'l1u2m3' to level metadata for display */
function getModuleInfo(moduleId: string) {
  // Extract level ID from module ID prefix (e.g., 'l1u2m3' → 'l1')
  const levelId = moduleId.slice(0, 2);
  const meta = LEVEL_METADATA.find((m) => m.id === levelId);
  return meta;
}

/** Parse a module ID like 'l1u2m3' into numeric parts for display */
function parseModuleId(moduleId: string): { level: number; unit: number; module: number } | null {
  const match = moduleId.match(/^l(\d+)u(\d+)m(\d+)$/);
  if (!match) return null;
  return { level: Number(match[1]), unit: Number(match[2]), module: Number(match[3]) };
}

export function ReviewQueue({ progress, onStartReview }: ReviewQueueProps) {
  const { t } = useTranslation();
  // Refresh every minute so reviews that come due while the app sits open
  // (e.g. across midnight) surface without a remount.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dueModuleIds = useMemo(
    () => getDueReviewModuleIds(progress, now),
    [progress, now],
  );

  // No schedules at all → user hasn't completed any modules with SRS
  const schedules = progress.reviewSchedules ?? {};
  const hasSchedules = Object.keys(schedules).length > 0;

  if (dueModuleIds.length === 0) {
    if (!hasSchedules) return null;

    // All caught up — show next review date
    const earliest = Math.min(...Object.values(schedules).map((s) => s.nextReviewAt));
    const relativeTime = formatNextReview({ nextReviewAt: earliest } as Parameters<typeof formatNextReview>[0], now);

    return (
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <Card
          variant="raised"
          accentColor={AMBER}
          accentEdge="all"
          accentStrength="subtle"
          padding="none"
          className="px-5 py-4 text-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="text-sm font-bold mb-0.5" style={{ color: AMBER }}>
            {t('review.allCaughtUp')}
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            {t('review.nextReview', { time: relativeTime })}
          </p>
        </Card>
      </m.div>
    );
  }

  const shown = dueModuleIds.slice(0, MAX_SHOWN);
  const remaining = dueModuleIds.length - MAX_SHOWN;

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: AMBER }}>
          {t('review.title')}
        </h3>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${AMBER}20`, color: AMBER }}
        >
          {dueModuleIds.length}
        </span>
      </div>

      <div className="space-y-2">
        {shown.map((moduleId) => {
          const schedule = (progress.reviewSchedules ?? {})[moduleId];
          const levelMeta = getModuleInfo(moduleId);
          const parsed = parseModuleId(moduleId);
          const reviewStatus = schedule ? formatNextReview(schedule, now) : '';
          const interval = schedule ? getIntervalLabel(schedule.intervalLevel) : '';
          const moduleLabel = parsed
            ? `${t('learn.level', { n: parsed.level })} · ${t('learn.unit', { n: parsed.unit })} · ${t('learn.module', { n: parsed.module })}`
            : moduleId;

          return (
            <Card
              key={moduleId}
              variant="interactive"
              accentColor={AMBER}
              accentEdge="all"
              accentStrength="subtle"
              tappable
              onClick={() => onStartReview(moduleId)}
              padding="none"
              className="px-4 py-3 transition-all duration-150 hover:scale-[1.01] group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ backgroundColor: `${AMBER}18`, color: AMBER }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                      {moduleLabel}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {levelMeta?.title ?? ''} &middot; {t('review.interval', { interval })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${AMBER}20`, color: AMBER }}
                  >
                    {reviewStatus}
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="group-hover:translate-x-0.5 transition-transform"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {remaining > 0 && (
        <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-dim)' }}>
          {t('review.moreItems', { count: remaining })}
        </p>
      )}
    </m.div>
  );
}
