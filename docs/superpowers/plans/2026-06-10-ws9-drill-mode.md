# Fermata Drill Mode (WS9) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A third top-level view, **Drill** — phone-first spaced-retrieval drilling of music-theory fundamentals (key signatures, circle of fifths, scales, degrees, intervals, chord spelling both directions, Roman numerals, cadences) with per-fact FSRS scheduling and a "by heart" (correct + < 3 s) mastery model.

**Architecture:** A pure, framework-agnostic item bank generated at runtime from `src/core/` (no authored content), a `ts-fsrs`-backed scheduler service, a seeded-PRNG session composer, one new persisted Zustand store (`fermata-drill-v1`), and a lazy-loaded `DrillView` with four tap-only answer components. Spec (source of truth): `docs/superpowers/specs/2026-06-10-fermata-drill-mode-design.md`. Every task leaves the repo green: `npx tsc -b --force && npx vitest run`. Tasks touching build config also run `npm run build`.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Zustand 5 (persist), ts-fsrs 5.x (MIT), Vitest + RTL.

**Commit convention:** every commit message ends with a blank line then:
`Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

**Hard constraints (from spec §5):** no XP/streaks/badges/notifications; no staff notation in the drill chunk; no curriculum coupling (never read/write module progress); spelling-exact grading with enharmonic near-miss feedback; legacy `music-theory-*` persist keys untouched.

---

## Pre-flight

- [ ] **Confirm branch + baseline green**

```bash
cd /Users/nunosantos/Desktop/Base/Music/new_music_app
git checkout ws9-drill-mode   # exists; spec already committed (95d790d)
npx tsc -b --force && npx vitest run
```
Expected: clean typecheck, ~2,254+ tests pass.

- [ ] **Commit this plan**

```bash
git add docs/superpowers/plans/2026-06-10-ws9-drill-mode.md
git commit -m "docs: WS9 drill mode implementation plan" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 1: Dependency + core drill types + shared PRNG

**Files:**
- Modify: `package.json` (add `ts-fsrs`)
- Create: `src/core/types/drill.ts`
- Create: `src/core/utils/prng.ts`
- Modify: `src/data/exercises/exerciseGenerator.ts` (import mulberry32 from the new util instead of its private copy)
- Test: `src/core/utils/prng.test.ts`

- [ ] **Step 1: Install ts-fsrs**

```bash
npm install ts-fsrs
```
Expected: `ts-fsrs@^5.x` in dependencies, `npm audit` still 0 production vulns.

- [ ] **Step 2: Create `src/core/utils/prng.ts`** — lift the existing private mulberry32 (currently `src/data/exercises/exerciseGenerator.ts:15`) verbatim into a shared core util:

```ts
/** Deterministic PRNG (mulberry32). Same algorithm previously private to exerciseGenerator. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle, pure: returns a new array. */
export function seededShuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
```

(If the existing mulberry32 body differs, copy the existing body exactly — behavior parity matters because exerciseGenerator output is seed-stable and tested.)

- [ ] **Step 3: Point exerciseGenerator at the shared util** — delete its private `mulberry32` and `import { mulberry32 } from '../../core/utils/prng';` (adjust relative path). No other changes.

- [ ] **Step 4: Create `src/core/types/drill.ts`**

```ts
import type { Note, NaturalNote } from './music';
import type { ChordQuality } from '../constants/chords';

export type DrillFamily =
  | 'keysig' | 'circle' | 'scale' | 'degree' | 'interval'
  | 'triad' | 'seventh' | 'roman' | 'function';

export const DRILL_FAMILIES: readonly DrillFamily[] = [
  'keysig', 'circle', 'scale', 'degree', 'interval',
  'triad', 'seventh', 'roman', 'function',
];

export type DrillInputSpec =
  | { format: 'choice'; choices: string[] }                            // display strings, exactly one correct
  | { format: 'noteChips'; chips: string[]; expectedCount: number }    // chips are note display strings
  | { format: 'accidentalSlots'; letters: NaturalNote[] }              // always 7 letters, in scale order
  | { format: 'rootQuality'; roots: string[]; qualities: ChordQuality[] };

export type DrillAnswerSpec =
  | { kind: 'choice'; correct: string }
  | { kind: 'notes'; notes: string[] }          // canonical spellings (ASCII # / b), order-insensitive
  | { kind: 'accidentals'; spelled: string[] }  // 7 canonical spellings in scale order
  | { kind: 'rootQuality'; root: string; quality: ChordQuality };

export interface DrillItem {
  id: string;                    // stable: `${family}:${direction}:${payload}` — NEVER change format
  family: DrillFamily;
  promptKey: string;             // i18n key under drill.prompts.*
  promptParams: Record<string, string | number>;
  input: DrillInputSpec;
  answer: DrillAnswerSpec;
  whyKey: string;                // i18n key under drill.why.*
  whyParams: Record<string, string | number>;
  rank: number;                  // global introduction order (lower = earlier)
}

export type MasteryTier = 'new' | 'learning' | 'review' | 'byHeart';

export interface AnswerRecord {
  ts: number;
  correct: boolean;
  ms: number;          // prompt render → grading tap
  sessionId: string;
}

/** ts-fsrs Card with Dates flattened to epoch ms for persistence. */
export interface SerializedCard {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;       // ts-fsrs State enum value
  last_review?: number;
  learning_steps: number;
}

export interface ItemSrsState {
  card: SerializedCard;
  history: AnswerRecord[];   // capped at 10, oldest dropped
  tier: MasteryTier;
  introSessionId?: string;   // session where the item was introduced
  introCorrectCount: number; // corrects within intro session (promotes at 2)
}
```

Note: before finalizing `SerializedCard`, open `node_modules/ts-fsrs/dist/index.d.ts` and mirror the actual `Card` fields of the installed version exactly (5.x added `learning_steps`). Adjust if the installed shape differs.

- [ ] **Step 5: PRNG tests** — `src/core/utils/prng.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { mulberry32, seededShuffle } from './prng';

describe('mulberry32', () => {
  it('is deterministic per seed', () => {
    const a = mulberry32(42); const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('yields values in [0,1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 1000; i++) { const v = r(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
});

describe('seededShuffle', () => {
  it('is a permutation and deterministic per seed', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const s1 = seededShuffle(arr, mulberry32(1));
    const s2 = seededShuffle(arr, mulberry32(1));
    expect(s1).toEqual(s2);
    expect([...s1].sort((x, y) => x - y)).toEqual(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8]); // pure
  });
});
```

- [ ] **Step 6: Green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): ts-fsrs dep, core drill types, shared seeded PRNG" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
Expected: all tests pass including the exerciseGenerator seed-stability tests (proves PRNG parity).

---

## Task 2: drillBank foundations + F1 key signatures, F2 circle, F4 degree names

**Files:**
- Create: `src/core/utils/drillBank.ts`
- Test: `src/core/utils/drillBank.test.ts`

Everything in this file is pure and framework-agnostic. Display strings use unicode ♯/♭ for prompts/chips (people-facing); `DrillAnswerSpec` stores canonical ASCII spellings (`#`/`b`, matching `noteToString` from `src/core/types/music.ts:202`).

- [ ] **Step 1: Write failing golden tests first** — `drillBank.test.ts` (start with F1/F2/F4 sections):

