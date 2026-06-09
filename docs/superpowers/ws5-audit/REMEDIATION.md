# WS5 Audit — Consolidated Remediation List (L1–L9)

Consolidation of the nine per-level music-theory correctness audits (`L1.md`–`L9.md`) into a single
categorized remediation list.

**Categorization rule (applied to every finding):**
- **Category A — App-side fixable (our work queue).** Correct fix lives in EDITABLE code: `src/data/exercises/templatesL*.ts`, `exercisesL*.ts`, `exerciseGenerator.ts`, or the validator/helper files under `src/components/learn/exercises/`. These are wrong/unanswerable answer keys, templates mapped to the wrong module, prompts that don't match their graded answer, hint text that contradicts the answer, etc.
- **Category B — Core (read-only, escalate).** Root cause is under `src/core/` — ALL `curriculumL*.ts` teaching/explanatory/task/hint text, and the engine maps in `chords.ts` / `intervals.ts` / `scales.ts` / `modes.ts` / `notes.ts`. `src/core/` is shared with another project and MUST NOT be edited here. Each B item notes whether an app-side mitigation exists.
- **Category C — Editorial / convention-dependent (Nuno decides).** "Questionable"-severity items where reputable sources legitimately differ. Surfaced, not "fixed."
- **Nitpicks** — rolled up, lowest priority.

**File-location ground truth (verified in repo):**
- `src/core/constants/`: ALL `curriculumL1–L9.ts`, `chords.ts`, `intervals.ts`, `scales.ts`, `modes.ts`, `notes.ts` → **B (read-only)**.
- `src/data/exercises/`: `templatesL1–L9.ts`, `exercisesL1–L9.ts`, `exerciseGenerator.ts`, `exerciseTemplates.ts` → **editable (A)**.
- `src/components/learn/exercises/`: `validateExercise.ts`, `exerciseHelpers.ts` → **editable (A)**; these are the display/grading sites where a core label (e.g. `INTERVAL_LABELS[8]`) can be overridden app-side.

---

## Summary table — counts per level and category

| Level | Errors | Questionable | Nitpicks | → Cat A | → Cat B | → Cat C | → Nitpick |
|---|---|---|---|---|---|---|---|
| L1 | 1 | 3 | 4 | 1 | 0 | 2 | 5 |
| L2 | 1 | 4 | 3 | 0 | 1 | 4 | 3 |
| L3 | 3 | 4 | 4 | 1 | 2 | 4 | 4 |
| L4 | 3 | 2 | 3 | 2 | 1 | 1 | 4 |
| L5 | 5 | 2 | 3 | 5 | 0 | 2 | 3 |
| L6 | 2 | 3 | 3 | 1 | 2 | 2 | 3 |
| L7 | 3 | 4 | 3 | 2 | 1 | 4 | 3 |
| L8 | 0 | 2 | 3 | 0 | 0 | 2 | 3 |
| L9 | 2 | 7 | 4 | 1 | 1 | 7 | 4 |
| **Total** | **20** | **31** | **30** | **13** | **8** | **28** | **32** |

Notes on the crosswalk:
- The single recurring core defect `INTERVAL_LABELS[8]='Augmented 5th'` is raised by **six** levels (L1 NITPICK-4, L2 E1, L4 N1, L6 Q3, L7 N2, L9 E1). It is counted as **one** Category B line item (B1) below, with the per-level references listed there. Its per-level appearances are therefore NOT double-counted in the "→ Cat B" column except once (under L2, the level that rates it an ERROR); the other levels' raises of the same constant are reflected in their own rows as the severity that level assigned (mostly nitpick), and cross-referenced in B1.
- "→ Cat A/B/C/Nitpick" columns re-bin each level's raw findings by where the fix lives, so they re-slice the Errors/Questionable/Nitpicks columns rather than adding to them.
- L4 E2 is one finding covering three mis-mapped template modules (`l4u14m3/m4/m5`); counted as one Cat A line (A item) but is three module re-targets of work.
- L5 E1 + E5 describe the same systemic 8-module misalignment; E5 is the most-visible instance of E1. Counted as the E1 block (one Cat A line) with E5 folded in.

---

## Category A — App-side fixes (work queue)

Ordered by severity (errors first), then by level. Every item here has its fix in editable, non-core code.

### Errors

