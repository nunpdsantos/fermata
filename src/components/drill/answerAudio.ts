/**
 * Answer audio for Drill mode (Task 10).
 *
 * On the feedback reveal, drill plays the *answer* so the ear connects to the
 * theory — but only for the fact types where a sound is meaningful:
 *
 *   - triad / seventh  → arpeggiate the chord tones
 *   - interval (note-above spelling) → root, then the note a given interval up
 *   - scale (spelling)  → the first five notes ascending
 *   - everything else (key signatures, circle, degree names, Roman numerals,
 *     function/cadence concepts) → nothing
 *
 * `planAnswerAudio` is pure and returns the Note[] to arpeggiate (or null);
 * `playAnswerAudio` is the fire-and-forget player that routes through the same
 * core audio path Explore uses (sampled piano with synth fallback). Audio is
 * never on the grading/advance path — failures are swallowed.
 */
import type { DrillItem } from '../../core/types/drill';
import type { Note } from '../../core/types/music';
import { stringToNote } from '../../core/types/music';
import { buildChord } from '../../core/constants/chords';
import { playArpeggioAscending, resumeAudio } from '../../core/services/audio';
import { normalizeDisplay } from './grading';

/** How many leading notes of a spelled scale to play on reveal. */
const SCALE_PREVIEW_NOTES = 5;

/**
 * Decide what (if anything) to play for an item's answer. Returns notes in the
 * order they should sound, or null for concept items that play nothing.
 */
export function planAnswerAudio(item: DrillItem): Note[] | null {
  switch (item.family) {
    case 'triad':
    case 'seventh': {
      if (item.answer.kind === 'notes') {
        // Spelling direction: the canonical ASCII chord tones.
        return item.answer.notes.map(stringToNote);
      }
      if (item.answer.kind === 'rootQuality') {
        // Naming direction: rebuild the chord from root + quality.
        const chord = buildChord(stringToNote(item.answer.root), item.answer.quality);
        return chord.notes;
      }
      return null;
    }

    case 'interval': {
      // Only the note-above SPELLING items have an audible answer (root → note).
      // Interval *naming* items (pair-to-name, semitones, letter-third) play
      // nothing — there is no single "answer pitch" to sound.
      if (!item.id.startsWith('interval:note-above:')) return null;
      if (item.answer.kind !== 'choice') return null;
      // promptParams.root is a unicode display string (e.g. "F♯") — normalizeDisplay
      // converts it to ASCII before stringToNote, which only understands ASCII.
      const rootParam = item.promptParams.root;
      if (typeof rootParam !== 'string') return null;
      const rootAscii = normalizeDisplay(rootParam);
      return [stringToNote(rootAscii), stringToNote(normalizeDisplay(item.answer.correct))];
    }

    case 'scale': {
      // Only the spell items (7 ordered spellings) preview; degree-of items
      // (single-note choice) play nothing.
      if (item.answer.kind !== 'accidentals') return null;
      return item.answer.spelled.slice(0, SCALE_PREVIEW_NOTES).map(stringToNote);
    }

    default:
      return null;
  }
}

/** Quick note duration for the reveal arpeggio (seconds). */
const REVEAL_NOTE_DURATION = 0.32;

/**
 * Fire-and-forget answer playback for the feedback reveal. No-op for concept
 * items. Routes through the core arpeggio path (sampled piano with synth
 * fallback, octave 4). Never throws into the caller — audio must never block
 * grading or auto-advance.
 */
export function playAnswerAudio(item: DrillItem): void {
  const notes = planAnswerAudio(item);
  if (!notes || notes.length === 0) return;
  try {
    resumeAudio().catch(() => {});
    playArpeggioAscending(notes, 4, REVEAL_NOTE_DURATION);
  } catch {
    // Swallow — a missing/locked AudioContext must not affect the drill.
  }
}
