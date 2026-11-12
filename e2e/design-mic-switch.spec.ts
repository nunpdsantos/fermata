import { test, expect, type Browser, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import { auditPage, type AuditResult } from './helpers/designAudit';
import { smallScreenAssertions, dialogButtonsFit } from './helpers/smallScreenAssertions';
import { launchWithFakeMic, micContext, micFixture, RECORD_STREAMS } from './helpers/micFixtures';

/**
 * Brief U: the ONE microphone switch under the design system's rules (type
 * ≥ 12 px, targets ≥ 44 px on touch / 36 px with a mouse, contrast on what is
 * painted, nothing cut off, no sideways scroll) — off, asking (the sentence
 * before the browser is asked, and the browser asking), on, and off with a
 * problem — in the three places it appears: the top bar in Explore, inline
 * in a check answered on the instrument, at the top of the tuner. Phone
 * 390×844, phone sideways 844×390, tablet 768×1024 (touch) and laptop
 * 1440×900, day and night; PT and ES at 320 and 360 px; reduced motion.
 *
 * Also: the phone's top bar at 320, 360, 390 and 430 px in EN, PT and ES
 * (the three tabs whole, every control a full --tap target; where Search
 * moved, logged), and from 640 px up the switch moves nothing else in the
 * top bar, measured with and without it in the same run.
 *
 * DESIGN_AUDIT_OUT=<dir> writes a screenshot of each screen at 390×844,
 * 844×390 and 1440×900.
 */

const VIEWPORTS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, touch: true },
  { name: 'phone-landscape', viewport: { width: 844, height: 390 }, touch: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, touch: true },
  { name: 'laptop', viewport: { width: 1440, height: 900 }, touch: false },
] as const;
const THEMES = [
  { name: 'day', mode: 'fermata' },
  { name: 'night', mode: 'fermata-night' },
] as const;
type Viewport = { name: string; viewport: { width: number; height: number }; touch: boolean };
type Lang = 'en' | 'pt' | 'es';
type Place = 'bar' | 'check' | 'tuner';
const OUT = process.env.DESIGN_AUDIT_OUT;
const SHOT_SIZES = new Set(['390x844', '844x390', '1440x900']);
let base = '';

const WORDS = {
  en: { mic: 'Microphone', on: 'On', off: 'Off', allow: 'Turn on the microphone', more: 'More', tuner: 'Tuner', checkStart: 'Start the check', submit: 'Submit', next: /^(Continue|Next)$/, check: 'Check Answer', tabs: ['Explore', 'Learn', 'Drill'] },
  pt: { mic: 'Microfone', on: 'Ligado', off: 'Desligado', allow: 'Ligar o microfone', more: 'Mais', tuner: 'Afinador', checkStart: 'Começar a verificação', submit: 'Enviar', next: /^(Continuar|Seguinte)$/, check: 'Verificar resposta', tabs: ['Explorar', 'Aprender', 'Treino'] },
  es: { mic: 'Micrófono', on: 'Activado', off: 'Desactivado', allow: 'Activar el micrófono', more: 'Más', tuner: 'Afinador', checkStart: 'Empezar la comprobación', submit: 'Enviar', next: /^(Continuar|Siguiente)$/, check: 'Comprobar respuesta', tabs: ['Explorar', 'Aprender', 'Práctica'] },
} as const;

const ASKING = () => {
  navigator.mediaDevices.getUserMedia = () => new Promise(() => undefined);
};
const REFUSED = () => {
  navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('refused', 'NotAllowedError'));
};