**A1. L5 — Template/curriculum module misalignment, Units 16–17 (8 modules mis-keyed).**
- **File / id:** `src/data/exercises/templatesL5.ts` lines ~246–528, moduleIds `l5u16m2, l5u16m3, l5u16m4, l5u16m5, l5u17m1, l5u17m2, l5u17m3, l5u17m4` (L5 E1 + E5).
- **What's wrong:** Template `moduleId`s assign topics in a different ordering than `curriculumL5.ts`. The generator keys output by `moduleId` (verified: `generateAllForLevel`/`mergeExerciseMaps` in `exerciseGenerator.ts:223–248`), so 8 of 14 modules serve generated exercises bolted to the wrong lesson (e.g. "Binary and Ternary Forms" `l5u17m1` gets mode-mixture/borrowed-chord questions; "Texture" `l5u17m3` gets rondo/variations; "Guide Tone Lines" `l5u17m4` gets sonata form). Theory inside each block is correct; only the module attachment is wrong.
- **Fix:** Re-key the Unit 16–17 template blocks to the curriculum's module→topic map (Closely Related Keys → `l5u16m2`; Direct/Common-Tone/Chromatic → `l5u16m3`; Mode Mixture → `l5u16m4`; Picardy/Chromatic-Mod → `l5u16m5`; Binary/Ternary → `l5u17m1`; Song/Large Forms → `l5u17m2`; Texture → `l5u17m3`; Guide Tone → `l5u17m4`). Also note coverage gaps that fall out of the same defect (no template for the real `l5u16m3` split, none for Song Forms / Sonata as sequenced). i18n PT/ES overlays inherit the misalignment (keyed by same IDs) — re-key those too.
- **Severity:** error. **Confidence:** high.

**A2. L4 — Counterpoint templates mapped to non-counterpoint modules (3 modules).**
- **File / id:** `src/data/exercises/templatesL4.ts`, moduleIds `l4u14m3, l4u14m4, l4u14m5` (L4 E2).
- **What's wrong:** `l4u14m3` generates 3rd-species counterpoint but the module is "Chromatic Embellishment"; `l4u14m4` generates 4th-species/suspension but the module is "Roman Numeral Analysis Practice"; `l4u14m5` generates 5th-species but the module is "Minor Key Harmony in Detail." Unit 14's only counterpoint module is `l4u14m1`. Generator keys strictly by `moduleId`, so topic-to-module mapping is wrong. (The counterpoint statements inside the templates are themselves sound — the defect is placement.)
- **Fix:** Re-target these three template configs to their actual module topics (chromatic NCTs; Roman-numeral analysis; minor-key harmony), OR, if 3rd/4th/5th species are intended curriculum, add the corresponding modules so IDs line up.
- **Severity:** error. **Confidence:** high.

**A3. L5 — `l5u15m2` chord_build template: prompt asks for a secondary dominant, generates a dom7 on the key tonic with no target named.**
- **File / id:** `src/data/exercises/templatesL5.ts` lines ~60–70, moduleId `l5u15m2`, first template (L5 E2).
- **What's wrong:** Prompt "Build the secondary dominant chord that tonicizes the given target in {root} major." `{root}` is filled with the chord's own root and the answer is a dom7 built on that same root. So root `C` → "in C major", answer C7; root `G` → "in G major", answer G7 — but G7 IS the primary V7 of G major, not a secondary dominant. No target ever appears in the rendered prompt; the hint ("a P5 above the target") contradicts the generated answer. Answer rule holds for no parameter value.
- **Fix:** Either name an explicit target + fixed key and build the dom7 a P5 above it; or use a self-consistent prompt ("Build a {root} dominant 7th chord", move V7/x labelling to the hint); or convert to multiple-choice (the hand-authored `l5u15m2` items already do this correctly).
- **Severity:** error. **Confidence:** high.

**A4. L5 — `l5u16m4` scale_build template builds the {root} major scale itself, not a *related* key.**
- **File / id:** `src/data/exercises/templatesL5.ts` lines ~309–319, moduleId `l5u16m4`, first template (L5 E3).
- **What's wrong:** Prompt "Build the major scale of a closely related key to {root} major." `{root}` binds to the build target, so the generated answer is the {root} major scale — i.e. the key itself, which is never "closely related to" itself. Wrong for all six roots. (Also under the wrong module per A1 — topic belongs at `l5u16m2`.)
- **Fix:** `scale_build` cannot reference a key distinct from the scale built. Use multiple-choice (the second template in this block already does this correctly), or drop the scale_build template. If retained, prompt must be "Build the {root} major scale" with no "closely related" framing.
- **Severity:** error. **Confidence:** high.

**A5. L5 — `l5u17m1` chord_build template labels the borrowed chord's root as the *key* ("...in Ab major", "...in Cb major").**
- **File / id:** `src/data/exercises/templatesL5.ts` lines ~383–393, moduleId `l5u17m1`, first template (L5 E4).
- **What's wrong:** Prompt "Build the borrowed chord from the parallel minor in {root} major." with effective roots Ab/Eb/Db/Gb/Cb/F. `{root}` = chord root + accidental, so prompts render "in Ab major", "in Cb major" — incoherent (Ab is the *chord*, C is the *key*). The hint inherits the defect ("In Ab major, lower the 3rd..."). Wrong for every value. (Also under the wrong module per A1 — belongs at `l5u16m4`.)
- **Fix:** Fix the key reference to a constant (e.g. always "C major") and choose roots that are genuine parallel-minor borrowings in that key; cleanest is multiple-choice (the second template in this block — "The bVI chord in C major is Ab major" — is correct), or a chord_build prompt without naming a key ("Build Ab major (the bVI borrowed chord)").
- **Severity:** error. **Confidence:** high.

