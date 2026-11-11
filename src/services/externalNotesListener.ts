/**
 * What a note played on a real instrument DOES (wave 3, stream K) — the one
 * listener the contract `services/externalNotes.ts` names. A lazy chunk;
 * `externalNotesHost.ts` (eager) subscribes and hands every note here.
 *
 * Three places:
 *   explore    Explore, nothing open over it: the note lights on the
 *              on-screen instrument (`activeNotes`, as a key or fret played
 *              there) for as long as it is held, and becomes the linked focus
 *              note (the last note played, named in the dock bar's read-out).
 *   answer     A check answered on the instrument (`exerciseInputActive`,
 *              with the answer taking notes — `externalAnswer.ts`): a note
 *              that starts ADDS its note to the answer; nothing is removed,
 *              nothing is submitted.
 *   elsewhere  Drill, a multiple-choice check, the start screen, a sheet or
 *              dialog open over the app (not the landscape full neck, nor
 *              the tuner, whose "Show what I play" lights Explore's
 *              instrument): nothing but the sound.
 * Everywhere, a `midi` note SOUNDS in the selected instrument's voice for as
 * long as it is held (a keyboard may be silent); a `mic` note is never sounded
 * (it is already sounding in the room).
 *
 * Every held note is released — sound and light — when the view changes (any
 * view change, also Learn to Drill), the place changes (a check opening or
 * closing, a sheet opening), the instrument changes, or the page is hidden.
 * Its later "off" then does nothing.
 */
import type { ExternalNote } from './externalNotes.ts';
import { externalAnswerTarget, watchExternalAnswer } from './externalAnswer.ts';
import { isStartScreenShown } from './externalNotesHost.ts';
import { useAppStore } from '../state/store.ts';
import { useFocusNoteStore } from '../state/focusNoteStore.ts';
import {
  startSustainedNote,
  stopSustainedNote,
  resumeAudio,
  setMasterVolume,
  getAudioState,
} from '../core/services/audio.ts';
import { getSynthConfig } from './synthConfig.ts';
import { midiToNote } from '../core/utils/pianoLayout.ts';
import { toast } from '../state/toastStore.ts';
import i18n from '../i18n/index.ts';
import '../i18n/midiInput/index.ts';

export type ExternalPlace = 'explore' | 'answer' | 'elsewhere';

interface Held {
  midi: number;
  sounded: boolean;
  lit: boolean;
}

const held = new Map<string, Held>();
/** Notes lit by this listener, counted (a key and the microphone may both hold one). */
const litCount = new Map<number, number>();
let heldPlace: ExternalPlace | null = null;
let observer: MutationObserver | null = null;
let soundNoticeShown = false;

/** The core synth's own default note volume (DEFAULT_SYNTH_CONFIG). */
const DEFAULT_VOLUME = 0.5;

/**
 * Key velocity (0–1) to the note's volume: about a tap's at a medium key
 * press (velocity ≈ 100 of 127), quieter below, a little louder above. A note
 * without a velocity sounds as a tap does.
 */
export function velocityGain(velocity: number | undefined): number {
  if (velocity === undefined || !Number.isFinite(velocity)) return 1;
  const v = Math.min(1, Math.max(0, velocity));
  return 0.3 + 0.9 * v;
}

function modalOpen(): boolean {
  if (typeof document === 'undefined') return false;
  // The landscape full-neck view is a dialog, but it IS Explore's instrument.
  // The tuner is a sheet whose "Show what I play on the instrument" exists to
  // light Explore's instrument behind it (wave 3 integration): not "over" —
  // in Explore. Anywhere else (over a check, in Drill) it is a sheet like any
  // other, so a key played then adds nothing to an answer hidden behind it
  // (wave 3 final review).
  const tuner = useAppStore.getState().view === 'explore' ? ':not([data-testid="tuner-sheet"])' : '';
  return document.querySelector(`[aria-modal="true"]:not([data-testid="neck-view"])${tuner}`) !== null;
}

/** Where a note played now lands. */
export function externalPlace(): ExternalPlace {
  if (isStartScreenShown() || modalOpen()) return 'elsewhere';
  const s = useAppStore.getState();
  if (s.exerciseInputActive) return externalAnswerTarget() ? 'answer' : 'elsewhere';
  return s.view === 'explore' ? 'explore' : 'elsewhere';
}