```ts
import { describe, expect, it } from 'vitest';
import { generateDrillBank, getItemsByFamily } from './drillBank';

const bank = generateDrillBank();
const byId = new Map(bank.map((i) => [i.id, i]));

describe('drillBank invariants', () => {
  it('has unique stable ids', () => {
    expect(byId.size).toBe(bank.length);
  });
  it('every choice answer is among its choices', () => {
    for (const item of bank) {
      if (item.input.format === 'choice' && item.answer.kind === 'choice') {
        expect(item.input.choices).toContain(item.answer.correct);
        expect(new Set(item.input.choices).size).toBe(item.input.choices.length);
      }
    }
  });
  it('per-family counts are in expected ranges', () => {
    const counts = Object.fromEntries(
      ['keysig','circle','scale','degree','interval','triad','seventh','roman','function']
        .map((f) => [f, getItemsByFamily(bank, f as never).length]),
    );
    expect(counts.keysig).toBeGreaterThanOrEqual(90);
    expect(counts.circle).toBeGreaterThanOrEqual(20);
    expect(counts.degree).toBe(14);
  });
});

describe('F1 key signatures — goldens', () => {
  it('A major → 3 sharps F# C# G#', () => {
    const acc = byId.get('keysig:key-to-acc:A:major');
    expect(acc?.answer).toEqual({ kind: 'choice', correct: 'F♯ C♯ G♯' });
    const cnt = byId.get('keysig:key-to-count:A:major');
    expect(cnt?.answer).toEqual({ kind: 'choice', correct: '3♯' });
  });
  it('Eb major → Bb Eb Ab', () => {
    expect(byId.get('keysig:key-to-acc:Eb:major')?.answer)
      .toEqual({ kind: 'choice', correct: 'B♭ E♭ A♭' });
  });
  it('F# major → 6♯ and includes E#', () => {
    const it6 = byId.get('keysig:key-to-count:F#:major');
    expect(it6?.answer).toEqual({ kind: 'choice', correct: '6♯' });
    const acc = byId.get('keysig:key-to-acc:F#:major');
    expect((acc?.answer as { correct: string }).correct.split(' ')).toContain('E♯');
  });
  it('relative pairs both directions', () => {
    expect(byId.get('keysig:rel-minor:Eb')?.answer).toEqual({ kind: 'choice', correct: 'C minor' });
    expect(byId.get('keysig:rel-major:c')?.answer).toEqual({ kind: 'choice', correct: 'E♭ major' });
  });
});

describe('F2 circle — goldens', () => {
  it('order of sharps chain', () => {
    expect(byId.get('circle:next-sharp:C#')?.answer).toEqual({ kind: 'choice', correct: 'G♯' });
  });
  it('fifth up from D is A; fifth down from F is Bb', () => {
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
```

Run: `npx vitest run src/core/utils/drillBank.test.ts` → FAIL (module missing).

- [ ] **Step 2: Implement `drillBank.ts` foundations + F1/F2/F4.** Core structure:

```ts
import type { Note, NaturalNote } from '../types/music';
import { noteToString } from '../types/music';
import type { DrillFamily, DrillItem, DrillInputSpec } from '../types/drill';
import { buildScale, getRelativeMinor, getRelativeMajor } from '../constants/scales';

// ── display helpers ─────────────────────────────────────────────────────────
export function displayNote(n: Note): string {
  return noteToString(n).replace(/##/g, '𝄪').replace(/#/g, '♯').replace(/bb/g, '𝄫').replace(/b/g, '♭');
}
const N = (natural: NaturalNote, accidental: Note['accidental'] = ''): Note => ({ natural, accidental });

// ── canonical key/data tables ───────────────────────────────────────────────
/** 15 spellable major tonics, circle order C → sharps → flats. */
export const MAJOR_KEYS: Note[] = [
  N('C'), N('G'), N('D'), N('A'), N('E'), N('B'), N('F', '#'), N('C', '#'),
  N('F'), N('B', 'b'), N('E', 'b'), N('A', 'b'), N('D', 'b'), N('G', 'b'), N('C', 'b'),
];
export const SHARP_ORDER: Note[] = ['F','C','G','D','A','E','B'].map((l) => N(l as NaturalNote, '#'));
export const FLAT_ORDER: Note[] = ['B','E','A','D','G','C','F'].map((l) => N(l as NaturalNote, 'b'));
/** Priority for introduction: common keys first. */
const KEY_PRIORITY = ['C','G','D','A','E','F','Bb','Eb','Ab','B','Db','F#','Gb','C#','Cb'];

interface KeySig { count: number; type: '#' | 'b' | 'none'; accidentals: Note[] }
export function keySignatureOf(majorTonic: Note): KeySig {
  const altered = buildScale(majorTonic, 'major').notes.filter((n) => n.accidental !== '');
  if (altered.length === 0) return { count: 0, type: 'none', accidentals: [] };
  const type = altered[0].accidental === '#' ? '#' : 'b';
  const order = type === '#' ? SHARP_ORDER : FLAT_ORDER;
  return { count: altered.length, type, accidentals: order.slice(0, altered.length) };
}
```

F1 generator (pattern for everything else — full bodies required, lures are confusables):

```ts
function genKeysig(): DrillItem[] {
  const items: DrillItem[] = [];
  for (const tonic of MAJOR_KEYS) {
    const sig = keySignatureOf(tonic);
    const keyStr = noteToString(tonic);
    const disp = `${displayNote(tonic)} major`;
    const countAnswer = sig.count === 0 ? '0' : `${sig.count}${sig.type === '#' ? '♯' : '♭'}`;
    const countLures = countLureSet(sig);            // e.g. 3♯ → ['2♯','4♯','3♭']
    items.push({
      id: `keysig:key-to-count:${keyStr}:major`, family: 'keysig',
      promptKey: 'drill.prompts.keyToCount', promptParams: { key: disp },
      input: { format: 'choice', choices: shuffleStable([countAnswer, ...countLures], keyStr) },
      answer: { kind: 'choice', correct: countAnswer },
      whyKey: 'drill.why.keyToCount',
      whyParams: { key: disp, answer: countAnswer, order: sig.type === 'b' ? 'B♭ E♭ A♭ D♭ G♭ C♭ F♭' : 'F♯ C♯ G♯ D♯ A♯ E♯ B♯' },
      rank: rankFor('keysig', keyStr),
    });
    if (sig.count > 0) {
      const accAnswer = sig.accidentals.map(displayNote).join(' ');
      items.push({
        id: `keysig:key-to-acc:${keyStr}:major`, family: 'keysig',
        promptKey: 'drill.prompts.keyToAcc', promptParams: { key: disp },
        input: { format: 'choice', choices: shuffleStable([accAnswer, ...accLureSet(sig)], keyStr) },
        answer: { kind: 'choice', correct: accAnswer },
        whyKey: sig.type === '#' ? 'drill.why.lastSharp' : 'drill.why.penultimateFlat',
        whyParams: { key: disp, answer: accAnswer },
        rank: rankFor('keysig', keyStr) + 1,
      });
      // signature → key (major and minor asked separately)
      items.push(sigToKeyItem(sig, tonic, 'major'));
      items.push(sigToKeyItem(sig, getRelativeMinor(tonic), 'minor'));
    }
    // relative pairs (both directions)
    const relMin = getRelativeMinor(tonic);
    items.push(relItem('rel-minor', tonic, relMin), relItem('rel-major', relMin, tonic));
  }
  return items;
}
```

`countLureSet`: ±1 count same type + same count opposite type. `accLureSet`: the orders one-shorter and one-longer, plus the flat/sharp mirror — all real confusions. `sigToKeyItem` choices: correct key + the keys one sharp/flat either side (circle neighbors). `relItem` choices: correct + parallel major/minor + circle neighbor (e.g. for "relative minor of C": A minor ✓, C minor (parallel trap), E minor / G minor (neighbor traps)). `shuffleStable(choices, salt)`: deterministic order via mulberry32 seeded on a hash of the salt — bank output must be identical across runs (tests depend on it).

`rankFor(family, key)`: returns `familyBase[family] + KEY_PRIORITY.indexOf(...)`-based offsets implementing the spec §3.2 introduction order (F4 → F2 → F1 → …). Define `const FAMILY_BASE: Record<DrillFamily, number> = { degree: 0, circle: 100, keysig: 200, interval: 600, triad: 1200, scale: 1700, seventh: 2400, roman: 3000, function: 3800 }` and add fine-grained offsets inside each family (common keys / naturals / common roots first). The cross-family interleave happens at session level; rank only orders *within* the pipeline.

F2: from the circle order — `circle:next-sharp:<X>` for each consecutive pair in SHARP_ORDER (6 items), same for flats; `circle:fifth-up:<key>` / `fifth-down` for each of the 12 pitch-class keys on the circle (use MAJOR_KEYS[0..11] wrap; up = next in C→G→D… order, down = previous). Choices: correct + 3 lures (fourth instead of fifth, semitone neighbor, same letter wrong accidental where applicable).

