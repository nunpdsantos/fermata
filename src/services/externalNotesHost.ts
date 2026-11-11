import { useEffect } from 'react';
import { subscribeExternalNotes, type ExternalNote } from './externalNotes.ts';
import { useAppStore } from '../state/store.ts';

/**
 * The ONE subscriber to notes played on a real instrument (wave 3, stream K;
 * the contract is `services/externalNotes.ts`). Mounted once, in App, above
 * the start screen and the shell alike. This part is small and in the entry;
 * what a note DOES (`externalNotesListener.ts`) is a lazy chunk, loaded when
 * the MIDI keyboard is turned on or the first note arrives (notes that arrive
 * while it loads are applied, in order, once it has).
 *
 * It also watches, from boot, the three things that end every held note —
 * the view, a check taking or leaving the instrument, the instrument itself —
 * BEFORE the instrument voice is swapped (`instrumentVoices.ts` subscribes
 * later, in main.tsx), so a note started in one voice is stopped in it.
 */
let apply: ((note: ExternalNote) => void) | null = null;
let loading: Promise<void> | null = null;
const queue: ExternalNote[] = [];
let startScreen = false;
let onPlace: ((force?: boolean) => void) | null = null;

export function loadExternalNotesListener(): Promise<void> {
  loading ??= import('./externalNotesListener.ts').then(
    (m) => {
      apply = m.applyExternalNote;
      onPlace = m.checkExternalPlace;
      for (const note of queue.splice(0)) apply(note);
    },
    (e) => {
      // A failed download: what was waiting is dropped (nothing was sounded
      // or lit) and the next note tries again.
      loading = null;
      queue.length = 0;
      console.warn('[external notes] could not load', e);
    },
  );
  return loading;
}

function receive(note: ExternalNote): void {
  if (apply) {
    apply(note);
    return;
  }
  queue.push(note);
  void loadExternalNotesListener();
}

/** Is the start screen the page (App says)? It is not Explore. */
export function isStartScreenShown(): boolean {
  return startScreen;
}

useAppStore.subscribe((s, p) => {
  if (s.instrument !== p.instrument) onPlace?.(true);
  else if (s.view !== p.view || s.exerciseInputActive !== p.exerciseInputActive) onPlace?.();
});

/** App, once: listen to every note reported, for as long as the app runs. */
export function useExternalNotes(startScreenShown: boolean): void {
  useEffect(() => subscribeExternalNotes(receive), []);
  useEffect(() => {
    startScreen = startScreenShown;
    onPlace?.();
  }, [startScreenShown]);
}
