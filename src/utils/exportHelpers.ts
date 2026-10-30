import type { Scale, Chord } from '../core/types/music.ts';
import { noteToString } from '../core/types/music.ts';
import { SCALE_TYPE_NAMES } from '../core/constants/scales.ts';
import { CHORD_QUALITY_NAMES } from '../core/constants/chords.ts';
import type { DiatonicChord } from '../hooks/useKeyContext.ts';

/**
 * Generate a plain-text summary of the current scale context.
 */
export function generateScaleSummary(
  scale: Scale,
  diatonicChords: DiatonicChord[],
  selectedChord: Chord | null,
): string {
  const lines: string[] = [];

  // Scale header
  const scaleName = SCALE_TYPE_NAMES[scale.type] ?? scale.type;
  lines.push(`${noteToString(scale.root)} ${scaleName}`);
  lines.push('─'.repeat(40));

  // Notes
  lines.push(`Notes: ${scale.notes.map((n) => noteToString(n)).join('  ')}`);
  lines.push(`Count: ${scale.notes.length} notes`);
  lines.push('');

  // Diatonic chords
  if (diatonicChords.length > 0) {
    lines.push('Diatonic Chords:');
    for (const dc of diatonicChords) {
      // Display names, never internal ids (audit W1-10: was "B half_diminished7").
      const name = `${noteToString(dc.chord.root)} ${CHORD_QUALITY_NAMES[dc.chord.quality] ?? dc.chord.quality}`;
      // Defensive: a missing numeral must never break Copy (audit W0-01).
      lines.push(`  ${(dc.numeral ?? '').padEnd(6)} ${name}`);
    }
    lines.push('');
  }

  // Selected chord detail
  if (selectedChord) {
    lines.push(`Selected Chord: ${noteToString(selectedChord.root)} ${CHORD_QUALITY_NAMES[selectedChord.quality] ?? selectedChord.quality}`);
    lines.push(`  Notes: ${selectedChord.notes.map((n) => noteToString(n)).join('  ')}`);
  }

  return lines.join('\n');
}

/**
 * Copy text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
