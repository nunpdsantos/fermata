# PT Diacritic Restoration — DONE (2026-07-24)

**Status: restored.** All Portuguese content files now carry full European
Portuguese orthography. The restoration was performed on 2026-07-24 (branch
`pt-diacritics`) across the ~24 files this document previously listed as
stripped, ~5,900 word-level corrections, verified by forced tsc, the full
Vitest suite (incl. overlay/template parity), and the content audits. The
diff was symmetric (3,438 insertions / 3,438 deletions) — orthography only,
no rewording, no structural change.

**Conventions applied** (for future content edits — all PT files now share
one style):

- European Portuguese forms: `tónica`, `harmónica`, `carácter`, `dórico`,
  `frígio`, `lídio`, `mixolídio`, `pentatónica`, `secção`, `enarmónica`.
- Note names are letters since D-18 (see below); where solfège remains
  (clef names, sentences about the syllables) it keeps its accents (`clave
  de fá`, `Dó`). Chord symbols (Cmaj7, ii7, Gr+6) and template tokens
  (`{note}`, `{scaleType}`, …) are never translated.
- Loanwords stay English/Italian: blues, jazz, swing, voicing, tremolo.
- Ordinal style (2026-10-30, W6-11 — supersedes "keep `3.o`/`5.a`"): the
  ordinal indicators, `1.º`, `3.ª`, `7.ª maior`; plurals in plain letters
  (`3.as`, `2.os`). Spanish uses the same style (plus `1.er` / `3.er`).
  `orthography.test.ts` forbids `3.a` / `5.o` / `7ª` in PT and ES, also
  after an accidental (`b6.o` → `♭6.º`).
- Dashes: `—` (em dash), never ` -- `.
- Register: European Portuguese `tu` everywhere, including the interface
  (`Clica`, `Escolhe`, `Toca`, `Passaste!`).
- Note names (D-18): letters (C, D, E…), as on the instruments; solfège only
  where a sentence is about solfège syllables, and in clef names (`clave de
  sol`, `clave de fá`).
- Noun rule for letter names: never start a sentence with a bare `A`/`E`
  (PT) or `La`/`A` (ES) before `menor`/`maior`/`mayor`/`natural`/
  `harmónica`/`armónica`/`melódica`, nor PT `E está/é` — it reads as the
  article or conjunction ("A menor harmónica eleva…" = "the harmonic
  minor…"). Add the noun: `A escala menor harmónica…`, `A escala de A menor
  natural: …`, `A tonalidade de E maior tem…`, `A nota E está no baixo`
  (ES `La escala menor armónica…`, `La tonalidad de A mayor…`).
  `noteNames.test.ts` enforces it.
- Diminished sign: `°` (vii°7, B°7, `° = diminuta`), never the letter `o` or
  the ordinal `º`; English source keeps its `viio`. `orthography.test.ts`
  enforces it.
- Interval short forms throughout PT/ES learning content: cardinal + quality,
  without an ordinal indicator or intervening space. PT `1P`, `4P`, `5P`,
  `8P` (perfeita); ES `1J`, `4J`, `5J`, `8J` (justa); both languages
  `2m`/`2M`, `3m`/`3M`, `6m`/`6M`, `7m`/`7M`. Use these in titles,
  compact lists, formulas and hints: PT `1P–5P`, `6m–8P`, `4P=5`,
  `8P=12`; ES `1J–5J`, `6m–8J`, `4J=5`, `8J=12`. In ordinary sentences
  prefer the quality in words: `uma 5.ª perfeita`, `una 5.ª justa`.
  Neither English order (`P5`, `M3`) nor hybrids (`6.ª m`, `3.aM`,
  `5.ªJ`) belong in translated interval text.
  - Diminished/augmented decision (2026-11-03): write the quality in words,
    including in the few existing recipes: PT `5.ª diminuta`,
    `4.ª aumentada`; ES `5.ª disminuida`, `4.ª aumentada`. No new short
    form is needed or introduced. Apply the same rule to other interval
    numbers (`7.ª diminuta` / `7.ª disminuida`, `5.ª aumentada`).
  - Pitch names (`A3`, `A4`, `A5`) and chord symbols/qualities (`A7`,
    `m7`, `Cm7`, `m7b5`) retain their meaning and spelling. English content
    and sourceHashes.json are unchanged.
  - Body-text cleanup (2026-11-03, baseline e273a55): **44 PT strings / 175
    interval occurrences; 42 ES strings / 172 occurrences**, all converted;
    **0 nonconforming interval occurrences remain**. Each string is listed
    before → after in `_review/interval-forms-before-after.md`. Regenerating
    `moduleTitles.pt.ts` / `moduleTitles.es.ts` produced no changes because
    the titles already conformed. Comments naming English modules are not
    learner-facing strings and are excluded from the counts.
  - `intervalShortForms.test.ts` checks all overlay string values and derived
    module titles, with planted failures for every quality, interval `A4`,
    and spaced/attached hybrids. Ambiguous pitch/chord occurrences have
    exact-text, path-specific reviewed exceptions in `intervalCollisions.ts`;
    an edit to one of those strings requires review again. No whole-file or
    keyword-based exception can hide a new interval in a pitch/chord hint.
  - Identity compatibility: runtime multiple-choice fingerprints hash translated
    correct-answer text, unlike the English snapshot gate. Four exact
    `(exercise id, new hash)` aliases in `exerciseFingerprint.ts` preserve
    the pre-edit PT/ES hashes for `l3u10m2g1` and `l8u25m1g4`.
    `exerciseFingerprint.editorial.test.ts` pins those old hashes and proves
    subsequent prompt/answer changes still change identity. No IDs, keyed
    answers, English fingerprints or retirement snapshots are changed.
- Terminology (D-19, amended D-19a on 2026-10-31): chord root =
  `fundamental`; `meio-tom` / `meios-tons`; cadences:
  - PT: `perfeita (CAP)`, `imperfeita (CAI)`, `meia cadência` (no hyphen;
    `cadência suspensiva` only as the one alternative mention in the L3
    cadence lesson), `plagal`, `interrompida`;
  - ES: `auténtica perfecta (CAP)`, `auténtica imperfecta (CAI)`,
    `semicadencia`, `plagal`, `cadencia rota` (`interrumpida` only as the
    one alternative mention in the L3 lesson).
  `terminology.test.ts` enforces it.
- Movable-do solfège tokens in l9u32m4 (`Do-Re-Mi…Ti`, "Do = C")
  deliberately kept unaccented — they are system tokens, not prose.

## Remaining (optional) follow-ups

- **Native-speaker skim** — the restoration was done by Claude with
  music-theory context; the rerun audit's recommendation of a native PT-PT
  editorial pass still stands for publication-grade certainty.
- Deliberately left as found (rewording was out of scope):
  - `percepção` (pre-AO90; post-AO90 PT-PT would be `perceção`)
  - `cadência deceptiva` (PT-PT convention is `cadência interrompida`)
  - `homorítmica` (fully standard form is `homorrítmica`)
  - `reduz-los a metade` (ungrammatical clitic in source), `porcento`,
    `ambra`, `mediante cromáticas` (likely missing plural `s`)
  - Foreign proper nouns without their native diacritics: Bartok,
    Lutoslawski, Klavierstuck.