**A6. L1 — Generated `scale_degree_id` exercises are unanswerable; graded answer is arbitrary.**
- **File / id:** `src/data/exercises/templatesL1.ts` lines 255–265, module `l1u3m1`, 2nd template; generator branch `src/data/exercises/exerciseGenerator.ts` lines 115–134 (`buildConfig` scale_degree_id) and 165–169 (`fillTemplate` scale_degree_id) (L1 ERROR-1).
- **What's wrong:** Prompt "In the {root} {scaleType} scale, identify the scale degree of the given note." The generator sets `correctDegree = pick([1..7])` at random and `note = roots[idx]` ("placeholder — overridden below") which is never overridden. `fillTemplate` substitutes only `{root}/{scaleType}/{degree}` (no `{note}` token), and `ExercisePrompt.tsx` renders staff notation only for `note_id`/`interval_id`, returning null for `scale_degree_id`. So no note is shown; validation compares the user's pick to a `correctDegree` unrelated to any displayed note. Unanswerable for every seed. (Hand-authored `l1u3m1e_deg1..4` are correct — they name the note in the prompt.)
- **Fix:** State the note in the prompt — resolve degree → actual note via `buildScale(root, scaleType)[degree-1]` and inject it, or restate as "what note is degree N of {root} {scaleType}?"; or have the generator compute and display the note for the chosen degree. As written, fix or remove the template.
- **Severity:** error. **Confidence:** high.

**A7. L3 — Wrong interval label in worked SATB voicing.**
- **File / id:** `src/core/constants/curriculumL3.ts`... **→ see B2.** *This is a Category B item (curriculum prose under `src/core/`). Listed here only as a pointer; it is NOT app-side. The arithmetic (alto-tenor G3→E4 = major 6th, not major 3rd) is fixed in core.*

**A8. L4 — 2-3 bass suspension stated to resolve UPWARD (resolves downward).**
- **File / id:** `src/data/exercises/templatesL4.ts` line ~21, module `l4u12m1`, `hintTemplate` (L4 E1).
- **What's wrong:** Hint reads "The bass suspension 2-3 resolves upward." Every standard suspension resolves DOWN by step; the 2-3 is the bass form (bass descends, interval above grows 2nd→3rd). The accompanying `curriculumL4.ts` text states it correctly — the template contradicts its own curriculum.
- **Fix:** "The bass suspension 2-3 resolves **downward** (the bass descends by step; the interval above the bass grows from a 2nd to a 3rd)."
- **Propagation (also app-side, editable):** same error in the PT/ES overlays — `src/i18n/content/pt/templatesL4.ts` line 20 ("...resolve para cima") and `src/i18n/content/es/templatesL4.ts` line 20 ("...resuelve hacia arriba"). Re-derive both when the English source is fixed.
- **Severity:** error. **Confidence:** high.

**A9. L7 — Chromatic turnaround task: bass-motion gloss is self-contradictory.** *(Curriculum prose — see B5. NOT app-side; the fix is in `curriculumL7.ts` under `src/core/`. Pointer only.)*

**A10. L7 — "Andalusian cadence" mislabelled.** *(Curriculum prose — see B6. NOT app-side; fix is in `curriculumL7.ts`. Pointer only.)*

**A11. L9 — Harmonic-interval template hint omits the perfect 5th from its consonance list.**
- **File / id:** `src/data/exercises/templatesL9.ts`, module `l9u30m5` (Harmonic Intervals), the single `interval_id` template's `hintTemplate` (L9 E2).
- **What's wrong:** Played `intervals: [3,4,5,7,8,9,12]` but the hint says "Consonances (3,4,5,8,9,12) ... Dissonances (1,2,6,10,11)". Value **7 (perfect 5th)** is in the played set but in neither list — leaving the most consonant interval (after P1/P8) unclassified, and inconsistently listing P4 (5) as a consonance while dropping P5 (7).
- **Fix:** Consonance list should be `(3,4,5,7,8,9,12)` — add 7. Dissonances `(1,2,6,10,11)` are correct as written.
- **Severity:** error. **Confidence:** high.

### Errors where the *independently fixable* part is app-side but the root mirror is core

