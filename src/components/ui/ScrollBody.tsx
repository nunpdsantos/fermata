import { useLayoutEffect, useRef, type ReactNode } from 'react';

/** A bounded body; the edge cue lives outside the text and controls. */
export function ScrollBody({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const body = ref.current;
    if (!body) return;
    const measure = () => {
      body.parentElement?.toggleAttribute('data-more-below', body.scrollTop + body.clientHeight < body.scrollHeight - 1);
      body.parentElement?.toggleAttribute('data-more-above', body.scrollTop > 1);
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    ro?.observe(body);
    if (body.firstElementChild) ro?.observe(body.firstElementChild);
    body.addEventListener('scroll', measure, { passive: true });
    measure();
    return () => { ro?.disconnect(); body.removeEventListener('scroll', measure); };
  }, []);
  return <div className="scroll-body-frame"><div ref={ref} className="sheet-body"><div>{children}</div></div></div>;
}
