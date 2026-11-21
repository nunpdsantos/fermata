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
 * long as that stays under `halfMax` (the room the view keeps).
 * Where the content goes on below Half's edge, Half takes `fade` px more,
 * the band of the fade that says so (index.css, `.detent-content::after`):
 * the top of what follows shows under the fade, and the fade never lies over
 * the last whole row Half chose (the fret numbers); where no more than that
 * is left, Half shows it all (the leftovers round, 21 November 2026). Only
 * where the whole band fits within `halfMax` and its foot cuts no string:
 * otherwise (a phone on its side; 320×568, 360×640) Half is as it was and
 * `halfLine` says to keep its 3 px line. */
export function fitDockDetents(half: number, full: number, available: number, head: number, rows: readonly DockRow[], boardBottom: number, content = 0, halfMax = Infinity, fade = 0) {
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
  // The whole band or none: cut short by the view's room the fade would
  // still lie over the last whole row, and ending across a string (320×568,
  // 360×640) it would cut that string's dots, which are drawn over the fade
  // (and inside their string's row: measured, never outside it). Half then
  // stays as it was, with its 3 px line (`halfLine`, index.css). Where less
  // than the band's own height would still be hidden after it and showing
  // everything fits in the view's room, Half shows everything and no fade
  // (the piano at 320–430 × 568 and × 600: 19 and 3 px were left under the
  // fade). `fade` is 0 where index.css draws none (a short screen).
  let withBand = Math.min(content, edge + fade);
  if (content - withBand < fade && head + content + halfBottomGap <= halfMax) withBand = content;
  const cutsString = rows.some((row) => row.dots && row.top < withBand - 0.5 && row.bottom > withBand + 0.5);
  const banded = fade > 0 && content > 0 && content - edge > 0.5 && head + withBand + halfBottomGap <= halfMax && !cutsString;
  const halfLine = fade > 0 && !banded && content - edge > 0.5;
  if (banded) edge = withBand;
  const fittedHalf = Math.max(head, head + edge + halfBottomGap);
  const fittedFull = Math.max(fittedHalf, Math.min(available, Math.max(full, head + boardBottom), need));
  // Under a pixel apart is the same height: no separate Full stop.
  const fullDistinct = fittedFull - fittedHalf >= 1;
  return { half: fittedHalf, halfBottomGap, full: fullDistinct ? fittedFull : fittedHalf, fullDistinct, halfLine };
}
