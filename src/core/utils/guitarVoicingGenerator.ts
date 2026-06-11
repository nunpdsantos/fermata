/**
 * Algorithmic Guitar Chord Voicing Generator
 *
 * Dynamically generates playable chord shapes for any chord by:
 * 1. Mapping chord tones to all possible fret positions across six strings
 * 2. Recursively building voicings from different bass strings
 * 3. Filtering through playability constraints (fret span, finger count, stretch)
 * 4. Scoring and ranking voicings by musical quality and ergonomics
 * 5. Assigning fingers with barre and mini-barre detection
 *
 * Uses the CAGED system heuristic for shape classification.
 * Falls back to this generator when pre-defined shapes are unavailable.
 */

import { Note, Chord } from '../types/music';
import { ChordShape, ChordStringPosition, FingerNumber } from '../constants/guitarChordShapes';
import { GuitarTuning, TUNING_STANDARD, getTuningPitchClasses } from '../constants/guitarTunings';

// Note to pitch class mapping. MUST include double accidentals: diminished 7th
// chords always spell a bb7, and diminished/augmented/altered-dominant chords on
// many roots carry bb or ## chord tones (e.g. Ab dim = Ab, Cb, Ebb). Without
// these keys getPitchClass falls back to the natural letter and the generator
// targets the WRONG pitch class — injecting non-chord notes into the voicing.
const NOTE_TO_PITCH_CLASS: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  'E#': 5,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
  'B#': 0,
  // Double accidentals
  Cbb: 10,
  'C##': 2,
  Dbb: 0,
  'D##': 4,
  Ebb: 2,
  'E##': 6,
  Fbb: 3,
  'F##': 7,
  Gbb: 5,
  'G##': 9,
  Abb: 7,
  'A##': 11,
  Bbb: 9,
  'B##': 1,
};

/** Convert a Note to its pitch class (0–11, where C=0). */
function getPitchClass(note: Note): number {
  const key = `${note.natural}${note.accidental}`;
  return NOTE_TO_PITCH_CLASS[key] ?? NOTE_TO_PITCH_CLASS[note.natural] ?? 0;
}

/**
 * Find all frets on a given string that produce a target pitch class.
 * Scans the fret range [minFret, maxFret] and returns every fret where
 * (openStringPitch + fret) mod 12 equals the target.
 */
function getFretsForNote(
  stringIndex: number,
  pitchClass: number,
  minFret: number,
  maxFret: number,
  openStringPitchClasses: number[]
): number[] {
  const openPitch = openStringPitchClasses[stringIndex];
  const frets: number[] = [];

  for (let fret = minFret; fret <= maxFret; fret++) {
    if ((openPitch + fret) % 12 === pitchClass) {
      frets.push(fret);
    }
  }

  return frets;
}

/** A single note placement on the fretboard: string, fret, and its chord role. */
interface FretPosition {
  string: number; // 0-5 (0 = 6th/low E)
  fret: number;
  pitchClass: number;
  noteIndex: number; // Index in the chord's note array
}

/**
 * Enumerate every possible fret position for every chord tone across all six
 * strings within [minFret, maxFret]. Returns a flat list of FretPositions
 * used as the search space for voicing generation.
 */
function getAllPositions(
  chordNotes: Note[],
  minFret: number,
  maxFret: number,
  openStringPitchClasses: number[]
): FretPosition[] {
  const positions: FretPosition[] = [];

  chordNotes.forEach((note, noteIndex) => {
    const pitchClass = getPitchClass(note);

    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const frets = getFretsForNote(
        stringIndex,
        pitchClass,
        minFret,
        maxFret,
        openStringPitchClasses
      );
      frets.forEach((fret) => {
        positions.push({ string: stringIndex, fret, pitchClass, noteIndex });
      });
    }
  });

  return positions;
}

/** A candidate voicing: one position (or mute) per string, with quality metadata. */
interface Voicing {
  positions: (FretPosition | null)[]; // Index by string (0-5), null = muted
  minFret: number;
  maxFret: number;
  fretSpan: number;
  bassStringIndex: number;
  score: number; // Quality score for ranking
}

