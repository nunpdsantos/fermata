# WS13 — Chord Search Audit

**Goal:** make Fermata's chord search behave like a professional, complete chord-search
engine — ANY of the engine's 47 chord qualities findable from ANY standard notation,
including partial hints, symbols, accidented/cased roots, slash chords, and verbal forms;
and crucially, garbage must **not** silently become a chord.

**Honesty rule (followed):** every cell in the matrix below was produced by **executing
the real parser** (`src/core/utils/parseChordSymbol`), never by reading the code and
assuming. The generator script lives at `/tmp/iowa-slice/chord-audit/audit.ts` (scratch,
not committed); its assertions are mirrored as a permanent regression wall in
`src/core/utils/__tests__/chordSearchMatrix.test.ts`.

---

## Headline numbers

| | Notations tested | Passed | Failed |
|---|---|---|---|
| **Before fixes** (Phase 1, finalized matrix) | 249 | 241 | **8** |
| **After fixes** (Phase 2) | 249 | **249** | 0 |

The 8 pre-fix failures broke into:

- **3 positive (real parser bugs):**
  - `CM6` → `minor6` (should be **major6**) — capital `M` (major) collapsed into the
    lowercased `m6` (minor) branch. Dangerous: a major-6 chord silently became minor.
  - `C-Δ7` → `major7` (should be **minor_major7**) — the `-` (minor) + `Δ7` (major-7)
    combination was unhandled; only the `-M7` ASCII spelling worked, not the `Δ` glyph.
  - `Cj7` → `dominant7` (should be **major7**) — the jazz/iReal-Pro `j` shorthand for the
    major-7 family (`j` = `△`) was unrecognized; the `j` was discarded and the bare `7`
    became a dominant 7.
- **5 negative (false positives — garbage that wrongly parsed):**
  - `C0` → `major`, `Cx` → `major`, `Cblah` → **Cb major** (!), `Cmaj77` → `major7`,
    `C7b` → `dominant7`. Root cause: the algorithmic fallback builder is deliberately
    lenient — it extracts whatever tokens it recognizes and **silently discards the
    rest** — so any junk after a valid root coerced to a chord.

After Phase 2 all 249 cases pass, every negative rejects, and all 30 legitimately-complex
chords that only the algorithmic path handles (e.g. `Cmaj7#11`, `G7b9#11`, `Dm9b5`,
`C7#9b13`) **still parse** — the garbage gate does not over-reject.

---

## Architecture note (why garbage was parsing)

Chord parsing is two-stage:

1. `parseQualityString` — an **exact-match allowlist** of ~150 professional notations →
   `ChordQuality`. This stage can never accept garbage (no match ⇒ falls through).
2. **Algorithmic fallback** (`algorithmicChordBuilder.parseChordSymbol`) — for
   legitimately-complex chords the allowlist doesn't enumerate. It is lenient by design:
   it greedily consumes recognized tokens and ignores leftovers, so `Cblah` → `Cb` +
   "lah" (ignored) → Cb major.

The fix keeps the algorithmic builder untouched (it is also used by `queryExecutor` and
must keep building exotic chords) and instead adds a **well-formedness gate in
`chordParser` before the fallback is trusted**: `isWellFormedQuality()` runs a positive
chord-token grammar over the (word-normalized, symbol-form) quality string. If the quality
isn't a clean sequence of recognized chord tokens, the parser returns `null` instead of
coercing. The grammar was tuned to accept every complex chord the builder handles while
rejecting letter-garbage, stray/duplicated bad digits (`0`, `123`, `55`, `25`), and
dangling accidentals (`7b`).

---

## Phase 2 — parser fixes applied (commit 1)

All in `src/core/utils/chordParser.ts`:

1. **`M6` → major6** in the case-sensitive (pre-lowercase) block, so capital-M major-6
   never falls into the `m6` minor branch.
