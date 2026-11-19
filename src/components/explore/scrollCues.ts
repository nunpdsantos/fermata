/**
 * Explore's continuation cues (QA report 2 of 18 November 2026, P5).
 *
 * The rule of the workbench: the page never scrolls, and nothing a learner
 * needs is cut — each area either fits or scrolls inside itself with its
 * edge showing there is more. Where Explore's areas scroll (`index.css`):
 *  - on a laptop (≥ 1200 px, the workbench) the work column and the circle
 *    column, each on its own (`.explore-main`, `.explore-aside`);
 *  - below 1200 px the work area as one (`.explore-work`);
 *  - on a short screen (≤ 500 px tall) the whole view (`.explore-root`).
 * At 1280×720 the chord cards and the circle's foot ran under the dock with
 * nothing to say there was more; at 375×667 the chords card sat under the
 * sheet. This marks every one of those scrollers whose CONTENT goes on past
 * its visible foot — `data-more-below` on the root (the work area or the
 * view), `data-main-more-below` / `data-aside-more-below` on the work area
 * (the two columns) — and `index.css` draws a fade there, in the page
 * colour, over the content it cuts, taking no room and no taps.
 *
 * Content, not scroll room: the chord detail's landing adds temporary tail
 * padding to the work column (`chordScrollLanding.ts`), and the metronome
 * bar's room pads it too; padding alone is never "more".
 */

const SCROLLING = /(auto|scroll)/;

/**
 * Does `el` scroll, and does its content (not its padding) go on below its
 * visible foot — by any amount over 1 px (a sub-pixel is rounding, not a cut)?
 *
 * "Its content" is the boxes of its DIRECT children. That cannot see a child
 * with `display: contents` (it has no box) nor a grandchild that overflows
 * its parent. Measured on 19 November 2026 (the review of the second round),
 * at 1280×720, 1366×768, 1440×900, 390×844, 375×667, 844×390 and 768×1024,
 * piano and guitar, with a chord, All Chords, Build and the Progression panel
 * open: no Explore scroller has a `display: contents` child, and the only
 * descendants reaching below their scroller's children are the staff
 * strip's SVG glyphs, whose boxes are the font's whole em box (taller than
 * the ink, inside the drawing) — not layout overflow, and nothing to scroll.
 */
export function contentBelow(el: HTMLElement | null): boolean {
  if (!el || !SCROLLING.test(getComputedStyle(el).overflowY)) return false;
  if (el.scrollHeight <= el.clientHeight + 1) return false;
  const foot = el.getBoundingClientRect().top + el.clientTop + el.clientHeight;
  let bottom = -Infinity;
  for (const child of Array.from(el.children)) {
    const r = child.getBoundingClientRect();
    if (r.height > 0) bottom = Math.max(bottom, r.bottom);
  }
  return bottom > foot + 1;
}

/** Keep the cues on `root` (Explore's `.explore-root`) up to date; returns the clean-up. */
export function trackExploreScrollCues(root: HTMLElement): () => void {
  let frame = 0;
  const update = () => {
    frame = 0;
    const work = root.querySelector<HTMLElement>(':scope > .explore-work');
    const main = work?.querySelector<HTMLElement>(':scope > .explore-main') ?? null;
    const aside = work?.querySelector<HTMLElement>(':scope > .explore-aside') ?? null;
    root.toggleAttribute('data-more-below', contentBelow(root) || contentBelow(work ?? null));
    work?.toggleAttribute('data-main-more-below', contentBelow(main));
    work?.toggleAttribute('data-aside-more-below', contentBelow(aside));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
  const observe = () => {
    resize?.disconnect();
    resize?.observe(root);
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(':scope > .explore-work, :scope > .explore-work > *, :scope > .explore-work > * > *'))) resize?.observe(el);
    schedule();
  };
  // A chord detail opening, a tab, a panel: new content, new sizes.
  const mutations = typeof MutationObserver === 'undefined' ? null : new MutationObserver(observe);
  mutations?.observe(root, { childList: true, subtree: true });
  // Scroll events do not bubble: listen in the capture phase for every scroller inside.
  root.addEventListener('scroll', schedule, { capture: true, passive: true });
  window.addEventListener('resize', schedule);
  observe();
  update();
  return () => {
    if (frame) cancelAnimationFrame(frame);
    resize?.disconnect();
    mutations?.disconnect();
    root.removeEventListener('scroll', schedule, { capture: true });
    window.removeEventListener('resize', schedule);
    root.removeAttribute('data-more-below');
    root.querySelector(':scope > .explore-work')?.removeAttribute('data-main-more-below');
    root.querySelector(':scope > .explore-work')?.removeAttribute('data-aside-more-below');
  };
}
