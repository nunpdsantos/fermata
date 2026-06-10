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
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DrillItem } from '../../core/types/drill';
import { generateDrillBank } from '../../core/utils/drillBank';
import {
  useDrillStore,
  isSessionComplete,
  type ActiveSession,
} from '../../state/drillStore';
import { gradeAnswer, type AnswerPayload, type GradeResult } from './grading';
import { playAnswerAudio } from './answerAudio';

// ─── Module-level bank memo ──────────────────────────────────────────────────
// generateDrillBank() is expensive (~1,300 items). Build it once per module
// load and index by id for O(1) lookup from a (possibly stale) persisted queue.

let BANK: DrillItem[] | null = null;
let bankById: Map<string, DrillItem> | null = null;

function getBank(): { bank: DrillItem[]; byId: Map<string, DrillItem> } {
  if (BANK === null || bankById === null) {
    BANK = generateDrillBank();
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
  result: GradeResult | null; // set during feedback
  asked: number;
  total: number;
  correctCount: number;
  sessionComplete: boolean;
  answer: (payload: AnswerPayload) => void; // grades, records, enters feedback
  advance: () => void; // feedback → next question (manual; used on wrong answers)
  endSession: () => void;
  startNewSession: () => void;
}

const AUTO_ADVANCE_MS = 600;

export function useDrillRunner(): DrillRunner {
  const { bank, byId } = getBank();

  const activeSession = useDrillStore((s) => s.activeSession);
  const settings = useDrillStore((s) => s.settings);
  const startSession = useDrillStore((s) => s.startSession);
  const recordAnswer = useDrillStore((s) => s.recordAnswer);
  const endSessionStore = useDrillStore((s) => s.endSession);

  const [phase, setPhase] = useState<'answering' | 'feedback'>('answering');
  const [result, setResult] = useState<GradeResult | null>(null);
  // The question currently ON SCREEN. Decoupled from the store pointer so a
  // just-answered question (and its feedback) survives the pointer advancing.
  const [displayId, setDisplayId] = useState<string | null>(null);
  // Snapshot captured when the user ENDS a session early (✕). The store nulls
  // the session, so the summary reads its score from here. null = not ended this
  // way (either running or completed naturally — which keeps its live session).
  const [endedSummary, setEndedSummary] = useState<{ asked: number; correct: number } | null>(null);

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
  // startSession reads bank + current settings from the store.
  useEffect(() => {
    if (useDrillStore.getState().activeSession === null) {
      startSession(bank, Date.now());
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
    promptShownAt.current = performance.now();
  }, [byId]);

  const advance = useCallback(() => {
    clearAdvanceTimer();
    setResult(null);
    setPhase('answering');
    goToCurrent(); // store index already advanced by recordAnswer
  }, [clearAdvanceTimer, goToCurrent]);

  const answer = useCallback(
    (payload: AnswerPayload) => {
      if (phase !== 'answering' || !item) return;
      const ms = performance.now() - promptShownAt.current;
      const graded = gradeAnswer(item, payload);
      recordAnswer(item, graded.correct, ms, Date.now()); // advances store pointer
      setResult(graded);
      setPhase('feedback'); // displayId stays on the answered item
      // Reveal audio: play the answer (chords/intervals/scales) on every answer,
      // right or wrong, when sound is on. Fire-and-forget — never blocks advance.
      if (settings.sound) playAnswerAudio(item);
      if (graded.correct) {
        // Auto-advance after a brief feedback flash. (Timing is not an
        // animation — keep it even under prefers-reduced-motion.)
        clearAdvanceTimer();
        advanceTimer.current = setTimeout(() => {
          advanceTimer.current = null;
          setResult(null);
          setPhase('answering');
          goToCurrent();
        }, AUTO_ADVANCE_MS);
      }
    },
    [phase, item, recordAnswer, clearAdvanceTimer, goToCurrent, settings.sound],
  );

  const endSession = useCallback(() => {
    clearAdvanceTimer();
    setResult(null);
    setPhase('answering');
    setDisplayId(null);
    // Snapshot the score BEFORE the store nulls the session, so the summary
    // can show it.
    const s = useDrillStore.getState().activeSession;
    setEndedSummary({ asked: s?.asked ?? 0, correct: s?.correct ?? 0 });
    endSessionStore();
  }, [clearAdvanceTimer, endSessionStore]);

  const startNewSession = useCallback(() => {
    clearAdvanceTimer();
    setResult(null);
    setPhase('answering');
    setEndedSummary(null);
    startSession(bank, Date.now());
    // Read the freshly-composed queue's first id immediately.
    const session = useDrillStore.getState().activeSession;
    setDisplayId(session ? currentKnownId(session, byId) : null);
    promptShownAt.current = performance.now();
  }, [clearAdvanceTimer, startSession, bank, byId]);

  return {
    phase,
    item: complete ? null : item,
    result,
    asked: endedSummary?.asked ?? activeSession?.asked ?? 0,
    total: settings.length,
    correctCount: endedSummary?.correct ?? activeSession?.correct ?? 0,
    sessionComplete: complete,
    answer,
    advance,
    endSession,
    startNewSession,
  };
}
