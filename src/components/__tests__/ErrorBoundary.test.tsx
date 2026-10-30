/**
 * Audit W0-01: when a persisted view setting (e.g. a scale that crashed the
 * render) brings the app down, the error screen's only way out used to be
 * "Reset app data", which also deletes all Learn progress and Drill memory.
 * The first, primary action must now reset ONLY the view/selection state of
 * the main store and keep progress, drill data and preferences.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../utils/pageReload', () => ({ reloadPage: vi.fn() }));
import { reloadPage } from '../../utils/pageReload';
import { ErrorBoundary } from '../ErrorBoundary';
import { useAppStore } from '../../state/store';
import { buildChord } from '../../core/constants/chords';

function Bomb(): never {
  throw new Error('boom');
}

const APP_KEY = 'music-theory-app';
const PROGRESS = JSON.stringify({ state: { completedModules: ['l1u1m1'], moduleScores: { l1u1m1: 1 } }, version: 3 });
const DRILL = JSON.stringify({ state: { items: { 'keysig:major:G': { tier: 'review' } } }, version: 1 });

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.mocked(reloadPage).mockClear();
});

function seedCrashingState() {
  localStorage.setItem('music-theory-progress', PROGRESS);
  localStorage.setItem('fermata-drill-v1', DRILL);
  // The store's persist middleware writes this to 'music-theory-app'.
  useAppStore.setState({
    selectedKey: { natural: 'D', accidental: '' },
    selectedScale: 'bebop_major',
    selectedChord: buildChord({ natural: 'D', accidental: '' }, 'major'),
    selectedDegree: 3,
    chordInversion: 1,
    guitarScalePosition: 2,
    comparisonScale: 'dorian',
    view: 'learn',
    lastView: 'learn',
    // Preferences — must survive.
    instrument: 'guitar',
    guitarTuningId: 'drop-d',
    colorMode: 'absolute',
    volume: 0.3,
    themeMode: 'fermata-night',
    language: 'pt',
    baseOctave: 3,
    scaleOctaves: 2,
  });
  expect(JSON.parse(localStorage.getItem(APP_KEY)!).state.selectedScale).toBe('bebop_major');
}

describe('ErrorBoundary — error screen actions (W0-01)', () => {
  it('offers "Reset view settings (keeps your progress)" as the first, primary action', () => {
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].textContent).toBe('Reset view settings (keeps your progress)');
    expect(buttons[0].className).toContain('btn-accent');
    // The full wipe is still offered, last, and says what it destroys.
    const last = buttons[buttons.length - 1];
    expect(last.textContent).toBe('Reset app data — clears saved progress');
    expect(last.className).not.toContain('btn-accent');
  });

  it('reset view settings clears only view/selection state and keeps progress, Drill and preferences', () => {
    seedCrashingState();
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: 'Reset view settings (keeps your progress)' }));

    expect(reloadPage).toHaveBeenCalledTimes(1);
    // Progress + drill memory untouched, byte for byte.
    expect(localStorage.getItem('music-theory-progress')).toBe(PROGRESS);
    expect(localStorage.getItem('fermata-drill-v1')).toBe(DRILL);

    // Persisted view/selection back to defaults…
    const persisted = JSON.parse(localStorage.getItem(APP_KEY)!).state;
    expect(persisted.selectedScale).toBe('major');
    expect(persisted.selectedKey).toEqual({ natural: 'C', accidental: '' });
    expect(persisted.lastView).toBe('explore');
    // …preferences kept.
    expect(persisted.instrument).toBe('guitar');
    expect(persisted.guitarTuningId).toBe('drop-d');
    expect(persisted.colorMode).toBe('absolute');
    expect(persisted.volume).toBe(0.3);
    expect(persisted.themeMode).toBe('fermata-night');
    expect(persisted.language).toBe('pt');
    expect(persisted.baseOctave).toBe(3);
    expect(persisted.scaleOctaves).toBe(2);

    // In-memory selection cleared too (nothing can re-persist the bad scale
    // before the reload lands).
    const s = useAppStore.getState();
    expect(s.selectedScale).toBe('major');
    expect(s.selectedChord).toBeNull();
    expect(s.selectedDegree).toBeNull();
    expect(s.chordInversion).toBe(0);
    expect(s.guitarScalePosition).toBeNull();
    expect(s.comparisonScale).toBeNull();
    expect(s.view).toBe('explore');
  });

  it('the destructive full reset still clears progress and drill data (unchanged behaviour)', async () => {
    seedCrashingState();
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: 'Reset app data — clears saved progress' }));
    expect(localStorage.getItem('music-theory-progress')).toBeNull();
    expect(localStorage.getItem('fermata-drill-v1')).toBeNull();
    await vi.waitFor(() => expect(reloadPage).toHaveBeenCalledTimes(1));
  });
});
