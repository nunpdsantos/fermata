/**
 * F-04 guard: a failed or in-flight exercise load must never unlock module
 * completion, and a failed load must surface a retryable error instead of
 * silently rendering "no exercises".
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);
import { ModuleView } from '../ModuleView';
import type { CurriculumModule, CurriculumUnit, CurriculumLevel } from '../../../core/types/curriculum';

const module_: CurriculumModule = {
  id: 'l1u1m1',
  unitId: 'l1u1',
  levelId: 'l1',
  title: 'Test Module',
  subtitle: 'sub',
  objectives: [],
  concepts: [],
  tasks: [],
  prerequisites: [],
};

const unit: CurriculumUnit = {
  id: 'l1u1',
  levelId: 'l1',
  title: 'Test Unit',
  description: '',
  modules: [module_],
} as unknown as CurriculumUnit;

const level: CurriculumLevel = {
  id: 'l1',
  number: 1,
  title: 'Test Level',
  description: '',
  accentColor: '#8b5cf6',
  units: [unit],
} as unknown as CurriculumLevel;

function renderModuleView(overrides: Partial<Parameters<typeof ModuleView>[0]> = {}) {
  return render(
    <ModuleView
      module={module_}
      unit={unit}
      level={level}
      unitIndex={0}
      moduleIndex={0}
      isModuleCompleted={false}
      isTaskCompleted={() => true}
      completedTaskCount={module_.tasks.length}
      exercises={[]}
      exercisesState="ready"
      exercisesPassed={false}
      levelCompletedModuleCount={0}
      onToggleTask={() => {}}
      onCompleteModule={() => {}}
      onRecordExerciseResult={() => {}}
      onExercisesComplete={() => {}}
      onBack={() => {}}
      onBackToLevels={() => {}}
      onNavigateModule={() => {}}
      {...overrides}
    />,
  );
}

describe('ModuleView exercise load states', () => {
  it('allows completion when exercises loaded successfully and module has none', () => {
    renderModuleView({ exercisesState: 'ready' });
    expect(screen.getByText('Mark Module Complete')).toBeTruthy();
  });

  it('blocks completion while exercises are still loading', () => {
    renderModuleView({ exercisesState: 'loading' });
    expect(screen.queryByText('Mark Module Complete')).toBeNull();
  });

  it('blocks completion and shows a retryable error when the exercise load failed', () => {
    const onRetry = vi.fn();
    renderModuleView({ exercisesState: 'error', onRetryExercises: onRetry });
    expect(screen.queryByText('Mark Module Complete')).toBeNull();
    const retry = screen.getByRole('button', { name: 'Try Again' });
    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
