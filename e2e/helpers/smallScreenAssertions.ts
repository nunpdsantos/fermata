import { expect, type Page } from '@playwright/test';

/** PR A assertions deliberately inspect the resting view BEFORE any helper
 * scrolls a card/control into view. No existing audit thresholds change. */
export async function smallScreenAssertions(page: Page, screen: string) {
  const faults = await page.evaluate((name) => {
    const errors: string[] = [];
    const box = (el: Element) => el.getBoundingClientRect();
    const visible = (el: Element) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    const contains = (outer: DOMRect, inner: DOMRect, gap = 0) => inner.left >= outer.left + gap - 0.5 && inner.right <= outer.right - gap + 0.5 && inner.top >= outer.top - 0.5 && inner.bottom <= outer.bottom + 0.5;
    const viewport = new DOMRect(0, 0, innerWidth, innerHeight);
    const tabs = document.querySelector('.app-tabs');
    if (tabs && innerWidth <= 390) {
      const track = box(tabs);
      for (const tab of Array.from(tabs.querySelectorAll('button'))) {
        const range = document.createRange(); range.selectNodeContents(tab);
        const text = range.getBoundingClientRect();
        if (text.left < track.left + 4 || text.right > track.right - 4) errors.push(`1: nav word outside pill: ${tab.textContent}`);
        const b = box(tab);
        if (text.left < b.left + 4 || text.right > b.right - 4) errors.push(`1: nav word lacks padding: ${tab.textContent}`);
      }
      // From 360 px the microphone switch stands where the magnifier was wherever it is offered (brief U2): the same gap.
      const search = document.querySelector('.app-topbar button:has(circle)') ?? (innerWidth >= 360 ? document.querySelector('.app-topbar [data-testid="mic-switch"]') : null);
      if (search && box(search).left - track.right < 8 - 0.5) errors.push('1: pill/search gap below 8px');
    }
    for (const wrapper of Array.from(document.querySelectorAll('.select-trigger'))) {
      if (!visible(wrapper)) continue;
      const select = wrapper.querySelector('select'), caret = wrapper.querySelector('svg');
      if (select && caret) {
        const inset = box(select).right - box(caret).right;
        if (inset < 8 || inset > 16) errors.push(`2: caret outside select inset: ${inset}`);
      }
    }
    const strip = document.querySelector<HTMLElement>('.strip-scroll');
    if (strip && visible(strip) && strip.scrollWidth > strip.clientWidth + 1) {
      const frame = strip.closest('.strip-window');
      const right = strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1;
      if (!frame || frame.hasAttribute('data-more-right') !== right || frame.hasAttribute('data-more-left') !== (strip.scrollLeft > 1)) errors.push('4: missing overflow side cue');
      const clef = document.querySelector('.strip-clef');
      if (!clef || !visible(clef) || !contains(box(strip), box(clef))) errors.push('4: clef column leaves viewport');
      const edge = box(strip);
      for (const head of Array.from(strip.querySelectorAll('.vf-notehead'))) {
        const h = box(head);
        if (h.left < edge.right && h.right > edge.right + 0.5) errors.push('4: resting right edge slices a notehead');
      }
    }
    const dock = document.querySelector('[data-testid="instrument-dock"]');
    if (dock && name === 'dock-half') {
      const bottom = Math.min(box(dock).bottom, innerHeight);
      const content = dock.querySelector('.detent-content');
      const contentBottom = content ? Math.min(bottom, box(content).bottom) : bottom;
      for (const row of Array.from(dock.querySelectorAll('[data-dock-row], [data-testid="position-row"], [data-string-name]'))) {
        const r = box(row.hasAttribute('data-string-name') ? row.parentElement! : row);
        if (r.top < contentBottom - 0.5 && r.bottom > contentBottom + 0.5) errors.push(`5/6: Half slices ${row.getAttribute('data-dock-row') ?? 'position'}`);
      }
      let visibleDots = 0;
      for (const dot of Array.from(dock.querySelectorAll('[data-dot]'))) {
        const d = box(dot);
        if (d.top >= contentBottom || d.bottom <= (content ? box(content).top : box(dock).top)) continue;
        visibleDots++;
        if (d.bottom > contentBottom + 0.5) errors.push(`5/6: Half clips dot on string ${dot.getAttribute('data-dot-string')}`);
        if (bottom - d.bottom < 4) errors.push(`5/6: Half dot lacks 4px bottom clearance: ${bottom - d.bottom}`);
      }
      if (dock.querySelector('[data-string-row]') && !visibleDots) errors.push('5/6: Half shows no guitar dots');
    }
    if (dock && name === 'dock-full' && innerHeight <= 500) {
      // Also works on main, which has no data-dock-row instrumentation.
      const cells = dock.querySelectorAll('[data-string-row][data-fret="1"]');
      if (cells.length !== 6) errors.push(`6: expected six string cells, saw ${cells.length}`);
      for (const cell of Array.from(cells)) if (!contains(box(dock), box(cell)) || !contains(viewport, box(cell))) errors.push('6: Full clips a string');
      const numbers = dock.querySelector('[data-dock-row="frets"]') ?? dock.querySelector('.fretboard-scroll .flex.mt-1');
      if (!numbers || !contains(box(dock), box(numbers)) || !contains(viewport, box(numbers))) errors.push('6: Full clips fret numbers');
    }
    for (const panel of Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"]'))) {
      if (!visible(panel)) continue;
      if (!contains(viewport, box(panel))) errors.push('8: dialog extends beyond viewport');
      const body = panel.querySelector<HTMLElement>('.sheet-body') ?? panel as HTMLElement;
      if (body.scrollHeight > body.clientHeight + body.scrollTop + 1 && !body.parentElement?.hasAttribute('data-more-below')) errors.push('8: scrolling dialog lacks a continuation cue');
      // Primary actions must be visible at rest, even before body scrolling.
      const buttons = panel.querySelectorAll('.sheet-actions button, .sheet-heading button');
      for (const button of Array.from(buttons)) if (!contains(box(panel), box(button)) || !contains(viewport, box(button))) errors.push(`8: pinned button clipped: ${button.textContent}`);
      // On main the decision is in the body: check its final primary button
      // too, so the assertion fails before the footer slot exists.
      const primary = Array.from(panel.querySelectorAll('button')).filter((b) => b.classList.contains('btn-primary')).at(-1);
      if (primary && !primary.closest('.sheet-body') && !contains(box(panel), box(primary))) errors.push('8: final primary action clipped');
    }
    const learn = document.querySelector<HTMLElement>('[data-learn-scroll]');
    if (learn && innerHeight <= 500 && innerWidth >= 640) {
      const top = Math.max(box(learn).top, document.querySelector('.app-topbar')?.getBoundingClientRect().bottom ?? 0, learn.querySelector('[data-testid="section-picker"]')?.getBoundingClientRect().bottom ?? 0) + 8;
      const target = name.includes('reread-expanded') ? learn.querySelector('[data-testid="check-reread"]') : /check-final|exercise-right|exercise-wrong/.test(name) ? learn.querySelector('.feedback') : null;
      if (target && box(target).top < top - 0.5) errors.push('9: feedback/re-read begins under sticky layers');
      if (/exercise-step|exercise-key-signature|check-rhythm/.test(name)) {
        const staff = learn.querySelector('[data-testid="check-staff"], [data-testid="check-rhythm-staff"] svg') ?? learn.querySelector('[data-testid="check-prompt"] + div');
        if (!staff) errors.push('11: expected question staff');
        else {
          const r = box(staff), bottom = dock ? box(dock).top : innerHeight;
          if (r.top < top - 0.5 || r.bottom > bottom - 8 + 0.5) errors.push(`11: staff outside available Learn view: ${r.top}..${r.bottom}, safe ${top}..${bottom - 8}`);
        }
      }
      if (name === 'learn-exercise-instrument') {
        const prompt = learn.querySelector('[data-testid="check-prompt"]');
        if (!prompt || !contains(box(learn), box(prompt))) errors.push('10: instrument task off-screen');
        const octaves = dock?.querySelector('.piano-octave-row');
        if (!octaves || !contains(box(dock!), box(octaves)) || !contains(viewport, box(octaves))) errors.push('10: octave chooser off-screen');
      }
    }
    if (/reading-.*-feedback/.test(name) && innerHeight <= 500) {
      for (const sel of ['.drill-feedback', '.drill-thumb > button', '.reading-board']) {
        const el = document.querySelector(sel);
        if (!el || !contains(viewport, box(el))) errors.push(`12: answered reading element below fold: ${sel}`);
      }
    }
    return errors;
  }, screen);
  expect.soft(faults, `PR A ${screen}: resting geometry`).toEqual([]);
}

