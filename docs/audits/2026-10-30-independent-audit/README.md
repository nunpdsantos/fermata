# Fermata independent audit — 30 October 2026

Code audited: `main` at `228f541`. The live site serves exactly this build (byte-identical `index.html`, `sw.js` and view chunks; `vercel inspect` deployment created 3 s after the commit). No app code was changed by the audit.

Readable version with filters: `report.html` (also published as a private claude.ai artifact).

## Result
- **264 findings → 214 distinct issues** after merging duplicates across tracks: **12 critical (S1), 69 serious (S2), 133 minor (S3)**. Full list: `ledger.md` / `ledger.json`.
- **151 findings re-checked by a second model family** (Sonnet 5.5) from source: 107 confirmed, 44 real but with narrower scope or lower severity, **0 rejected**. The 85 minor rows marked "not re-checked" were not re-tried.
- **Urgent:** choosing Dim W-H, Dim H-W, Bebop Dom or Bebop Maj crashes the whole app; the crash persists after reload and the only offered exit wipes saved progress (ledger W0-01, confirmed live).
- The engine is sound where it was checked exhaustively: 1,315 Drill items, ~4,900 chord-parser inputs, 870 Learn answer keys, 263 build-exercise graders. Gates pass: `tsc -b --force`, 5,670 unit tests, lint, build.

## Fix plan (order)
| # | Batch | Issues (S1/S2/S3) | Blocked by |
|---|---|---|---|
| W0 | Urgent fixes: crash + progress-safe recovery, Drill input lock, feedback contrast, silent next ear item | 4 (1/3/0) | — |
| W1 | One letter-based spelling engine for every display | 19 (4/5/10) | D-13 |
| W2 | Circle of fifths and harmony panels | 10 (1/4/5) | W1 |
| W3 | Guitar positions (engine-generated) and fretboard | 15 (1/4/10) | D-01, D-02 |
| W4 | Learn assessment integrity | 27 (3/13/11) | D-09, D-10, D-11 |
| W5 | English content corrections | 65 (1/27/37) | — (before W6) |
| W6 | Portuguese and Spanish | 17 (1/6/10) | D-17, D-18, D-19 |
| W7 | Drill engine | 12 (0/4/8) | D-15 |
| W8 | Audio | 3 (0/0/3) | D-22 |
| W9 | App shell, performance, CI | 29 (0/3/26) | D-20, D-21 |
| W10 | Classical-guitar features | 13 (0/0/13) | D-01 … D-08 |

Every batch: branch off `main` → tests (convert the matching scripts from `harness.tar.gz` into permanent tests) → preview → owner merges (= production deploy).

## Decisions only the owner can make
24, in `decisions.md`. Decide first: D-01 (ask Zoltán for fingerings/position names/note naming), D-02 (position system and default fretboard view), D-09 (answer-reveal policy), D-13 (notation conventions).

## Comparison with July
`july-comparison.md`. July never examined what the instruments and staff render; the scale-position data has been wrong since the initial commit (`2ff5f5f`, 2026-02-07); the July R-01 replay-lock fix (`88c7b06`) introduced the silent-next-item bug (W0-04).

## Folder
- `tracks/` — each auditor track's findings (A instruments, B Learn L1–5, C Learn L6–9 + Explore, D Drill/grading/parsers, E PT/ES, F engineering, G classical-guitar fit, U live walkthrough with screenshots)
- `verification/` — the second-model verdicts per track
- `harness.tar.gz` — every checking script the audit used, archived so lint ignores them (`tar -xzf harness.tar.gz`; they import the app by absolute path — adapt paths when turning them into tests)
- `merge-spec.md` — the severity rubric and merge rules

## Method and limits
Auditors: Claude Opus 5.5 (7 tracks; barred from the July reports). Live walkthrough, synthesis: Opus 5.5 (main session). Verifiers: Claude Sonnet 5.5. Merge: Opus 5.5. No Fable. ~4.9 M subagent tokens.
Not covered: real phones / iOS Safari / installed PWA (emulated only), audio quality by ear, native-speaker PT/ES review.
Incident: the Track A auditor reproduced the crash on the live site in the owner's browser and restored the saved state; afterwards the app loaded normally and progress (217 chars) and Drill (10,886 chars) data were intact at their pre-test sizes. The exact restored key/scale cannot be proven. The audit brief had not barred the live site; the verifiers' briefs did.