async function open(browser: Browser, v: Viewport, theme: string, state: Record<string, unknown>, lang: Lang, init?: () => void, path = '/') {
  const context = await micContext(browser, base, { viewport: v.viewport, isMobile: v.touch, hasTouch: v.touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify({ state: { themeMode: theme, language: lang, ...state }, version: 6 }));
  await context.addInitScript(RECORD_STREAMS);
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  await page.goto(path);
  await expect(page.locator('#root')).not.toBeEmpty();
  await page.waitForTimeout(800);
  return { context, page };
}

function expectClean(r: AuditResult, where: string) {
  const fmt = (xs: unknown[]) => JSON.stringify(xs.slice(0, 5), null, 1);
  expect.soft(r.textNodes, `${where}: audited no text — the sweep did not run`).toBeGreaterThan(5);
  expect.soft(r.fontViolations, `${where}: text below 12 px ${fmt(r.fontViolations)}`).toEqual([]);
  expect.soft(r.tapViolations, `${where}: small tap targets ${fmt(r.tapViolations)}`).toEqual([]);
  expect.soft(r.contrastViolations, `${where}: low contrast ${fmt(r.contrastViolations)}`).toEqual([]);
  expect.soft(r.hScroll.scrollWidth, `${where}: horizontal page scroll`).toBeLessThanOrEqual(r.hScroll.clientWidth + 1);
  expect.soft(r.clipViolations, `${where}: text cut off ${fmt(r.clipViolations)}`).toEqual([]);
}

async function settle(page: Page) {
  const snapshot = () => page.evaluate(() => {
    const running = document.getAnimations().filter((a) => a.playState === 'running' || a.pending).length;
    let sig = '';
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      if (el.closest('.tuner-meter')) continue; // the needle follows the sound
      const cs = getComputedStyle(el);
      if (cs.opacity !== '1' || cs.transform !== 'none') sig += `${cs.opacity}|${cs.transform};`;
    }
    return { running, sig };
  });
  const start = Date.now();
  let prev = await snapshot();
  let quietSince = Date.now();
  while (Date.now() - start < 5000) {
    await page.waitForTimeout(60);
    const now = await snapshot();
    if (now.running > 0 || now.sig !== prev.sig) quietSince = Date.now();
    prev = now;
    if (Date.now() - quietSince >= 300) return;
  }
  throw new Error('the page never stopped moving (5 s)');
}

/** The switch as it must read in every state: a toggle named in the learner's language, its state in words, on not by colour alone, nothing moving. */
async function expectSwitch(page: Page, place: Place, lang: Lang, on: boolean, where: string) {
  const w = WORDS[lang];
  const sw = page.locator(`[data-testid="mic-switch"][data-place="${place}"]`);
  await expect(sw, where).toHaveCount(1);
  await expect(sw).toHaveAttribute('aria-pressed', on ? 'true' : 'false');
  await expect(sw).toHaveAccessibleName(w.mic);
  const look = await sw.evaluate((el) => {
    const icon = el.querySelector('.mic-switch-icon')!;
    const text = el.querySelector('.mic-switch-text') as HTMLElement;
    const dot = el.querySelector('.mic-switch-dot');
    const anim = [el, ...Array.from(el.querySelectorAll('*'))].map((e) => getComputedStyle(e).animationName).filter((n) => n !== 'none');
    return {
      mask: getComputedStyle(icon).maskImage || getComputedStyle(icon).webkitMaskImage,
      words: getComputedStyle(text).display === 'none' ? null : text.textContent,
      dot: dot !== null,
      // An animation (a pulse), not the colour's short transition as the state changes.
      moving: el.getAnimations({ subtree: true }).filter((x) => x instanceof CSSAnimation).length + anim.length,
      box: el.getBoundingClientRect().toJSON() as DOMRect,
    };
  });
  // The words: wherever they are drawn (inline always; the top bar from 1200 px).
  const wordy = place !== 'bar' || page.viewportSize()!.width >= 1200;
  expect.soft(look.words, `${where}: the switch's words`).toBe(wordy ? `${w.mic} ${on ? w.on : w.off}` : null);
  expect.soft(look.dot, `${where}: the dot (on only)`).toBe(on);
  expect.soft(look.mask, `${where}: the icon`).toContain(on ? "rx='3' fill='black'" : 'M4 4l16 16');
  expect.soft(look.moving, `${where}: nothing pulses (reduced motion)`).toBe(0);
  return look;
}

async function check(page: Page, v: Viewport, combo: string, screen: string) {
  await settle(page);
  await smallScreenAssertions(page, screen);
  await dialogButtonsFit(page);
  const r = await auditPage(page, { minFontPx: 12, minTapPx: v.touch ? 44 : 36 });
  if (OUT && SHOT_SIZES.has(`${v.viewport.width}x${v.viewport.height}`)) {
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: `${OUT}/mic-${combo}--${screen}.png` });
  }
  expectClean(r, `${combo} ${screen}`);
}

