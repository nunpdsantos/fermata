import type { Box, placeMetronome as PlaceMetronome } from '../metronome/placement';

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
 * The metronome's own placement (MetronomeBar's `placeMetronome`), taken
 * from its chunk only once its bar stands over the column, when that chunk
 * is loaded: Explore loads none of the metronome before it is opened (wave
 * 3's promise, `e2e/metronome.spec.ts`; a static import put placement.ts in
 * Explore's code, this round). Its three endings: already loaded (the bar
 * came with it), the landing goes on at once; late, a landing that meets
 * the bar waits for it, and the learner sees the detail open where it is,
 * the column not scrolled, until it is in and the detail lands (a
 * dynamic import of a module the bar already loaded: a task at most); and
 * failed, `placementSettled` all the same, so the landing goes on as without
 * the bar (once, no landing asked every frame, the code not asked again).
 */
let placeMetronome: typeof PlaceMetronome | undefined;
let placement: Promise<void> | undefined;
let placementSettled = false;
export const loadBarPlacement = () => (placement ??= import('../metronome/placement')
  .then((m) => { placeMetronome = m.placeMetronome; }, () => {})
  .finally(() => { placementSettled = true; }));

/**
 * The bar's box where it is placed, not where its glide has got to: with
 * ordinary motion it moves to a new place over 0.2 s (metronome.css
 * transitions `top` and `left`), so in the frame after it opens it still
 * stood at the window's top and a landing then saw no bar at all (this
 * round). MetronomeBar writes its place as `top` / `left`.
 */
function barBox(bar: HTMLElement): Box {
  const top = parseFloat(bar.style.top), left = parseFloat(bar.style.left);
  if (!Number.isFinite(top) || !Number.isFinite(left)) return bar.getBoundingClientRect();
  return { top, left, bottom: top + bar.offsetHeight, right: left + bar.offsetWidth };
}

/**
 * Where the bar will stand once the detail's box is `detailBox`: it keeps off
 * the chord's detail where it can, re-placed every frame by MetronomeBar with
 * the same `placeMetronome` and these inputs, so a landing is judged against
 * the place the bar takes, not the one it has before the detail arrives (the
 * first chord of a visit meets it at the left edge, where nothing was yet in
 * its way, and it moves to the right as the detail opens).
 */
export function barPlaceWith(bar: HTMLElement, detailBox: Box): Box {
  const b = { width: bar.offsetWidth, height: bar.offsetHeight };
  const vh = window.innerHeight;
  const topBar = document.querySelector('.app-topbar')?.getBoundingClientRect();
  const dock = document.querySelector('[data-testid="instrument-dock"]')?.getBoundingClientRect();
  const hint = document.querySelector('[data-testid="start-hint"]')?.getBoundingClientRect();
  const place = placeMetronome!({
    viewport: { width: window.innerWidth, height: vh },
    topBarBottom: topBar?.bottom ?? 0,
    topClear: hint && hint.height > 0 ? hint.bottom : undefined,
    floor: dock && dock.height > 0 && dock.top < vh ? dock.top : vh,
    fullWidth: b.width, fullHeight: b.height, compactWidth: b.width, compactHeight: b.height,
    soft: detailBox.bottom > 0 && detailBox.top < vh ? [detailBox] : [],
  });
  return { top: place.top, bottom: place.top + b.height, left: place.left, right: place.left + b.width };
}

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
  const b = barBox(bar);
  const s = scroller.getBoundingClientRect();
  const top = s.top + scroller.clientTop;
  const bottom = top + scroller.clientHeight;
  if (b.bottom - b.top <= 0 || b.bottom <= top || b.top >= bottom || b.right <= s.left || b.left >= s.right) return 0;
  return bottom - Math.max(b.top, top);
}

/** The chord's name and every control of its detail: what must be in view after a landing with the metronome's bar open. */
const DETAIL_PARTS = '.chord-detail-name, button, [role="radio"], .type-label, a';
/** The work column's foot fade (index.css, Explore's cues): 28 px over its foot while items go on below. */
const FOOT_FADE_PX = 28;
/** Landings in a row after the first, each a frame after the last, until one changes nothing and leaves the column where it asked (the tail's padding can take three frames to arrive under reduced motion). */
const SETTLE_LANDINGS = 6;

