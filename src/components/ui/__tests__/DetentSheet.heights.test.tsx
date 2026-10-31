/**
 * W11-A review round 4: the sheet's detents are sized so nothing moves when a
 * toast comes or goes (Full leaves one toast's room above the sheet), and so
 * Half is usable on a phone held sideways (the view keeps 120 px, the content
 * gets at least 160 px when there is room).
 */
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { DetentSheet } from '../DetentSheet';
import type { Detent } from '../../../state/dock';

const HEAD = 72;
const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return (this as HTMLElement).classList.contains('detent-head') ? HEAD : 0;
    },
  });
});
afterAll(() => {
  if (original) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', original);
});
afterEach(cleanup);

const heightAt = (detent: Detent, available: number, fullGap = 0) => {
  const { getByTestId } = render(
    <DetentSheet detent={detent} onDetent={() => {}} available={available} fullGap={fullGap} handleLabel="Panel" detentLabels={{ peek: 'Peek', half: 'Half', full: 'Full' }} bar={null} testId="sheet">
      <div />
    </DetentSheet>,
  );
  const h = getByTestId('sheet').style.height;
  cleanup();
  return h === '' ? null : parseFloat(h);
};

describe('DetentSheet heights', () => {
  it('Full leaves the gap it is given above the sheet (room for one toast)', () => {
    expect(heightAt('full', 772, 76)).toBe(696);
    expect(heightAt('full', 772)).toBe(772);
  });

  it('upright phone: Half is half of the room', () => {
    expect(heightAt('half', 772, 76)).toBe(386);
  });

  it('phone sideways (330 px of room): Half keeps the view 120 px and gives the content more than a sliver', () => {
    const half = heightAt('half', 330, 76)!;
    expect(half).toBe(210); // 330 - 120
    expect(half - HEAD).toBeGreaterThanOrEqual(130);
    expect(half).toBeLessThanOrEqual(heightAt('full', 330, 76)!);
  });

  it('Peek is the bar only (no inline height)', () => {
    expect(heightAt('peek', 772, 76)).toBeNull();
  });
});
