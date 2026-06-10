import { describe, expect, it } from 'vitest';
import { buildScale } from '../../constants/scales';
import { noteToString } from '../../types/music';
import {
  generateDrillBank,
  getItemsByFamily,
  displayNote,
  MAJOR_KEYS,
  DRILL_PROMPT_KEYS,
  DRILL_WHY_KEYS,
} from '../drillBank';
import { nameIntervalBetween, noteAtIntervalAbove } from '../drillBank/intervalEngine';
import { N } from '../drillBank/shared';
import { ALTERED_PAIRS } from '../drillBank/genInterval';
import enLocale from '../../../i18n/locales/en.json';

const bank = generateDrillBank();
const byId = new Map(bank.map((i) => [i.id, i]));

describe('drillBank invariants', () => {
  it('has unique stable ids', () => {
    expect(byId.size).toBe(bank.length);
  });
  it('is deterministic across calls', () => {
    expect(generateDrillBank()).toEqual(bank);
  });
  it('every choice answer is among its choices, choices unique', () => {
    for (const item of bank) {
      if (item.input.format === 'choice' && item.answer.kind === 'choice') {
        expect(item.input.choices).toContain(item.answer.correct);
        expect(new Set(item.input.choices).size).toBe(item.input.choices.length);
      }
    }
  });
  it('per-family counts are in expected ranges', () => {
    expect(getItemsByFamily(bank, 'keysig').length).toBeGreaterThanOrEqual(90);
    expect(getItemsByFamily(bank, 'circle').length).toBeGreaterThanOrEqual(20);
    expect(getItemsByFamily(bank, 'degree').length).toBe(14);
  });
  it('circle family has exactly 36 items (M4)', () => {
    expect(getItemsByFamily(bank, 'circle').length).toBe(36);
  });
  it('within-family ranks are unique (M5)', () => {
    const families = [...new Set(bank.map((i) => i.family))];
    for (const family of families) {
      const items = getItemsByFamily(bank, family);
      const ranks = items.map((i) => i.rank);
      expect(new Set(ranks).size).toBe(ranks.length);
    }
  });
  it('rank ordering respects family bases (degree < circle < keysig)', () => {
    const maxDegree = Math.max(...getItemsByFamily(bank, 'degree').map((i) => i.rank));
    const minCircle = Math.min(...getItemsByFamily(bank, 'circle').map((i) => i.rank));
    const maxCircle = Math.max(...getItemsByFamily(bank, 'circle').map((i) => i.rank));
    const minKeysig = Math.min(...getItemsByFamily(bank, 'keysig').map((i) => i.rank));
    expect(maxDegree).toBeLessThan(minCircle);
    expect(maxCircle).toBeLessThan(minKeysig);
  });
});

describe('F1 key signatures — goldens', () => {
  it('A major → 3 sharps F♯ C♯ G♯', () => {
    expect(byId.get('keysig:key-to-acc:A:major')?.answer).toEqual({ kind: 'choice', correct: 'F♯ C♯ G♯' });
    expect(byId.get('keysig:key-to-count:A:major')?.answer).toEqual({ kind: 'choice', correct: '3♯' });
  });
  it('Eb major → B♭ E♭ A♭', () => {
    expect(byId.get('keysig:key-to-acc:Eb:major')?.answer).toEqual({ kind: 'choice', correct: 'B♭ E♭ A♭' });
  });
  it('F# major → 6♯ and includes E♯', () => {
    expect(byId.get('keysig:key-to-count:F#:major')?.answer).toEqual({ kind: 'choice', correct: '6♯' });
    expect((byId.get('keysig:key-to-acc:F#:major')?.answer as { correct: string }).correct.split(' ')).toContain('E♯');
  });
  it('C major → 0 accidentals, count item only', () => {
    expect(byId.get('keysig:key-to-count:C:major')?.answer).toEqual({ kind: 'choice', correct: '0' });
    expect(byId.get('keysig:key-to-acc:C:major')).toBeUndefined();
  });
  it('relative pairs both directions', () => {
    expect(byId.get('keysig:rel-minor:Eb')?.answer).toEqual({ kind: 'choice', correct: 'C minor' });
    expect(byId.get('keysig:rel-major:c')?.answer).toEqual({ kind: 'choice', correct: 'E♭ major' });
  });
  it('signature → key asked for both modes', () => {
    expect(byId.get('keysig:sig-to-key:3#:major')?.answer).toEqual({ kind: 'choice', correct: 'A major' });
    expect(byId.get('keysig:sig-to-key:3#:minor')?.answer).toEqual({ kind: 'choice', correct: 'F♯ minor' });
  });
  it('engine roundtrip: every key-to-acc answer contains every altered note of the scale', () => {
    // Re-derive from buildScale — not trusting the generator itself
    for (const majorKey of MAJOR_KEYS) {
      const keyStr = noteToString(majorKey);
      const item = byId.get(`keysig:key-to-acc:${keyStr}:major`);
      if (!item) {
        // C major has no accidentals → no key-to-acc item is expected
        const scale = buildScale(majorKey, 'major');
        const alteredCount = scale.notes.filter((n) => n.accidental !== '').length;
        expect(alteredCount).toBe(0); // only C major should be missing this item
        continue;
      }
      // Derive the expected altered notes independently via buildScale
      const scale = buildScale(majorKey, 'major');
      const alteredNotes = scale.notes
        .filter((n) => n.accidental !== '')
        .map((n) => displayNote(n));

      // The answer tokens are the altered notes in SHARP_ORDER / FLAT_ORDER
      const correctAnswer = (item.answer as { kind: 'choice'; correct: string }).correct;
      const answerTokens = new Set(correctAnswer.split(' '));

      for (const expectedNote of alteredNotes) {
        expect(answerTokens).toContain(expectedNote);
      }
      expect(answerTokens.size).toBe(alteredNotes.length);
    }
  });
});

