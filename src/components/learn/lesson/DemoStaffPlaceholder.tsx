/**
 * What stands where a demonstration's staff will be, before its code and
 * VexFlow have loaded: the staff's own box (`demoBoxStyle`, worked out from
 * the demonstration's data, so nothing below moves when the drawing
 * arrives), with the five pulsing lines of the other staves' skeleton.
 */
import { useMemo } from 'react';
import type { Demonstration } from '../../../core/types/demonstration';
import { demoStaffPlan, demoStaffLayout, demoBoxStyle } from './demoStaffPlan';

export function DemoStaffPlaceholder({ demo }: { demo: Demonstration }) {
  const layout = useMemo(() => demoStaffLayout(demoStaffPlan(demo)), [demo]);
  return (
    <div
      className="rounded-lg animate-pulse min-w-0"
      data-testid="demo-staff-placeholder"
      style={{ ...demoBoxStyle(layout), backgroundColor: 'color-mix(in srgb, var(--card) 40%, transparent)' }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
        {layout.rowTops.flatMap((top, r) => layout.ys.flatMap((y, s) => [0, 1, 2, 3, 4].map((i) => (
          <line key={`${r}-${s}-${i}`} x1="10" y1={top + y + 40 + i * 10} x2={layout.width - 10} y2={top + y + 40 + i * 10} stroke="var(--border)" strokeWidth="1" />
        ))))}
      </svg>
    </div>
  );
}
