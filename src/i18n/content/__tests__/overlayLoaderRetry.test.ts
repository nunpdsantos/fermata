/**
 * W6-14 — a failed overlay load is retried, not cached as "English for the
 * rest of the session"; a genuinely absent file is cached as absent.
 */
import { describe, it, expect, vi } from 'vitest';
import { loadFromGlob } from '../overlayLoader';

describe('loadFromGlob', () => {
  it('retries after a failed import and caches the success', async () => {
    const importer = vi
      .fn<() => Promise<{ default: string }>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ default: 'overlay' });
    const cache = new Map<string, string | null>();
    const glob = { './pt/x.ts': importer };

    expect(await loadFromGlob(glob, './pt/x.ts', cache, 'pt:x')).toBeNull();
    expect(cache.has('pt:x')).toBe(false);
    expect(await loadFromGlob(glob, './pt/x.ts', cache, 'pt:x')).toBe('overlay');
    expect(await loadFromGlob(glob, './pt/x.ts', cache, 'pt:x')).toBe('overlay');
    expect(importer).toHaveBeenCalledTimes(2);
  });

  it('caches a missing file as null without calling anything', async () => {
    const cache = new Map<string, string | null>();
    expect(await loadFromGlob({}, './pt/none.ts', cache, 'pt:none')).toBeNull();
    expect(cache.get('pt:none')).toBeNull();
  });
});
