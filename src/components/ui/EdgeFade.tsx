import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { trackScrollEdges } from './edgeFade';

/**
 * A sideways-scrolling row with the staff strip's edge fades (W11): wrap the
 * scroller (it must be the only child) and a fade shows on a side only while
 * the row has more off that side — never on a row that fits. The fade blends
 * into `--edge-fade-bg` (default `--card`; set it to the surface the row sits
 * on), so it follows Day and Night. Purely visual: nothing to name or reach.
 */
export function EdgeFade({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    return trackScrollEdges(host, () => host.firstElementChild as HTMLElement | null);
  }, []);
  return (
    <div ref={ref} className={['edge-fade', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}
