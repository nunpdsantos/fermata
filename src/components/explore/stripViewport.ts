/** Choose a resting right edge between actual VexFlow notehead centres.
 * No scaling: noteheads and their button columns share the original SVG. */
export function stripViewport(xs: readonly number[], boxWidth: number, staffWidth: number, scrollLeft: number) {
  const boundaries = xs.slice(1).map((x, i) => (xs[i] + x) / 2);
  const width = staffWidth > boxWidth + 1 ? (boundaries.filter((x) => x <= boxWidth).at(-1) ?? boxWidth) : boxWidth;
  return { width, moreLeft: scrollLeft > 1, moreRight: scrollLeft + width < staffWidth - 1 };
}