/** Where the switch is, opened: Explore (its top bar), a chord_build check, the tuner over Explore. */
async function reach(browser: Browser, v: Viewport, theme: string, lang: Lang, place: Place, init?: () => void) {
  const w = WORDS[lang];
  if (place === 'check') {
    const { context, page } = await open(browser, v, theme, { instrument: 'piano', lastView: 'learn' }, lang, init, '/?lesson=l1u3m4');
    const start = page.getByRole('button', { name: w.checkStart });
    await expect(start).toBeAttached({ timeout: 15_000 });
    await start.scrollIntoViewIfNeeded();
    await start.click();
    await expect(page.getByTestId('check-mic')).toBeVisible();
    await page.getByTestId('check-mic').scrollIntoViewIfNeeded();
    return { context, page, scope: page.getByTestId('check-mic') };
  }
  const { context, page } = await open(browser, v, theme, { instrument: 'guitar', lastView: 'explore' }, lang, init);
  await expect(page.getByTestId('explore-root')).toBeVisible({ timeout: 15_000 });
  if (place === 'bar') return { context, page, scope: page.getByTestId('mic-bar-note') };
  await page.getByRole('button', { name: w.more, exact: true }).click();
  await page.getByRole('menuitem', { name: w.tuner }).click();
  const sheet = page.getByTestId('tuner-sheet');
  await expect(sheet).toBeVisible();
  return { context, page, scope: sheet };
}

/** Off, the sentence before asking, on (and off again); then, each on its own page, the browser asking and refused. */
async function screens(browser: Browser, v: Viewport, theme: string, combo: string, lang: Lang, place: Place) {
  const w = WORDS[lang];
  const sw = (page: Page) => page.locator(`[data-testid="mic-switch"][data-place="${place}"]`);
  {
    const { context, page, scope } = await reach(browser, v, theme, lang, place);
    await expectSwitch(page, place, lang, false, `${combo} ${place}-off`);
    await check(page, v, combo, `${place}-off`);
    await sw(page).click();
    await expect(scope.getByRole('button', { name: w.allow })).toBeVisible();
    await expect(sw(page)).toHaveAttribute('data-state', 'asking');
    await expectSwitch(page, place, lang, false, `${combo} ${place}-asking-why`);
    await check(page, v, combo, `${place}-asking-why`);
    await scope.getByRole('button', { name: w.allow }).click();
    await expect(sw(page)).toHaveAttribute('data-state', 'on', { timeout: 10_000 });
    await expectSwitch(page, place, lang, true, `${combo} ${place}-on`);
    await check(page, v, combo, `${place}-on`);
    await sw(page).click();
    await expect(sw(page)).toHaveAttribute('data-state', 'off');
    await context.close();
  }
  for (const [state, init] of [['asking-browser', ASKING], ['problem', REFUSED]] as const) {
    const { context, page, scope } = await reach(browser, v, theme, lang, place, init);
    await sw(page).click();
    await scope.getByRole('button', { name: w.allow }).click();
    await expect(sw(page)).toHaveAttribute('data-state', state === 'problem' ? 'problem' : 'asking', { timeout: 10_000 });
    if (state === 'problem') await expect(page.getByTestId(place === 'tuner' ? 'tuner-message' : 'mic-problem')).toBeVisible();
    await expectSwitch(page, place, lang, false, `${combo} ${place}-${state}`);
    await check(page, v, combo, `${place}-${state}`);
    await context.close();
  }
}

test.describe('the microphone switch: off, asking, on, a problem — in the top bar, in a check, in the tuner', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await launchWithFakeMic(micFixture('design-mic-e2', [{ midi: 40, cents: -20, seconds: 2.4 }, { silence: 0.1 }]));
  });
  test.afterAll(async () => {
    await browser.close();
  });

  for (const v of VIEWPORTS) {
    for (const th of THEMES) {
      for (const place of ['bar', 'check', 'tuner'] as const) {
        const combo = `${v.name}-${th.name}`;
        test(`${combo}: ${place}`, async ({ baseURL }) => {
          base = baseURL!;
          test.setTimeout(180_000);
          await screens(browser, v, th.mode, combo, 'en', place);
        });
      }
    }
  }

  for (const lang of ['pt', 'es'] as const) {
    for (const v of [
      { name: 'phone320', viewport: { width: 320, height: 568 }, touch: true },
      { name: 'phone360', viewport: { width: 360, height: 740 }, touch: true },
    ]) {
      test(`${v.name}-${lang}: the switch's words fit and read in all three places`, async ({ baseURL }) => {
        base = baseURL!;
        test.setTimeout(300_000);
        for (const place of ['bar', 'check', 'tuner'] as const) await screens(browser, v, 'fermata', `${v.name}-day-${lang}`, lang, place);
      });
    }
  }
});


