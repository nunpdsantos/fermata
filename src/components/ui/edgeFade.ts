/**
 * Edge state of a sideways-scrolling row: is there more of it off the left /
 * right edge? The staff strip's rule (W11 "strip edge fades",
 * `explore/stripViewport.ts`): 1 px of slack, so a row that fits, or one
 * scrolled to its end, says nothing.
 */
export interface ScrollEdges {
  moreLeft: boolean;
  moreRight: boolean;
}

export function scrollEdges(scrollLeft: number, clientWidth: number, scrollWidth: number): ScrollEdges {
  return { moreLeft: scrollLeft > 1, moreRight: scrollLeft + clientWidth < scrollWidth - 1 };
}

/**
 * Mark `host` with `data-more-left` / `data-more-right` (the staff strip's
 * attributes; CSS draws the fades from them) while the element
 * `getScroller()` returns has content off that side. Re-reads on scroll, on a
 * size change of the scroller or any of its items (resize, rotation, font
 * load, a translated label) and when items come or go. Returns the cleanup.
 */
export function trackScrollEdges(host: HTMLElement, getScroller: () => HTMLElement | null): () => void {
  let scroller: HTMLElement | null = null;
  const update = () => {
    const el = scroller;
    const edges = el ? scrollEdges(el.scrollLeft, el.clientWidth, el.scrollWidth) : { moreLeft: false, moreRight: false };
    host.toggleAttribute('data-more-left', edges.moreLeft);
    host.toggleAttribute('data-more-right', edges.moreRight);
  };
  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
  const attach = () => {
    scroller?.removeEventListener('scroll', update);
    resize?.disconnect();
    mutations?.disconnect();
    scroller = getScroller();
    if (host !== scroller) mutations?.observe(host, { childList: true });
    if (scroller) {
      scroller.addEventListener('scroll', update, { passive: true });
      resize?.observe(scroller);
      for (const item of Array.from(scroller.children)) resize?.observe(item);
      mutations?.observe(scroller, { childList: true, subtree: true, characterData: true });
    }
    update();
  };
  const mutations = typeof MutationObserver === 'undefined' ? null : new MutationObserver(attach);
  attach();
  return () => {
    scroller?.removeEventListener('scroll', update);
    resize?.disconnect();
    mutations?.disconnect();
    host.removeAttribute('data-more-left');
    host.removeAttribute('data-more-right');
  };
}
