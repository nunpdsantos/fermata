// Reverse Chord Parser - Identify chords from a set of input notes

import { Note, ChordQuality, ChordIdentification, noteToString } from '../types/music';
import { getPitchClass } from '../constants/notes';
import { CHORD_FORMULAS, buildChord } from '../constants/chords';

// Normalize input notes to pitch classes (0-11)
function notesToPitchClasses(notes: Note[]): number[] {
  return notes.map((note) => getPitchClass(note));
}

// Calculate the interval set from a root to all other notes
function getIntervalSet(pitchClasses: number[], rootPc: number): number[] {
  return pitchClasses.map((pc) => (pc - rootPc + 12) % 12).sort((a, b) => a - b);
}

// Compare interval sets (returns a similarity score 0-100)
function compareIntervalSets(
  input: number[],
  formula: number[]
): {
  score: number;
  missing: number[];
  extra: number[];
} {
  // Normalize formula to single octave
  const normalizedFormula = formula.map((i) => i % 12);
  const uniqueFormula = [...new Set(normalizedFormula)].sort((a, b) => a - b);

  const matching: number[] = [];
  const missing: number[] = [];
  const extra: number[] = [];

  // Check which formula notes are present
  for (const interval of uniqueFormula) {
    if (input.includes(interval)) {
      matching.push(interval);
    } else {
      missing.push(interval);
    }
  }

  // Check which input notes are extra
  for (const interval of input) {
    if (!uniqueFormula.includes(interval)) {
      extra.push(interval);
    }
  }

  // Calculate score
  // Base score: percentage of formula notes matched
  const matchPercentage = (matching.length / uniqueFormula.length) * 100;

  // Penalty for extra notes (less severe than missing)
  const extraPenalty = extra.length * 10;

  // Penalty for missing notes (more severe)
  const missingPenalty = missing.length * 15;

  const score = Math.max(0, matchPercentage - extraPenalty - missingPenalty);

  return { score, missing, extra };
}

// Get confidence level from score
function getConfidence(
  score: number,
  inputLength: number,
  formulaLength: number
): 'exact' | 'likely' | 'possible' {
  // Exact match: perfect score or nearly perfect with matching note count
  if (score >= 95 && inputLength >= formulaLength) {
    return 'exact';
  }
  if (score >= 70) {
    return 'likely';
  }
  return 'possible';
}

// Convert interval to a Note given a root
function intervalToNote(root: Note, interval: number): Note {
  // This is a simplified version - for display purposes
  const pc = (getPitchClass(root) + interval) % 12;
  const pitchClassToNote: Record<number, Note> = {
    0: { natural: 'C', accidental: '' },
    1: { natural: 'C', accidental: '#' },
    2: { natural: 'D', accidental: '' },
    3: { natural: 'E', accidental: 'b' },
    4: { natural: 'E', accidental: '' },
    5: { natural: 'F', accidental: '' },
    6: { natural: 'F', accidental: '#' },
    7: { natural: 'G', accidental: '' },
    8: { natural: 'G', accidental: '#' },
    9: { natural: 'A', accidental: '' },
    10: { natural: 'B', accidental: 'b' },
    11: { natural: 'B', accidental: '' },
  };
  return pitchClassToNote[pc];
}

// Generate interpretation string
function getInterpretation(
  _quality: ChordQuality,
  score: number,
  missing: number[],
  extra: number[]
): string {
  let interpretation = '';

  if (score >= 95) {
    interpretation = 'Perfect match';
  } else if (missing.length === 0 && extra.length > 0) {
    interpretation = `Match with ${extra.length} added note${extra.length > 1 ? 's' : ''}`;
  } else if (missing.length > 0 && extra.length === 0) {
    interpretation = `Missing ${missing.length} note${missing.length > 1 ? 's' : ''}`;
  } else if (missing.length > 0 && extra.length > 0) {
    interpretation = `Missing ${missing.length}, extra ${extra.length} note${extra.length > 1 ? 's' : ''}`;
  } else {
    interpretation = 'Partial match';
  }

  return interpretation;
}

// Main identification function
export function identifyChordFromNotes(inputNotes: Note[]): {
  results: ChordIdentification[];
  needsMoreNotes: boolean;
} {
  if (inputNotes.length < 2) {
    return { results: [], needsMoreNotes: true };
  }

  const inputPitchClasses = notesToPitchClasses(inputNotes);
  const uniquePitchClasses = [...new Set(inputPitchClasses)];
  const results: ChordIdentification[] = [];

  // Try each input note as potential root
  for (const rootNote of inputNotes) {
    const rootPc = getPitchClass(rootNote);
    const intervalSet = getIntervalSet(uniquePitchClasses, rootPc);

    // Compare against all chord formulas
    for (const [quality, formula] of Object.entries(CHORD_FORMULAS) as [ChordQuality, number[]][]) {
      const { score, missing, extra } = compareIntervalSets(intervalSet, formula);

      // Only include results with meaningful scores
      if (score < 30) continue;

      // Skip power chords unless we have exactly 2 notes
      if (quality === 'power' && inputNotes.length > 2) continue;

      // Build the chord
      const chord = buildChord(rootNote, quality);

      // Convert missing/extra intervals back to notes
      const missingNotes = missing.map((interval) => intervalToNote(rootNote, interval));
      const extraNotes = extra.map((interval) => intervalToNote(rootNote, interval));

      const confidence = getConfidence(score, inputNotes.length, formula.length);
      const interpretation = getInterpretation(quality, score, missing, extra);

      results.push({
        chord,
        confidence,
        score,
        interpretation,
        missingNotes: missingNotes.length > 0 ? missingNotes : undefined,
        extraNotes: extraNotes.length > 0 ? extraNotes : undefined,
      });
    }
  }

  // How many of a candidate's chord tones are spelled exactly as written. Ties
  // between equally good names (symmetric chords: E G# C is both C+ and E+)
  // go to the name that keeps the written spelling (audit W1-19).
  const written = new Set(inputNotes.map(noteToString));
  const spellingMatches = (r: ChordIdentification) =>
    r.chord.notes.reduce((n, note) => n + (written.has(noteToString(note)) ? 1 : 0), 0);

  // Sort by score (highest first), then spelling match, then by chord
  // complexity (simpler first)
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const spelled = spellingMatches(b) - spellingMatches(a);
    if (spelled !== 0) return spelled;
    // Prefer simpler chords (triads over 7ths over extended)
    const complexityA = CHORD_FORMULAS[a.chord.quality]?.length || 0;
    const complexityB = CHORD_FORMULAS[b.chord.quality]?.length || 0;
    return complexityA - complexityB;
  });

  // Deduplicate by chord name (keep highest scored version)
  const seen = new Set<string>();
  const deduped = results.filter((r) => {
    const key = `${noteToString(r.chord.root)}-${r.chord.quality}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Take top 5 results
  const topResults = deduped.slice(0, 5);

  // Determine if we need more notes
  // Need more if: no exact match, or results are too close in score
  const needsMoreNotes =
    inputNotes.length < 3 ||
    (topResults.length > 0 && topResults[0].confidence !== 'exact') ||
    (topResults.length > 1 && topResults[0].score - topResults[1].score < 20);

  return { results: topResults, needsMoreNotes };
}
