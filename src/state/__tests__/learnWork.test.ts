import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hasWorkInProgress } from '../../services/workInProgress';
import { LEARN_SESSION_KEY, LEARN_SESSION_TTL_MS, LEARN_SESSION_VERSION } from '../learnSessionPersistence';
import { persistedLearnCheckInProgress, registerLearnWorkInProgress } from '../learnWork';

const NOW = 1_800_000_000_000;
const active = { finished: false, at: NOW };
let unregister: () => void;

function save(check: unknown, screen: unknown = null) {
  localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify({
    state: { screen, check }, version: LEARN_SESSION_VERSION,
  }));
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(Date, 'now').mockReturnValue(NOW);
  unregister = registerLearnWorkInProgress();
});

afterEach(() => {
  unregister();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('persisted Learn work before the store loads', () => {
  it.each([
    ['first question', active],
    ['just inside TTL', { ...active, at: NOW - LEARN_SESSION_TTL_MS + 1 }],
    ['review check', { ...active, kind: 'review' }],
    ['practice check', { ...active, kind: 'practice' }],
    ['malformed run', { ...active, run: 'damaged' }],
    ['unknown module', { ...active, moduleId: 'unknown' }],
  ])('busy: %s', (_, check) => {
    save(check);
    expect(persistedLearnCheckInProgress()).toBe(true);
    expect(hasWorkInProgress()).toBe(true);
  });

  it.each([
    ['absent check', null],
    ['missing check', undefined],
    ['finished', { ...active, finished: true }],
    ['TTL boundary', { ...active, at: NOW - LEARN_SESSION_TTL_MS }],
    ['stale', { ...active, at: NOW - LEARN_SESSION_TTL_MS - 1 }],
    ['future dated (same freshness rule as live)', { ...active, at: NOW + 1 }],
    ['finished despite malformed time', { finished: true, at: 'damaged' }],
    ['stale despite malformed finished flag', { finished: 'damaged', at: NOW - LEARN_SESSION_TTL_MS }],
  ])('idle: %s', (_, check) => {
    save(check);
    expect(persistedLearnCheckInProgress()).toBe(false);
    expect(hasWorkInProgress()).toBe(false);
  });

  it('ignores an absent Learn save, other stores, and reading another module or review', () => {
    expect(hasWorkInProgress()).toBe(false);
    localStorage.setItem('fermata-drill-v1', JSON.stringify({ state: { check: active } }));
    expect(hasWorkInProgress()).toBe(false);
    for (const type of ['module', 'review']) {
      save(null, { type, moduleId: 'l2u4m1', at: NOW });
      expect(hasWorkInProgress()).toBe(false);
    }
    // A different reading position does not cancel an existing exercise check.
    save({ ...active, moduleId: 'l1u1m1' }, { type: 'module', moduleId: 'l2u4m1', at: NOW });
    expect(hasWorkInProgress()).toBe(true);
  });

  it('reads current storage and time on each call', () => {
    save(active);
    expect(hasWorkInProgress()).toBe(true);
    vi.mocked(Date.now).mockReturnValue(NOW + LEARN_SESSION_TTL_MS);
    expect(hasWorkInProgress()).toBe(false);
    save({ ...active, at: Date.now() });
    expect(hasWorkInProgress()).toBe(true);
    localStorage.removeItem(LEARN_SESSION_KEY);
    expect(hasWorkInProgress()).toBe(false);
  });

  it.each([
    ['missing finished flag', { at: NOW }],
    ['truthy finished flag', { finished: 'false', at: NOW }],
    ['missing time', { finished: false }],
    ['string time', { finished: false, at: String(NOW) }],
    ['null time', { finished: false, at: null }],
    ['non-object check', 'damaged'],
  ])('ambiguous %s throws and the registry stays busy', (_, check) => {
    save(check);
    expect(() => persistedLearnCheckInProgress()).toThrow();
    expect(hasWorkInProgress()).toBe(true);
  });

  it.each(['{broken', 'null', '[]', '{}', '{"state":null}', '{"state":[]}'])('unreadable envelope %s stays busy', (raw) => {
    localStorage.setItem(LEARN_SESSION_KEY, raw);
    expect(() => persistedLearnCheckInProgress()).toThrow();
    expect(hasWorkInProgress()).toBe(true);
  });

  it('leaves unknown-version validation to the lazy store', () => {
    localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify({ state: { check: active }, version: 99 }));
    expect(hasWorkInProgress()).toBe(true);
  });

  it('treats inaccessible storage as busy', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage denied'); });
    expect(() => persistedLearnCheckInProgress()).toThrow('Storage denied');
    expect(hasWorkInProgress()).toBe(true);
  });
});