/** Test the whole numeral, including its left edge. A pointer-transparent
 * decorative layer still paints: temporarily include ONLY that layer in hit
 * testing, without changing layout/paint/scroll, and restore it synchronously. */
export async function stripDegreesFitAtRest(page: Page, requiredIndex?: number) {
  const result = await page.locator('.strip-scroll').evaluate((strip) => {
    const errors: string[] = [];
    const seen: number[] = [];
    const edge = strip.getBoundingClientRect();
    const clef = strip.closest('.strip-window')!.querySelector<HTMLElement>('.strip-clef')!;
    const oldStyle = clef.getAttribute('style');
    const wasInert = clef.inert;
    clef.inert = false;
    clef.style.setProperty('pointer-events', 'auto', 'important');
    try {
      const heads = Array.from(strip.querySelectorAll('.strip-staff .vf-notehead'));
      const columns = Array.from(strip.querySelectorAll('.strip-col'));
      if (heads.length !== columns.length) errors.push('missing noteheads/columns');
      columns.forEach((column, index) => {
        const c = column.getBoundingClientRect();
        const head = heads[index]?.getBoundingClientRect();
        if (!head || Math.abs((head.left + head.right - c.left - c.right) / 2) > 1) errors.push(`column ${index + 1} is not under its notehead`);
        const degree = column.querySelector('.strip-degree');
        if (!degree?.textContent?.trim()) { errors.push(`column ${index + 1} lacks degree`); return; }
        // After horizontal navigation, heads scrolled behind the fixed clef
        // are intentionally offscreen. Every column is required in its own
        // settled view by the caller; the initial view skips none of them.
        if (strip.scrollLeft > 0 && head && head.left < clef.getBoundingClientRect().right) return;
        const range = document.createRange();
        range.selectNodeContents(degree);
        const d = range.getBoundingClientRect();
        // Offscreen columns are reached separately, after checking the initial
        // resting view. Include any partially exposed numeral in this check.
        if (d.right <= edge.left || d.left >= edge.right) return;
        seen.push(index);
        if (d.left < edge.left || d.right > edge.right || d.top < Math.max(0, edge.top) || d.bottom > Math.min(innerHeight, edge.bottom)) errors.push(`degree ${index + 1} is clipped`);
        for (const x of [d.left + 0.25, (d.left + d.right) / 2, d.right - 0.25]) {
          for (const y of [d.top + 0.25, (d.top + d.bottom) / 2, d.bottom - 0.25]) {
            if (!column.contains(document.elementFromPoint(x, y))) errors.push(`degree ${index + 1} is covered at ${x},${y}`);
          }
        }
      });
    } finally {
      clef.inert = wasInert;
      if (oldStyle === null) clef.removeAttribute('style');
      else clef.setAttribute('style', oldStyle);
    }
    return { errors, seen };
  });
  expect(result.seen.length, 'at least one degree must be visible').toBeGreaterThan(0);
  expect(result.errors, 'whole degree numerals visible at rest and aligned with noteheads').toEqual([]);
  if (requiredIndex !== undefined) expect(result.seen, 'requested degree must be on screen').toContain(requiredIndex);
  return result.seen;
}