2. **Δ-glyph minor/aug/dim-major-7 spellings** added to the case-sensitive block:
   `mΔ7`/`-Δ7`/`minΔ7` → minor_major7; `+Δ7`/`augΔ7`/`augM7` → augmented_major7;
   `dimΔ7`/`°M7`/`oM7` → diminished_major7; plus `Δ7b5` → major7flat5 and `Δ7(#11)` →
   major7sharp11.
3. **Jazz `j` shorthand**: `j`/`j7` → major7, `j9` → major9, `j11` → major11, `j13` →
   major13 (unambiguous — no quality token starts with a bare `j`).
4. **`isWellFormedQuality()` garbage gate** before the algorithmic fallback (see above).

---

## Deliberate exclusions (NOT supported, by design)

| Input | Why excluded |
|---|---|
| `C0` (zero) | Zero is **not** a half-diminished symbol. The owner explicitly flagged this as ambiguous — `ø`/`m7b5`/`halfdim` are the half-diminished spellings. `C0` is rejected. |
| `H7`, `H`, `Hm` | German note-name **H** (= B natural) is not supported. Fermata uses Anglo-American `A–G` only. Rejected. |
| `Cx`, `Cblah`, `Czzz`, `C123`, `Cqwerty`, `Cmaj7xyz`, `Ch` | Letter/digit garbage. Rejected by the well-formedness gate. |
| `Cmaj77`, `C55`, `C25` | Malformed / duplicated degree digits. Rejected. |
| `C7b`, `C7#` (dangling accidental) | An accidental with no degree after it is incomplete. Rejected. |
| Full spelled-out verbal (`C sharp minor seven`, `C major seven`, `F sharp diminished seventh`, `G dominant`) | These are the **QuickSearch hint-layer's** job (Phase 3), not the deterministic symbol parser's. The parser returns `null`; Phase 3 resolves them. |
| `C(#5)` as a bare augmented marker | Non-standard. Players write `C+` / `Caug`. Not added. |
| `CmajM7`, `Cmaj9#11` round-tripping to a *named* quality | See engine limitations below. |

---

## Engine limitations (correct **notes**, approximate **quality label**)

These parse and play the right notes via the algorithmic path, but the engine has no
dedicated `ChordQuality` enum value for them, so the mapped label is the nearest fit. This
is an **engine taxonomy gap, not a parser gap** — and per the task, no new qualities were
bolted onto the engine.

| Input | Notes built | Mapped quality | Note |
|---|---|---|---|
| `Cmaj9#11` | C E G B D F♯ | `major11` | No `major9sharp11` quality; `major7sharp11` lacks the 9th, `major11` has a natural 11. Notes are correct; label is approximate. |
| `C7b13` | C E G B♭ A♭ | (algorithmic) | No `dominant7flat13` quality; built algorithmically with correct notes. |
| `C7#11` (no 9) | C E G B♭ F♯ | (algorithmic) | No plain `dominant7sharp11`; the named quality is `dominant9sharp11`. Notes correct. |

`dominant7sharp5` is reachable but only via the trailing-`+` path (`C7+`); bare `C7#5`
resolves to `augmented7` — **identical notes** (`[0,4,8,10]`), so this is a labeling
choice, not a gap.

---

## The executed matrix

Legend: **Want** = expected quality, **Got** = what the live parser returned, ✅ = match.
Roots use `C` canonically; accidented/cased/unicode roots and slash chords have their own
sections. Negatives must return `NULL`.

#### major
| Notation | Want | Got | |
|---|---|---|---|
| `C` | major | major | ✅ |
| `CM` | major | major | ✅ |
| `Cmaj` | major | major | ✅ |
| `Cmajor` | major | major | ✅ |
| `C major` | major | major | ✅ |
| `Cmaj/E` | major | major | ✅ |
| `C/E` | major | major | ✅ |
| `C/G` | major | major | ✅ |