F4: 7 number→name + 7 name→number items from `SCALE_DEGREE_NAMES` (`src/core/constants/scales.ts`), choices = 4 degree names / numbers, lures = adjacent degrees. Feedback notes Subtonic for the natural-minor 7th (`drill.why.degreeName`).

Public API at the bottom:

```ts
export function generateDrillBank(): DrillItem[] {
  const items = [...genDegree(), ...genCircle(), ...genKeysig()]; // later tasks append families
  return items.sort((a, b) => a.rank - b.rank);
}
export function getItemsByFamily(bank: DrillItem[], family: DrillFamily): DrillItem[] {
  return bank.filter((i) => i.family === family);
}
```

- [ ] **Step 3: Run the tests** — `npx vitest run src/core/utils/drillBank.test.ts` → PASS. Also add the **engine-roundtrip invariant** inside the test file: for every `keysig:key-to-acc` item, re-derive via `buildScale` and assert every altered scale note appears in the answer string (catches order-table drift).

- [ ] **Step 4: Full green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): item bank foundations — key signatures, circle of fifths, degree names" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 3: drillBank F5 intervals, F6 triads, F3 scales

**Files:**
- Modify: `src/core/utils/drillBank.ts`
- Test: `src/core/utils/drillBank.test.ts` (extend)

- [ ] **Step 1: Failing goldens first** (extend test file):

```ts
describe('interval naming + spelling — goldens', () => {
  it('names: E→F m2, F→B A4, B→F d5, C→E M3', () => {
    expect(byId.get('interval:pair-to-name:E:F')?.answer).toEqual({ kind: 'choice', correct: 'Minor 2nd' });
    expect(byId.get('interval:pair-to-name:F:B')?.answer).toEqual({ kind: 'choice', correct: 'Augmented 4th' });
    expect(byId.get('interval:pair-to-name:B:F')?.answer).toEqual({ kind: 'choice', correct: 'Diminished 5th' });
    expect(byId.get('interval:pair-to-name:C:E')?.answer).toEqual({ kind: 'choice', correct: 'Major 3rd' });
  });
  it('spells: P5 above B = F#, M3 above Eb = G, m6 above C# = A, M7 above Bb = A', () => {
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

describe('triad spelling — goldens', () => {
  it('spell F# minor = F# A C#', () => {
    const item = byId.get('triad:name-to-notes:F#:minor');
    expect(item?.answer).toEqual({ kind: 'notes', notes: ['F#', 'A', 'C#'] });
    expect(item?.input.format).toBe('noteChips');
  });
  it('D F A names as D minor', () => {
    expect(byId.get('triad:notes-to-name:D:minor')?.answer)
      .toEqual({ kind: 'rootQuality', root: 'D', quality: 'minor' });
  });
});

describe('scale spelling — goldens', () => {
  it('A major slots spell with F# C# G#', () => {
    const item = byId.get('scale:spell:A:major');
    expect(item?.answer).toEqual({ kind: 'accidentals', spelled: ['A','B','C#','D','E','F#','G#'] });
    expect(item?.input.format).toBe('accidentalSlots');
  });
  it('A harmonic minor raises G to G#', () => {
    const item = byId.get('scale:spell:A:harmonic_minor');
    expect((item?.answer as { spelled: string[] }).spelled).toContain('G#');
  });
  it('3rd degree of A major is C#', () => {
    expect(byId.get('scale:degree-of:A:major:3')?.answer).toEqual({ kind: 'choice', correct: 'C♯' });
  });
});
```

- [ ] **Step 2: Implement the interval engine** (pure, local to drillBank — core has no between-notes namer):

```ts
import { getPitchClass, getNaturalAtInterval, NATURAL_NOTE_ORDER } from '../constants/notes';

const BASE_SEMITONES: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12 };
const PERFECT_CLASS = new Set([1, 4, 5, 8]);

export interface NamedInterval { number: number; quality: 'perfect'|'major'|'minor'|'augmented'|'diminished'; label: string }

/** Name the ascending interval lower→upper (letter distance first, then quality). */
export function nameIntervalBetween(lower: Note, upper: Note): NamedInterval | null {
  const li = NATURAL_NOTE_ORDER.indexOf(lower.natural);
  const ui = NATURAL_NOTE_ORDER.indexOf(upper.natural);
  const number = ((ui - li + 7) % 7) + 1;                    // 1..7 (treat same-letter as unison family)
  let semis = (getPitchClass(upper) - getPitchClass(lower) + 12) % 12;
  if (number === 1 && semis > 6) return null;                // out of v1 scope
  const delta = semis - BASE_SEMITONES[number];
  const quality = PERFECT_CLASS.has(number)
    ? delta === 0 ? 'perfect' : delta === 1 ? 'augmented' : delta === -1 ? 'diminished' : null
    : delta === 0 ? 'major' : delta === -1 ? 'minor' : delta === 1 ? 'augmented' : delta === -2 ? 'diminished' : null;
  if (!quality) return null;
  const ORDINAL = ['Unison', '2nd', '3rd', '4th', '5th', '6th', '7th', 'Octave'];
  const label = number === 1 ? 'Perfect Unison'
    : `${quality[0].toUpperCase()}${quality.slice(1)} ${ORDINAL[number - 1]}`;
  return { number, quality, label };
}

const ACC_FROM_DELTA: Record<number, Note['accidental']> = { [-2]: 'bb', [-1]: 'b', 0: '', 1: '#', 2: '##' };
/** Spell the note a named interval above root: letter first, accidental from pitch-class delta. */
export function noteAtIntervalAbove(root: Note, number: number, semitones: number): Note | null {
  const natural = getNaturalAtInterval(root.natural, number - 1);
  const naturalPc = getPitchClass({ natural, accidental: '' });
  const targetPc = (getPitchClass(root) + semitones) % 12;
  let delta = targetPc - naturalPc;
  if (delta > 6) delta -= 12;
  if (delta < -6) delta += 12;
  const accidental = ACC_FROM_DELTA[delta];
  return accidental === undefined ? null : { natural, accidental };
}
```

Generators:
- `interval:pair-to-name:<L>:<U>` — all 42 ascending natural pairs (each natural root × 6 other letters; quality from `nameIntervalBetween`; choices = correct label + 3 lures: quality flip (m↔M), number ±1 same quality, tritone alternates for the F–B/B–F pair).
- Altered confusable set (~24 curated pairs hardcoded as data: `[['C','E#'],['C','F'],['C#','E'],['Db','F'],['E','G#'],['Eb','G'],['F#','C#'],['Gb','Db'],['A','C'],['A','C#'],['A#','C#'],['Bb','Db'], …]` — each must produce a non-null `nameIntervalBetween`; assert that in an invariant test).
- `interval:note-above:<root>:<abbr>` — 12 common roots (PRACTICAL_ROOTS below minus C♭-family) × {m3,M3,P4,P5,m6,M6,m7,M7} using `noteAtIntervalAbove` + `ABBREVIATION_TO_SEMITONES`; number from abbr (m3/M3→3 etc.). Choices: correct + enharmonic-equivalent trap (`getSimplestSpelling` alternative when different) + letter ±1 lures.
- `interval:letter-third:<L>` — 7 items via `getNaturalAtInterval(l, 2)`.
- `interval:semitones-to-name:<n>` for n=1..12 using `INTERVAL_LABELS` (post-WS6: 8 → 'Minor 6th'); why-line states this is a recognition fact, not the spelling method (`drill.why.semitoneFact`).

- [ ] **Step 3: Implement F6 triads**

```ts
export const PRACTICAL_ROOTS: Note[] = [
  N('C'), N('C','#'), N('D','b'), N('D'), N('E','b'), N('E'), N('F'), N('F','#'),
  N('G','b'), N('G'), N('A','b'), N('A'), N('B','b'), N('B'),
];
const TRIAD_QUALITIES = ['major', 'minor', 'diminished', 'augmented'] as const;
```

