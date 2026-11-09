/** Keep a priority-ordered prefix of whole chips. A key chip is mandatory,
 * even when an unusually narrow viewport cannot accommodate it. */
export function scaleChipCount(widths: number[], available: number, gap: number, hasKey: boolean): number {
  let used = 0;
  let count = 0;
  for (const width of widths) {
    const next = used + (count ? gap : 0) + width;
    if (next > available) break;
    used = next;
    count++;
  }
  return Math.max(hasKey ? 1 : 0, count);
}

/** Whole chips that fit, keeping room for the "+n" control whenever some
 * do not (it never pushes a chip it would replace out of view). */
export function scaleChipCountWithMore(widths: number[], available: number, gap: number, hasKey: boolean, moreWidth: number): number {
  const all = scaleChipCount(widths, available, gap, hasKey);
  if (all >= widths.length) return all;
  return scaleChipCount(widths, available - moreWidth - gap, gap, hasKey);
}

/** Measure the actual styled buttons, including translated text, font,
 * padding and borders. CSS reserves the formula, label and lesson link
 * before giving this options container its remaining width. The chips are
 * the container's own buttons; the "+n" menu that offers the hidden ones
 * (`[data-scale-more]`, rendered while `onHidden` reports some) is not one,
 * but the room it needs is kept: its measured width, else one --tap. */
export function fitScaleChips(options: HTMLElement, onHidden?: (count: number) => void): () => void {
  const chips = Array.from(options.children).filter((el): el is HTMLButtonElement => el instanceof HTMLButtonElement);
  // Match the two-row CSS; narrower laptops keep their wrapping contract.
  const media = window.matchMedia?.('screen and (min-width: 1440px)');
  const showAll = () => chips.forEach((chip) => chip.removeAttribute('data-fit-hidden'));
  let hidden = 0;
  const report = (count: number) => {
    if (count === hidden) return;
    hidden = count;
    onHidden?.(count);
  };
  const measure = () => {
    showAll();
    if (!media?.matches) return report(0);
    const available = options.getBoundingClientRect().width;
    // Hidden ancestor / not laid out yet: every chip is back (showAll), so
    // no "+n" either — it would offer chips that are already there.
    if (available <= 0) return report(0);
    const widths = chips.map((chip) => chip.getBoundingClientRect().width);
    const style = getComputedStyle(options);
    const gap = parseFloat(style.columnGap) || 0;
    const more = options.querySelector<HTMLElement>('[data-scale-more]')?.getBoundingClientRect().width;
    const moreWidth = more || parseFloat(style.getPropertyValue('--tap')) || 36;
    // One CSS pixel of rounding slack; no clipped labels or partial chips.
    const count = scaleChipCountWithMore(widths, available - 1, gap, chips[0]?.dataset.keyNotes === 'true', moreWidth);
    chips.forEach((chip, i) => chip.toggleAttribute('data-fit-hidden', i >= count));
    report(chips.length - count);
  };
  measure();
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
  observer?.observe(options);
  media?.addEventListener('change', measure);
  document.fonts?.addEventListener('loadingdone', measure);
  let active = true;
  void document.fonts?.ready.then(() => { if (active) measure(); });
  return () => {
    active = false;
    observer?.disconnect();
    media?.removeEventListener('change', measure);
    document.fonts?.removeEventListener('loadingdone', measure);
    showAll();
    report(0);
  };
}