#### minor
| Notation | Want | Got | |
|---|---|---|---|
| `Cm` | minor | minor | ✅ |
| `Cmin` | minor | minor | ✅ |
| `Cminor` | minor | minor | ✅ |
| `C-` | minor | minor | ✅ |
| `Cmi` | minor | minor | ✅ |
| `C minor` | minor | minor | ✅ |
| `Cminor` | minor | minor | ✅ |
| `Cm/Eb` | minor | minor | ✅ |
| `c` | major | major | ✅ |

#### diminished
| Notation | Want | Got | |
|---|---|---|---|
| `Cdim` | diminished | diminished | ✅ |
| `C°` | diminished | diminished | ✅ |
| `Co` | diminished | diminished | ✅ |
| `Cdiminished` | diminished | diminished | ✅ |
| `C dim` | diminished | diminished | ✅ |

#### augmented
| Notation | Want | Got | |
|---|---|---|---|
| `Caug` | augmented | augmented | ✅ |
| `C+` | augmented | augmented | ✅ |
| `Caugmented` | augmented | augmented | ✅ |
| `C aug` | augmented | augmented | ✅ |

#### major6
| Notation | Want | Got | |
|---|---|---|---|
| `C6` | major6 | major6 | ✅ |
| `Cmaj6` | major6 | major6 | ✅ |
| `Cmajor6` | major6 | major6 | ✅ |
| `CM6` | major6 | major6 | ✅ |
| `C6/E` | major6 | major6 | ✅ |

#### minor6
| Notation | Want | Got | |
|---|---|---|---|
| `Cm6` | minor6 | minor6 | ✅ |
| `Cmin6` | minor6 | minor6 | ✅ |
| `Cminor6` | minor6 | minor6 | ✅ |
| `C-6` | minor6 | minor6 | ✅ |
| `Cmi6` | minor6 | minor6 | ✅ |

#### major7
| Notation | Want | Got | |
|---|---|---|---|
| `Cmaj7` | major7 | major7 | ✅ |
| `CM7` | major7 | major7 | ✅ |
| `CΔ` | major7 | major7 | ✅ |
| `CΔ7` | major7 | major7 | ✅ |
| `Cma7` | major7 | major7 | ✅ |
| `Cmajor7` | major7 | major7 | ✅ |
| `Cmaj` | major | major | ✅ |
| `C major 7` | major7 | major7 | ✅ |
| `C maj7` | major7 | major7 | ✅ |
| `Cmaj7/G` | major7 | major7 | ✅ |
| `Cj7` | major7 | major7 | ✅ |
| `Cma7` | major7 | major7 | ✅ |

#### minor7
| Notation | Want | Got | |
|---|---|---|---|
| `Cm7` | minor7 | minor7 | ✅ |
| `Cmin7` | minor7 | minor7 | ✅ |
| `Cminor7` | minor7 | minor7 | ✅ |
| `C-7` | minor7 | minor7 | ✅ |
| `Cmi7` | minor7 | minor7 | ✅ |
| `Cmin7/Bb` | minor7 | minor7 | ✅ |
| `C minor 7` | minor7 | minor7 | ✅ |

#### dominant7
| Notation | Want | Got | |
|---|---|---|---|
| `C7` | dominant7 | dominant7 | ✅ |
| `Cdom7` | dominant7 | dominant7 | ✅ |
| `Cdominant7` | dominant7 | dominant7 | ✅ |
| `C7/E` | dominant7 | dominant7 | ✅ |
| `C dominant 7` | dominant7 | dominant7 | ✅ |
| `C dom7` | dominant7 | dominant7 | ✅ |

#### diminished7
| Notation | Want | Got | |
|---|---|---|---|
| `Cdim7` | diminished7 | diminished7 | ✅ |
| `C°7` | diminished7 | diminished7 | ✅ |
| `Co7` | diminished7 | diminished7 | ✅ |
| `Cdiminished7` | diminished7 | diminished7 | ✅ |
| `Cdim7/Eb` | diminished7 | diminished7 | ✅ |