/**
 * The top bar holds still (brief U2): the switch is offered only where a
 * played note can be used, so the bar keeps its place by width — 360–639 px
 * the switch takes the magnifier's place where it is offered ("Search" first
 * in "⋯"), elsewhere main's bar; below 360 px and from 640 to 1023 px an
 * empty, inert slot of its width where it is not offered; from 1024 px no
 * slot. Measured in Explore, Learn, Drill, a check answered on the instrument
 * (l1u3m4) and the tour, each at every width (the window resized in place),
 * on a touch screen up to 1024 px and with a mouse from 640 px.
 */
const WIDTHS = [320, 344, 360, 390, 393, 412, 430, 639, 640, 667, 744, 768, 820, 1023, 1024, 1200, 1440];
const touchWidths = (touch: boolean) => WIDTHS.filter((w) => (touch ? w <= 1024 : w >= 640));
type Where = 'explore' | 'learn' | 'drill' | 'tour' | 'check';
// The check last: a check left unfinished is restored by the next load (and the tour is not started over work in progress).
const WHERE: Where[] = ['explore', 'learn', 'drill', 'tour', 'check'];
const MORE_WORDS = {
  en: { search: 'Search', searchButton: 'Quick search, Command+K', tour: 'Show me around' },
  pt: { search: 'Pesquisar', searchButton: 'Pesquisa rápida, Command+K', tour: 'Mostra-me como funciona' },
  es: { search: 'Buscar', searchButton: 'Búsqueda rápida, Command+K', tour: 'Enséñame cómo funciona' },
} as const;
const NO_MIC = () => {
  if (navigator.mediaDevices) Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: undefined });
};
const MEASURE_OUT = process.env.MIC_BAR_OUT;

/** The top bar's tabs and controls, measured. */
const topBar = (page: Page) => page.evaluate(() => {
  const bar = document.querySelector('.app-topbar')!;
  const tabs = document.querySelector('.app-tabs')!;
  const track = tabs.getBoundingClientRect();
  let worstEdge = Infinity;
  for (const tab of Array.from(tabs.querySelectorAll('button'))) {
    const range = document.createRange();
    range.selectNodeContents(tab);
    const t = range.getBoundingClientRect();
    worstEdge = Math.min(worstEdge, t.left - track.left, track.right - t.right);
  }
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const controls = Array.from(bar.querySelectorAll('button')).filter((b) => (b as HTMLElement).offsetParent !== null).map((b) => {
    const r = b.getBoundingClientRect();
    return { name: (b.getAttribute('aria-label') ?? b.textContent ?? '').trim().slice(0, 24), x: r1(r.left), w: r1(r.width), h: r1(r.height) };
  });
  const slot = bar.querySelector('[data-testid="mic-slot"]') as HTMLElement | null;
  const brand = bar.querySelector('.app-brand')!.getBoundingClientRect();
  return {
    tabsLeft: track.left,
    tabsWidth: track.width,
    worstEdge: r1(worstEdge),
    tabsWhole: Array.from(tabs.querySelectorAll('button')).every((b) => b.scrollWidth <= b.clientWidth + 0.5),
    controls,
    slot: slot && slot.offsetParent !== null ? { x: r1(slot.getBoundingClientRect().left), w: r1(slot.getBoundingClientRect().width) } : null,
    brand: [r1(brand.left), r1(brand.width)],
    search: controls.some((c) => /Command/.test(c.name)),
    pageScroll: document.documentElement.scrollWidth - innerWidth,
    barScroll: bar.scrollWidth - bar.clientWidth,
  };
});
type Bar = Awaited<ReturnType<typeof topBar>>;

