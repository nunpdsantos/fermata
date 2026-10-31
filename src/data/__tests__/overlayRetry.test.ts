/**
 * W6-14 — when a PT/ES overlay chunk fails to load, the level is served in
 * English that once but not cached, so the next visit gets the translation.
 */
import { describe, it, expect, vi } from 'vitest';
import ptL1 from '../../i18n/content/pt/curriculumL1';

const loadCurriculumOverlay = vi.fn();
vi.mock('../../i18n/content/overlayLoader', () => ({
  loadCurriculumOverlay: (...args: unknown[]) => loadCurriculumOverlay(...args),
  loadExerciseOverlay: vi.fn(async () => null),
  loadTemplateOverlay: vi.fn(async () => null),
  loadSongOverlay: vi.fn(async () => null),
}));

describe('loadLevel after a failed overlay load', () => {
  it('serves English once, then the translation on the next call', async () => {
    const { loadLevel } = await import('../curriculumLoader');
    loadCurriculumOverlay.mockResolvedValueOnce(null).mockResolvedValue(ptL1);

    const first = await loadLevel('l1', 'pt');
    expect(first?.units[0].modules[0].title).toBe('The Staff and Clefs');

    const second = await loadLevel('l1', 'pt');
    expect(second?.units[0].modules[0].title).toBe(ptL1.modules.l1u1m1.title);
    expect(loadCurriculumOverlay).toHaveBeenCalledTimes(2);

    // Once translated it is cached.
    await loadLevel('l1', 'pt');
    expect(loadCurriculumOverlay).toHaveBeenCalledTimes(2);
  });
});
