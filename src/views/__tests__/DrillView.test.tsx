import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { DrillView } from '../DrillView';
import { useDrillStore, type ActiveSession, DEFAULT_SETTINGS } from '../../state/drillStore';
import { useAppStore } from '../../state/store';
import { generateDrillBank } from '../../core/utils/drillBank';
import { DRILL_FAMILY_TO_MODULE } from '../../data/drillFamilyToModule';
import type { DrillFamily, DrillItem } from '../../core/types/drill';

// Spy on the reveal-audio player so we can assert it's invoked (Task 10)
// without a real AudioContext. The real planner logic is unit-tested separately.
vi.mock('../../components/drill/answerAudio', () => ({
  playAnswerAudio: vi.fn(),
}));
import { playAnswerAudio } from '../../components/drill/answerAudio';

// ── framer-motion → plain elements (mirrors sibling view tests) ───────────────
// The component TYPE per tag must be cached: constructed-input components hold
// local selection state, and a fresh proxy fn each render would remount them.
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

// The runner memoizes generateDrillBank() at module level; it is deterministic,
// so a fresh call here is deep-equal (same ids + answers) and lets us look up
// the correct choice for whichever question is on screen.
const BANK: DrillItem[] = generateDrillBank();
const BY_ID = new Map(BANK.map((i) => [i.id, i]));

// Only choice-format families — guarantees ChoiceChips renders for every
// question (UnsupportedInput never appears).
const CHOICE_FAMILIES: Record<DrillFamily, boolean> = {
  keysig: true,
  circle: true,
  degree: true,
  scale: false,
  interval: false,
  triad: false,
  seventh: false,
  roman: false,
  function: false,
};

function resetStore(length: 12 | 24 | 40 = 24) {
  useDrillStore.getState().resetDrillData();
  // High newPerSession so the initial queue fills to `length` deterministically
  // (a fresh store has no due/review items — only fresh ones populate the queue).
  useDrillStore.getState().updateSettings({
    families: CHOICE_FAMILIES,
    length,
    newPerSession: length,
  });
}

/** Read the answer.correct for the question currently on screen, then tap it. */
function answerCurrentCorrectly() {
  const session = useDrillStore.getState().activeSession!;
  const id = session.queue[session.index];
  const item = BY_ID.get(id)!;
  const correct = item.answer.kind === 'choice' ? item.answer.correct : '';
  const btn = screen.getByRole('button', { name: correct });
  fireEvent.click(btn);
}

/** Read the current question's answer + return a WRONG choice to tap. */
function currentWrongChoice(): string {
  const session = useDrillStore.getState().activeSession!;
  const item = BY_ID.get(session.queue[session.index])!;
  const correct = item.answer.kind === 'choice' ? item.answer.correct : '';
  const choices = item.input.format === 'choice' ? item.input.choices : [];
  return choices.find((c) => c !== correct)!;
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  useDrillStore.getState().resetDrillData();
  localStorage.clear();
});

beforeEach(() => {
  localStorage.clear();
  resetStore();
});

describe('DrillView — auto-start', () => {
  it('auto-starts a session on mount (null → active) and renders a question', () => {
    expect(useDrillStore.getState().activeSession).toBeNull();
    render(<DrillView />);
    const session = useDrillStore.getState().activeSession;
    expect(session).not.toBeNull();
    // A choice question is on screen: its group of chips renders.
    expect(screen.getByRole('group')).toBeDefined();
    // Progress shows "1 of 24".
    expect(screen.getByText(/1 of 24/)).toBeDefined();
  });
});

describe('DrillView — answering flow', () => {
  it('correct answer shows feedback, then auto-advances after 600ms', () => {
    vi.useFakeTimers();
    render(<DrillView />);

    const beforeId = useDrillStore.getState().activeSession!.queue[0];
    act(() => answerCurrentCorrectly());

    // Feedback strip: the "Correct" line is present.
    expect(screen.getByText('Correct')).toBeDefined();
    // Store recorded the answer.
    expect(useDrillStore.getState().activeSession!.asked).toBe(1);

    // Auto-advance fires after 600ms → feedback gone, next question shown.
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.queryByText('Correct')).toBeNull();
    // Progress advanced to question 2.
    expect(screen.getByText(/2 of 24/)).toBeDefined();
    const afterId = useDrillStore.getState().activeSession!.queue[useDrillStore.getState().activeSession!.index];
    expect(afterId).not.toBe(beforeId);
  });

  it('wrong answer holds feedback until Continue is tapped (no auto-advance)', () => {
    vi.useFakeTimers();
    render(<DrillView />);

    const wrong = currentWrongChoice();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: wrong }));
    });

    // "Not quite" + a Continue button appear.
    expect(screen.getByText('Not quite')).toBeDefined();
    const cont = screen.getByRole('button', { name: 'Continue' });

    // Time passes — still on feedback (no auto-advance for wrong answers).
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Not quite')).toBeDefined();

    // Continue advances to the next question.
    act(() => {
      fireEvent.click(cont);
    });
    expect(screen.queryByText('Not quite')).toBeNull();
    expect(screen.getByText(/2 of 24/)).toBeDefined();
  });
});

