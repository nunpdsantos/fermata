/**
 * Keyboard focus after "Follow my lessons" changes (final review of wave 2):
 * turning it on or off swaps what the intro and the settings show, and the
 * control that was pressed ("Choose topics myself", the switch on the intro)
 * is gone — focus fell to <body>. Call `markFocus()` in the handler; once the
 * value has changed, focus goes to the switch where it is drawn, else to the
 * screen's main action.
 */
import { useEffect, useRef } from 'react';

export function useFollowFocus<T extends HTMLElement>(follow: boolean | undefined) {
  const focusRef = useRef<T>(null);
  const pending = useRef(false);
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    const scope = focusRef.current;
    const target = scope?.querySelector<HTMLElement>('[data-testid="drill-follow-switch"]')
      ?? scope?.querySelector<HTMLElement>('.drill-thumb button');
    target?.focus();
  }, [follow]);
  const markFocus = () => {
    pending.current = true;
  };
  return { focusRef, markFocus };
}
