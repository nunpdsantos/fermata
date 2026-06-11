/**
 * WS14 Part C — chord build → identify round-trip integrity.
 *
 * Three standing properties that catch engine/parser drift permanently:
 *
 *  Property 1 (build → identify): for every ChordQuality on a representative set
 *    of roots, buildChord(root, q) → identifyChordFromNotes(notes) returns the
 *    SAME chord as the #1 same-root match — or, for the documented identical-
 *    pitch-class twins, a member of the chord's equivalence class. Every
 *    known-ambiguous class is enumerated below; none is silently skipped.
 *
 *  Property 2 (parse → build → spelling): a curated professional notation set
 *    parses and builds to the engine's exact canonical spelling.
 *
 *  Property 3 (symbol → quality): parseChordSymbol(CHORD_SYMBOLS[q] on a root)
 *    re-derives quality q for every q (with the single documented symbol-collapse
 *    exception). This is the permanent symbol/parser-drift guard.
 *
 * "identify" is a PITCH-CLASS matcher: two chords with identical pitch-class
 * content are indistinguishable to it. Those collisions are real music theory,
 * not bugs — they are listed as equivalence classes, and the assertion checks
 * membership in the class rather than exact identity.
 */
import { describe, it, expect } from 'vitest';
import { parseChordSymbol, chordFromParsed } from '../chordParser';
import { buildChord, CHORD_FORMULAS, CHORD_SYMBOLS } from '../../constants/chords';
import { identifyChordFromNotes } from '../reverseChordParser';
import { getPitchClass } from '../../constants/notes';
import { noteToString, type ChordQuality, type Note } from '../../types/music';

// ── Representative roots: all 12 pitch classes, both common spellings where the
//    enharmonic dual is real (C#/Db, D#/Eb, F#/Gb, G#/Ab, A#/Bb). ─────────────
const ROOTS: Note[] = [
  { natural: 'C', accidental: '' },
  { natural: 'C', accidental: '#' },
  { natural: 'D', accidental: 'b' },
  { natural: 'D', accidental: '' },
  { natural: 'D', accidental: '#' },
  { natural: 'E', accidental: 'b' },
  { natural: 'E', accidental: '' },
  { natural: 'F', accidental: '' },
  { natural: 'F', accidental: '#' },
  { natural: 'G', accidental: 'b' },
  { natural: 'G', accidental: '' },
  { natural: 'G', accidental: '#' },
  { natural: 'A', accidental: 'b' },
  { natural: 'A', accidental: '' },
  { natural: 'A', accidental: '#' },
  { natural: 'B', accidental: 'b' },
  { natural: 'B', accidental: '' },
];

const ALL_QUALITIES = Object.keys(CHORD_FORMULAS) as ChordQuality[];

/**
 * Documented equivalence classes for the reverse identifier.
 *
 * The identifier scores against the mod-12 pitch-class sets of CHORD_FORMULAS.
 * When two qualities have IDENTICAL pitch-class content, the one defined first
 * (and/or with the shorter formula) wins the sort, so the source quality can
 * legitimately land at rank 2 with the SAME exact score. These are the ONLY
 * qualities (verified across all 17 roots) where the source is not the literal
 * #1 same-root match. Each maps source → the set of qualities it is pc-identical
 * to; the assertion accepts any of them at the top, same root, exact confidence.
 */
const SAME_ROOT_EQUIVALENCE: Partial<Record<ChordQuality, ChordQuality[]>> = {
  // [0,4,8,10] — augmented7 and dominant7sharp5 are the SAME four notes.
  dominant7sharp5: ['dominant7sharp5', 'augmented7'],
  // {0,2,5,7,10} — 9sus4 (R,4,5,b7,9) and dom11 (R,5,b7,9,11) reduce identically
  // (the 11th IS the 4th). Indistinguishable by pitch class.
  dominant9sus4: ['dominant9sus4', 'dominant11'],
};

/**
 * Cross-root enharmonic equivalences worth recording (NOT needed for the
 * same-root assertion, but documented so the tritone-sub tie is not a surprise):
 *   - dominant7sharp11 (C E G Bb F#) ties at score 100 with F# dominant7flat5flat9
 *     — the classic tritone substitution. The C-rooted source is still #1.
 */

