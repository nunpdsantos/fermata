/**
 * THE LEGACY VIEW IS FROZEN (brief D, 2026-11-10). Before the neck learned
 * to turn, the DOM of every guitar surface was recorded on `main` (9fa5300)
 * for fixed scenarios — cells in order with their string / fret data,
 * labels, classes and inline layout — into fixtures/legacy-neck.json. With
 * the nut on the right and the thick string on top the surfaces must
 * reproduce those recordings exactly: the owner's neck, pixel for pixel.
 *
 * Re-recording is for a deliberate change to the legacy view only:
 * `RECORD_LEGACY_NECK=1 npx vitest run legacyNeck`.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SCENARIOS, media, resetStores, serialise } from './neckScenarios';

vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));
vi.mock('../../../hooks/useMediaQuery', async (orig) => ({
  ...(await orig<typeof import('../../../hooks/useMediaQuery')>()),
  useIsMobile: () => media.mobile,
}));

const FIXTURE = resolve(process.cwd(), 'src/components/instruments/__tests__/fixtures/legacy-neck.json');
const RECORD = process.env.RECORD_LEGACY_NECK === '1';
const recorded: Record<string, string> = RECORD ? {} : JSON.parse(readFileSync(FIXTURE, 'utf8'));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

describe('legacy neck (nut right, thick string on top) is drawn exactly as on main', () => {
  it.each(SCENARIOS.map((s) => [s.name, s] as const))('%s', async (name, scenario) => {
    resetStores({ neckNutSide: 'right', neckTopString: 'low' });
    const html = serialise(await scenario.run());
    if (RECORD) {
      recorded[name] = html;
      writeFileSync(FIXTURE, JSON.stringify(recorded, null, 1) + '\n');
      return;
    }
    expect(recorded[name], `no recording for ${name}`).toBeDefined();
    expect(html).toBe(recorded[name]);
  });

  it('every recording has a scenario (none was dropped)', () => {
    if (RECORD) return;
    expect(Object.keys(recorded).sort()).toEqual(SCENARIOS.map((s) => s.name).sort());
  });
});
