import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ExerciseDefinition, ValidationResult, EarTrainingConfig } from '../../../core/types/exercise';
import type { RunItem, RunSnapshot } from '../../../state/learnSessionStore';
import { validateAnswer } from './validateExercise';
import {
  generateNoteChoices, generateIntervalChoices, generateSpelledIntervalChoices, generateIntervalNumberChoices,
  generateStepChoices, intervalNumberOf, generateEarChoices, generateDegreeChoices, generateMultipleChoiceOptions,
  generateMelodyChoices, earPlaybackLockMs, earChordPitches, earProgressionPitches, earIntervalPitches, earReference,
  earReferenceLeadMs, earMelodyPitches, optionText, EAR_REFERENCE_NOTE_S, EAR_REFERENCE_CHORD_S, MELODY_STEP_S, MELODY_NOTE_S, MELODY_LAST_S,
} from './exerciseHelpers';
import type { ChoiceOption } from './exerciseHelpers';
import { ExercisePrompt } from './ExercisePrompt';
import { ChoiceInput } from './inputs/ChoiceInput';
import { InstrumentInput } from './inputs/InstrumentInput';
import { playNote, playPitchedNotes, playScale, playTimedNotes, resumeAudio, stopPlayback } from '../../../core/services/audio';
import { getSynthConfig } from '../../../services/synthConfig';
import type { NaturalNote, Accidental, Note, ChordQuality, ScaleType } from '../../../core/types/music';
import { noteToString } from '../../../core/types/music';
import { buildChord } from '../../../core/constants/chords';
import { buildScale } from '../../../core/constants/scales';
import { directionSpeller } from '../../../core/utils/spelling';
import { selectWeightedExercises } from '../../../services/exerciseSelector';
import { Button } from '../../ui/Button';
import { Feedback } from '../../ui/Feedback';
import { useToastAvoid } from '../../layout/toastLayout';

/** What happened on one question of a run — the result screen's material. */
export interface ItemOutcome {
  exercise: ExerciseDefinition;
  /** What the learner answered, in words, in order (one or two tries). */
  answers: string[];
  /** 1 right first time, 0.5 right on the second try, 0 not right. */
  score: 0 | 0.5 | 1;
  /** The answer, in words (shown once the item is final — D-09). */
  answer: string;
}

export type RunMode = 'check' | 'review' | 'practice';

/** Answers longer than this are not quoted in the verdict's title (a whole statement read badly there). */
const SHORT_ANSWER = 24;

interface ExerciseRunnerProps {
  exercises: ExerciseDefinition[];
  accentColor: string;
  /** The lesson title, for the line above each question. */
  title?: string;
  /** When true, the run is a spaced-repetition review. */
  reviewMode?: boolean;
  /** A practice round (e.g. "practise the ones I missed"): nothing is scored or saved. */
  practice?: boolean;
  onRecordResult: (exerciseId: string, score: 0 | 0.5 | 1) => void;
  onComplete: (passed: boolean, outcomes: ItemOutcome[]) => void;
  /** ✕ Exit: leave the check (answers given so far stay recorded). */
  onExit?: () => void;
  /** Continue a saved run (after a reload): order, answers, attempts, hint state. */
  resume?: RunSnapshot;
  /** Every change of the run's state, to be saved (learnSessionStore). */
  onSnapshot?: (run: RunSnapshot) => void;
}

/**
 * The focused check (W4b, decision D-27 / D-09): one question at a time, the
 * position always shown ("4 / 9"), ✕ Exit, and the answers low on a phone,
 * in thumb reach. Reveal policy (audit W4-04): a first wrong try shows "Not X
 * — have another go." and the hint, the tried option struck through — never
 * the answer; the answer is shown only once the item is final (right, or the
 * last try used).
 *
 * Scoring is unchanged: right first time 1, right on the second try 0.5,
 * otherwise 0; a set passes at 80 % of its questions. One change keeps the
 * pass mark meaningful: an item with only two options gets ONE try — after a
 * miss its second try could not be wrong. Practice rounds are never scored.
 */