#### half_diminished7
| Notation | Want | Got | |
|---|---|---|---|
| `Cm7b5` | half_diminished7 | half_diminished7 | ✅ |
| `Cm7♭5` | half_diminished7 | half_diminished7 | ✅ |
| `Cø` | half_diminished7 | half_diminished7 | ✅ |
| `Cø7` | half_diminished7 | half_diminished7 | ✅ |
| `Cmin7b5` | half_diminished7 | half_diminished7 | ✅ |
| `C-7b5` | half_diminished7 | half_diminished7 | ✅ |
| `Chalfdim` | half_diminished7 | half_diminished7 | ✅ |
| `Chalfdim7` | half_diminished7 | half_diminished7 | ✅ |
| `C half diminished` | half_diminished7 | half_diminished7 | ✅ |
| `Cm7(b5)` | half_diminished7 | half_diminished7 | ✅ |
| `Cø7/Eb` | half_diminished7 | half_diminished7 | ✅ |

#### augmented7
| Notation | Want | Got | |
|---|---|---|---|
| `Caug7` | augmented7 | augmented7 | ✅ |
| `C+7` | augmented7 | augmented7 | ✅ |
| `C7#5` | augmented7 | augmented7 | ✅ |
| `C7+5` | augmented7 | augmented7 | ✅ |
| `Caugmented7` | augmented7 | augmented7 | ✅ |
| `C7+` | dominant7sharp5 | dominant7sharp5 | ✅ |

#### sus2
| Notation | Want | Got | |
|---|---|---|---|
| `Csus2` | sus2 | sus2 | ✅ |
| `Csus 2` | sus2 | sus2 | ✅ |
| `Csuspended2` | sus2 | sus2 | ✅ |

#### sus4
| Notation | Want | Got | |
|---|---|---|---|
| `Csus` | sus4 | sus4 | ✅ |
| `Csus4` | sus4 | sus4 | ✅ |
| `Csus 4` | sus4 | sus4 | ✅ |
| `Csuspended4` | sus4 | sus4 | ✅ |

#### add9
| Notation | Want | Got | |
|---|---|---|---|
| `Cadd9` | add9 | add9 | ✅ |
| `C(add9)` | add9 | add9 | ✅ |
| `Cadd2` | add9 | add9 | ✅ |
| `Cadd 9` | add9 | add9 | ✅ |
| `Cadded9` | add9 | add9 | ✅ |

#### minor_major7
| Notation | Want | Got | |
|---|---|---|---|
| `CmMaj7` | minor_major7 | minor_major7 | ✅ |
| `Cm(maj7)` | minor_major7 | minor_major7 | ✅ |
| `C-Δ7` | minor_major7 | minor_major7 | ✅ |
| `CmM7` | minor_major7 | minor_major7 | ✅ |
| `Cminmaj7` | minor_major7 | minor_major7 | ✅ |
| `C-maj7` | minor_major7 | minor_major7 | ✅ |
| `Cmin(maj7)` | minor_major7 | minor_major7 | ✅ |
| `Cm/maj7` | minor_major7 | minor_major7 | ✅ |
| `CminMaj7` | minor_major7 | minor_major7 | ✅ |
| `C-M7` | minor_major7 | minor_major7 | ✅ |

#### power
| Notation | Want | Got | |
|---|---|---|---|
| `C5` | power | power | ✅ |
| `Cpower` | power | power | ✅ |
| `Cpowerchord` | power | power | ✅ |

#### dominant7sus4
| Notation | Want | Got | |
|---|---|---|---|
| `C7sus4` | dominant7sus4 | dominant7sus4 | ✅ |
| `C7sus` | dominant7sus4 | dominant7sus4 | ✅ |
| `Cdom7sus4` | dominant7sus4 | dominant7sus4 | ✅ |
| `C7sus 4` | dominant7sus4 | dominant7sus4 | ✅ |

#### major9
| Notation | Want | Got | |
|---|---|---|---|
| `Cmaj9` | major9 | major9 | ✅ |
| `CM9` | major9 | major9 | ✅ |
| `CΔ9` | major9 | major9 | ✅ |
| `Cmajor9` | major9 | major9 | ✅ |

