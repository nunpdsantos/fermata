/**
 * A Drill session or a Sprint saved before the A12 update (audit A12,
 * 2026-11-18) resumes after it — in Portuguese and Spanish, now with
 * translated interval names, seventh-chord names and clauses — and answering
 * by the translated chips is graded exactly as before.
 *
 * What a save holds is item ids (the queue, the verdict on screen, the Sprint
 * pool), never text: the text is rendered from the bank at every load, so a
 * translation that changes between releases changes what the resumed
 * question SAYS, never which question it is or how it is graded (W7-09 /
 * W9b; useDrillRunner `currentKnownId`, SprintRunner `setUpRun`). The saves
 * here are written by the drill store itself (src/state/drillStore.ts is
 * byte-identical to 6de6c0e, so these are exactly what the old release
 * wrote), plus the real v2 save `fixtures/drill-v2-store.json`.
 *
 * A "reload" is a fresh module graph (vi.resetModules), as in DrillReload.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { generateDrillBank } from '../../core/utils/drillBank';
import type { DrillItem } from '../../core/types/drill';
import { DRILL_FAMILIES } from '../../core/types/drill';
import v2Fixture from '../../state/__tests__/fixtures/drill-v2-store.json';

vi.mock('../../components/drill/answerAudio', () => ({ playAnswerAudio: vi.fn() }));

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  function makeMotion(tag: string) {
    const cached = cache.get(tag);
    if (cached) return cached;
    const Comp = function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
    cache.set(tag, Comp);
    return Comp;
  }
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    motion: proxy,
    m: proxy,
    useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

const BANK: DrillItem[] = generateDrillBank({ includeRead: true });
const BY_ID = new Map(BANK.map((i) => [i.id, i]));
const item = (id: string) => BY_ID.get(id)!;
const ALL_FAMILIES = Object.fromEntries(DRILL_FAMILIES.map((f) => [f, f !== 'read'])) as Record<(typeof DRILL_FAMILIES)[number], boolean>;
const DRILL_KEY = 'fermata-drill-v1';

type Lang = 'pt' | 'es';
type StoreModule = typeof import('../../state/drillStore');
let store: StoreModule['useDrillStore'];

/** Load the app's Drill modules afresh, the app set to `lang`, and render the view. */
async function pageLoad(lang: Lang | 'en') {
  localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: lang }, version: 6 }));
  vi.resetModules();
  const { DrillView } = await import('../DrillView');
  store = (await import('../../state/drillStore')).useDrillStore;
  render(<DrillView />);
}

async function leaveAndReload(lang: Lang) {
  act(() => {
    window.dispatchEvent(new Event('pagehide'));
  });
  cleanup();
  await pageLoad(lang);
}

const known = (ids: string[]) =>
  Object.fromEntries(ids.map((id) => [id, {
    card: { due: 0, stability: 5, difficulty: 5, elapsed_days: 0, scheduled_days: 5, reps: 3, lapses: 0, state: 2, learning_steps: 0 },
    history: [], tier: 'review' as const, introCorrectCount: 1,
  }]));

const QUEUE = [
  'interval:pair-to-name:C:E',
  'function:chord-function:G:ii',
  'seventh:notes-to-name:C#:half_diminished7',
  'interval:semitones-to-name:6',
  'interval:note-above:F#:M3',
];

/** As the old release left it: a session whose first answer was wrong, its verdict on screen. */
async function saveSessionMidway() {
  await pageLoad('en');
  act(() => {
    store.getState().resetDrillData();
    store.getState().updateSettings({ families: ALL_FAMILIES, length: 12, newPerSession: 12, followLessons: false });
    store.setState({
      introDone: true,
      items: known(QUEUE),
      activeSession: {
        id: 's1', queue: [...QUEUE], index: 0, asked: 0, correct: 0, startedAt: 1_000, seed: 7, missRequeues: {},
      },
    });
    store.getState().recordAnswer(item(QUEUE[0]), false, 900, 2_000);
  });
  const saved = JSON.parse(localStorage.getItem(DRILL_KEY)!);
  expect(saved.version).toBe(3);
  expect(saved.state.activeSession.feedback).toEqual({ itemId: QUEUE[0], correct: false, nearMiss: false });
  return saved;
}

