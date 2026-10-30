/**
 * ReviewQueue — amber-themed card list showing modules due for spaced repetition review.
 * Displayed in LevelsOverview between Continue banner and level grid.
 */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { m } from 'framer-motion';
import type { CurriculumProgress } from '../../core/types/curriculum';
import { LEVEL_METADATA } from '../../data/curriculumLoader';
import {
  getDueReviewModuleIds,
  describeNextReview,
  getIntervalSpan,
  type NextReviewTime,
} from '../../services/spacedRepetition';
import { translateLevelMetadata } from '../../i18n/content/levelMetaResolver';
import type { ContentLanguage } from '../../i18n/content/types';
import { getModuleTitle } from '../../data/moduleIndexI18n';
import { useLocalizedModuleIndex } from '../../hooks/useLocalizedModuleIndex';
import { useAppStore } from '../../state/store';
import { Card } from '../ui/Card';
import { palette } from '../../design/tokens/palette';

// AMBER stays the tint for fills and card accents; text and icons use the
// theme-aware --warning-text (amber #FBBF24 as text read 1.3:1 on the cream
// day theme — audit W0-03).
const AMBER = palette.warning;
const AMBER_TEXT = 'var(--warning-text)';
const MAX_SHOWN = 5;

interface ReviewQueueProps {
  progress: CurriculumProgress;
  onStartReview: (moduleId: string) => void;
}

/** "in 4 days" / "daqui a 4 dias" / "dentro de 4 días", etc. (W6-17) */
function wordNextReview(time: NextReviewTime, t: TFunction): string {
  if (time.kind === 'dueNow') return t('review.when.dueNow');
  if (time.kind === 'dueSoon') return t('review.when.dueSoon');
  return t(`review.when.${time.unit}`, { count: time.count });
}

/** Parse a module ID like 'l1u2m3' into numeric parts for display */
function parseModuleId(moduleId: string): { level: number; unit: number; module: number } | null {
  const match = moduleId.match(/^l(\d+)u(\d+)m(\d+)$/);
  if (!match) return null;
  return { level: Number(match[1]), unit: Number(match[2]), module: Number(match[3]) };
}

export function ReviewQueue({ progress, onStartReview }: ReviewQueueProps) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language) as ContentLanguage;
  // Module titles in the app language (the PT/ES index is a lazy chunk; the
  // English title shows until it arrives).
  const localizedIndex = useLocalizedModuleIndex(language);
  const levelTitles = useMemo(
    () => new Map(translateLevelMetadata(LEVEL_METADATA, language).map((meta) => [meta.id, meta.title])),
    [language],
  );
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
    const relativeTime = wordNextReview(describeNextReview({ nextReviewAt: earliest }, now), t);

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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-1.5" style={{ color: AMBER_TEXT }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="text-sm font-bold mb-0.5" style={{ color: AMBER_TEXT }}>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: AMBER_TEXT }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: AMBER_TEXT }}>
          {t('review.title')}
        </h3>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${AMBER}20`, color: AMBER_TEXT }}
        >
          {dueModuleIds.length}
        </span>
      </div>

      <div className="space-y-2">
        {shown.map((moduleId) => {
          const schedule = (progress.reviewSchedules ?? {})[moduleId];
          const levelTitle = levelTitles.get(moduleId.slice(0, 2)) ?? '';
          const parsed = parseModuleId(moduleId);
          const next = schedule ? describeNextReview(schedule, now) : null;
          // Due rows are (by definition) due now; the chip says so.
          const reviewStatus = !next ? '' : next.kind === 'dueNow' ? t('review.dueNow') : wordNextReview(next, t);
          const span = schedule ? getIntervalSpan(schedule.intervalLevel) : null;
          const interval = span ? t(`review.span.${span.unit}`, { count: span.count }) : '';
          const position = parsed
            ? `${t('learn.level', { n: parsed.level })} · ${t('learn.unit', { n: parsed.unit })} · ${t('learn.module', { n: parsed.module })}`
            : moduleId;
          // The module's real name (W6-17); the level/unit/module position is
          // the fallback for an id the index does not know.
          const moduleTitle = (localizedIndex ? getModuleTitle(moduleId, language) : getModuleTitle(moduleId, 'en')) ?? position;

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
                    style={{ backgroundColor: `${AMBER}18`, color: AMBER_TEXT }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }} title={position}>
                      {moduleTitle}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {levelTitle} &middot; {t('review.interval', { interval })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${AMBER}20`, color: AMBER_TEXT }}
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