async function barSession(browser: Browser, lang: Lang, touch: boolean, noMic = false) {
  const context = await browser.newContext({ baseURL: base, viewport: { width: touch ? 390 : 1440, height: 800 }, isMobile: touch, hasTouch: touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((l) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'fermata', language: l, lastView: 'explore', instrument: 'piano' }, version: 6 }));
    sessionStorage.setItem('__seeded', '1');
  }, lang);
  if (noMic) await context.addInitScript(NO_MIC);
  return { context, page: await context.newPage() };
}

/** Into a view (from a fresh load): Explore, Learn, Drill, the tour (from "⋯", over Explore) or a chord_build check. */
async function goTo(page: Page, lang: Lang, where: Where) {
  if (where === 'check') {
    await page.goto('/?lesson=l1u3m4');
    const start = page.getByRole('button', { name: WORDS[lang].checkStart });
    await expect(start).toBeAttached({ timeout: 15_000 });
    await start.scrollIntoViewIfNeeded();
    await start.click();
    await expect(page.getByTestId('focused-check')).toBeVisible();
  } else {
    await page.goto(`/?view=${where === 'tour' ? 'explore' : where}`);
    await expect(page.locator(`#${where === 'tour' ? 'explore' : where}-panel`)).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(`[data-tab="${where === 'tour' ? 'explore' : where}"]`)).toHaveAttribute('aria-selected', 'true');
  }
  if (where === 'tour') {
    await page.getByRole('button', { name: WORDS[lang].more, exact: true }).click();
    await page.getByRole('menuitem', { name: MORE_WORDS[lang].tour }).click();
    await expect(page.getByTestId('tour-bar')).toBeVisible({ timeout: 15_000 });
  }
  await page.evaluate(() => document.fonts.ready);
}

async function resize(page: Page, width: number) {
  await page.setViewportSize({ width, height: 800 });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.waitForTimeout(150);
}

const px = (n: number) => Math.round(n * 10) / 10;