/**
 * Test whether a voicing is physically playable on a standard guitar hand.
 *
 * Checks:
 * - At least 2 sounding notes
 * - Fret span among fretted notes ≤ 3
 * - No more than 4 unique fret positions (finger limit)
 * - Adjacent-string stretch limits (farther strings allow less fret spread)
 * - Total finger count respects barre consolidation (≤ 4 fingers)
 */
function isPlayable(voicing: Voicing): boolean {
  // Get all fretted (non-open, non-muted) positions
  const frettedPositions = voicing.positions
    .map((pos, idx) => ({ pos, idx }))
    .filter(({ pos }) => pos !== null && pos.fret > 0);

  // Must have at least 2 notes total (including open strings)
  const notesUsed = voicing.positions.filter((p) => p !== null).length;
  if (notesUsed < 2) return false;

  // If no fretted notes, it's playable (all open or muted)
  if (frettedPositions.length === 0) return true;

  // Calculate actual fret span (only among fretted notes, not open strings)
  const frettedFrets = frettedPositions.map(({ pos }) => pos!.fret);
  const minFrettedFret = Math.min(...frettedFrets);
  const maxFrettedFret = Math.max(...frettedFrets);
  const actualSpan = maxFrettedFret - minFrettedFret;

  // Max fret span of 3 frets (4 is stretchy, more is typically unplayable)
  if (actualSpan > 3) return false;

  // Check number of unique fret positions that need individual fingers
  // A barre can cover multiple strings at the same fret
  const uniqueFrets = [...new Set(frettedFrets)];

  // Count fingers needed: 1 for each unique fret (barre can cover a fret)
  // But each fret can only use 1 finger, so if we have more than 4 unique frets, it's unplayable
  if (uniqueFrets.length > 4) return false;

  // Check for impossible stretches between any fretted notes
  // Sort by string index to check adjacent fretted strings
  const sortedByString = frettedPositions.sort((a, b) => a.idx - b.idx);

  for (let i = 0; i < sortedByString.length - 1; i++) {
    const curr = sortedByString[i];
    const next = sortedByString[i + 1];
    const stringGap = next.idx - curr.idx; // How many strings apart
    const fretDiff = Math.abs(next.pos!.fret - curr.pos!.fret);

    // Adjacent strings: max 3 fret difference
    // 2 strings apart: max 2 fret difference
    // 3+ strings apart: max 1 fret difference (fingers can't stretch that far)
    const maxAllowedDiff = Math.max(1, 4 - stringGap);
    if (fretDiff > maxAllowedDiff) return false;
  }

  // Check that the lowest fretted note to highest fretted note
  // doesn't span more than what a hand can reach
  // Also verify total finger count considering barres
  let fingersNeeded = 0;
  const fretCounts: Record<number, number> = {};

  for (const { pos } of frettedPositions) {
    const fret = pos!.fret;
    fretCounts[fret] = (fretCounts[fret] || 0) + 1;
  }

  for (const fret of Object.keys(fretCounts)) {
    const count = fretCounts[Number(fret)];
    // Multiple notes on same fret = potential barre (1 finger)
    // or separate fingers if only 1-2 notes
    fingersNeeded += count > 2 ? 1 : count;
  }

  // Can't use more than 4 fingers
  if (fingersNeeded > 4) return false;

  return true;
}

/**
 * Rank a voicing by musical and ergonomic quality (higher = better).
 *
 * Rewards: compact fret span, root in bass, open strings, more chord tones,
 * consecutive used strings, lower fret positions.
 * Penalises: wide spans, many fretted notes, high fret positions.
 */