describe('DrillView — end session + summary', () => {
  it('end-session ✕ ends the session and shows the summary', () => {
    render(<DrillView />);
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    expect(useDrillStore.getState().activeSession).toBeNull();
    // Summary: "New session" button present.
    expect(screen.getByRole('button', { name: 'New session' })).toBeDefined();
  });

  it('shows the summary after `length` questions are answered', () => {
    vi.useFakeTimers();
    resetStore(12);
    render(<DrillView />);

    // Answer 12 correctly, flushing each auto-advance.
    for (let i = 0; i < 12; i++) {
      act(() => answerCurrentCorrectly());
      act(() => {
        vi.advanceTimersByTime(600);
      });
    }

    expect(useDrillStore.getState().activeSession!.asked).toBe(12);
    // Summary score line renders (e.g. "12 of 12 correct").
    expect(screen.getByText(/of 12 correct/)).toBeDefined();
    expect(screen.getByRole('button', { name: 'New session' })).toBeDefined();
  });

  it('New session resets and presents a fresh question', () => {
    render(<DrillView />);
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    expect(screen.getByRole('button', { name: 'New session' })).toBeDefined();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'New session' }));
    });
    expect(useDrillStore.getState().activeSession).not.toBeNull();
    expect(screen.getByRole('group')).toBeDefined();
    expect(screen.getByText(/1 of/)).toBeDefined();
  });
});

describe('DrillView — resume', () => {
  it('resumes an existing session at its stored index (no restart)', () => {
    // Pre-seed an active session positioned at index 3 with a known choice queue.
    const choiceIds = BANK.filter((i) => i.input.format === 'choice').slice(0, 8).map((i) => i.id);
    const session: ActiveSession = {
      id: 's-resume',
      queue: choiceIds,
      index: 3,
      asked: 3,
      correct: 2,
      startedAt: 1,
      seed: 1,
      missRequeues: {},
    };
    useDrillStore.setState({ activeSession: session, settings: { ...DEFAULT_SETTINGS, families: CHOICE_FAMILIES } });

    render(<DrillView />);

    // Did NOT restart: same session id, still at index 3.
    expect(useDrillStore.getState().activeSession!.id).toBe('s-resume');
    expect(useDrillStore.getState().activeSession!.index).toBe(3);
    // Question 4 is on screen (asked 3 → "4 of …").
    expect(screen.getByText(/4 of/)).toBeDefined();
    // It renders the 4th queued item's prompt.
    const expectedItem = BY_ID.get(choiceIds[3])!;
    const expectedChoices = expectedItem.input.format === 'choice' ? expectedItem.input.choices : [];
    for (const c of expectedChoices) {
      expect(screen.getByRole('button', { name: c })).toBeDefined();
    }
  });
});

describe('DrillView — instrument area absent', () => {
  it('does not render the instrument region inside the drill view subtree', () => {
    // DrillView itself must not contain any instrument area; AppShell gates it.
    const { container } = render(<DrillView />);
    expect(container.querySelector('[data-tour="play-note"]')).toBeNull();
  });
});

// ── noteChips (constructed input) end-to-end ──────────────────────────────────
// Triad-only families surface the lowest-rank triad item first:
// `triad:name-to-notes:C:major` (noteChips, answer C E G). This exercises the
// full Task 9 path: NoteChips → grading.gradeAnswer('noteChips') →
// recordAnswer → FeedbackStrip, including the enharmonic near-miss branch.
const TRIAD_FAMILIES: Record<DrillFamily, boolean> = {
  keysig: false,
  circle: false,
  degree: false,
  scale: false,
  interval: false,
  triad: true,
  seventh: false,
  roman: false,
  function: false,
};