/** All body actions must be reachable WHOLE, without moving the pinned
 * decision or scrolling the page. Restore scroll so screenshots remain honest. */
export async function dialogButtonsFit(page: Page) {
  const errors = await page.evaluate(() => {
    const errors: string[] = [];
    for (const panel of Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], [role="alertdialog"]'))) {
      if (!panel.getClientRects().length) continue;
      const body = panel.querySelector<HTMLElement>('.sheet-body, .overflow-y-auto') ?? panel;
      const saved = body.scrollTop;
      for (const button of Array.from(panel.querySelectorAll<HTMLElement>('button'))) {
        if (!button.getClientRects().length) continue;
        if (body.contains(button)) body.scrollTop += button.getBoundingClientRect().top - body.getBoundingClientRect().top;
        const b = button.getBoundingClientRect(), p = panel.getBoundingClientRect(), s = body.contains(button) ? body.getBoundingClientRect() : p;
        if (b.top < Math.max(0, p.top, s.top) - 0.5 || b.bottom > Math.min(innerHeight, p.bottom, s.bottom) + 0.5) errors.push(button.textContent ?? button.getAttribute('aria-label') ?? 'button');
      }
      body.scrollTop = saved;
    }
    return errors;
  });
  expect.soft(errors, '8: every dialog button fits when reached').toEqual([]);
}

export async function toastsFitAtRest(page: Page) {
  const faults = await page.evaluate(() => {
    const region = document.querySelector('.toast-region');
    if (!region) return ['missing toast region'];
    const r = region.getBoundingClientRect();
    const limit = document.querySelector('[data-testid="instrument-dock"]')?.getBoundingClientRect().top ?? innerHeight;
    return Array.from(region.querySelectorAll<HTMLElement>('.toast-card')).flatMap((card) => {
      if (card.hasAttribute('data-toast-queued')) return card.inert && card.getAttribute('aria-hidden') === 'true' && getComputedStyle(card).visibility === 'hidden' ? [] : ['queued card is exposed'];
      const c = card.getBoundingClientRect();
      return c.top >= r.top - 0.5 && c.bottom <= Math.min(r.bottom, limit - 8, innerHeight) + 0.5 ? [] : [`toast clipped before scrolling: ${card.textContent}`];
    });
  });
  expect.soft(faults, '7: every toast is whole at rest or explicitly queued').toEqual([]);
}
