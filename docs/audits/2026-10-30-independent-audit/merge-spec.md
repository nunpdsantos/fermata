# Merge spec for the Fermata audit ledger

## Inputs
Track findings (auditors, Opus): `audit/{A-instruments,B-learn-L1-L5,C-learn-L6-L9-explore,D-generated-grading,E-translations,F-engineering,G-pedagogy,U-live-ux}/findings.md`
Verifier verdicts (Sonnet): `audit/verify/results/{A1-14,A15-28,B,C1-30,C31-59,D,E,F}.md`
Notes: A-2 = C-12 = U-15 (crash) was confirmed live by the main session. S3 findings were generally not verified (mark "not re-checked").

## Unified severity (overrides track severities; use verifier corrections)
- **S1 Critical** — the app crashes or loses data; an answer is graded wrong when right or right when wrong; an exercise is unanswerable; or a core display (fretboard, piano, staff, circle of fifths, degree bar, chord buttons) shows wrong notes/keys on a commonly used path.
- **S2 Serious** — the app teaches a wrong fact in text/hints/explanations; a translation states something musically wrong; a feature is broken but recoverable; a key readability/accessibility failure on main screens; a misleading UI on a main path.
- **S3 Minor** — inconsistency, wording, polish, rare edge cases, tech debt, missing tests, docs drift.
Where the verifier said PARTIAL with a downgrade, apply the downgrade unless it conflicts with the rubric above (then follow the rubric and note it).

## Dedupe
Merge findings with the same root cause into one ledger row, listing all source IDs (e.g. "B-10, C-10, U-7"). Known clusters (non-exhaustive): crash (A-2/C-12/U-15); answer reveal + 0.5 retry (B-10/C-10/U-7); interval staff sharps-only (A-8/B-1/C-11/D-3); scale positions (A-1/U-1/G-1 + A-23/A-24/A-25 as separate rows if distinct); circle of fifths signature (A-6/C-51/U-3) and numerals (A-7/C-52); feedback contrast (U-2/F-05); template↔module shift (B-5/C-19/C-28/C-49); song overlays (F-04/E-7); hardcoded English (E-11/F-13/U-9); ear-training silent next item (F-01/C-48); ear chords inverted (A-11/C-38/C-39 separate if distinct); blues/8-note spelling & labels (U-4/A-12/A-17/C-54/C-55); diatonic chord buttons (A-10/C-13); chromatic strip spelling (A-14/C-57); ear note-ID with no reference (B-15/C-41); dangling "this" prompts (B-12/C-20); guitar 8vb/notation (A-28/G-7/U-8/B-28); Drill counter (U-6 part/D-11).

## Workstreams (assign each row to exactly one)
- **W0 Urgent fixes** — crash + recovery that keeps progress; Drill input lock (D-4); feedback/answer-chip contrast; ear-training silent next item. Small, ship first.
- **W1 Spelling engine** — one letter-based spelling/degree helper used by every display: interval staff, staff octave (B♯/C♭), naturals & redundant accidentals on staff, blues/8-note/whole-tone spellings, degree labels & colours, comparison/strip labels, string-name column, note chips, circle P5 spelling, root spelling choices (D♭/G♭), raw strings in feedback.
- **W2 Circle of fifths & harmony panels** — signature/numerals per scale, focus-steal, state bypass, diatonic chord buttons, chord–scale suggestions, mode numerals, inversion labels.
- **W3 Guitar (positions & fretboard)** — engine-generated positions (system pending Nuno's decision), open strings in positions, tiling, double-accidental roots, persistence, chromatic/8-note scale display, exercise taps on fretboard, chord shapes/fingerings/barres, alt tunings, inversions, staff 8vb.
- **W4 Learn assessment integrity** — reveal policy, template↔module mapping, unanswerable/deictic prompts, answer leaks, longest-option bias, ordering, duplicates, grading bugs (e.g. tritone sub), ear-training design (reference pitch, voicing, cadence audio).
- **W5 English content corrections** — wrong theory in lessons/hints/explanations/answer labels (L1–L9, Explore, Drill explanations).
- **W6 Portuguese & Spanish** — stale translations, song overlays, plurals, note-name convention, Drill translation, hardcoded English, search in PT/ES, terminology consistency, parity/staleness tests.
- **W7 Drill engine** — by-heart rule, introduction order, chips, feedback, resume, persistence robustness, sibling adjacency.
- **W8 Audio** — stop/overlap, stuck note, preload policy.
- **W9 App shell, performance, CI** — instrument dock in Learn, tap targets, lazy retry, PWA update, CI gates (incl. turning audit harnesses into tests), flaky test, bundle/preload, fonts, caching, theme flash, dead code, docs drift, search ("C major scale" returns nothing), level gating UX.
- **W10 Classical-guitar features** — Track G improvements (new features, decisions first).

## Output
1. `ledger.md`: summary counts (raw vs unique; by unified severity; by workstream; verification status), then one table per workstream sorted S1→S3: `| ID | Sev | Title (plain language) | Sources | Verified | Where | Fix |`. IDs `W<n>-<nn>`.
2. `ledger.json`: array of `{id, ws, sev, title, plain, sources:[...], verified:"confirmed|partial|live|not re-checked", where, fix, decision?:string}`. `plain` = one sentence a non-coder understands.
3. `decisions.md`: every decision only Nuno can make, with options and a recommendation, citing ledger IDs.
4. A short list of anything you could not place or that conflicts between tracks.