#### minor9
| Notation | Want | Got | |
|---|---|---|---|
| `Cm9` | minor9 | minor9 | ✅ |
| `Cmin9` | minor9 | minor9 | ✅ |
| `C-9` | minor9 | minor9 | ✅ |
| `Cminor9` | minor9 | minor9 | ✅ |

#### dominant9
| Notation | Want | Got | |
|---|---|---|---|
| `C9` | dominant9 | dominant9 | ✅ |
| `Cdom9` | dominant9 | dominant9 | ✅ |
| `Cdominant9` | dominant9 | dominant9 | ✅ |

#### dominant7flat9
| Notation | Want | Got | |
|---|---|---|---|
| `C7b9` | dominant7flat9 | dominant7flat9 | ✅ |
| `C7(b9)` | dominant7flat9 | dominant7flat9 | ✅ |
| `C7♭9` | dominant7flat9 | dominant7flat9 | ✅ |
| `C7flat9` | dominant7flat9 | dominant7flat9 | ✅ |

#### dominant7sharp9
| Notation | Want | Got | |
|---|---|---|---|
| `C7#9` | dominant7sharp9 | dominant7sharp9 | ✅ |
| `C7(#9)` | dominant7sharp9 | dominant7sharp9 | ✅ |
| `C7♯9` | dominant7sharp9 | dominant7sharp9 | ✅ |
| `C7sharp9` | dominant7sharp9 | dominant7sharp9 | ✅ |

#### dominant7flat5
| Notation | Want | Got | |
|---|---|---|---|
| `C7b5` | dominant7flat5 | dominant7flat5 | ✅ |
| `C7(b5)` | dominant7flat5 | dominant7flat5 | ✅ |
| `C7♭5` | dominant7flat5 | dominant7flat5 | ✅ |

#### dominant7sharp5
| Notation | Want | Got | |
|---|---|---|---|
| `C7+` | dominant7sharp5 | dominant7sharp5 | ✅ |

#### dominant7alt
| Notation | Want | Got | |
|---|---|---|---|
| `C7alt` | dominant7alt | dominant7alt | ✅ |
| `Calt` | dominant7alt | dominant7alt | ✅ |
| `Calt7` | dominant7alt | dominant7alt | ✅ |
| `Caltered` | dominant7alt | dominant7alt | ✅ |

#### dominant11
| Notation | Want | Got | |
|---|---|---|---|
| `C11` | dominant11 | dominant11 | ✅ |
| `Cdom11` | dominant11 | dominant11 | ✅ |
| `Cdominant11` | dominant11 | dominant11 | ✅ |

#### major11
| Notation | Want | Got | |
|---|---|---|---|
| `Cmaj11` | major11 | major11 | ✅ |
| `CM11` | major11 | major11 | ✅ |
| `CΔ11` | major11 | major11 | ✅ |
| `Cmajor11` | major11 | major11 | ✅ |

#### minor11
| Notation | Want | Got | |
|---|---|---|---|
| `Cm11` | minor11 | minor11 | ✅ |
| `Cmin11` | minor11 | minor11 | ✅ |
| `C-11` | minor11 | minor11 | ✅ |

#### dominant9sharp11
| Notation | Want | Got | |
|---|---|---|---|
| `C9#11` | dominant9sharp11 | dominant9sharp11 | ✅ |
| `C9(#11)` | dominant9sharp11 | dominant9sharp11 | ✅ |
| `C9♯11` | dominant9sharp11 | dominant9sharp11 | ✅ |

#### dominant13
| Notation | Want | Got | |
|---|---|---|---|
| `C13` | dominant13 | dominant13 | ✅ |
| `Cdom13` | dominant13 | dominant13 | ✅ |
| `Cdominant13` | dominant13 | dominant13 | ✅ |

#### major13
| Notation | Want | Got | |
|---|---|---|---|
| `Cmaj13` | major13 | major13 | ✅ |
| `CM13` | major13 | major13 | ✅ |
| `CΔ13` | major13 | major13 | ✅ |

