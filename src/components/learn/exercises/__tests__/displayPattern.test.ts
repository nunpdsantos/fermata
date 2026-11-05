import { expect, it } from 'vitest';
import { displayPattern } from '../displayPattern';
it('EN/PT/ES step patterns use display-only non-breaking hyphens', () => {
  expect(displayPattern('W-H-W-W-H-W-W; T-T-S-T-T-T-S')).toBe('W‑H‑W‑W‑H‑W‑W; T‑T‑S‑T‑T‑T‑S');
  expect(displayPattern('C-E-G, half-step, W-H')).toBe('C-E-G, half-step, W-H');
});