describe('WS14 Part C — Property 1: buildChord → identify round-trips for every quality', () => {
  for (const q of ALL_QUALITIES) {
    const accepted = SAME_ROOT_EQUIVALENCE[q] ?? [q];
    const isAmbiguous = accepted.length > 1;
    const label = isAmbiguous ? `${q} (ambiguous: ${accepted.join(' / ')})` : q;

    it.each(ROOTS)(`${label} on $natural$accidental round-trips`, (root) => {
      const chord = buildChord(root, q);
      const { results } = identifyChordFromNotes(chord.notes);
      expect(results.length, `${q} on ${noteToString(root)} produced no identification`).toBeGreaterThan(0);

      const rootPc = getPitchClass(root);
      const top = results[0];

      if (!isAmbiguous) {
        // The literal #1 result must be this quality on this root, high confidence.
        expect(top.chord.quality, `${q} on ${noteToString(root)}: top=${top.chord.quality}`).toBe(q);
        expect(getPitchClass(top.chord.root)).toBe(rootPc);
        expect(['exact', 'likely']).toContain(top.confidence);
      } else {
        // The #1 same-root result must be SOME member of the equivalence class,
        // and the source quality itself must appear among the same-root results.
        const sameRoot = results.filter((r) => getPitchClass(r.chord.root) === rootPc);
        const topSameRoot = sameRoot[0];
        expect(topSameRoot, `${q} on ${noteToString(root)}: no same-root result`).toBeDefined();
        expect(accepted, `${q} on ${noteToString(root)}: top same-root=${topSameRoot.chord.quality}`).toContain(
          topSameRoot.chord.quality,
        );
        // The source quality is genuinely present in the candidate set (not lost).
        expect(
          sameRoot.some((r) => r.chord.quality === q),
          `${q} on ${noteToString(root)}: source quality absent from same-root results`,
        ).toBe(true);
        // And the winning twin scores at exact/likely confidence.
        expect(['exact', 'likely']).toContain(topSameRoot.confidence);
      }
    });
  }

  it('exactly two qualities are documented-ambiguous (guards against silent new collisions)', () => {
    // If a future change makes another quality pc-collide, this count fails and
    // forces an explicit decision rather than a quiet papered-over skip.
    const ambiguousByScan = ALL_QUALITIES.filter((q) => {
      const chord = buildChord({ natural: 'C', accidental: '' }, q);
      const { results } = identifyChordFromNotes(chord.notes);
      const top = results[0];
      return !(top && top.chord.quality === q && getPitchClass(top.chord.root) === 0);
    });
    expect(ambiguousByScan.sort()).toEqual(['dominant7sharp5', 'dominant9sus4']);
  });
});

