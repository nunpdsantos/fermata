/**
 * The second QA report, Drill (audit 2, 19 November 2026): P4 and P6, in the
 * view, as the learner meets them.
 *
 *  - P4. "Reading (guitar)" (294 cards of finding the note on the guitar's
 *    neck) was on for every learner who had never set it, a piano learner
 *    included. Now, with no recorded choice, it is on only while the
 *    learner's instrument is the guitar: derived when read
 *    (services/drillFollow.ts `readingInForce`), saved only when the learner
 *    touches its chip or starts a session. A learner with Drill history and
 *    no recorded choice (a save from before reading) keeps it on, as before.
 *  - P6. Every topic could be switched off and Start then "ran" a session of
 *    nothing ("Session complete · 0 of 0 correct", and "New session" looped
 *    back to it). Now no empty session starts, whatever the reason (the
 *    rule "Follow my lessons" already had: one rule, `sessionHasNothing`):
 *    the intro stands in, says why, and offers the settings.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { DrillView } from '../DrillView';
import { useDrillStore, DRILL_STORE_KEY } from '../../state/drillStore';
import { useAppStore } from '../../state/store';
import { generateDrillBank } from '../../core/utils/drillBank';
import { DRILL_FAMILIES, type DrillFamily } from '../../core/types/drill';
import { PROGRESS_STORAGE_KEY } from '../../services/drillFollow';
import i18n from '../../i18n';

vi.mock('../../components/drill/answerAudio', () => ({ playAnswerAudio: vi.fn() }));

const BANK = generateDrillBank({ includeRead: true });
const BY_ID = new Map(BANK.map((i) => [i.id, i]));
const READING = 'Reading (guitar)';

const intro = () => screen.queryByTestId('drill-intro');
const savedDrill = () => {
  const raw = localStorage.getItem(DRILL_STORE_KEY);
  return raw ? (JSON.parse(raw) as { state: { settings: { families: Record<string, boolean> } } }).state : null;
};
const queueFamilies = () => new Set(useDrillStore.getState().activeSession!.queue.map((id) => BY_ID.get(id)!.family));
const chip = (name: string) => screen.getByRole('button', { name });
const allOff = () => Object.fromEntries(DRILL_FAMILIES.map((f) => [f, false])) as Record<DrillFamily, boolean>;

/** Answer the session on screen right until its summary (every answer graded right by the store). */
function finishSessionRight(now: number) {
  const s = useDrillStore.getState();
  let session = s.activeSession!;
  let t = now;
  while (session.index < session.queue.length && session.asked < s.settings.length) {
    const item = BY_ID.get(session.queue[session.index])!;
    useDrillStore.getState().recordAnswer(item, true, 1500, (t += 2000));
    useDrillStore.getState().clearFeedback();
    session = useDrillStore.getState().activeSession!;
  }
}

beforeEach(() => {
  localStorage.clear();
  useDrillStore.getState().resetDrillData();
  localStorage.removeItem(DRILL_STORE_KEY);
  useAppStore.setState({ learnerProfile: null, instrument: 'piano' });
});

afterEach(async () => {
  cleanup();
  useDrillStore.getState().resetDrillData();
  useAppStore.setState({ learnerProfile: null, instrument: 'piano', view: 'explore' });
  localStorage.clear();
  await i18n.changeLanguage('en');
});