For each root × quality: `buildChord(root, quality)` → notes.
- `triad:name-to-notes:<root>:<q>` — input `noteChips`: chips = the 3 correct + 9 distractors (correct letters with wrong accidentals, the enharmonic traps, ±5th alterations), `expectedCount: 3`; answer `{ kind: 'notes', notes: notes.map(noteToString) }`.
- `triad:notes-to-name:<root>:<q>` — prompt shows `notes.map(displayNote).join(' – ')`; input `rootQuality` with `roots` = the 3 chord tones as display strings (root ID is part of the skill) and `qualities` = the 4 triad qualities; answer `{ kind: 'rootQuality', root: noteToString(root), quality: q }`.
Why-lines: `drill.why.triadStack` with the M3+m3-style stack description per quality (params from a small `const STACKS: Record<string,string>` map: major 'M3 + m3', minor 'm3 + M3', diminished 'm3 + m3', augmented 'M3 + M3').

- [ ] **Step 4: Implement F3 scales**
- `scale:spell:<tonic>:<type>` for the 15 major tonics × `major` + 15 minor tonics × {`natural_minor`,`harmonic_minor`,`melodic_minor`} (ascending): input `accidentalSlots` with `letters` = the scale's 7 naturals in order (degree 1 first); answer `spelled` = `buildScale(...).notes.map(noteToString)`. Skip any scale whose spelling contains `##`/`bb` (e.g. some melodic/harmonic forms on extreme keys — filter, don't special-case; the invariant test asserts no double accidentals in F3 answers).
- `scale:degree-of:<tonic>:<mode>:<n>` for n=2..7, both modes (major + natural_minor): choices = correct display note + 3 lures (adjacent degrees, accidental flips).

- [ ] **Step 5: Run new goldens** → PASS. Add invariants: every `triad:name-to-notes` answer re-validates `buildChord` roundtrip; every F3 answer has 7 notes, one per letter (`new Set(naturals).size === 7`).

- [ ] **Step 6: Full green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): interval, triad, and scale drill families" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 4: drillBank F7 sevenths, F8 Roman numerals, F9 function & cadences

**Files:**
- Modify: `src/core/utils/drillBank.ts`
- Test: `src/core/utils/drillBank.test.ts` (extend)

- [ ] **Step 1: Failing goldens first:**

```ts
describe('sevenths — goldens', () => {
  it('spell C#m7b5 = C# E G B', () => {
    expect(byId.get('seventh:name-to-notes:C#:half_diminished7')?.answer)
      .toEqual({ kind: 'notes', notes: ['C#', 'E', 'G', 'B'] });
  });
  it('G B D F names as G dominant 7', () => {
    expect(byId.get('seventh:notes-to-name:G:dominant7')?.answer)
      .toEqual({ kind: 'rootQuality', root: 'G', quality: 'dominant7' });
  });
});

describe('roman numerals — goldens', () => {
  it('vi of E major is C# minor', () => {
    expect(byId.get('roman:degree-to-chord:E:major:6')?.answer)
      .toEqual({ kind: 'choice', correct: 'C♯ minor' });
  });
  it('in G major, A minor is ii', () => {
    expect(byId.get('roman:chord-to-degree:G:major:2')?.answer)
      .toEqual({ kind: 'choice', correct: 'ii' });
  });
  it('major-key quality pattern fact', () => {
    expect(byId.get('roman:pattern:major:7')?.answer)
      .toEqual({ kind: 'choice', correct: 'diminished (vii°)' });
  });
});

describe('function & cadences — goldens', () => {
  it('V7 of Eb is Bb7', () => {
    expect(byId.get('function:v7-of:Eb')?.answer).toEqual({ kind: 'choice', correct: 'B♭7' });
  });
  it('V → vi is deceptive', () => {
    expect(byId.get('function:cadence:V-vi')?.answer)
      .toEqual({ kind: 'choice', correct: 'Deceptive cadence' });
  });
  it('IV functions as subdominant', () => {
    expect(byId.get('function:chord-function:C:IV')?.answer)
      .toEqual({ kind: 'choice', correct: 'Subdominant (pre-dominant)' });
  });
});
```

- [ ] **Step 2: F7** — `const SEVENTH_QUALITIES = ['major7','dominant7','minor7','half_diminished7','diminished7'] as const;` × `PRACTICAL_ROOTS`, both directions exactly like F6 (4 chips expected; quality chip labels from `CHORD_QUALITY_NAMES`). Why-line `drill.why.seventhLadder` describes the one-note-flattens ladder step relative to maj7 (data map: dominant7 'lower the 7th', minor7 'lower the 7th and 3rd', half_diminished7 'lower the 7th, 3rd and 5th', diminished7 'lower everything but the root — the 7th twice'). Items whose spelling includes a double accidental are KEPT (Cdim7 contains B𝄫 — real theory); the noteChips distractor builder must therefore include double-accidental chips when the answer needs them.

- [ ] **Step 3: F8** — for each of the 15 major keys: `getDiatonicChordsForScale(buildScale(tonic,'major'))`, and for each of the 15 minor keys: `getDiatonicTriadsMinor(tonic)`:
- `roman:degree-to-chord:<tonic>:<mode>:<n>` (n=1..7): prompt "{numeral} of {key}?", choices = correct `"<note> <quality>"` display + 3 lures (other diatonic chords of the same key).
- `roman:chord-to-degree:<tonic>:<mode>:<n>`: prompt "In {key}, {chord} is which degree?", choices = 4 numerals from that mode's numeral set.
- `roman:pattern:<mode>:<n>` (7 per mode): "In any {mode} key, the triad on degree {n} is?", choices = the 4 triad-quality names with the numeral attached to the correct one (data straight from `DIATONIC_QUALITIES`).
- `roman:is-diatonic:<tonic>:<n>:yes|no` for 10 selected keys (KEY_PRIORITY first 10): yes-item = the degree-n chord; no-item = same root, quality flipped (m↔M); choices `['Yes', 'No']`, why-line gives the numeral or the correction.
- Harmonic-minor facts (hardcoded, 2 items): "In minor keys with the raised 7th, the chord on 5 / on 7 is?" → 'major (V)' / 'diminished (vii°)' (`roman:harmonic-fact:5|7`).

- [ ] **Step 4: F9** (hardcoded data arrays — this family is concept items):
- `function:chord-function:<key>:<numeral>` for keys C,G,D,F,Bb × numerals I,ii,IV,V,vi,vii° → choices `['Tonic','Subdominant (pre-dominant)','Dominant']` (mapping: I,vi→Tonic; ii,IV→Subdominant; V,vii°→Dominant). Why-lines explain the pull (`drill.why.function`).
- `function:cadence:<pair>` for pairs `V-I` (Perfect authentic), `IV-I` (Plagal), `ii-V` ('Half cadence — UK: imperfect'), `I-V` (Half), `V-vi` (Deceptive): choices = the 5 cadence names; why includes UK names ('Deceptive — UK: interrupted', 'Authentic — UK: perfect').
- `function:v7-of:<key>` for all 15 major keys: spell the dominant-7th chord SYMBOL (choices: correct `<display>7` + lures IV7-as-symbol, V of relative minor, semitone neighbor). Answer derives from degree-5 of `buildScale(tonic,'major')`.

- [ ] **Step 5: Final bank invariants** (extend tests): total bank size between 900 and 1,400; every id parses as `family:direction:rest`; rank ordering — `degree` items all rank below the first `circle` item, etc. per FAMILY_BASE; every `promptKey`/`whyKey` value is a member of an exported `DRILL_PROMPT_KEYS`/`DRILL_WHY_KEYS` list (these lists feed the i18n parity test in Task 13).

- [ ] **Step 6: Full green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): seventh-chord, roman-numeral, and function/cadence families complete the bank" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 5: drillScheduler (ts-fsrs wrapper, grading, mastery tiers)

**Files:**
- Create: `src/services/drillScheduler.ts`
- Test: `src/services/drillScheduler.test.ts`

