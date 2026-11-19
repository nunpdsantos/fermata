import { test, expect, type Browser, type Page } from '@playwright/test';
import { audit, seededBrowser, LANDSCAPE, LAPTOP, PHONE, PHONE_320, TABLET, type Lang, type View } from './helpers/wave1';

/**
 * The design rules (e2e/helpers/designAudit.ts: type ≥ 12 px, targets ≥ 36 / 44 px, contrast, no sideways scroll,
 * nothing cut off) on the guitar practice sheet's new sentences (music audit 2, 18 November 2026):
 *  - M37: the fingering editor's lines on a finger it does not offer (C major, Scale in 3rds, together, step 1),
 *    and the line on a clash saved before (the E of that pair given finger 3, as release 16 could save it);
 *  - M41: the barré and its string span (B major, (p+a) i m i, step 1).
 * Phone, landscape phone, tablet (touch) and laptop (mouse), day and night; PT and ES at 390 and 320 px.
 */

const THEMES = [{ name: 'day', mode: 'fermata' }, { name: 'night', mode: 'fermata-night' }] as const;
const WORDS = {
  en: { technical: 'Technical set', right: 'Right hand', edit: 'Edit fingering' },
  pt: { technical: 'Conjunto técnico', right: 'Mão direita', edit: 'Editar dedilhação' },
  es: { technical: 'Conjunto técnico', right: 'Mano derecha', edit: 'Editar digitación' },
} as const;
const CLASH = { 'fermata-fingering-v1': JSON.stringify({ state: { overrides: { 'route:1|standard|C|major|thirds-together|1|0|2|2': 3 }, labelMode: 'finger' }, version: 1 }) };

async function openSheet(browser: Browser, v: View, theme: string, lang: Lang, key: { natural: string; accidental: string }, extra: Record<string, string> = {}) {
  const { context, page } = await seededBrowser(browser, v, {
    themeMode: theme, language: lang, lastView: 'explore', instrument: 'guitar', selectedKey: key, selectedScale: 'major',
  }, extra, { lang });
  await page.goto('/');
  await page.getByTestId('practice-open').click();
  const sheet = page.getByTestId('practice-sheet');
  await expect(sheet.getByTestId('practice-player')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  return { context, page, sheet };
}

async function at(page: Page, v: View, where: string, target: ReturnType<Page['getByTestId']>) {
  await target.first().scrollIntoViewIfNeeded();
  await audit(page, v, where);
}

const cases: { v: View; lang: Lang; themes: readonly (typeof THEMES)[number][] }[] = [
  ...[PHONE, LANDSCAPE, TABLET, LAPTOP].map((v) => ({ v, lang: 'en' as Lang, themes: THEMES })),
  ...(['pt', 'es'] as const).flatMap((lang) => [PHONE, PHONE_320].map((v) => ({ v, lang, themes: [THEMES[0]] as const }))),
];

for (const { v, lang, themes } of cases) for (const theme of themes) {
  const combo = `guitar-practice-${v.name}-${theme.name}-${lang}`;
  const w = WORDS[lang];
  test(`${combo}: the fingers not offered, a saved clash, the barré span`, async ({ browser }) => {
    const c = { natural: 'C', accidental: '' };
    const first = await openSheet(browser, v, theme.mode, lang, c);
    await first.sheet.getByRole('tab', { name: w.technical, exact: true }).click();
    await first.sheet.getByTestId('practice-exercise').selectOption('thirds-together');
    await first.sheet.getByRole('button', { name: w.edit }).click();
    await expect(first.sheet.getByTestId('practice-finger-busy')).toHaveCount(2);
    await at(first.page, v, `${combo}--fingers-not-offered`, first.sheet.getByTestId('practice-finger-busy').last());
    await first.context.close();

    const clash = await openSheet(browser, v, theme.mode, lang, c, CLASH);
    await clash.sheet.getByRole('tab', { name: w.technical, exact: true }).click();
    await clash.sheet.getByTestId('practice-exercise').selectOption('thirds-together');
    await expect(clash.sheet.getByTestId('practice-clash')).toHaveCount(1);
    await at(clash.page, v, `${combo}--saved-clash`, clash.sheet.getByTestId('practice-clash'));
    await clash.context.close();

    const barre = await openSheet(browser, v, theme.mode, lang, { natural: 'B', accidental: '' });
    await barre.sheet.getByRole('tab', { name: w.right, exact: true }).click();
    await barre.sheet.getByTestId('practice-pattern').selectOption('p+a-i-m-i');
    await expect(barre.sheet.getByTestId('practice-barre')).toHaveCount(1);
    await at(barre.page, v, `${combo}--barre`, barre.sheet.getByTestId('practice-barre'));
    await barre.context.close();
  });
}