describe('P4: guitar reading follows the instrument until the learner chooses', () => {
  it('a new piano learner: the intro does not list it, its chip is off in settings and on the map, and nothing is saved before Start', () => {
    render(<DrillView />);
    expect(intro()).not.toBeNull();
    expect(screen.queryByText(READING)).toBeNull();
    expect(screen.getByText('Key signatures')).toBeDefined();
    act(() => fireEvent.click(chip('Choose topics')));
    expect(chip(READING).getAttribute('aria-pressed')).toBe('false');
    expect(chip('Intervals').getAttribute('aria-pressed')).toBe('true');
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    expect(chip(READING).getAttribute('aria-pressed')).toBe('false');
    expect(document.querySelectorAll('[data-reading-stage]')).toHaveLength(5);
    // Looking is not choosing: no reading field written (no save at all yet).
    expect(savedDrill()?.settings.families.read).toBeUndefined();
  });

  it('a new piano learner: Start asks no reading, saves the value in force (off), and reading never comes in later sessions', () => {
    render(<DrillView />);
    act(() => fireEvent.click(chip('Start')));
    expect(queueFamilies().has('read')).toBe(false);
    expect(savedDrill()!.settings.families.read).toBe(false);
    // Ten sessions later (the family rotation reached reading by the third at main), still none.
    let now = Date.UTC(2026, 10, 19, 9);
    for (let i = 0; i < 10; i++) {
      finishSessionRight(now);
      now += 86_400_000;
      useDrillStore.getState().startSession(BANK, now, { reading: false });
      expect(queueFamilies().has('read'), `session ${i + 2}`).toBe(false);
    }
  });

  it('a new guitar learner: listed, chip on, and Start saves it on', () => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<DrillView />);
    expect(screen.getByText(READING)).toBeDefined();
    act(() => fireEvent.click(chip('Choose topics')));
    expect(chip(READING).getAttribute('aria-pressed')).toBe('true');
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Back' })));
    act(() => fireEvent.click(chip('Start')));
    expect(savedDrill()!.settings.families.read).toBe(true);
  });

  it('before any choice it follows the instrument live: piano → guitar lists it, back to piano does not', () => {
    render(<DrillView />);
    expect(screen.queryByText(READING)).toBeNull();
    act(() => useAppStore.getState().setInstrument('guitar'));
    expect(screen.getByText(READING)).toBeDefined();
    act(() => useAppStore.getState().setInstrument('piano'));
    expect(screen.queryByText(READING)).toBeNull();
  });

  it('a piano learner turns it on with its chip (Choose topics): saved, listed, and its cards come into sessions', () => {
    render(<DrillView />);
    act(() => fireEvent.click(chip('Choose topics')));
    // Touching ANOTHER topic records nothing about reading.
    act(() => fireEvent.click(chip('Intervals')));
    expect(savedDrill()!.settings.families).not.toHaveProperty('read');
    expect(savedDrill()!.settings.families.interval).toBe(false);
    act(() => fireEvent.click(chip(READING)));
    expect(chip(READING).getAttribute('aria-pressed')).toBe('true');
    expect(savedDrill()!.settings.families.read).toBe(true);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Back' })));
    expect(screen.getByText(READING)).toBeDefined();
    // Only reading on: the session is reading questions.
    act(() => fireEvent.click(chip('Choose topics')));
    for (const f of ['Key signatures', 'Circle of fifths', 'Scales', 'Scale degrees', 'Triads', 'Seventh chords', 'Roman numerals', 'Harmonic function']) {
      act(() => fireEvent.click(chip(f)));
    }
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Back' })));
    act(() => fireEvent.click(chip('Start')));
    expect([...queueFamilies()]).toEqual(['read']);
  });

  it('the map\'s chip turns it on too, and a choice made OFF on the guitar stays off', () => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<DrillView />);
    act(() => fireEvent.click(chip('Choose topics')));
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    act(() => fireEvent.click(chip(READING)));
    expect(chip(READING).getAttribute('aria-pressed')).toBe('false');
    expect(savedDrill()!.settings.families.read).toBe(false);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Back' })));
    // Back on the intro: no longer listed, though the instrument is the guitar.
    expect(intro()).not.toBeNull();
    expect(screen.queryByText(READING)).toBeNull();
  });

  it('a learner with Drill history and no recorded choice (a save from before reading): on, as before, piano or guitar', () => {
    for (const instrument of ['piano', 'guitar'] as const) {
      cleanup();
      useAppStore.setState({ instrument });
      useDrillStore.setState({ introDone: true, lifetime: { answered: 12, correct: 10 } });
      useDrillStore.setState({ settings: { ...useDrillStore.getState().settings, families: { ...useDrillStore.getState().settings.families, read: true } } });
      render(<DrillView />);
      act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
      expect(chip(READING).getAttribute('aria-pressed'), instrument).toBe('true');
    }
  });

  it('the view, Drill history and no recorded choice (no read key): reading on in force, piano or guitar (review of bd14071)', () => {
    for (const instrument of ['piano', 'guitar'] as const) {
      cleanup();
      useDrillStore.getState().resetDrillData();
      useAppStore.setState({ instrument });
      useDrillStore.setState({ introDone: true, lifetime: { answered: 12, correct: 10 } });
      expect(useDrillStore.getState().settings.families).not.toHaveProperty('read');
      render(<DrillView />);
      act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
      expect(chip(READING).getAttribute('aria-pressed'), instrument).toBe('true');
    }
  });

  it('a guitar learner whose only topic on is Reading, never touched: Start, and a reading-only session (review of bd14071)', () => {
    useAppStore.setState({ instrument: 'guitar' });
    useDrillStore.getState().updateSettings({ families: Object.fromEntries(DRILL_FAMILIES.filter((f) => f !== 'read').map((f) => [f, false])) as Record<Exclude<DrillFamily, 'read'>, boolean> });
    expect(useDrillStore.getState().settings.families).not.toHaveProperty('read');
    render(<DrillView />);
    expect(screen.queryByTestId('drill-nothing')).toBeNull();
    expect(screen.getByText(READING)).toBeDefined();
    act(() => fireEvent.click(chip('Start')));
    expect([...queueFamilies()]).toEqual(['read']);
    expect(savedDrill()!.settings.families.read).toBe(true);
  });

  it('PT and ES: the topic is not listed for a piano learner', async () => {
    for (const [lang, name] of [['pt', 'Leitura (guitarra)'], ['es', 'Lectura (guitarra)']] as const) {
      cleanup();
      await i18n.changeLanguage(lang);
      render(<DrillView />);
      expect(intro()).not.toBeNull();
      expect(screen.queryByText(name), lang).toBeNull();
    }
  });
});

