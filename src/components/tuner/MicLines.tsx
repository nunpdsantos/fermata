import { useTranslation } from 'react-i18next';
import '../../i18n/tuner/mic.ts';
import { Button } from '../ui/Button.tsx';
import { micOff, useMic } from '../../services/microphone/micSwitch.ts';
import { confirmMic, micProblemText } from './micAsk.ts';

/**
 * The microphone switch's sentences (brief U; lazy, with their text): what
 * shows under the switch in a check and in the top bar's note. The tuner
 * says its own (TunerSheet), with the same two buttons.
 */

/** "Turn on the microphone" (opens it, inside this second tap) / "Not now". */
export function MicAsk() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={confirmMic} data-testid="mic-allow">{t('tuner.mic.allow')}</Button>
      <Button variant="quiet" onClick={micOff}>{t('tuner.mic.notNow')}</Button>
    </div>
  );
}

export function MicLines({ place, here = false, active = true, nameOf }: {
  place: 'bar' | 'check';
  /** Say what it does here (a question answered on the instrument). */
  here?: boolean;
  /** The question still takes answers. */
  active?: boolean;
  /** A heard note's name, spelled as the check spells its notes. */
  nameOf?: (midi: number) => string;
}) {
  const { t } = useTranslation();
  const state = useMic((s) => s.state);
  const p = 'text-ui';
  const ink = { color: 'var(--text)' };
  return (
    <div aria-live="polite" className="flex flex-col gap-2" data-testid="mic-lines">
      {here && <p className={p} style={{ color: 'var(--text-dim)' }}>{t('tuner.mic.here')}</p>}
      {state.kind === 'asking' && state.step === 'explain' && (
        <>
          <p className={p} style={ink}>{t('tuner.mic.why')}</p>
          <MicAsk />
        </>
      )}
      {state.kind === 'asking' && state.step === 'browser' && <p className={p} style={ink}>{t('tuner.mic.asking')}</p>}
      {state.kind === 'on' && active && nameOf && (
        <p className={p} style={ink} data-testid="mic-heard">
          {state.heard === null ? t('tuner.mic.on') : t('tuner.mic.heard', { note: nameOf(state.heard) })}
        </p>
      )}
      {state.kind === 'problem' && (
        <p className={p} style={ink} data-testid="mic-problem">{micProblemText(t, state.problem, place === 'check')}</p>
      )}
    </div>
  );
}