function startTriadSession() {
  useDrillStore.getState().resetDrillData();
  useDrillStore.getState().updateSettings({
    families: TRIAD_FAMILIES,
    length: 12,
    newPerSession: 12,
  });
}

describe('DrillView — noteChips end-to-end (triad family)', () => {
  it('renders a note-chip question and grades a correct spelling, then auto-advances', () => {
    vi.useFakeTimers();
    startTriadSession();
    render(<DrillView />);

    // First triad item is C major spelling; its prompt renders.
    expect(screen.getByText('Spell C major')).toBeDefined();
    // The chip group is present (not the choice group — these are note chips).
    expect(screen.getByRole('group')).toBeDefined();

    // Tap the three correct chips (C, E, G are naturals → display == ascii).
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'E' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'G' })));

    // Graded correct → feedback + store recorded one correct answer.
    expect(screen.getByText('Correct')).toBeDefined();
    expect(useDrillStore.getState().activeSession!.asked).toBe(1);
    expect(useDrillStore.getState().activeSession!.correct).toBe(1);

    // Auto-advances after 600ms to the next triad question.
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.queryByText('Correct')).toBeNull();
    expect(screen.getByText(/2 of 12/)).toBeDefined();
  });

  it('flags an enharmonic spelling as a near-miss (wrong, hold for Continue)', () => {
    vi.useFakeTimers();
    startTriadSession();
    render(<DrillView />);

    expect(screen.getByText('Spell C major')).toBeDefined();

    // B♯ is enharmonic with C — same sound, wrong spelling. {B♯,E,G} matches
    // the pitch classes of {C,E,G} so grading returns a near-miss.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'B♯' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'E' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'G' })));

    // Near-miss copy appears (amber variant) and it counts as WRONG.
    expect(screen.getByText(/Same sound, wrong spelling/)).toBeDefined();
    expect(useDrillStore.getState().activeSession!.asked).toBe(1);
    expect(useDrillStore.getState().activeSession!.correct).toBe(0);

    // No auto-advance for a near-miss; a Continue button holds the feedback.
    const cont = screen.getByRole('button', { name: 'Continue' });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/Same sound, wrong spelling/)).toBeDefined();

    act(() => fireEvent.click(cont));
    expect(screen.queryByText(/Same sound, wrong spelling/)).toBeNull();
    expect(screen.getByText(/2 of 12/)).toBeDefined();
  });
});

// ── Task 10: reveal audio + learn deep-link ───────────────────────────────────
function startDegreeSession() {
  useDrillStore.getState().resetDrillData();
  useDrillStore.getState().updateSettings({
    families: {
      keysig: false, circle: false, degree: true, scale: false, interval: false,
      triad: false, seventh: false, roman: false, function: false,
    },
    length: 12,
    newPerSession: 12,
  });
}

