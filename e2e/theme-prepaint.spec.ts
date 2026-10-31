import { test, expect } from '@playwright/test';

/**
 * Audit W9-14 under the REAL Content-Security-Policy (vite preview serves
 * vercel.json's headers; the dev server sends none, so this skips there).
 *
 * A saved night theme must be on the page before React renders anything (no
 * light flash), and the CSP must allow the inline pre-paint script by its
 * hash — a wrong hash is silently blocked in production.
 */
test('saved night theme applies before first render, with no CSP violation', async ({ page }) => {
  const res = await page.request.get('/');
  test.skip(!res.headers()['content-security-policy'], 'Needs the production CSP (vite preview)');

  await page.addInitScript(() => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'fermata-night' }, version: 6 }));
    const w = window as unknown as { __csp: string[]; __nightAt: number | null };
    w.__csp = [];
    w.__nightAt = null;
    document.addEventListener('securitypolicyviolation', (e) => w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
    new MutationObserver(() => {
      if (w.__nightAt === null && document.documentElement?.classList.contains('fermata-night')) {
        // How much of the app existed when night arrived: -1 = #root not even parsed yet.
        const root = document.getElementById('root');
        w.__nightAt = root ? root.childElementCount : -1;
      }
    // Observe the document (the <html> element may not exist yet when this runs).
    }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  });

  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  const { csp, nightAt, themeColor } = await page.evaluate(() => {
    const w = window as unknown as { __csp: string[]; __nightAt: number | null };
    return {
      csp: w.__csp,
      nightAt: w.__nightAt,
      themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
    };
  });
  expect(csp).toEqual([]);
  expect(nightAt).not.toBeNull();
  expect(nightAt!).toBeLessThanOrEqual(0); // before React put anything in #root
  expect(themeColor).toBe('#181208');
});
