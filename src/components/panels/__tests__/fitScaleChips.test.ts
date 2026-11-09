import { afterEach, expect, it, vi } from 'vitest';
import { fitScaleChips, scaleChipCount, scaleChipCountWithMore } from '../fitScaleChips';

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
    // The "+n" control's room (here 36 px, one --tap) is kept whenever a
    // chip is hidden: 120 + 4 + 80 + 4 + 36 = 244.
    options.style.setProperty('--tap', '36px');
    let available = 245;
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
    expect(visible()).toEqual([true, false, false]);
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

it('keeps room for the "+n" control only when a chip is hidden', () => {
  // All three fit exactly: no "+n", so no room kept for it.
  expect(scaleChipCountWithMore([120, 80, 60], 268, 4, true, 36)).toBe(3);
  // One does not fit: the chips that stay leave 4 + 36 px for "+1".
  expect(scaleChipCountWithMore([120, 80, 60], 267, 4, true, 36)).toBe(2);
  expect(scaleChipCountWithMore([120, 80, 60], 243, 4, true, 36)).toBe(1);
  // The key chip stays even where "+n" leaves it no room.
  expect(scaleChipCountWithMore([120, 80], 100, 4, true, 36)).toBe(1);
});

it('reports how many chips are hidden, never counts the "+n" control as a chip, and reports 0 on cleanup', async () => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  const media = new EventTarget() as EventTarget & { matches: boolean };
  media.matches = true;
  vi.stubGlobal('matchMedia', () => media);
  const options = document.createElement('span');
  options.style.columnGap = '4px';
  options.getBoundingClientRect = () => ({ width: 245 }) as DOMRect;
  const widths = [120, 80, 60, 90];
  const chips = widths.map((width) => {
    const chip = document.createElement('button');
    chip.getBoundingClientRect = () => ({ width }) as DOMRect;
    options.append(chip);
    return chip;
  });
  // The rendered "+n" menu (its button nested in a wrapper) measures 40 px.
  const more = document.createElement('span');
  more.dataset.scaleMore = '';
  more.getBoundingClientRect = () => ({ width: 40 }) as DOMRect;
  more.append(document.createElement('button'));
  options.append(more);
  document.body.append(options);
  const reports: number[] = [];
  const cleanup = fitScaleChips(options, (n) => reports.push(n));
  // 120 + 4 + 80 + 4 + 40 = 248 > 244: only the first chip stays, "+3".
  expect(chips.map((chip) => chip.hasAttribute('data-fit-hidden'))).toEqual([false, true, true, true]);
  expect(more.hasAttribute('data-fit-hidden')).toBe(false);
  expect(reports).toEqual([3]);
  media.matches = false;
  media.dispatchEvent(new Event('change'));
  expect(reports).toEqual([3, 0]);
  cleanup();
  expect(reports).toEqual([3, 0]);
});