**A12. L4 — Cut time "same number of quarter notes as 4/4" (exercise hint).**
- **File / id (app-side part):** `src/data/exercises/exercisesL4.ts`, `l4u14m2e3`, hint (L4 E3). *(Mirrored in `curriculumL4.ts` `l4u14m2` concept — that mirror is Category B, see B-note under B3. The exercise hint itself is editable here.)*
- **What's wrong:** Hint "Cut time (alla breve) is 2/2... While it contains the same number of quarter notes as 4/4... a faster tempo feel at the same tempo" conflates duration, beat-count, and tempo (a 2/2 and a 4/4 bar share total duration; what changes is the beat unit, half vs quarter).
- **Fix:** "Cut time (alla breve) is 2/2: two half-note beats per measure. A 2/2 bar has the same total duration as a 4/4 bar, but it is counted in 2 (half-note beat) rather than 4 (quarter-note beat), giving a broader, faster-moving feel."
- **Severity:** error (low-impact). **Confidence:** medium (defensible as written about durations; flagged for the conflation).

### Mitigation-side entries for the recurring core label (optional app-side override)

**A13. (Mitigation for B1) Override `INTERVAL_LABELS[8]` at the two app-side consumption sites.**
- **File / id:** `src/components/learn/exercises/validateExercise.ts` `getIntervalLabel` (lines 108–109) — feedback string; and `src/components/learn/exercises/exerciseHelpers.ts` `generateIntervalChoices` (lines 55–56, 80) — MC choice labels. Both files are editable and already import `INTERVAL_LABELS` from core.
- **What this fixes:** The core bug `INTERVAL_LABELS[8]='Augmented 5th'` (and `INTERVAL_SHORT_LABELS[8]='#5'`) surfaces "Augmented 5th" as the correct-answer feedback/choice for 8-semitone interval items that the curriculum teaches as a **minor 6th** (acute in L9, which is the only level that drills bare m6 by ear; latent in L2 templates that range over 8). The correct value "Minor 6th" already exists in `chords.ts` as `minor6` (line 198) but under a different key.
- **Mitigation:** add a small app-side label-override map (e.g. `{8: 'Minor 6th'}`) consulted before falling back to `INTERVAL_LABELS`, applied in both consumers, without editing core. This resolves the learner-facing symptom for every level. **Decision needed:** whether to mitigate app-side now or escalate the core fix (see B1). Editorial nuance (is 8-semitone ALWAYS "minor 6th" vs aug-5th in augmented-chord display contexts, e.g. L7 #5/b13) overlaps C7 — confirm before hard-coding.
- **Severity:** error symptom (per L9). **Confidence:** high (mechanism + override site verified).

---

## Category B — Core (escalate to the shared-core owner)

`src/core/` is read-only here. Each item: file, what's wrong, correct value, and app-side-mitigation note.

### B1. RECURRING — `INTERVAL_LABELS[8] = 'Augmented 5th'` should be 'Minor 6th' (and `INTERVAL_SHORT_LABELS[8] = '#5'`).
- **File:** `src/core/constants/chords.ts` line 425 (`8: 'Augmented 5th'`) and line 452 (`8: '#5'`).
- **What's wrong:** In a generic interval-ID context, 8 semitones is canonically a **minor 6th**; "augmented 5th" is the chord-context enharmonic spelling. The engine is internally inconsistent: `SEMITONES_TO_INTERVAL[8]` returns `{minor, 6}` and `minor6:'Minor 6th'` already exists in the same file (line 198), yet `INTERVAL_LABELS[8]` reads "Augmented 5th" while 9/10/11 correctly read Major 6th / Minor 7th / Major 7th.
- **Correct value:** `INTERVAL_LABELS[8] = 'Minor 6th'`, `INTERVAL_SHORT_LABELS[8] = 'b6'` (engine-side), to agree with `SEMITONES_TO_INTERVAL[8]`.
- **Levels touched:** **L9 E1 (ERROR — active, m6 ear-training feedback)**, **L2 E1 (ERROR — l2u7m1/l2u7m2 templates range over 8)**, L1 NITPICK-4 (out of L1 scope, recorded), L4 N1 (nitpick), L6 Q3 (questionable), L7 N2 (nitpick). Six levels raise it; severity rises to ERROR exactly where 8 is drilled/generated (L2, L9).
- **App-side mitigation: YES** — override the label for semitone 8 at the two editable consumers (`validateExercise.ts:getIntervalLabel`, `exerciseHelpers.ts:generateIntervalChoices`). See A13. This fully resolves the learner-facing symptom without a core edit. A *spelling-aware* label (true aug-5th when the upper note is a raised 5) would require passing the upper-note spelling into the validator — a core redesign, not needed for the levels in scope.

### B2. L3 — Wrong interval label in worked SATB voicing (alto-tenor "major 3rd").
- **File:** `src/core/constants/curriculumL3.ts`, module `l3u10m1`, task `l3u10m1t1` (line ~286) (L3 E1).
- **What's wrong:** "alto-tenor gap (a major 3rd — under an octave)." Alto E4 down to tenor G3 = G3→E4 = 9 semitones = a **major SIXTH**, not a major 3rd. (Soprano-alto E4→C5 = 8 st = minor 6th, correctly labeled.)
- **Correct value:** "alto-tenor gap is **a major 6th**." Fold in the N1 nitpick: tenor-bass C2→G3 is literally a perfect 12th (compound P5), so "a perfect 5th" is the mod-octave class only.
- **App-side mitigation: NO** — it is teaching prose in a core curriculum file; no app display site can rewrite the sentence.

### B3. L3 — SATB voice ranges stated three inconsistent ways (and one variant is in a template, which is editable).
- **Files:** `src/core/constants/curriculumL3.ts` `l3u10m1` concept (line ~263): Alto F3–C5, Bass E2–C4. `src/data/exercises/templatesL3.ts` `l3u10m1` hintTemplate (line ~174): Alto F3–**D5**, Bass E2–**D4**. `src/data/exercises/exercisesL3.ts` `l3u10m1e1` (line ~319): soprano-only, consistent (L3 E3).
- **What's wrong:** Alto top and bass top differ between the core concept (C5/C4) and the template hint (D5/D4) for the same module. Presented as fact, they conflict.
- **Correct value:** Pick one convention and use it in all three. (Specific octave bounds are convention-dependent — see C; the *error* is the internal contradiction.)
- **App-side mitigation: PARTIAL** — the `templatesL3.ts` hint (D5/D4) is **editable**, so the contradiction can be removed app-side by aligning the template hint to whatever the core concept states. The core concept text itself cannot be changed here. So: reconcile by editing the template to match core (app-side), and flag that the chosen bounds are an editorial call (C).
- **B-note (L4 E3 mirror):** the cut-time concept in `curriculumL4.ts` `l4u14m2` ("same written notes as 4/4 but felt in 2") is the core mirror of A12; the exercise-hint half (A12) is app-side-fixable, the concept half is core and carries the same correction (B, no mitigation beyond the exercise hint).

### B4. L6 — Diminished-7th "Four Possible Resolutions": "(strictly Bbb minor)" parenthetical is incoherent.
- **File:** `src/core/constants/curriculumL6.ts`, module `l6u19m1`, concept "Four Possible Resolutions" (lines 256–262) (L6 E2).
- **What's wrong:** "Respell as Ab-Cb-Ebb-Gbb: resolves to A minor (strictly Bbb minor; ...)." No Bbb is in the chord and nothing points to a "Bbb minor" tonic; the leading tone to A is Ab(=G#). The clean reading respells B-D-F-Ab as G#-B-D-F.
- **Correct value:** "...Respell the original chord as G#-B-D-F (G# as leading tone): resolves to A minor. The four target tonics — C, Eb, Gb, A — are each a minor third apart." Drop the "Bbb minor" parenthetical.
- **App-side mitigation: NO** — core teaching prose.

### B5. L7 — Chromatic turnaround bass-motion gloss self-contradictory.
- **File:** `src/core/constants/curriculumL7.ts`, module `l7u21m6`, task `l7u21m6t3` (line 333) (L7 E2).
- **What's wrong:** Chords Cmaj7–Eb7–Ab7–Db7, glossed "bass descends chromatically by minor thirds and fourths: C–Eb–Ab–Db." The line **ascends** (C→Eb up m3; Eb→Ab, Ab→Db up P4s) and is **not chromatic** (chromatic = by half-step). (The tritone-sub identifications in the same sentence are correct.)
- **Correct value:** Drop "descends chromatically." State: roots C-Eb-Ab-Db move by ascending minor 3rd then two ascending perfect 4ths.
- **App-side mitigation: NO** — core task text.

### B6. L7 — "Andalusian cadence" attached to the wrong four chords.
- **File:** `src/core/constants/curriculumL7.ts`, module `l7u23m1`, concept "Common Pop Progressions" (~line 644) (L7 E1).
- **What's wrong:** "i-bVI-bIII-bVII 'Andalusian' cadence." The Andalusian cadence is **i-bVII-bVI-V** (descending tetrachord to the dominant). i-bVI-bIII-bVII has no V and is the minor/vi-rotation of the I-V-vi-IV "Axis" loop.
- **Correct value:** Either rename to the actual Andalusian cadence **i-bVII-bVI-V**, or keep i-bVI-bIII-bVII and relabel it (e.g. "minor Axis / vi-rotation of I-V-vi-IV"). Web-verified (Wikipedia, StudyBass, Chordly).
- **App-side mitigation: NO** — core concept text.

### B7. L7 — `dominant7alt` engine formula carries only 2 of 4 alterations; `C7alt` "Try This" contradicts the taught content.
- **File:** `src/core/constants/chords.ts` line 82: `dominant7alt: [0,4,6,10,13]` = R,3,b5,b7,b9 (only b5+b9; omits #9 and #5/b13).
- **What's wrong:** L7 text repeatedly (and correctly, per canon) defines the alt chord with ALL four alterations and tells students to type `C7alt` to observe it; the engine renders C-E-Gb-Bb-Db, missing #9 and #5/b13. Internally inconsistent at the moment of the "Try This." (Pervasive across `l7u21m1/m2`, `l7u23m3/m5` text and `tryThisQuery` cues; exercise `l7u21m1e3` answer text is canonically correct but contradicts the rendered chord — L7 E3, Q3.)
- **Correct value:** Engine call — expand `dominant7alt` toward canonical altered content (commonly R-3-b7 + b9-#9-#11-b13, often rootless/5th-omitted), OR (the alternative is app-side) soften the L7 text so it doesn't promise alterations the rendered chord lacks. **But the L7 text is ALSO core** (`curriculumL7.ts`), so neither half is editable here.
- **App-side mitigation: NO** (both the engine formula and the L7 prose are under `src/core/`). Escalate; the `tryThisQuery: 'C7alt'` cues will otherwise mislead.

---

## Category C — Editorial / convention-dependent calls for Nuno

Grouped by theme. These are NOT proposed changes — reputable sources differ; pick a convention.

### Theme 1 — Interval/chord labelling & enharmonic spelling conventions
- **C1. L1 Q2 — `note_id` treble template octave range.** `templatesL1.ts` `l1u1m1`, octaves `[4,5]`: C4/D4 fall below the treble staff (ledger lines) while the prompt says "on the treble clef staff." Answer still correct (octave ignored). *Convention/sequence call:* restrict octaves to staff range, or soften wording ("treble staff or its ledger lines"). Module is "The Staff and Clefs"; ledger lines introduced next module. (Editable file, but it's a wording/sequence judgment, not a wrong key — hence C, not A.)
- **C2. L1 Q1 / Q3 — "count letter names" interval prompts & hard-coded note counts.** `templatesL1.ts` interval (`l1u3m3`) prompt asks to count letter names but grading is semitone-only; build prompts hard-code "7 notes"/3-note text. No L1 instance mis-grades (latent only). *Call:* whether to drop the "count letter names" instruction / derive counts. No action needed for L1 as shipped.
- **C3. L2 Q1 — B-augmented requires a double-sharp (B-D#-F##).** `templatesL2.ts` `l2u7m3`. Spelling is correct (F## keeps one letter per tone). *Call:* whether to expose a double-sharp at L2, or drop B / augmented-on-B from the range. UX/pedagogy, not correctness.
- **C4. L2 Q3 — tritone at 6 semitones forced to one spelling/label.** `INTERVAL_LABELS[6]='Tritone'` (core) + `l2u7m1/m2`. "Tritone" is legitimate and module teaches it; the aug4/dim5 distinction the concept text raises is never *exercised*. *Call:* leave as is, or add aug4/dim5 spelling practice. No correction required.
- **C5. L3 Q1 — "III+maj7" augmented-major-7 naming.** `curriculumL3.ts` `l3u9m4`. Spelling/quality correct (C-E-G#-B); some texts treat III+ as non-functional / spell the 5th differently. *Call:* naming-convention sensitivity only.
- **C6. L3 E3 / SATB range bounds.** Which textbook SATB ranges to standardize on (Laitz/Clendinning etc.). The *internal contradiction* is a fix (B3/app-side template align); the *choice of bounds* is editorial.

### Theme 2 — Jazz / modal naming & derivation conventions (L7)
- **C7. L7 Q1 — back-door dominant "tritone sub of E7 (V7/vi)" derivation.** Arithmetically true but non-standard; usual derivation is parallel-minor / dominant-of-bIII, sharing guide tones with an altered V (G7), not E7. *Call:* keep or re-derive.
- **C8. L7 Q2 — "9sus4/7sus4 on the 5th of a minor chord = Dorian flavor."** Loose/backwards phrasing; usual statement is V9sus substituting for ii. *Call:* keep shorthand or tighten.
- **C9. L7 Q4 — modal "gravity chord" recipes** ("Lydian → I, II, vii"; "Dorian → i, II, IV"). Characteristic-chord emphasis is debatable (Lydian II, Dorian major-IV are the strong signatures). *Call:* emphasis, not error.
- **C10. L7 N3 — "Hindu scale" alias for Mixolydian b6.** Defensible but the least-standardized of the three aliases. *Call:* keep/drop.

### Theme 3 — Solfège & pedagogy-position statements (L9)
- **C11. L9 Q5 — movable-do vs fixed-do framing.** `curriculumL9.ts` `l9u32m4`: "fixed-do ... does not train functional hearing the same way" is a pedagogical *position* stated as fact; "Kodály/Berklee" lumping is a simplification. *Call:* soften/attribute.
- **C12. L9 Q6 — do-based vs la-based minor solfège mixed.** Each instance is internally correct; the module commits to do-based minor but offers one la-based gloss. *Call:* pick one convention and state it.
- **C13. L9 Q7 — m6 (8) listed as a "consonance."** Defensible (imperfect consonance) but some texts treat the 6th as contextually dissonant. Lower priority than the P5 omission (A11). *Call:* footnote or leave.

### Theme 4 — Reference-song mnemonics (L9) — needs verification, not theory
- **C14. L9 Q1–Q4 — opening-interval song mnemonics** (`curriculumL9.ts` `l9u30m3`/`m4`): ascending small (Jaws m2, Happy Birthday M2, Greensleeves m3, When the Saints M3, Here Comes the Bride P4, Simpsons TT, Twinkle P5); descending (Hey Jude m3, Mary Had a Little Lamb M2); descending P5 = Feelings; large (Love Story m6, My Bonnie M6, Somewhere/WSS m7, Take On Me M7, Over the Rainbow P8). Auditor could not verify each song's literal *opening* interval; flagged, not asserted wrong. *Call/action:* a web-verified pass to confirm each opening interval (Happy Birthday's M2 is not literally the first interval — repeated note then M2 — minor concern).

### Theme 5 — Post-tonal & analysis convention (L8)
- **C15. L8 Q2 — prime-form algorithm stated as universal (Forte vs Rahn).** `curriculumL8.ts` `l8u27m1` concept 2: presents one "most packed to the left" algorithm (= Rahn) as *the* method; Forte/Rahn diverge for a handful of hexachords (none used in L8). *Call:* add a one-clause caveat naming both conventions, or leave (awareness-level module).
- **C16. L8 Q1 — Z-relation task conflates inversional equivalence with the Z-relation.** `curriculumL8.ts` `l8u27m1t3` + template hint (`templatesL8.ts` `l8u27m2`: "Sets with the same interval vector are Z-related"). [0,1,4] and [0,3,4] are *inversions* (same set class 3-3), not a Z-pair; the pedagogy walks the student into the misconception. *Note:* the template-hint half ("same interval vector are Z-related") is **editable** (`templatesL8.ts`) and could be tightened app-side ("...that are NOT related by transposition or inversion are Z-related"); the task text `l8u27m1t3` is core. Mixed — surfaced under C because the right pedagogical framing is a judgment, but the template-hint correction is a concrete app-side option if Nuno wants it.
- **C17. L5 Q1 — "vii°7/x more common in minor, viiø7/x more common in major."** `curriculumL5.ts` `l5u15m3`. Over-broad for *secondary* leading-tone chords (fully-dim is very common in major too). *Call:* soften per a chosen authority (Kostka/Payne).
- **C18. L5 Q2 — bVII "borrowed from parallel minor" (L5 text) vs "from Mixolydian" (Explore data).** `curriculumL5.ts` `l5u16m4` vs `progressionPatterns.ts`. Both valid sources; cross-surface labelling inconsistency. *Call:* optionally note bVII is shared with Mixolydian.
- **C19. L4 Q1 — second-species dissonance "passing OR neighbor tones."** `curriculumL4.ts` `l4u14m1`. Strict Fux permits only the passing tone in 2nd species; the module's own exercise `l4u14m1e3` states the strict rule. Some modern texts admit dissonant neighbors earlier. *Call:* tighten to strict species or leave (convention-dependent).
- **C20. L6 Q1/Q2 — inversion-prompt over-specification & common-tone dim7 spelling.** Q1: `templatesL6.ts` `l6u18m1` asks for "first inversion" but `validateChordBuild` checks pitch-class sets only (inversion invisible) — answer is pitch-correct, prompt over-specifies. *Note:* the over-specifying prompt/hint is **editable** (`templatesL6.ts`), so dropping "in first inversion"/"place the 3rd in the bass" is a concrete app-side option (would become an A item if Nuno wants the prompt to match what's graded); flagged C because "should inversion be assessed at all here" is a product call. Q2 (`curriculumL6.ts` `l6u19m2` CTo7 voice-leading spelling) is correct-as-is, core, no change recommended.

---

## Nitpicks (rolled up, lowest priority)

- **L1 N1** — `curriculumL1.ts` l1u1m4: chromatic ascent given all-sharps (conventional; correct). *Core.*
- **L1 N2** — `curriculumL1.ts` l1u1m3: "between most natural notes there's a note in between" — informal but accurate. *Core.*
- **L1 N3** — `exercisesL1.ts` l1u3m2e3 hint lists all seven sharps when only D-major's first two are at issue; harmless. *App-side, cosmetic.*
- **L2 N1** — `curriculumL2.ts` l2u4m2: "Subdominant (below dominant)" imprecise etymology (it is the 5th below tonic); module's own hint states it correctly. *Core.*
- **L2 N2** — `educationalContent.ts` degree-6 tooltip "submediant ... often used in minor keys" — vague half-truth. *Explore tooltip, not L2 curriculum.*
- **L2 N3** — `exercisesL2.ts` l2u7m1e1 "power chords / circle of fifths" hint — correct, checked. *App-side, no change.*
- **L3 N1** — `curriculumL3.ts` l3u10m1t1 "perfect 5th" for a compound 12th — fold into B2. *Core.*
- **L3 N2** — `curriculumL3.ts` l3u11m5 "Eb instruments sound a M6 lower" — correct for the alto sax named; loose as a class rule. *Core.*
- **L3 N3** — `curriculumL3.ts` l3u9m1t3 "only three distinct diminished seventh chords" — correct, slightly loose phrasing. *Core.*
- **L3 N4** — `exercisesL3.ts` l3u11m4e3 hint / `templatesL3.ts` l3u11m5 choiceSet: "all NCTs resolve to consonance" over-general for anticipations/pedals; keyed answer still correct. *App-side (template/exercise), low impact.*
- **L4 N1** — `chords.ts` `INTERVAL_LABELS[8]` — see **B1** (recurring). *Core.*
- **L4 N2** — `templatesL4.ts` l4u12m2 hint "both [appoggiatura and escape tone] are typically accented" — wrong for the escape tone (unaccented); graded answers unaffected. *App-side, hint-text fix available* ("Appoggiatura: accented; Escape tone: unaccented").
- **L4 N3** — `curriculumL4.ts` l4u13m5 / `exercisesL4.ts` l4u13m5e1 / `templatesL4.ts` l4u13m4: descending-fifths chain has one diminished-fifth link (F→B) unremarked; correct as presented. *Core + app, optional clarification.*
- **L5 N1** — `curriculumL5.ts` stray trailing blank lines; cosmetic. *Core.*
- **L5 N2** — `curriculumL5.ts` l5u15m5 uppercase secondary-dominant numerals (III7 etc.) without a "V7/x" gloss — both conventions correct. *Core.*
- **L5 N3** — `exercisesL5.ts` l5u17m4e2 hint inverts which guide tone holds/moves; the *answer choice* is correct, only the hint prose wrong. *App-side, hint-text fix available.*
- **L6 N1/N2** — `templatesL6.ts` section banners / module-title-to-topic drift vs `curriculumL6.ts`; cosmetic, content correct. *App-side (template comments), cosmetic.*
- **L6 N3** — `curriculumL6.ts` l6u18m4 "five positions around the circle of fifths in one step" loosely describes C→Db. *Core.*
- **L7 N1** — `curriculumL7.ts` l7u22m5: Dm11 "quartal stack" / D5 "quintal" overstates a voicing the pitch-class-checking exercise can't enforce. *Core.*
- **L7 N2** — `chords.ts` `INTERVAL_LABELS[8]`/`SHORT[8]` — see **B1**. *Core.*
- **L7 N3** — `curriculumL7.ts` l7u23m3 "Hindu scale" alias — see C10. *Core.*
- **L8 N1** — `curriculumL8.ts` l8u25m2 "augmentation ... halving the tempo" — colloquial; tempo is unchanged, the theme unfolds at half speed. *Core.*
- **L8 N2** — `curriculumL8.ts` l8u27m3 "quintal ... inversionally equivalent to fourths" — true at ic level; standard shorthand. *Core.*
- **L8 N3** — `curriculumL8.ts` l8u27m4 Glass additive "4→5→6→8" skips 7; reads as a typo against "incremental." *Core.*
- **L9 N1** — `exercisesL9.ts` l9u30m3e1 "smallest interval in Western music" — true for 12-TET; microtonal exists. *App-side, pedantic.*
- **L9 N2** — `templatesL9.ts` l9u30m2 interval drill "major or minor?" in a chord-framed module — slight mismatch, no error. *App-side.*
- **L9 N3** — `curriculumL9.ts` l9u30m5 vs u30 milestone: 13th enumerated in one, not the other; cosmetic. *Core + core.*
- **L9 N4** — `exercisesL9.ts`/`templatesL9.ts` l9u30m5 "sound simultaneously" depends on audio-engine playback (not data). *App-side/UI, out of static scope.*

---

## Appendix — what the audits verified as CORRECT (no action)

For traceability: the audits machine-verified that **no scale-build or chord-build template emits a wrong-noted answer key for any parameter value** across L1–L9 (validation is by pitch-class set, and every root×quality/scale combination was checked or proven correct over its full range). All hand-authored multiple-choice answer keys checked were correct. L8 has **zero** errors (all set-theory/twelve-tone arithmetic recomputed by hand; orchestration transpositions and Goldberg/sonata facts web-verified). The errors that exist are concentrated in (a) template→module mis-mappings, (b) a small number of prompt/answer-rule defects in generative templates, and (c) explanatory/hint prose — not in the computed build answer keys.
