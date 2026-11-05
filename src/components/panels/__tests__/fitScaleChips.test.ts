import { afterEach, expect, it, vi } from 'vitest';
import { fitScaleChips, scaleChipCount } from '../fitScaleChips';

afterEach(() => { vi.unstubAllGlobals(); document.body.replaceChildren(); });

it('takes a complete priority prefix including exact-fit gaps', () => {
  expect(scaleChipCount([120, 80, 60], 204, 4, true)).toBe(2);
  expect(scaleChipCount([120, 80, 60], 203.9, 4, true)).toBe(1);
  expect(scaleChipCount([120, 80, 60], 268, 4, true)).toBe(3);
});

it('never skips a higher-priority chip to squeeze in a shorter lower-priority chip', () => {
  expect(scaleChipCount([120, 180, 40], 170, 4, true)).toBe(1);
});

it('preserves the key even below its width, without inventing a mandatory quality chip', () => {
  expect(scaleChipCount([120, 80], 100, 4, true)).toBe(1);
  expect(scaleChipCount([120, 80], 100, 4, false)).toBe(0);
  expect(scaleChipCount([], 100, 4, false)).toBe(0);
});

it('remeasures full chip widths on resize and font load, and restores all choices outside the workbench', async () => {
  let resize = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal('ResizeObserver', class {
    constructor(callback: () => void) { resize = callback; }
    observe() {}
    disconnect = disconnect;
  });
  const media = new EventTarget() as EventTarget & { matches: boolean };
  media.matches = true;
  vi.stubGlobal('matchMedia', () => media);
  const fonts = new EventTarget() as EventTarget & { ready: Promise<void> };
  fonts.ready = Promise.resolve();
  const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
  Object.defineProperty(document, 'fonts', { configurable: true, value: fonts });
  try {
    const options = document.createElement('span');
    options.style.columnGap = '4px';
    let available = 205;
    options.getBoundingClientRect = () => ({ width: available }) as DOMRect;
    let widths = [120, 80, 60];
    const chips = widths.map((_, i) => {
      const chip = document.createElement('button');
      if (i === 0) chip.dataset.keyNotes = 'true';
      chip.getBoundingClientRect = () => ({ width: chip.hasAttribute('data-fit-hidden') ? 0 : widths[i] }) as DOMRect;
      options.append(chip);
      return chip;
    });
    document.body.append(options);
    const visible = () => chips.map((chip) => !chip.hasAttribute('data-fit-hidden'));
    const cleanup = fitScaleChips(options);
    await fonts.ready;
    expect(visible()).toEqual([true, true, false]);
    available = 269;
    resize();
    expect(visible()).toEqual([true, true, true]);
    widths = [140, 100, 80];
    fonts.dispatchEvent(new Event('loadingdone'));
    expect(visible()).toEqual([true, true, false]);
    available = 100;
    resize();
    expect(visible()).toEqual([true, false, false]);
    media.matches = false;
    media.dispatchEvent(new Event('change'));
    expect(visible()).toEqual([true, true, true]);
    media.matches = true;
    media.dispatchEvent(new Event('change'));
    expect(visible()).toEqual([true, false, false]);
    cleanup();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(visible()).toEqual([true, true, true]);
  } finally {
    if (originalFonts) Object.defineProperty(document, 'fonts', originalFonts);
    else Reflect.deleteProperty(document, 'fonts');
  }
});
