import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SavedCheck } from '../learnSessionStore';
import { LEARN_SESSION_KEY, LEARN_SESSION_VERSION } from '../learnSessionPersistence';

const { storeLoaded } = vi.hoisted(() => ({ storeLoaded: vi.fn() }));
vi.mock('../learnSessionStore', async (importOriginal) => {
  storeLoaded();
  return importOriginal();
});

// Exercise the real entry's registrations without mounting the UI or audio.
vi.mock('react-dom/client', () => ({ createRoot: () => ({ render: vi.fn() }) }));
vi.mock('../../App.tsx', () => ({ default: () => null }));
vi.mock('../../services/instrumentVoices.ts', () => ({ registerInstrumentVoices: vi.fn() }));

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('Learn registration at cold startup', () => {
  it('sees a persisted unanswered check before mounting a lazy view', async () => {
    vi.resetModules();
    storeLoaded.mockClear();
    localStorage.clear();
    const check: SavedCheck = {
      moduleId: 'l1u1m1', kind: 'check', lang: 'en', fingerprints: { l1u1m1e1: 'test-identity' },
      run: { order: ['l1u1m1e1'], index: 0, scores: [], items: [], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null },
      finished: false, at: Date.now(),
    };
    const persisted = JSON.stringify({ state: { screen: null, check }, version: LEARN_SESSION_VERSION });
    localStorage.setItem(LEARN_SESSION_KEY, persisted);
    await import('../../main');
    const { hasWorkInProgress } = await import('../../services/workInProgress');
    expect(hasWorkInProgress()).toBe(true);
    expect(storeLoaded).not.toHaveBeenCalled();
    const { registerLearnWorkInProgress } = await import('../learnWork');
    const unregisterPersisted = registerLearnWorkInProgress();
    const { useLearnSessionStore } = await import('../learnSessionStore');
    expect(storeLoaded).toHaveBeenCalledTimes(1);
    expect(useLearnSessionStore.getState().check).toEqual(check);
    // Old registration cleanup must not remove the live replacement.
    unregisterPersisted();
    // Another tab clearing storage cannot mask this tab's live check.
    localStorage.removeItem(LEARN_SESSION_KEY);
    expect(hasWorkInProgress()).toBe(true);
    useLearnSessionStore.getState().setCheck(null);
    useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'c1', at: Date.now() });
    expect(hasWorkInProgress()).toBe(false);
    // Nor can another tab's saved check make this idle tab busy after takeover.
    localStorage.setItem(LEARN_SESSION_KEY, persisted);
    const reads = vi.spyOn(Storage.prototype, 'getItem');
    expect(hasWorkInProgress()).toBe(false);
    expect(reads).not.toHaveBeenCalled();
  });
});