All functions take injectable `now: number` (repo convention — see `spacedRepetition.ts`).

- [ ] **Step 1: Failing tests first** — cover: grade mapping boundaries (5999 ms → Good, 6001 ms → Hard, wrong → Again); new item lifecycle (`new` → first answer `learning` → second correct same session `review`); cross-session byHeart (3 distinct sessions, correct, median ms < 3000 → `byHeart`; then one lapse → `review`); intervals grow on repeated Good (due strictly increases); Again resets shorter; serialization round-trip (`toCard`/`fromCard` are inverses).

```ts
import { describe, expect, it } from 'vitest';
import { applyAnswer, gradeFor, isDue, computeTier } from './drillScheduler';

const DAY = 86_400_000;
const t0 = 1_750_000_000_000;

function answerSeq(specs: Array<{ correct: boolean; ms: number; session: string; at: number }>) {
  let state: ReturnType<typeof applyAnswer> | undefined;
  for (const s of specs) state = applyAnswer(state, s.correct, s.ms, s.at, s.session);
  return state!;
}

it('grades by correctness then latency', () => {
  expect(gradeFor(false, 1000)).toBe('again');
  expect(gradeFor(true, 6001)).toBe('hard');
  expect(gradeFor(true, 5999)).toBe('good');
});

it('promotes new → learning → review within the intro session', () => {
  const s1 = applyAnswer(undefined, true, 2000, t0, 'S1');
  expect(s1.tier).toBe('learning');
  const s2 = applyAnswer(s1, true, 2500, t0 + 60_000, 'S1');
  expect(s2.tier).toBe('review');
});

it('reaches byHeart after 3 fast correct answers in distinct sessions, demotes on lapse', () => {
  const s = answerSeq([
    { correct: true, ms: 2000, session: 'S1', at: t0 },
    { correct: true, ms: 2400, session: 'S1', at: t0 + 60_000 },
    { correct: true, ms: 2100, session: 'S2', at: t0 + 1 * DAY },
    { correct: true, ms: 1900, session: 'S3', at: t0 + 3 * DAY },
  ]);
  expect(s.tier).toBe('byHeart');
  const lapsed = applyAnswer(s, false, 4000, t0 + 5 * DAY, 'S4');
  expect(lapsed.tier).toBe('review');
});

it('due dates grow on good, reset on again', () => {
  const a = applyAnswer(undefined, true, 2000, t0, 'S1');
  const b = applyAnswer(a, true, 2000, t0 + 1 * DAY, 'S2');
  const c = applyAnswer(b, true, 2000, t0 + 4 * DAY, 'S3');
  expect(c.card.due).toBeGreaterThan(b.card.due);
  const lapsed = applyAnswer(c, false, 2000, t0 + 10 * DAY, 'S4');
  expect(lapsed.card.due - (t0 + 10 * DAY)).toBeLessThan(c.card.due - (t0 + 4 * DAY));
  expect(isDue(lapsed, lapsed.card.due + 1)).toBe(true);
});
```

Run → FAIL (module missing).

- [ ] **Step 2: Implement.**

```ts
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card } from 'ts-fsrs';
import type { AnswerRecord, ItemSrsState, MasteryTier, SerializedCard } from '../core/types/drill';

const F = fsrs(generatorParameters({ request_retention: 0.9 }));
const HISTORY_CAP = 10;
export const SLOW_MS = 6000;
export const BY_HEART_MS = 3000;

export type Grade = 'again' | 'hard' | 'good';
export function gradeFor(correct: boolean, ms: number): Grade {
  if (!correct) return 'again';
  return ms > SLOW_MS ? 'hard' : 'good';
}
const RATING: Record<Grade, Rating> = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good };

export function toCard(s: SerializedCard): Card { /* epoch ms → Date fields */ }
export function fromCard(c: Card): SerializedCard { /* Date fields → epoch ms */ }

export function computeTier(history: AnswerRecord[], prev: { tier: MasteryTier; introSessionId?: string; introCorrectCount: number }): MasteryTier {
  if (history.length === 0) return 'new';
  if (prev.tier === 'new' || prev.tier === 'learning') {
    return prev.introCorrectCount >= 2 ? 'review' : 'learning';
  }
  // byHeart: most-recent answer per session for the last 3 distinct sessions — all correct, median ms < BY_HEART_MS
  const bySession = new Map<string, AnswerRecord>();
  for (const r of history) bySession.set(r.sessionId, r); // history is chronological; last write wins
  const lastThree = [...bySession.values()].slice(-3);
  if (lastThree.length === 3 && lastThree.every((r) => r.correct)) {
    const med = lastThree.map((r) => r.ms).sort((a, b) => a - b)[1];
    if (med < BY_HEART_MS) return 'byHeart';
  }
  const last = history[history.length - 1];
  return last.correct ? (prev.tier === 'byHeart' ? 'byHeart' : 'review') : 'review';
}

export function applyAnswer(
  state: ItemSrsState | undefined,
  correct: boolean,
  ms: number,
  now: number,
  sessionId: string,
): ItemSrsState {
  const card = state ? toCard(state.card) : createEmptyCard(new Date(now));
  const { card: nextCard } = F.next(card, new Date(now), RATING[gradeFor(correct, ms)]);
  const record: AnswerRecord = { ts: now, correct, ms, sessionId };
  const history = [...(state?.history ?? []), record].slice(-HISTORY_CAP);
  const introSessionId = state?.introSessionId ?? sessionId;
  const introCorrectCount =
    (state?.introCorrectCount ?? 0) + (correct && sessionId === introSessionId ? 1 : 0);
  const prev = { tier: state?.tier ?? 'new', introSessionId, introCorrectCount } as const;
  const tier = computeTier(history, prev);
  return { card: fromCard(nextCard), history, tier, introSessionId, introCorrectCount };
}

export function isDue(state: ItemSrsState | undefined, now: number): boolean {
  if (!state) return false;
  return state.tier !== 'new' && now >= state.card.due;
}
```

`toCard`/`fromCard`: write them against the installed `Card` type (open `node_modules/ts-fsrs/dist/index.d.ts`); every `Date` field becomes a number in `SerializedCard` and back. If `F.next` doesn't exist in the installed major version, use `F.repeat(card, date)[rating].card`.

One subtlety the test pins: a lapse must demote `byHeart` → `review`. `computeTier` above achieves it because the lapse record makes `lastThree.every(correct)` false and the `last.correct ? ... : 'review'` branch fires.

- [ ] **Step 3: Run tests** → PASS. Then full green + commit:

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): FSRS-backed scheduler with latency grading and by-heart tiers" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 6: drillSession composer + in-session queue logic

**Files:**
- Create: `src/services/drillSession.ts`
- Test: `src/services/drillSession.test.ts`

- [ ] **Step 1: Failing tests first** — assertions: due items precede new; new-per-session cap respected (incl. 0 = review-only); families filtered; no item twice in a row in the composed list; deterministic per seed; all-caught-up fallback fills from review/byHeart tiers; wrong-answer requeue inserts at +4..6; new-item second exposure inserts at +6 or later.

- [ ] **Step 2: Implement.**

