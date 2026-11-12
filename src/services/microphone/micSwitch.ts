/**
 * THE microphone switch (wave 3 follow-up, brief U: "an easy and clear way to
 * switch the microphone on and off … and always be off, until someone needs
 * it for playing"). ONE app-wide state, eager and tiny; the session behind it
 * (`micSession.ts`, the detector, the note reporter) loads inside the tap,
 * and the rules for the places that can use it are `micPlaces.ts` (lazy).
 *
 *   off      nothing open (every start: the state is never saved anywhere)
 *   asking   'opening' (the tap: is it already allowed?), 'explain' (it is
 *            not: one sentence, "Turn on the microphone" / "Not now"),
 *            'browser' (the browser is asking the learner)
 *   on       listening; `heard` = the last note reported
 *   problem  off, with a true sentence shown at the switch until the next
 *            tap: refused, missing, busy, failed, unsupported, the page
 *            hidden, the device gone, or three minutes with no note ('idle')
 *
 * Only a tap on the switch turns it on; nothing is asked of the browser
 * before that tap. It turns itself off when nothing on screen can use a
 * played note: the view changes, a check ends or is left, the tuner closes
 * over a view that cannot use it, the tour starts, the page is hidden, three
 * minutes pass with no note. Every way off leaves no track running and the
 * audio context closed (`micSession.ts` / `microphone.ts`).
 */
import { create } from 'zustand';
import { makeAudioContext } from './support.ts';
import { useAppStore } from '../../state/store.ts';
import type { MicProblem } from './microphone.ts';

export type MicIssue = MicProblem | 'hidden' | 'ended' | 'idle';
export type MicState =
  | { kind: 'off' }
  | { kind: 'asking'; step: 'opening' | 'explain' | 'browser' }
  | { kind: 'on'; heard: number | null }
  | { kind: 'problem'; problem: MicIssue };

/** `check`: a check with a question answered on the instrument is open (it can use a played note). */
export const useMic = create<{ state: MicState; check: boolean }>(() => ({ state: { kind: 'off' }, check: false }));

export const setMic = (state: MicState) => useMic.setState({ state });
/** One number per attempt (`n`): whatever answers for an older one is closed and dropped. */
export const micAttempt = { n: 0 };
let session: typeof import('./micSession.ts') | null = null;
export const close = (ctx?: AudioContext) => void ctx?.close().catch(() => undefined);
/** A new audio context, made where it is called (inside a tap). */
export const tapContext = () => {
  try {
    return makeAudioContext();
  } catch {
    return undefined;
  }
};

/**
 * Load the session (inside the tap) and open the microphone with `ctx` for
 * attempt `token`. `ask`: first ask the browser whether the microphone is
 * already allowed (no prompt) — allowed, it opens; otherwise one sentence
 * says why first ('explain'), and "Turn on the microphone" opens it from
 * that second tap (`confirmMic`, MicLines.tsx, with `ask` false).
 */
export function openMicWith(ctx: AudioContext | undefined, token: number, ask: boolean): void {
  setMic({ kind: 'asking', step: ask ? 'opening' : 'browser' });
  import('./micSession.ts').then((m) => {
    session = m;
    if (token === micAttempt.n) m.openMic(ctx, token, ask);
    else close(ctx);
  }, () => {
    close(ctx);
    if (token === micAttempt.n) setMic({ kind: 'problem', problem: 'failed' });
  });
}

/**
 * The switch's tap. On: off. Off: the audio context is made HERE, before
 * anything is awaited (iOS Safari starts audio only inside a tap); then
 * the session asks the browser whether the microphone is already allowed.
 */
export function tapMic(): void {
  const { kind } = useMic.getState().state;
  if (kind === 'on' || kind === 'asking') return micOff();
  openMicWith(tapContext(), ++micAttempt.n, true);
}

/** Off, at once and silently: "Not now", the switch tapped while on, or nothing left that can use it. */
export function micOff(): void {
  micAttempt.n++;
  session?.closeMic();
  if (useMic.getState().state.kind !== 'off') setMic({ kind: 'off' });
}

// The view changes (Explore, Learn, Drill): off, and any sentence goes with the view.
useAppStore.subscribe((s, p) => {
  if (s.view !== p.view) micOff();
});
