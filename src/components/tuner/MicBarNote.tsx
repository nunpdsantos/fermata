import { useEffect, useRef } from 'react';
import { MicLines } from './MicLines.tsx';
import { micOff, useMic } from '../../services/microphone/micSwitch.ts';

/**
 * The top bar's switch has no room for a sentence: what it has to say (why,
 * before the browser is asked, with "Turn on the microphone" / "Not now";
 * the browser asking; why it is off) shows in this note, an overlay just
 * under the bar at its right edge (nothing on the page moves). It stays until
 * the next tap: a tap anywhere else, or Escape, closes it (off — for the
 * sentence before asking, that is "Not now"). A lazy chunk, with its text.
 */
export default function MicBarNote() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outside = (e: Event) => {
      const target = e.target as Element | null;
      if (ref.current?.contains(target) || target?.closest?.('[data-testid="mic-switch"]')) return;
      micOff();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      micOff();
      document.querySelector<HTMLElement>('[data-testid="mic-switch"][data-place="bar"]')?.focus();
    };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('keydown', key);
    };
  }, []);
  const state = useMic((s) => s.state);
  if (state.kind === 'asking' && state.step === 'opening') return null;
  return (
    <div ref={ref} className="mic-bar-note" data-testid="mic-bar-note">
      <MicLines place="bar" />
    </div>
  );
}