function scoreVoicing(voicing: Voicing, rootPitchClass: number, _chordNotes: Note[]): number {
  let score = 100;

  // Get fretted positions (exclude open strings)
  const frettedPositions = voicing.positions.filter((p) => p !== null && p.fret > 0);
  const frettedFrets = frettedPositions.map((p) => p!.fret);

  // Calculate actual fret span among fretted notes only
  const actualSpan =
    frettedFrets.length > 0 ? Math.max(...frettedFrets) - Math.min(...frettedFrets) : 0;

  // Heavily penalize large fret spans
  score -= actualSpan * 15;

  // Bonus for compact voicings (span of 2 or less is comfortable)
  if (actualSpan <= 2) score += 20;

  // Bonus for root in bass
  const bassPos = voicing.positions.find((p) => p !== null);
  if (bassPos && bassPos.pitchClass === rootPitchClass) {
    score += 25;
  }

  // Bonus for more notes but not too many fretted notes
  const notesUsed = voicing.positions.filter((p) => p !== null).length;
  score += notesUsed * 3;

  // Penalize too many fretted notes (hard to finger)
  if (frettedPositions.length > 4) score -= 20;
  if (frettedPositions.length > 5) score -= 30;

  // Bonus for using lower strings (fuller sound)
  if (voicing.bassStringIndex <= 1) score += 10;

  // Bonus for including more unique chord tones
  const uniquePitchClasses = new Set(
    voicing.positions.filter((p) => p !== null).map((p) => p!.pitchClass)
  );
  score += uniquePitchClasses.size * 10;

  // Penalize high fret positions (harder to reach)
  const minFrettedFret = frettedFrets.length > 0 ? Math.min(...frettedFrets) : 0;
  if (minFrettedFret > 7) score -= 10;
  if (minFrettedFret > 10) score -= 15;

  // Bonus for open strings (easier to play)
  const openStringCount = voicing.positions.filter((p) => p !== null && p.fret === 0).length;
  score += openStringCount * 8;

  // Bonus for consecutive strings being used (easier strumming)
  let consecutiveCount = 0;
  let inConsecutive = false;
  for (let i = 0; i < 6; i++) {
    if (voicing.positions[i] !== null) {
      if (inConsecutive) consecutiveCount++;
      inConsecutive = true;
    } else {
      inConsecutive = false;
    }
  }
  score += consecutiveCount * 3;

  return score;
}

/**
 * Generate all playable voicings for a chord within a fret range.
 *
 * Builds the full search space of fret positions, then delegates to
 * {@link generateVoicingsFromBass} for each candidate bass string (0–2).
 * Results are sorted by score descending.
 */
function generateVoicings(
  chordNotes: Note[],
  rootPitchClass: number,
  minFret: number,
  maxFret: number,
  requireRoot: boolean = true,
  openStringPitchClasses: number[] = getTuningPitchClasses(TUNING_STANDARD),
  // When provided, only voicings that sound EVERY pitch class in this set are
  // accepted. Used to guarantee the essential/defining tones of dense altered
  // chords survive (a "7b9" must keep its b9, a "7b13" its b13, etc.). When the
  // set is empty, the search is unconstrained (the historical behaviour).
  requiredPitchClasses: Set<number> = new Set()
): Voicing[] {
  const positions = getAllPositions(chordNotes, minFret, maxFret, openStringPitchClasses);
  const voicings: Voicing[] = [];

  // Group positions by string
  const positionsByString: FretPosition[][] = Array.from({ length: 6 }, () => []);
  positions.forEach((pos) => {
    positionsByString[pos.string].push(pos);
  });

  // Add "muted" option for each string
  const optionsByString: (FretPosition | null)[][] = positionsByString.map((stringPositions) => {
    return [null, ...stringPositions];
  });

  // Generate combinations (limit to avoid explosion)
  // We'll use a smarter approach: for each starting bass string, find valid voicings
  // Bass strings 0–3 (6th..3rd): dense altered chords often need the root on the
  // 4th string to fit all essential tones within a 3-fret span.
  for (let bassString = 0; bassString <= 3; bassString++) {
    // Try to build voicings starting from this bass string
    generateVoicingsFromBass(
      bassString,
      optionsByString,
      rootPitchClass,
      chordNotes,
      requireRoot,
      voicings,
      requiredPitchClasses
    );
  }

  // Sort by score and return top voicings
  voicings.sort((a, b) => b.score - a.score);

  return voicings;
}

/**
 * Recursively build voicings that start from a given bass string.
 *
 * Strings below the bass string are muted. For each subsequent string, every
 * candidate fret position (plus "muted") is tried. Complete voicings are
 * validated via {@link isPlayable}, scored, and appended to `results`.
 */
