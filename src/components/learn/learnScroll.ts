import { useLayoutEffect, type RefObject } from 'react';

export function learnScrollInsets(scroller: { top: number; bottom: number }, topBarBottom: number, stickyHeight: number, dockTop: number) {
  return { top: Math.max(0, topBarBottom - scroller.top) + stickyHeight + 8, bottom: Math.max(0, scroller.bottom - dockTop) + 8 };
}

/** Measure only overlap: the shell already reserves the dock in flex flow. */
export function useLearnScrollInsets(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;
    const measure = () => {
      const box = scroller.getBoundingClientRect();
      const bar = document.querySelector('.app-topbar')?.getBoundingClientRect().bottom ?? box.top;
      const picker = scroller.querySelector('[data-testid="section-picker"]');
      const sticky = picker?.getBoundingClientRect().height ?? 0;
      const dock = document.querySelector('[data-testid="instrument-dock"]')?.getBoundingClientRect().top ?? box.bottom;
      const insets = learnScrollInsets(box, bar, sticky, dock);
      scroller.style.setProperty('--learn-top', `${insets.top}px`);
      scroller.style.setProperty('--learn-bottom', `${insets.bottom}px`);
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    const observe = () => {
      ro?.disconnect();
      ro?.observe(scroller);
      for (const el of document.querySelectorAll('.app-topbar, [data-testid="section-picker"], [data-testid="instrument-dock"]')) ro?.observe(el);
      measure();
    };
    const mo = new MutationObserver(observe);
    mo.observe(scroller, { subtree: true, childList: true });
    observe();
    return () => { ro?.disconnect(); mo.disconnect(); };
  }, [ref]);
}