// ── Property 2: curated professional notations → exact canonical spelling ────
describe('WS14 Part C — Property 2: parse → build matches the engine canonical spelling', () => {
  // Each entry is [notation, expected canonical note spelling]. The spellings are
  // the engine's own output, verified by execution; they double as a theory check
  // (e.g. D7#9 spells the #9 as E#, Eaug spells the #5 as B#, Bdim7 the bb7 as Ab).
  const CURATED: Array<[string, string[]]> = [
    ['Cmaj7', ['C', 'E', 'G', 'B']],
    ['Dm7', ['D', 'F', 'A', 'C']],
    ['G7', ['G', 'B', 'D', 'F']],
    ['Am7b5', ['A', 'C', 'Eb', 'G']],
    ['Bdim7', ['B', 'D', 'F', 'Ab']],
    ['Fmaj9', ['F', 'A', 'C', 'E', 'G']],
    ['Ebmaj7', ['Eb', 'G', 'Bb', 'D']],
    ['Bb13', ['Bb', 'D', 'F', 'Ab', 'C', 'G']],
    ['A7b9', ['A', 'C#', 'E', 'G', 'Bb']],
    ['D7#9', ['D', 'F#', 'A', 'C', 'E#']],
    ['Gm9', ['G', 'Bb', 'D', 'F', 'A']],
    ['C6/9', ['C', 'E', 'G', 'A', 'D']],
    ['F#m7b5', ['F#', 'A', 'C', 'E']],
    ['Csus4', ['C', 'F', 'G']],
    ['G7sus4', ['G', 'C', 'D', 'F']],
    ['Amaj7#11', ['A', 'C#', 'E', 'G#', 'D#']],
    ['C7b13', ['C', 'E', 'G', 'Bb', 'Ab']], // WS14 — no 9, 5th retained
    ['C7#11', ['C', 'E', 'G', 'Bb', 'F#']], // WS14 — no 9
    ['Cmaj9#11', ['C', 'E', 'G', 'B', 'D', 'F#']], // WS14 — carries the 9
    ['Cm(maj7)', ['C', 'Eb', 'G', 'B']],
    ['Eaug', ['E', 'G#', 'B#']],
    ['Bbm6', ['Bb', 'Db', 'F', 'G']],
    ['Dbmaj7', ['Db', 'F', 'Ab', 'C']],
    ['F7#5', ['F', 'A', 'C#', 'Eb']],
    ['Cdim', ['C', 'Eb', 'Gb']],
    ['G7alt', ['G', 'B', 'F', 'Ab', 'A#', 'C#', 'Eb']],
    ['Am9', ['A', 'C', 'E', 'G', 'B']],
    ['Fmaj13', ['F', 'A', 'C', 'E', 'G', 'D']],
    ['C9sus4', ['C', 'F', 'G', 'Bb', 'D']],
    ['Ddim(maj7)', ['D', 'F', 'Ab', 'C#']],
  ];

  it.each(CURATED)('%s builds the canonical spelling', (notation, expected) => {
    const parsed = parseChordSymbol(notation);
    expect(parsed, `"${notation}" should parse`).not.toBeNull();
    const chord = chordFromParsed(parsed!);
    expect(chord.notes.map(noteToString)).toEqual(expected);
  });

  it.each(CURATED)('%s pitch classes equal root + formula (spelling-independent check)', (notation) => {
    const parsed = parseChordSymbol(notation)!;
    const chord = chordFromParsed(parsed);
    // Independent of letter spelling: the pitch-class SET must match the source
    // quality's formula applied to the parsed root.
    const rootPc = getPitchClass(parsed.root);
    const formula = parsed.algorithmicNotes
      ? null // algorithmic path: skip formula comparison (notes already asserted above)
      : CHORD_FORMULAS[parsed.quality];
    if (formula) {
      const want = new Set(formula.map((st) => (rootPc + st) % 12));
      const got = new Set(chord.notes.map(getPitchClass));
      expect(got).toEqual(want);
    }
  });
});

// ── Property 3: every canonical symbol re-parses to its quality ──────────────
describe('WS14 Part C — Property 3: CHORD_SYMBOLS[q] round-trips to quality q', () => {
  // The one documented collapse: '7#5' (dominant7sharp5) → augmented7 (identical
  // notes [0,4,8,10]); dominant7sharp5 is reached via 'C7+'. Encoded explicitly so
  // a NEW accidental collapse can never hide here.
  const SYMBOL_COLLAPSES: Partial<Record<ChordQuality, ChordQuality>> = {
    dominant7sharp5: 'augmented7',
  };

  // Roots chosen to exercise natural, sharp and flat spellings of the symbol path.
  const SYMBOL_ROOTS = ['C', 'F#', 'Bb', 'G', 'Eb', 'A'];

  for (const rootStr of SYMBOL_ROOTS) {
    it.each(ALL_QUALITIES)(`${rootStr} + symbol of %s re-parses to that quality`, (q) => {
      const input = rootStr + CHORD_SYMBOLS[q];
      const parsed = parseChordSymbol(input);
      expect(parsed, `"${input}" should parse`).not.toBeNull();
      expect(parsed!.quality, `"${input}"`).toBe(SYMBOL_COLLAPSES[q] ?? q);
    });
  }

  it('every quality (except the documented collapse) is reachable by its own symbol', () => {
    const reached = new Set<ChordQuality>();
    for (const q of ALL_QUALITIES) {
      const parsed = parseChordSymbol('C' + CHORD_SYMBOLS[q]);
      if (parsed) reached.add(parsed.quality);
    }
    // 49 of 50 land on themselves; dominant7sharp5 collapses to augmented7, so its
    // own symbol never yields it — that is the single documented exception.
    for (const q of ALL_QUALITIES) {
      if (q === 'dominant7sharp5') continue;
      expect(reached.has(q), `${q} not reachable by its canonical symbol`).toBe(true);
    }
  });
});
