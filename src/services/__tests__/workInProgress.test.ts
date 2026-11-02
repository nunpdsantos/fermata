import { describe, it, expect, afterEach } from 'vitest';
import { registerWorkInProgress, hasWorkInProgress } from '../workInProgress';

const cleanups: (() => void)[] = [];
const reg = (source: string, check: () => boolean) => {
  const off = registerWorkInProgress(source, check);
  cleanups.push(off);
  return off;
};
afterEach(() => {
  while (cleanups.length) cleanups.pop()!();
});

describe('work in progress registry (shared with W9b)', () => {
  it('nothing registered → no work in progress', () => {
    expect(hasWorkInProgress()).toBe(false);
  });

  it('true when any registered check is true', () => {
    reg('a', () => false);
    expect(hasWorkInProgress()).toBe(false);
    reg('b', () => true);
    expect(hasWorkInProgress()).toBe(true);
  });

  it('the same source replaces its earlier check', () => {
    reg('learn-check', () => true);
    reg('learn-check', () => false);
    expect(hasWorkInProgress()).toBe(false);
  });

  it('unregister removes only its own check (not a replacement)', () => {
    const offOld = reg('x', () => true);
    reg('x', () => true);
    offOld(); // stale unregister: the replacement stays
    expect(hasWorkInProgress()).toBe(true);
  });

  it('a throwing check counts as work in progress', () => {
    reg('broken', () => {
      throw new Error('boom');
    });
    expect(hasWorkInProgress()).toBe(true);
  });

  it('unregistering clears it', () => {
    const off = reg('y', () => true);
    off();
    expect(hasWorkInProgress()).toBe(false);
  });
});
