# L9 Reference-Song Interval Mnemonics — Verification

**Purpose:** Resolve the WS5 L9 audit's "questionable — needs human verification" items (Q1–Q4) for reference-song interval mnemonics, which the static audit flagged as unverifiable-without-research. Each song→interval claim below was web-researched and cross-checked against **at least two reputable ear-training / music-theory sources** (not a single blog). Directions (ascending/descending) were verified, not assumed.

**Method:** Cross-referenced the standard published interval-song charts — EarMaster, Musicca, myeartraining.net, Portland State University (J. Newton) interval-mnemonics table, Wikiversity *Ear training/Intervals*, Soundfly/Flypaper — plus song-specific melodic analyses (Hooktheory / Alan W. Pollack for Hey Jude; Classic FM / Wikipedia for Maria; Rebel Music Teacher for Take On Me; Classic FM / Ethan Hein for Star Wars) where direction or literal-opening needed pinning. These charts are the de-facto canon that ear-training curricula draw from; a pairing appearing across several of them = a long-standing standard mnemonic.

**Scope of the two source files**
- `src/core/constants/curriculumL9.ts` — **READ-ONLY core** (per `CLAUDE.md`: "`src/core/` is copied from the original app… Do not modify these files"). Fixes here require escalation.
- `src/data/songReferences.ts` — **app-side** (under `src/data/`). Fermata can edit directly.

---

## Verdict table — `curriculumL9.ts` (core, read-only)

All entries below live in the `l9u30m3` / `l9u30m4` module concept text.