const WORDS = {
  pt: { wrong: 'Não é bem isso', continue: 'Continuar', correct: 'Correto' },
  es: { wrong: 'Incorrecto', continue: 'Continuar', correct: 'Correcto' },
} as const;

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});

describe('a session saved before the update resumes after it, translated', () => {
  const EXPECT = {
    pt: {
      question: 'De C até E é que intervalo?',
      verdict: 'Não é bem isso — 3.ª maior',
      why: 'Conta primeiro as letras, depois define a qualidade pelos meios-tons. A resposta é 3.ª maior.',
      chips: ['3.ª menor', '2.ª maior', '3.ª maior', '4.ª perfeita'],
      fnPrompt: 'Em G maior, A menor (ii) funciona como…?',
      fnAnswer: 'Subdominante (pré-dominante)',
      fnWhy: 'O acorde de A menor puxa para longe da tónica — cria tensão em direção a V — é essa a sua função harmónica.',
      quality: 'Meio-diminuto',
      tritone: 'Trítono',
      noteAbove: 'Uma 3.ª maior acima de F♯?',
    },
    es: {
      question: '¿Cuál es el intervalo de C a E?',
      verdict: 'Incorrecto — 3.ª mayor',
      why: 'Cuenta primero las letras y luego fija la cualidad por semitonos. La respuesta es 3.ª mayor.',
      chips: ['3.ª menor', '2.ª mayor', '3.ª mayor', '4.ª justa'],
      fnPrompt: 'En G mayor, ¿qué función tiene A menor (ii)?',
      fnAnswer: 'Subdominante (predominante)',
      fnWhy: 'El acorde de A menor tira lejos de la tónica — crea tensión hacia V — esa es su función armónica.',
      quality: 'Semidisminuido',
      tritone: 'Tritono',
      noteAbove: '¿Una 3.ª mayor por encima de F♯?',
    },
  } as const;

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang.toUpperCase()}: same question, same verdict, translated; every answer by its translated chip is graded right`, async () => {
      const saved = await saveSessionMidway();
      const e = EXPECT[lang];
      await leaveAndReload(lang);

      // The saved session is the one in force, untouched by the load.
      expect(store.getState().activeSession).toEqual(saved.state.activeSession);

      // The verdict on screen resumes: the interval's answer and explanation in the learner's language.
      expect(screen.getByText(e.question)).toBeTruthy();
      expect(document.body.textContent).toContain(e.verdict);
      expect(screen.getByText(e.why)).toBeTruthy();
      for (const chip of e.chips) expect(screen.getByRole('button', { name: chip })).toBeTruthy();
      expect(document.body.textContent).not.toMatch(/Major|Minor|Perfect/);

      fireEvent.click(screen.getByRole('button', { name: WORDS[lang].continue }));

      // Function item: answered by its translated chip, graded right; its clause translated.
      expect(screen.getByText(e.fnPrompt)).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: e.fnAnswer }));
      expect(store.getState().activeSession!.correct).toBe(1);
      expect(screen.getByText(WORDS[lang].correct)).toBeTruthy();
      expect(screen.getByText(e.fnWhy)).toBeTruthy();
      act(() => vi.advanceTimersByTime(600));

      // Seventh item: root, then the translated quality chip.
      fireEvent.click(screen.getByRole('button', { name: 'C♯' }));
      fireEvent.click(screen.getByRole('button', { name: e.quality }));
      expect(store.getState().activeSession!.correct).toBe(2);
      act(() => vi.advanceTimersByTime(600));

      // Semitone item: the tritone by its translated name.
      fireEvent.click(screen.getByRole('button', { name: e.tritone }));
      expect(store.getState().activeSession!.correct).toBe(3);
      act(() => vi.advanceTimersByTime(600));

      // The missed interval comes back (requeued, as before): its translated chip is right now.
      expect(screen.getByText(e.question)).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: e.chips[2] }));
      expect(store.getState().activeSession!.correct).toBe(4);
      act(() => vi.advanceTimersByTime(600));

      // Note-above: the question names the interval in the learner's language.
      expect(screen.getByText(e.noteAbove)).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'A♯' }));
      expect(store.getState().activeSession!.correct).toBe(5);
      expect(store.getState().activeSession!.asked).toBe(6);
    });
  }

  it('a wrong translated chip is graded wrong (the chips submit the bank\'s values, not their labels)', async () => {
    await saveSessionMidway();
    await leaveAndReload('pt');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dominante' }));
    expect(store.getState().activeSession!.correct).toBe(0);
    expect(document.body.textContent).toContain('Não é bem isso — Subdominante (pré-dominante)');
  });
});

describe('the real v2 save (fixtures/drill-v2-store.json) resumes in PT and ES', () => {
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang.toUpperCase()}: loads exactly, shows the question at its pointer, grades its translated chip`, async () => {
      localStorage.setItem(DRILL_KEY, JSON.stringify(v2Fixture));
      await pageLoad(lang);
      const s = store.getState().activeSession!;
      expect(s).toEqual(v2Fixture.state.activeSession);
      expect(store.getState().items).toEqual(v2Fixture.state.items);
      // The pointer's question (index 3): "roman:degree-to-chord:C:major:1".
      expect(s.queue[s.index]).toBe('roman:degree-to-chord:C:major:1');
      expect(screen.getByText(lang === 'pt' ? 'O que é I em C maior?' : '¿Qué es I en C mayor?')).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: lang === 'pt' ? 'C maior' : 'C mayor' }));
      expect(store.getState().activeSession!.correct).toBe(3);
    });
  }
});

