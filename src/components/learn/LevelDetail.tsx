import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import type { CurriculumLevel, CurriculumProgress } from '../../core/types/curriculum';
import { findNextIncompleteModule, getLevelModuleCount, getLevelCompletedModuleCount } from '../../data/curriculumLoader';
import { LearnBreadcrumb } from './LearnBreadcrumb';
import { IconButton } from '../ui/Button';
import { ContinueBanner } from './ContinueBanner';
import { DifficultyBadge } from './DifficultyBadge';
import { ProgressBar } from './ProgressBar';
import { UnitCard } from './UnitCard';
import { accentText } from '../../design/tokens/learnColors';
import { UnlockLevelNotice } from './lesson/UnlockLevel';

interface LevelDetailProps {
  level: CurriculumLevel;
  progress: CurriculumProgress;
  isModuleCompleted: (moduleId: string) => boolean;
  getUnitCompletedModuleCount: (moduleIds: string[]) => number;
  onOpenUnit: (unitId: string) => void;
  /** Opens a module of this level (the Continue banner — audit W9-09). */
  onOpenModule: (moduleId: string, unitId: string) => void;
  onBack: () => void;
}

export function LevelDetail({
  level,
  progress,
  isModuleCompleted: _isModuleCompleted,
  getUnitCompletedModuleCount,
  onOpenUnit,
  onOpenModule,
  onBack,
}: LevelDetailProps) {
  const { t } = useTranslation();
  const accent = level.accentColor;
  const totalModules = getLevelModuleCount(level);
  const completedModules = getLevelCompletedModuleCount(level, progress.completedModules);
  const progressPercent = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  // Continue banner — scoped to this level
  const nextUp = useMemo(() => {
    const result = findNextIncompleteModule(progress, [level]);
    return result ?? undefined;
  }, [progress, level]);

  return (
    <div className="max-w-2xl mx-auto px-5 max-sm:px-3 py-6 max-sm:py-4 pb-24">
      {/* Breadcrumb */}
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
            { label: t('learn.level', { n: level.number }) },
          ]}
        />
      </div>

      {/* Level header */}
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: `${accent}20`, color: accentText(accent) }}
          >
            {level.number}
          </div>
          {level.comingSoon && (
            <span className="text-caption font-medium px-2 py-0.5 rounded-full" style={{ color: 'var(--text-dim)', backgroundColor: 'var(--card-hover)' }}>
              {t('status.comingSoon')}
            </span>
          )}
          <DifficultyBadge difficulty={level.difficulty} label={level.difficultyLabel} />
        </div>
        <h1 className="text-2xl font-bold learn-serif mb-1.5" style={{ color: 'var(--text)' }}>
          {level.title}
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
          {level.description}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={progressPercent} color={accent} />
          </div>
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-dim)' }}>
            {completedModules}/{totalModules}
          </span>
        </div>
      </m.div>

      {/* Locked: "Unlock anyway" (D-10) */}
      <UnlockLevelNotice level={level} progress={progress} />

      {/* Continue banner */}
      {nextUp && (
        <ContinueBanner
          module={nextUp.module}
          unit={nextUp.unit}
          level={nextUp.level}
          onClick={() => onOpenModule(nextUp.module.id, nextUp.unit.id)}
        />
      )}

      {/* Unit cards */}
      <div className="relative">
        {/* Vertical connecting line */}
        {level.units.length > 1 && (
          <div
            className="absolute left-[19px] max-sm:left-[15px] top-6 bottom-6 w-px"
            style={{ backgroundColor: `${accent}20` }}
          />
        )}

        <div className="space-y-4">
          {level.units.map((unit, i) => {
            const completed = getUnitCompletedModuleCount(unit.modules.map((m) => m.id));
            const isComplete = unit.modules.length > 0 && completed === unit.modules.length;
            return (
              <UnitCard
                key={unit.id}
                unit={unit}
                index={i}
                completedCount={completed}
                accentColor={accent}
                isComplete={isComplete}
                onClick={() => onOpenUnit(unit.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
