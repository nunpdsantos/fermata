/**
 * Where a played note can be used, for the microphone switch (brief U; lazy:
 * loaded with the tuner and with Learn's checks, never in the entry). Only
 * Explore (not while the tour plays) and a check with a question answered on
 * the instrument can use one; a sheet that carries the switch (the tuner)
 * turns the microphone off when it closes over anything else, and a check
 * ending turns it off.
 */
import { getDemoRequest } from '../../state/demoRequest.ts';
import { useAppStore } from '../../state/store.ts';
import { micOff, useMic } from './micSwitch.ts';

/** Can anything on screen, under a sheet, use a played note? */
export function micUsable(): boolean {
  return (useAppStore.getState().view === 'explore' && getDemoRequest() === null) || useMic.getState().check;
}

/** A sheet that carried the switch (the tuner) closed: off unless what is behind it can use it. */
export function micSheetClosed(): void {
  if (!micUsable()) micOff();
}

/**
 * A check with a question answered on the instrument opened (ExerciseRunner):
 * the switch is offered for it (inline, and in the top bar). The returned
 * function closes it, and the microphone with it ("a check ends or is left").
 */
export function openMicCheck(): () => void {
  useMic.setState({ check: true });
  return () => {
    useMic.setState({ check: false });
    micOff();
  };
}