#### minor13
| Notation | Want | Got | |
|---|---|---|---|
| `Cm13` | minor13 | minor13 | ✅ |
| `Cmin13` | minor13 | minor13 | ✅ |
| `C-13` | minor13 | minor13 | ✅ |

#### dominant13flat9
| Notation | Want | Got | |
|---|---|---|---|
| `C13b9` | dominant13flat9 | dominant13flat9 | ✅ |
| `C13(b9)` | dominant13flat9 | dominant13flat9 | ✅ |
| `C13♭9` | dominant13flat9 | dominant13flat9 | ✅ |

#### add11
| Notation | Want | Got | |
|---|---|---|---|
| `Cadd11` | add11 | add11 | ✅ |
| `C(add11)` | add11 | add11 | ✅ |
| `Cadd 11` | add11 | add11 | ✅ |

#### six_nine
| Notation | Want | Got | |
|---|---|---|---|
| `C6/9` | six_nine | six_nine | ✅ |
| `C69` | six_nine | six_nine | ✅ |
| `C6add9` | six_nine | six_nine | ✅ |
| `Cmaj6/9` | six_nine | six_nine | ✅ |
| `C6/9/E` | six_nine | six_nine | ✅ |

#### minor_six_nine
| Notation | Want | Got | |
|---|---|---|---|
| `Cm6/9` | minor_six_nine | minor_six_nine | ✅ |
| `Cm69` | minor_six_nine | minor_six_nine | ✅ |
| `Cmin6/9` | minor_six_nine | minor_six_nine | ✅ |
| `Cm6add9` | minor_six_nine | minor_six_nine | ✅ |

#### dominant9sus4
| Notation | Want | Got | |
|---|---|---|---|
| `C9sus4` | dominant9sus4 | dominant9sus4 | ✅ |
| `C9sus` | dominant9sus4 | dominant9sus4 | ✅ |

#### sus2sus4
| Notation | Want | Got | |
|---|---|---|---|
| `Csus2sus4` | sus2sus4 | sus2sus4 | ✅ |
| `Csus24` | sus2sus4 | sus2sus4 | ✅ |
| `Csus2/4` | sus2sus4 | sus2sus4 | ✅ |

#### augmented_major7
| Notation | Want | Got | |
|---|---|---|---|
| `Cmaj7#5` | augmented_major7 | augmented_major7 | ✅ |
| `CM7#5` | augmented_major7 | augmented_major7 | ✅ |
| `C+maj7` | augmented_major7 | augmented_major7 | ✅ |
| `CaugMaj7` | augmented_major7 | augmented_major7 | ✅ |
| `Cmaj7+` | augmented_major7 | augmented_major7 | ✅ |
| `C+M7` | augmented_major7 | augmented_major7 | ✅ |
| `CaugΔ7` | augmented_major7 | augmented_major7 | ✅ |

#### major7flat5
| Notation | Want | Got | |
|---|---|---|---|
| `Cmaj7b5` | major7flat5 | major7flat5 | ✅ |
| `CM7b5` | major7flat5 | major7flat5 | ✅ |
| `Cmaj7♭5` | major7flat5 | major7flat5 | ✅ |
| `CΔ7b5` | major7flat5 | major7flat5 | ✅ |

#### major7sharp11
| Notation | Want | Got | |
|---|---|---|---|
| `Cmaj7#11` | major7sharp11 | major7sharp11 | ✅ |
| `CM7#11` | major7sharp11 | major7sharp11 | ✅ |
| `Cmaj7(#11)` | major7sharp11 | major7sharp11 | ✅ |
| `CΔ7#11` | major7sharp11 | major7sharp11 | ✅ |

