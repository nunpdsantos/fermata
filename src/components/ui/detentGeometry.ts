/** Content coordinates, independent of the current scroll position. */
export interface DockRow {
  top: number; bottom: number; dots?: { top: number; bottom: number };
  /** A row that belongs with the one above it: the fret numbers under the strings. */
  withAbove?: boolean;
}

/** Half ends before a row it cannot show completely; never grows into the
 * 120 px reserved for the view. Full may use the preferred toast gap when
 * the complete board needs it (the toast queue waits for room). Neither is
 * ever taller than the content needs: `content` is its natural height (0 or
 * absent while it cannot be measured — no cap then), so a short instrument
 * (the phone keyboard) leaves no empty band under it and the view above gets
 * the room back. When the whole content fits at Half, Full equals Half
 * (`fullDistinct` false: the sheet then has two stops, Peek and Half).
 * Half never ends between the strings and their fret numbers (QA report 2,
 * P5: at 375×667 Half showed six strings and no fret numbers): where it
 * would end after the last string, it ends after the numbers instead, as
 * long as that stays under `halfMax` (the room the view keeps). */
export function fitDockDetents(half: number, full: number, available: number, head: number, rows: readonly DockRow[], boardBottom: number, content = 0, halfMax = Infinity) {
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
  for (const row of rows) {
    if (!row.withAbove || edge >= row.bottom) continue;
    const above = rows.filter((r) => r !== row && r.bottom <= row.top + 0.5);
    const lastAbove = above.length ? Math.max(...above.map((r) => Math.max(r.bottom, r.dots?.bottom ?? r.bottom))) : -Infinity;
    // The rows above it all shown, the row itself not: take it in.
    if (lastAbove <= edge + 0.5 && head + row.bottom + halfBottomGap <= halfMax) edge = row.bottom;
  }
  const fittedHalf = Math.max(head, head + edge + halfBottomGap);
  const fittedFull = Math.max(fittedHalf, Math.min(available, Math.max(full, head + boardBottom), need));
  // Under a pixel apart is the same height: no separate Full stop.
  const fullDistinct = fittedFull - fittedHalf >= 1;
  return { half: fittedHalf, halfBottomGap, full: fullDistinct ? fittedFull : fittedHalf, fullDistinct };
}
