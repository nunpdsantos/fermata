/**
 * W4b's Learn screens in Portuguese and Spanish carry no English: the lesson
 * with its section picker and Try This, the focused check (a first miss with
 * its hint, a melody item with its reference line, a rhythm item), the result
 * screen, the unlock dialog and the unit milestone — text, aria-labels and
 * titles, on translated content (the real overlays). A known positive proves
 * the check flags the English screens.
 */
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import i18n from '../index';
import type { CurriculumLevel } from '../../core/types/curriculum';
import type { ContentLanguage } from '../content/types';

vi.mock('../../components/notation/StaffNotation', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }) };
});
vi.mock('../../core/services/audio', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../core/services/audio')>();
  return { ...original, resumeAudio: vi.fn().mockResolvedValue(undefined), playNote: vi.fn(), playPitchedNotes: vi.fn(), playScale: vi.fn(), playTimedNotes: vi.fn(), stopPlayback: vi.fn() };
});

import { ModuleView } from '../../components/learn/ModuleView';
import { ExerciseRunner } from '../../components/learn/exercises/ExerciseRunner';
import { UnlockLevelNotice } from '../../components/learn/lesson/UnlockLevel';
import { MilestoneSheet } from '../../components/learn/lesson/MilestoneSheet';
import { loadLevel, getDefaultProgress } from '../../data/curriculumLoader';
import { levelCorpus } from '../../data/exercises/__tests__/learnCorpus';
import { useAppStore } from '../../state/store';
import { useLearnSessionStore } from '../../state/learnSessionStore';

const ENGLISH = [
  'Lesson sections', 'Section', "What you'll learn", 'On your piano', 'On your guitar', 'tasks?', 'Check', 'questions?',
  'Next lesson', 'Try This', 'Hear it', 'Show on the', 'Open in Explore', 'Ready to check yourself', 'Start the check',
  'about', 'a hint before any answer', 'Exit', 'Submit', 'Continue', 'Hint', 'Not quite', 'have another go', 'already tried',
  'the answer', 'your answer', 'check finished', 'practice', 'You need', 'to pass', 'Nothing is lost', 'What to look at again',
  'you said', 'then', 'it is', 'Re-read', 'Practise', 'Start over', 'Back to the lesson', 'Right first time',
  'Unlock', 'This level follows', 'builds on', 'Nothing you have done', 'Cancel', 'Unit complete', 'What you can do now',
  'Melody', 'First you hear', 'the key chord', 'middle C', 'Replay', 'Play the rhythm', 'A rhythm in', 'quarter note',
  'half note', 'whole note', 'eighth note', 'rest', 'Pairs with', 'Level', 'Close',
];
const ENGLISH_RE = new RegExp(`(?<![\\p{L}])(${ENGLISH.join('|')})(?![\\p{L}])`, 'u');

function englishIn(container: HTMLElement): string[] {
  const found = new Set<string>();
  const check = (where: string, text: string | null) => {
    if (!text) return;
    const m = ENGLISH_RE.exec(text);
    if (m) found.add(`${where}: "${m[1]}" in "${text.trim().slice(0, 70)}"`);
  };
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) check('text', n.textContent);
  for (const el of container.querySelectorAll('[aria-label], [title]')) {
    check('aria-label', el.getAttribute('aria-label'));
    check('title', el.getAttribute('title'));
  }
  return [...found];
}

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(() => {
  cleanup();
  useLearnSessionStore.setState({ screen: null, check: null });
});
afterAll(async () => {
  await i18n.changeLanguage('en');
});

async function lessonOf(lang: ContentLanguage, levelId: string, moduleId: string) {
  const level = (await loadLevel(levelId, lang)) as CurriculumLevel;
  const unit = level.units.find((u) => u.modules.some((m) => m.id === moduleId))!;
  const module = unit.modules.find((m) => m.id === moduleId)!;
  const exercises = levelCorpus(level.number, lang).filter((i) => i.moduleId === moduleId).map((i) => i.exercise);
  return { level, unit, module, exercises };
}

