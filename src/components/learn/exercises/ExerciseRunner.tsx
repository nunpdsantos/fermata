import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { m, AnimatePresence } from 'framer-motion';
import type { ExerciseDefinition, ValidationResult, EarTrainingConfig } from '../../../core/types/exercise';
import { validateAnswer } from './validateExercise';
import { generateNoteChoices, generateIntervalChoices, generateEarChoices, generateDegreeChoices, generateMultipleChoiceOptions, earPlaybackLockMs } from './exerciseHelpers';
import type { ChoiceOption } from './exerciseHelpers';
import { ExerciseProgress } from './ExerciseProgress';
import { ExercisePrompt } from './ExercisePrompt';
import { ExerciseFeedback } from './ExerciseFeedback';
import { ChoiceInput } from './inputs/ChoiceInput';
import { InstrumentInput } from './inputs/InstrumentInput';
import { playNote, playChord, playScale, resumeAudio } from '../../../core/services/audio';
import { getSynthConfig } from '../../../services/synthConfig';
import type { NaturalNote, Accidental, Note, ChordQuality, ScaleType } from '../../../core/types/music';
import { buildChord, getDiatonicTriads } from '../../../core/constants/chords';
import { buildScale } from '../../../core/constants/scales';
import { palette } from '../../../design/tokens/palette';
import { selectWeightedExercises } from '../../../services/exerciseSelector';

type Phase = 'active' | 'submitted';

interface ExerciseRunnerProps {
  exercises: ExerciseDefinition[];
  accentColor: string;
  /** When true, shows review-specific completion messages */
  reviewMode?: boolean;
  onRecordResult: (exerciseId: string, score: 0 | 0.5 | 1) => void;
  onComplete: (passed: boolean) => void;
}

