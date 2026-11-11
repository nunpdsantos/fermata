import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n/tuner/answer.ts';
import { ChoiceChip } from '../ui/ChoiceChip.tsx';
import { answerWanted, setAnswerWanted } from './answerSession.ts';
import { Button } from '../ui/Button.tsx';
import { makeAudioContext, microphonePermission, microphoneSupported } from '../../services/microphone/support.ts';
import type { MicProblem, MicSession, MicStopReason } from '../../services/microphone/microphone.ts';
import type { PlayedNotes } from '../../services/microphone/playedNotes.ts';

/**
 * "Use my instrument" (wave 3, brief T) — beside a check answered on the
 * instrument (chord_build, scale_build). Off by default and offered only
 * where a microphone can work. On, each note heard held steadily is reported
 * through `services/externalNotes.ts` (source 'mic'); the listener that adds
 * it to the answer is mounted elsewhere (stream K). The learner still
 * submits, the on-screen instrument keeps working, and nothing waits for it.
 *
 * The first time, one sentence says why the microphone is needed and that
 * the sound never leaves the device, before the browser is asked. Turned on,
 * it stays on for the next instrument question of the same visit (it
 * listens again when that question opens) until the learner turns it off,
 * the microphone stops by itself (page hidden, view changed, unplugged) or
 * it is refused. The microphone code loads only when it is turned on.
 */
type State =
  | { kind: 'off' }
  | { kind: 'explain' }
  | { kind: 'asking' }
  | { kind: 'on'; heard: number | null }
  | { kind: 'problem'; problem: MicProblem | 'hidden' | 'ended' };


export function UseMyInstrument({ active, nameOf }: {
  /** The question still takes answers (not yet final). */
  active: boolean;
  /** A heard note's name, spelled as the check spells its notes. */
  nameOf: (midi: number) => string;
}) {
  const { t } = useTranslation();
  const [supported] = useState(() => microphoneSupported());
  const [state, setState] = useState<State>({ kind: 'off' });
  const session = useRef<MicSession | null>(null);
  const reporter = useRef<PlayedNotes | null>(null);
  const alive = useRef(true);
  // Already allowed for this site? Then the sentence before the browser's
  // question is not needed again (there is no question).
  const granted = useRef(false);
  useEffect(() => {
    if (!supported) return;
    void microphonePermission().then((p) => {
      granted.current = p === 'granted';
    });
  }, [supported]);

  // One token per attempt to listen: an attempt cancelled (turned off, the
  // question final, the control gone) before the browser answers closes
  // whatever arrives after.
  const attempt = useRef<object | null>(null);
  const mic = useRef<typeof import('../../services/microphone/microphone.ts') | null>(null);
  const release = useCallback(() => {
    if (attempt.current && !session.current) mic.current?.stopListening();
    attempt.current = null;
    session.current?.stop();
    session.current = null;
    reporter.current?.dispose();
    reporter.current = null;
  }, []);

  const listen = useCallback(() => {
    const token = {};
    attempt.current = token;
    const current = () => alive.current && attempt.current === token;
    setState({ kind: 'asking' });
    // Made now, inside the tap (iOS starts audio only there); the modules
    // below load after it.
    let context: AudioContext | undefined;
    try {
      context = makeAudioContext();
    } catch {
      context = undefined;
    }
    const loading = Promise.all([import('../../services/microphone/microphone.ts'), import('../../services/microphone/playedNotes.ts')]);
    void loading.then(([micModule, played]) => {
      mic.current = micModule;
      if (!current()) {
        void context?.close().catch(() => undefined);
        return;
      }
      const notes = played.reportPlayedNotes((midi, on) => {
        if (on && current()) setState({ kind: 'on', heard: midi });
      });
      const onStop = (reason: MicStopReason) => {
        notes.dispose();
        if (!current()) return;
        attempt.current = null;
        reporter.current = null;
        session.current = null;
        if (reason === 'hidden' || reason === 'ended' || reason === 'view') {
          setAnswerWanted(false);
          setState({ kind: 'problem', problem: reason === 'view' ? 'hidden' : reason });
        } else setState({ kind: 'off' });
      };
      micModule.startListening({ onFrame: (e, time) => notes.onFrame(e, time), onStop }, context).then(
        (s) => {
          if (!current()) {
            s.stop();
            notes.dispose();
            return;
          }
          session.current = s;
          reporter.current = notes;
          setAnswerWanted(true);
          setState({ kind: 'on', heard: null });
        },
        (error: unknown) => {
          notes.dispose();
          const problem = (error as { problem?: MicProblem | 'stopped' }).problem ?? 'failed';
          if (problem === 'stopped' || !current()) return;
          attempt.current = null;
          setAnswerWanted(false);
          setState({ kind: 'problem', problem });
        },
      );
    }, () => {
      void context?.close().catch(() => undefined);
      if (!current()) return;
      attempt.current = null;
      setState({ kind: 'problem', problem: 'failed' });
    });
  }, []);

  // Listening again on the next question, if it was on; stopping when the
  // question is final, and when this control goes away.
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      release();
    };
  }, [release]);
  useEffect(() => {
    if (!supported) return;
    if (!active) {
      if (attempt.current) {
        release();
        setState({ kind: 'off' });
      }
      return;
    }
    if (answerWanted() && !attempt.current) listen();
  }, [active, supported, listen, release]);

  if (!supported) return null;

  const toggle = () => {
    if (state.kind === 'on' || state.kind === 'asking') {
      setAnswerWanted(false);
      release();
      setState({ kind: 'off' });
      return;
    }
    if (state.kind === 'explain') {
      setState({ kind: 'off' });
      return;
    }
    if (granted.current) listen();
    else setState({ kind: 'explain' });
  };

  const on = state.kind === 'on' || state.kind === 'asking';
  return (
    <div className="flex flex-col gap-2" data-testid="use-my-instrument" data-state={state.kind}>
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChip pressed={on} onClick={toggle} disabled={!active && !on} className="tuner-wrap" data-testid="use-my-instrument-toggle">
          {t('tuner.answer.use')}
        </ChoiceChip>
        {state.kind === 'on' && (
          <span className="tuner-listening text-caption" data-testid="listening-mark">
            <span className="tuner-listening-dot" aria-hidden="true" />
            {t('tuner.answer.listening')}
          </span>
        )}
      </div>
      <div aria-live="polite" className="flex flex-col gap-2">
        {state.kind === 'explain' && (
          <>
            <p className="text-ui" style={{ color: 'var(--text)' }}>{t('tuner.answer.why')}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={listen} data-testid="use-my-instrument-allow">{t('tuner.answer.allow')}</Button>
              <Button variant="quiet" onClick={() => setState({ kind: 'off' })}>{t('tuner.answer.notNow')}</Button>
            </div>
          </>
        )}
        {state.kind === 'asking' && <p className="text-ui" style={{ color: 'var(--text)' }}>{t('tuner.answer.asking')}</p>}
        {state.kind === 'on' && (
          <p className="text-ui" style={{ color: 'var(--text)' }} data-testid="use-my-instrument-heard">
            {state.heard === null ? t('tuner.answer.on') : t('tuner.answer.heard', { note: nameOf(state.heard) })}
          </p>
        )}
        {state.kind === 'problem' && (
          <p className="text-ui" style={{ color: 'var(--text)' }} data-testid="use-my-instrument-problem">{t(`tuner.answer.problem.${state.problem}`)}</p>
        )}
      </div>
    </div>
  );
}
