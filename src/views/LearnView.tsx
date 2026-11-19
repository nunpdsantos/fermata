import { useLearnScrollInsets } from '../components/learn/learnScroll';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import type { CurriculumLevel, CurriculumUnit } from '../core/types/curriculum';
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
import { ScreenFrame } from '../components/learn/ScreenFrame';
import { MilestoneSheet } from '../components/learn/lesson/MilestoneSheet';
import { TrackDetail } from '../components/learn/tracks/TrackDetail';
import { useLearnSessionStore, restorableScreen, putCheckAway, type SavedCheck } from '../state/learnSessionStore';
import type { LearnDeepLink } from '../state/storeTypes';
import { backTo, goTo, notePlace, placeToOpen, useBackLayer, useShowPlace } from '../state/appHistory';
import { learnPlace, learnScreenOf, lessonAt, type LearnScreen } from './learnPlaces';

// ─── Screen state machine ───────────────────────────────────────────────────

/** A lesson reopened by Back / Forward opens at the section last read in it (the saved one). */
function withSavedSection(s: LearnScreen): LearnScreen {
  const saved = useLearnSessionStore.getState().screen;
  return s.type === 'module' && saved?.type === 'module' && saved.moduleId === s.moduleId ? { ...s, section: saved.section } : s;
}

/**
 * Where Learn opens: the screen this tab's history entry names (a reload, or
 * Back / Forward into Learn — state/appHistory.ts); a deep link's lesson; a
 * lesson or review the learner was in (saved by learnSessionStore, fresh) —
 * so a reload or a trip to another tab loses nothing — else the levels overview.
 */
function initialScreen(target: LearnDeepLink | null): LearnScreen {
  const place = placeToOpen('learn');
  const kept = place === undefined ? null : learnScreenOf(place);
  if (kept) return withSavedSection(kept);
  // A deep link (opened by its effect below as well): no other screen first, which would be written in its entry.
  if (target) return { type: 'module', ...(lessonAt(target.moduleId) ?? target), run: false };
  return tabScreen();
}

/** What the Learn tab opens: the lesson or review the learner was in (saved, fresh), else the overview. */
function tabScreen(): LearnScreen {
  const saved = restorableScreen();
  if (!saved) return { type: 'levels' };
  // (A lesson saved with a unit it is not in — the live release's "Next lesson" — is refused by the guard: the overview.)
  const { type, levelId, unitId, moduleId, section } = saved;
  return type === 'review' ? { type, levelId, unitId, moduleId } : { type, levelId, unitId, moduleId, section };
}

/** The saved run is on screen here: its lesson with its check open (or about to reopen by itself), or its review. */
function showsRun(s: LearnScreen, c: SavedCheck): boolean {
  if (s.type === 'review') return c.kind === 'review' && c.moduleId === s.moduleId;
  return s.type === 'module' && s.run !== false && c.kind !== 'review' && c.moduleId === s.moduleId;
}

interface LevelCelebration {
  levelNumber: number;
  accentColor: string;
  moduleCount: number;
}

