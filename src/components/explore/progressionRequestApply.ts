import type { ProgressionRequest } from '../../state/progressionRequest';
import { openProgressionPanel, setProgressionOffer } from '../../state/progressionPanel';
import { EMPTY_PROGRESSION, MAX_PROGRESSION_CHORDS, MAX_SAVED_SYMBOL_LENGTH, isTempo } from '../../state/progressionSave';
import { useAppStore } from '../../state/store';

/**
 * Apply a request (state/progressionRequest.ts): open the panel; with chords,
 * load them when the learner has none (or the same ones), else OFFER them —
 * the panel asks "Use these" / "Keep mine", so nothing saved is lost
 * silently. The chords go through the app's own chord parser (a symbol it
 * does not read is left out). Resolves once applied.
 */
export async function applyProgressionRequest(request: ProgressionRequest): Promise<void> {
  openProgressionPanel();
  const raw = Array.isArray(request.chords)
    ? request.chords.filter((s): s is string => typeof s === 'string' && s.length > 0 && s.length <= MAX_SAVED_SYMBOL_LENGTH).slice(0, MAX_PROGRESSION_CHORDS)
    : [];
  if (raw.length === 0) return;
  // The parser lives with the panel (a lazy chunk), not in Explore's own.
  const { readChords, presetSymbols } = await import('./progression/progressionModel');
  const symbols = presetSymbols(readChords(raw));
  if (symbols.length === 0) return;
  const bpm = isTempo(request.bpm) ? request.bpm : undefined;
  const s = useAppStore.getState();
  const mine = s.progression?.chords ?? [];
  const same = mine.length === symbols.length && mine.every((m, i) => m === symbols[i]);
  if (mine.length === 0 || same) {
    s.setProgression({ ...(s.progression ?? EMPTY_PROGRESSION), chords: symbols, ...(bpm !== undefined ? { bpm } : {}) });
    setProgressionOffer(null);
  } else {
    setProgressionOffer({ chords: symbols, ...(bpm !== undefined ? { bpm } : {}) });
  }
}

