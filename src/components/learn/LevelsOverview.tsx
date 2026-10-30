import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import type { CurriculumLevel, CurriculumModule, CurriculumProgress, CurriculumUnit } from '../../core/types/curriculum';
import type { ContentLanguage } from '../../i18n/content/types';
import {
  LEVEL_METADATA,
  computeLevelStateMeta,
  getLevelCompletedCountMeta,
  loadLevel,
} from '../../data/curriculumLoader';
import type { LevelMeta } from '../../data/curriculumLoader';
import { findNextModuleEntry } from '../../data/nextModule';
import type { ModuleIndexEntry } from '../../data/moduleIndex';
import { translateLevelMetadata } from '../../i18n/content/levelMetaResolver';
import { ContinueBanner } from './ContinueBanner';
import { ReviewQueue } from './ReviewQueue';
import { LevelCard } from './LevelCard';
import { ProgressBar } from './ProgressBar';
import { DEGREE_COLORS } from '../../design/tokens/colors';
import { useAppStore } from '../../state/store.ts';

type ResolvedNext =
  | { key: string; level: CurriculumLevel; unit: CurriculumUnit; module: CurriculumModule }
  | { key: string; failed: true };

/** Continue-banner content from the static index when the level can't load. */
function fallbackNextUp(entry: ModuleIndexEntry, meta: LevelMeta) {
  const module: CurriculumModule = {
    id: entry.id, unitId: entry.unitId, levelId: entry.level, title: entry.title, subtitle: entry.subtitle,
    objectives: [], concepts: [], tasks: [], prerequisites: [],
  };
  const unit: CurriculumUnit = {
    id: entry.unitId, levelId: entry.level, title: '', description: '', icon: '', modules: [module],
  };
  const level: CurriculumLevel = { ...meta, units: [unit] };
  return { module, unit, level };
}

interface LevelsOverviewProps {
  progress: CurriculumProgress;
  onOpenLevel: (levelId: string) => void;
  onOpenModule: (moduleId: string, unitId: string, levelId: string) => void;
  onStartReview?: (moduleId: string) => void;
}

export function LevelsOverview({
  progress,
  onOpenLevel,
  onOpenModule,
  onStartReview,
}: LevelsOverviewProps) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language) as ContentLanguage;

  const translatedMeta = useMemo(
    () => translateLevelMetadata(LEVEL_METADATA, language),
    [language],
  );

  // Continue banner (audit W9-10 / W9-19). WHICH module comes next is decided
  // from the static index — no download. Only that module's own level is
  // loaded, for its translated titles (was: all nine levels, and one failed
  // download made the banner vanish, unhandled). If the load fails (offline),
  // the banner is built from the static index instead.
  const nextEntry = useMemo(() => findNextModuleEntry(progress), [progress]);
  const nextKey = nextEntry ? `${language}:${nextEntry.id}` : null;
  const [resolved, setResolved] = useState<ResolvedNext | null>(null);
  useEffect(() => {
    if (!nextEntry || !nextKey) return;
    let cancelled = false;
    loadLevel(nextEntry.level, language)
      .then((level) => {
        if (cancelled) return;
        const unit = level?.units.find((u) => u.id === nextEntry.unitId);
        const module = unit?.modules.find((md) => md.id === nextEntry.id);
        setResolved(level && unit && module ? { key: nextKey, level, unit, module } : { key: nextKey, failed: true });
      })
      .catch(() => {
        if (!cancelled) setResolved({ key: nextKey, failed: true });
      });
    // A load for a previous language / module must never land on top.
    return () => { cancelled = true; };
  }, [nextEntry, nextKey, language]);

  const nextUp = useMemo(() => {
    if (!nextEntry || !resolved || resolved.key !== nextKey) return undefined;
    if ('failed' in resolved) {
      const meta = translatedMeta.find((l) => l.id === nextEntry.level);
      return meta ? fallbackNextUp(nextEntry, meta) : undefined;
    }
    return resolved;
  }, [nextEntry, nextKey, resolved, translatedMeta]);

  const totalModules = translatedMeta.reduce((s, l) => s + l.moduleCount, 0);
  const totalCompleted = progress.completedModules.length;

  // Split levels: main track (l1-l8) and parallel (l9)
  const mainLevels = translatedMeta.filter((l) => !l.parallel);
  const parallelLevels = translatedMeta.filter((l) => l.parallel);

  const getLevelState = useCallback(
    (meta: LevelMeta) => computeLevelStateMeta(meta, LEVEL_METADATA, progress.completedModules),
    [progress.completedModules],
  );

  const getCompletedCount = useCallback(
    (meta: LevelMeta) => getLevelCompletedCountMeta(meta.id, progress.completedModules),
    [progress.completedModules],
  );

  return (
    <div className="max-w-3xl mx-auto px-5 max-sm:px-3 py-6 max-sm:py-4 pb-24">
      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold learn-serif mb-1.5" style={{ color: 'var(--text)' }}>
          {t('learn.title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {t('learn.subtitle')}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <ProgressBar
              percent={totalModules > 0 ? (totalCompleted / totalModules) * 100 : 0}
              color={DEGREE_COLORS[1]}
              height={6}
            />
          </div>
          <span className="text-xs tabular-nums shrink-0" style={{ color: 'var(--text-dim)' }}>
            {totalCompleted}/{totalModules}
          </span>
        </div>

      </m.div>

      {/* Welcome banner — shown only when zero progress */}
      {totalCompleted === 0 && !nextUp && (
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6 rounded-xl px-6 py-6 text-center"
          style={{
            backgroundColor: `color-mix(in srgb, ${DEGREE_COLORS[1]} 7%, transparent)`,
            border: `1px solid color-mix(in srgb, ${DEGREE_COLORS[1]} 12%, transparent)`,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={DEGREE_COLORS[1]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>
            {t('learn.emptyTitle')}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
            {t('learn.emptySubtitle')}
          </p>
          <button
            onClick={() => onOpenLevel('l1')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-[1.03]"
            style={{
              backgroundColor: `color-mix(in srgb, ${DEGREE_COLORS[1]} 12%, transparent)`,
              color: DEGREE_COLORS[1],
              border: `1px solid color-mix(in srgb, ${DEGREE_COLORS[1]} 19%, transparent)`,
            }}
          >
            {t('learn.startLevel1')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </m.div>
      )}

      {/* Continue banner */}
      {nextUp && (
        <ContinueBanner
          module={nextUp.module}
          unit={nextUp.unit}
          level={nextUp.level}
          onClick={() => onOpenModule(nextUp.module.id, nextUp.unit.id, nextUp.level.id)}
        />
      )}

      {/* Review Queue */}
      {onStartReview && (
        <ReviewQueue progress={progress} onStartReview={onStartReview} />
      )}

      {/* Level cards grid */}
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 mb-8">
        {mainLevels.map((level, i) => (
          <LevelCard
            key={level.id}
            level={level}
            state={getLevelState(level)}
            completedModuleCount={getCompletedCount(level)}
            index={i}
            onClick={() => onOpenLevel(level.id)}
          />
        ))}
      </div>

      {/* Parallel track divider */}
      {parallelLevels.length > 0 && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--card-hover)' }} />
            <span className="type-section">
              {t('learn.parallelTrack')}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--card-hover)' }} />
          </m.div>

          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
            {parallelLevels.map((level, i) => (
              <LevelCard
                key={level.id}
                level={level}
                state={getLevelState(level)}
                completedModuleCount={getCompletedCount(level)}
                index={mainLevels.length + i}
                onClick={() => onOpenLevel(level.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