test.describe('the top bar holds still between views (brief U2)', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    for (const touch of [true, false]) {
      test(`${lang}, ${touch ? 'touch up to 1024' : 'mouse from 640'} px: the tab strip's left edge and width the same in Explore, Learn, Drill, a check and the tour; no tab clipped; every control a full --tap; no sideways scroll`, async ({ browser, baseURL }) => {
        base = baseURL!;
        test.setTimeout(240_000);
        const tap = touch ? 44 : 36;
        const widths = touchWidths(touch);
        const { context, page } = await barSession(browser, lang, touch);
        const seen: Record<string, Record<number, Bar>> = {};
        for (const where of WHERE) {
          await goTo(page, lang, where);
          seen[where] = {};
          for (const width of widths) {
            await resize(page, width);
            const m = await topBar(page);
            seen[where][width] = m;
            const at = `${lang} ${width}px ${touch ? 'touch' : 'mouse'} ${where}`;
            // Where the switch is offered it is in the bar (known positive for the views that show it).
            const offered = where === 'explore' || where === 'check';
            expect.soft(m.controls.filter((c) => c.name === WORDS[lang].mic).length, `${at}: the switch`).toBe(offered ? 1 : 0);
            expect.soft(m.tabsWhole, `${at}: the tabs whole`).toBe(true);
            expect.soft(m.worstEdge, `${at}: every tab's word ≥ 4 px inside its pill`).toBeGreaterThanOrEqual(4);
            for (const c of m.controls) expect.soft(Math.min(c.w, c.h), `${at}: ${c.name} a full --tap (${tap} px)`).toBeGreaterThanOrEqual(tap);
            expect.soft(m.pageScroll, `${at}: no sideways scroll`).toBeLessThanOrEqual(0);
            expect.soft(m.barScroll, `${at}: the bar does not scroll`).toBeLessThanOrEqual(0);
          }
        }
        const rows: string[] = [];
        for (const width of widths) {
          const e = seen.explore[width];
          rows.push(`${lang} ${touch ? 'touch' : 'mouse'} ${String(width).padStart(4)}px  tabs ${WHERE.map((w) => `${w} ${px(seen[w][width].tabsLeft)}+${px(seen[w][width].tabsWidth)}`).join(' | ')}`);
          for (const where of WHERE) {
            const m = seen[where][width];
            expect.soft(Math.abs(m.tabsLeft - e.tabsLeft), `${lang} ${width}px ${where}: the tabs' left edge as in Explore (${px(m.tabsLeft)} / ${px(e.tabsLeft)})`).toBeLessThanOrEqual(0.5);
            expect.soft(Math.abs(m.tabsWidth - e.tabsWidth), `${lang} ${width}px ${where}: the tabs' width as in Explore (${px(m.tabsWidth)} / ${px(e.tabsWidth)})`).toBeLessThanOrEqual(0.5);
          }
        }
        console.log(rows.join('\n'));
        test.info().annotations.push({ type: 'measured', description: rows.join('\n') });
        if (MEASURE_OUT) {
          fs.mkdirSync(MEASURE_OUT, { recursive: true });
          fs.writeFileSync(`${MEASURE_OUT}/tabs-${lang}-${touch ? 'touch' : 'mouse'}.json`, JSON.stringify(seen, null, 1));
        }
        await context.close();
      });
    }
  }

  for (const lang of ['en', 'pt', 'es'] as const) {
    for (const touch of [true, false]) {
      test(`${lang}, ${touch ? 'touch' : 'mouse'}: Learn's and Drill's bar is main's (the microphone unsupported, the same run) from 360 to 639 px and from 1024 px; in Explore the switch stands exactly where Learn's magnifier stands; elsewhere the slot's shift logged`, async ({ browser, baseURL }) => {
        base = baseURL!;
        test.setTimeout(240_000);
        const widths = touchWidths(touch);
        const runs: Record<'mic' | 'none', Record<string, Record<number, Bar>>> = { mic: {}, none: {} };
        for (const kind of ['mic', 'none'] as const) {
          const { context, page } = await barSession(browser, lang, touch, kind === 'none');
          for (const where of ['learn', 'drill', 'explore'] as const) {
            await goTo(page, lang, where);
            runs[kind][where] = {};
            for (const width of widths) {
              await resize(page, width);
              runs[kind][where][width] = await topBar(page);
            }
          }
          await context.close();
        }
        const rows: string[] = [];
        for (const width of widths) {
          const phone = width >= 360 && width < 640;
          for (const where of ['learn', 'drill'] as const) {
            const withCode = runs.mic[where][width];
            const main = runs.none[where][width];
            // Known positive: without a microphone API there is no switch and no slot, anywhere.
            expect.soft(main.slot, `${lang} ${width}px ${where}: no slot without a microphone`).toBeNull();
            expect.soft(main.controls.map((c) => c.name)).not.toContain(WORDS[lang].mic);
            const shift = px(withCode.tabsLeft - main.tabsLeft);
            rows.push(`${lang} ${touch ? 'touch' : 'mouse'} ${String(width).padStart(4)}px ${where}: slot ${withCode.slot ? `at ${withCode.slot.x}+${withCode.slot.w}` : 'none'}; tabs ${px(withCode.tabsLeft)}+${px(withCode.tabsWidth)} vs main ${px(main.tabsLeft)}+${px(main.tabsWidth)} (shift ${shift})`);
            if (phone || width >= 1024) {
              expect.soft(withCode.slot, `${lang} ${width}px ${where}: no slot`).toBeNull();
              expect.soft(withCode.controls, `${lang} ${width}px ${where}: every control of the bar as on main`).toEqual(main.controls);
              expect.soft(withCode.brand, `${lang} ${width}px ${where}: the name as on main`).toEqual(main.brand);
              expect.soft(px(withCode.tabsLeft), `${lang} ${width}px ${where}: the tabs as on main`).toBe(px(main.tabsLeft));
            } else {
              // The slot stands where the switch stands in Explore.
              const sw = runs.mic.explore[width].controls.find((c) => c.name === WORDS[lang].mic);
              expect.soft(withCode.slot, `${lang} ${width}px ${where}: the slot`).not.toBeNull();
              expect.soft(withCode.slot, `${lang} ${width}px ${where}: the slot where Explore's switch is`).toEqual(sw ? { x: sw.x, w: sw.w } : 'no switch');
            }
          }
          if (phone) {
            const sw = runs.mic.explore[width].controls.find((c) => c.name === WORDS[lang].mic);
            const magnifier = runs.mic.learn[width].controls.find((c) => c.name === MORE_WORDS[lang].searchButton.slice(0, 24));
            expect.soft(magnifier, `${lang} ${width}px: Learn's magnifier (known positive)`).toBeTruthy();
            expect.soft(sw, `${lang} ${width}px: Explore's switch where Learn's magnifier stands`).toEqual(magnifier ? { ...magnifier, name: WORDS[lang].mic } : 'no magnifier');
            expect.soft(runs.mic.explore[width].search, `${lang} ${width}px: no magnifier beside the switch`).toBe(false);
          }
        }
        console.log(rows.join('\n'));
        test.info().annotations.push({ type: 'measured', description: rows.join('\n') });
        if (MEASURE_OUT) {
          fs.mkdirSync(MEASURE_OUT, { recursive: true });
          fs.writeFileSync(`${MEASURE_OUT}/main-${lang}-${touch ? 'touch' : 'mouse'}.txt`, rows.join('\n'));
        }
      });
    }
  }

  for (const lang of ['en', 'pt', 'es'] as const) {
    test(`${lang}: "Search" is reachable in every view at 320, 390, 768 and 1440 px — by the magnifier or first in "⋯", never both, never neither — and it opens Quick Search`, async ({ browser, baseURL }) => {
      base = baseURL!;
      test.setTimeout(240_000);
      const w = MORE_WORDS[lang];
      for (const touch of [true, false]) {
        const { context, page } = await barSession(browser, lang, touch);
        for (const where of WHERE) {
          await goTo(page, lang, where);
          for (const width of touch ? [320, 390, 768] : [1440]) {
            await resize(page, width);
            const at = `${lang} ${width}px ${where}`;
            const magnifier = page.locator('.app-topbar').getByRole('button', { name: w.searchButton });
            const inBar = await magnifier.isVisible();
            await page.getByRole('button', { name: WORDS[lang].more, exact: true }).click();
            const items = await page.getByRole('menuitem').allTextContents();
            const inMenu = items.filter((i) => i === w.search).length;
            expect.soft(Number(inBar) + inMenu, `${at}: Search once (bar ${inBar}, menu ${JSON.stringify(items)})`).toBe(1);
            if (inMenu) expect.soft(items[0], `${at}: Search first in "⋯"`).toBe(w.search);
            if (!inBar && !inMenu) {
              // Neither (already failed above): nothing to open here.
              await page.keyboard.press('Escape');
              continue;
            }
            if (inMenu) await page.getByRole('menuitem', { name: w.search }).click();
            else {
              await page.keyboard.press('Escape');
              await magnifier.click();
            }
            const dialog = page.getByRole('dialog', { name: 'Quick search' });
            await expect(dialog, `${at}: Quick Search opens`).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(dialog).toHaveCount(0);
          }
        }
        await context.close();
      }
    });
  }
});