function generateVoicingsFromBass(
  bassString: number,
  optionsByString: (FretPosition | null)[][],
  rootPitchClass: number,
  chordNotes: Note[],
  requireRoot: boolean,
  results: Voicing[],
  requiredPitchClasses: Set<number> = new Set()
): void {
  // Recursive function to build voicings
  function recurse(
    stringIndex: number,
    currentPositions: (FretPosition | null)[],
    usedPitchClasses: Set<number>,
    minFret: number,
    maxFret: number
  ): void {
    if (stringIndex === 6) {
      // Validate and add voicing
      const nonNullPositions = currentPositions.filter((p) => p !== null);
      if (nonNullPositions.length < 3) return; // Need at least 3 notes

      // Check root requirement
      if (requireRoot) {
        const hasRoot = nonNullPositions.some((p) => p!.pitchClass === rootPitchClass);
        if (!hasRoot) return;

        // Prefer root in bass
        const bassPos = currentPositions.find((p) => p !== null);
        if (bassPos && bassPos.pitchClass !== rootPitchClass) {
          // Allow non-root bass but penalize in scoring
        }
      }

      // Essential-tone requirement: every required pitch class must sound. This
      // keeps the defining tones of dense altered chords (b9, #9, b5, #5, #11,
      // b13, b7, 3rd) in the voicing instead of being dropped for compactness.
      if (requiredPitchClasses.size > 0) {
        const sounding = new Set(nonNullPositions.map((p) => p!.pitchClass));
        for (const pc of requiredPitchClasses) {
          if (!sounding.has(pc)) return;
        }
      }

      // Calculate span only among fretted notes
      const fretSpan = minFret === Infinity || maxFret === 0 ? 0 : maxFret - minFret;
      if (fretSpan > 3) return; // Max 3 fret span for playability

      const voicing: Voicing = {
        positions: [...currentPositions],
        minFret: minFret === Infinity ? 0 : minFret,
        maxFret: maxFret === 0 ? 0 : maxFret,
        fretSpan, // This is now the actual span among fretted notes
        bassStringIndex: bassString,
        score: 0,
      };

      if (isPlayable(voicing)) {
        voicing.score = scoreVoicing(voicing, rootPitchClass, chordNotes);
        results.push(voicing);
      }
      return;
    }

    // Skip strings before bass string (mute them)
    if (stringIndex < bassString) {
      currentPositions[stringIndex] = null;
      recurse(stringIndex + 1, currentPositions, usedPitchClasses, minFret, maxFret);
      return;
    }

    // Try each option for this string
    const options = optionsByString[stringIndex];

    // Limit options to keep computation reasonable
    const limitedOptions = options.slice(0, 6);

    for (const option of limitedOptions) {
      if (option === null) {
        // Only allow muting higher strings if we already have bass notes
        const hasNotes = currentPositions.slice(bassString, stringIndex).some((p) => p !== null);
        if (!hasNotes && stringIndex > bassString) continue;

        currentPositions[stringIndex] = null;
        recurse(stringIndex + 1, currentPositions, usedPitchClasses, minFret, maxFret);
      } else {
        // Check fret span constraint (only for fretted notes, not open strings)
        const newMinFret = option.fret > 0 ? Math.min(minFret, option.fret) : minFret;
        const newMaxFret = option.fret > 0 ? Math.max(maxFret, option.fret) : maxFret;

        // Calculate span only among fretted notes
        const span = newMinFret === Infinity || newMaxFret === 0 ? 0 : newMaxFret - newMinFret;
        if (span > 3) continue; // Max 3 fret span for playability

        currentPositions[stringIndex] = option;
        const newUsed = new Set(usedPitchClasses);
        newUsed.add(option.pitchClass);

        recurse(stringIndex + 1, currentPositions, newUsed, newMinFret, newMaxFret);
      }
    }
  }

  recurse(0, Array(6).fill(null), new Set(), Infinity, 0);
}

