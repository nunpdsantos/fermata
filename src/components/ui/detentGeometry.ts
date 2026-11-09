/** Content coordinates, independent of the current scroll position. */
export interface DockRow { top: number; bottom: number; dots?: { top: number; bottom: number } }

/** Half ends before a row it cannot show completely; never grows into the
 * 120 px reserved for the view. Full may use the preferred toast gap when
 * the complete board needs it (the toast queue waits for room). Neither is
 * ever taller than the content needs: `content` is its natural height (0 or
 * absent while it cannot be measured — no cap then), so a short instrument
 * (the phone keyboard) leaves no empty band under it and the view above gets
 * the room back. When the whole content fits at Half, Full equals Half
 * (`fullDistinct` false: the sheet then has two stops, Peek and Half). */
export function fitDockDetents(half: number, full: number, available: number, head: number, rows: readonly DockRow[], boardBottom: number, content = 0) {
  const need = content > 0 ? head + content : Infinity;
  // Everything fits at Half: no row is cut, so no clearance under the dots
  // either (it would grow the sheet when a first dot appears).
  if (need <= half) return { half: need, halfBottomGap: 0, full: need, fullDistinct: false };
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
  const fittedHalf = Math.max(head, head + edge + halfBottomGap);
  const fittedFull = Math.max(fittedHalf, Math.min(available, Math.max(full, head + boardBottom), need));
  // Under a pixel apart is the same height: no separate Full stop.
  const fullDistinct = fittedFull - fittedHalf >= 1;
  return { half: fittedHalf, halfBottomGap, full: fullDistinct ? fittedFull : fittedHalf, fullDistinct };
}
