import type { Page } from '@playwright/test';

/**
 * Design-system audit of whatever the page shows right now (W11-A, D-28):
 *  - text size: every rendered text node's computed font-size (SVG text at its
 *    on-screen size) against a floor (12 px);
 *  - tap targets: every enabled control's box against a minimum (44 px with a
 *    coarse pointer, 36 px with a mouse);
 *  - contrast: every text colour against the background actually painted
 *    under it (HTML: the ancestor background layers composited; SVG text: the
 *    shape drawn beneath it), WCAG 2.x — 4.5:1, 3:1 for large text;
 *  - horizontal page scroll.
 *
 * Deliberate exemptions (each listed so a reader can judge them):
 *  - the instrument's playing surface (piano keys, fret cells): their size is
 *    the instrument's geometry, not a control size (WCAG 2.5.8 "essential");
 *  - links / buttons inside running text (WCAG 2.5.8 "inline");
 *  - disabled controls (WCAG 1.4.3 "inactive user interface components");
 *  - visually hidden text (sr-only) and fully transparent text.
 */
export interface AuditOptions {
  minFontPx: number;
  minTapPx: number;
  /** Extra selector of elements whose tap size is exempt. */
  tapExempt?: string;
}

export interface FontHit { px: number; where: string; text: string }
export interface TapHit { w: number; h: number; where: string; name: string }
export interface ContrastHit { ratio: number; required: number; fg: string; bg: string; where: string; text: string }

export interface AuditResult {
  textNodes: number;
  minFont: FontHit | null;
  fontViolations: FontHit[];
  targets: number;
  minTap: TapHit | null;
  tapViolations: TapHit[];
  minContrast: ContrastHit | null;
  contrastViolations: ContrastHit[];
  hScroll: { scrollWidth: number; clientWidth: number };
}

/** The tap-size exemption for the instrument's playing surface. */
export const INSTRUMENT_SURFACE = '[data-fret], [data-piano-key], [data-open-string]';

export async function auditPage(page: Page, opts: AuditOptions): Promise<AuditResult> {
  return page.evaluate(pageAudit, { ...opts, tapExempt: [INSTRUMENT_SURFACE, opts.tapExempt].filter(Boolean).join(', ') });
}

