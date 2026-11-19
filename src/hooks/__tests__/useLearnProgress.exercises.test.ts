import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLearnProgress } from '../useLearnProgress';
import { useProgressStore } from '../../state/progressStore';
import { getDefaultProgress } from '../../data/curriculumLoader';

describe('useLearnProgress — exercise tracking', () => {
  beforeEach(() => {
    localStorage.clear();
    useProgressStore.setState({ progress: getDefaultProgress() });
  });

  it('recordExerciseResult stores a score for a module exercise', () => {
    const { result } = renderHook(() => useLearnProgress());

    act(() => {
      result.current.recordExerciseResult('l1u1m1', 'l1u1m1e1', 1);
    });

    const exerciseResult = result.current.getModuleExerciseResult('l1u1m1');
    expect(exerciseResult).toBeDefined();
    expect(exerciseResult!.scores['l1u1m1e1']).toBe(1);
    expect(exerciseResult!.totalAttempts).toBe(1);
  });

  it('recordExerciseResult accumulates multiple exercise scores', () => {
    const { result } = renderHook(() => useLearnProgress());

    act(() => {
      result.current.recordExerciseResult('l1u1m1', 'l1u1m1e1', 1);
    });
    act(() => {
      result.current.recordExerciseResult('l1u1m1', 'l1u1m1e2', 0.5);
    });
    act(() => {
      result.current.recordExerciseResult('l1u1m1', 'l1u1m1e3', 0);
    });

    const exerciseResult = result.current.getModuleExerciseResult('l1u1m1');
    expect(exerciseResult!.scores['l1u1m1e1']).toBe(1);
    expect(exerciseResult!.scores['l1u1m1e2']).toBe(0.5);
    expect(exerciseResult!.scores['l1u1m1e3']).toBe(0);
    expect(exerciseResult!.totalAttempts).toBe(3);
  });

  it('getModuleExerciseScore returns earned and total', () => {
    const { result } = renderHook(() => useLearnProgress());

    act(() => {
      result.current.recordExerciseResult('l1u1m1', 'l1u1m1e1', 1);
      result.current.recordExerciseResult('l1u1m1', 'l1u1m1e2', 0.5);
    });

    const score = result.current.getModuleExerciseScore('l1u1m1', ['l1u1m1e1', 'l1u1m1e2', 'l1u1m1e3', 'l1u1m1e4']);
    expect(score.earned).toBe(1.5);
    expect(score.total).toBe(4);
  });

  it('isModuleExercisesPassed returns true at >= 80%', () => {
    const { result } = renderHook(() => useLearnProgress());

    // 5 exercises, need 4 points (80%)
    act(() => {
      result.current.recordExerciseResult('l1u1m1', 'e1', 1);
      result.current.recordExerciseResult('l1u1m1', 'e2', 1);
      result.current.recordExerciseResult('l1u1m1', 'e3', 1);
      result.current.recordExerciseResult('l1u1m1', 'e4', 1);
      result.current.recordExerciseResult('l1u1m1', 'e5', 0);
    });

    expect(result.current.isModuleExercisesPassed('l1u1m1', ['e1', 'e2', 'e3', 'e4', 'e5'])).toBe(true);
  });

  it('isModuleExercisesPassed returns false below 80%', () => {
    const { result } = renderHook(() => useLearnProgress());

    // 5 exercises, only 3 points (60%)
    act(() => {
      result.current.recordExerciseResult('l1u1m1', 'e1', 1);
      result.current.recordExerciseResult('l1u1m1', 'e2', 1);
      result.current.recordExerciseResult('l1u1m1', 'e3', 1);
      result.current.recordExerciseResult('l1u1m1', 'e4', 0);
      result.current.recordExerciseResult('l1u1m1', 'e5', 0);
    });

    expect(result.current.isModuleExercisesPassed('l1u1m1', ['e1', 'e2', 'e3', 'e4', 'e5'])).toBe(false);
  });

  it('isModuleExercisesPassed returns true for modules with no exercises', () => {
    const { result } = renderHook(() => useLearnProgress());
    expect(result.current.isModuleExercisesPassed('l1u1m1', [])).toBe(true);
  });

  it('markExercisesPassed sets the passed flag', () => {
    const { result } = renderHook(() => useLearnProgress());

    act(() => {
      result.current.recordExerciseResult('l1u1m1', 'e1', 1);
    });
    act(() => {
      result.current.markExercisesPassed('l1u1m1');
    });

    const exerciseResult = result.current.getModuleExerciseResult('l1u1m1');
    expect(exerciseResult!.passed).toBe(true);
    // Should also return true from isModuleExercisesPassed regardless of score
    expect(result.current.isModuleExercisesPassed('l1u1m1', Array.from({ length: 100 }, (_, i) => `e${i + 1}`))).toBe(true);
  });

  it('getModuleExerciseResult returns undefined for unknown module', () => {
    const { result } = renderHook(() => useLearnProgress());
    expect(result.current.getModuleExerciseResult('nonexistent')).toBeUndefined();
  });
});
