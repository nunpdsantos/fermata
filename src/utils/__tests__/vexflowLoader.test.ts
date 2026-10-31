/**
 * Review item 6 follow-up: the VexFlow loader shares one download per page,
 * but a FAILED download (offline before VexFlow was cached) must be forgotten
 * so the next staff tries again — it used to be cached as a rejection for the
 * rest of the session.
 */
import { describe, it, expect, vi } from 'vitest';
import { createVexFlowLoader } from '../vexflowLoader';

type VexFlowModule = typeof import('vexflow/bravura');
const FAKE = { default: {} } as unknown as VexFlowModule;

describe('createVexFlowLoader', () => {
  it('after a failed download, the next call downloads again (and then shares the success)', async () => {
    let calls = 0;
    const importer = vi.fn(() => {
      calls++;
      return calls === 1
        ? Promise.reject(new TypeError('Failed to fetch dynamically imported module'))
        : Promise.resolve(FAKE);
    });
    const load = createVexFlowLoader(importer);

    await expect(load()).rejects.toThrow(/Failed to fetch/);
    await expect(load()).resolves.toBe(FAKE);
    await expect(load()).resolves.toBe(FAKE);
    expect(importer).toHaveBeenCalledTimes(2);
  });

  it('concurrent callers share one download', async () => {
    const importer = vi.fn(() => Promise.resolve(FAKE));
    const load = createVexFlowLoader(importer);
    const [a, b] = await Promise.all([load(), load()]);
    expect(a).toBe(b);
    expect(importer).toHaveBeenCalledTimes(1);
  });
});
