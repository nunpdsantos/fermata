/**
 * W6-17 — the review queue in Portuguese/Spanish shows translated times and
 * intervals and the module's real name, not "In 4 days", "1 week" and
 * "Level 1 · Unit 1 · Module 1".
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ReviewQueue } from '../ReviewQueue';
import { useAppStore } from '../../../state/store';
import i18n from '../../../i18n';
import ptTitles from '../../../data/moduleTitles.pt';
import esTitles from '../../../data/moduleTitles.es';
import { MODULE_INDEX } from '../../../data/moduleIndex';
import type { CurriculumProgress } from '../../../core/types/curriculum';

const DAY = 86_400_000;

afterEach(async () => {
  cleanup();
  useAppStore.setState({ language: 'en' });
  await i18n.changeLanguage('en');
});

function progress(schedules: CurriculumProgress['reviewSchedules']): CurriculumProgress {
  return {
    completedModules: Object.keys(schedules ?? {}),
    reviewSchedules: schedules,
  } as unknown as CurriculumProgress;
}

const dueYesterday = (level: number) => ({
  completedAt: Date.now() - 10 * DAY,
  nextReviewAt: Date.now() - DAY,
  intervalLevel: level,
  reviewCount: 1,
  lastReviewedAt: Date.now() - 8 * DAY,
});

const inFourDays = {
  completedAt: Date.now() - DAY,
  nextReviewAt: Date.now() + 4 * DAY + 60_000,
  intervalLevel: 1,
  reviewCount: 0,
  lastReviewedAt: Date.now() - DAY,
};

async function setLang(lang: 'en' | 'pt' | 'es') {
  useAppStore.setState({ language: lang });
  await i18n.changeLanguage(lang);
}

describe('ReviewQueue in the app language', () => {
  it('EN: module name, interval and level title', async () => {
    await setLang('en');
    render(<ReviewQueue progress={progress({ l3u11m1: dueYesterday(2) })} onStartReview={() => {}} />);
    expect(screen.getByText(MODULE_INDEX.find((e) => e.id === 'l3u11m1')!.title)).toBeTruthy();
    expect(screen.getByText(/Interval: 1 week/)).toBeTruthy();
    expect(screen.getByText('Due now')).toBeTruthy();
    expect(screen.queryByText(/Level 3 · Unit 11 · Module 1/)).toBeNull();
  });

  it('PT: Portuguese module title, "1 semana", level title in Portuguese, no English', async () => {
    await setLang('pt');
    const { container } = render(<ReviewQueue progress={progress({ l3u11m1: dueYesterday(2) })} onStartReview={() => {}} />);
    expect(await screen.findByText(ptTitles.l3u11m1[0])).toBeTruthy();
    expect(screen.getByText(/Intervalo: 1 semana/)).toBeTruthy();
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/\b(week|days?|Due now|In \d)\b/);
    expect(text).not.toMatch(/Harmony Foundations/);
  });

  it('ES: "Próximo repaso dentro de 4 días" when all caught up', async () => {
    await setLang('es');
    render(<ReviewQueue progress={progress({ l1u1m1: inFourDays })} onStartReview={() => {}} />);
    expect(screen.getByText('Próximo repaso dentro de 4 días')).toBeTruthy();
  });

  it('PT: "Próxima revisão daqui a 4 dias" when all caught up', async () => {
    await setLang('pt');
    render(<ReviewQueue progress={progress({ l1u1m1: inFourDays })} onStartReview={() => {}} />);
    expect(screen.getByText('Próxima revisão daqui a 4 dias')).toBeTruthy();
  });

  it('ES: Spanish module title and "3 meses" interval', async () => {
    await setLang('es');
    render(<ReviewQueue progress={progress({ l6u18m1: dueYesterday(5) })} onStartReview={() => {}} />);
    expect(await screen.findByText(esTitles.l6u18m1[0])).toBeTruthy();
    expect(screen.getByText(/Intervalo: 3 meses/)).toBeTruthy();
  });
});
