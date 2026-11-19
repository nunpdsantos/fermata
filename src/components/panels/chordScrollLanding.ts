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
export function chordLanding(rows: RowSpan[], detail: RowSpan, actionsBottom: number, height: number, clearance: number, keep?: { rows: RowSpan[]; through: number }) {
  if (detail.bottom <= height - 8 && rows.every((row) => row.top >= clearance)) return 0;
  const available = height - clearance - 8;
  // Build with the strip scrolling (a laptop under 900 px tall): the earliest
  // of the card's head and the builder's root row from which the chord's
  // first row (▶ Chord) still fits, before the whole detail — the notes and
  // the readout are what the learner is working on (the owner's ruling,
  // 19 November 2026).
  const kept = keep?.rows.find((row) => keep.through - row.top <= available);
  if (kept) return Math.max(0, kept.top - clearance);
  const first = rows.find((row) => detail.bottom - row.top <= available)
    // On short laptops keep the selected row with the play actions when
    // the remaining detail needs scrolling. Otherwise show the detail top.
    ?? rows.find((row) => actionsBottom - row.top <= available)
    ?? detail;
  return Math.max(0, first.top - clearance);
}

const metronomeBar = () => document.querySelector<HTMLElement>('[data-testid="metronome"]');

/**
 * How much of the scroller's visible foot the metronome's bar covers (0
 * without it, or where it stands clear of the scroller: in the top bar's
 * empty stretch, beside the column). The bar is a fixed overlay above the
 * instrument (the carried item of the audit fixes of 18 November 2026: with
 * the bar open a second-row control could land under it).
 */
export function coveredFoot(scroller: HTMLElement): number {
  const bar = metronomeBar();
  if (!bar) return 0;
  const b = bar.getBoundingClientRect();
  const s = scroller.getBoundingClientRect();
  const top = s.top + scroller.clientTop;
  const bottom = top + scroller.clientHeight;
  if (b.height === 0 || b.bottom <= top || b.top >= bottom || b.right <= s.left || b.left >= s.right) return 0;
  return bottom - Math.max(b.top, top);
}

/**
 * `strip` is the staff strip held at the top of the work column (sticky), or
 * null where it scrolls with the work — the Build tab on a laptop shorter
 * than 900 px (the owner's ruling, 19 November 2026): the same whole-row
 * landing then, with nothing to clear but `roomAbove()`, and the row the
 * work column's top edge would cut in half clipped away.
 */
export function landChordDetail(detail: HTMLElement, scroller: HTMLElement, strip: HTMLElement | null, roomAbove: () => number) {
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
    // With the strip scrolling, the work column's own top edge is what cuts
    // a row: the tabs half shown above the builder's root row are hidden too.
    const covered = strip ? strip.getBoundingClientRect().bottom : scroller.getBoundingClientRect().top + scroller.clientTop;
    const edge = rowClipEdge(spans, covered - contentTop());
    card.style.clipPath = `inset(${Math.max(0, edge - measure(card).top)}px 0 0)`;
  };
  const land = () => {
    delete detail.dataset.compactSource;
    const before = [...card.querySelectorAll<HTMLElement>(rowSelector)]
      .filter((el) => !detail.contains(el) && !!(el.compareDocumentPosition(detail) & Node.DOCUMENT_POSITION_FOLLOWING));
    const candidates = before.filter((el) => el.matches('.explore-card-head, .chord-row, [data-chord-scroll-row]'));
    const clear = strip ? Math.max(roomAbove(), strip.getBoundingClientRect().bottom - scroller.getBoundingClientRect().top + 8) : roomAbove();
    scroller.style.scrollPaddingTop = `${clear}px`;
    // Where the strip scrolls (Build, under 900 px tall): keep the card's
    // head, or else the builder's root row, with the chord's first row and
    // ▶ Chord when they fit.
    const builderRoot = strip ? null : card.querySelector<HTMLElement>('.chord-builder > [data-chord-scroll-row]');
    const head = card.querySelector<HTMLElement>('.explore-card-head');
    const firstRow = detail.querySelector<HTMLElement>('.chord-detail-row');
    // `whole`: through the detail's last row (the pass within the room above the metronome's bar).
    const keep = (whole = false) => builderRoot && head && firstRow
      ? { rows: [measure(head), measure(builderRoot)], through: whole ? measure(detail).bottom : Math.max(measure(firstRow).bottom, measure(detail.querySelector('.chord-detail-actions')!).bottom) }
      : undefined;
    // The metronome's bar covers only part of the column's foot (it stands
    // over the instrument's right end): the landing is chosen as before, and
    // only where that leaves a control of the detail under the bar is it
    // chosen again within the room above the bar — kept if fewer are then
    // covered (where even the room above the bar is too short for the whole
    // detail, ▶ Chord's row first).
    const covered = coveredFoot(scroller);
    const underBar = (top: number) => {
      const bar = metronomeBar();
      if (!bar || covered <= 0) return 0;
      const b = bar.getBoundingClientRect();
      const shift = scroller.scrollTop - top;
      return [...detail.querySelectorAll('button, .type-label')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.bottom + shift > b.top + 1 && r.top + shift < b.bottom - 1 && r.right > b.left + 1 && r.left < b.right - 1;
      }).length;
    };
    const targetFor = (height = scroller.clientHeight, whole = false) => chordLanding(candidates.map(measure), measure(detail), measure(detail.querySelector('.chord-detail-actions')!).bottom, height, clear, keep(whole));
    const choose = () => {
      const first = targetFor();
      if (underBar(first) === 0) return first;
      const above = targetFor(scroller.clientHeight - covered, true);
      return underBar(above) < underBar(first) ? above : first;
    };
    let target = choose();
    if (measure(card.querySelector('.explore-card-head')!).top < target + clear) {
      detail.dataset.compactSource = 'true';
      target = choose(); // the source label may change the first row's height
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
  if (strip) observer.observe(strip);
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
