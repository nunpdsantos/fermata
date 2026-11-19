/**
 * Learn's screens, and how each is written in a history entry
 * (state/appHistory.ts, audit P3): `''` the overview, `level/l2`,
 * `unit/l2/u5` (a starting track's page too), `module/l1/u3/l1u3m1` (the
 * lesson) and `module/…/run` (its check, practice round or result: one entry,
 * so the result replaces the check and Back from either is the lesson),
 * `review/l1/u3/l1u3m1` (a review is its check). Pure, so it is tested alone.
 */
import { MODULE_INDEX } from '../data/moduleIndex';

export type LearnScreen =
  | { type: 'levels' }
  | { type: 'level'; levelId: string }
  | { type: 'unit'; levelId: string; unitId: string }
  /** `run`: its check (or result) is open; undefined = as the lesson decides (a saved check opens). */
  | { type: 'module'; levelId: string; unitId: string; moduleId: string; section?: string | null; run?: boolean }
  | { type: 'review'; levelId: string; unitId: string; moduleId: string };

export function learnPlace(s: LearnScreen): string {
  switch (s.type) {
    case 'levels': return '';
    case 'level': return `level/${s.levelId}`;
    case 'unit': return `unit/${s.levelId}/${s.unitId}`;
    case 'module': return `module/${s.levelId}/${s.unitId}/${s.moduleId}${s.run ? '/run' : ''}`;
    case 'review': return `review/${s.levelId}/${s.unitId}/${s.moduleId}`;
  }
}

/** The screen an entry names, when every id in it is one the curriculum has (an entry from another release may not). */
export function learnScreenOf(place: string): LearnScreen | null {
  if (place === '') return { type: 'levels' };
  const [type, levelId, unitId, moduleId, run, ...rest] = place.split('/');
  if (rest.length > 0) return null;
  if (type === 'level' && unitId === undefined) {
    return MODULE_INDEX.some((m) => m.level === levelId) ? { type, levelId } : null;
  }
  if (type === 'unit' && moduleId === undefined) {
    return MODULE_INDEX.some((m) => m.level === levelId && m.unitId === unitId) ? { type, levelId, unitId } : null;
  }
  if ((type === 'module' || type === 'review') && MODULE_INDEX.some((m) => m.id === moduleId && m.level === levelId && m.unitId === unitId)) {
    if (type === 'review') return run === undefined ? { type, levelId, unitId, moduleId } : null;
    if (run === undefined || run === 'run') return { type, levelId, unitId, moduleId, run: run === 'run' };
  }
  return null;
}