export function LearnView() {
  const { t } = useTranslation();
  const [screen, setScreen] = useState<LearnScreen>(() => initialScreen(useAppStore.getState().pendingLearnTarget));
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [levelCelebration, setLevelCelebration] = useState<LevelCelebration | null>(null);
  // A unit's milestone (D-23), then — if the level is done too — the level celebration.
  const [milestone, setMilestone] = useState<{ unit: CurriculumUnit; accent: string; then: LevelCelebration | null } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useLearnScrollInsets(scrollRef);

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

  // Navigation helpers. Going forward is a screen of its own in the browser's
  // history; the app's own ways back (← arrows, breadcrumbs) are Back to that
  // screen's earlier entry when this tab has one, else they rewrite the entry
  // (state/appHistory.ts `backTo`, audit P3).
  const navigate = useCallback((next: LearnScreen, dir: 'forward' | 'back') => {
    if (dir === 'forward') goTo('learn', learnPlace(next));
    else backTo('learn', learnPlace(next));
    setDirection(dir);
    // The deep link a mount already opened: the same screen, kept as it is.
    setScreen((now) => (now.type === 'module' && next.type === 'module' && now.moduleId === next.moduleId && now.run === next.run ? now : next));
  }, []);
  // Back / Forward, and the Learn tab tapped while Learn shows (P10's class): the screen the entry names.
  useShowPlace('learn', (place, dir) => {
    // An entry with no screen named: what the tab opens.
    const next = place === undefined ? tabScreen() : learnScreenOf(place);
    if (!next || learnPlace(next) === learnPlace(screen)) return;
    setDirection(dir < 0 ? 'back' : 'forward');
    setScreen(withSavedSection(next));
  });
  // A run under way that is no longer the screen shown (Back to its lesson's
  // card, or Learn moving on) is put away: kept, and no longer work in
  // progress (the seat's ruling, second audit round). Learn hidden behind
  // another view leaves it as it is: still Learn's current screen.
  const savedCheck = useLearnSessionStore((s) => s.check);
  useEffect(() => {
    if (savedCheck && !savedCheck.finished && !savedCheck.away && !showsRun(screen, savedCheck)) putCheckAway();
  }, [screen, savedCheck]);
  // The entry names the screen shown (a lesson's check opening or closing included).
  useEffect(() => {
    notePlace('learn', learnPlace(screen));
  }, [screen]);

  const goToLevels = useCallback(() => navigate({ type: 'levels' }, 'back'), [navigate]);
  const goToLevel = useCallback((levelId: string) => navigate({ type: 'level', levelId }, 'forward'), [navigate]);
  const goToLevelBack = useCallback((levelId: string) => navigate({ type: 'level', levelId }, 'back'), [navigate]);
  const goToUnit = useCallback((levelId: string, unitId: string) => navigate({ type: 'unit', levelId, unitId }, 'forward'), [navigate]);
  const goToUnitBack = useCallback((levelId: string, unitId: string) => navigate({ type: 'unit', levelId, unitId }, 'back'), [navigate]);
  // A lesson the learner opens shows the lesson: a check of it kept by Back waits on its card
  // (only a return — a reload, the tab, Back / Forward — reopens a check by itself).
  // Its level and unit are the lesson's own, whoever asks (`lessonAt`; review 2, item 1).
  const goToModule = useCallback((moduleId: string, section?: string) => {
    const at = lessonAt(moduleId);
    if (at) navigate({ type: 'module', ...at, section, run: false }, 'forward');
  }, [navigate]);
  const goToReview = useCallback((moduleId: string) => {
    const at = lessonAt(moduleId);
    if (at) navigate({ type: 'review', ...at }, 'forward');
  }, [navigate]);
  // Back to another lesson's kept run, from the choice a new check here would have let it go (A2).
  const openKept = useCallback((check: SavedCheck) => {
    const at = lessonAt(check.moduleId);
    if (!at) return;
    navigate(check.kind === 'review' ? { type: 'review', ...at } : { type: 'module', ...at, run: true }, 'forward');
  }, [navigate]);
  // The level's celebration covers the screen. A tap on it goes on to the
  // overview, as before; the browser's Back closes it and moves nowhere else,
  // as it does every layer (audit P3, review A9: going on from inside a Back
  // wrote over the wrong entry).
  const dismissCelebration = useCallback(() => {
    setLevelCelebration(null);
    goToLevels();
  }, [goToLevels]);
  useBackLayer(levelCelebration !== null, () => setLevelCelebration(null));

  // Consume deep-link targets set by Explore or QuickSearch so the user lands
  // directly on a module view instead of the levels overview.
  const pendingLearnTarget = useAppStore((s) => s.pendingLearnTarget);
  const setPendingLearnTarget = useAppStore((s) => s.setPendingLearnTarget);
  useEffect(() => {
    if (!pendingLearnTarget) return;
    const at = lessonAt(pendingLearnTarget.moduleId) ?? pendingLearnTarget;
    setPendingLearnTarget(null);
    queueMicrotask(() => navigate({ type: 'module', ...at, run: false }, 'forward'));
  }, [pendingLearnTarget, setPendingLearnTarget, navigate]);

  // Scroll to top on screen change (a lesson opened at a section scrolls
  // itself, and so does a lesson's check opening or closing in it).
  const shownRef = useRef(screen);
  useEffect(() => {
    const before = shownRef.current;
    shownRef.current = screen;
    if (screen.type === 'module' && screen.section) return;
    if (before !== screen && before.type === 'module' && screen.type === 'module' && before.moduleId === screen.moduleId) return;
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  // Remember the open lesson / review, so a reload comes back to it. A check
  // under way is NOT dropped when its lesson is left (audit P3, the owner's
  // ruling: Back never loses a check): it stays saved, and its lesson offers
  // it again, until ✕ Exit ends it or another check takes its place (one slot).
  const saveScreen = useLearnSessionStore((s) => s.setScreen);
  useEffect(() => {
    if (screen.type === 'module' || screen.type === 'review') {
      const prev = useLearnSessionStore.getState().screen;
      const same = prev && prev.moduleId === screen.moduleId && prev.type === screen.type;
      saveScreen({
        type: screen.type,
        levelId: screen.levelId,
        unitId: screen.unitId,
        moduleId: screen.moduleId,
        section: screen.type === 'module' ? (screen.section ?? (same ? prev.section : null)) : null,
        at: Date.now(),
      });
    } else {
      saveScreen(null);
    }
  }, [screen, saveScreen]);

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
        className="inline-flex items-center justify-center min-h-(--tap) px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border"
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
    <div ref={scrollRef} className="learn-scroll flex-1 min-h-0 overflow-y-auto" role="region" aria-label={t('learn.region')} data-learn-scroll="">
      <AnimatePresence mode="wait" initial={false}>
        {screen.type === 'levels' && (
          <ScreenFrame key="levels" xOffset={xOffset} enterFrom="left">
            <LevelsOverview
              progress={progress}
              onOpenLevel={goToLevel}
              onOpenModule={(moduleId) => goToModule(moduleId)}
              onOpenTrack={(track) => goToUnit(track.levelId, track.unitId)}
              // The lesson's own level and unit (this used to build the unit
              // id "l1u1", which no unit has, so starting a review showed a
              // blank screen — found by the W9-20 navigation tests).
              onStartReview={(moduleId) => goToReview(moduleId)}
            />
          </ScreenFrame>
        )}

        {screen.type === 'level' && (
          <ScreenFrame key={`level-${screen.levelId}`} xOffset={xOffset} enterFrom="right">
            {!loadedLevel ? loadingSpinner : (
              <LevelDetail
                level={loadedLevel}
                progress={progress}
                isModuleCompleted={isModuleCompleted}
                getUnitCompletedModuleCount={getUnitCompletedModuleCount}
                onOpenUnit={(unitId) => goToUnit(screen.levelId, unitId)}
                onOpenModule={(moduleId) => goToModule(moduleId)}
                onBack={goToLevels}
              />
            )}
          </ScreenFrame>
        )}

        {screen.type === 'unit' && (
          <ScreenFrame key={`unit-${screen.unitId}`} xOffset={xOffset} enterFrom="right">
            {!loadedLevel ? loadingSpinner : (() => {
              const unitIndex = loadedLevel.units.findIndex((u) => u.id === screen.unitId);
              const unit = loadedLevel.units[unitIndex];
              if (!unit) return null;
              // A starting track (wave 2) has its own page, reached from the overview.
              if (unit.track) {
                return (
                  <TrackDetail
                    unit={unit}
                    level={loadedLevel}
                    completedModules={progress.completedModules}
                    onOpenModule={(moduleId) => goToModule(moduleId)}
                    onBack={goToLevels}
                  />
                );
              }
              return (
                <UnitDetail
                  unit={unit}
                  unitIndex={unitIndex}
                  level={loadedLevel}
                  progress={progress}
                  isModuleCompleted={isModuleCompleted}
                  onOpenModule={(moduleId) => goToModule(moduleId)}
                  onBack={() => goToLevelBack(screen.levelId)}
                  onBackToLevels={goToLevels}
                />
              );
            })()}
          </ScreenFrame>
        )}

        {screen.type === 'module' && (
          <ScreenFrame key={`module-${screen.moduleId}`} xOffset={xOffset} enterFrom="right">
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
                  onCompleteModule={(moduleId) => {
                    // Celebrations: the unit's milestone when this completes the
                    // unit (D-23), the level overlay when it completes the level,
                    // otherwise a toast.
                    const done = new Set([...progress.completedModules, moduleId]);
                    completeModule(moduleId);
                    const unitDone = unit.modules.every((x) => done.has(x.id));
                    const levelDone = !unit.optional && loadedLevel.units.filter((u) => !u.optional).every((u) => u.modules.every((x) => done.has(x.id)));
                    const level = levelDone
                      ? { levelNumber: loadedLevel.number, accentColor: loadedLevel.accentColor, moduleCount: getLevelModuleCount(loadedLevel) }
                      : null;
                    if (unitDone && unit.milestone) setMilestone({ unit, accent: loadedLevel.accentColor, then: level });
                    else if (level) setLevelCelebration(level);
                    else toast(t('toast.moduleCompleted', { title: mod.title }), 'success');
                  }}
                  onRecordExerciseResult={(exerciseId, score) => recordExerciseResult(mod.id, exerciseId, score)}
                  onExercisesComplete={(passed) => { if (passed) markExercisesPassed(mod.id); }}
                  onBack={() => goToUnitBack(screen.levelId, screen.unitId)}
                  onBackToLevels={goToLevels}
                  onNavigateModule={(moduleId) => goToModule(moduleId)}
                  initialSection={screen.section ?? null}
                  onOpenLevel={goToLevel}
                  run={screen.run}
                  onRunChange={(run, how) => {
                    // Opening the check is a screen of its own (Back: the lesson, the check kept);
                    // the app's own way back to the lesson is Back; a correction rewrites the entry.
                    const next = { ...screen, run };
                    if (how === 'user' && run) goTo('learn', learnPlace(next));
                    else if (how === 'back') backTo('learn', learnPlace(next));
                    setScreen(next);
                  }}
                  onOpenKept={openKept}
                />
              );
            })()}
          </ScreenFrame>
        )}
        {screen.type === 'review' && (
          <ScreenFrame key={`review-${screen.moduleId}`} xOffset={xOffset} enterFrom="right">
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
                  onNavigateModule={(moduleId) => goToModule(moduleId)}
                  onOpenLesson={(section) => goToModule(mod.id, section)}
                  onOpenKept={openKept}
                />
              );
            })()}
          </ScreenFrame>
        )}
      </AnimatePresence>

      {milestone && (
        <MilestoneSheet
          unit={milestone.unit}
          accent={milestone.accent}
          onClose={() => {
            const then = milestone.then;
            setMilestone(null);
            if (then) setLevelCelebration(then);
          }}
        />
      )}

      {levelCelebration && (
        <LevelAchievement
          levelNumber={levelCelebration.levelNumber}
          accentColor={levelCelebration.accentColor}
          moduleCount={levelCelebration.moduleCount}
          onDismiss={dismissCelebration}
        />
      )}
    </div>
  );
}