/**
 * Will the work column show its foot fade, its items ending `itemsEnd` px
 * below its top (content coordinates), scrolled to `at`? The column shows it
 * once items go on more than a pixel below its foot (`scrollCues.ts`); the
 * landing counts it from the foot itself, so a target is never judged within
 * a pixel of the wrong side — the scroller takes the nearest whole pixel
 * (review of this round: 170.3 judged "no fade", the column at 170 and its
 * card 332.3 px down, so the fade showed over the detail).
 */
export const footFadeShows = (itemsEnd: number, at: number, clientHeight: number) => itemsEnd - at > clientHeight;

/**
 * `strip` is the staff strip held at the top of the work column (sticky), or
 * null where it scrolls with the work — the Build tab on a laptop shorter
 * than 900 px (the owner's ruling, 19 November 2026): the same whole-row
 * landing then, with nothing to clear but `roomAbove()`, and the row the
 * work column's top edge would cut in half clipped away.
 *
 * With the metronome's bar over the column's foot, a held strip can leave
 * too little room (1366×768: 95–111 px between the strip and the bar for a
 * detail of 142–217 px; In key and All Chords, the leftovers round of 21
 * November 2026). Each landing is chosen with the strip held, as before, the
 * bar judged where it will stand once the detail is there (`barPlaceWith`),
 * not where it stands or is gliding to; where that leaves the chord's name
 * or a control of its detail under the bar, under the strip, below the
 * column's foot or under its foot fade (a fade within a pixel of showing
 * counted as showing: `footFadeShows`),
 * the detail at the top of the view, the chords card's end at the foot and
 * the detail's last control just above the fade are tried; only where those fail too does the strip scroll with the
 * work (`data-strip-scrolls`, index.css), in the spirit of the owner's ruling
 * for Build, and the detail land again as on Build. Where both fit
 * (1440×900, 1536×864, the piano's In key 1, 4 and 7 at 1280×800), the
 * strip stays held.
 *
 * The decision is made afresh at every landing, and a landing comes when
 * the chord is chosen, when the column, the strip, the detail or the chords
 * card change size (a margin arriving a frame late under reduced motion, a
 * font), and when the bar opens or closes (`html[data-metro-room]`; closed,
 * the strip is held again at once): so the strip goes exactly while the bar
 * is open and this layout leaves no room for both. Each landing is followed
 * a frame later by another until one changes nothing, at most seven in a
 * row for one cause; a choice can bring several (the detail opening, its
 * margin a frame late, the bar moving off it), each starting the count again.
 */