/**
 * Convert an internal Voicing into the public ChordShape format used by the
 * fretboard renderer. Calculates base fret, assigns finger numbers (with
 * barre detection), determines CAGED shape, and sets root string metadata.
 */
function voicingToChordShape(
  voicing: Voicing,
  chord: Chord,
  shapeName: string,
  shortName: string
): ChordShape {
  const strings: [
    ChordStringPosition,
    ChordStringPosition,
    ChordStringPosition,
    ChordStringPosition,
    ChordStringPosition,
    ChordStringPosition,
  ] = [
    { fret: null, finger: 0 },
    { fret: null, finger: 0 },
    { fret: null, finger: 0 },
    { fret: null, finger: 0 },
    { fret: null, finger: 0 },
    { fret: null, finger: 0 },
  ];

  // Find the base fret (lowest non-zero fret, or 0 for open chords)
  const frettedPositions = voicing.positions.filter((p) => p !== null && p.fret > 0);
  const baseFret =
    frettedPositions.length > 0 ? Math.min(...frettedPositions.map((p) => p!.fret)) : 0;

  // Assign fingers based on fret positions
  const fingerAssignments = assignFingers(voicing, baseFret);

  voicing.positions.forEach((pos, stringIndex) => {
    if (pos === null) {
      strings[stringIndex] = { fret: null, finger: 0 };
    } else if (pos.fret === 0) {
      // A genuinely OPEN string (absolute fret 0). The renderer resolves a
      // string's absolute fret as `baseFret + storedFret`, so when baseFret > 0
      // we must store a NEGATIVE offset (0 - baseFret) for the open string to
      // resolve back to fret 0. Storing a literal 0 here (the old behaviour)
      // made the renderer sound the open string at the barre fret instead —
      // injecting a non-chord tone on every voicing that mixed an open string
      // with fretted notes above the nut. When baseFret === 0 this is 0 (a true
      // open in an open-position shape), unchanged.
      strings[stringIndex] = { fret: -baseFret, finger: 0 };
    } else {
      const relativeFret = pos.fret - baseFret;
      strings[stringIndex] = {
        fret: relativeFret,
        finger: (fingerAssignments[stringIndex] || 1) as FingerNumber,
      };
    }
  });

  // Determine root string
  const rootPitchClass = getPitchClass(chord.root);
  let rootString: 1 | 2 | 3 | 4 | 5 | 6 = 6;
  for (let i = 0; i < 6; i++) {
    const pos = voicing.positions[i];
    if (pos && pos.pitchClass === rootPitchClass) {
      rootString = (6 - i) as 1 | 2 | 3 | 4 | 5 | 6;
      break;
    }
  }

  // Determine CAGED shape based on bass string and position
  const cagedShape = determineCagedShape(voicing, baseFret);

  const isBarreChord = baseFret > 0 && voicing.fretSpan >= 2;

  const shape: ChordShape = {
    name: shapeName,
    shortName: shortName,
    type: isBarreChord ? 'barre' : 'open',
    cagedShape,
    rootString,
    rootFretOffset: 0,
    strings,
  };

  if (isBarreChord) {
    // Find if there's a barre (same fret across multiple strings)
    const fretCounts: Record<number, number[]> = {};
    voicing.positions.forEach((pos, idx) => {
      if (pos && pos.fret > 0) {
        const relFret = pos.fret - baseFret;
        if (!fretCounts[relFret]) fretCounts[relFret] = [];
        fretCounts[relFret].push(idx);
      }
    });

    // Check for barre on fret 0 (relative)
    if (fretCounts[0] && fretCounts[0].length >= 2) {
      const barreStrings = fretCounts[0].sort((a, b) => a - b);
      shape.barreInfo = {
        fret: 0,
        fromString: 6 - barreStrings[0],
        toString: 6 - barreStrings[barreStrings.length - 1],
      };

      // Update finger to 'bar' for barre notes
      barreStrings.forEach((idx) => {
        if (strings[idx].fret === 0) {
          strings[idx].finger = 'bar';
        }
      });
    }
  }

  return shape;
}

