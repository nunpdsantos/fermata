/**
 * useDrillRunner — the single stateful hook that drives a drill session.
 *
 * It bridges the pure drill bank + the injectable drillStore to a small
 * imperative surface the view renders against. Timing (performance.now /
 * Date.now) lives HERE in the UI layer — the store and services stay
 * injectable and deterministic.
 *
 * Display model: the store advances its queue pointer the instant an answer is
 * recorded. To keep the just-answered question (and its feedback) on screen, the
 * runner tracks the DISPLAYED question id in its own state and only moves it
 * forward on `advance()` — never as a side effect of recording.
 *
 * Lossless reload (W9b): the store also keeps the verdict on screen
 * (`activeSession.feedback`) and the session's summary tally
 * (`activeSession.log`), so after a reload — an app update, the OS killing
 * the page — the runner comes back on the same question, in the same phase,
 * with the same summary to come.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DrillItem } from '../../core/types/drill';
import { generateDrillBank } from '../../core/utils/drillBank';
import {
  useDrillStore,
  isSessionComplete,
  emptySessionLog,
  type ActiveSession,
  type SessionLog,
  type StartSessionOptions,
} from '../../state/drillStore';
import { gradeAnswer, type AnswerPayload, type GradeResult } from './grading';
import { playAnswerAudio } from './answerAudio';
import { sessionCounter } from './sessionCounter';

// ─── Session log (drives SessionSummary) ─────────────────────────────────────
// Per-family breakdown + tier-up crossings for the summary. Kept by the store
// in `activeSession.log` since W9b (it used to live in a ref here, so a reload
// lost it).

export type { FamilySessionTally } from '../../state/drillStore';
export type SessionSummaryData = SessionLog;

// ─── Module-level bank memo ──────────────────────────────────────────────────
// generateDrillBank() is expensive (~1,300 items). Build it once per module
// load and index by id for O(1) lookup from a (possibly stale) persisted queue.

let BANK: DrillItem[] | null = null;
let bankById: Map<string, DrillItem> | null = null;

function getBank(): { bank: DrillItem[]; byId: Map<string, DrillItem> } {
  if (BANK === null || bankById === null) {
    BANK = generateDrillBank({ includeRead: true });
    bankById = new Map(BANK.map((item) => [item.id, item]));
  }
  return { bank: BANK, byId: bankById };
}

/**
 * Resolve the current question id from a (possibly stale) persisted queue.
 *
 * A persisted queue can reference ids that no longer exist in the bank (the
 * bank changed between releases). Rather than crash or end the session, skip
 * forward to the first KNOWN id at or after `index`. If none remain, the
 * session has effectively run out of answerable questions.
 */
function currentKnownId(
  session: ActiveSession,
  byId: Map<string, DrillItem>,
): string | null {
  for (let i = session.index; i < session.queue.length; i++) {
    const id = session.queue[i];
    if (byId.has(id)) return id;
  }
  return null;
}

// ─── Public contract ─────────────────────────────────────────────────────────

export interface DrillRunner {
  phase: 'answering' | 'feedback';
  item: DrillItem | null; // current question (null → session finished/empty)
  /**
   * Changes every time a question is put on screen — including the SAME item
   * shown again. Key the answer input by it so each presentation mounts fresh
   * (the spelling inputs hold a one-shot commit lock; audit W0-02 / D-4).
   */
  presentationKey: string;
  result: GradeResult | null; // set during feedback
  asked: number;
  /** Zero-based number of the question ON SCREEN (stays put during feedback). */
  position: number;
  /**
   * The session's planned questions: its distinct facts, capped at the
   * session length (a short queue never reads "x of 24", audit D-11). Fixed
   * for the session — a re-ask never raises it (sessionCounter.ts).
   */
  total: number;
  /** The question on screen is a re-ask (a miss, or a new fact's second look). */
  again: boolean;
  /** 0, or k for the k-th extra re-ask outside the planned total (shown as "Extra k"). */
  extra: number;
  correctCount: number;
  sessionComplete: boolean;
  /** Per-session breakdown for the summary screen (the store's session log). */
  summary: SessionSummaryData;
  answer: (payload: AnswerPayload) => void; // grades, records, enters feedback
  advance: () => void; // feedback → next question (manual; used on wrong answers)
  endSession: () => void;
  startNewSession: () => void;
}

const AUTO_ADVANCE_MS = 600;

