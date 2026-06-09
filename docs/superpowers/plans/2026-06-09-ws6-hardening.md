# WS6 — Full-App Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Resolve every finding from the 2026-06-09 four-domain audit (security, code health, integration wiring, i18n integrity) plus the formerly-blocked core content bugs (CORE-ESCALATION B1–B7+B3a) and the C-item editorial queue — now that `src/core/` is owned (the "Music AI" source project no longer exists).

**Architecture:** Single branch `ws6-hardening`, eight logical commits, full gates (`npx tsc -b --force` + `npx vitest run` + `npm run build` + `npm run audit:all`) green after every commit. No production merge — branch pushed for Vercel preview; Nuno merges after his own assessment.

**Verdict that frames this plan:** Improve, don't rebuild. 83k LOC, 840 green tests, 100%-coverage PT/ES overlays, sound architecture. The defects are specific and enumerable (below) — a rebuild would re-create the same app minus its verified content.

---

## Decisions log (Nuno delegated all decisions — rationale recorded here)

| # | Decision | Rationale |
|---|---|---|
| D1 | `src/core/` is now OWNED by fermata; read-only rule retired everywhere | `~/Desktop/studio/projects/Music AI` no longer exists (verified) |
| D2 | B6: keep the name "Andalusian cadence", change the chords to the real i–bVII–bVI–V | Teaching the famous progression correctly beats relabeling an Axis rotation |
| D3 | B7: `dominant7alt` = R 3 b7 b9 #9 #11 b13 `[0,4,10,13,15,18,20]` (5th omitted) | Matches the L7 prose ("all four alterations"); omitted 5th is standard for alt chords |
| D4 | B1: `INTERVAL_LABELS[8]` → 'Minor 6th' (interval-ID context); chord displays get a quality-aware override so augmented chords still show Aug 5th/#5 | 8 semitones is canonically m6 in interval ID; #5 only in chord-spelling context |
| D5 | B3/C6: SATB ranges standardize on the core concept's bounds (Alto F3–C5, Bass E2–C4); template hint aligns to it | Concept text is the authoritative surface; one convention everywhere |
| D6 | C19: 2nd-species prose tightened to strict Fux (passing tones only), one clause noting later species admit dissonant neighbors | The module's own exercise already grades strict; internal consistency wins |
| D7 | C1: L1 note-ID template restricted to in-staff pitches (E4–F5) | Module is "The Staff and Clefs"; ledger lines arrive next module |
| D8 | C3: drop B root from the L2 augmented-triad generative range | B-aug needs F## — defer double-sharps until spelling is taught |
| D9 | C9/C11/C12/C15: apply the audit's recommended softenings (characteristic modal chords foregrounded; movable-do claim attributed; do-based minor declared, la-based labelled alternative; Forte/Rahn caveat with packed-left attributed to FORTE) | All verified against sources in C-DISPOSITION.md |
| D10 | C20-Q1: drop "first inversion" over-specification from L6 Neapolitan prompts (grading is pitch-class-set only) | Prompt must match what is graded |
| D11 | C2, C4, C5, C10, C13, C20-Q2: no change | Verified defensible/correct as-is |
| D12 | L4 counterpoint question: do NOT add 3rd–5th-species modules to L4 | L6 already teaches them (l6u20m1/m2); A2's re-targeting stands |
| D13 | Fretboard nut-right orientation: KEEP (deliberate in code, 3 sites), flag in report | Flipping invalidates user muscle memory; offer toggle as future work |
| D14 | ø7 stays displayed as m7b5 | Consistent with core CHORD_SYMBOLS; jazz-common |
| D15 | Try-This executor routes through core `parseChordSymbol`/`parseScaleSymbol`; `setView` called BEFORE selections | Fixes the ~60% dead Try-This buttons; one parser pipeline everywhere |
| D16 | "Learn about this" uses a static ChordQuality→moduleId map | Fuzzy title search routed major triads to L9 ear training |
| D17 | Keep quality names/interval labels in English in PT/ES feedback (existing "music nomenclature untranslated" convention); fix only grammar-broken templates | Full nomenclature translation is a separate product decision |
| D18 | Dead code deleted outright (20 core files + LevelIcon + shareUrl/glossary); git history preserves them | Zero importers proven; carrying them invites confusion |
| D19 | MANUAL.md, ROADMAP.md, AUDIT_TRACKER.md deleted; CLAUDE.md rewritten; README.md created | First two actively describe removed features; tracker is 100% closed |
| D20 | Engine B# scale-spelling bugs (lydian_augmented[4], hungarian_major[1]) fixed in core spelling logic | Found by `audit:engine`; latent (B# unreachable from UI) but real |

