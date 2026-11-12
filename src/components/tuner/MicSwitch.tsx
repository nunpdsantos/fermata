import { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tapMic, useMic } from '../../services/microphone/micSwitch.ts';
import { microphoneSupported } from '../../services/microphone/support.ts';

/**
 * THE microphone switch (brief U) — one component, the same look and words
 * wherever it is: the top bar in Explore and during a check answered on the
 * instrument (`place="bar"`), inline in such a check (`check`) and at the
 * top of the tuner (`tuner`). A toggle (aria-pressed) named "Microphone",
 * its state in words ("Off" / "On"); on is the chip's solid "on" look AND a
 * microphone without its slash AND a dot AND the word — never colour alone,
 * and nothing pulses. Not rendered where no microphone can work.
 *
 * Eager and small: its sentences (why, the browser asking, what went wrong)
 * are a lazy chunk. In the top bar they show in a note under the bar
 * (`MicBarNote`); inline, the place shows them under the switch.
 */
const BarNote = lazy(() => import('./MicBarNote.tsx'));

export function MicSwitch({ place, note }: {
  place: 'bar' | 'check' | 'tuner';
  /** The top bar's note (in a check the inline switch carries the sentences; the note would repeat them). */
  note?: boolean;
}) {
  const { t } = useTranslation();
  const [supported] = useState(microphoneSupported);
  const state = useMic((s) => s.state);
  if (!supported) return null;
  const on = state.kind === 'on';
  // The note's chunk loads with the tap; it shows only when it has something to say.
  const noted = note && !on && state.kind !== 'off';
  return (
    <>
      <button
        type="button"
        className="chip mic-switch"
        aria-pressed={on}
        aria-label={t('micSwitchEntry.label')}
        onClick={tapMic}
        data-testid="mic-switch"
        data-place={place}
        data-state={state.kind}
      >
        {/* The microphone, slashed while off (drawn in index.css: .mic-switch-icon). */}
        <span className="mic-switch-icon" aria-hidden="true" />
        <span className="mic-switch-text">
          {t('micSwitchEntry.label')} <b>{t(on ? 'micSwitchEntry.on' : 'micSwitchEntry.off')}</b>
        </span>
        {on && <span className="mic-switch-dot" aria-hidden="true" />}
      </button>
      {noted && (
        <Suspense fallback={null}>
          <BarNote />
        </Suspense>
      )}
    </>
  );
}