describe('a Sprint saved before the update resumes after it, translated', () => {
  const POOL = [
    'interval:pair-to-name:F:B',
    'interval:semitones-to-name:12',
    'function:chord-function:C:I',
    'interval:pair-to-name:E:F',
    'function:chord-function:D:V',
  ];

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang.toUpperCase()}: same run, same score and clock; the translated chips are graded right`, async () => {
      await pageLoad('en');
      const { sprintFamiliesKey } = await import('../../components/drill/sprintSelectors');
      act(() => {
        store.getState().resetDrillData();
        store.getState().updateSettings({ families: ALL_FAMILIES, followLessons: false });
        store.setState({ introDone: true, items: known(POOL), activeSession: null });
        store.getState().saveSprint({
          seed: 42, pool: [...POOL], step: 1, correct: 1, secondsLeft: 40,
          familiesKey: sprintFamiliesKey(ALL_FAMILIES), priorBest: 0, recorded: false,
        });
      });
      await leaveAndReload(lang);

      expect(screen.getByText('40s')).toBeTruthy();
      expect(store.getState().sprint).toMatchObject({ seed: 42, pool: POOL, step: 1, correct: 1 });
      // pool[1]: 12 semitones → the octave, by its translated name.
      fireEvent.click(screen.getByRole('button', { name: lang === 'pt' ? 'Oitava' : 'Octava' }));
      // pool[2]: C in C major is the tonic.
      fireEvent.click(screen.getByRole('button', { name: 'Tónica' }));
      // pool[3]: E up to F is a minor 2nd.
      fireEvent.click(screen.getByRole('button', { name: '2.ª menor' }));
      act(() => vi.advanceTimersByTime(0));
      expect(store.getState().sprint).toMatchObject({ step: 4, correct: 4 });
    });
  }
});