describe('P6: no session of nothing', () => {
  it('every topic off from the intro: it says so, offers Choose topics, has no Start, and starts nothing', () => {
    render(<DrillView />);
    act(() => fireEvent.click(chip('Choose topics')));
    for (const f of DRILL_FAMILIES) {
      const pressed = screen.getAllByRole('button').find((b) => b.getAttribute('aria-pressed') === 'true' && b.textContent === i18n.t(`drill.families.${f}`));
      if (pressed) act(() => fireEvent.click(pressed));
    }
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Back' })));
    expect(intro()).not.toBeNull();
    // At 153caab: an empty topic list and a live Start, which "ran" 0 of 0.
    expect(screen.queryByRole('button', { name: 'Start' })).toBeNull();
    expect(screen.getByTestId('drill-nothing').textContent).toBe('No topic is chosen, so there is nothing to ask.');
    expect(screen.queryByText('Session complete')).toBeNull();
    act(() => fireEvent.click(chip('Choose topics')));
    expect(screen.getByRole('heading', { name: 'Drill settings' })).toBeDefined();
    expect(useDrillStore.getState().activeSession).toBeNull();
    expect(useDrillStore.getState().introDone).toBe(false);
  });

  it('a returning learner with every topic off: the intro, never a summary of nothing (no auto-start)', () => {
    useDrillStore.setState({ introDone: true, lifetime: { answered: 5, correct: 5 } });
    useDrillStore.getState().updateSettings({ families: allOff() });
    render(<DrillView />);
    expect(intro()).not.toBeNull();
    expect(screen.getByTestId('drill-nothing').textContent).toBe('No topic is chosen, so there is nothing to ask.');
    expect(screen.queryByText('Session complete')).toBeNull();
    expect(screen.queryByText(/0 of 0/)).toBeNull();
    expect(useDrillStore.getState().activeSession).toBeNull();
  });

  it('after a real session: topics off on the map, then New session lands on the intro, not on "0 of 0"', () => {
    useDrillStore.setState({ introDone: true });
    useDrillStore.getState().updateSettings({ length: 12, newPerSession: 1 });
    render(<DrillView />);
    act(() => finishSessionRight(Date.UTC(2026, 10, 19, 9)));
    expect(screen.getByText('Session complete')).toBeDefined();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Mastery map' })));
    for (const f of DRILL_FAMILIES) {
      const name = i18n.t(`drill.families.${f}`);
      if (chip(name).getAttribute('aria-pressed') === 'true') act(() => fireEvent.click(chip(name)));
    }
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Back' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'New session' })));
    expect(screen.queryByText(/0 of 0/)).toBeNull();
    expect(screen.queryByText('Session complete')).toBeNull();
    expect(screen.getByTestId('drill-nothing')).toBeDefined();
    expect(useDrillStore.getState().activeSession).toBeNull();
  });

  it('0 new facts per session and no fact met yet: the same rule, with its own reason, and Drill settings', () => {
    useDrillStore.getState().updateSettings({ newPerSession: 0 });
    render(<DrillView />);
    expect(screen.getByTestId('drill-nothing').textContent).toBe('Nothing to ask: new facts per session is set to 0, and you have not met any of these facts yet.');
    expect(screen.queryByRole('button', { name: 'Start' })).toBeNull();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    expect(screen.getByRole('heading', { name: 'Drill settings' })).toBeDefined();
  });

  it('following the lessons, lessons open but 0 new facts and nothing met: no dead Start, the same line', () => {
    useAppStore.setState({ learnerProfile: 'new' });
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
      state: { progress: { completedModules: ['l2u7m3'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} } }, version: 4,
    }));
    useDrillStore.getState().updateSettings({ newPerSession: 0 });
    render(<DrillView />);
    expect(screen.getByTestId('drill-nothing').textContent).toBe('Nothing to ask: new facts per session is set to 0, and you have not met any of these facts yet.');
    expect(screen.queryByRole('button', { name: 'Start' })).toBeNull();
  });

  it('following with nothing open keeps its own intro (the lesson that opens the first questions)', () => {
    useAppStore.setState({ learnerProfile: 'new' });
    render(<DrillView />);
    expect(screen.getByTestId('drill-follow-empty')).toBeDefined();
    expect(screen.queryByTestId('drill-nothing')).toBeNull();
  });

  it('PT and ES: the lines are in the learner\'s language', async () => {
    for (const [lang, topics, none, settings] of [
      ['pt', 'Nenhum tópico está escolhido, por isso não há nada para perguntar.', 'Nada para perguntar: os factos novos por sessão estão a 0 e ainda não conheces nenhum destes factos.', 'Escolher tópicos'],
      ['es', 'No hay ningún tema elegido, así que no hay nada que preguntar.', 'Nada que preguntar: los conceptos nuevos por sesión están en 0 y aún no conoces ninguno de estos conceptos.', 'Elegir temas'],
    ] as const) {
      cleanup();
      await i18n.changeLanguage(lang);
      useDrillStore.getState().resetDrillData();
      useDrillStore.getState().updateSettings({ families: allOff() });
      render(<DrillView />);
      expect(screen.getByTestId('drill-nothing').textContent, lang).toBe(topics);
      expect(screen.getByRole('button', { name: settings })).toBeDefined();
      cleanup();
      useDrillStore.getState().resetDrillData();
      useDrillStore.getState().updateSettings({ newPerSession: 0 });
      render(<DrillView />);
      expect(screen.getByTestId('drill-nothing').textContent, lang).toBe(none);
    }
  });
});
