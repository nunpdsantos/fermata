/**
 * F1 — Key signature items.
 *
 * Rank offsets per key (stride 10 via rankFor 'keysig'):
 *   +0 key-to-count (major)
 *   +1 key-to-acc
 *   +2 sig-to-key:major
 *   +3 sig-to-key:minor
 *   +4 rel-minor
 *   +5 rel-major
 *   +6 key-to-count (minor)
 */

import type { Note } from '../../types/music';
import { noteToString } from '../../types/music';
import type { DrillItem } from '../../types/drill';
import {
  MAJOR_KEYS,
  SHARP_ORDER,
  FLAT_ORDER,
  displayNote,
  shuffleStable,
  rankFor,
  keySignatureOf,
  getRelativeMinor,
  type KeySig,
} from './shared';

// ---------------------------------------------------------------------------
// Display helpers (local to keysig)
// ---------------------------------------------------------------------------

/** Format an accidental list in display form as a space-separated string. */
function accListDisplay(accs: Note[]): string {
  return accs.map(displayNote).join(' ');
}

/** Format a count + type as a display chip string: "3♯", "3♭", "0". */
function countDisplay(count: number, type: '#' | 'b' | 'none'): string {
  if (type === 'none') return '0';
  return `${count}${type === '#' ? '♯' : '♭'}`;
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
 * Build key-to-count choice list (unshuffled unique candidates; caller shuffles).
 */
function keyToCountCandidates(sig: KeySig): string[] {
  const correct = countDisplay(sig.count, sig.type);
  if (sig.type === 'none') {
    return ['0', '1♯', '1♭', '2♯'];
  }
  const t = sig.type;
  const opp = t === '#' ? '♭' : '♯';
  const ts = t === '#' ? '♯' : '♭';
  const lures: string[] = [];
  if (sig.count > 1) lures.push(`${sig.count - 1}${ts}`);
  if (sig.count < 7) lures.push(`${sig.count + 1}${ts}`);
  lures.push(`${sig.count}${opp}`);
  return [...new Set([correct, ...lures])];
}

/**
 * Build key-to-acc choice list (unshuffled unique candidates; caller shuffles).
 */
function keyToAccCandidates(sig: KeySig): string[] {
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

  return [...new Set(candidates)];
}

/**
 * Find major key for a given sig (count + type).
 */
function majorKeyForSig(count: number, type: '#' | 'b'): Note | undefined {
  return MAJOR_KEYS.find((k) => {
    const s = keySignatureOf(k);
    return s.count === count && s.type === type;
  });
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export function genKeysig(): DrillItem[] {
  const items: DrillItem[] = [];

  const sigToKeyGenerated = new Set<string>();

  for (const majorKey of MAJOR_KEYS) {
    const keyAscii = noteToString(majorKey);
    const sig = keySignatureOf(majorKey);
    const keyRank = rankFor('keysig', keyAscii);

    // --- key-to-count (major) ---
    {
      const correct = countDisplay(sig.count, sig.type);
      if (sig.type === 'none') {
        // C major: fixed choices, single shuffle
        const choices = shuffleStable(['0', '1♯', '1♭', '2♯'], 'keysig:count:C:choices');
        items.push({
          id: `keysig:key-to-count:${keyAscii}:major`,
          family: 'keysig',
          promptKey: 'drill.prompts.keyToCount',
          promptParams: { key: keyDisplayMajor(majorKey) },
          input: { format: 'choice', choices },
          answer: { kind: 'choice', correct },
          whyKey: 'drill.why.keyToCount',
          whyParams: { key: keyDisplayMajor(majorKey), answer: correct },
          rank: keyRank,
        });
      } else {
        const candidates = keyToCountCandidates(sig);
        const choices = shuffleStable(candidates.slice(0, 4), `keysig:count:${sig.count}${sig.type}:choices`);
        items.push({
          id: `keysig:key-to-count:${keyAscii}:major`,
          family: 'keysig',
          promptKey: 'drill.prompts.keyToCount',
          promptParams: { key: keyDisplayMajor(majorKey) },
          input: { format: 'choice', choices },
          answer: { kind: 'choice', correct },
          whyKey: 'drill.why.keyToCount',
          whyParams: { key: keyDisplayMajor(majorKey), answer: correct },
          rank: keyRank,
        });
      }
    }

    // --- key-to-acc (only when count > 0) ---
    if (sig.count > 0) {
      const order = sig.type === '#' ? SHARP_ORDER : FLAT_ORDER;
      const correct = accListDisplay(order.slice(0, sig.count));
      const candidates = keyToAccCandidates(sig);
      const choices = shuffleStable(candidates.slice(0, 4), `keysig:acc:${sig.count}${sig.type}:choices`);
      items.push({
        id: `keysig:key-to-acc:${keyAscii}:major`,
        family: 'keysig',
        promptKey: 'drill.prompts.keyToAcc',
        promptParams: { key: keyDisplayMajor(majorKey) },
        input: { format: 'choice', choices },
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

        // Inline sigDisplay: e.g. "3#" → "3♯", "3b" → "3♭"
        const sigDisplay = sigKey.replace(/#/g, '♯').replace(/b/g, '♭');
        const minorRoot = getRelativeMinor(majorKey);
        const majorDisplay = keyDisplayMajor(majorKey);
        const minorDisplay = keyDisplayMinor(minorRoot);

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
        const majorLures = shuffleStable(majorLureDisplays, `keysig:sig-to-key:${sigKey}:major:lures`).slice(0, 3);
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

        const prevMinorDisplay = prevMajorKey ? keyDisplayMinor(getRelativeMinor(prevMajorKey)) : null;
        const nextMinorDisplay = nextMajorKey ? keyDisplayMinor(getRelativeMinor(nextMajorKey)) : null;
        const mirrorMinorDisplay = mirrorMajorKey
          ? keyDisplayMinor(getRelativeMinor(mirrorMajorKey))
          : null;

        const minorLureDisplays = [prevMinorDisplay, nextMinorDisplay, mirrorMinorDisplay]
          .filter((d): d is string => d !== null && d !== minorDisplay);
        const minorLures = shuffleStable(minorLureDisplays, `keysig:sig-to-key:${sigKey}:minor:lures`).slice(0, 3);
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

      const parallelMinor = keyDisplayMinor(majorKey);
      const prevKey = MAJOR_KEYS[MAJOR_KEYS.indexOf(majorKey) - 1];
      const nextKey = MAJOR_KEYS[MAJOR_KEYS.indexOf(majorKey) + 1];
      const neighborMinors: string[] = [];
      if (prevKey) neighborMinors.push(keyDisplayMinor(getRelativeMinor(prevKey)));
      if (nextKey) neighborMinors.push(keyDisplayMinor(getRelativeMinor(nextKey)));

      const lureCandidates = [parallelMinor, ...neighborMinors].filter((d) => d !== correct);
      const lures = shuffleStable(lureCandidates, `keysig:rel-minor:${keyAscii}:lures`).slice(0, 3);
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
        rank: keyRank + 4,
      });
    }

    // --- rel-major (for the relative minor of this major key) ---
    {
      const minorRoot = getRelativeMinor(majorKey);
      const minorAscii = noteToString(minorRoot).toLowerCase();
      const correct = keyDisplayMajor(majorKey);

      const parallelMajor = keyDisplayMajor(minorRoot as Note);
      const prevKey = MAJOR_KEYS[MAJOR_KEYS.indexOf(majorKey) - 1];
      const nextKey = MAJOR_KEYS[MAJOR_KEYS.indexOf(majorKey) + 1];
      const neighborMajors: string[] = [];
      if (prevKey) neighborMajors.push(keyDisplayMajor(prevKey));
      if (nextKey) neighborMajors.push(keyDisplayMajor(nextKey));

      const lureCandidates = [parallelMajor, ...neighborMajors].filter((d) => d !== correct);
      const lures = shuffleStable(lureCandidates, `keysig:rel-major:${minorAscii}:lures`).slice(0, 3);
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
        rank: keyRank + 5,
      });
    }

    // --- key-to-count for minor key (same sig as relative major) ---
    {
      const minorRoot = getRelativeMinor(majorKey);
      const minorAscii = noteToString(minorRoot).toLowerCase();
      const correct = countDisplay(sig.count, sig.type);
      if (sig.type === 'none') {
        const choices = shuffleStable(['0', '1♯', '1♭', '2♯'], `keysig:key-to-count:${minorAscii}:minor:choices`);
        items.push({
          id: `keysig:key-to-count:${minorAscii}:minor`,
          family: 'keysig',
          promptKey: 'drill.prompts.keyToCount',
          promptParams: { key: keyDisplayMinor(minorRoot) },
          input: { format: 'choice', choices },
          answer: { kind: 'choice', correct },
          whyKey: 'drill.why.keyToCount',
          whyParams: { key: keyDisplayMinor(minorRoot), answer: correct },
          rank: keyRank + 6,
        });
      } else {
        const candidates = keyToCountCandidates(sig);
        const choices = shuffleStable(candidates.slice(0, 4), `keysig:key-to-count:${minorAscii}:minor:choices`);
        items.push({
          id: `keysig:key-to-count:${minorAscii}:minor`,
          family: 'keysig',
          promptKey: 'drill.prompts.keyToCount',
          promptParams: { key: keyDisplayMinor(minorRoot) },
          input: { format: 'choice', choices },
          answer: { kind: 'choice', correct },
          whyKey: 'drill.why.keyToCount',
          whyParams: { key: keyDisplayMinor(minorRoot), answer: correct },
          rank: keyRank + 6,
        });
      }
    }
  }

  return items;
}