export function ExerciseRunner({ exercises, accentColor, reviewMode = false, onRecordResult, onComplete }: ExerciseRunnerProps) {
  const { t } = useTranslation();

  // Plain shuffle — no concept weighting after gamification removal
  const orderedExercises = useMemo(
    () => selectWeightedExercises(exercises, [], exercises.length),
    [exercises],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('active');
  const [attempt, setAttempt] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const exercise = orderedExercises[currentIndex];

  // Generate choices for current exercise (memoized per exercise)
  const choices: ChoiceOption[] = useMemo(() => {
    if (!exercise) return [];
    const cfg = exercise.config;
    switch (cfg.type) {
      case 'note_id':
        return generateNoteChoices(cfg.note, cfg.accidental);
      case 'interval_id':
        return generateIntervalChoices(cfg.targetSemitones);
      case 'multiple_choice':
        return generateMultipleChoiceOptions(cfg.choices, exercise.id);
      case 'ear_training': {
        if (cfg.mode === 'note') return generateNoteChoices(cfg.note ?? 'C', cfg.accidental ?? '');
        if (cfg.mode === 'interval') return generateIntervalChoices(cfg.targetSemitones ?? 7);
        if ((cfg.mode === 'chord' || cfg.mode === 'scale' || cfg.mode === 'progression') && cfg.choices) return generateEarChoices(cfg.choices);
        return [];
      }
      case 'scale_degree_id':
        return generateDegreeChoices(cfg.correctDegree, t);
      default:
        return [];
    }
  }, [exercise, t]);

  // Ear training: play audio on mount and provide replay
  const playingRef = useRef(false);
  const playEarAudio = useCallback(async () => {
    if (!exercise || exercise.config.type !== 'ear_training' || playingRef.current) return;
    playingRef.current = true;
    try {
      await resumeAudio();
      const cfg = exercise.config as EarTrainingConfig;
      const pianoConfig = getSynthConfig('piano');
      if (cfg.mode === 'note' && cfg.note) {
        const note: Note = { natural: cfg.note as NaturalNote, accidental: (cfg.accidental ?? '') as Accidental };
        playNote(note, cfg.octave ?? 4, 1.0, pianoConfig);
      } else if (cfg.mode === 'interval' && cfg.root && cfg.targetSemitones !== undefined) {
        const rootNote: Note = { natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental ?? '') as Accidental };
        const oct = cfg.rootOctave ?? 4;
        // Compute the interval note pitch class
        const semitones = cfg.direction === 'descending' ? -cfg.targetSemitones : cfg.targetSemitones;
        const NATURALS: NaturalNote[] = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
        const ACCIDENTALS: Accidental[] = ['', '#', '', '#', '', '', '#', '', '#', '', '#', ''];
        const rootPCs: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        let rootPC = rootPCs[cfg.root] ?? 0;
        if (cfg.rootAccidental === '#') rootPC += 1;
        if (cfg.rootAccidental === 'b') rootPC -= 1;
        const targetPC = ((rootPC + semitones) % 12 + 12) % 12;
        const targetNote: Note = { natural: NATURALS[targetPC], accidental: ACCIDENTALS[targetPC] };
        const targetOct = oct + (rootPC + semitones >= 12 ? 1 : rootPC + semitones < 0 ? -1 : 0);
        if (cfg.harmonic) {
          // Harmonic interval: both notes sound together.
          playNote(rootNote, oct, 1.2, pianoConfig);
          playNote(targetNote, targetOct, 1.2, pianoConfig);
        } else {
          playNote(rootNote, oct, 0.6, pianoConfig);
          setTimeout(() => playNote(targetNote, targetOct, 0.6, pianoConfig), 700);
        }
      } else if (cfg.mode === 'chord' && cfg.chordRoot && cfg.quality) {
        const root: Note = { natural: cfg.chordRoot as NaturalNote, accidental: (cfg.chordRootAccidental ?? '') as Accidental };
        const chord = buildChord(root, cfg.quality as ChordQuality);
        playChord(chord.notes, 4, 1.2, pianoConfig);
      } else if (cfg.mode === 'scale' && cfg.root && cfg.scaleType) {
        const root: Note = { natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental ?? '') as Accidental };
        const scale = buildScale(root, cfg.scaleType as ScaleType);
        playScale(scale.notes, cfg.rootOctave ?? 4, true, false, 0.35, undefined, undefined, pianoConfig);
      } else if (cfg.mode === 'progression' && cfg.progression) {
        const key: Note = { natural: (cfg.root ?? 'C') as NaturalNote, accidental: (cfg.rootAccidental ?? '') as Accidental };
        const triads = getDiatonicTriads(key);
        cfg.progression.forEach((numeral, i) => {
          const entry = triads.find((t2) => t2.numeral.replace('°', '') === numeral.replace('°', ''));
          if (!entry) return;
          setTimeout(() => playChord(entry.chord.notes, 4, 0.85, pianoConfig), i * 950);
        });
      }
    } finally {
      // Hold the lock for the FULL scheduled playback (mode-dependent) so a
      // rapid Replay cannot overlap the stimulus (audit R-01).
      const cfg = exercise.config as EarTrainingConfig;
      setTimeout(() => { playingRef.current = false; }, earPlaybackLockMs(cfg));
    }
  }, [exercise]);

  // Auto-play ear training audio when exercise changes
  useEffect(() => {
    if (exercise?.config.type === 'ear_training' && phase === 'active') {
      // Small delay to let the UI render first
      const t = setTimeout(playEarAudio, 300);
      return () => clearTimeout(t);
    }
  }, [exercise, playEarAudio, phase]);

  const handleSelectChoice = useCallback((value: string) => {
    setSelected(value);
  }, []);

  const handleSubmitChoice = useCallback(() => {
    if (!exercise || selected === null) return;
    const result = validateAnswer(exercise.config, selected, t);
    setValidationResult(result);
    setPhase('submitted');

    if (result.correct) {
      const score: 0 | 0.5 | 1 = attempt === 1 ? 1 : 0.5;
      onRecordResult(exercise.id, score);
      setAccumulatedScore((prev) => prev + score);
    } else if (attempt >= 2) {
      onRecordResult(exercise.id, 0);
    }
  }, [exercise, selected, attempt, onRecordResult, t]);

  const handleSubmitInstrument = useCallback((pitchClasses: Set<number>) => {
    if (!exercise) return;
    const result = validateAnswer(exercise.config, pitchClasses, t);
    setValidationResult(result);
    setPhase('submitted');

    if (result.correct) {
      const score: 0 | 0.5 | 1 = attempt === 1 ? 1 : 0.5;
      onRecordResult(exercise.id, score);
      setAccumulatedScore((prev) => prev + score);
    } else if (attempt >= 2) {
      onRecordResult(exercise.id, 0);
    }
  }, [exercise, attempt, onRecordResult, t]);

  const handleTryAgain = useCallback(() => {
    setAttempt(2);
    setPhase('active');
    setSelected(null);
    setValidationResult(null);
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= orderedExercises.length) {
      // All exercises done
      const passed = accumulatedScore >= orderedExercises.length * 0.8;
      setFinished(true);
      onComplete(passed);
    } else {
      setCurrentIndex(nextIndex);
      setPhase('active');
      setAttempt(1);
      setSelected(null);
      setValidationResult(null);
    }
  }, [currentIndex, orderedExercises.length, accumulatedScore, onComplete]);

  if (!exercise || finished) {
    // Completion summary
    const passed = accumulatedScore >= orderedExercises.length * 0.8;
    return (
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border p-5"
        style={{ borderColor: 'var(--card-hover)' }}
      >
        <div className="text-center">
          <span className={`text-3xl mb-3 block ${passed ? '' : ''}`}>
            {passed ? (
              <svg className="mx-auto" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={palette.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg className="mx-auto" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={palette.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </span>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
            {reviewMode
              ? (passed ? t('review.reviewComplete') : t('review.reviewAgainSoon'))
              : (passed ? t('exercise.exercisesComplete') : t('exercise.keepPracticing'))}
          </h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
            {t('exercise.score', { score: accumulatedScore % 1 === 0 ? accumulatedScore : accumulatedScore.toFixed(1), total: orderedExercises.length })}
            {passed
              ? ' — ' + t('exercise.passed')
              : ' — ' + t('exercise.needToPass', { score: Math.ceil(orderedExercises.length * 0.8) })}
          </p>
        </div>
      </m.div>
    );
  }

  const isEarTraining = exercise.config.type === 'ear_training';
  const isChoiceBased = exercise.config.type === 'note_id' || exercise.config.type === 'interval_id' || exercise.config.type === 'multiple_choice' || exercise.config.type === 'scale_degree_id' || isEarTraining;
  const isInstrumentBased = exercise.config.type === 'scale_build' || exercise.config.type === 'chord_build';

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--card-hover)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-hover)', backgroundColor: 'color-mix(in srgb, var(--bg-raised) 50%, transparent)' }}>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          {t('exercise.title')}
        </h2>
        <ExerciseProgress
          current={currentIndex}
          total={orderedExercises.length}
          score={accumulatedScore}
          accentColor={accentColor}
        />
      </div>

      {/* Exercise body */}
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          <m.div
            key={exercise.id + '-' + attempt}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <ExercisePrompt exercise={exercise} />

            {/* Ear training replay button */}
            {isEarTraining && phase === 'active' && (
              <div className="mb-3 flex justify-center">
                <button
                  onClick={playEarAudio}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.03]"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                    border: `1px solid ${accentColor}30`,
                  }}
                  aria-label={t('exercise.replayAudio')}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                  {t('common.replay')}
                </button>
              </div>
            )}

            {/* Input */}
            {isChoiceBased && (
              <>
                <ChoiceInput
                  options={choices}
                  selected={selected}
                  submitted={phase === 'submitted'}
                  onSelect={handleSelectChoice}
                  accentColor={accentColor}
                />
                {phase === 'active' && selected !== null && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 flex justify-end"
                  >
                    <button
                      onClick={handleSubmitChoice}
                      className="px-4 py-1.5 max-sm:py-2 max-sm:px-5 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                      }}
                    >
                      {t('common.submit')}
                    </button>
                  </m.div>
                )}
              </>
            )}

            {isInstrumentBased && (
              <InstrumentInput
                expectedCount={
                  exercise.config.type === 'scale_build'
                    ? exercise.config.noteCount
                    : exercise.config.type === 'chord_build'
                      ? exercise.config.noteCount
                      : 0
                }
                submitted={phase === 'submitted'}
                onSubmit={handleSubmitInstrument}
                accentColor={accentColor}
              />
            )}

            {/* Feedback */}
            {phase === 'submitted' && validationResult && (
              <ExerciseFeedback
                result={validationResult}
                attempt={attempt}
                hint={exercise.hint}
                onTryAgain={handleTryAgain}
                onNext={handleNext}
                accentColor={accentColor}
              />
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