// Runs in the browser. Self-contained: no closures over Node-side values.
function pageAudit(opts: AuditOptions): AuditResult {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const colorCache = new Map<string, [number, number, number, number]>();
  /** Any CSS colour → sRGB bytes + alpha, by painting one pixel. */
  const rgba = (css: string): [number, number, number, number] => {
    const hit = colorCache.get(css);
    if (hit) return hit;
    let v: [number, number, number, number] = [0, 0, 0, 0];
    if (css && css !== 'transparent' && css !== 'none') {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      v = [d[0], d[1], d[2], d[3] / 255];
    }
    colorCache.set(css, v);
    return v;
  };
  const over = (fg: number[], a: number, bg: number[]) => [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
  const lum = (c: number[]) => {
    const ch = (v: number) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2]);
  };
  const ratio = (a: number[], b: number[]) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const hex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const describe = (el: Element) => {
    const parts: string[] = [];
    let e: Element | null = el;
    for (let i = 0; e && i < 3; i++, e = e.parentElement) {
      const id = e.id ? `#${e.id}` : '';
      const role = e.getAttribute('role') ? `[role=${e.getAttribute('role')}]` : '';
      const label = e.getAttribute('aria-label') ? `[aria-label="${e.getAttribute('aria-label')!.slice(0, 30)}"]` : '';
      const tid = e.getAttribute('data-testid') ? `[data-testid=${e.getAttribute('data-testid')}]` : '';
      parts.push(`${e.tagName.toLowerCase()}${id}${role}${tid}${label}`);
    }
    return parts.join(' < ');
  };

  const rootBg = (() => {
    for (const e of [document.body, document.documentElement]) {
      const c = rgba(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) return over(c, c[3], [255, 255, 255]);
    }
    return [255, 255, 255];
  })();

  /** The colour painted under `el`: its own and its ancestors' background layers. */
  const backgroundOf = (el: Element): number[] => {
    const layers: [number, number, number, number][] = [];
    for (let e: Element | null = el; e; e = e.parentElement) {
      const c = rgba(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) {
        layers.push(c);
        if (c[3] >= 0.999) break;
      }
    }
    let bg = rootBg;
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], layers[i][3], bg);
    return bg;
  };

  const opacityChain = (el: Element) => {
    let o = 1;
    for (let e: Element | null = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
    return o;
  };

  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    if (el.closest('[inert]')) return false;
    // sr-only: clipped to nothing.
    for (let e: Element | null = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.clip === 'rect(0px, 0px, 0px, 0px)' || s.clipPath === 'inset(50%)') return false;
    }
    return true;
  };

  const inactive = (el: Element) => !!el.closest(':disabled, [aria-disabled="true"]');

  // ── Text: size + contrast ──────────────────────────────────────────────
  const fontViolations: FontHit[] = [];
  const contrastViolations: ContrastHit[] = [];
  let minFont: FontHit | null = null;
  let minContrast: ContrastHit | null = null;
  let textNodes = 0;

  const textEls = new Set<Element>();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent || !n.textContent.trim()) continue;
    const p = n.parentElement;
    if (!p || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'OPTION', 'TITLE'].includes(p.tagName)) continue;
    textEls.add(p);
  }
  document.querySelectorAll('select, input[type="text"], input[type="search"], input:not([type]), textarea').forEach((e) => textEls.add(e));

  for (const el of textEls) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const isSvg = el instanceof SVGElement;
    let px = parseFloat(cs.fontSize);
    if (isSvg) {
      const m = (el as SVGGraphicsElement).getScreenCTM?.();
      if (m) px *= Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
    }
    const fg = rgba(isSvg ? cs.fill : cs.color);
    const alpha = fg[3] * (isSvg ? Number(cs.fillOpacity || 1) : 1) * opacityChain(el);
    if (alpha < 0.05) continue;
    textNodes++;
    const text = (el.textContent || (el as HTMLInputElement).value || '').trim().slice(0, 40);
    const where = describe(el);
    px = Math.round(px * 100) / 100;
    const fh = { px, where, text };
    if (!minFont || px < minFont.px) minFont = fh;
    if (px < opts.minFontPx - 0.01) fontViolations.push(fh);

    if (inactive(el)) continue;
    let bg = backgroundOf(el);
    if (isSvg) {
      // The shape painted beneath the text (circle-of-fifths wedge, dot…):
      // the last geometry earlier in the same <svg> whose fill contains the
      // text's centre. Pure geometry, so it works for off-screen text too.
      const text = el as SVGGraphicsElement;
      const svg = text.ownerSVGElement;
      const tctm = text.getScreenCTM();
      if (svg && tctm) {
        const bb = text.getBBox();
        const centre = new DOMPoint(bb.x + bb.width / 2, bb.y + bb.height / 2).matrixTransform(tctm);
        const shapes = Array.from(svg.querySelectorAll('path, rect, circle, ellipse, polygon')) as SVGGeometryElement[];
        for (let i = shapes.length - 1; i >= 0; i--) {
          const s = shapes[i];
          if (!(s.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
          const ss = getComputedStyle(s);
          if (ss.display === 'none' || ss.visibility === 'hidden') continue;
          const f = rgba(ss.fill);
          const a = f[3] * Number(ss.fillOpacity || 1) * opacityChain(s);
          if (a < 0.05) continue;
          const sctm = s.getScreenCTM();
          if (!sctm) continue;
          const p = centre.matrixTransform(sctm.inverse());
          if (s.isPointInFill(new DOMPoint(p.x, p.y))) {
            bg = over(f, a, bg);
            break;
          }
        }
      }
    }
    const fgOnBg = over(fg, alpha, bg);
    const weight = Number(cs.fontWeight) || 400;
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    const required = large ? 3 : 4.5;
    const r = Math.round(ratio(fgOnBg, bg) * 100) / 100;
    const ch = { ratio: r, required, fg: hex(fgOnBg), bg: hex(bg), where, text };
    if (!minContrast || r / required < minContrast.ratio / minContrast.required) minContrast = ch;
    if (r < required - 0.005) contrastViolations.push(ch);
  }

  // ── Tap targets ────────────────────────────────────────────────────────
  const tapViolations: TapHit[] = [];
  let minTap: TapHit | null = null;
  let targets = 0;
  const TARGETS = [
    'a[href]', 'button', 'select', 'textarea', 'summary',
    'input:not([type="hidden"])',
    '[role="button"]', '[role="tab"]', '[role="radio"]', '[role="checkbox"]', '[role="switch"]',
    '[role="menuitem"]', '[role="menuitemradio"]', '[role="option"]', '[role="slider"]', '[role="separator"][tabindex]',
  ].join(', ');
  const seen = new Set<Element>();
  for (const raw of Array.from(document.querySelectorAll(TARGETS))) {
    let el: Element = raw;
    if (raw instanceof HTMLInputElement && (raw.type === 'checkbox' || raw.type === 'radio' || raw.type === 'file')) {
      const label = raw.closest('label');
      if (label) el = label;
      else if (raw.type === 'file' && getComputedStyle(raw).display === 'none') continue;
    }
    if (seen.has(el)) continue;
    seen.add(el);
    if (!visible(el)) continue;
    if (inactive(raw)) continue;
    if (opts.tapExempt && el.matches(opts.tapExempt)) continue;
    // A link or button inside a sentence (WCAG 2.5.8 "inline": its size is
    // set by the line of text around it).
    if ((el.tagName === 'A' || el.tagName === 'BUTTON') && el.parentElement && Array.from(el.parentElement.childNodes).some((c) => c !== el && c.nodeType === 3 && c.textContent!.trim())) continue;
    targets++;
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width * 10) / 10;
    const h = Math.round(r.height * 10) / 10;
    const name = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40);
    const th = { w, h, where: describe(el), name };
    if (!minTap || Math.min(w, h) < Math.min(minTap.w, minTap.h)) minTap = th;
    if (Math.min(w, h) < opts.minTapPx - 0.5) tapViolations.push(th);
  }

  const se = document.scrollingElement ?? document.documentElement;
  return {
    textNodes,
    minFont,
    fontViolations,
    targets,
    minTap,
    tapViolations,
    minContrast,
    contrastViolations,
    hScroll: { scrollWidth: se.scrollWidth, clientWidth: se.clientWidth },
  };
}