function renderLesson(l: Awaited<ReturnType<typeof lessonOf>>) {
  return render(
    <div data-learn-scroll="">
      <ModuleView
        module={l.module} unit={l.unit} level={l.level} unitIndex={0} moduleIndex={0}
        isModuleCompleted={false} isTaskCompleted={() => false} completedTaskCount={0}
        exercises={l.exercises} exercisesState="ready" exercisesPassed={false} levelCompletedModuleCount={0}
        onToggleTask={() => {}} onCompleteModule={() => {}} onRecordExerciseResult={() => {}} onExercisesComplete={() => {}}
        onBack={() => {}} onBackToLevels={() => {}} onNavigateModule={() => {}}
      />
    </div>,
  );
}

/** Answer every question wrong twice (or once, for two options), so each is missed. */
function failAll() {
  for (let i = 0; i < 40; i++) {
    const answers = screen.queryByTestId('check-answers');
    if (!answers) return;
    const open = [...answers.querySelectorAll('button')].filter((b) => !(b as HTMLButtonElement).disabled && b.getAttribute('data-state') === 'open');
    const final = answers.querySelector('[data-state="answer"]');
    if (final) {
      fireEvent.click(screen.getByRole('button', { name: i18n.t('common.continue') }));
      continue;
    }
    fireEvent.click(open[open.length - 1]);
    const submit = screen.getAllByRole('button').filter((b) => b.closest('[data-testid="check-thumb"]') && !b.closest('[data-testid="check-answers"]'));
    fireEvent.click(submit[submit.length - 1]);
  }
}

describe('a known positive: the English screens are flagged', () => {
  it('EN lesson and check', async () => {
    await i18n.changeLanguage('en');
    useAppStore.setState({ language: 'en', instrument: 'piano' });
    renderLesson(await lessonOf('en', 'l1', 'l1u2m1'));
    expect(englishIn(document.body).length).toBeGreaterThan(3);
  });
});

describe.each(['pt', 'es'] as const)('%s: the Learn screens have no English', (lang) => {
  beforeAll(async () => {
    await i18n.changeLanguage(lang);
    useAppStore.setState({ language: lang, instrument: 'piano', view: 'learn' });
  });

  it('lesson (picker, Try This, a rhythm), check with a miss and its hint, result screen', async () => {
    const l = await lessonOf(lang, 'l1', 'l1u2m1');
    renderLesson(l);
    expect(englishIn(document.body)).toEqual([]);
    fireEvent.click(screen.getByTestId('section-picker').querySelector('button')!);
    expect(englishIn(document.body)).toEqual([]);
    cleanup();
    renderLesson(l);
    fireEvent.click(screen.getByRole('button', { name: lang === 'pt' ? 'Começar a verificação' : 'Empezar la comprobación' }));
    expect(screen.getByTestId('focused-check')).toBeTruthy();
    // a first miss
    const answers = screen.getByTestId('check-answers').querySelectorAll('button');
    fireEvent.click(answers[answers.length - 1]);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(englishIn(document.body)).toEqual([]);
    failAll();
    expect(screen.getByTestId('check-result')).toBeTruthy();
    expect(englishIn(document.body)).toEqual([]);
  });

  it('a melody item with its reference line', async () => {
    const ex = levelCorpus(9, lang).find((i) => i.exercise.id === 'l9u32m2e6')!.exercise;
    render(<ExerciseRunner exercises={[ex]} accentColor="#8b5cf6" title="x" onRecordResult={() => {}} onComplete={() => {}} onExit={() => {}} />);
    expect(englishIn(document.body)).toEqual([]);
  });

  it('the unlock dialog and a unit milestone', async () => {
    const l3 = (await loadLevel('l3', lang)) as CurriculumLevel;
    render(<UnlockLevelNotice level={l3} progress={getDefaultProgress()} />);
    fireEvent.click(screen.getByRole('button', { name: lang === 'pt' ? 'Desbloquear mesmo assim' : 'Desbloquear de todos modos' }));
    expect(englishIn(document.body)).toEqual([]);
    cleanup();
    const l1 = (await loadLevel('l1', lang)) as CurriculumLevel;
    render(<MilestoneSheet unit={l1.units[1]} accent="#2563eb" onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(englishIn(document.body)).toEqual([]);
  });
});
