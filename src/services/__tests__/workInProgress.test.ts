/**
 * The shared work-in-progress registry (W9b; the interface W4b's Learn check
 * plugs into). A waiting app update only applies itself silently when
 * hasWorkInProgress() is false.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

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