```ts
import type { DrillItem, ItemSrsState } from '../core/types/drill';
import type { DrillFamily } from '../core/types/drill';
import { mulberry32, seededShuffle } from '../core/utils/prng';
import { isDue } from './drillScheduler';

export interface SessionConfig {
  length: 12 | 24 | 40;
  newPerSession: number;            // 0..8
  families: Record<DrillFamily, boolean>;
}

export function composeSession(
  bank: DrillItem[],
  states: Record<string, ItemSrsState>,
  config: SessionConfig,
  now: number,
  seed: number,
): string[] {
  const rand = mulberry32(seed);
  const pool = bank.filter((i) => config.families[i.family]);
  const due = pool.filter((i) => isDue(states[i.id], now))
    .sort((a, b) => (states[a.id]!.card.due - states[b.id]!.card.due));     // most overdue first
  const learning = pool.filter((i) => states[i.id]?.tier === 'learning');
  const fresh = pool.filter((i) => !states[i.id]).sort((a, b) => a.rank - b.rank)
    .slice(0, config.newPerSession);
  const used = new Set([...due, ...learning, ...fresh].map((i) => i.id));
  const confidence = seededShuffle(
    pool.filter((i) => !used.has(i.id) && states[i.id] && (states[i.id]!.tier === 'review' || states[i.id]!.tier === 'byHeart'))
      .sort((a, b) => states[a.id]!.card.due - states[b.id]!.card.due),     // nearest-due first…
    rand,
  );
  // order: shuffled (due + learning), then the new mini-block after 2 warmups, confidence fill to length
  const review = seededShuffle([...due, ...learning], rand);
  const head = review.slice(0, 2);
  const tail = review.slice(2);
  const ordered = [...head, ...fresh, ...tail, ...confidence].slice(0, config.length);
  return dedupeAdjacent(ordered.map((i) => i.id));
}

function dedupeAdjacent(ids: string[]): string[] { /* swap forward any immediate repeat; drop if impossible */ }

/** Runner helpers — pure queue ops used by the store. */
export function requeueAfterMiss(queue: string[], index: number, id: string, rand: () => number): string[] {
  const offset = 4 + Math.floor(rand() * 3);                 // +4..6
  return insertAt(queue, Math.min(index + offset, queue.length), id);
}
export function requeueSecondExposure(queue: string[], index: number, id: string, rand: () => number): string[] {
  const offset = 6 + Math.floor(rand() * 5);                 // +6..10
  return insertAt(queue, Math.min(index + offset, queue.length), id);
}
function insertAt(q: string[], pos: number, id: string): string[] { const out = q.slice(); out.splice(pos, 0, id); return out; }
```

Session semantics the store enforces (Task 7): total questions asked stops at `config.length` even when requeues extend the list; a requeued miss counts as a new question slot.

- [ ] **Step 3: Run tests → PASS; full green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): seeded session composer with due/learning/new/confidence mix" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 7: drillStore (persisted) + shape guards + reset integration

**Files:**
- Create: `src/state/drillStore.ts`
- Test: `src/state/drillStore.test.ts`
- Modify: the reset-app-data path (find it: `rg -n "reset-app-data\|resetAppData\|Reset app data" src/` — wire drill key into the same flow)

