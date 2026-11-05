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

/** Measure the actual styled buttons, including translated text, font,
 * padding and borders. CSS reserves the formula, label and lesson link
 * before giving this options container its remaining width. */
export function fitScaleChips(options: HTMLElement): () => void {
  const chips = Array.from(options.querySelectorAll<HTMLButtonElement>('button'));
  // Match the two-row CSS; narrower laptops keep their wrapping contract.
  const media = window.matchMedia?.('screen and (min-width: 1440px)');
  const showAll = () => chips.forEach((chip) => chip.removeAttribute('data-fit-hidden'));
  const measure = () => {
    showAll();
    if (!media?.matches) return;
    const available = options.getBoundingClientRect().width;
    if (available <= 0) return; // hidden ancestor / not laid out yet
    const widths = chips.map((chip) => chip.getBoundingClientRect().width);
    const gap = parseFloat(getComputedStyle(options).columnGap) || 0;
    // One CSS pixel of rounding slack; no clipped labels or partial chips.
    const count = scaleChipCount(widths, available - 1, gap, chips[0]?.dataset.keyNotes === 'true');
    chips.forEach((chip, i) => chip.toggleAttribute('data-fit-hidden', i >= count));
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
  };
}