function soundOn(midi: number, velocity: number | undefined): void {
  const s = useAppStore.getState();
  const config = getSynthConfig(s.synthPreset);
  const base = typeof config.volume === 'number' ? config.volume : DEFAULT_VOLUME;
  setMasterVolume(s.volume);
  // The tap's immediate path (core startSustainedNote: the voice starts the
  // note at once), not the scheduled one. The audio is woken in the same
  // turn but not waited for: a running context sounds the note now.
  void resumeAudio().catch(() => {});
  // midiToNote names only notes from 12 (C0) up; MIDI starts at 0, so ask it
  // an octave higher and take the octave back (0–11 are C−1…B−1).
  const { octave, ...note } = midiToNote(midi + 12);
  startSustainedNote(note, octave - 1, { ...config, volume: Math.min(1, base * velocityGain(velocity)) });
  if (!soundNoticeShown) {
    // A browser starts sound only after a click or tap on the page; a key on
    // a MIDI keyboard does not count. Say so once if the sound is held back.
    setTimeout(() => {
      if (soundNoticeShown || getAudioState() !== 'suspended') return;
      soundNoticeShown = true;
      toast(i18n.t('midiInput.soundBlocked'), 'info', 6000);
    }, 400);
  }
}

function light(midi: number): void {
  const n = litCount.get(midi) ?? 0;
  litCount.set(midi, n + 1);
  if (n === 0) useAppStore.getState().addActiveNote(midi);
}

function unlight(midi: number): void {
  const n = litCount.get(midi) ?? 0;
  if (n <= 1) {
    litCount.delete(midi);
    useAppStore.getState().removeActiveNote(midi);
  } else {
    litCount.set(midi, n - 1);
  }
}

function release(key: string): void {
  const h = held.get(key);
  if (!h) return;
  held.delete(key);
  if (h.sounded) stopSustainedNote(h.midi);
  if (h.lit) unlight(h.midi);
  if (held.size === 0) stopWatching();
}

/** Release every held note: no sound, no light. Their later "off" does nothing. */
export function releaseAllExternalNotes(): void {
  for (const key of [...held.keys()]) release(key);
  heldPlace = null;
}

/** Something that may move the place happened: release all if it did (or if `force`). */
export function checkExternalPlace(force = false): void {
  if (held.size === 0) return;
  if (force || externalPlace() !== heldPlace) releaseAllExternalNotes();
}

function startWatching(): void {
  if (observer || typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
  // Sheets and dialogs are portalled onto <body>: one opening ends the held notes.
  observer = new MutationObserver(() => checkExternalPlace());
  observer.observe(document.body, { childList: true });
}

function stopWatching(): void {
  observer?.disconnect();
  observer = null;
}

function pageHidden(): boolean {
  return typeof document !== 'undefined' && document.visibilityState === 'hidden';
}

/** Apply one note heard on a real instrument. */
export function applyExternalNote(note: ExternalNote): void {
  const key = `${note.source}:${note.midi}`;
  if (!note.on) {
    release(key);
    return;
  }
  if (!Number.isInteger(note.midi) || note.midi < 0 || note.midi > 127 || pageHidden()) return;
  const place = externalPlace();
  if (held.size > 0 && place !== heldPlace) releaseAllExternalNotes();
  // The same note again while held (a key struck again under the pedal): it starts again.
  release(key);
  heldPlace = place;
  const h: Held = { midi: note.midi, sounded: false, lit: false };
  if (note.source === 'midi') {
    soundOn(note.midi, note.velocity);
    h.sounded = true;
  }
  if (place === 'explore') {
    light(note.midi);
    h.lit = true;
    const guitar = useAppStore.getState().instrument === 'guitar';
    useFocusNoteStore.getState().set('pinned', { pc: note.midi % 12, midi: note.midi, source: guitar ? 'fret' : 'piano' });
  } else if (place === 'answer') {
    externalAnswerTarget()?.(note.midi);
  }
  held.set(key, h);
  startWatching();
}

/** For tests: the notes held now, as "source:midi". */
export function heldExternalNotes(): string[] {
  return [...held.keys()];
}

watchExternalAnswer(() => checkExternalPlace());
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (pageHidden()) releaseAllExternalNotes();
  });
  window.addEventListener('pagehide', () => releaseAllExternalNotes());
}