#### diminished_major7
| Notation | Want | Got | |
|---|---|---|---|
| `CdimMaj7` | diminished_major7 | diminished_major7 | ✅ |
| `Cdim(maj7)` | diminished_major7 | diminished_major7 | ✅ |
| `C°maj7` | diminished_major7 | diminished_major7 | ✅ |
| `CdimM7` | diminished_major7 | diminished_major7 | ✅ |
| `C°M7` | diminished_major7 | diminished_major7 | ✅ |
| `CoMaj7` | diminished_major7 | diminished_major7 | ✅ |

#### dominant7sharp5flat9
| Notation | Want | Got | |
|---|---|---|---|
| `C7#5b9` | dominant7sharp5flat9 | dominant7sharp5flat9 | ✅ |
| `C7(#5)(b9)` | dominant7sharp5flat9 | dominant7sharp5flat9 | ✅ |
| `Caug7b9` | dominant7sharp5flat9 | dominant7sharp5flat9 | ✅ |
| `C+7b9` | dominant7sharp5flat9 | dominant7sharp5flat9 | ✅ |

#### dominant7flat5flat9
| Notation | Want | Got | |
|---|---|---|---|
| `C7b5b9` | dominant7flat5flat9 | dominant7flat5flat9 | ✅ |
| `C7(b5)(b9)` | dominant7flat5flat9 | dominant7flat5flat9 | ✅ |

#### dominant7sharp5sharp9
| Notation | Want | Got | |
|---|---|---|---|
| `C7#5#9` | dominant7sharp5sharp9 | dominant7sharp5sharp9 | ✅ |
| `C7(#5)(#9)` | dominant7sharp5sharp9 | dominant7sharp5sharp9 | ✅ |
| `Caug7#9` | dominant7sharp5sharp9 | dominant7sharp5sharp9 | ✅ |

#### dominant7flat5sharp9
| Notation | Want | Got | |
|---|---|---|---|
| `C7b5#9` | dominant7flat5sharp9 | dominant7flat5sharp9 | ✅ |
| `C7(b5)(#9)` | dominant7flat5sharp9 | dominant7flat5sharp9 | ✅ |

#### accidental roots / case / unicode
| Notation | Want | Got | |
|---|---|---|---|
| `C#m7` | minor7 | minor7 | ✅ |
| `Dbm7` | minor7 | minor7 | ✅ |
| `F#maj7` | major7 | major7 | ✅ |
| `Gbmaj7` | major7 | major7 | ✅ |
| `C♯m7` | minor7 | minor7 | ✅ |
| `D♭maj7` | major7 | major7 | ✅ |
| `c#m7` | minor7 | minor7 | ✅ |
| `bbmaj7` | major7 | major7 | ✅ |
| `B#dim7` | diminished7 | diminished7 | ✅ |
| `Cbmaj7` | major7 | major7 | ✅ |
| `E#m7` | minor7 | minor7 | ✅ |
| `Fbmaj7` | major7 | major7 | ✅ |
| `f#m7b5` | half_diminished7 | half_diminished7 | ✅ |

#### slash chords
| Notation | Want | Got | |
|---|---|---|---|
| `C7/E` | dominant7 | dominant7 | ✅ |
| `Cmaj7/G` | major7 | major7 | ✅ |
| `Am7/G` | minor7 | minor7 | ✅ |
| `F#m7b5/C` | half_diminished7 | half_diminished7 | ✅ |
| `Bbmaj7/D` | major7 | major7 | ✅ |
| `Cm/Eb` | minor | minor | ✅ |
| `G7sus4/C` | dominant7sus4 | dominant7sus4 | ✅ |

#### verbal (parser-level: single-word → symbol)
| Notation | Want | Got | |
|---|---|---|---|
| `Cminor` | minor | minor | ✅ |
| `C minor` | minor | minor | ✅ |
| `Cminor7` | minor7 | minor7 | ✅ |
| `C minor 7` | minor7 | minor7 | ✅ |
| `C sharp minor` | minor | minor | ✅ |
| `Cdiminished7` | diminished7 | diminished7 | ✅ |
| `Caugmented` | augmented | augmented | ✅ |