export function landChordDetail(detail: HTMLElement, scroller: HTMLElement, strip: HTMLElement | null, roomAbove: () => number) {
  const card = detail.closest<HTMLElement>('.chords-card')!;
  const savedScrollPadding = scroller.style.scrollPaddingTop;
  const rowSelector = '.explore-card-head, .chord-row, [data-chord-scroll-row], button, label, h2, .type-label';
  let spans: RowSpan[] = [];
  let frame = 0;
  let released = false;
  let stopped = false;
  // Where the last landing asked the column to be (NaN: it asked nothing).
  let aim = NaN;
  const held = () => (released ? null : strip);
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
    const top = held();
    const covered = top ? top.getBoundingClientRect().bottom : scroller.getBoundingClientRect().top + scroller.clientTop;
    const edge = rowClipEdge(spans, covered - contentTop());
    card.style.clipPath = `inset(${Math.max(0, edge - measure(card).top)}px 0 0)`;
  };
  const land = (afresh = true): void => {
    aim = NaN;
    delete detail.dataset.compactSource;
    // Each landing decides afresh, the strip held first: it scrolls with the
    // work only while the bar is open and this layout leaves no room for both
    // (not the landing that follows letting it go: `afresh` false).
    if (afresh && released) {
      released = false;
      scroller.removeAttribute('data-strip-scrolls');
    }
    const strip = held();
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
    // chosen again within the room above the bar — and kept if it leaves
    // ▶ Chord / ▶ Arpeggio clear where the first did not, or as clear and
    // fewer other controls covered (review of the second round: in
    // Portuguese at 1280×800 «Arpejo» landed 15 px under the bar).
    const covered = coveredFoot(scroller);
    if (covered > 0 && !placementSettled) {
      void loadBarPlacement().then(() => { if (!stopped) again(); });
      return;
    }
    const bar = covered > 0 && placeMetronome ? metronomeBar() : null;
    // Where the bar will stand with the column scrolled to `top`: it keeps off
    // the detail, re-placed every frame, so where it stands now is no guide
    // (the same chord landed in two places, by where the bar had stood).
    const barAt = (top: number) => {
      const d = detail.getBoundingClientRect(), shift = scroller.scrollTop - top;
      return barPlaceWith(bar!, { top: d.top + shift, bottom: d.bottom + shift, left: d.left, right: d.right });
    };
    const underBar = (top: number) => {
      if (!bar) return 0;
      const b = barAt(top);
      const shift = scroller.scrollTop - top;
      const under = (el: Element) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.bottom + shift > b.top + 1 && r.top + shift < b.bottom - 1 && r.right > b.left + 1 && r.left < b.right - 1;
      };
      const actions = [...detail.querySelectorAll('.chord-detail-actions button')];
      const others = [...detail.querySelectorAll('button, .type-label')].filter((el) => !actions.includes(el));
      return actions.filter(under).length * 1000 + others.filter(under).length;
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
    // With the bar over the column's foot, the chord's name and every control
    // of its detail must be in view at the scroll chosen: below what is held
    // above, clear of the bar (where it will stand once the detail is there),
    // above the column's foot and its fade where the fade shows. Where the
    // choice leaves something out (its first pass keeps the chord's row with
    // ▶ Chord and lets the rest go below the foot), three more are tried (the
    // detail at the top, the card's end at the foot, the last control just
    // above the fade); where all fail with the strip held, the strip scrolls
    // with the work and the detail lands again.
    if (bar) {
      const s = scroller.getBoundingClientRect();
      const viewTop = s.top + scroller.clientTop + clear - 8;
      const foot = s.top + scroller.clientTop + scroller.clientHeight;
      const inView = (at: number) => {
        const shift = scroller.scrollTop - at;
        const b = barAt(at);
        // Where the column's items go on below its foot, its fade lies over the last 28 px (index.css, held at the foot).
        const lowest = Math.max(...[...scroller.children].map((el) => measure(el).bottom));
        const end = footFadeShows(lowest, at, scroller.clientHeight) ? foot - FOOT_FADE_PX : foot;
        return [...detail.querySelectorAll(DETAIL_PARTS)].every((el) => {
          const r = el.getBoundingClientRect();
          if (r.height === 0 || r.width === 0) return true;
          const top = r.top + shift, bottom = r.bottom + shift;
          const underBar = bottom > b.top + 1 && top < b.bottom - 1 && r.right > b.left + 1 && r.left < b.right - 1;
          return top >= viewTop - 0.5 && bottom <= end + 0.5 && !underBar;
        });
      };
      if (!inView(target)) {
        // The detail at the top of the view; the chords card's end at the
        // column's foot (nothing below it, so no fade); or, where chord cards
        // follow the detail (All Chords opens it under the tapped row), its
        // last control just above the fade — the detail's own padding left
        // out (this round: at 1280×800 in Spanish, text 8 % wider, "Aprende
        // sobre esto" 6 px into the fade from the top candidate). The card's
        // head is above the view in each, so the detail names its tab.
        const named = detail.dataset.compactSource;
        detail.dataset.compactSource = 'true';
        const lastPart = Math.max(...[...detail.querySelectorAll(DETAIL_PARTS)].map((el) => measure(el).bottom));
        const fit = [measure(detail).top - clear, measure(card).bottom - scroller.clientHeight, lastPart - (scroller.clientHeight - FOOT_FADE_PX) + 1]
          .find((at) => at >= 0 && inView(at));
        if (fit !== undefined) target = fit;
        else if (strip) {
          released = true;
          scroller.setAttribute('data-strip-scrolls', '');
          land(false);
          return;
        } else if (named) detail.dataset.compactSource = named;
        else delete detail.dataset.compactSource;
      }
    }
    const detailTop = measure(detail).top;
    spans = wholeRows([...before.map(measure), { top: detailTop, bottom: detailTop }]);
    // The tail the landing needs, as a floor under the column's own padding
    // (`--chord-tail`, index.css: max() with it), never in place of it: the
    // metronome's room opened later still applies (review of the second
    // round: an inline 2 px shadowed the bar's 62). It is the bottom padding
    // that lets the column reach the target, worked out from the end of its
    // items, and written only when it changes: under reduced motion a changed
    // padding arrives a frame late, and taking the tail off and putting it
    // back at every landing left the column clamped short of its target,
    // landing after landing (this round: 227 and 233 for a target of 267).
    const itemsEnd = Math.max(...[...scroller.children].map((el) => measure(el).bottom + (parseFloat(getComputedStyle(el).marginBottom) || 0)));
    const tail = Math.ceil(target + scroller.clientHeight - itemsEnd);
    const tailValue = tail > 2 ? `${tail}px` : '';
    if (scroller.style.getPropertyValue('--chord-tail') !== tailValue) {
      if (tailValue) scroller.style.setProperty('--chord-tail', tailValue);
      else scroller.style.removeProperty('--chord-tail');
    }
    aim = target;
    scroller.scrollTo?.({ top: target, behavior: 'auto' });
    clip();
  };
  // A landing is followed, a frame later, by another, until one changes
  // nothing — a few at most: a box restyled under reduced motion shows its
  // old size for a frame (index.css gives every property a 0.01 ms
  // transition), and the detail's row margin arriving late grew the card by
  // 6 px after the landing, which then left controls under the bar or the
  // fade (review of this round: 10 of 51 All Chords qualities at 1366×768).
  // A landing that left the column short of its target counts as a change
  // too: the tail it wrote arrives one to three frames late under reduced
  // motion (its padding transitions, 0.01 ms, applied after the frame's
  // landing), so the column was clamped short and stayed there, every part
  // still in view (third pass, on the build of fba01f3: 53 of 1,224 All Chords
  // landings at 1366×768 and 1280×800, by up to 46 px, e.g. 233 for 267); the
  // next landings reach it once the padding is in.
  const state = () => `${Math.round(scroller.scrollTop)}|${released}|${scroller.style.getPropertyValue('--chord-tail')}|${detail.dataset.compactSource ?? ''}`;
  let settling = 0;
  const step = () => {
    frame = 0;
    const was = state();
    land();
    if ((state() !== was || Math.abs(scroller.scrollTop - aim) > 1) && ++settling < SETTLE_LANDINGS) frame = requestAnimationFrame(step);
  };
  const again = () => {
    cancelAnimationFrame(frame);
    settling = 0;
    frame = requestAnimationFrame(step);
  };
  land();
  again();
  // Font loading, notation and translated content can settle after the
  // chord effect, and the chords card can grow round the detail. Re-measure
  // actual boxes, not a cached strip height.
  const observer = new ResizeObserver(again);
  // Its border box: the column's own padding changing (this landing's tail,
  // the bar's room as the bar moves) is no reason to land again — re-landing
  // then moved the column under the learner (review of the second round).
  observer.observe(scroller, { box: 'border-box' });
  if (strip) observer.observe(strip);
  observer.observe(detail);
  observer.observe(card);
  // The bar opened or closed (MetronomeBar marks `html[data-metro-room]`
  // while it stands over the view's foot): the learner's own act, so the
  // detail lands again, at the next landing, a frame later. Closed, the strip
  // is held again at once, here, in the observer's own callback, before that
  // landing (the landing's fresh decision would hold it a frame later; the
  // unit test "the bar closed, it is held again at once" tells the two apart).
  const barWatch = new MutationObserver(() => {
    if (released && !document.documentElement.hasAttribute('data-metro-room')) {
      released = false;
      scroller.removeAttribute('data-strip-scrolls');
    }
    again();
  });
  barWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-metro-room'] });
  scroller.addEventListener('scroll', clip, { passive: true });
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    barWatch.disconnect();
    scroller.removeEventListener('scroll', clip);
    scroller.style.removeProperty('--chord-tail');
    scroller.style.scrollPaddingTop = savedScrollPadding;
    card.style.clipPath = '';
    delete detail.dataset.compactSource;
    if (released) scroller.removeAttribute('data-strip-scrolls');
  };
}
