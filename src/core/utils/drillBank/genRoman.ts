/**
 * F9 — Roman numeral drill items.
 *
 * Sub-groups:
 *   - roman:degree-to-chord:<tonic>:<mode>:<n>   (choice)
 *   - roman:chord-to-degree:<tonic>:<mode>:<n>   (choice)
 *   - roman:pattern:<mode>:<n>                    (choice, 7 per mode × 2 modes = 14)
 *   - roman:is-diatonic:<tonic>:<n>:yes/no        (choice, first 10 major keys)
 *   - roman:harmonic-fact:5 and :7               (choice, 2 items)
 *
 * Rank layout: FAMILY_BASE.roman = 3000, stride 16 per key.
 * Minor key tonic ASCII uses LOWERCASE in ids.
 */

import type { Note } from '../../types/music';
import { noteToString } from '../../types/music';
import type { DrillItem } from '../../types/drill';
import {
  displayNote,
  shuffleStable,
  FAMILY_BASE,
  KEY_PRIORITY,
  MAJOR_KEYS,
} from './shared';
import { buildScale, getRelativeMinor } from '../../constants/scales';
import { getDiatonicChordsForScale, getDiatonicTriadsMinor } from '../../constants/chords';

// ---- quality display label (lowercase, for chord display strings) ----
const TRIAD_QUALITY_DISPLAY: Record<string, string> = {
  major: 'major',
  minor: 'minor',
  diminished: 'diminished',
  augmented: 'augmented',
};

// ---- Major scale diatonic qualities in order (for pattern items) ----
const MAJOR_PATTERN_QUALITIES = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];
const MAJOR_PATTERN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

// ---- Natural minor diatonic qualities in order (for pattern items) ----
const MINOR_PATTERN_QUALITIES = ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'];
const MINOR_PATTERN_NUMERALS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

/**
 * Format a chord display string: e.g. "C♯ minor" or "F major".
 */
function chordDisplay(root: Note, quality: string): string {
  return `${displayNote(root)} ${TRIAD_QUALITY_DISPLAY[quality] ?? quality}`;
}

/**
 * Numeral styled for a given quality — used for lure generation in pattern items.
 * For degree d (1-based) in a given quality: we apply the correct case+suffix.
 */
function numeralForQuality(degree1: number, quality: string): string {
  const base = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][degree1 - 1];
  const isMinor = quality === 'minor' || quality === 'diminished';
  const numeral = isMinor ? base.toLowerCase() : base;
  if (quality === 'diminished') return numeral + '°';
  if (quality === 'augmented') return numeral + '+';
  return numeral;
}

/**
 * Build a pattern choice string: e.g. "major (IV)", "diminished (vii°)".
 */
function patternChoice(quality: string, degree1: number): string {
  return `${quality} (${numeralForQuality(degree1, quality)})`;
}

/**
 * Rank base within roman family for a major key string.
 * Stride 16 per key: 7 degree-to-chord + 7 chord-to-degree = 14 items, with 2 spare slots.
 */
function romanRankBase(keyStr: string): number {
  const idx = KEY_PRIORITY.indexOf(keyStr);
  if (idx === -1) throw new Error(`genRoman: unknown key "${keyStr}" in KEY_PRIORITY`);
  return FAMILY_BASE.roman + idx * 16;
}

