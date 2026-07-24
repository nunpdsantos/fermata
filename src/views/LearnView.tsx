import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, m } from 'framer-motion';
import type { CurriculumLevel } from '../core/types/curriculum';
import type { ExerciseDefinition } from '../core/types/exercise';
import type { ContentLanguage } from '../i18n/content/types';
import { loadLevel, getLevelModuleCount } from '../data/curriculumLoader';
import { loadExercises } from '../data/exerciseLoader';
import { useAppStore } from '../state/store.ts';
import { useLearnProgress } from '../hooks/useLearnProgress';
import { toast } from '../state/toastStore';
import { LevelsOverview } from '../components/learn/LevelsOverview';
import { LevelDetail } from '../components/learn/LevelDetail';
import { UnitDetail } from '../components/learn/UnitDetail';
import { ModuleView } from '../components/learn/ModuleView';
import { LevelAchievement } from '../components/learn/LevelAchievement';
import { SPRING_NAV } from '../design/tokens/motion';

// ─── Screen state machine ───────────────────────────────────────────────────

type LearnScreen =
  | { type: 'levels' }
  | { type: 'level'; levelId: string }
  | { type: 'unit'; levelId: string; unitId: string }
  | { type: 'module'; levelId: string; unitId: string; moduleId: string }
  | { type: 'review'; levelId: string; unitId: string; moduleId: string };

interface LevelCelebration {
  levelNumber: number;
  accentColor: string;
  moduleCount: number;
}

