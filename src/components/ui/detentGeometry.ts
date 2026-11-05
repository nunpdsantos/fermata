/** Content coordinates, independent of the current scroll position. */
export interface DockRow { top: number; bottom: number; dots?: { top: number; bottom: number } }

/** Half ends before a row it cannot show completely; never grows into the
 * 120 px reserved for the view. Full may use the preferred toast gap when
 * the complete board needs it (the toast queue waits for room). */
export function fitDockDetents(half: number, full: number, available: number, head: number, rows: readonly DockRow[], boardBottom: number) {
  // Keep this space OUTSIDE the scrolling viewport: dots can fill adjacent
  // rows completely, so adding a gap to each row would overlap every row.
  const halfBottomGap = rows.some((row) => row.dots) ? 4 : 0;
  let edge = half - head - halfBottomGap;
  const bounds = rows.map((row) => ({
    top: Math.min(row.top, row.dots?.top ?? row.top),
    bottom: Math.max(row.bottom, row.dots?.bottom ?? row.bottom),
  }));
  // A control can contain another measured row. Iterate until no row crosses.
  for (const row of bounds.sort((a, b) => b.top - a.top)) {
    if (row.top < edge && row.bottom > edge) edge = row.top;
  }
  return { half: Math.max(head, head + edge + halfBottomGap), halfBottomGap, full: Math.min(available, Math.max(full, head + boardBottom)) };
}
