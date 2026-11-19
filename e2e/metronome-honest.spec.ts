import { test, expect, type Page } from '@playwright/test';
import { seededBrowser, LAPTOP, PHONE, LANDSCAPE, TABLET, type View } from './helpers/wave1';

/**
 * Audit fixes, 18 November 2026 (stream E), Q9 — the metronome's bar, as the
 * wave-3 design has it (CLAUDE.md "Metronome"): a fixed overlay above the
 * instrument; while it stands over the foot of the view, Learn's and
 * Explore's scrollers end below it; not in Drill (going into Drill stops it).
 *
 *  - It never covers content that cannot be moved out from under it: on
 *    Learn's overview, a lesson and a check, and in Explore, at a laptop, a
 *    short laptop, a tablet, a phone and a phone on its side, every line of
 *    text and every control under the bar can be scrolled clear of it. Known
 *    positive: with Learn's scroller unable to scroll, the cards under the
 *    bar are found stuck.
 *  - Honest state: a metronome that is sounding always has a way to stop it
 *    on screen, and one that is hidden is not sounding. Drill: it stops on the
 *    way in, no bar, nothing queued; back in Explore, the bar, stopped. The
 *    landscape full-neck view, which covers the whole app (top bar, "⋯" and
 *    the bar with it): opening it stops the metronome (before: it went on
 *    clicking behind an opaque layer, with nothing on screen to stop it);
 *    closing it brings the bar back, stopped.
 *
 * "Sounding" is read on the metronome's audio seam (`pendingClicks()` of
 * services/metronome/clickVoice.ts and the bar's `data-running`), so this
 * spec runs on the dev server only.
 */

test.beforeEach(async ({ request }) => {
  const res = await request.get('/src/services/metronome/clickVoice.ts');
  const dev = res.ok() && (res.headers()['content-type'] ?? '').includes('javascript');
  test.skip(!dev, 'the clicks are read through the dev server\'s own module: skipped on the production build');
});

const pending = (page: Page) =>
  page.evaluate(`(async () => (await import('/src/services/metronome/clickVoice.ts')).pendingClicks())()`) as Promise<number>;
const running = (page: Page) =>
  page.evaluate(`(async () => (await import('/src/services/metronome/metronome.ts')).isMetronomeRunning())()`) as Promise<boolean>;
const clickCount = (page: Page) =>
  page.evaluate(`(async () => (await import('/src/services/metronome/clickVoice.ts')).clickLog().length)()`) as Promise<number>;
/** Silent: the clock stopped, nothing queued, and no click handed over for `ms` (several beats at 80). */
async function expectSilent(page: Page, ms = 2000) {
  await expect.poll(() => running(page)).toBe(false);
  const before = await clickCount(page);
  await page.waitForTimeout(ms);
  expect(await clickCount(page), 'no click handed over since').toBe(before);
  expect(await pending(page)).toBe(0);
}
const bar = (page: Page) => page.getByRole('region', { name: 'Metronome' });