export function LearnView() {
  const { t } = useTranslation();
  const [screen, setScreen] = useState<LearnScreen>({ type: 'levels' });
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [levelCelebration, setLevelCelebration] = useState<LevelCelebration | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    progress,
    toggleTask,
    completeModule,
    isModuleCompleted,
    isTaskCompleted,
    getModuleCompletedTaskCount,
    getUnitCompletedModuleCount,
    getLevelCompletedModuleCount,
    recordExerciseResult,
    markExercisesPassed,
    isModuleExercisesPassed,
    recordReviewResult,
  } = useLearnProgress();

  // Navigation helpers
  const navigate = useCallback((next: LearnScreen, dir: 'forward' | 'back') => {
    setDirection(dir);
    setScreen(next);
  }, []);

  const goToLevels = useCallback(() => navigate({ type: 'levels' }, 'back'), [navigate]);
  const goToLevel = useCallback((levelId: string) => navigate({ type: 'level', levelId }, 'forward'), [navigate]);
  const goToLevelBack = useCallback((levelId: string) => navigate({ type: 'level', levelId }, 'back'), [navigate]);
  const goToUnit = useCallback((levelId: string, unitId: string) => navigate({ type: 'unit', levelId, unitId }, 'forward'), [navigate]);
  const goToUnitBack = useCallback((levelId: string, unitId: string) => navigate({ type: 'unit', levelId, unitId }, 'back'), [navigate]);
  const goToModule = useCallback((levelId: string, unitId: string, moduleId: string) => navigate({ type: 'module', levelId, unitId, moduleId }, 'forward'), [navigate]);
  const goToReview = useCallback((levelId: string, unitId: string, moduleId: string) => navigate({ type: 'review', levelId, unitId, moduleId }, 'forward'), [navigate]);

  // Consume deep-link targets set by Explore or QuickSearch so the user lands
  // directly on a module view instead of the levels overview.
  const pendingLearnTarget = useAppStore((s) => s.pendingLearnTarget);
  const setPendingLearnTarget = useAppStore((s) => s.setPendingLearnTarget);
  useEffect(() => {
    if (!pendingLearnTarget) return;
    const { levelId, unitId, moduleId } = pendingLearnTarget;
    setPendingLearnTarget(null);
    queueMicrotask(() => navigate({ type: 'module', levelId, unitId, moduleId }, 'forward'));
  }, [pendingLearnTarget, setPendingLearnTarget, navigate]);

  // Scroll to top on screen change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  // ─── Async level + exercise loading ─────────────────────────────────────────
  const [loadedLevel, setLoadedLevel] = useState<CurriculumLevel | null>(null);
  const [levelLoadFailed, setLevelLoadFailed] = useState(false);
  const [exercisesByModule, setExercisesByModule] = useState<Record<string, ExerciseDefinition[]>>({});
  // Failed and "not yet loaded" must stay distinct states: a failed exercise
  // chunk must block module completion instead of reading as "no exercises".
  const [exercisesState, setExercisesState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [reloadNonce, setReloadNonce] = useState(0);
  const retryLoads = useCallback(() => setReloadNonce((n) => n + 1), []);
  const levelCacheRef = useRef<Map<string, CurriculumLevel>>(new Map());
  const exerciseCacheRef = useRef<Map<string, Record<string, ExerciseDefinition[]>>>(new Map());

  const activeLevelId = screen.type === 'levels' ? null : screen.levelId;
  const language = useAppStore((s) => s.language) as ContentLanguage;

  useEffect(() => {
    if (!activeLevelId) {
      queueMicrotask(() => {
        setLoadedLevel(null);
        setLevelLoadFailed(false);
        setExercisesByModule({});
        setExercisesState('loading');
      });
      return;
    }

    const cacheKey = `${language}:${activeLevelId}`;
    queueMicrotask(() => setLevelLoadFailed(false));

    const cached = levelCacheRef.current.get(cacheKey);
    if (cached) {
      setLoadedLevel(cached);
    } else {
      setLoadedLevel(null);
    }

    // Load exercises (may be empty for levels without authored exercises)
    const cachedEx = exerciseCacheRef.current.get(cacheKey);
    if (cachedEx) {
      setExercisesByModule(cachedEx);
      setExercisesState('ready');
    } else {
      setExercisesByModule({});
      setExercisesState('loading');
    }

    let cancelled = false;

    // Load level data
    if (!cached) {
      loadLevel(activeLevelId, language)
        .then((level) => {
          if (!cancelled && level) {
            levelCacheRef.current.set(cacheKey, level);
            setLoadedLevel(level);
          }
        })
        .catch(() => {
          if (!cancelled) setLevelLoadFailed(true);
        });
    }

    // Load exercise data
    if (!cachedEx) {
      loadExercises(activeLevelId, language)
        .then((exercises) => {
          if (!cancelled) {
            exerciseCacheRef.current.set(cacheKey, exercises);
            setExercisesByModule(exercises);
            setExercisesState('ready');
          }
        })
        .catch(() => {
          if (!cancelled) setExercisesState('error');
        });
    }

    return () => { cancelled = true; };
  }, [activeLevelId, language, reloadNonce]);

  const xOffset = direction === 'forward' ? 40 : -40;

  const loadingSpinner = levelLoadFailed ? (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('error.viewError')}</p>
      <button
        onClick={retryLoads}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border"
        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
      >
        {t('common.tryAgain')}
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-center py-24">
      <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text-muted)' }} />
    </div>
  );

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto" role="region" aria-label={t('learn.region')}>
      <AnimatePresence mode="wait" initial={false}>
        {screen.type === 'levels' && (
          <m.div
            key="levels"
            initial={{ opacity: 0, x: -xOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: xOffset }}
            transition={SPRING_NAV}
          >
            <LevelsOverview
              progress={progress}
              onOpenLevel={goToLevel}
              onOpenModule={(moduleId, unitId, levelId) => goToModule(levelId, unitId, moduleId)}
              onStartReview={(moduleId) => {
                // Resolve levelId/unitId from module ID prefix
                const levelId = moduleId.slice(0, 2);
                // Extract unit number from pattern l{n}u{n}m{n}
                const unitMatch = moduleId.match(/^(l\d+)(u\d+)/);
                const unitId = unitMatch ? unitMatch[1] + unitMatch[2] : '';
                goToReview(levelId, unitId, moduleId);
              }}
            />
          </m.div>
        )}

        {screen.type === 'level' && (
          <m.div
            key={`level-${screen.levelId}`}
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -xOffset }}
            transition={SPRING_NAV}
          >
            {!loadedLevel ? loadingSpinner : (
              <LevelDetail
                level={loadedLevel}
                progress={progress}
                isModuleCompleted={isModuleCompleted}
                getUnitCompletedModuleCount={getUnitCompletedModuleCount}
                onOpenUnit={(unitId) => goToUnit(screen.levelId, unitId)}
                onBack={goToLevels}
              />
            )}
          </m.div>
        )}

        {screen.type === 'unit' && (
          <m.div
            key={`unit-${screen.unitId}`}
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -xOffset }}
            transition={SPRING_NAV}
          >
            {!loadedLevel ? loadingSpinner : (() => {
              const unitIndex = loadedLevel.units.findIndex((u) => u.id === screen.unitId);
              const unit = loadedLevel.units[unitIndex];
              if (!unit) return null;
              return (
                <UnitDetail
                  unit={unit}
                  unitIndex={unitIndex}
                  level={loadedLevel}
                  progress={progress}
                  isModuleCompleted={isModuleCompleted}
                  onOpenModule={(moduleId) => goToModule(screen.levelId, screen.unitId, moduleId)}
                  onBack={() => goToLevelBack(screen.levelId)}
                  onBackToLevels={goToLevels}
                />
              );
            })()}
          </m.div>
        )}

        {screen.type === 'module' && (
          <m.div
            key={`module-${screen.moduleId}`}
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -xOffset }}
            transition={SPRING_NAV}
          >
            {!loadedLevel ? loadingSpinner : (() => {
              const unit = loadedLevel.units.find((u) => u.id === screen.unitId);
              if (!unit) return null;
              const moduleIndex = unit.modules.findIndex((m) => m.id === screen.moduleId);
              const mod = unit.modules[moduleIndex];
              if (!mod) return null;
              const unitIndex = loadedLevel.units.indexOf(unit);

              const modExercises = exercisesByModule[mod.id] ?? [];

              return (
                <ModuleView
                  module={mod}
                  unit={unit}
                  level={loadedLevel}
                  unitIndex={unitIndex}
                  moduleIndex={moduleIndex}
                  isModuleCompleted={isModuleCompleted(mod.id)}
                  isTaskCompleted={isTaskCompleted}
                  completedTaskCount={getModuleCompletedTaskCount(mod.id)}
                  exercises={modExercises}
                  exercisesState={exercisesState}
                  onRetryExercises={retryLoads}
                  exercisesPassed={isModuleExercisesPassed(mod.id, modExercises.length)}
                  levelCompletedModuleCount={getLevelCompletedModuleCount(loadedLevel)}
                  onToggleTask={toggleTask}
                  onCompleteModule={completeModule}
                  onRecordExerciseResult={(exerciseId, score) => recordExerciseResult(mod.id, exerciseId, score)}
                  onExercisesComplete={(passed) => { if (passed) markExercisesPassed(mod.id); }}
                  onBack={() => goToUnitBack(screen.levelId, screen.unitId)}
                  onBackToLevels={goToLevels}
                  onNavigateModule={(moduleId) => goToModule(screen.levelId, screen.unitId, moduleId)}
                  onLevelComplete={() => {
                    setLevelCelebration({
                      levelNumber: loadedLevel.number,
                      accentColor: loadedLevel.accentColor,
                      moduleCount: getLevelModuleCount(loadedLevel),
                    });
                  }}
                />
              );
            })()}
          </m.div>
        )}
        {screen.type === 'review' && (
          <m.div
            key={`review-${screen.moduleId}`}
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -xOffset }}
            transition={SPRING_NAV}
          >
            {!loadedLevel ? loadingSpinner : (() => {
              const unit = loadedLevel.units.find((u) => u.id === screen.unitId);
              if (!unit) return null;
              const moduleIndex = unit.modules.findIndex((m) => m.id === screen.moduleId);
              const mod = unit.modules[moduleIndex];
              if (!mod) return null;
              const unitIndex = loadedLevel.units.indexOf(unit);

              const modExercises = exercisesByModule[mod.id] ?? [];

              return (
                <ModuleView
                  module={mod}
                  unit={unit}
                  level={loadedLevel}
                  unitIndex={unitIndex}
                  moduleIndex={moduleIndex}
                  isModuleCompleted={isModuleCompleted(mod.id)}
                  isTaskCompleted={isTaskCompleted}
                  completedTaskCount={getModuleCompletedTaskCount(mod.id)}
                  exercises={modExercises}
                  exercisesState={exercisesState}
                  onRetryExercises={retryLoads}
                  exercisesPassed={false}
                  isReviewMode
                  levelCompletedModuleCount={getLevelCompletedModuleCount(loadedLevel)}
                  onToggleTask={toggleTask}
                  onCompleteModule={completeModule}
                  onRecordExerciseResult={(exerciseId, score) => recordExerciseResult(mod.id, exerciseId, score)}
                  onExercisesComplete={(passed) => {
                    recordReviewResult(mod.id, passed);
                    toast(
                      passed
                        ? t('toast.reviewPassed', { title: mod.title })
                        : t('toast.reviewFailed', { title: mod.title }),
                      passed ? 'success' : 'info',
                    );
                  }}
                  onBack={() => goToLevels()}
                  onBackToLevels={goToLevels}
                  onNavigateModule={(moduleId) => goToModule(screen.levelId, screen.unitId, moduleId)}
                />
              );
            })()}
          </m.div>
        )}
      </AnimatePresence>

      {levelCelebration && (
        <LevelAchievement
          levelNumber={levelCelebration.levelNumber}
          accentColor={levelCelebration.accentColor}
          moduleCount={levelCelebration.moduleCount}
          onDismiss={() => {
            setLevelCelebration(null);
            goToLevels();
          }}
        />
      )}
    </div>
  );
}