---

## Commit 1 — core engine: interval labels + alt chord + B# spelling
**Files:** `src/core/constants/chords.ts` (425, 452, 82, getChordIntervalLabels/getChordShortIntervalLabels), `src/core/constants/scales.ts` (B# spelling path), `src/components/learn/exercises/validateExercise.ts` (~109), `src/components/learn/exercises/exerciseHelpers.ts` (~16), affected tests + new tests.
- [ ] Tests first: INTERVAL_LABELS[8]==='Minor 6th'; SHORT[8]==='b6'; augmented chord display labels still show Aug/#5; dominant7alt formula = [0,4,10,13,15,18,20] and spells C7alt = C E Bb Db D# F# Ab (or chosen spelling); B# lydian_augmented/hungarian_major pitch classes correct.
- [ ] Fix constants; add quality-aware chord-display label overrides; remove both INTERVAL_LABEL_OVERRIDES band-aids; fix B# spelling; update any tests asserting old values; gates green; commit.

## Commit 2 — core curriculum prose (B2–B6, B3a) + C-factual + C-editorial + PT/ES mirrors
**Files:** `src/core/constants/curriculumL3.ts` (263, 286), `curriculumL4.ts` (cut-time concept, l4u14m1 species), `curriculumL5.ts` (l5u15m3), `curriculumL6.ts` (259), `curriculumL7.ts` (94, 204, 333, 644 + alt prose), `curriculumL8.ts` (l8u27m1 concept 2 + t3), `curriculumL9.ts` (l9u32m4 solfège), `src/data/exercises/templatesL3.ts` (~174), `templatesL1.ts` (C1), `templatesL2.ts` (C3), `templatesL6.ts` (C20-Q1) + the PT/ES mirror lines mapped in the i18n audit (pt/es curriculumL3:226,245; L4:554; L6:224; L7:38–114,305,568; templatesL3:142) + matching pt/es template lines.
- [ ] Apply each EN fix exactly as specified in CORE-ESCALATION.md / C-DISPOSITION.md with D2–D10 choices; mirror PT and ES translations 1:1 (overlays replace wholesale — every fix needs both mirrors); gates green; commit.

## Commit 3 — generator + template integrity (incl. PT/ES-only mis-grading bugs)
**Files:** `src/data/exercises/exerciseGenerator.ts` (fillTemplate ~155–193), `src/data/exercises/templatesL6.ts` (20–21, 129–130), `src/i18n/content/pt/templatesL6.ts` (18, 114), `es/templatesL6.ts` (18, 114), `pt/templatesL7.ts` (56), `es/templatesL7.ts` (56), `src/i18n/content/contentResolver.ts` (~101), `pt/musicTerms` fixes in `src/i18n/content/musicTerms.ts`, new parity test `src/i18n/content/__tests__/templateParity.test.ts`.
- [ ] fillTemplate: support/strip `{accidental}` (root already carries it) — fixes EN "Gb{accidental}" prompts.
- [ ] pt/es templatesL6: re-translate Neapolitan + German-sixth prompts/hints to mirror current EN (kills the PT/ES-only mis-grading).
- [ ] pt/es templatesL7[l7u21m2][0]: convert to the EN multiple-choice phrasing with translated choice labels.
- [ ] contentResolver: apply translated `choices` to ear_training exercises too (L3 e_ear1–4).
- [ ] musicTerms: `diminished7` → 'sétima diminuta'/'séptima disminuida'; `dominant7` → 'sétima da dominante'/'séptima de dominante'; fix modal gender agreement at the consuming templates (reword to "o modo {scaleType}" / "el modo {scaleType}").
- [ ] New test: for every level×lang, every overlay template index exists in EN, same exercise type, no unfilled `{tokens}` in a sample generation. Gates green; commit.

## Commit 4 — integration wiring
**Files:** `src/utils/queryExecutor.ts` (rewrite), `src/components/panels/CurrentChordPanel.tsx` (169), `src/components/panels/LearnMoreButton.tsx`, new `src/data/qualityToModule.ts`, `src/components/learn/exercises/inputs/InstrumentInput.tsx`, `src/components/instruments/Piano.tsx` + `Fretboard.tsx` (consume highlightedNotes + suppress degree colors in exercise mode), `src/state/slices/instrumentSlice.ts` (exercise-input flag), `src/components/learn/ModuleView.tsx` (nested buttons, ~207–446), `src/components/layout/AppShell.tsx` (scroll reset on view change), `src/components/navigation/QuickSearch.tsx` (label dup), `src/data/songReferences.ts` (l1u2 meter songs → l2u6m1/l4u14m2; Hallelujah context), `vite.config.ts` (runtimeCaching + drop vestigial patterns), `src/components/learn/LevelAchievement.tsx` + `ModuleView.tsx` (celebrationSound .catch), `src/components/learn/ReviewQueue.tsx` (now tick), `src/state/progressStore.ts` (uncompleteModule clears schedule).
- [ ] queryExecutor rewritten on core parsers, setView FIRST; tests for the previously-failing query classes (C7alt, slash, dim7, m7b5, 13ths, altered scale, rootless scale, "key of A minor", chord queries actually selecting).
- [ ] Static quality→module map per integration-audit table; LearnMoreButton consumes it (fallback: existing fuzzy search); test.
- [ ] InstrumentInput: highlight wired into instruments, degree-color suppression during exercises, newly-added-notes-only toggle (dyad fix); tests where feasible.
- [ ] ModuleView task rows restructured (no button-in-button) — React error gone.
- [ ] Scroll container resets on view/module change.
- [ ] PWA: cache StaffNotation/StaffNotationSkeleton/notationHelpers/celebrationSound chunks; remove PlayView/songReferences vestiges.
- [ ] Gates green; commit.

## Commit 5 — dead code purge + tooling
**Files:** delete 20 dead `src/core/` files (gamification.ts, midi.ts, glossary.ts, educationalContent.ts, modes.ts, progressionBuilder.ts, progressionPatterns.ts, guitarScaleTypeMap.ts, enharmonics.ts+test, noteColors.ts, keyRelationships.ts, progressionParser.ts, guitarVoicings.ts, reverseScaleParser.ts, normalizers.ts, slashChordParser.ts, shareUrl.ts+tests, intervalParser.ts, earTrainingGenerator.ts, queryDetection.ts), `src/components/learn/LevelIcon.tsx`, empty `src/components/shared/`, `paletteAlt` in `src/design/tokens/palette.ts`, conceptTagger + exerciseSelector weighting branch simplification; `eslint.config.js` (include src/core, fix fallout), `tsconfig.app.json` (enable noUnusedLocals/Params, fix fallout), `package.json` (+tsx devDep), the 2 unused eslint-disables, `ChordBuilderPanel.tsx:222` hex → token.
- [ ] Verify zero-importer proof per file before each deletion (grep); delete; gates green (tsc catches stragglers); commit.

## Commit 6 — security/platform
**Files:** delete `public/_headers`; create `vercel.json` (CSP per security audit, X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy); `npm audit fix` (vitest/vite chain); `src/components/ErrorBoundary.tsx` (Reset-app-data button); `src/state/progressStore.ts` + `src/state/store.ts` (shape-validate rehydrated state, fall back to defaults); `vite.config.ts` (devOptions.enabled false); delete `firebase-debug.log`, `Codex review.md`, empty `.env.example`/`.env.local`.
- [ ] Gates green + `npm audit --omit=dev` still 0; commit.

## Commit 7 — accessibility
**Files:** root/scale selector component(s) (restore accessible names), `src/components/theory/CircleOfFifths.tsx` (role/aria/keyboard on wedges — pragmatic pass), `ChordWorkspace.tsx` (aria-pressed on mode tabs).
- [ ] Verify with a fresh read_page a11y snapshot afterward; gates green; commit.

## Commit 8 — docs + e2e
**Files:** rewrite `CLAUDE.md` (counts, owned core, component map, themes); create `README.md`; delete `MANUAL.md`, `ROADMAP.md`, `AUDIT_TRACKER.md`; annotate `docs/superpowers/ws5-audit/CORE-ESCALATION.md` + `REMEDIATION.md` headers (B-items fixed in WS6); remove stale untracked handoff doc; fix `e2e/pwa.spec.ts` title/manifest expectations.
- [ ] Gates green; run e2e if Playwright browsers present; commit.

## Final verification
- [ ] `npx tsc -b --force` exit 0; `npx vitest run` all green; `npm run build`; `npm run audit:all` — engine findings 0 (B# fixed), INFO about INTERVAL_LABELS[8] gone; `npx eslint .` 0 errors.
- [ ] Browser pass: Explore degree→chord→staff→instruments; Try-This from a module (chord query selects); Learn-about-this lands on the right module; exercise instrument input highlights; QuickSearch C7alt; PT spot-check of a fixed module; theme day/night; no console errors.
- [ ] Push branch `ws6-hardening` (preview deploy only — NO merge to main).