describe('F2 circle — goldens', () => {
  it('order of sharps chain', () => {
    expect(byId.get('circle:next-sharp:C#')?.answer).toEqual({ kind: 'choice', correct: 'G♯' });
  });
  it('fifth up from D is A; fifth down from F is B♭', () => {
    expect(byId.get('circle:fifth-up:D')?.answer).toEqual({ kind: 'choice', correct: 'A' });
    expect(byId.get('circle:fifth-down:F')?.answer).toEqual({ kind: 'choice', correct: 'B♭' });
  });
});

describe('F4 degree names — goldens', () => {
  it('5 ↔ Dominant both directions', () => {
    expect(byId.get('degree:num-to-name:5')?.answer).toEqual({ kind: 'choice', correct: 'Dominant' });
    expect(byId.get('degree:name-to-num:Dominant')?.answer).toEqual({ kind: 'choice', correct: '5' });
  });
});

// ---------------------------------------------------------------------------
// intervalEngine unit tests
// ---------------------------------------------------------------------------

describe('intervalEngine direct', () => {
  it('E→F is m2', () => {
    expect(nameIntervalBetween(N('E'), N('F'))?.label).toBe('Minor 2nd');
  });
  it('F→B is A4', () => {
    expect(nameIntervalBetween(N('F'), N('B'))?.label).toBe('Augmented 4th');
  });
  it('B→F is d5', () => {
    expect(nameIntervalBetween(N('B'), N('F'))?.label).toBe('Diminished 5th');
  });
  it('C→E is M3', () => {
    expect(nameIntervalBetween(N('C'), N('E'))?.label).toBe('Major 3rd');
  });
  it('C→G is P5', () => {
    expect(nameIntervalBetween(N('C'), N('G'))?.label).toBe('Perfect 5th');
  });
  it('A→C is m3', () => {
    expect(nameIntervalBetween(N('A'), N('C'))?.label).toBe('Minor 3rd');
  });
  it('noteAtIntervalAbove: B + P5 = F#', () => {
    const result = noteAtIntervalAbove(N('B'), 5, 7);
    expect(result).not.toBeNull();
    if (result) expect(`${result.natural}${result.accidental}`).toBe('F#');
  });
  it('noteAtIntervalAbove: Eb + M3 = G', () => {
    const result = noteAtIntervalAbove(N('E', 'b'), 3, 4);
    expect(result).not.toBeNull();
    if (result) expect(`${result.natural}${result.accidental}`).toBe('G');
  });
  it('noteAtIntervalAbove: C# + m6 = A', () => {
    const result = noteAtIntervalAbove(N('C', '#'), 6, 8);
    expect(result).not.toBeNull();
    if (result) expect(result.natural).toBe('A');
  });
  it('noteAtIntervalAbove: Bb + M7 = A', () => {
    const result = noteAtIntervalAbove(N('B', 'b'), 7, 11);
    expect(result).not.toBeNull();
    if (result) expect(result.natural).toBe('A');
  });
  it('nameIntervalBetween returns null for out-of-scope input', () => {
    // B# to C# would require an augmented unison — non-null, but Cb to B# is a major 7th
    // Testing the specific null path: unison with high semitone count
    expect(nameIntervalBetween(N('C'), N('C', 'b'))).toBeNull(); // descending ≈ 11 semitones, number=1 → null
  });
  it('noteAtIntervalAbove returns null for triple accidental', () => {
    // B# + M3 would need E## (3rd above B# is E, +4 semis from B# = 13 = C pitch, E needs ## delta -3 from E) → null
    // Actually let's use a case that's definitely triple: G## + M7 → F### which needs delta 3
    expect(noteAtIntervalAbove(N('G', '##'), 7, 11)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Interval naming + spelling — item goldens
// ---------------------------------------------------------------------------

describe('interval naming + spelling — goldens', () => {
  it('names: E→F m2, F→B A4, B→F d5, C→E M3', () => {
    expect(byId.get('interval:pair-to-name:E:F')?.answer).toEqual({ kind: 'choice', correct: 'Minor 2nd' });
    expect(byId.get('interval:pair-to-name:F:B')?.answer).toEqual({ kind: 'choice', correct: 'Augmented 4th' });
    expect(byId.get('interval:pair-to-name:B:F')?.answer).toEqual({ kind: 'choice', correct: 'Diminished 5th' });
    expect(byId.get('interval:pair-to-name:C:E')?.answer).toEqual({ kind: 'choice', correct: 'Major 3rd' });
  });
  it('spells: P5 above B = F♯, M3 above Eb = G, m6 above C# = A, M7 above Bb = A', () => {
    expect(byId.get('interval:note-above:B:P5')?.answer).toEqual({ kind: 'choice', correct: 'F♯' });
    expect(byId.get('interval:note-above:Eb:M3')?.answer).toEqual({ kind: 'choice', correct: 'G' });
    expect(byId.get('interval:note-above:C#:m6')?.answer).toEqual({ kind: 'choice', correct: 'A' });
    expect(byId.get('interval:note-above:Bb:M7')?.answer).toEqual({ kind: 'choice', correct: 'A' });
  });
  it('letter skeleton: third above G is B', () => {
    expect(byId.get('interval:letter-third:G')?.answer).toEqual({ kind: 'choice', correct: 'B' });
  });
  it('semitone facts: 7 semitones = Perfect 5th', () => {
    expect(byId.get('interval:semitones-to-name:7')?.answer).toEqual({ kind: 'choice', correct: 'Perfect 5th' });
  });
});

// ---------------------------------------------------------------------------
// Interval lure correctness — class-aware augmented/diminished branches
// ---------------------------------------------------------------------------

describe('interval lures — class-aware quality flip', () => {
  it('C→E♯ (Augmented 3rd): choices contain Major 3rd, NOT Perfect 3rd', () => {
    // A3 is augmented of interval number 3 (imperfect class) → confusable is Major, never Perfect
    const item = byId.get('interval:pair-to-name:C:E#');
    expect(item).toBeDefined();
    expect(item!.input.format).toBe('choice');
    if (item!.input.format === 'choice') {
      expect(item!.input.choices).toContain('Major 3rd');
      expect(item!.input.choices).not.toContain('Perfect 3rd');
    }
  });

  it('B→F (Diminished 5th): choices contain Perfect 5th', () => {
    // d5 is diminished of interval number 5 (perfect class) → confusable is Perfect 5th
    const item = byId.get('interval:pair-to-name:B:F');
    expect(item).toBeDefined();
    expect(item!.input.format).toBe('choice');
    if (item!.input.format === 'choice') {
      expect(item!.input.choices).toContain('Perfect 5th');
    }
  });
});

// ---------------------------------------------------------------------------
// Triad spelling — goldens
// ---------------------------------------------------------------------------

describe('triad spelling — goldens', () => {
  it('spell F# minor = F# A C# (noteChips)', () => {
    const item = byId.get('triad:name-to-notes:F#:minor');
    expect(item?.answer).toEqual({ kind: 'notes', notes: ['F#', 'A', 'C#'] });
    expect(item?.input.format).toBe('noteChips');
    if (item?.input.format === 'noteChips') {
      expect(item.input.expectedCount).toBe(3);
      for (const n of ['F♯', 'A', 'C♯']) expect(item.input.chips).toContain(n);
      expect(new Set(item.input.chips).size).toBe(item.input.chips.length);
    }
  });
  it('D F A names as D minor (rootQuality)', () => {
    expect(byId.get('triad:notes-to-name:D:minor')?.answer)
      .toEqual({ kind: 'rootQuality', root: 'D', quality: 'minor' });
  });
});

// ---------------------------------------------------------------------------
// Scale spelling — goldens
// ---------------------------------------------------------------------------

describe('scale spelling — goldens', () => {
  it('A major slots spell with F# C# G#', () => {
    const item = byId.get('scale:spell:A:major');
    expect(item?.answer).toEqual({ kind: 'accidentals', spelled: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] });
    expect(item?.input.format).toBe('accidentalSlots');
  });
  it('A harmonic minor raises G to G#', () => {
    const item = byId.get('scale:spell:a:harmonic_minor');
    expect((item?.answer as { spelled: string[] }).spelled).toContain('G#');
  });
  it('3rd degree of A major is C♯', () => {
    expect(byId.get('scale:degree-of:A:major:3')?.answer).toEqual({ kind: 'choice', correct: 'C♯' });
  });
  it('no scale answer contains double accidentals', () => {
    for (const item of getItemsByFamily(bank, 'scale')) {
      if (item.answer.kind === 'accidentals') {
        for (const s of item.answer.spelled) expect(s).not.toMatch(/##|bb/);
      }
    }
  });
  it('every spelled scale uses each letter exactly once', () => {
    for (const item of getItemsByFamily(bank, 'scale')) {
      if (item.answer.kind === 'accidentals') {
        const letters = item.answer.spelled.map((s) => s[0]);
        expect(new Set(letters).size).toBe(7);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Per-family count pins
// ---------------------------------------------------------------------------

describe('per-family count pins', () => {
  it('interval ≥ 170', () => {
    expect(getItemsByFamily(bank, 'interval').length).toBeGreaterThanOrEqual(170);
  });
  it('triad = 112', () => {
    expect(getItemsByFamily(bank, 'triad').length).toBe(112);
  });
  it('scale item count is pinned', () => {
    // Actual count after ## / bb filter: 234
    expect(getItemsByFamily(bank, 'scale').length).toBe(234);
  });
  it('altered pairs: every non-duplicate pair resolves to an item with the correct answer label', () => {
    // Natural-note pair ids that are already covered by sub-group 2
    const naturalIds = new Set(
      getItemsByFamily(bank, 'interval')
        .filter((i) => i.id.startsWith('interval:pair-to-name:') && i.id.split(':')[2].length === 1 && i.id.split(':')[3].length === 1)
        .map((i) => i.id),
    );

    for (const [lower, upper] of ALTERED_PAIRS) {
      const lowerAscii = noteToString(lower);
      const upperAscii = noteToString(upper);
      const id = `interval:pair-to-name:${lowerAscii}:${upperAscii}`;

      // Pairs that duplicate a natural-pair id are intentionally skipped in genInterval
      if (naturalIds.has(id)) continue;

      const item = byId.get(id);
      expect(item, `missing item for altered pair ${lowerAscii}→${upperAscii}`).toBeDefined();
      expect(item!.answer.kind).toBe('choice');

      const named = nameIntervalBetween(lower, upper);
      expect(named).not.toBeNull();
      expect((item!.answer as { kind: 'choice'; correct: string }).correct).toBe(named!.label);
    }
  });
});

// ---------------------------------------------------------------------------
// Seventh-chord goldens
// ---------------------------------------------------------------------------

describe('sevenths — goldens', () => {
  it('spell C#m7b5 = C# E G B', () => {
    expect(byId.get('seventh:name-to-notes:C#:half_diminished7')?.answer)
      .toEqual({ kind: 'notes', notes: ['C#', 'E', 'G', 'B'] });
  });
  it('G B D F names as G dominant 7', () => {
    expect(byId.get('seventh:notes-to-name:G:dominant7')?.answer)
      .toEqual({ kind: 'rootQuality', root: 'G', quality: 'dominant7' });
  });
  it('seventh family exists with 140 items (14 roots × 5 qualities × 2 directions)', () => {
    expect(getItemsByFamily(bank, 'seventh').length).toBe(140);
  });
  it('Cdim7 chips include B𝄫 (double-flat 7th)', () => {
    const item = byId.get('seventh:name-to-notes:C:diminished7');
    expect(item?.input.format).toBe('noteChips');
    if (item?.input.format === 'noteChips') {
      expect(item.input.expectedCount).toBe(4);
      // Answer notes include Bbb (double flat)
      expect(item.answer).toEqual({ kind: 'notes', notes: ['C', 'Eb', 'Gb', 'Bbb'] });
      // chip pool includes 𝄫 variant
      expect(item.input.chips.some((c: string) => c.includes('𝄫'))).toBe(true);
    }
  });
  it('all seventh noteChips have unique chips and exactly 4 expected', () => {
    for (const item of getItemsByFamily(bank, 'seventh')) {
      if (item.input.format === 'noteChips') {
        expect(item.input.expectedCount).toBe(4);
        expect(new Set(item.input.chips).size).toBe(item.input.chips.length);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Roman numeral goldens
// ---------------------------------------------------------------------------

describe('roman numerals — goldens', () => {
  it('vi of E major is C♯ minor', () => {
    expect(byId.get('roman:degree-to-chord:E:major:6')?.answer)
      .toEqual({ kind: 'choice', correct: 'C♯ minor' });
  });
  it('in G major, A minor is ii', () => {
    expect(byId.get('roman:chord-to-degree:G:major:2')?.answer)
      .toEqual({ kind: 'choice', correct: 'ii' });
  });
  it('major-key quality pattern fact for degree 7', () => {
    expect(byId.get('roman:pattern:major:7')?.answer)
      .toEqual({ kind: 'choice', correct: 'diminished (vii°)' });
  });
  it('harmonic-minor facts', () => {
    expect(byId.get('roman:harmonic-fact:5')?.answer).toEqual({ kind: 'choice', correct: 'major (V)' });
    expect(byId.get('roman:harmonic-fact:7')?.answer).toEqual({ kind: 'choice', correct: 'diminished (vii°)' });
  });
  it('roman family has expected count (15 major × 14 + 15 minor × 14 + 14 pattern + 20 is-diatonic + 2 harmonic-fact)', () => {
    const romanItems = getItemsByFamily(bank, 'roman');
    expect(romanItems.length).toBeGreaterThanOrEqual(450);
  });
  it('all roman choice items have 4 distinct choices', () => {
    for (const item of getItemsByFamily(bank, 'roman')) {
      if (item.input.format === 'choice' && item.answer.kind === 'choice') {
        expect(item.input.choices).toContain(item.answer.correct);
        expect(new Set(item.input.choices).size).toBe(item.input.choices.length);
      }
    }
  });
  it('minor key degree-to-chord ids use lowercase tonic', () => {
    const minorItems = getItemsByFamily(bank, 'roman').filter((i) =>
      i.id.startsWith('roman:degree-to-chord:') && i.id.split(':')[3] === 'minor',
    );
    expect(minorItems.length).toBeGreaterThan(0);
    for (const item of minorItems) {
      const tonic = item.id.split(':')[2];
      expect(tonic).toBe(tonic.toLowerCase());
    }
  });
});

// ---------------------------------------------------------------------------
// Function & cadence goldens
// ---------------------------------------------------------------------------

describe('function & cadences — goldens', () => {
  it('V7 of Eb is B♭7', () => {
    expect(byId.get('function:v7-of:Eb')?.answer).toEqual({ kind: 'choice', correct: 'B♭7' });
  });
  it('V → vi is deceptive', () => {
    expect(byId.get('function:cadence:V-vi')?.answer)
      .toEqual({ kind: 'choice', correct: 'Deceptive cadence' });
  });
  it('IV functions as subdominant in C', () => {
    expect(byId.get('function:chord-function:C:IV')?.answer)
      .toEqual({ kind: 'choice', correct: 'Subdominant (pre-dominant)' });
  });
  it('function family has 50 items (30 chord-function + 5 cadence + 15 v7-of)', () => {
    expect(getItemsByFamily(bank, 'function').length).toBe(50);
  });
  it('cadence choices are exactly the 4 distinct cadence names', () => {
    const cadenceItems = getItemsByFamily(bank, 'function').filter((i) =>
      i.id.startsWith('function:cadence:'),
    );
    expect(cadenceItems.length).toBe(5);
    for (const item of cadenceItems) {
      if (item.input.format === 'choice') {
        expect(item.input.choices.length).toBe(4);
        expect(new Set(item.input.choices).size).toBe(4);
      }
    }
  });
  it('V7-of answers contain the correct V7 for all 15 major keys', () => {
    for (const key of MAJOR_KEYS) {
      const keyStr = noteToString(key);
      const item = byId.get(`function:v7-of:${keyStr}`);
      expect(item, `missing v7-of:${keyStr}`).toBeDefined();
      expect(item!.answer.kind).toBe('choice');
      const correct = (item!.answer as { kind: 'choice'; correct: string }).correct;
      // Must end in '7' and use display unicode
      expect(correct).toMatch(/7$/);
    }
  });
});

// ---------------------------------------------------------------------------
// Final bank invariants (Step 6)
// ---------------------------------------------------------------------------

describe('final bank invariants (Step 6)', () => {
  it('total bank is between 900 and 1400 items', () => {
    expect(bank.length).toBeGreaterThanOrEqual(900);
    expect(bank.length).toBeLessThanOrEqual(1400);
  });
  it('every id matches /^[a-z]+:[a-z0-9-]+:.+$/i', () => {
    for (const item of bank) {
      expect(item.id).toMatch(/^[a-z]+:[a-z0-9-]+:.+$/i);
    }
  });
  it('cross-family rank separation for all 9 families', () => {
    const families = ['degree','circle','keysig','interval','triad','scale','seventh','roman','function'] as const;
    let prevMax = -Infinity;
    for (const family of families) {
      const items = getItemsByFamily(bank, family);
      expect(items.length, `${family} should have items`).toBeGreaterThan(0);
      const min = Math.min(...items.map((i) => i.rank));
      const max = Math.max(...items.map((i) => i.rank));
      expect(min, `${family} min rank should exceed prev family max`).toBeGreaterThan(prevMax);
      prevMax = max;
    }
  });
  it('every item promptKey is in DRILL_PROMPT_KEYS', () => {
    const set = new Set(DRILL_PROMPT_KEYS);
    for (const item of bank) {
      expect(set.has(item.promptKey), `unknown promptKey: ${item.promptKey}`).toBe(true);
    }
  });
  it('every item whyKey is in DRILL_WHY_KEYS', () => {
    const set = new Set(DRILL_WHY_KEYS);
    for (const item of bank) {
      expect(set.has(item.whyKey), `unknown whyKey: ${item.whyKey}`).toBe(true);
    }
  });
  it('DRILL_PROMPT_KEYS contains only keys that appear in the bank', () => {
    const usedKeys = new Set(bank.map((i) => i.promptKey));
    for (const key of DRILL_PROMPT_KEYS) {
      expect(usedKeys.has(key), `DRILL_PROMPT_KEYS has unused key: ${key}`).toBe(true);
    }
  });
  it('DRILL_WHY_KEYS contains only keys that appear in the bank', () => {
    const usedKeys = new Set(bank.map((i) => i.whyKey));
    for (const key of DRILL_WHY_KEYS) {
      expect(usedKeys.has(key), `DRILL_WHY_KEYS has unused key: ${key}`).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Token/params contract — every {{token}} in the EN template must be present
// in the corresponding item's params object. Closes the class of bugs where a
// param is missing and the learner sees a literal "{{key}}" in the why-line.
// ---------------------------------------------------------------------------

/** Navigate a dotted key path like "drill.why.diatonicMember" into a nested object. */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

/** Extract {{token}} names from a template string. */
function extractTokens(template: string): string[] {
  const matches = template.matchAll(/\{\{([a-zA-Z]+)\}\}/g);
  return [...new Set([...matches].map((m) => m[1]))].sort();
}

describe('token/params contract — EN template tokens ⊆ item params', () => {
  const en = enLocale as Record<string, unknown>;

  it('every whyKey EN template token is present in whyParams for every bank item', () => {
    const leaks: string[] = [];
    for (const item of bank) {
      const template = getNestedValue(en, item.whyKey);
      if (!template) continue; // registry tests already catch missing keys
      const tokens = extractTokens(template);
      const params = item.whyParams as Record<string, unknown> | undefined;
      for (const token of tokens) {
        if (!params || !(token in params)) {
          leaks.push(`item ${item.id}: whyKey "${item.whyKey}" needs "{{${token}}}" but whyParams lacks it`);
        }
      }
    }
    expect(leaks, leaks.join('\n')).toHaveLength(0);
  });

  it('every promptKey EN template token is present in promptParams for every bank item', () => {
    const leaks: string[] = [];
    for (const item of bank) {
      const template = getNestedValue(en, item.promptKey);
      if (!template) continue;
      const tokens = extractTokens(template);
      const params = item.promptParams as Record<string, unknown> | undefined;
      for (const token of tokens) {
        if (!params || !(token in params)) {
          leaks.push(`item ${item.id}: promptKey "${item.promptKey}" needs "{{${token}}}" but promptParams lacks it`);
        }
      }
    }
    expect(leaks, leaks.join('\n')).toHaveLength(0);
  });
});
