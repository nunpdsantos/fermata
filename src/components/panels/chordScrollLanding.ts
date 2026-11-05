export interface RowSpan { top: number; bottom: number }

/** A clipping edge belongs in a GAP, never on a partly occluded control.
 * Overlapping spans (e.g. a label and its button group) form one row. */
export function wholeRows(spans: RowSpan[]): RowSpan[] {
  const rows: RowSpan[] = [];
  for (const span of [...spans].sort((a, b) => a.top - b.top)) {
    const previous = rows.at(-1);
    if (previous && span.top < previous.bottom) previous.bottom = Math.max(previous.bottom, span.bottom);
    else rows.push({ ...span });
  }
  return rows;
}

export function rowClipEdge(rows: RowSpan[], coveredBottom: number): number {
  let hidden = -1;
  rows.forEach((row, i) => { if (row.top < coveredBottom) hidden = i; });
  if (hidden < 0) return 0;
  const end = rows[hidden].bottom;
  const next = rows[hidden + 1]?.top ?? end;
  return (end + next) / 2;
}

/** Coordinates are relative to the scroll content, not the moving viewport.
 * The 8px above and below are separate from the strip's border box. */
export function chordLanding(rows: RowSpan[], detail: RowSpan, actionsBottom: number, height: number, clearance: number) {
  if (detail.bottom <= height - 8 && rows.every((row) => row.top >= clearance)) return 0;
  const available = height - clearance - 8;
  const first = rows.find((row) => detail.bottom - row.top <= available)
    // On short laptops keep the selected row with the play actions when
    // the remaining detail needs scrolling. Otherwise show the detail top.
    ?? rows.find((row) => actionsBottom - row.top <= available)
    ?? detail;
  return Math.max(0, first.top - clearance);
}

export function landChordDetail(detail: HTMLElement, scroller: HTMLElement, strip: HTMLElement, roomAbove: () => number) {
  const card = detail.closest<HTMLElement>('.chords-card')!;
  const savedPadding = scroller.style.paddingBottom;
  const savedScrollPadding = scroller.style.scrollPaddingTop;
  const padding = parseFloat(getComputedStyle(scroller).paddingBottom) || 0;
  const rowSelector = '.explore-card-head, .chord-row, [data-chord-scroll-row], button, label, h2, .type-label';
  let spans: RowSpan[] = [];
  let frame = 0;
  const contentTop = () => scroller.getBoundingClientRect().top - scroller.scrollTop;
  const measure = (el: Element): RowSpan => {
    const r = el.getBoundingClientRect(), origin = contentTop();
    return { top: r.top - origin, bottom: r.bottom - origin };
  };
  const clip = () => {
    // The border box includes the strip's border. Its 8px safety clearance
    // also clears the small card shadow; don't clamp this to action height.
    const edge = rowClipEdge(spans, strip.getBoundingClientRect().bottom - contentTop());
    card.style.clipPath = `inset(${Math.max(0, edge - measure(card).top)}px 0 0)`;
  };
  const land = () => {
    delete detail.dataset.compactSource;
    const before = [...card.querySelectorAll<HTMLElement>(rowSelector)]
      .filter((el) => !detail.contains(el) && !!(el.compareDocumentPosition(detail) & Node.DOCUMENT_POSITION_FOLLOWING));
    const candidates = before.filter((el) => el.matches('.explore-card-head, .chord-row, [data-chord-scroll-row]'));
    const clear = Math.max(roomAbove(), strip.getBoundingClientRect().bottom - scroller.getBoundingClientRect().top + 8);
    scroller.style.scrollPaddingTop = `${clear}px`;
    const targetFor = () => chordLanding(candidates.map(measure), measure(detail), measure(detail.querySelector('.chord-detail-actions')!).bottom, scroller.clientHeight, clear);
    let target = targetFor();
    if (measure(card.querySelector('.explore-card-head')!).top < target + clear) {
      detail.dataset.compactSource = 'true';
      target = targetFor(); // the source label may change the first row's height
    }
    const detailTop = measure(detail).top;
    spans = wholeRows([...before.map(measure), { top: detailTop, bottom: detailTop }]);
    const currentPadding = parseFloat(getComputedStyle(scroller).paddingBottom) || 0;
    const naturalMax = scroller.scrollHeight - scroller.clientHeight - currentPadding + padding;
    scroller.style.paddingBottom = `${padding + Math.max(0, Math.ceil(target - naturalMax))}px`;
    scroller.scrollTo?.({ top: target, behavior: 'auto' });
    clip();
  };
  land();
  // Font loading, notation and translated content can settle after the
  // chord effect. Re-measure actual boxes, not a cached strip height.
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(land);
  });
  observer.observe(scroller);
  observer.observe(strip);
  observer.observe(detail);
  scroller.addEventListener('scroll', clip, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    scroller.removeEventListener('scroll', clip);
    scroller.style.paddingBottom = savedPadding;
    scroller.style.scrollPaddingTop = savedScrollPadding;
    card.style.clipPath = '';
    delete detail.dataset.compactSource;
  };
}
