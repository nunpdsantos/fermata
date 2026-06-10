/**
 * Drill Item Bank — deterministic generator for WS9 Drill Mode.
 *
 * All output is pure and deterministic: calling generateDrillBank() twice
 * returns deep-equal results (no Date.now, no Math.random).
 *
 * Display strings (prompts/choices) use unicode ♯/♭/𝄪/𝄫.
 * DrillAnswerSpec.correct stores the display string shown on the chip
 * (per spec: 'choice' answers store display form).
 */

import { buildScale, getRelativeMinor, SCALE_DEGREE_NAMES } from '../constants/scales';
import type { Note } from '../types/music';
import { noteToString } from '../types/music';
import type { NaturalNote } from '../types/music';
import type { DrillFamily, DrillItem } from '../types/drill';
import { mulberry32, seededShuffle } from './prng';

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

/** Convert ASCII note string to unicode display (e.g. "F#" → "F♯", "Bb" → "B♭"). */
export function displayNote(n: Note): string {
  return noteToString(n)
    .replace(/##/g, '𝄪')
    .replace(/#/g, '♯')
    .replace(/bb/g, '𝄫')
    .replace(/b/g, '♭');
}

/** Convert an ASCII accidental-count string to display form (e.g. "3#" → "3♯"). */
function displaySig(sig: string): string {
  return sig.replace(/#/g, '♯').replace(/b/g, '♭');
}

// ---------------------------------------------------------------------------
// Note constructor shorthand
// ---------------------------------------------------------------------------

const N = (natural: NaturalNote, accidental: Note['accidental'] = ''): Note => ({
  natural,
  accidental,
});

// ---------------------------------------------------------------------------
// Static key tables
// ---------------------------------------------------------------------------

/** All 15 major keys (circle order: sharps then flats). */
export const MAJOR_KEYS: Note[] = [
  N('C'),
  N('G'),
  N('D'),
  N('A'),
  N('E'),
  N('B'),
  N('F', '#'),
  N('C', '#'),
  N('F'),
  N('B', 'b'),
  N('E', 'b'),
  N('A', 'b'),
  N('D', 'b'),
  N('G', 'b'),
  N('C', 'b'),
];

/** Standard order of sharps in a key signature: F C G D A E B (all as sharps). */
export const SHARP_ORDER: Note[] = (['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const).map((l) =>
  N(l as NaturalNote, '#'),
);

/** Standard order of flats in a key signature: B E A D G C F (all as flats). */
export const FLAT_ORDER: Note[] = (['B', 'E', 'A', 'D', 'G', 'C', 'F'] as const).map((l) =>
  N(l as NaturalNote, 'b'),
);

/**
 * Priority order for rank computation — common keys first.
 * Keys stored as ASCII noteToString values.
 */
const KEY_PRIORITY = [
  'C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'B', 'Db', 'F#', 'Gb', 'C#', 'Cb',
];

// ---------------------------------------------------------------------------
// Family rank bases
// ---------------------------------------------------------------------------

const FAMILY_BASE: Record<DrillFamily, number> = {
  degree: 0,
  circle: 100,
  keysig: 200,
  interval: 600,
  triad: 1200,
  scale: 1700,
  seventh: 2400,
  roman: 3000,
  function: 3800,
};

// ---------------------------------------------------------------------------
// Rank helper
// ---------------------------------------------------------------------------

/**
 * Compute rank for an item keyed by a major-key string (ASCII noteToString).
 * Common keys sort first within a family.
 */
function rankFor(family: DrillFamily, keyStr: string, offset = 0): number {
  const idx = KEY_PRIORITY.indexOf(keyStr);
  return FAMILY_BASE[family] + 4 * Math.max(0, idx) + offset;
}

// ---------------------------------------------------------------------------
// Deterministic shuffle helper (djb2 hash → mulberry32 seed)
// ---------------------------------------------------------------------------

function djb2(s: string): number {
  let h = 5381;
  for (const c of s) {
    h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  }
  return h;
}

/** Shuffle choices deterministically based on a salt string. */
function shuffleStable(choices: string[], salt: string): string[] {
  return seededShuffle(choices, mulberry32(djb2(salt)));
}

// ---------------------------------------------------------------------------
// Key signature engine
// ---------------------------------------------------------------------------

export interface KeySig {
  count: number;
  type: '#' | 'b' | 'none';
  accidentals: Note[];
}

/**
 * Derive key signature data for any major tonic by examining buildScale output.
 * Accidentals are returned in standard SHARP_ORDER / FLAT_ORDER sequence.
 */
export function keySignatureOf(majorTonic: Note): KeySig {
  const altered = buildScale(majorTonic, 'major').notes.filter((n) => n.accidental !== '');
  if (altered.length === 0) return { count: 0, type: 'none', accidentals: [] };
  const type = altered[0].accidental === '#' || altered[0].accidental === '##' ? '#' : 'b';
  const order = type === '#' ? SHARP_ORDER : FLAT_ORDER;
  return { count: altered.length, type, accidentals: order.slice(0, altered.length) };
}

// ---------------------------------------------------------------------------
// F4 — Scale degree names (simplest family, no key dependency)
// ---------------------------------------------------------------------------

function genDegree(): DrillItem[] {
  const items: DrillItem[] = [];

  for (let i = 0; i < SCALE_DEGREE_NAMES.length; i++) {
    const num = i + 1;
    const name = SCALE_DEGREE_NAMES[i];

    // num → name
    {
      // Lures: 3 adjacent degree names (deterministic)
      const others = SCALE_DEGREE_NAMES.filter((_, j) => j !== i);
      const lures = seededShuffle(others, mulberry32(djb2(`degree:num-to-name:${num}:lures`))).slice(0, 3);
      const choices = shuffleStable([name, ...lures], `degree:num-to-name:${num}:choices`);
      items.push({
        id: `degree:num-to-name:${num}`,
        family: 'degree',
        promptKey: 'drill.prompts.numToName',
        promptParams: { num },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct: name },
        whyKey: 'drill.why.degreeName',
        whyParams: { num, name },
        rank: FAMILY_BASE.degree + i * 2,
      });
    }

    // name → num
    {
      // Build the adjacent-num lures
      const allNums = ['1', '2', '3', '4', '5', '6', '7'];
      const otherNumsClean = allNums.filter((n) => n !== String(num));
      const lures = seededShuffle(otherNumsClean, mulberry32(djb2(`degree:name-to-num:${name}:lures`))).slice(0, 3);
      const choices = shuffleStable([String(num), ...lures], `degree:name-to-num:${name}:choices`);
      items.push({
        id: `degree:name-to-num:${name}`,
        family: 'degree',
        promptKey: 'drill.prompts.nameToNum',
        promptParams: { name },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct: String(num) },
        whyKey: 'drill.why.degreeName',
        whyParams: { num, name },
        rank: FAMILY_BASE.degree + i * 2 + 1,
      });
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// F2 — Circle of fifths
// ---------------------------------------------------------------------------

/**
 * The 12 canonical circle positions used for fifth-up/fifth-down items.
 * Display strings (♯/♭). Order: C G D A E B F♯ D♭ A♭ E♭ B♭ F
 */
const CIRCLE_DISPLAY = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];

/** ASCII lookup matching CIRCLE_DISPLAY (for id construction). */
const CIRCLE_ASCII = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

function genCircle(): DrillItem[] {
  const items: DrillItem[] = [];

  // --- next-sharp / next-flat chains (6 consecutive pairs each) ---
  for (let i = 0; i < SHARP_ORDER.length - 1; i++) {
    const curr = SHARP_ORDER[i];
    const next = SHARP_ORDER[i + 1];
    const currDisplay = displayNote(curr);
    const nextDisplay = displayNote(next);
    const currAscii = noteToString(curr);

    // Lures: other sharps (not curr or next)
    const otherSharps = SHARP_ORDER.filter((_, j) => j !== i && j !== i + 1).map(displayNote);
    const lures = seededShuffle(otherSharps, mulberry32(djb2(`circle:next-sharp:${currAscii}:lures`))).slice(0, 3);
    const choices = shuffleStable([nextDisplay, ...lures], `circle:next-sharp:${currAscii}:choices`);

    items.push({
      id: `circle:next-sharp:${currAscii}`,
      family: 'circle',
      promptKey: 'drill.prompts.nextSharp',
      promptParams: { acc: currDisplay },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct: nextDisplay },
      whyKey: 'drill.why.circleOrder',
      whyParams: { acc: currDisplay },
      // next-sharp slots: 100-110 (6 items × 2)
      rank: FAMILY_BASE.circle + i * 2,
    });
  }

  for (let i = 0; i < FLAT_ORDER.length - 1; i++) {
    const curr = FLAT_ORDER[i];
    const next = FLAT_ORDER[i + 1];
    const currDisplay = displayNote(curr);
    const nextDisplay = displayNote(next);
    const currAscii = noteToString(curr);

    const otherFlats = FLAT_ORDER.filter((_, j) => j !== i && j !== i + 1).map(displayNote);
    const lures = seededShuffle(otherFlats, mulberry32(djb2(`circle:next-flat:${currAscii}:lures`))).slice(0, 3);
    const choices = shuffleStable([nextDisplay, ...lures], `circle:next-flat:${currAscii}:choices`);

    items.push({
      id: `circle:next-flat:${currAscii}`,
      family: 'circle',
      promptKey: 'drill.prompts.nextFlat',
      promptParams: { acc: currDisplay },
      input: { format: 'choice', choices },
      answer: { kind: 'choice', correct: nextDisplay },
      whyKey: 'drill.why.circleOrder',
      whyParams: { acc: currDisplay },
      // next-sharp slots: 100-117 (6 items × 3), next-flat slots: 118-135
      rank: FAMILY_BASE.circle + 18 + i * 2,
    });
  }

  // --- fifth-up / fifth-down for 12 circle positions ---
  // Slots 136-159 for fifth-up, 160-183 for fifth-down — all < 200 (keysig base)
  for (let i = 0; i < CIRCLE_DISPLAY.length; i++) {
    const asciiKey = CIRCLE_ASCII[i];
    const currDisplay = CIRCLE_DISPLAY[i];

    const upIdx = (i + 1) % 12;
    const downIdx = (i + 11) % 12;
    const upDisplay = CIRCLE_DISPLAY[upIdx];
    const downDisplay = CIRCLE_DISPLAY[downIdx];

    // Lures for fifth-up: the fourth-up (= fifth-down, common confusion), a semitone neighbor, one other circle key
    const luresUpRaw = [
      downDisplay, // fourth-up = fifth-down (strong confuser)
      CIRCLE_DISPLAY[(i + 2) % 12], // two steps up
      CIRCLE_DISPLAY[(i + 10) % 12], // two steps down
    ];
    const luresUp = seededShuffle(
      luresUpRaw.filter((l) => l !== upDisplay),
      mulberry32(djb2(`circle:fifth-up:${asciiKey}:lures`)),
    ).slice(0, 3);
    const choicesUp = shuffleStable(
      [upDisplay, ...luresUp].slice(0, 4),
      `circle:fifth-up:${asciiKey}:choices`,
    );

    items.push({
      id: `circle:fifth-up:${asciiKey}`,
      family: 'circle',
      promptKey: 'drill.prompts.fifthUp',
      promptParams: { note: currDisplay },
      input: { format: 'choice', choices: choicesUp },
      answer: { kind: 'choice', correct: upDisplay },
      whyKey: 'drill.why.circleOrder',
      whyParams: { note: currDisplay },
      rank: FAMILY_BASE.circle + 36 + i * 2,
    });

    // Lures for fifth-down: fifth-up (common confusion), two-steps-down, two-steps-up
    const luresDownRaw = [
      upDisplay, // fourth-down = fifth-up (common confusion)
      CIRCLE_DISPLAY[(i + 10) % 12],
      CIRCLE_DISPLAY[(i + 2) % 12],
    ];
    const luresDown = seededShuffle(
      luresDownRaw.filter((l) => l !== downDisplay),
      mulberry32(djb2(`circle:fifth-down:${asciiKey}:lures`)),
    ).slice(0, 3);
    const choicesDown = shuffleStable(
      [downDisplay, ...luresDown].slice(0, 4),
      `circle:fifth-down:${asciiKey}:choices`,
    );

    items.push({
      id: `circle:fifth-down:${asciiKey}`,
      family: 'circle',
      promptKey: 'drill.prompts.fifthDown',
      promptParams: { note: currDisplay },
      input: { format: 'choice', choices: choicesDown },
      answer: { kind: 'choice', correct: downDisplay },
      whyKey: 'drill.why.circleOrder',
      whyParams: { note: currDisplay },
      rank: FAMILY_BASE.circle + 60 + i * 2,
    });
  }

  return items;
}

// ---------------------------------------------------------------------------
// F1 — Key signatures
// ---------------------------------------------------------------------------

/**
 * Format an accidental list in display form as a space-separated string.
 * E.g. SHARP_ORDER[0..2] → "F♯ C♯ G♯"
 */
function accListDisplay(accs: Note[]): string {
  return accs.map(displayNote).join(' ');
}

/** Format a count + type as a display chip string: "3♯", "3♭", "0". */
function countDisplay(count: number, type: '#' | 'b' | 'none'): string {
  if (type === 'none') return '0';
  return `${count}${type === '#' ? '♯' : '♭'}`;
}

/**
 * Build key-to-count choice lures.
 * Correct + ±1 same type + same count opposite type.
 * Special case C major: ['0', '1♯', '1♭', '2♯']
 */
function keyToCountChoices(sig: KeySig): string[] {
  const correct = countDisplay(sig.count, sig.type);
  if (sig.type === 'none') {
    // C major
    return shuffleStable(['0', '1♯', '1♭', '2♯'], 'keysig:count:C:choices');
  }
  const t = sig.type;
  const opp = t === '#' ? '♭' : '♯';
  const ts = t === '#' ? '♯' : '♭';
  const lures: string[] = [];
  if (sig.count > 1) lures.push(`${sig.count - 1}${ts}`);
  if (sig.count < 7) lures.push(`${sig.count + 1}${ts}`);
  lures.push(`${sig.count}${opp}`);
  const unique = [...new Set([correct, ...lures])];
  const salt = `keysig:count:${sig.count}${sig.type}:choices`;
  return shuffleStable(unique.slice(0, 4), salt);
}

/**
 * Build key-to-acc choice lures.
 * Choices: correct + one-shorter (if count>1) + one-longer (if count<7) + mirrored acc list of same count.
 * Cap at 4 unique.
 */
function keyToAccChoices(sig: KeySig): string[] {
  const order = sig.type === '#' ? SHARP_ORDER : FLAT_ORDER;
  const mirrorOrder = sig.type === '#' ? FLAT_ORDER : SHARP_ORDER;

  const correct = accListDisplay(order.slice(0, sig.count));
  const shorter = sig.count > 1 ? accListDisplay(order.slice(0, sig.count - 1)) : null;
  const longer = sig.count < 7 ? accListDisplay(order.slice(0, sig.count + 1)) : null;
  const mirrored = accListDisplay(mirrorOrder.slice(0, sig.count));

  const candidates = [correct];
  if (shorter) candidates.push(shorter);
  if (longer) candidates.push(longer);
  if (!candidates.includes(mirrored)) candidates.push(mirrored);

  const unique = [...new Set(candidates)];
  const salt = `keysig:acc:${sig.count}${sig.type}:choices`;
  return shuffleStable(unique.slice(0, 4), salt);
}

/** Display a major key name in unicode. */
function keyDisplayMajor(key: Note): string {
  return `${displayNote(key)} major`;
}

/** Display a minor key name in unicode. */
function keyDisplayMinor(minorRoot: Note): string {
  return `${displayNote(minorRoot)} minor`;
}

/**
 * Find major key for a given sig (count + type).
 * Returns the Note from MAJOR_KEYS.
 */
function majorKeyForSig(count: number, type: '#' | 'b'): Note | undefined {
  return MAJOR_KEYS.find((k) => {
    const s = keySignatureOf(k);
    return s.count === count && s.type === type;
  });
}

function genKeysig(): DrillItem[] {
  const items: DrillItem[] = [];

  // Build a lookup of sig → major key (for sig-to-key)
  // So we can deduplicate: only generate one sig-to-key per unique sig
  const sigToKeyGenerated = new Set<string>();

  for (const majorKey of MAJOR_KEYS) {
    const keyAscii = noteToString(majorKey);
    const sig = keySignatureOf(majorKey);
    const keyRank = rankFor('keysig', keyAscii);

    // --- key-to-count ---
    {
      const correct = countDisplay(sig.count, sig.type);
      const choices = keyToCountChoices(sig);
      const salt = `keysig:key-to-count:${keyAscii}:choices`;
      const finalChoices = shuffleStable(
        choices.includes(correct) ? choices : [correct, ...choices.slice(0, 3)],
        salt,
      );
      items.push({
        id: `keysig:key-to-count:${keyAscii}:major`,
        family: 'keysig',
        promptKey: 'drill.prompts.keyToCount',
        promptParams: { key: keyDisplayMajor(majorKey) },
        input: { format: 'choice', choices: finalChoices },
        answer: { kind: 'choice', correct },
        whyKey: 'drill.why.keyToCount',
        whyParams: { key: keyDisplayMajor(majorKey), answer: correct },
        rank: keyRank,
      });
    }

    // --- key-to-acc (only when count > 0) ---
    if (sig.count > 0) {
      const order = sig.type === '#' ? SHARP_ORDER : FLAT_ORDER;
      const correct = accListDisplay(order.slice(0, sig.count));
      const choices = keyToAccChoices(sig);
      const salt = `keysig:key-to-acc:${keyAscii}:choices`;
      const finalChoices = shuffleStable(
        choices.includes(correct) ? choices : [correct, ...choices.slice(0, 3)],
        salt,
      );
      items.push({
        id: `keysig:key-to-acc:${keyAscii}:major`,
        family: 'keysig',
        promptKey: 'drill.prompts.keyToAcc',
        promptParams: { key: keyDisplayMajor(majorKey) },
        input: { format: 'choice', choices: finalChoices },
        answer: { kind: 'choice', correct },
        whyKey: sig.type === '#' ? 'drill.why.lastSharp' : 'drill.why.penultimateFlat',
        whyParams: { key: keyDisplayMajor(majorKey), answer: correct },
        rank: keyRank + 1,
      });
    }

    // --- sig-to-key (major + minor) — one per unique sig ---
    if (sig.type !== 'none') {
      const sigKey = `${sig.count}${sig.type}`;
      if (!sigToKeyGenerated.has(sigKey)) {
        sigToKeyGenerated.add(sigKey);

        const sigDisplay = displaySig(sigKey);
        const minorRoot = getRelativeMinor(majorKey);
        const majorDisplay = keyDisplayMajor(majorKey);
        const minorDisplay = keyDisplayMinor(minorRoot);

        // Lures for major: circle neighbors ±1 + mirror-type key of same count
        const prevMajorKey = MAJOR_KEYS.find((k) => {
          const s = keySignatureOf(k);
          return s.count === sig.count - 1 && s.type === sig.type;
        });
        const nextMajorKey = MAJOR_KEYS.find((k) => {
          const s = keySignatureOf(k);
          return s.count === sig.count + 1 && s.type === sig.type;
        });
        const mirrorMajorKey = majorKeyForSig(sig.count, sig.type === '#' ? 'b' : '#');

        const majorLureKeys = [prevMajorKey, nextMajorKey, mirrorMajorKey].filter(
          (k): k is Note => k !== undefined,
        );
        const majorLureDisplays = majorLureKeys.map(keyDisplayMajor).filter((d) => d !== majorDisplay);
        const majorLures = seededShuffle(
          majorLureDisplays,
          mulberry32(djb2(`keysig:sig-to-key:${sigKey}:major:lures`)),
        ).slice(0, 3);
        const majorChoices = shuffleStable(
          [...new Set([majorDisplay, ...majorLures])].slice(0, 4),
          `keysig:sig-to-key:${sigKey}:major:choices`,
        );

        items.push({
          id: `keysig:sig-to-key:${sigKey}:major`,
          family: 'keysig',
          promptKey: 'drill.prompts.sigToKeyMajor',
          promptParams: { sig: sigDisplay },
          input: { format: 'choice', choices: majorChoices },
          answer: { kind: 'choice', correct: majorDisplay },
          whyKey: 'drill.why.sigToKey',
          whyParams: { sig: sigDisplay, answer: majorDisplay },
          rank: keyRank + 2,
        });

        // Lures for minor: same approach using relative minors of neighbors
        const prevMinorDisplay = prevMajorKey ? keyDisplayMinor(getRelativeMinor(prevMajorKey)) : null;
        const nextMinorDisplay = nextMajorKey ? keyDisplayMinor(getRelativeMinor(nextMajorKey)) : null;
        const mirrorMinorDisplay = mirrorMajorKey
          ? keyDisplayMinor(getRelativeMinor(mirrorMajorKey))
          : null;

        const minorLureDisplays = [prevMinorDisplay, nextMinorDisplay, mirrorMinorDisplay]
          .filter((d): d is string => d !== null && d !== minorDisplay);
        const minorLures = seededShuffle(
          minorLureDisplays,
          mulberry32(djb2(`keysig:sig-to-key:${sigKey}:minor:lures`)),
        ).slice(0, 3);
        const minorChoices = shuffleStable(
          [...new Set([minorDisplay, ...minorLures])].slice(0, 4),
          `keysig:sig-to-key:${sigKey}:minor:choices`,
        );

        items.push({
          id: `keysig:sig-to-key:${sigKey}:minor`,
          family: 'keysig',
          promptKey: 'drill.prompts.sigToKeyMinor',
          promptParams: { sig: sigDisplay },
          input: { format: 'choice', choices: minorChoices },
          answer: { kind: 'choice', correct: minorDisplay },
          whyKey: 'drill.why.sigToKey',
          whyParams: { sig: sigDisplay, answer: minorDisplay },
          rank: keyRank + 3,
        });
      }
    }

    // --- rel-minor (for each major key) ---
    {
      const minorRoot = getRelativeMinor(majorKey);
      const correct = keyDisplayMinor(minorRoot);

      // Lures: parallel minor (same root) + 2 circle-neighbor relatives
      const parallelMinor = keyDisplayMinor(majorKey); // e.g. "C minor" for C major
      const prevKey = MAJOR_KEYS[MAJOR_KEYS.indexOf(majorKey) - 1];
      const nextKey = MAJOR_KEYS[MAJOR_KEYS.indexOf(majorKey) + 1];
      const neighborMinors: string[] = [];
      if (prevKey) neighborMinors.push(keyDisplayMinor(getRelativeMinor(prevKey)));
      if (nextKey) neighborMinors.push(keyDisplayMinor(getRelativeMinor(nextKey)));

      const lureCandidates = [parallelMinor, ...neighborMinors].filter(
        (d) => d !== correct,
      );
      const lures = seededShuffle(
        lureCandidates,
        mulberry32(djb2(`keysig:rel-minor:${keyAscii}:lures`)),
      ).slice(0, 3);
      const choices = shuffleStable(
        [...new Set([correct, ...lures])].slice(0, 4),
        `keysig:rel-minor:${keyAscii}:choices`,
      );

      items.push({
        id: `keysig:rel-minor:${keyAscii}`,
        family: 'keysig',
        promptKey: 'drill.prompts.relMinor',
        promptParams: { key: displayNote(majorKey) },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct },
        whyKey: 'drill.why.relative',
        whyParams: { key: displayNote(majorKey), answer: correct },
        rank: keyRank + 2,
      });
    }

    // --- rel-major (for the relative minor of this major key) ---
    {
      const minorRoot = getRelativeMinor(majorKey);
      const minorAscii = noteToString(minorRoot).toLowerCase();
      const correct = keyDisplayMajor(majorKey);

      // Lures: parallel major (same root as minor) + neighbor major keys
      const parallelMajor = keyDisplayMajor(minorRoot as Note); // root treated as major key
      const prevKey = MAJOR_KEYS[MAJOR_KEYS.indexOf(majorKey) - 1];
      const nextKey = MAJOR_KEYS[MAJOR_KEYS.indexOf(majorKey) + 1];
      const neighborMajors: string[] = [];
      if (prevKey) neighborMajors.push(keyDisplayMajor(prevKey));
      if (nextKey) neighborMajors.push(keyDisplayMajor(nextKey));

      const lureCandidates = [parallelMajor, ...neighborMajors].filter(
        (d) => d !== correct,
      );
      const lures = seededShuffle(
        lureCandidates,
        mulberry32(djb2(`keysig:rel-major:${minorAscii}:lures`)),
      ).slice(0, 3);
      const choices = shuffleStable(
        [...new Set([correct, ...lures])].slice(0, 4),
        `keysig:rel-major:${minorAscii}:choices`,
      );

      items.push({
        id: `keysig:rel-major:${minorAscii}`,
        family: 'keysig',
        promptKey: 'drill.prompts.relMajor',
        promptParams: { key: displayNote(minorRoot) },
        input: { format: 'choice', choices },
        answer: { kind: 'choice', correct },
        whyKey: 'drill.why.relative',
        whyParams: { key: displayNote(minorRoot), answer: correct },
        rank: keyRank + 3,
      });
    }

    // --- key-to-count for minor key (same sig as relative major) ---
    {
      const minorRoot = getRelativeMinor(majorKey);
      const minorAscii = noteToString(minorRoot).toLowerCase();
      const correct = countDisplay(sig.count, sig.type);
      const choices = keyToCountChoices(sig);
      const salt = `keysig:key-to-count:${minorAscii}:minor:choices`;
      const finalChoices = shuffleStable(
        choices.includes(correct) ? choices : [correct, ...choices.slice(0, 3)],
        salt,
      );
      items.push({
        id: `keysig:key-to-count:${minorAscii}:minor`,
        family: 'keysig',
        promptKey: 'drill.prompts.keyToCount',
        promptParams: { key: keyDisplayMinor(minorRoot) },
        input: { format: 'choice', choices: finalChoices },
        answer: { kind: 'choice', correct },
        whyKey: 'drill.why.keyToCount',
        whyParams: { key: keyDisplayMinor(minorRoot), answer: correct },
        rank: keyRank + 4,
      });
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateDrillBank(): DrillItem[] {
  const items = [...genDegree(), ...genCircle(), ...genKeysig()];
  return items.sort((a, b) => a.rank - b.rank);
}

export function getItemsByFamily(bank: DrillItem[], family: DrillFamily): DrillItem[] {
  return bank.filter((i) => i.family === family);
}
