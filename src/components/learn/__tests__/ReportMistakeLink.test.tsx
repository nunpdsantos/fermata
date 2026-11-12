/**
 * The link at the foot of a lesson (2026-11-12): a real link to the report
 * form in the learner's language, opened in a new tab with no opener and no
 * referrer, the lesson's id and title in its details box; no mailto and no
 * email address. Offline, the tap says so and goes nowhere. Expected words
 * come from the locale files.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import i18n from '../../../i18n';
import { useToastStore } from '../../../state/toastStore';
import { REPORT_FORMS } from '../../../services/reportProblem';
import { ReportMistakeLink } from '../ReportMistakeLink';

type Locale = { learn: { reportMistake: string }; report: { offline: string } };
const locale = (lang: string) => JSON.parse(readFileSync(join(__dirname, '../../../i18n/locales', `${lang}.json`), 'utf8')) as Locale;

afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  useToastStore.setState({ toasts: [] });
  await i18n.changeLanguage('en');
});

describe('ReportMistakeLink', () => {
  it.each(['en', 'pt', 'es'] as const)('%s: the form for the language, the lesson in the details, a new tab', async (lang) => {
    await i18n.changeLanguage(lang);
    render(<ReportMistakeLink moduleId="l1u3m4" moduleTitle="Intervalos «básicos» & mais" />);
    const link = screen.getByRole('link', { name: locale(lang).learn.reportMistake });
    const href = link.getAttribute('href')!;
    const form = REPORT_FORMS[lang];
    expect(href.startsWith(`${form.url}?usp=pp_url&entry.${form.detailsEntry}=`)).toBe(true);
    const details = new URL(href).searchParams.get(`entry.${form.detailsEntry}`)!;
    expect(details.split(' · ').slice(0, 4)).toEqual(['learn', 'l1u3m4', 'Intervalos «básicos» & mais', lang]);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(href).not.toMatch(/mailto:|@/);
    // Keeps its look and its tap height.
    expect(link.className).toContain('min-h-(--tap)');
    expect(link.className).toContain('text-caption');
  });

  it('online, a tap is left to the browser (no notice, not prevented)', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    render(<ReportMistakeLink moduleId="l1u1m1" moduleTitle="The Staff and Clefs" />);
    const link = screen.getByRole('link', { name: locale('en').learn.reportMistake });
    // jsdom does not navigate; fireEvent returns false only when the default was prevented.
    expect(fireEvent.click(link)).toBe(true);
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it('offline: the notice, and the tap goes nowhere', async () => {
    await i18n.changeLanguage('es');
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    render(<ReportMistakeLink moduleId="l1u1m1" moduleTitle="El pentagrama" />);
    const link = screen.getByRole('link', { name: locale('es').learn.reportMistake });
    expect(fireEvent.click(link)).toBe(false);
    expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual([locale('es').report.offline]);
  });

  it('no email address and no mailto anywhere in the component\'s source', () => {
    const source = readFileSync(join(__dirname, '../ReportMistakeLink.tsx'), 'utf8');
    expect(source).not.toMatch(/mailto:/);
    expect(source).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });
});