async function openApp(browser: import('@playwright/test').Browser, v: View, settings: Record<string, unknown>, url = '/') {
  const { context, page } = await seededBrowser(browser, v, { themeMode: 'fermata', language: 'en', instrument: 'piano', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', ...settings });
  await page.goto(url);
  await expect(page.getByTestId('app-topbar')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);
  return { context, page };
}

async function openMetronome(page: Page) {
  await page.getByRole('button', { name: /^More/ }).click();
  await page.getByRole('menuitem', { name: 'Metronome' }).click();
  await expect(bar(page)).toHaveAttribute('data-measured', 'true');
  await page.waitForTimeout(400);
}

/** Every leaf text and control under the bar that no scroll position of its scroll ancestors takes clear of it. */
async function stuckUnderBar(page: Page) {
  return page.evaluate(() => {
    const barEl = document.querySelector('[data-testid="metronome"]') as HTMLElement;
    const b = barEl.getBoundingClientRect();
    const under = (r: DOMRect) => r.width > 0 && r.height > 0 && r.bottom > b.top + 1 && r.top < b.bottom - 1 && r.right > b.left + 1 && r.left < b.right - 1;
    const leaves = Array.from(document.querySelectorAll('#root *')).filter((el) => {
      const e = el as HTMLElement;
      if (barEl.contains(e) || e.closest('[data-testid="instrument-dock"], .app-topbar')) return false;
      const own = Array.from(e.childNodes).some((c) => c.nodeType === 3 && (c.textContent ?? '').trim());
      if (!own && !e.matches('button, a, input, select, [role="button"]')) return false;
      const cs = getComputedStyle(e);
      return cs.visibility !== 'hidden' && cs.opacity !== '0' && under(e.getBoundingClientRect());
    }) as HTMLElement[];
    const stuck: string[] = [];
    for (const el of leaves) {
      let freed = false;
      for (let p = el.parentElement; p && !freed; p = p.parentElement) {
        const cs = getComputedStyle(p);
        if (!/(auto|scroll)/.test(cs.overflowY) || p.scrollHeight <= p.clientHeight + 1) continue;
        const start = p.scrollTop;
        for (let y = 0; y <= p.scrollHeight - p.clientHeight + 16 && !freed; y += 16) {
          p.scrollTop = y;
          if (!under(el.getBoundingClientRect())) freed = true;
        }
        p.scrollTop = start;
      }
      if (!freed) stuck.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}"`);
    }
    return { covered: leaves.length, stuck };
  });
}

test.describe('the bar never covers what cannot be moved out from under it', () => {
  const SHORT: View = { name: 'laptop-1366', viewport: { width: 1366, height: 768 }, touch: false };
  for (const v of [LAPTOP, SHORT, TABLET, PHONE, LANDSCAPE]) {
    test(`${v.name}: Learn's overview, a lesson, its check, and Explore`, async ({ browser }) => {
      test.setTimeout(90_000);
      const { context, page } = await openApp(browser, v, { lastView: 'learn' });
      await openMetronome(page);
      const report: Record<string, { covered: number; stuck: string[] }> = {};
      report.overview = await stuckUnderBar(page);
      await page.getByText('Foundations of Music Literacy').first().click();
      await page.getByText('The Staff and Clefs').first().click();
      await expect(page.getByRole('heading', { level: 1, name: 'The Staff and Clefs' })).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(600);
      report.lesson = await stuckUnderBar(page);
      const rail = page.getByTestId('section-rail');
      if (await rail.isVisible()) await rail.locator('[data-section-link="check"]').click();
      else await page.getByTestId('section-picker').getByRole('button', { name: 'Check' }).click();
      await page.getByRole('button', { name: 'Start the check' }).click();
      await expect(page.getByTestId('check-prompt')).toBeVisible();
      await page.waitForTimeout(600);
      report.check = await stuckUnderBar(page);
      await page.getByRole('tab', { name: 'Explore' }).click();
      await expect(page.getByTestId('explore-header')).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(600);
      report.explore = await stuckUnderBar(page);
      console.log(`${v.name} under the bar: ${JSON.stringify(report)}`);
      for (const [where, r] of Object.entries(report)) expect(r.stuck, `${v.name} ${where}`).toEqual([]);
      await context.close();
    });
  }

  test('known positive: with Learn\'s scroller unable to scroll, the cards under the bar are stuck', async ({ browser }) => {
    const { context, page } = await openApp(browser, LAPTOP, { lastView: 'learn' });
    await openMetronome(page);
    await page.addStyleTag({ content: '.learn-scroll { overflow: hidden !important; }' });
    const r = await stuckUnderBar(page);
    expect(r.stuck.length).toBeGreaterThan(0);
    await context.close();
  });
});

test.describe('a metronome that sounds can be stopped on screen; a hidden one does not sound', () => {
  test('Drill: it stops on the way in, no bar, nothing queued; back in Explore the bar, stopped', async ({ browser }) => {
    const { context, page } = await openApp(browser, LAPTOP, { lastView: 'explore' });
    await openMetronome(page);
    await page.getByTestId('metronome-play').click();
    await expect(bar(page)).toHaveAttribute('data-running', 'true');
    await expect.poll(() => clickCount(page)).toBeGreaterThan(2);
    await page.getByRole('tab', { name: 'Drill' }).click();
    await expect(page.locator('#drill-panel')).toBeVisible({ timeout: 15_000 });
    await expect(bar(page)).toHaveCount(0);
    await expectSilent(page);
    await page.getByRole('tab', { name: 'Explore' }).click();
    await expect(bar(page)).toBeVisible();
    await expect(bar(page)).not.toHaveAttribute('data-running', 'true');
    await context.close();
  });

  test('landscape: the full neck covers the whole app — opening it stops the metronome; closing it brings the bar back, stopped', async ({ browser }) => {
    const { context, page } = await openApp(browser, LANDSCAPE, { lastView: 'explore', instrument: 'guitar' });
    await expect(page.getByTestId('instrument-dock')).toBeVisible();
    await openMetronome(page);
    await page.getByTestId('metronome-play').click();
    await expect(bar(page)).toHaveAttribute('data-running', 'true');
    await expect.poll(() => clickCount(page)).toBeGreaterThan(2);
    await page.getByTestId('neck-open').click();
    await expect(page.getByTestId('neck-view')).toBeVisible();
    // Nothing on screen could stop it here (no top bar, no "⋯", the bar under the view): it is not sounding.
    await expectSilent(page);
    await expect(bar(page)).toHaveCount(0);
    await page.getByRole('button', { name: 'Close full neck' }).click();
    await expect(page.getByTestId('neck-view')).toHaveCount(0);
    await expect(bar(page)).toBeVisible();
    await expect(bar(page)).not.toHaveAttribute('data-running', 'true');
    // ▶ works again there.
    await page.getByTestId('metronome-play').click();
    await expect(bar(page)).toHaveAttribute('data-running', 'true');
    await context.close();
  });
});