export function useDrillRunner({
  autoStart = true,
  sessionOptions,
}: {
  autoStart?: boolean;
  /**
   * Wave 2: "Follow my lessons" — handed to every startSession (the switch in
   * force and its pool). Read at start time, so a new session uses the latest.
   */
  sessionOptions?: StartSessionOptions;
} = {}): DrillRunner {
  const { bank, byId } = getBank();
  const optionsRef = useRef(sessionOptions);
  useEffect(() => {
    optionsRef.current = sessionOptions;
  });

  const activeSession = useDrillStore((s) => s.activeSession);
  const items = useDrillStore((s) => s.items);
  const settings = useDrillStore((s) => s.settings);
  const startSession = useDrillStore((s) => s.startSession);
  const recordAnswer = useDrillStore((s) => s.recordAnswer);
  const clearFeedback = useDrillStore((s) => s.clearFeedback);
  const endSessionStore = useDrillStore((s) => s.endSession);

  // A verdict that was on screen when the page went away (W9b): resume ON it.
  // Read once, at mount (lazy initializer); an id the bank no longer has is
  // ignored (the question at the pointer is shown instead).
  const [resumed] = useState(() => {
    const feedback = useDrillStore.getState().activeSession?.feedback;
    return feedback && byId.has(feedback.itemId) ? feedback : null;
  });
  const [phase, setPhase] = useState<'answering' | 'feedback'>(resumed ? 'feedback' : 'answering');
  const [result, setResult] = useState<GradeResult | null>(
    resumed ? { correct: resumed.correct, nearMiss: resumed.nearMiss } : null,
  );
  // The question currently ON SCREEN. Decoupled from the store pointer so a
  // just-answered question (and its feedback) survives the pointer advancing.
  const [displayId, setDisplayId] = useState<string | null>(resumed?.itemId ?? null);
  // Bumped on every deliberate move to a question (advance, restart), so an
  // item shown twice in a row still gets a fresh input instance.
  const [presentation, setPresentation] = useState(0);
  // Snapshot captured when the user ENDS a session early (✕). The store nulls
  // the session, so the summary reads its score from here. null = not ended this
  // way (either running or completed naturally — which keeps its live session).
  const [endedSummary, setEndedSummary] = useState<{ asked: number; correct: number; log: SessionLog } | null>(null);

  // Timestamp the displayed prompt was shown; reset whenever it changes.
  const promptShownAt = useRef<number>(performance.now());
  // Pending auto-advance timer (correct answers). Cleared on unmount/advance.
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimer.current !== null) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  // Auto-start on mount when there is no active session (zero-friction rule).
  // startSession reads bank + current settings from the store. Not while the
  // first-visit intro is up: its Start calls startNewSession.
  useEffect(() => {
    if (autoStart && useDrillStore.getState().activeSession === null) {
      startSession(bank, Date.now(), optionsRef.current);
    }
    // Run once on mount. startNewSession handles deliberate restarts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Seed / re-seed the displayed question from the store while ANSWERING:
  //  - resume: an existing session's current id on first render
  //  - new session: the first id once startSession lands
  // Never runs during feedback (displayId is frozen on the answered question
  // until advance()).
  useEffect(() => {
    if (phase !== 'answering' || !activeSession) return;
    const id = currentKnownId(activeSession, byId);
    if (id !== displayId) {
      setDisplayId(id);
      promptShownAt.current = performance.now();
    }
  }, [phase, activeSession, byId, displayId]);

  // Clear any pending timer on unmount.
  useEffect(() => clearAdvanceTimer, [clearAdvanceTimer]);

  const item = displayId ? (byId.get(displayId) ?? null) : null;

  // Session is "done" (show summary) when the user ended it early, OR the store
  // reports completion / no answerable question remains. A null session before
  // auto-start is "not done" so the view shows a brief loading tick rather than
  // flashing the summary.
  const complete =
    endedSummary !== null ||
    (phase === 'answering' &&
      activeSession !== null &&
      (isSessionComplete(activeSession, settings) || item === null));

  const goToCurrent = useCallback(() => {
    const session = useDrillStore.getState().activeSession;
    const id = session ? currentKnownId(session, byId) : null;
    setDisplayId(id);
    setPresentation((p) => p + 1);
    promptShownAt.current = performance.now();
  }, [byId]);

  const advance = useCallback(() => {
    clearAdvanceTimer();
    clearFeedback();
    setResult(null);
    setPhase('answering');
    goToCurrent(); // store index already advanced by recordAnswer
  }, [clearAdvanceTimer, clearFeedback, goToCurrent]);

  // Auto-advance after a brief feedback flash (correct answers). Timing is
  // not an animation — kept even under prefers-reduced-motion.
  const scheduleAutoAdvance = useCallback(() => {
    clearAdvanceTimer();
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      advance();
    }, AUTO_ADVANCE_MS);
  }, [clearAdvanceTimer, advance]);

  // Resumed on a CORRECT verdict: it auto-advances as it would have.
  useEffect(() => {
    if (resumed?.correct) scheduleAutoAdvance();
    // Once, on mount (the resumed verdict is a mount-time snapshot).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answer = useCallback(
    (payload: AnswerPayload) => {
      if (phase !== 'answering' || !item) return;
      const ms = performance.now() - promptShownAt.current;
      const graded = gradeAnswer(item, payload);
      // Advances the store pointer, logs the answer for the summary and keeps
      // the verdict (so a reload comes back on it).
      recordAnswer(item, graded.correct, ms, Date.now(), graded.nearMiss);
      setResult(graded);
      setPhase('feedback'); // displayId stays on the answered item
      // Reveal audio: play the answer (chords/intervals/scales) on every answer,
      // right or wrong, when sound is on. Fire-and-forget — never blocks advance.
      if (settings.sound) playAnswerAudio(item);
      if (graded.correct) scheduleAutoAdvance();
    },
    [phase, item, recordAnswer, settings.sound, scheduleAutoAdvance],
  );

  const endSession = useCallback(() => {
    clearAdvanceTimer();
    setResult(null);
    setPhase('answering');
    setDisplayId(null);
    // Snapshot the score BEFORE the store nulls the session, so the summary
    // can show it.
    const s = useDrillStore.getState().activeSession;
    setEndedSummary({ asked: s?.asked ?? 0, correct: s?.correct ?? 0, log: s?.log ?? emptySessionLog() });
    endSessionStore();
  }, [clearAdvanceTimer, endSessionStore]);

  const startNewSession = useCallback(() => {
    clearAdvanceTimer();
    setResult(null);
    setPhase('answering');
    setEndedSummary(null);
    startSession(bank, Date.now(), optionsRef.current); // a new session starts with an empty log
    // Read the freshly-composed queue's first id immediately.
    const session = useDrillStore.getState().activeSession;
    setDisplayId(session ? currentKnownId(session, byId) : null);
    setPresentation((p) => p + 1);
    promptShownAt.current = performance.now();
  }, [clearAdvanceTimer, startSession, bank, byId]);

  const asked = endedSummary?.asked ?? activeSession?.asked ?? 0;
  const correctCount = endedSummary?.correct ?? activeSession?.correct ?? 0;

  // The question on screen sits at the pointer while answering; during
  // feedback the store has already moved past it, so it is the one just before
  // (audit U-6 / D-11). The counter reads the queue (sessionCounter.ts).
  let position = 0;
  let total: number = settings.length;
  let again = false;
  let extra = 0;
  if (activeSession) {
    let at = activeSession.index - 1;
    if (phase === 'answering') {
      at = activeSession.index;
      while (at < activeSession.queue.length && !byId.has(activeSession.queue[at])) at++;
    }
    // New in this session: no state before it, or introduced by it.
    const sessionId = activeSession.id;
    const isNew = (id: string) => items[id] === undefined || items[id].introSessionId === sessionId;
    const counter = sessionCounter(
      activeSession.queue, Math.max(0, at), settings.length, (id) => byId.has(id), isNew, activeSession.seed,
    );
    position = counter.current - 1;
    total = counter.total;
    again = counter.again;
    extra = counter.extra;
  }

  return {
    phase,
    item: complete ? null : item,
    presentationKey: `${displayId ?? ''}:${presentation}`,
    result,
    asked,
    position,
    total,
    again,
    extra,
    correctCount,
    sessionComplete: complete,
    // Headline numbers track the store/snapshot (authoritative even on resume);
    // the per-family breakdown + crossings come from the session log.
    summary: {
      ...(endedSummary?.log ?? activeSession?.log ?? emptySessionLog()),
      asked,
      correct: correctCount,
    },
    answer,
    advance,
    endSession,
    startNewSession,
  };
}
