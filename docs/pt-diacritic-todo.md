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
  ordinal indicators, `1.º`, `3.ª`, `7.ª M`; plurals in plain letters
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
- Interval short forms in titles: cardinal + quality, as in the L9 hints —
  PT `1P–5P`, `6m–8P`; ES `1J–5J`, `6m–8J`.
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