/**
 * Assign finger numbers (1–4) to fretted positions.
 *
 * Groups positions by relative fret. If the lowest relative fret has ≥ 2
 * notes, it is treated as a barre (finger 1) and remaining fingers start
 * from 2. Adjacent strings on the same higher fret may share a finger
 * (mini-barre). Returns a map of string index → finger number.
 */
function assignFingers(voicing: Voicing, baseFret: number): Record<number, number> {
  const assignments: Record<number, number> = {};

  // Group positions by relative fret
  const byFret: Record<number, number[]> = {};
  voicing.positions.forEach((pos, stringIndex) => {
    if (pos && pos.fret > 0) {
      const relFret = pos.fret - baseFret;
      if (!byFret[relFret]) byFret[relFret] = [];
      byFret[relFret].push(stringIndex);
    }
  });

  const frets = Object.keys(byFret)
    .map(Number)
    .sort((a, b) => a - b);

  // Check if this is a barre chord (multiple notes on lowest fret)
  const lowestFret = frets[0];
  const isBarreChord = lowestFret === 0 && byFret[0] && byFret[0].length >= 2;

  // For barre chords, index finger (1) is used for the barre
  // Other fingers start from 2
  let nextFinger = isBarreChord ? 2 : 1;

  frets.forEach((fret) => {
    const strings = byFret[fret];

    if (fret === 0 && isBarreChord) {
      // Barre position - all notes on lowest fret use index finger
      strings.forEach((s) => (assignments[s] = 1));
      // nextFinger already set to 2
    } else {
      // Assign fingers based on fret position relative to lowest fret
      // Notes on the same fret can sometimes share a finger (mini-barre)
      // but typically each gets its own finger

      // Sort strings from low to high (6th to 1st) for consistent assignment
      const sortedStrings = [...strings].sort((a, b) => a - b);

      // Check if multiple notes on same fret could be a mini-barre
      if (sortedStrings.length >= 2) {
        // Check if strings are adjacent - could be played with one finger
        const isAdjacent = sortedStrings.every((s, i) => i === 0 || s === sortedStrings[i - 1] + 1);

        if (isAdjacent && sortedStrings.length <= 3) {
          // Mini-barre with one finger
          sortedStrings.forEach((s) => (assignments[s] = Math.min(nextFinger, 4)));
          nextFinger++;
        } else {
          // Each string gets its own finger
          sortedStrings.forEach((s) => {
            assignments[s] = Math.min(nextFinger, 4);
            nextFinger++;
          });
        }
      } else {
        // Single note on this fret
        sortedStrings.forEach((s) => {
          assignments[s] = Math.min(nextFinger, 4);
          nextFinger++;
        });
      }
    }
  });

  return assignments;
}

/**
 * Map a voicing to its CAGED shape letter based on bass string position.
 * 6th string → E, 5th → A, 4th → D, 3rd → G, default → C.
 */
function determineCagedShape(voicing: Voicing, _baseFret: number): 'C' | 'A' | 'G' | 'E' | 'D' {
  const bassString = voicing.bassStringIndex;

  // Simple heuristic based on bass string
  if (bassString === 0) return 'E'; // Root on 6th string
  if (bassString === 1) return 'A'; // Root on 5th string
  if (bassString === 2) return 'D'; // Root on 4th string
  if (bassString === 3) return 'G'; // Root on 3rd string
  return 'C'; // Default
}

/**
 * Generate up to 8 playable chord shapes for any chord.
 *
 * Searches seven fret ranges (open through position 9), generates candidate
 * voicings in each, deduplicates, and returns the best shapes sorted with
 * open positions first. Each result includes the ChordShape (for rendering)
 * and the base fret offset.
 *
 * @param chord  The chord whose notes will be mapped to the fretboard.
 * @param tuning Guitar tuning (defaults to standard EADGBE).
 * @param requiredPitchClasses When non-empty, ONLY voicings that sound every
 *   pitch class in this set are produced. Callers pass the chord's essential /
 *   defining tones so dense altered chords (7b9, 7b13, 9#11, …) keep their
 *   identity tone instead of dropping it for a compacter grip. When empty (the
 *   default) the search is unconstrained.
 * @returns Array of `{ shape, baseFret }` objects, at most 8 entries.
 */
