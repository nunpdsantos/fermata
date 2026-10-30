# Comparison with the July 2026 audit (done after the independent audit, not before)

Sources: `docs/audits/2026-07-24-fermata-comprehensive-audit.md` and `…-rerun.md` (read by the main session only; auditors were barred from them).

## What July missed that this audit found (all verified)
- **Instrument and display correctness.** July rated the music-theory engine "Pass with caveats" from engine unit tests. It never examined what the fretboard, staff, circle of fifths or chord buttons *draw*. This audit found: 74 of 85 scale positions wrong (data unchanged since the initial commit, 2026-02-07, `2ff5f5f`); four scales crash the app persistently; staff missing naturals in flat-key harmonic/melodic minor and B♯/C♭ drawn an octave off; circle of fifths wrong key signature and numerals for every non-major scale; "diatonic" chord buttons with out-of-scale notes in 12 scale types.
- **Answer reveal on the first wrong try** (correct option turns green and is printed, retry still pays 0.5) — July fixed answer *ordering* (F-01) but did not flag the reveal.
- **Template↔module shift** (generated exercises quizzing a later module's topic) and the stale PT/ES theory corrections.
- **Drill**: input lock on adjacent requeue, "by heart" restored after a lapse, wrong P5 spelling, contradicting explanations.

## A July fix that introduced a new bug
- July R-01 ("audio Replay can overlap the prompt") was fixed on 2026-07-24 in `88c7b06` with a playback lock (`earPlaybackLockMs`). That lock is what silences the *next* ear-training item when the learner answers during playback (F-01 / C-48). Verified by `git log -S earPlaybackLockMs`.

## July items still open, and what this audit adds
| July item | July status (24 Jul rerun) | This audit |
|---|---|---|
| F-07 breadth ≠ instruction | Open | Concrete cases: MC prompts pointing at stimuli that are never shown (B-12/C-20), no melody mode in L9 (C-44), rhythm modules with no rhythm notation or audio (B improvement 5) |
| F-08 first load heavy | Partially resolved | Still ~4.1 MB in the first 6 s; all piano samples preload at idle despite the code comments; VexFlow ships all fonts (Bravura-only saves ~294 KB gzipped) (F-16, F-17) |
| F-10 multilingual quality | Partially resolved | Root cause found: English theory corrections from March–July never reached PT/ES (E-1…E-6); song translations never loaded (E-7/F-04); plurals never pluralise (E-8) |
| F-11 browser suite false confidence | Partially resolved | CI still has no build/Playwright/coverage step; offline tests always skip on the dev server; the Learn E2E fails 2 of 6 runs without retries (F-09, F-10) |
| F-12 accessibility | Open | Worse than July's Lighthouse 96 suggests: answer feedback and answer chips at 1.2–1.8:1 on the default theme (U-2/F-05); 19 px main tabs, 14 px back button (F-06) |
| F-13 mobile density | Open | Instrument dock takes ~40% of the screen in Learn and shows unrelated Explore state (U-5) |
| F-14 client errors invisible | Open | Not re-examined in this audit; still open per July |
| F-15 terminology/tone | Partially resolved | Dó/Ré vs C/D mixed in 94 PT strings after excluding quoted queries; cadence names inconsistent (E-9, E-14) |
| F-16 maintenance | Open | 22 dev-only advisories; unused `sharp` package carries the "high" ones (F-21) |

## Process lesson (for the fix plan)
July's assurance came from engine tests and content scripts that check data against itself. Every big miss here was found by comparing what is *rendered* against an independent oracle. The fix plan therefore turns this audit's harnesses into CI tests rather than relying on one-off audits.