| Song | Claimed interval (+direction) | Verdict | Actual / conventional interval | Source(s) | Location (file:line) | Recommendation |
|---|---|---|---|---|---|---|
| Jaws (theme) | m2 ascending | **CORRECT** | m2 ascending (the two-note shark motif) | EarMaster; Musicca | `curriculumL9.ts:147` | keep |
| Happy Birthday | M2 ascending | **CORRECT** (minor caveat) | M2 ascending — but it is the **2nd→3rd** notes ("Happy **Birth**day"); the literal first two notes ("Hap-py") are a repeated/unison pitch | EarMaster; myeartraining.net | `curriculumL9.ts:147` | keep (optionally note it's the 2nd→3rd note, not the first interval) |
| Greensleeves | m3 ascending | **CORRECT** | m3 ascending (opening "A-las") | EarMaster; Musicca; myeartraining.net; Wikiversity | `curriculumL9.ts:147` | keep |
| When the Saints | M3 ascending | **CORRECT** | M3 ascending (opening leap) | EarMaster; Musicca; myeartraining.net; PSU/Newton | `curriculumL9.ts:147` | keep |
| Here Comes the Bride | P4 ascending | **CORRECT** | P4 ascending (Wagner, "Bridal Chorus") | EarMaster; myeartraining.net; PSU/Newton | `curriculumL9.ts:147` | keep |
| The Simpsons | tritone (asc) | **CORRECT** | tritone ascending ("The-Simp-sons") | EarMaster; Musicca; Wikiversity | `curriculumL9.ts:147` | keep |
| Twinkle Twinkle | P5 ascending | **CORRECT** | P5 ascending ("Twin-kle") | EarMaster; Musicca; myeartraining.net; PSU/Newton; Classic FM | `curriculumL9.ts:147` | keep |
| Mary Had a Little Lamb | M2 descending | **CORRECT** | M2 descending (E→D, first two notes) | EarMaster (desc M2 set); Musicca (desc M2) | `curriculumL9.ts:161` | keep |
| Hey Jude | m3 **descending** | **CORRECT** | m3 descending — actual melody is F→D, a descending m3 (verified in melodic analysis, not just charts) | Hooktheory + Alan W. Pollack analysis (F→D); EarMaster; Musicca; PSU/Newton; Wikiversity (all list it **descending**) | `curriculumL9.ts:161` and `:210` (claim appears twice) | keep |
| Love Story (Where Do I Begin) | m6 ascending | **CORRECT** (direction caveat) | m6 — Wikiversity notes the **first two notes descend** a m6 while the **3rd–4th notes ascend** a m6; ascending-m6 association is also listed by myeartraining.net & Musicca. So ascending is a valid, sourced pairing; direction is arrangement-dependent | Wikiversity; myeartraining.net; Musicca | `curriculumL9.ts:203` | keep (the m6 identity is solid; direction varies by arrangement — optional footnote) |
| My Bonnie | M6 ascending | **CORRECT** | M6 ascending ("My-Bon-nie") | EarMaster; Musicca; myeartraining.net; Wikiversity | `curriculumL9.ts:203` | keep |
| Somewhere (West Side Story) | m7 ascending | **CORRECT** | m7 ascending ("There's a…") | EarMaster; Musicca; myeartraining.net; PSU/Newton; Wikiversity | `curriculumL9.ts:203` | keep |
| Take On Me | M7 ascending | **CORRECT** | M7 ascending — the soaring "Take-on" hook leaps a M7 (resolving to the octave on "me"). Standard, universally-cited M7 mnemonic. (Pedantic note: the leap is in the sung **chorus**, not the instrumental synth intro.) | EarMaster; Musicca; myeartraining.net; Wikiversity; Rebel Music Teacher | `curriculumL9.ts:203` | keep |
| Somewhere Over the Rainbow | P8 (octave) ascending | **CORRECT** | octave ascending ("Some-where") | EarMaster; Musicca; myeartraining.net; PSU/Newton; Wikiversity | `curriculumL9.ts:203` | keep |
| Feelings (Morris Albert) | P5 **descending** | **CORRECT** | P5 descending | EarMaster (lists "Feelings" under desc P5); Wikiversity (lists "Feelings" under P5 descending) | `curriculumL9.ts:210` | keep |

## Verdict table — `songReferences.ts` (app-side)

These are the L9-relevant interval-mnemonic claims in the song-reference overlays (L1–L3 modules that double as interval references).

| Song | Claimed interval (+direction) | Verdict | Actual / conventional interval | Source(s) | Location (file:line) | Recommendation |
|---|---|---|---|---|---|---|
| Here Comes the Bride | P4 (asc) | **CORRECT** | P4 ascending | EarMaster; myeartraining.net; PSU/Newton | `songReferences.ts:55` | keep |
| Somewhere Over the Rainbow | octave (asc) | **CORRECT** | octave ascending | EarMaster; Musicca; myeartraining.net; Wikiversity | `songReferences.ts:56` | keep |
| Star Wars Main Theme | P5 (asc) | **CORRECT** | P5 ascending (Bb→F) | Classic FM (John Williams analysis); Ethan Hein; EarMaster/Musicca P5 sets | `songReferences.ts:57` | keep |
| Amazing Grace | P4 (asc) | **CORRECT** | P4 ascending (first two notes) | Music Theory Academy; Musicca (P4 set); Improvise For Real | `songReferences.ts:102` | keep |
| When the Saints Go Marching In | M3 (asc, C–E–F–G) | **CORRECT** | M3 ascending opening leap; the C–E–F–G figure is accurate | EarMaster; Musicca; myeartraining.net; PSU/Newton | `songReferences.ts:103` | keep |
| Maria (West Side Story) | aug 4th / tritone | **CORRECT** | tritone ("Ma-ri-a", resolving up a semitone to P5) — the canonical tritone mnemonic | Wikipedia (Maria); Classic FM; Musicca (lists "Maria" under tritone) | `songReferences.ts:106` | keep |

> `songReferences.ts:107` (A Whole New World — "compound intervals 9ths/10ths") is a general melodic-content claim, not a specific opening-interval mnemonic, so it is outside the Q1–Q4 scope and was not interval-verified here. It makes no single-interval claim to be wrong about.

---

## Summary

**Counts (across both files, 21 distinct interval-mnemonic claims verified):**

| Verdict | Count |
|---|---|
| CORRECT | 21 |
| WRONG | 0 |
| CONTESTED / UNVERIFIED | 0 |

**All mnemonics verified CORRECT.** None are wrong. Every song→interval pairing — including direction — is a long-standing standard ear-training mnemonic confirmed across multiple authoritative interval-song charts, and the two direction-sensitive descending claims (Hey Jude m3↓, Feelings P5↓) and the tritone (Maria) were additionally confirmed against song-specific melodic analyses.

**WRONG ones:** none. Nothing to fix app-side, nothing to escalate to core.

**Minor caveats (NOT errors — optional polish only, no correction needed):**
- **Happy Birthday (M2↑)** — `curriculumL9.ts:147`, core. The M2 is the **2nd→3rd** notes ("Happy-**Birth**day"); the literal first two notes ("Hap-py") are a repeated pitch (unison). The mnemonic is standard and correct as taught, but a curriculum could note this. *No fix required.*
- **Love Story (m6↑)** — `curriculumL9.ts:203`, core. The m6 is unambiguous; its **direction is arrangement-dependent** (Wikiversity: first two notes descend a m6, 3rd–4th notes ascend a m6). The ascending association Fermata uses is sourced and valid. *No fix required.*
- **Take On Me (M7↑)** — `curriculumL9.ts:203`, core. The M7 leap is in the sung **chorus** hook, not the instrumental intro — but this is exactly how every chart cites it. *No fix required.*

Because all three caveats sit in **core (read-only)** and none rises to an error, the recommendation is **keep all as-is**. If Fermata ever wants the Happy Birthday / Love Story footnotes, those would be **core escalations** (text lives in `src/core/constants/curriculumL9.ts`), not app-side edits.

---

## Sources

- EarMaster — Interval Song Chart Generator: https://www.earmaster.com/products/free-tools/interval-song-chart-generator.html
- Musicca — Interval song chart: https://www.musicca.com/interval-song-chart
- myeartraining.net — Ear training interval songs: https://www.myeartraining.net/article_interval_songs
- Portland State University (J. Newton) — Interval Mnemonics: https://web.pdx.edu/~jnewton/info/interval_mnemonics.html
- Wikiversity — Ear training/Intervals: https://en.wikiversity.org/wiki/Ear_training/Intervals
- Soundfly / Flypaper — Interval Cheat Sheet (ascending) and Descending Intervals guide: https://flypaper.soundfly.com/tips/interval-cheat-sheet-songs-to-help-you-remember-common-intervals/ ; https://flypaper.soundfly.com/write/memorize-common-descending-intervals-easily-with-this-handy-guide/
- Hey Jude melodic analysis (F→D, descending m3): Hooktheory https://www.hooktheory.com/theorytab/view/the-beatles/hey-jude ; Alan W. Pollack's Notes on "Hey Jude" https://www.icce.rug.nl/~soundscapes/DATABASES/AWP/hj.shtml
- Maria (tritone): Wikipedia https://en.wikipedia.org/wiki/Maria_(West_Side_Story_song) ; Classic FM https://www.classicfm.com/composers/bernstein-l/bernstein-west-side-story-tritone/
- Take On Me (M7, chorus hook): Rebel Music Teacher https://www.rebelmusicteacher.com/blog/2016/7/18/major-seventh-interval-in-a-has-take-on-me
- Star Wars (P5, Bb→F): Classic FM https://www.classicfm.com/discover-music/periods-genres/film-tv/john-williams-secret-music-trick/ ; Ethan Hein https://www.ethanhein.com/wp/2015/musical-simples-star-wars/
- Amazing Grace (P4): Music Theory Academy https://www.musictheoryacademy.com/understanding-music/intervals/perfect-fourth/
