/**
 * The microphone (wave 3, brief T): opened only on the learner's action,
 * one session at a time, and closed — every track stopped, the audio
 * context closed — when its owner stops it (the tuner or "Use my
 * instrument" closes), when the page is hidden, when the app changes view,
 * or when the device goes away. Nothing heard is stored or sent anywhere:
 * each frame is measured and dropped.
 *
 * Echo cancellation, noise suppression and automatic gain are asked OFF
 * (they are made for speech and bend a held note's pitch and level). They
 * are preferences, not requirements (MDN, MediaTrackConstraints): a browser
 * that cannot turn one off still opens the microphone.
 */
import { useAppStore } from '../../state/store.ts';
import { detectPitch, type PitchEstimate } from './pitch.ts';
import { makeAudioContext, microphoneSupported } from './support.ts';

/** Why the microphone could not open. */
export type MicProblem = 'unsupported' | 'refused' | 'missing' | 'busy' | 'failed';
/** Why a session ended. */
export type MicStopReason = 'closed' | 'hidden' | 'view' | 'replaced' | 'ended';

export class MicError extends Error {
  readonly problem: MicProblem | 'stopped';
  constructor(problem: MicProblem | 'stopped') {
    super(`microphone: ${problem}`);
    this.problem = problem;
  }
}

export interface ListenOptions {
  /** Every analysis frame (about 30 a second): the pitch, or null. */
  onFrame: (estimate: PitchEstimate | null, time: number) => void;
  /** The session ended for a reason other than its own stop(). */
  onStop?: (reason: MicStopReason) => void;
}

export interface MicSession {
  stop(): void;
  readonly sampleRate: number;
}

/** The constraints asked of getUserMedia. */
export const MIC_CONSTRAINTS: MediaStreamConstraints = {
  audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  video: false,
};

const FRAME_SIZE = 4096;
const FRAME_MS = 30;
const RESUME_WAIT_MS = 500;

interface Live {
  token: object;
  ctx: AudioContext;
  stream: MediaStream | null;
  timer: ReturnType<typeof setInterval> | null;
  options: ListenOptions;
  detach: () => void;
}

let live: Live | null = null;
const watchers = new Set<(on: boolean) => void>();

/** Is a session listening now? */
export function isListening(): boolean {
  return live !== null && live.stream !== null;
}

/** Hear when listening starts and stops (the "listening" mark). */
export function subscribeListening(fn: (on: boolean) => void): () => void {
  watchers.add(fn);
  return () => {
    watchers.delete(fn);
  };
}

function announce() {
  const on = isListening();
  for (const fn of [...watchers]) fn(on);
}

function problemOf(error: unknown): MicProblem {
  const name = (error as { name?: string } | null)?.name;
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') return 'refused';
  if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'DevicesNotFoundError') return 'missing';
  if (name === 'NotReadableError' || name === 'AbortError' || name === 'TrackStartError') return 'busy';
  if (name === 'TypeError' || name === 'NotSupportedError') return 'unsupported';
  return 'failed';
}

function release(session: Live) {
  if (session.timer !== null) clearInterval(session.timer);
  session.timer = null;
  session.detach();
  session.stream?.getTracks().forEach((track) => track.stop());
  void session.ctx.close().catch(() => undefined);
}

/** Stop whatever is listening. `reason` reaches its onStop (not for 'closed'). */
export function stopListening(reason: MicStopReason = 'closed'): void {
  const session = live;
  if (!session) return;
  live = null;
  release(session);
  announce();
  if (reason !== 'closed') session.options.onStop?.(reason);
}

/**
 * Open the microphone and start measuring. Call it INSIDE the learner's tap:
 * the audio context is made before anything is awaited (iOS lets a page
 * start audio only there). Rejects with a MicError; 'stopped' means it was
 * stopped (closed, page hidden, view changed) while the browser was asking.
 * A caller that had to wait for this module passes the context it made in
 * the tap (`makeAudioContext`, support.ts); it is closed with the session.
 */
export async function startListening(options: ListenOptions, context?: AudioContext): Promise<MicSession> {
  if (!microphoneSupported()) {
    void context?.close().catch(() => undefined);
    throw new MicError('unsupported');
  }
  stopListening('replaced');
  const ctx = context ?? makeAudioContext();
  const token = {};
  const session: Live = { token, ctx, stream: null, timer: null, options, detach: () => undefined };
  live = session;

  // Closed by the page, not by its owner: the page hidden, the view changed.
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') stopListening('hidden');
  };
  const onPageHide = () => stopListening('hidden');
  const view = useAppStore.getState().view;
  const unsubscribeView = useAppStore.subscribe((s) => {
    if (s.view !== view) stopListening('view');
  });
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', onPageHide);
  session.detach = () => {
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', onPageHide);
    unsubscribeView();
  };

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
  } catch (error) {
    if (live === session) {
      live = null;
      release(session);
    }
    throw new MicError(problemOf(error));
  }
  if (live !== session) {
    // Stopped while the browser was asking: nothing may keep running.
    stream.getTracks().forEach((track) => track.stop());
    throw new MicError('stopped');
  }
  session.stream = stream;

  // Outside a tap some engines keep a new context suspended (and may never
  // settle resume()): wait a moment, then give up rather than listen to
  // silence while saying "listening".
  if (ctx.state === 'suspended') {
    await Promise.race([ctx.resume().catch(() => undefined), new Promise((r) => setTimeout(r, RESUME_WAIT_MS))]);
  }
  if (live !== session) {
    stream.getTracks().forEach((track) => track.stop());
    throw new MicError('stopped');
  }
  if ((ctx.state as string) !== 'running') {
    stopListening('closed');
    throw new MicError('failed');
  }

  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = FRAME_SIZE;
  analyser.smoothingTimeConstant = 0;
  // Pulled through a silent gain into the destination: some engines only
  // process nodes that reach it. Gain 0 — the microphone is never played.
  const mute = ctx.createGain();
  mute.gain.value = 0;
  source.connect(analyser);
  analyser.connect(mute);
  mute.connect(ctx.destination);
  for (const track of stream.getAudioTracks()) {
    track.addEventListener('ended', () => {
      if (live === session) stopListening('ended');
    });
  }

  const frame = new Float32Array(FRAME_SIZE);
  session.timer = setInterval(() => {
    if (live !== session) return;
    analyser.getFloatTimeDomainData(frame);
    session.options.onFrame(detectPitch(frame, ctx.sampleRate), performance.now());
  }, FRAME_MS);
  announce();

  return {
    sampleRate: ctx.sampleRate,
    stop: () => {
      if (live === session) stopListening('closed');
    },
  };
}