#### verbal — Phase 3 QuickSearch layer (parser returns NULL by design)
| Notation | Parser today | QuickSearch target |
|---|---|---|
| `C sharp minor seven` | NULL | C# minor7 (QuickSearch verbal) |
| `D flat major seven` | NULL | Db major7 (QuickSearch verbal) |
| `G dominant` | major | G dominant7 (QuickSearch verbal) |
| `B half diminished` | half_diminished7 | B half_diminished7 (QuickSearch verbal) |
| `F sharp diminished seventh` | NULL | F# diminished7 (QuickSearch verbal) |
| `C major seven` | NULL | C major7 (QuickSearch verbal) |

#### negatives (must NOT parse)
| Notation | Result | Note | |
|---|---|---|---|
| `C0` | NULL | zero as half-dim is ambiguous — must NOT parse | ✅ |
| `Cx` | NULL | garbage suffix | ✅ |
| `Cmaj77` | NULL | invalid double-seven | ✅ |
| `H7` | NULL | German H — not supported | ✅ |
| `hello world` | NULL | prose | ✅ |
| `Cblah` | NULL | garbage word | ✅ |
| `C7b` | NULL | dangling accidental, no degree | ✅ |
| `7` | NULL | no root | ✅ |
| `Zmaj7` | NULL | invalid root letter | ✅ |

---

## Phase 3 — QuickSearch hint layer (commit 2)

The hint logic is two framework-agnostic helpers in `src/core/utils/chordHints.ts`
(`getChordCompletions`, `parseVerbalChord`), wired into the result ranker
`src/components/navigation/quickSearchResults.ts` (`getResults` was extracted out of
`QuickSearch.tsx` so the component file exports only the component — react-refresh rule).
Tests: `src/core/utils/__tests__/chordHints.test.ts` (helpers) +
`src/components/navigation/__tests__/QuickSearch.test.tsx` (ranking/cap/render).

- **Partial-symbol completions** (`getChordCompletions`) — the typed quality fragment is
  a prefix filter over a commonality-ordered quality list (triads/6ths/7ths before dense
  extensions). `Cmaj` → Cmaj7, Cmaj9, Cmaj11, Cmaj13, Cmaj7#11; `C7#` → C7#9, C7#11, C7#5;
  `Cm` → Cm, Cm6, Cm7, Cm7b5, CmMaj7, Cm9, … (never leaks the major `maj*` family);
  `F#` → F#, F#m, F#dim, … Each candidate is parsed by the real parser, so only real
  chords are offered; deduped by quality, capped at 8.
- **Verbal forms** (`parseVerbalChord`) — free text → chord: a root note word + optional
  `sharp`/`flat` accidental word + spelled-out degree numbers (`seven`→7) + multi-word
  qualities. `c sharp minor` → C♯ Minor, `d flat major seven` → D♭ Major 7,
  `g dominant` → G Dominant 7 (jazz convention), `b half diminished` → B Half-Diminished 7,
  `f sharp diminished seventh` → F♯ Diminished 7, `c minor major seven` → C Minor-Major 7.
  Deterministic phrase→suffix table (longest phrase wins); unknown words → null.
- **Ranking**: exact symbol parse first, then verbal, then completions; **capped at 8**
  chord results; the full quality NAME path ("Dominant 7th", "Half-Diminished") still
  resolves via the existing quality-name fuzzy fallback.
- **Performance**: all alias/quality tables are module-scope constants (the search runs
  per keystroke); no per-call allocation of the tables.

**Known nuance:** the bare words `Major` / `Minor` (no root) prioritize SCALE results (C
Major scale, etc.) and fill the result list before the chord-name fuzzy fallback — this is
pre-existing and sensible (a lone "minor" reads as a scale/key). The major/minor *chords*
remain reachable via `C`/`Cm` or `C Major`/`C Minor` (both yield a Chord result).

i18n: result labels reuse existing display names (`formatParsedChordName`,
`CHORD_QUALITY_NAMES`); no new translatable UI strings were added.