export function genRoman(): DrillItem[] {
  const items: DrillItem[] = [];
  let rank = FAMILY_BASE.roman;

  // We assign ranks explicitly by sub-group rather than per-key stride for simplicity.
  // Pattern items, is-diatonic, and harmonic-fact get sequential ranks after key-based items.
  // Key-based ranks use stride 16: majors span +0..+237 (14*16 + 13 offsets); the minor
  // block starts at FAMILY_BASE.roman + 15*16 = 3240; pattern/is-diatonic/harmonic-fact follow.

  // ---------------------------------------------------------------------------
  // 1. degree-to-chord and chord-to-degree items (15 major + 15 minor keys)
  // ---------------------------------------------------------------------------

  for (const majorTonic of MAJOR_KEYS) {
    const majorStr = noteToString(majorTonic);
    const majorScale = buildScale(majorTonic, 'major');
    const majorDiatonic = getDiatonicChordsForScale(majorScale);
    const majorRankBase = romanRankBase(majorStr);

    for (let n = 1; n <= 7; n++) {
      const entry = majorDiatonic[n - 1];
      const correct = chordDisplay(entry.chord.root, entry.chord.quality);
      const numeral = entry.numeral;
      const keyDisplay = `${displayNote(majorTonic)} major`;

      // Build choice lures: 3 other diatonic chords from the same key
      const otherDisplays = majorDiatonic
        .filter((_, i) => i !== n - 1)
        .map((d) => chordDisplay(d.chord.root, d.chord.quality));

      const choicesRaw = [correct, ...otherDisplays.slice(0, 3)];
      const choices = shuffleStable([...new Set(choicesRaw)].slice(0, 4), `roman:d2c:${majorStr}:major:${n}`);

      const id = `roman:degree-to-chord:${majorStr}:major:${n}`;
      items.push({
        id,
        family: 'roman',
        promptKey: 'drill.prompts.degreeToChord',
        promptParams: { numeral, key: keyDisplay },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct },
        whyKey: 'drill.why.diatonicMember',
        whyParams: { numeral, key: keyDisplay, chord: correct },
        rank: majorRankBase + (n - 1),
      });

      // chord-to-degree: the 4 numerals as choices
      const otherNumerals = majorDiatonic
        .filter((_, i) => i !== n - 1)
        .map((d) => d.numeral);
      const degChoices = shuffleStable(
        [numeral, ...otherNumerals.slice(0, 3)],
        `roman:c2d:${majorStr}:major:${n}`,
      );
      const degId = `roman:chord-to-degree:${majorStr}:major:${n}`;
      items.push({
        id: degId,
        family: 'roman',
        promptKey: 'drill.prompts.chordToDegree',
        promptParams: { key: keyDisplay, chord: correct },
        input: { format: 'choice', choices: degChoices },
        answer: { kind: 'choice', correct: numeral },
        whyKey: 'drill.why.diatonicMember',
        whyParams: { numeral, key: keyDisplay, chord: correct },
        rank: majorRankBase + (n - 1) + 7,
      });
    }
  }

  // Minor keys via relative minor
  // Major keys use stride 16, so minorRankOffset = 3000 + 15*16 = 3240
  const minorRankOffset = FAMILY_BASE.roman + MAJOR_KEYS.length * 16;
  for (const majorTonic of MAJOR_KEYS) {
    const minorTonic = getRelativeMinor(majorTonic);
    const minorStr = noteToString(minorTonic).toLowerCase();
    const minorDiatonic = getDiatonicTriadsMinor(minorTonic);
    const keyDisplay = `${displayNote(minorTonic)} minor`;
    const minorKeyIdx = MAJOR_KEYS.indexOf(majorTonic);

    for (let n = 1; n <= 7; n++) {
      const entry = minorDiatonic[n - 1];
      const correct = chordDisplay(entry.chord.root, entry.chord.quality);
      const numeral = entry.numeral;

      const otherDisplays = minorDiatonic
        .filter((_, i) => i !== n - 1)
        .map((d) => chordDisplay(d.chord.root, d.chord.quality));

      const choicesRaw = [correct, ...otherDisplays.slice(0, 3)];
      const choices = shuffleStable([...new Set(choicesRaw)].slice(0, 4), `roman:d2c:${minorStr}:minor:${n}`);

      const id = `roman:degree-to-chord:${minorStr}:minor:${n}`;
      items.push({
        id,
        family: 'roman',
        promptKey: 'drill.prompts.degreeToChord',
        promptParams: { numeral, key: keyDisplay },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct },
        whyKey: 'drill.why.diatonicMember',
        whyParams: { numeral, key: keyDisplay, chord: correct },
        rank: minorRankOffset + (minorKeyIdx * 16) + (n - 1),
      });

      const otherNumerals = minorDiatonic
        .filter((_, i) => i !== n - 1)
        .map((d) => d.numeral);
      const degChoices = shuffleStable(
        [numeral, ...otherNumerals.slice(0, 3)],
        `roman:c2d:${minorStr}:minor:${n}`,
      );
      const degId = `roman:chord-to-degree:${minorStr}:minor:${n}`;
      items.push({
        id: degId,
        family: 'roman',
        promptKey: 'drill.prompts.chordToDegree',
        promptParams: { key: keyDisplay, chord: correct },
        input: { format: 'choice', choices: degChoices },
        answer: { kind: 'choice', correct: numeral },
        whyKey: 'drill.why.diatonicMember',
        whyParams: { numeral, key: keyDisplay, chord: correct },
        rank: minorRankOffset + (minorKeyIdx * 16) + (n - 1) + 7,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2. pattern items — quality-per-degree facts (7 major + 7 minor = 14)
  // ---------------------------------------------------------------------------

  // Start rank after all key-based items: 3000 + 15*16 (major) + 15*16 (minor) = 3480
  rank = FAMILY_BASE.roman + MAJOR_KEYS.length * 16 * 2;

  for (let n = 1; n <= 7; n++) {
    const quality = MAJOR_PATTERN_QUALITIES[n - 1];
    const numeral = MAJOR_PATTERN_NUMERALS[n - 1];
    const correct = `${quality} (${numeral})`;

    // Lures: 3 other qualities styled for same degree
    const otherQualities = ['major', 'minor', 'diminished', 'augmented'].filter((q) => q !== quality);
    const lures = otherQualities.slice(0, 3).map((q) => patternChoice(q, n));
    const choices = shuffleStable(
      [...new Set([correct, ...lures])].slice(0, 4),
      `roman:pattern:major:${n}`,
    );

    items.push({
      id: `roman:pattern:major:${n}`,
      family: 'roman',
      promptKey: 'drill.prompts.pattern',
      promptParams: { mode: 'major', num: n },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct },
      whyKey: 'drill.why.romanPattern',
      whyParams: { mode: 'major', num: n, chord: correct },
      rank: rank++,
    });
  }

  for (let n = 1; n <= 7; n++) {
    const quality = MINOR_PATTERN_QUALITIES[n - 1];
    const numeral = MINOR_PATTERN_NUMERALS[n - 1];
    const correct = `${quality} (${numeral})`;

    const otherQualities = ['major', 'minor', 'diminished', 'augmented'].filter((q) => q !== quality);
    const lures = otherQualities.slice(0, 3).map((q) => patternChoice(q, n));
    const choices = shuffleStable(
      [...new Set([correct, ...lures])].slice(0, 4),
      `roman:pattern:minor:${n}`,
    );

    items.push({
      id: `roman:pattern:minor:${n}`,
      family: 'roman',
      promptKey: 'drill.prompts.pattern',
      promptParams: { mode: 'minor', num: n },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct },
      whyKey: 'drill.why.romanPattern',
      whyParams: { mode: 'minor', num: n, chord: correct },
      rank: rank++,
    });
  }

  // ---------------------------------------------------------------------------
  // 3. is-diatonic items (first 10 major keys × 2 directions = 20)
  // ---------------------------------------------------------------------------

  for (let keyIdx = 0; keyIdx < 10; keyIdx++) {
    const keyStr = KEY_PRIORITY[keyIdx];
    const majorTonicNote = MAJOR_KEYS.find((k) => noteToString(k) === keyStr);
    if (!majorTonicNote) throw new Error(`genRoman: is-diatonic key "${keyStr}" not in MAJOR_KEYS`);

    const majorScale = buildScale(majorTonicNote, 'major');
    const majorDiatonic = getDiatonicChordsForScale(majorScale);
    const keyDisplay = `${displayNote(majorTonicNote)} major`;

    // Vary n deterministically: n = (keyIdx % 6) + 2 (degrees 2..7)
    const n = (keyIdx % 6) + 2;
    const entry = majorDiatonic[n - 1];
    const yesChord = chordDisplay(entry.chord.root, entry.chord.quality);

    // No-item: flip quality (minor <-> major)
    const flippedQuality = entry.chord.quality === 'major' ? 'minor' : 'major';
    const noChord = chordDisplay(entry.chord.root, flippedQuality);

    items.push({
      id: `roman:is-diatonic:${keyStr}:${n}:yes`,
      family: 'roman',
      promptKey: 'drill.prompts.isDiatonic',
      promptParams: { chord: yesChord, key: keyDisplay },
      input: { format: 'choice', choices: ['Yes', 'No'] },
      answer: { kind: 'choice', correct: 'Yes' },
      whyKey: 'drill.why.diatonicMember',
      whyParams: { numeral: entry.numeral, key: keyDisplay, chord: yesChord },
      rank: rank++,
    });

    items.push({
      id: `roman:is-diatonic:${keyStr}:${n}:no`,
      family: 'roman',
      promptKey: 'drill.prompts.isDiatonic',
      promptParams: { chord: noChord, key: keyDisplay },
      input: { format: 'choice', choices: ['Yes', 'No'] },
      answer: { kind: 'choice', correct: 'No' },
      whyKey: 'drill.why.diatonicMember',
      whyParams: { numeral: entry.numeral, key: keyDisplay, chord: noChord },
      rank: rank++,
    });
  }

  // ---------------------------------------------------------------------------
  // 4. harmonic-fact items (2)
  // ---------------------------------------------------------------------------

  // Degree 5 of harmonic minor = major (V) — raised leading tone makes V major
  // Degree 7 of harmonic minor = diminished (vii°)
  const HARMONIC_FACTS: Array<{ n: number; quality: string; numeral: string }> = [
    { n: 5, quality: 'major', numeral: 'V' },
    { n: 7, quality: 'diminished', numeral: 'vii°' },
  ];

  for (const { n, quality, numeral } of HARMONIC_FACTS) {
    const correct = `${quality} (${numeral})`;
    const otherQualities = ['major', 'minor', 'diminished', 'augmented'].filter((q) => q !== quality);
    const lures = otherQualities.slice(0, 3).map((q) => patternChoice(q, n));
    const choices = shuffleStable(
      [...new Set([correct, ...lures])].slice(0, 4),
      `roman:harmonic-fact:${n}`,
    );

    items.push({
      id: `roman:harmonic-fact:${n}`,
      family: 'roman',
      promptKey: 'drill.prompts.harmonicFact',
      promptParams: { num: n },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct },
      whyKey: 'drill.why.harmonicFact',
      whyParams: { num: n, correct },
      rank: rank++,
    });
  }

  return items;
}