describe('DrillView — reveal audio (Task 10)', () => {
  it('plays the answer on reveal when sound is ON (chord item)', () => {
    vi.clearAllMocks();
    startTriadSession(); // sound defaults to true
    render(<DrillView />);
    expect(playAnswerAudio).not.toHaveBeenCalled();

    act(() => fireEvent.click(screen.getByRole('button', { name: 'C' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'E' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'G' })));

    expect(playAnswerAudio).toHaveBeenCalledTimes(1);
    // It received the C-major item.
    const arg = (playAnswerAudio as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as DrillItem;
    expect(arg.id).toBe('triad:name-to-notes:C:major');
  });

  it('does NOT play audio when sound is OFF', () => {
    vi.clearAllMocks();
    startTriadSession();
    useDrillStore.getState().updateSettings({ sound: false });
    render(<DrillView />);

    act(() => fireEvent.click(screen.getByRole('button', { name: 'C' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'E' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'G' })));

    expect(playAnswerAudio).not.toHaveBeenCalled();
  });
});

describe('DrillView — learn deep-link (Task 10)', () => {
  it('navigates to the family module on a wrong answer', () => {
    vi.clearAllMocks();
    // Reset the app store navigation state before asserting on it.
    useAppStore.setState({ view: 'drill', pendingLearnTarget: null });
    startDegreeSession();
    render(<DrillView />);

    // The first degree question is on screen; tap a wrong choice.
    const session = useDrillStore.getState().activeSession!;
    const item = BY_ID.get(session.queue[session.index])!;
    const correct = item.answer.kind === 'choice' ? item.answer.correct : '';
    const choices = item.input.format === 'choice' ? item.input.choices : [];
    const wrong = choices.find((c) => c !== correct)!;
    act(() => fireEvent.click(screen.getByRole('button', { name: wrong })));

    // The "Learn about this" link appears (wrong answers only) and navigates.
    const link = screen.getByRole('button', { name: /Learn about this/ });
    act(() => fireEvent.click(link));

    const app = useAppStore.getState();
    expect(app.view).toBe('learn');
    expect(app.pendingLearnTarget?.moduleId).toBe(DRILL_FAMILY_TO_MODULE.degree);
  });

  it('shows no learn link on a correct answer', () => {
    vi.clearAllMocks();
    startDegreeSession();
    render(<DrillView />);
    act(() => answerCurrentCorrectly());
    expect(screen.queryByRole('button', { name: /Learn about this/ })).toBeNull();
  });
});

// ── Task 11: sub-screen navigation (settings / mastery / sprint) ──────────────

describe('DrillView — settings sub-screen', () => {
  it('⚙ opens the full settings screen and Back returns to the SAME running question (no restart)', () => {
    render(<DrillView />);
    // A question is on screen.
    expect(screen.getByText(/1 of 24/)).toBeDefined();

    // Capture the exact session identity + current item BEFORE opening settings.
    // The settings round-trip must be a pure overlay: same session, same index,
    // same queued item — a restart (new id / re-shuffled queue / reset index)
    // would silently lose the learner's place, which this pins against.
    const before = useDrillStore.getState().activeSession!;
    const beforeSessionId = before.id;
    const beforeIndex = before.index;
    const beforeItemId = before.queue[before.index];

    // Open settings via the gear (aria-label "Drill settings").
    fireEvent.click(screen.getByRole('button', { name: 'Drill settings' }));
    // Settings screen: the "New facts per session" control renders.
    expect(screen.getByText('New facts per session')).toBeDefined();
    // The session is NOT ended (still active) — settings overlay only.
    expect(useDrillStore.getState().activeSession).not.toBeNull();

    // Back returns to the question.
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText(/1 of 24/)).toBeDefined();

    // Same session id, same index, same current item id — proven identical, not
    // merely "a question at position 1" (which a fresh restart would also show).
    const after = useDrillStore.getState().activeSession!;
    expect(after.id).toBe(beforeSessionId);
    expect(after.index).toBe(beforeIndex);
    expect(after.queue[after.index]).toBe(beforeItemId);
  });

  it('changing session length from settings writes the store', () => {
    render(<DrillView />);
    fireEvent.click(screen.getByRole('button', { name: 'Drill settings' }));
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: '40' }));
    });
    expect(useDrillStore.getState().settings.length).toBe(40);
  });
});

describe('DrillView — summary navigation to sub-screens', () => {
  it('Mastery map button from the summary opens the mastery screen', () => {
    render(<DrillView />);
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    // Summary is up.
    expect(screen.getByRole('button', { name: 'Mastery map' })).toBeDefined();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Mastery map' }));
    });
    // Mastery screen header renders, with a family switch.
    expect(screen.getByRole('switch', { name: 'Triads' })).toBeDefined();

    // Back returns to the summary.
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    });
    expect(screen.getByRole('button', { name: 'New session' })).toBeDefined();
  });

  it('Sprint button from the summary opens the sprint (empty-state on a fresh store)', () => {
    render(<DrillView />);
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Sprint' }));
    });
    // Fresh store has no mastered items → empty-state, not a started run.
    expect(screen.getByText('Nothing mastered yet to sprint on')).toBeDefined();
  });
});

// ── Task 11: showTimer elapsed counter ───────────────────────────────────────

describe('DrillView — showTimer setting', () => {
  it('renders the elapsed mm:ss counter only when showTimer is ON', () => {
    vi.useFakeTimers();
    // OFF (default): no mm:ss counter in the header.
    const { unmount } = render(<DrillView />);
    expect(screen.queryByText(/^\d+:\d{2}$/)).toBeNull();
    unmount();

    // ON: the counter renders.
    useDrillStore.getState().updateSettings({ showTimer: true });
    render(<DrillView />);
    expect(screen.getByText(/^\d+:\d{2}$/)).toBeDefined();
  });
});
