/**
 * "Report a problem" (2026-11-12): the form per language, the details line
 * (exactly the listed fields, in order, capped), and the tap — offline a
 * notice and nothing opened, online the exact address in a new tab without
 * an opener or a referrer. `window.open` is mocked: no test contacts Google.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  REPORT_DETAILS_MAX,
  REPORT_FORMS,
  REPORT_TITLE_MAX,
  openReportForm,
  reportDetails,
  reportForm,
  reportUrl,
  type ReportEnvironment,
} from '../reportProblem';
import { useToastStore } from '../../state/toastStore';

const ENV: ReportEnvironment = { release: 12, buildDate: '2026-11-12', width: 390, height: 844, userAgent: 'TestBrowser/1.0 (Phone)' };

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  useToastStore.setState({ toasts: [] });
});

/** The pre-filled value, read back from the address as a browser would. */
const detailsOf = (url: string, entry: string) => new URL(url).searchParams.get(`entry.${entry}`);

describe('the form for a language', () => {
  it.each([
    ['en', 'en'], ['en-GB', 'en'], ['pt', 'pt'], ['pt-PT', 'pt'], ['pt-BR', 'pt'], ['PT', 'pt'],
    ['es', 'es'], ['es-419', 'es'], ['es_ES', 'es'], ['fr', 'en'], ['de-DE', 'en'], ['', 'en'], ['cimode', 'en'],
  ] as const)('%s → the %s form', (language, form) => {
    expect(reportForm(language)).toBe(REPORT_FORMS[form]);
    expect(reportUrl(language, 'x').startsWith(`${REPORT_FORMS[form].url}?usp=pp_url&entry.${REPORT_FORMS[form].detailsEntry}=`)).toBe(true);
  });

  it('three forms, each a docs.google.com viewform address with a numeric details entry', () => {
    expect(Object.keys(REPORT_FORMS).sort()).toEqual(['en', 'es', 'pt']);
    for (const form of Object.values(REPORT_FORMS)) {
      const url = new URL(form.url);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('docs.google.com');
      expect(url.pathname).toMatch(/^\/forms\/d\/e\/[\w-]+\/viewform$/);
      expect(url.search).toBe('');
      expect(form.detailsEntry).toMatch(/^\d+$/);
    }
  });
});

describe('the pre-filled address', () => {
  it('is <form>?usp=pp_url&entry.<id>=<encodeURIComponent(details)>, exactly', () => {
    const details = 'learn · l1u1m1 · A clave de Sol «e» de Fá · pt · release 12 (2026-11-12) · 390×844 · UA/1 & x=y?#';
    const url = reportUrl('pt-PT', details);
    expect(url).toBe(`${REPORT_FORMS.pt.url}?usp=pp_url&entry.${REPORT_FORMS.pt.detailsEntry}=${encodeURIComponent(details)}`);
    // Accents, «», ×, ·, &, ?, # and spaces all survive the trip.
    expect(detailsOf(url, REPORT_FORMS.pt.detailsEntry)).toBe(details);
    // Nothing raw in the value: it is the last parameter, and none of these characters is left unencoded.
    expect(url.slice(url.lastIndexOf('=') + 1)).not.toMatch(/[ «»×·#&?=]/u);
  });
});

describe('the details line', () => {
  it('from the menu: view · language · release (date) · screen · user agent, nothing else', () => {
    expect(reportDetails({ view: 'explore', language: 'en' }, ENV)).toBe('explore · en · release 12 (2026-11-12) · 390×844 · TestBrowser/1.0 (Phone)');
    expect(reportDetails({ view: 'drill', language: 'es' }, ENV)).toBe('drill · es · release 12 (2026-11-12) · 390×844 · TestBrowser/1.0 (Phone)');
  });

  it('from a lesson: the module id and title come after the view', () => {
    expect(reportDetails({ view: 'learn', language: 'pt', module: { id: 'l1u1m1', title: 'A Pauta e as Claves' } }, ENV))
      .toBe('learn · l1u1m1 · A Pauta e as Claves · pt · release 12 (2026-11-12) · 390×844 · TestBrowser/1.0 (Phone)');
  });

  it('a build with no date (dev, tests) says "dev"', () => {
    expect(reportDetails({ view: 'learn', language: 'en' }, { ...ENV, release: 0, buildDate: null })).toBe('learn · en · release 0 (dev) · 390×844 · TestBrowser/1.0 (Phone)');
  });

  it('by default reads this build and this window (under Vitest: release 0, dev)', () => {
    vi.stubGlobal('innerWidth', 320);
    vi.stubGlobal('innerHeight', 568);
    const line = reportDetails({ view: 'explore', language: 'en' });
    expect(line).toBe(`explore · en · release 0 (dev) · 320×568 · ${navigator.userAgent}`);
  });

  it('cuts a lesson title to 60 characters (accents count as one)', () => {
    const title = 'É'.repeat(59) + 'ção' + 'x'.repeat(20);
    const line = reportDetails({ view: 'learn', language: 'pt', module: { id: 'l9u1m1', title } }, ENV);
    const shown = line.split(' · ')[2];
    expect(Array.from(shown)).toHaveLength(REPORT_TITLE_MAX);
    expect(shown).toBe('É'.repeat(59) + 'ç');
    // A title of exactly 60 is kept whole.
    const sixty = 'a'.repeat(60);
    expect(reportDetails({ view: 'learn', language: 'en', module: { id: 'm', title: sixty } }, ENV).split(' · ')[2]).toBe(sixty);
  });

  it('caps the whole line at 600 characters by cutting the user agent, never the fields before it', () => {
    const userAgent = 'U'.repeat(2000);
    const module = { id: 'l1u1m1', title: 'T'.repeat(200) };
    const line = reportDetails({ view: 'learn', language: 'en', module }, { ...ENV, userAgent });
    expect(Array.from(line)).toHaveLength(REPORT_DETAILS_MAX);
    const head = `learn · l1u1m1 · ${'T'.repeat(60)} · en · release 12 (2026-11-12) · 390×844 · `;
    expect(line.startsWith(head)).toBe(true);
    expect(line.slice(head.length)).toBe('U'.repeat(REPORT_DETAILS_MAX - head.length));
    // A short user agent is kept whole and the line stays under the cap.
    expect(Array.from(reportDetails({ view: 'learn', language: 'en', module }, ENV)).length).toBeLessThan(REPORT_DETAILS_MAX);
  });

  it('carries exactly the listed fields: no address, no saved data, no settings', () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'pt', secret: 'saved-progress-marker' } }));
    const line = reportDetails({ view: 'explore', language: 'en' }, ENV);
    expect(line.split(' · ')).toEqual(['explore', 'en', 'release 12 (2026-11-12)', '390×844', 'TestBrowser/1.0 (Phone)']);
    expect(line).not.toContain('saved-progress-marker');
    expect(line).not.toContain(window.location.href);
    expect(line).not.toMatch(/https?:/);
    localStorage.removeItem('music-theory-app');
  });
});

describe('the tap', () => {
  it('online: opens the exact address in a new tab with noopener,noreferrer, and says nothing', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const url = reportUrl('es', 'explore · es');
    openReportForm(url, 'offline notice');
    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it('offline: the one-line notice through the toast, and nothing opened', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    openReportForm(reportUrl('en', 'x'), 'You are offline (test).');
    expect(open).not.toHaveBeenCalled();
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toMatchObject({ message: 'You are offline (test).', type: 'warning' });
  });
});