export function ExerciseRunner({ exercises, accentColor, title, reviewMode = false, practice = false, onRecordResult, onComplete, onExit, resume, onSnapshot }: ExerciseRunnerProps) {
  const { t, i18n } = useTranslation();
  // Scale/chord names inside feedback follow the UI language (audit W1-10).
  const feedbackLang = (['pt', 'es'].includes(i18n.language?.slice(0, 2)) ? i18n.language.slice(0, 2) : 'en') as 'en' | 'pt' | 'es';

  // Plain shuffle — no concept weighting after gamification removal. A
  // resumed run keeps its saved order.
  const [orderedExercises] = useState(() => {
    if (resume) {
      const byId = new Map(exercises.map((ex) => [ex.id, ex]));
      const ordered = resume.order.map((id) => byId.get(id)).filter((ex): ex is ExerciseDefinition => !!ex);
      if (ordered.length === resume.order.length) return ordered;
    }
    return selectWeightedExercises(exercises, [], exercises.length);
  });
  const byId = useMemo(() => new Map(orderedExercises.map((ex) => [ex.id, ex])), [orderedExercises]);

  /** The whole run in one value: what is saved, and what a reload restores. */
  const [run, setRun] = useState<RunSnapshot>(() =>
    resume && resume.order.length === orderedExercises.length
      ? resume
      : { order: orderedExercises.map((ex) => ex.id), index: 0, scores: [], items: [], attempt: 1, tried: [], missed: null, final: null },
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const { index: currentIndex, attempt, tried, missed, scores } = run;
  const final = run.final;

  useEffect(() => {
    onSnapshot?.(run);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- report each new state once
  }, [run]);

  const exercise = orderedExercises[currentIndex];
  const total = orderedExercises.length;
  const outcomesOf = useCallback((items: RunItem[]): ItemOutcome[] =>
    items.flatMap((i) => {
      const ex = byId.get(i.id);
      return ex ? [{ exercise: ex, answers: i.answers, score: i.score, answer: i.answer }] : [];
    }), [byId]);

  // The notes a build exercise asks for — handed to the instrument input only
  // so it can name picks in the key's sharp/flat direction (audit W1-08).
  const buildTargetNotes = useMemo((): Note[] | undefined => {
    const cfg = exercise?.config;
    if (cfg?.type === 'scale_build') {
      return buildScale({ natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental || '') as Accidental }, cfg.scaleType as ScaleType).notes;
    }
    if (cfg?.type === 'chord_build') {
      return buildChord({ natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental || '') as Accidental }, cfg.quality as ChordQuality).notes;
    }
    return undefined;
  }, [exercise]);

  // Generate choices for current exercise (memoized per exercise)
  const choices: ChoiceOption[] = useMemo(() => {
    if (!exercise) return [];
    const cfg = exercise.config;
    switch (cfg.type) {
      case 'note_id':
        return generateNoteChoices(cfg.note, cfg.accidental);
      case 'interval_id':
        if (cfg.answer === 'step') return generateStepChoices(cfg.targetSemitones, t);
        if (cfg.answer === 'number') return generateIntervalNumberChoices(intervalNumberOf(cfg.intervalNumber, cfg.targetSemitones), t);
        return cfg.intervalNumber !== undefined
          ? generateSpelledIntervalChoices(cfg.intervalNumber, cfg.targetSemitones)
          : generateIntervalChoices(cfg.targetSemitones);
      case 'multiple_choice':
        return generateMultipleChoiceOptions(cfg.choices, exercise.id);
      case 'ear_training': {
        if (cfg.mode === 'note') return generateNoteChoices(cfg.note ?? 'C', cfg.accidental ?? '');
        if (cfg.mode === 'interval') return generateIntervalChoices(cfg.targetSemitones ?? 7);
        if (cfg.mode === 'melody') return generateMelodyChoices(cfg, exercise.id);
        if ((cfg.mode === 'chord' || cfg.mode === 'scale' || cfg.mode === 'progression') && cfg.choices) return generateEarChoices(cfg.choices);
        return [];
      }
      case 'scale_degree_id':
        return generateDegreeChoices(cfg.correctDegree, t);
      default:
        return [];
    }
  }, [exercise, t]);

  // ── Ear training: reference, stimulus, replay ────────────────────────────
  // The replay lock belongs to ONE exercise (audit W0-04 / F-01 / C-48). It is
  // held for the stimulus' full scheduled length — the reference pre-roll
  // included — so a rapid Replay cannot overlap it (R-01), but it never
  // outlives its exercise. Everything per-exercise — the lock, its release
  // timer, the note timers — is torn down when the exercise changes.
  const playingRef = useRef(false);
  const earGenRef = useRef(0);
  const earTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const scheduleEar = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      earTimersRef.current.delete(id);
      fn();
    }, ms);
    earTimersRef.current.add(id);
  }, []);

  useEffect(() => {
    const timers = earTimersRef.current;
    return () => {
      earGenRef.current += 1;
      for (const id of timers) clearTimeout(id);
      timers.clear();
      if (playingRef.current) {
        playingRef.current = false;
        stopPlayback();
      }
    };
  }, [exercise]);

  const playEarAudio = useCallback(async () => {
    if (!exercise || exercise.config.type !== 'ear_training' || playingRef.current) return;
    const gen = earGenRef.current;
    playingRef.current = true;
    try {
      await resumeAudio();
      if (gen !== earGenRef.current) return;
      const cfg = exercise.config as EarTrainingConfig;
      const pianoConfig = getSynthConfig('piano');
      // The reference first (D-11): middle C before a single note, the key's
      // tonic chord before a progression or a melody — then the item.
      const reference = earReference(cfg);
      if (reference?.kind === 'pitch') playPitchedNotes(reference.pitches, EAR_REFERENCE_NOTE_S, pianoConfig);
      else if (reference?.kind === 'key') playPitchedNotes(reference.pitches, EAR_REFERENCE_CHORD_S, pianoConfig);
      const lead = earReferenceLeadMs(cfg);
      const after = (fn: () => void) => (lead > 0 ? scheduleEar(fn, lead) : fn());

      if (cfg.mode === 'note' && cfg.note) {
        const note: Note = { natural: cfg.note as NaturalNote, accidental: (cfg.accidental ?? '') as Accidental };
        after(() => playNote(note, cfg.octave ?? 4, 1.0, pianoConfig));
      } else if (cfg.mode === 'interval' && cfg.root && cfg.targetSemitones !== undefined) {
        // Both pitches by MIDI arithmetic: compound intervals sound right (W4-18).
        const [root, target] = earIntervalPitches(cfg)!;
        if (cfg.harmonic) {
          playNote(root, root.octave, 1.2, pianoConfig);
          playNote(target, target.octave, 1.2, pianoConfig);
        } else {
          playNote(root, root.octave, 0.6, pianoConfig);
          scheduleEar(() => playNote(target, target.octave, 0.6, pianoConfig), 700);
        }
      } else if (cfg.mode === 'chord' && cfg.chordRoot && cfg.quality) {
        // Root position, as the piano lights it (audit W4-10).
        playPitchedNotes(earChordPitches(cfg), 1.2, pianoConfig);
      } else if (cfg.mode === 'scale' && cfg.root && cfg.scaleType) {
        const root: Note = { natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental ?? '') as Accidental };
        const scale = buildScale(root, cfg.scaleType as ScaleType);
        playScale(scale.notes, cfg.rootOctave ?? 4, true, false, 0.35, undefined, undefined, pianoConfig);
      } else if (cfg.mode === 'progression' && cfg.progression) {
        // Each chord in root position over a clear bass (audit W4-10).
        earProgressionPitches(cfg).forEach((pitches, i) => {
          if (pitches.length === 0) return;
          scheduleEar(() => playPitchedNotes(pitches, 0.85, pianoConfig), lead + i * 950);
        });
      } else if (cfg.mode === 'melody') {
        // The melody is the correct option's notes (W4-13), on the audio clock.
        const melody = earMelodyPitches(cfg);
        after(() => playTimedNotes(
          melody.map((note, i) => ({ note, at: i * MELODY_STEP_S, duration: i === melody.length - 1 ? MELODY_LAST_S : MELODY_NOTE_S })),
          pianoConfig,
        ));
      }
    } finally {
      if (gen === earGenRef.current) {
        const cfg = exercise.config as EarTrainingConfig;
        scheduleEar(() => { playingRef.current = false; }, earPlaybackLockMs(cfg));
      }
    }
  }, [exercise, scheduleEar]);

  // Auto-play ear training audio when the exercise changes
  useEffect(() => {
    if (exercise?.config.type === 'ear_training' && !final) {
      const id = setTimeout(playEarAudio, 300);
      return () => clearTimeout(id);
    }
    // Only on a new item: not again when it becomes final.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise, playEarAudio]);

  // ── Answering ────────────────────────────────────────────────────────────
  const wordsFor = useCallback((value: string) => {
    const opt = choices.find((c) => c.value === value);
    return opt ? optionText(opt) : value;
  }, [choices]);
  const answerWords = useMemo(() => {
    const correct = choices.find((c) => c.correct);
    return correct ? optionText(correct) : '';
  }, [choices]);

  // A second try is offered when it is still a real choice (≥ 2 options left).
  const choiceRetry = choices.length >= 3;

  const settle = useCallback((result: ValidationResult, score: 0 | 0.5 | 1, answers: string[], answer: string) => {
    if (!exercise) return;
    if (!practice) onRecordResult(exercise.id, score);
    setRun((r) => ({
      ...r,
      final: { score, correct: result.correct, explanation: result.explanation, expected: result.expected },
      scores: [...r.scores, score],
      items: [...r.items, { id: exercise.id, answers, score, answer }],
    }));
  }, [exercise, practice, onRecordResult]);

  /** A wrong first try with a second one to come: strike it, show the hint. */
  const miss = useCallback((value: string, words: string, missedWords: string) => {
    setRun((r) => ({ ...r, attempt: 2, tried: [...r.tried, { value, words }], missed: missedWords }));
  }, []);

  const handleSubmitChoice = useCallback(() => {
    if (!exercise || selected === null || final) return;
    const result = validateAnswer(exercise.config, selected, t, feedbackLang);
    const words = wordsFor(selected);
    const answers = [...tried.map((x) => x.words), words];
    if (result.correct) {
      settle(result, attempt === 1 ? 1 : 0.5, answers, answerWords);
    } else if (attempt === 1 && choiceRetry) {
      miss(selected, words, words);
      setSelected(null);
    } else {
      settle(result, 0, answers, answerWords);
    }
  }, [exercise, selected, final, t, feedbackLang, wordsFor, tried, attempt, choiceRetry, settle, miss, answerWords]);

  const handleSubmitInstrument = useCallback((pitchClasses: Set<number>) => {
    if (!exercise || final) return;
    const result = validateAnswer(exercise.config, pitchClasses, t, feedbackLang);
    const spell = directionSpeller(buildTargetNotes ?? []);
    const words = [...pitchClasses].sort((a, b) => a - b).map((pc) => noteToString(spell(pc))).join(' ');
    const target = (buildTargetNotes ?? []).map(noteToString).join(' ');
    const answer = target ? `${result.expected}: ${target}` : result.expected;
    const answers = [...tried.map((x) => x.words), words];
    if (result.correct) {
      settle(result, attempt === 1 ? 1 : 0.5, answers, answer);
    } else if (attempt === 1) {
      miss(words, words, '');
    } else {
      settle(result, 0, answers, answer);
    }
  }, [exercise, final, t, feedbackLang, buildTargetNotes, tried, attempt, settle, miss]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= total) {
      const earned = scores.reduce<number>((a, b) => a + b, 0);
      setFinished(true);
      onComplete(earned >= total * 0.8, outcomesOf(run.items));
    } else {
      setSelected(null);
      setRun((r) => ({ ...r, index: nextIndex, attempt: 1, tried: [], missed: null, final: null }));
    }
  }, [currentIndex, total, scores, onComplete, outcomesOf, run.items]);

  // Answers, verdict and Continue: never under a toast (W11-A toastLayout).
  const thumbRef = useRef<HTMLDivElement>(null);
  useToastAvoid(thumbRef, true);

  // Continue takes focus when an item becomes final (keyboard flow).
  const continueRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (final) continueRef.current?.focus({ preventScroll: true });
  }, [final]);

  if (!exercise || finished) return null;

  const cfg = exercise.config;
  const isEarTraining = cfg.type === 'ear_training';
  const isInstrumentBased = cfg.type === 'scale_build' || cfg.type === 'chord_build';
  const context = title
    ? t(practice ? 'lesson.practiceContext' : reviewMode ? 'lesson.reviewContext' : 'lesson.checkContext', { title })
    : null;

  // The verdict card. Before the item is final it never names the answer.
  let feedback: React.ReactNode = null;
  if (final) {
    const right = final.correct;
    const expectedNotes = isInstrumentBased && buildTargetNotes ? buildTargetNotes.map(noteToString).join(' ') : null;
    feedback = (
      <Feedback
        tone={right ? 'correct' : 'wrong'}
        title={right
          ? (final.score === 1 ? t('exercise.correct') : t('lesson.secondTry'))
          : isInstrumentBased || answerWords.length <= SHORT_ANSWER
            ? t('lesson.itIsAnswer', { answer: isInstrumentBased ? final.expected : answerWords })
            : t('lesson.notQuiteMarked')}
        // Right: the title says it. Final miss: the answer is in the title;
        // below it, what explains it — the item's hint (now that nothing is
        // left to give away), else the grader's explanation.
        hint={right ? undefined : (
          <>
            {isInstrumentBased || !exercise.hint ? final.explanation : t('exercise.hint', { hint: exercise.hint })}
            {expectedNotes ? ` ${t('lesson.expectedNotes', { notes: expectedNotes })}` : ''}
          </>
        )}
      />
    );
  } else if (missed !== null) {
    feedback = (
      <Feedback
        tone="nearMiss"
        title={missed && missed.length <= SHORT_ANSWER ? t('lesson.notAnswer', { answer: missed }) : t('lesson.notQuiteRetry')}
        hint={exercise.hint ? t('exercise.hint', { hint: exercise.hint }) : t('lesson.noHint')}
      />
    );
  }

  return (
    <div className="check-run flex-1 flex flex-col w-full max-w-[640px] mx-auto px-4 max-sm:px-3 pt-2 pb-4" data-testid="focused-check">
      {/* ✕ Exit · progress · n / N */}
      <div className="flex items-center gap-2 min-h-12">
        {onExit && (
          <Button
            variant="quiet"
            onClick={onExit}
            aria-label={t('lesson.exitLabel')}
            startIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>}
          >
            {t('lesson.exit')}
          </Button>
        )}
        <div className="flex-1 flex justify-center gap-1 min-w-0" aria-hidden="true" data-testid="check-pips">
          {orderedExercises.map((ex, i) => {
            const s = scores[i];
            const bg = i === currentIndex && !final ? accentColor
              : s === 1 ? 'var(--success-text)'
              : s === 0.5 ? 'var(--warning-text)'
              : s === 0 ? 'var(--danger-text)'
              : 'var(--card-active)';
            return <i key={ex.id} className="block h-1.5 rounded-full" style={{ flex: '1 1 0', maxWidth: 26, minWidth: 4, backgroundColor: bg }} />;
          })}
        </div>
        <span className="text-ui tabular-nums shrink-0" style={{ color: 'var(--text-muted)' }} aria-label={t('lesson.questionOf', { current: currentIndex + 1, total })} data-testid="check-position">
          {t('lesson.position', { current: currentIndex + 1, total })}
        </span>
      </div>

      {/* The question */}
      <div className="flex flex-col gap-3 py-4 sm:py-8" key={exercise.id}>
        {context && <p className="text-ui" style={{ color: 'var(--text-muted)' }}>{context}</p>}
        <ExercisePrompt exercise={exercise} />
        {isEarTraining && (
          <div>
            <Button
              variant="secondary"
              onClick={playEarAudio}
              aria-label={t('exercise.replayAudio')}
              startIcon={<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" /></svg>}
            >
              {t('common.replay')}
            </Button>
          </div>
        )}
      </div>

      {/* Verdict, answers, Submit / Continue — low on a phone (thumb zone) */}
      <div ref={thumbRef} className="flex flex-col gap-3 max-sm:mt-auto" data-testid="check-thumb">
        {feedback}
        {isInstrumentBased ? (
          <InstrumentInput
            key={exercise.id}
            expectedCount={cfg.type === 'scale_build' || cfg.type === 'chord_build' ? cfg.noteCount : 0}
            submitted={final !== null}
            onSubmit={handleSubmitInstrument}
            accentColor={accentColor}
            spellingContext={buildTargetNotes}
          />
        ) : (
          <ChoiceInput
            options={choices}
            selected={selected}
            tried={tried.map((x) => x.value)}
            final={final !== null}
            onSelect={setSelected}
          />
        )}
        {final ? (
          <Button ref={continueRef} variant="primary" block onClick={handleNext}>
            {t('common.continue')}
          </Button>
        ) : !isInstrumentBased && (
          <Button variant="primary" block onClick={handleSubmitChoice} disabled={selected === null}>
            {t('common.submit')}
          </Button>
        )}
      </div>
    </div>
  );
}

