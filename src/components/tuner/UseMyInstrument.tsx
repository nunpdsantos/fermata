import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n/tuner/answer.ts';
import { ChoiceChip } from '../ui/ChoiceChip.tsx';
import { startAnswerListening, stopAnswerListening, useAnswerListening, type AnswerListening } from './answerSession.ts';
import { Button } from '../ui/Button.tsx';
import { microphonePermission, microphoneSupported } from '../../services/microphone/support.ts';

/**
 * "Use my instrument" (wave 3, brief T) — beside a check answered on the
 * instrument (chord_build, scale_build). Off by default and offered only
 * where a microphone can work. On, each note heard held steadily is reported
 * through `services/externalNotes.ts` (source 'mic'); the one listener
 * (`services/externalNotesListener.ts`) adds it to the answer while the
 * question is open. The learner still submits, the on-screen instrument
 * keeps working, and nothing waits for it.
 *
 * The first time, one sentence says why the microphone is needed and that
 * the sound never leaves the device, before the browser is asked. Once on,
 * ONE microphone session lasts the whole check (`answerSession.ts`, wave 3
 * integration): the next questions use it as it is — nothing is reopened
 * outside a tap — until the learner turns it off, the check ends or is left,
 * or the microphone stops by itself (page hidden, view changed, unplugged)
 * or is refused. The microphone code loads only when it is turned on.
 */
type State = AnswerListening | { kind: 'explain' };

export function UseMyInstrument({ active, nameOf }: {
  /** The question still takes answers (not yet final). */
  active: boolean;
  /** A heard note's name, spelled as the check spells its notes. */
  nameOf: (midi: number) => string;
}) {
  const { t } = useTranslation();
  const [supported] = useState(() => microphoneSupported());
  const listening = useAnswerListening((s) => s.state);
  const [explaining, setExplaining] = useState(false);
  // Already allowed for this site? Then the sentence before the browser's
  // question is not needed again (there is no question).
  const granted = useRef(false);
  useEffect(() => {
    if (!supported) return;
    void microphonePermission().then((p) => {
      granted.current = p === 'granted';
    });
  }, [supported]);

  if (!supported) return null;
  const state: State = explaining && listening.kind !== 'on' && listening.kind !== 'asking' ? { kind: 'explain' } : listening;

  const listen = () => {
    setExplaining(false);
    startAnswerListening();
  };
  const toggle = () => {
    if (state.kind === 'on' || state.kind === 'asking') {
      stopAnswerListening();
      return;
    }
    if (state.kind === 'explain') {
      setExplaining(false);
      return;
    }
    if (granted.current) listen();
    else setExplaining(true);
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
              <Button variant="quiet" onClick={() => setExplaining(false)}>{t('tuner.answer.notNow')}</Button>
            </div>
          </>
        )}
        {state.kind === 'asking' && <p className="text-ui" style={{ color: 'var(--text)' }}>{t('tuner.answer.asking')}</p>}
        {state.kind === 'on' && active && (
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

/**
 * A question of the same check NOT answered on the instrument, while the
 * microphone stays open for the check (wave 3 integration): the control,
 * pressed (a tap turns it off), and the listening mark — nothing else. While
 * it is off this renders nothing, so such a question is exactly as before.
 */
export function AnswerListeningMark() {
  const { t } = useTranslation();
  const state = useAnswerListening((s) => s.state);
  if (state.kind !== 'on' && state.kind !== 'asking') return null;
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="use-my-instrument" data-state={state.kind}>
      <ChoiceChip pressed onClick={stopAnswerListening} className="tuner-wrap" data-testid="use-my-instrument-toggle">
        {t('tuner.answer.use')}
      </ChoiceChip>
      {state.kind === 'on' && (
        <span className="tuner-listening text-caption" data-testid="listening-mark">
          <span className="tuner-listening-dot" aria-hidden="true" />
          {t('tuner.answer.listening')}
        </span>
      )}
    </div>
  );
}