- [ ] **Step 1: Failing tests first** — persistence round-trip via the same pattern as `progressStore.test.ts` (look at how it tests persist + migrate); corrupt persisted shape (e.g. `items: 'garbage'`) falls back to empty state instead of crashing (mirror progressStore's WS6 guard tests); `recordAnswer` updates item state AND active session counters atomically; mid-session resume: `startSession` → 3 `recordAnswer`s → simulate reload (new store from persisted JSON) → `activeSession.index === 3`.

- [ ] **Step 2: Implement.** Follow `src/state/progressStore.ts` structure exactly (persist config, `version: 1`, `migrate` + `merge` shape-validation, storage key `fermata-drill-v1`):

```ts
interface ActiveSession {
  id: string;            // `s${startedAt}` is fine — stable per session
  queue: string[];
  index: number;         // next question pointer
  asked: number;         // questions asked so far (caps at settings.length)
  correct: number;
  startedAt: number;
  seed: number;
}

interface DrillSettings extends SessionConfig {
  sound: boolean;        // default true
  showTimer: boolean;    // default false
}

interface DrillStore {
  items: Record<string, ItemSrsState>;
  settings: DrillSettings;
  sprintBests: Record<string, number>;   // key: enabled-families signature
  lifetime: { answered: number; correct: number };
  activeSession: ActiveSession | null;
  // actions
  startSession: (bank: DrillItem[], now: number) => void;
  recordAnswer: (item: DrillItem, correct: boolean, ms: number, now: number) => void;
  endSession: () => void;
  updateSettings: (patch: Partial<DrillSettings>) => void;
  recordSprint: (familiesKey: string, score: number) => void;
}
```

`recordAnswer` logic (single `set` call): compute next item state via `applyAnswer`; requeue via `requeueAfterMiss` (wrong, max 2 requeues per item per session — track in a non-persisted ref or per-session map) or `requeueSecondExposure` (first-ever correct on a `learning` item whose `introCorrectCount` just hit 1); bump `index`, `asked`, `correct`, `lifetime`. Session ends when `asked >= settings.length` OR queue exhausted (runner shows summary; `activeSession` stays until `endSession` so the summary can render from it).

Defaults: `{ length: 24, newPerSession: 4, families: all true, sound: true, showTimer: false }`.

- [ ] **Step 3: Wire the reset escape hatch** — add `localStorage.removeItem('fermata-drill-v1')` (or the store's own reset action) wherever the existing reset-app-data control clears the other stores. Test: reset clears drill state.

- [ ] **Step 4: Green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): persisted drill store with session resume and shape guards" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 8: View wiring + first playable slice (ChoiceChips end-to-end)

**Files:**
- Modify: `src/state/storeTypes.ts` (ViewMode), `src/components/layout/TopBar.tsx` (VIEWS, VIEW_KEYS), `src/App.tsx` (lazy view + VIEW_COMPONENTS), `src/components/layout/AppShell.tsx` (hide instrument area when drill)
- Create: `src/views/DrillView.tsx`, `src/components/drill/QuestionCard.tsx`, `src/components/drill/ChoiceChips.tsx`, `src/components/drill/FeedbackStrip.tsx`, `src/components/drill/useDrillRunner.ts`
- Modify: `src/i18n/locales/en.json` (+ pt/es: `nav.drill` only in this task)
- Test: `src/views/DrillView.test.tsx`, `src/components/drill/ChoiceChips.test.tsx`

- [ ] **Step 1: ViewMode + tab.** `export type ViewMode = 'explore' | 'learn' | 'drill';` — update `VIEWS`/`VIEW_KEYS` in TopBar (`nav.drill`), `VIEW_COMPONENTS` + lazy import in App.tsx (copy the LearnView lazy pattern verbatim). In `AppShell.tsx`, read `const view = useAppStore((s) => s.view);` and wrap the entire instrument area (selector + collapse button + Piano/Fretboard block) in `{view !== 'drill' && (...)}`.

- [ ] **Step 2: `useDrillRunner.ts`** — the only stateful glue:

```ts
// Owns: current item lookup (bank memoized via generateDrillBank()), question phase
// ('answering' | 'feedback'), prompt-render timestamp for ms measurement,
// auto-advance timer (600 ms on correct; manual tap on wrong), session start/end calls.
// Exposes: { phase, item, asked, total, correctCount, answer(payload), advance(), endSession(), summary }
```

Grading lives here: for `choice` answers compare strings; (other formats arrive in Task 9 via a shared `gradeAnswer(item, payload)` util created now in `src/components/drill/grading.ts` — implement `choice` + scaffold the switch with exhaustive `never` so Task 9 extends it type-safely). Enharmonic near-miss for note-array formats: pitch-class multiset equality vs spelling mismatch (use `getPitchClass` + `parseNote`-style helper from core; `noteFromString` — check `src/core/` for an existing string→Note parser before writing one: `rg -n "function parseNote|noteFromString" src/core`).

- [ ] **Step 3: Components.**
- `QuestionCard`: prompt text via `t(item.promptKey, item.promptParams)`, big type (`text-xl`+), the input component below, progress `7/24` + ✕ end + ⚙ in a slim header row. Follow Learn's `ExercisePrompt.tsx` for styling idiom (read it first).
- `ChoiceChips`: chips grid (2 columns on phones), ≥ 44 pt targets, one tap → `onAnswer(choice)`; disabled during feedback; correct chip gets success styling, wrong tap marks tapped chip + highlights correct. ARIA: `role="group"` + buttons, follow `ChoiceInput.tsx` conventions.
- `FeedbackStrip`: ✓/✗ + answer line + why-line (`t(item.whyKey, item.whyParams)`) + (wrong only) "Continue" affordance; `aria-live="polite"`; reduced-motion safe.
- `DrillView`: if `activeSession` → runner; else compose+start immediately on mount (zero-friction, spec §3.1); summary stub when finished (full summary Task 11): show `correct/asked` + "New session" button.

- [ ] **Step 4: Tests.** RTL: DrillView auto-starts a session (mock store with seeded bank slice — use real bank, settings `{length: 12, families: only keysig/circle/degree}` for determinism); answering a choice question advances after feedback; wrong answer requires tap-to-continue; session reaches summary at `length`; ✕ ends early preserving state. ChoiceChips: tap fires once, double-tap doesn't double-grade (the input-latency pitfall from research — disable on first tap).

- [ ] **Step 5: Manual smoke** — `npm run dev`, switch to Drill tab, answer a few F1/F2/F4 questions at 375 px width in devtools. Verify thumb-sized chips, no horizontal scroll, feedback readable.

- [ ] **Step 6: Green + commit**

```bash
npx tsc -b --force && npx vitest run && npm run build
git add -A && git commit -m "feat(drill): Drill view, runner, and choice questions playable end-to-end" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 9: Remaining inputs — NoteChips, AccidentalSlots, RootQuality + enharmonic feedback

**Files:**
- Create: `src/components/drill/NoteChips.tsx`, `src/components/drill/AccidentalSlots.tsx`, `src/components/drill/RootQualityChips.tsx`
- Modify: `src/components/drill/grading.ts` (complete the switch), `src/components/drill/QuestionCard.tsx` (render by `input.format`), `src/components/drill/FeedbackStrip.tsx` (near-miss variant)
- Test: one test file per component + `grading.test.ts`

- [ ] **Step 1: grading.ts first, TDD.** Tests pin: `notes` grading is order-insensitive and spelling-exact (`['A','C#','F#']` ✓ for F♯m; `['A','Db','Gb']` → `{ correct: false, nearMiss: true }`); `accidentals` grading is order-sensitive; `rootQuality` exact match; near-miss only fires when pitch-class multisets match but spellings differ.

```ts
export type GradeResult = { correct: boolean; nearMiss: boolean };
export function gradeAnswer(item: DrillItem, payload: AnswerPayload): GradeResult { ... }
```

- [ ] **Step 2: Components, one at a time, each with tests:**
- `NoteChips`: chips from `input.chips` (display strings), multi-select up to `expectedCount`, auto-grades on reaching count; selected chips visibly toggled; a small "clear" text-button for fat-finger recovery before the final tap.
- `AccidentalSlots`: 7 slots labeled with `input.letters`; tap cycles ♮→♯→♭; one "Done" button grades (spec's single exception to zero-submit). Slots pre-filled natural. Render the resulting note name in the slot (`C♯`, not just `♯`).
- `RootQualityChips`: stage 1 root chips, stage 2 quality chips (labels via `CHORD_QUALITY_NAMES`), grades on quality tap; tapping a different root before quality re-selects root.
- [ ] **Step 3: FeedbackStrip near-miss variant** — distinct styling + `drill.feedback.nearMiss` template ("Same sound, wrong spelling — here it must be {{expected}} because the {{reason}}"). Reason param supplied by grading from item family (key-signature membership for scales/keys; chord stacking for triads/sevenths; letter distance for intervals).
- [ ] **Step 4: Green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): note-chip, accidental-slot, and root-quality inputs with enharmonic near-miss feedback" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 10: Feedback audio + Learn deep-links

**Files:**
- Create: `src/data/drillFamilyToModule.ts`
- Modify: `src/components/drill/FeedbackStrip.tsx`, `src/components/drill/useDrillRunner.ts`
- Test: `src/data/drillFamilyToModule.test.ts`

- [ ] **Step 1: Audio on reveal.** On feedback phase, if `settings.sound`: play the answer — chord families arpeggiate the answer notes quickly via the core audio path used by `CurrentChordPanel` (read it; reuse its play helper or pattern — sampled piano with synth fallback, octave 4); interval items play both notes; scale items play the first 5 notes; choice-only concept items play nothing. Never block grading/advance on audio.
- [ ] **Step 2: Deep links.** `drillFamilyToModule.ts`: static `Record<DrillFamily, string>` mapping each family to the most relevant module id. Pick ids by reading `src/data/moduleIndex.ts` (search titles: key signatures → the L2 key-signature module; circle → same; scale → L2 minor-scales or L1 major-scale; degree → L2 scale-degrees; interval → L1 intervals; triad → L2 triad-types; seventh → L3 seventh-chords; roman → L2 diatonic-harmony; function → L3 cadences). Test asserts every mapped id exists in `moduleIndex`. FeedbackStrip (wrong answers only) renders a "Learn about this →" link that calls the same navigation the Learn breadcrumb/"Learn about this" buttons use (`rg -n "qualityToModule" src/components` and copy the navigation call).
- [ ] **Step 3: Green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): answer audio on reveal and learn-more deep links" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 11: Session summary, mastery map, settings, sprint

**Files:**
- Create: `src/components/drill/SessionSummary.tsx`, `src/components/drill/MasteryMap.tsx`, `src/components/drill/DrillSettings.tsx`, `src/components/drill/SprintRunner.tsx`
- Modify: `src/views/DrillView.tsx` (sub-screen switching)
- Test: `MasteryMap.test.tsx`, `SprintRunner.test.tsx`, extend `DrillView.test.tsx`

- [ ] **Step 1: SessionSummary** — correct/asked, per-family breakdown of this session, tier-change callouts ("2 facts now by heart"), buttons: New session / Mastery map / Sprint. No confetti (spec: reduced-motion parity; drill stays calm).
- [ ] **Step 2: MasteryMap** — per family: stacked horizontal bar (new/learning/review/byHeart counts from store vs bank totals), due-today count on top, tap row toggles family enabled (writes settings). Pure presentational + one selector computing the aggregates (test the selector with seeded states).
- [ ] **Step 3: DrillSettings** — length (12/24/40 segmented), new-per-session stepper 0–8, family toggles (shared state with MasteryMap), sound switch, show-timer switch. Plain controls, follow existing app form idiom (`rg -n "segmented|toggle" src/components` for prior art).
- [ ] **Step 4: SprintRunner** — 60 s countdown (visible — sprint is the opt-in timed mode), items only from tiers review/byHeart of enabled families (shuffle, recycle if exhausted), choice-format only is fine when the sampled item is constructed-input? No — sprint uses the SAME input components; speed comes from the user. On finish: score + personal best for the current families-signature (`recordSprint`). Sprint answers do NOT call `recordAnswer` (spec §3.7) — they bypass the scheduler entirely. Test: timer end stops input; bests update only on improvement; store items untouched after a sprint (deep-equal before/after).
- [ ] **Step 5: Green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): session summary, mastery map, settings, and 60s sprint" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 12: Boot query param, last-view restore, PWA shortcut

**Files:**
- Modify: `src/state/slices/preferencesSlice.ts` (+ `src/state/storeTypes.ts`), `src/state/store.ts` (persist version 5 → 6 + migrate), `src/App.tsx` (boot logic), `vite.config.ts` (manifest shortcuts)
- Test: extend `src/state/store.test.ts` (or the existing store test file — find it) for the migration; extend `DrillView.test.tsx` for boot param

- [ ] **Step 1: lastView in preferences.** Add `lastView: ViewMode` (default `'explore'`) to the preferences slice; `setView` (navigationSlice) also writes `lastView` (cross-slice set — follow how existing cross-slice actions do it, `rg -n "get\(\)\." src/state/slices`). Bump main-store persist `version: 6` with a migrate that injects `lastView: 'explore'` when absent (copy the v4→v5 migrate branch style in `store.ts:77`).
- [ ] **Step 2: Boot order in App.tsx:** on mount — `const param = new URLSearchParams(window.location.search).get('view')`; if param is a valid ViewMode → `setView(param)`; else `setView(lastView)`. Strip the param from the URL after applying (`history.replaceState`) so refreshes don't re-force it.
- [ ] **Step 3: Manifest shortcuts** in `vite.config.ts`:

```ts
shortcuts: [{
  name: 'Start Drill', short_name: 'Drill', url: '/?view=drill',
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
}],
```

Remember the repo gotcha: manifest changes alone don't reach installed PWAs without a content change — this branch changes plenty of content, so the SW will update; no extra action needed.
- [ ] **Step 4: Tests + green + commit**

```bash
npx tsc -b --force && npx vitest run && npm run build
git add -A && git commit -m "feat(drill): boot view param, last-view restore (persist v6), PWA drill shortcut" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 13: i18n — full drill namespace EN + PT + ES + parity test

**Files:**
- Modify: `src/i18n/locales/en.json`, `pt.json`, `es.json`
- Test: `src/i18n/drillKeysParity.test.ts`

- [ ] **Step 1: Parity test first**: imports `DRILL_PROMPT_KEYS` / `DRILL_WHY_KEYS` from drillBank (exported in Task 4) plus a static list of UI keys; asserts every key resolves in all three locales (i18next `exists`) and that `{{param}}` token sets match across languages (reuse the approach of `templateParity.test.ts` — read it first).

- [ ] **Step 2: EN keys.** Full set (UI + prompts + whys). UI: `nav.drill: "Drill"` (done in Task 8), `drill.progress`, `drill.endSession`, `drill.settings.*` (8 keys), `drill.summary.*` (6), `drill.mastery.*` (7 incl. tier names `new/learning/review/byHeart` → "New / Learning / Review / By heart"), `drill.sprint.*` (5), `drill.feedback.correct`, `drill.feedback.wrong`, `drill.feedback.nearMiss`, `drill.feedback.learnMore`, `drill.feedback.continue`.
Prompts (one per direction):

```json
"prompts": {
  "keyToCount": "How many sharps or flats does {{key}} have?",
  "keyToAcc": "Which accidentals does {{key}} have?",
  "sigToKeyMajor": "Which MAJOR key has {{sig}}?",
  "sigToKeyMinor": "Which MINOR key has {{sig}}?",
  "relMinor": "What is the relative minor of {{key}}?",
  "relMajor": "What is the relative major of {{key}}?",
  "nextSharp": "In key signatures, which sharp is added after {{acc}}?",
  "nextFlat": "In key signatures, which flat is added after {{acc}}?",
  "fifthUp": "A perfect fifth UP from {{note}}?",
  "fifthDown": "A perfect fifth DOWN from {{note}}?",
  "numToName": "Scale degree {{num}} is called…?",
  "nameToNum": "The {{name}} is which scale degree?",
  "pairToName": "{{lower}} up to {{upper}} is which interval?",
  "noteAbove": "A {{interval}} above {{root}}?",
  "letterThird": "A third above {{letter}} (letter only)?",
  "semitonesToName": "{{n}} semitones is which interval?",
  "spellChord": "Spell {{chord}}",
  "nameChord": "{{notes}} — which chord is this?",
  "spellScale": "Spell the {{scale}} scale",
  "degreeOf": "What is degree {{num}} of {{key}}?",
  "degreeToChord": "What is {{numeral}} in {{key}}?",
  "chordToDegree": "In {{key}}, {{chord}} is which degree?",
  "pattern": "In any {{mode}} key, the triad on degree {{num}} is…?",
  "isDiatonic": "Is {{chord}} diatonic in {{key}}?",
  "harmonicFact": "In minor keys with the raised 7th, the chord on degree {{num}} is…?",
  "chordFunction": "In {{key}}, {{chord}} functions as…?",
  "cadence": "{{pair}} at a phrase end is which cadence?",
  "v7Of": "What is the V7 of {{key}}?"
}
```

Whys: `lastSharp` ("The last sharp is the leading tone — a half step below the tonic. {{key}}: {{answer}}."), `penultimateFlat` ("The second-to-last flat names the key. {{key}}: {{answer}}."), `keyToCount` (order recitation), `circleOrder`, `degreeName`, `intervalLetterFirst` ("Count letters first ({{letters}}), then set the quality by half steps — {{answer}}."), `semitoneFact` ("A recognition fact: {{n}} semitones ↔ {{answer}}. Never spell by counting semitones — letters first."), `triadStack` ("{{chord}} stacks {{stack}} from the root: {{notes}}."), `seventhLadder`, `scaleKeySig` ("{{scale}} uses its key signature: {{accs}}."), `harmonicRaise`, `romanPattern`, `diatonicMember`, `functionPull` ("{{chord}} contains the {{degrees}} — it pulls {{direction}}."), `cadenceDef` (each cadence one-liner + UK name), `v7Derivation` ("Degree 5 of {{key}} is {{five}}; its dominant seventh is {{answer}}."), `nearMissSpelling`.

- [ ] **Step 3: PT + ES mirrors.** Translate every key (European Portuguese for PT — Nuno is Portuguese; es neutral). Music nomenclature untranslated: note names, interval labels (Major 3rd), chord symbols, quality names in answers, numerals, cadence proper names keep English; the sentence around them translates. Example PT: `"keyToCount": "Quantos sustenidos ou bemóis tem {{key}}?"`, `"spellChord": "Soletra {{chord}}"`, `"cadence": "{{pair}} no fim de frase é que cadência?"`. (Sustenidos/bemóis are the conventional PT words — acceptable as connective vocabulary, matching existing locale style; check `pt.json`'s existing tone and diacritics style and match it.)

- [ ] **Step 4: Green + commit**

```bash
npx tsc -b --force && npx vitest run
git add -A && git commit -m "feat(drill): full EN/PT/ES drill strings with key-parity test" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 14: Gates, a11y/manual pass, docs, PR

**Files:**
- Modify: `CLAUDE.md` (Current State + architecture mentions of the drill layer)
- No other code changes expected

- [ ] **Step 1: Full gate run**

```bash
npx tsc -b --force && npx vitest run && npm run lint && npm run build && npm run audit:all
```
Expected: typecheck clean; ALL tests pass (≈2,254 baseline + new drill suites); eslint 0/0; build OK with `drill`-related chunks lazy-split (inspect `dist/assets` listing — DrillView and ts-fsrs must NOT be in the entry chunk); audits at steady state.

- [ ] **Step 2: Manual accessibility + phone pass** (devtools, 375×667 + 320 px): every chip ≥ 44 pt; tab order sane; feedback `aria-live` announces; reduced-motion shows no animations; both themes contrast-pass (spot-check chips and feedback states in fermata-night).

- [ ] **Step 3: Acceptance criteria sweep** — walk spec §6 items 1–8 explicitly; fix anything failing before the PR.

- [ ] **Step 4: CLAUDE.md** — add Drill to the views list + one architecture paragraph (bank generated from core, FSRS scheduler, `fermata-drill-v1` store, no curriculum coupling), and remove the now-stale "two views" phrasing.

- [ ] **Step 5: Push + PR**

```bash
git push -u origin ws9-drill-mode
gh pr create --title "WS9: Drill mode — phone-first spaced-retrieval fundamentals trainer" --body "$(cat <<'EOF'
## Summary
- New top-level Drill view: zero-friction micro-sessions (12/24/40 questions) drilling key signatures, circle of fifths, scales, degrees, intervals, triad+seventh spelling both directions, Roman numerals, cadences/function
- ~1,000-item bank generated from src/core (no authored content), FSRS scheduling (ts-fsrs), by-heart mastery = correct + <3s across 3 sessions, enharmonic near-miss feedback, optional 60s sprint
- New persisted store fermata-drill-v1 (legacy keys untouched), last-view restore (persist v6), PWA "Start Drill" shortcut, full EN/PT/ES

## Spec & plan
docs/superpowers/specs/2026-06-10-fermata-drill-mode-design.md
docs/superpowers/plans/2026-06-10-ws9-drill-mode.md

## Test plan
- [ ] All gates green (tsc --force, vitest, lint, build, audits)
- [ ] Nuno: try the Vercel preview on iPhone — drill feel, chip sizes, feedback pacing, PT strings

Production untouched until approved.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR opens against main with a Vercel preview deployment. **Do not merge** — Nuno judges the preview on his phone first (perceptual gate, repo convention).
