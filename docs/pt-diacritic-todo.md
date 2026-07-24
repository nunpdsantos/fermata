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
- Solfège note names accented in prose (`Dó central`, `Fá#`, `Láb`);
  international letter names (C, D, Eb), chord symbols (Cmaj7, ii7, Gr+6)
  and template tokens (`{note}`, `{scaleType}`, …) untouched.
- Loanwords stay English/Italian: blues, jazz, swing, voicing, tremolo.
- Ordinal style: files keep their original `3.o`/`5.a` markers (none used
  `º`/`ª`; do not mix styles when editing).
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
