/**
 * The shared work-in-progress registry (W9b; the interface W4b's Learn check
 * plugs into). A waiting app update only applies itself silently when
 * hasWorkInProgress() is false.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

type Registry = typeof import('../workInProgress');
let wip: Registry;

beforeEach(async () => {
  vi.resetModules(); // module-level Map: a fresh registry per test
  wip = await import('../workInProgress');
});

describe('work-in-progress registry', () => {
  it('nothing registered: no work in progress', () => {
    expect(wip.hasWorkInProgress()).toBe(false);
  });

  it('true while any registered source reports active', () => {
    let drill = false;
    let learn = false;
    wip.registerWorkInProgress('drill', () => drill);
    wip.registerWorkInProgress('learn', () => learn);
    expect(wip.hasWorkInProgress()).toBe(false);
    drill = true;
    expect(wip.hasWorkInProgress()).toBe(true);
    drill = false;
    learn = true;
    expect(wip.hasWorkInProgress()).toBe(true);
    learn = false;
    expect(wip.hasWorkInProgress()).toBe(false);
  });

  it('registering the same source again replaces its check', () => {
    wip.registerWorkInProgress('drill', () => true);
    expect(wip.hasWorkInProgress()).toBe(true);
    wip.registerWorkInProgress('drill', () => false);
    expect(wip.hasWorkInProgress()).toBe(false);
  });

  it('unregister removes the source; a stale unregister never removes a newer registration', () => {
    const offFirst = wip.registerWorkInProgress('drill', () => true);
    offFirst();
    expect(wip.hasWorkInProgress()).toBe(false);

    const offOld = wip.registerWorkInProgress('drill', () => true);
    wip.registerWorkInProgress('drill', () => true); // replaces
    offOld(); // the old handle: the newer check stays
    expect(wip.hasWorkInProgress()).toBe(true);
  });

  it('a check that throws counts as work in progress (the safe side)', () => {
    wip.registerWorkInProgress('drill', () => false);
    wip.registerWorkInProgress('broken', () => {
      throw new Error('corrupt state');
    });
    expect(wip.hasWorkInProgress()).toBe(true);
  });
});

const cleanups: (() => void)[] = [];
const reg = (source: string, check: () => boolean) => {
  const off = wip.registerWorkInProgress(source, check);
  cleanups.push(off);
  return off;
};
afterEach(() => {
  while (cleanups.length) cleanups.pop()!();
});

describe('work in progress registry (shared with W9b)', () => {
  it('nothing registered → no work in progress', () => {
    expect(wip.hasWorkInProgress()).toBe(false);
  });

  it('true when any registered check is true', () => {
    reg('a', () => false);
    expect(wip.hasWorkInProgress()).toBe(false);
    reg('b', () => true);
    expect(wip.hasWorkInProgress()).toBe(true);
  });

  it('the same source replaces its earlier check', () => {
    reg('learn-check', () => true);
    reg('learn-check', () => false);
    expect(wip.hasWorkInProgress()).toBe(false);
  });

  it('unregister removes only its own check (not a replacement)', () => {
    const offOld = reg('x', () => true);
    reg('x', () => true);
    offOld(); // stale unregister: the replacement stays
    expect(wip.hasWorkInProgress()).toBe(true);
  });

  it('a throwing check counts as work in progress', () => {
    reg('broken', () => {
      throw new Error('boom');
    });
    expect(wip.hasWorkInProgress()).toBe(true);
  });

  it('unregistering clears it', () => {
    const off = reg('y', () => true);
    off();
    expect(wip.hasWorkInProgress()).toBe(false);
  });
});
