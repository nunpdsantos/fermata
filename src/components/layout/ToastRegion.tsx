import { useLayoutEffect, useRef } from 'react';
import { fitToastQueue, useToastRoom } from './toastLayout';
import { PWAPrompts } from './PWAPrompts.tsx';
import { ToastContainer } from './Toast.tsx';

/**
 * The ONE place toasts appear (W11-A / W9-22): a fixed overlay under the top
 * bar that grows down at most to the instrument dock / sheet or Drill's
 * answers (toastLayout.ts) — it covers neither, and since it is not in the
 * page flow nothing moves when a toast comes or goes. The PWA stack (update,
 * then offline-ready, then install) comes first, then app toasts.
 */
export function ToastRegion() {
  const ref = useRef<HTMLDivElement>(null);
  const room = useToastRoom();
  useLayoutEffect(() => {
    const region = ref.current;
    if (!region) return;
    const layout = () => {
      const cards = Array.from(region.querySelectorAll<HTMLElement>('.toast-card'));
      const fitted = fitToastQueue(cards.map((card) => card.offsetHeight), room);
      cards.forEach((card, i) => {
        const queued = !fitted.visible[i];
        card.toggleAttribute('data-toast-queued', queued);
        card.inert = queued;
        if (queued) card.setAttribute('aria-hidden', 'true');
        else card.removeAttribute('aria-hidden');
        card.style.top = `${fitted.tops[i]}px`;
      });
      region.style.height = `${fitted.height}px`;
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(layout);
    const observe = () => {
      ro?.disconnect();
      ro?.observe(region);
      region.querySelectorAll('.toast-card').forEach((card) => ro?.observe(card));
      layout();
    };
    const mo = new MutationObserver(observe);
    mo.observe(region, { childList: true, subtree: true, characterData: true });
    observe();
    return () => { ro?.disconnect(); mo.disconnect(); };
  }, [room]);
  return (
    <div ref={ref} className="toast-region" data-testid="toast-region">
      <PWAPrompts />
      <ToastContainer />
    </div>
  );
}