export function generateChordShapes(
  chord: Chord,
  tuning: GuitarTuning = TUNING_STANDARD,
  requiredPitchClasses: Set<number> = new Set()
): { shape: ChordShape; baseFret: number }[] {
  const rootPitchClass = getPitchClass(chord.root);
  const openStringPitchClasses = getTuningPitchClasses(tuning);
  const results: { shape: ChordShape; baseFret: number }[] = [];

  // Get unique pitch classes from chord notes
  const chordNotes = chord.notes;
  if (chordNotes.length === 0) return [];

  // Generate voicings in different fret ranges
  const ranges = [
    { min: 0, max: 4, name: 'Open' },
    { min: 0, max: 5, name: 'Low' },
    { min: 2, max: 6, name: 'Position 2' },
    { min: 3, max: 7, name: 'Position 3' },
    { min: 5, max: 9, name: 'Position 5' },
    { min: 7, max: 11, name: 'Position 7' },
    { min: 9, max: 13, name: 'Position 9' },
  ];

  const seenShapes = new Set<string>();

  for (const range of ranges) {
    const voicings = generateVoicings(
      chordNotes,
      rootPitchClass,
      range.min,
      range.max,
      true,
      openStringPitchClasses,
      requiredPitchClasses
    );

    // Take top voicings from each range. Take more when essentials are required
    // (the essential-complete voicing is sometimes ranked below compacter but
    // incomplete grips that the requirement has already filtered out anyway).
    const topVoicings = voicings.slice(0, requiredPitchClasses.size > 0 ? 5 : 3);

    topVoicings.forEach((voicing) => {
      // Create a unique key for this shape to avoid duplicates
      const shapeKey = voicing.positions.map((p) => (p === null ? 'x' : p.fret)).join('-');

      if (seenShapes.has(shapeKey)) return;
      seenShapes.add(shapeKey);

      const frettedPositions = voicing.positions.filter((p) => p !== null && p.fret > 0);
      const baseFret =
        frettedPositions.length > 0 ? Math.min(...frettedPositions.map((p) => p!.fret)) : 0;

      const shapeName =
        baseFret === 0
          ? `${chord.root.natural}${chord.root.accidental} Open`
          : `Position ${baseFret}`;
      const shortName = baseFret === 0 ? 'Open' : `Pos ${baseFret}`;

      const shape = voicingToChordShape(voicing, chord, shapeName, shortName);

      results.push({ shape, baseFret });
    });
  }

  // Sort results: open positions first, then by base fret
  results.sort((a, b) => {
    if (a.baseFret === 0 && b.baseFret !== 0) return -1;
    if (b.baseFret === 0 && a.baseFret !== 0) return 1;
    return a.baseFret - b.baseFret;
  });

  // Return unique, diverse voicings (limit to prevent UI overload)
  return results.slice(0, 8);
}

/**
 * Check whether a chord quality has hand-crafted shapes in the static library.
 * When true, the caller should prefer the pre-defined shapes over algorithmic
 * generation for better musical accuracy.
 */
export function hasPreDefinedShapes(quality: string): boolean {
  const predefinedQualities = [
    'major',
    'minor',
    'dominant7',
    'minor7',
    'major7',
    'sus4',
    'sus2',
    'diminished',
    'augmented',
    'halfDiminished',
    'half_diminished7',
    'diminished7',
    'sixth',
    'major6',
    'minor6',
    'add9',
    'dominant9',
    'power',
    'augmented7',
    'minor_major7',
    'dominant7sus4',
    'major9',
    'minor9',
    'dominant7flat9',
    'dominant7sharp9',
    'dominant7flat5',
    'dominant7sharp5',
    'dominant7alt',
    'dominant11',
    'major11',
    'minor11',
    'dominant9sharp11',
    'dominant13',
    'major13',
    'minor13',
    'dominant13flat9',
    'add11',
    'six_nine',
    'minor_six_nine',
    'dominant9sus4',
    'sus2sus4',
    'augmented_major7',
    'major7flat5',
    'diminished_major7',
  ];

  return predefinedQualities.includes(quality);
}