test.describe('the top bar with the switch, from 1024 px', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    test(`${lang}: from 1024 px up the switch moves nothing else in the top bar (with and without it, the same run)`, async ({ browser, baseURL }) => {
      base = baseURL!;
      test.setTimeout(120_000);
      for (const width of [1024, 1200, 1280, 1440]) {
        for (const touch of width === 1440 ? [false] : [false, true]) {
          const { context, page } = await barSession(browser, lang, touch);
          await page.setViewportSize({ width, height: 800 });
          await goTo(page, lang, 'explore');
          await page.waitForTimeout(300);
          const withIt = await topBar(page);
          await page.locator('[data-testid="mic-switch"]').evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
          await page.waitForTimeout(150);
          const without = await topBar(page);
          const others = withIt.controls.filter((c) => c.name !== WORDS[lang].mic);
          test.info().annotations.push({ type: 'measured', description: `${lang} ${width}px${touch ? ' touch' : ''}: with ${JSON.stringify(withIt.controls)}; without ${JSON.stringify(without.controls)}` });
          expect(withIt.pageScroll, `${lang} ${width}: no sideways scroll`).toBeLessThanOrEqual(0);
          expect(withIt.tabsWhole).toBe(true);
          expect(others.length, 'known positive: the tabs, search and "⋯" are measured').toBe(5);
          expect(others, `${lang} ${width}${touch ? ' touch' : ''}: every other control where it was`).toEqual(without.controls);
          expect(withIt.brand).toEqual(without.brand);
          await context.close();
        }
      }
    });
  }
});
