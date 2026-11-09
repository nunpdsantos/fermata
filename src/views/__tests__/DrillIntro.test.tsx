import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { DrillView } from '../DrillView';
import { useDrillStore, validatePersistedShape, DEFAULT_SETTINGS, DRILL_STORE_KEY } from '../../state/drillStore';
import { generateDrillBank } from '../../core/utils/drillBank';
import i18n from '../../i18n';

vi.mock('../../components/drill/answerAudio', () => ({ playAnswerAudio: vi.fn() }));

const intro = () => screen.queryByTestId('drill-intro');
const counter = () => screen.queryByText(/^\d+ of \d+$/);

beforeEach(() => {
  localStorage.clear();
  useDrillStore.getState().resetDrillData();
});

afterEach(async () => {
  cleanup();
  useDrillStore.getState().resetDrillData();
  localStorage.clear();
  await i18n.changeLanguage('en');
});

describe('Drill first-visit intro (brief 2026-11-09)', () => {
  it('a fresh store opens on the intro, not a question, and starts no session', () => {
    render(<DrillView />);
    expect(intro()).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Quick questions on music facts' })).toBeDefined();
    // The real topics, from the settings (all on by default).
    for (const topic of ['Key signatures', 'Intervals', 'Triads', 'Seventh chords', 'Roman numerals', 'Reading (guitar)']) {
      expect(screen.getByText(topic)).toBeDefined();
    }
    expect(screen.getByText('A session is up to 24 questions. Your first one is shorter: just the new facts.')).toBeDefined();
    expect(screen.getByText('Each session brings in 4 new facts; the rest are facts you have already met.')).toBeDefined();
    expect(screen.getByText(/comes back later in the session, labelled Again/)).toBeDefined();
    expect(counter()).toBeNull();
    expect(useDrillStore.getState().activeSession).toBeNull();
  });

  it('Start begins the session: a question on screen, and the intro is done for good', () => {
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    expect(intro()).toBeNull();
    expect(useDrillStore.getState().activeSession).not.toBeNull();
    expect(useDrillStore.getState().introDone).toBe(true);
    expect(counter()?.textContent).toBe('1 of 4');
    // Persisted: a reload (re-hydrate from the save) keeps it done.
    expect(JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!).state.introDone).toBe(true);
  });

  it('never again once a session has started — even one ended at once with no answer', () => {
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'End session' })));
    cleanup();
    expect(useDrillStore.getState().activeSession).toBeNull();
    render(<DrillView />);
    expect(intro()).toBeNull();
    expect(counter()).not.toBeNull(); // the usual zero-friction auto-start
  });

  it('is not shown with drill history', () => {
    const item = generateDrillBank()[0];
    useDrillStore.getState().startSession([item], 1_000);
    useDrillStore.getState().recordAnswer(item, true, 900, 2_000);
    useDrillStore.getState().endSession();
    useDrillStore.setState({ introDone: false });
    // A save from before the intro existed (no introDone field) with history:
    const { introDone: _drop, ...old } = useDrillStore.getState();
    void _drop;
    expect(validatePersistedShape(JSON.parse(JSON.stringify(old)))!.introDone).toBe(true);
    useDrillStore.setState({ introDone: validatePersistedShape(JSON.parse(JSON.stringify(old)))!.introDone });
    render(<DrillView />);
    expect(intro()).toBeNull();
    expect(counter()).not.toBeNull();
  });

  it('the settings link opens the Drill settings; Back returns to the intro; a topic change shows in it', () => {
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: /Choose topics/ })));
    expect(screen.getByRole('heading', { name: 'Drill settings' })).toBeDefined();
    expect(useDrillStore.getState().activeSession).toBeNull();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Intervals' })));
    act(() => fireEvent.click(screen.getByRole('radio', { name: '12' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Back' })));
    expect(intro()).not.toBeNull();
    expect(screen.queryByText('Intervals')).toBeNull();
    expect(screen.getByText('A session is up to 12 questions. Your first one is shorter: just the new facts.')).toBeDefined();
    expect(useDrillStore.getState().activeSession).toBeNull();
  });

  it('PT: the intro is Portuguese', async () => {
    await i18n.changeLanguage('pt');
    render(<DrillView />);
    expect(screen.getByRole('heading', { name: 'Perguntas rápidas sobre factos musicais' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Iniciar' })).toBeDefined();
    expect(screen.getByText('Cada sessão traz 4 factos novos; os restantes são factos que já conheces.')).toBeDefined();
  });
});

describe('drill store introDone (no store-version bump)', () => {
  it('a save without the field and without history derives false; an explicit value wins', () => {
    const empty = { items: {}, settings: DEFAULT_SETTINGS, sprintBests: {}, lifetime: { answered: 0, correct: 0 }, activeSession: null };
    expect(validatePersistedShape(empty)!.introDone).toBe(false);
    expect(validatePersistedShape({ ...empty, introDone: true })!.introDone).toBe(true);
    expect(validatePersistedShape({ ...empty, sprintBests: { degree: 3 } })!.introDone).toBe(true);
  });

  it('resetDrillProgress keeps it (the reset starts a session); resetDrillData clears it', () => {
    useDrillStore.getState().startSession(generateDrillBank().slice(0, 4), 1_000);
    expect(useDrillStore.getState().introDone).toBe(true);
    useDrillStore.getState().resetDrillProgress();
    expect(useDrillStore.getState().introDone).toBe(true);
    useDrillStore.getState().resetDrillData();
    expect(useDrillStore.getState().introDone).toBe(false);
  });
});
