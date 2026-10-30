<!-- Saved by main session from the agent's SubagentHandback (agent Write was blocked by harness) -->
## Verification of Track B findings B-1 to B-29 (Learn L1-L5)

**Method.** I opened every cited file:line. I re-derived the theory by hand, reran `check_intervals`, `check_staff` and `check_degree` (exit 0, output byte-identical to the auditor's `out_*.txt`), and recomputed several counts with my own scripts in `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/verify/B/`. The one web source I checked was Wikipedia, "Tenor saxophone".

**Result.** 29 findings checked. 15 CONFIRMED and 14 PARTIAL. 0 REJECTED and 0 UNVERIFIABLE. No finding is invented. My disagreements are about scope (B-5), wording (B-15, B-17) and severity.

| ID | Verdict | Severity (agree / suggest) | Reason |
|---|---|---|---|
| B-1 | CONFIRMED | agree S1 | `ExercisePrompt.tsx:49-62` indexes a sharps-only table by semitone. For `l2u7m1e2` (3 semitones from C), `NATURALS[3]`/`ACCIDENTALS[3]` gives D#, so "C up to Eb" is drawn C to D#. D# is a letter-name 2nd, so an augmented 2nd, keyed "Minor 3rd". The 9/29 and 67/302 counts reproduce. |
| B-2 | CONFIRMED | S1 / **S2** | `exercisesL1.ts:176` is right on theory: C to C# is an augmented unison. It is one authored item. The hint frames it as one half step, and the option list (derived from `generateIntervalChoices`) has no better answer. Fix is a one-word prompt change. |
| B-3 | CONFIRMED | S1 / **S2** | I recomputed the scope by hand. A3 draws in bass clef on the top line (`ExercisePrompt.tsx:68`, octave < 4 gives bass). In `l1u1m2`, T0 has 12 of 20 bad and T1 has 5 of 6 bad, which is 17 of 26. The note letter is still right in either clef, so the item stays answerable and the key is correct. The module's whole point is undermined, but it is not unanswerable. |
| B-4 | CONFIRMED | agree S1 | `templatesL2.ts:67` never uses `{note}`. `ExercisePrompt` draws a staff only for `note_id` and `interval_id`, and `ExerciseRunner` renders nothing else for `scale_degree_id`. `l2u4m2g1/g4/g6` are unanswerable. |
| B-5 | **PARTIAL** | S1 holds / scope reduced | Template headings are shifted from the module titles. Example: `templatesL3.ts:243` says "Cadences" but the module is "Root Position Part Writing". The gate is real (`ModuleView.tsx:119`). I dumped all 11 modules' generated items. Corrections below the table. |
| B-6 | CONFIRMED | agree S1 | `curriculumL3.ts:505`: in A minor, VI = F-A-C and i = A-C-E share A and C. The text says one tone. |
| B-7 | CONFIRMED | S1 (borderline S2) | `exercisesL4.ts:47-59`: G up to F is a 7th, not a 4th, and E is not in G-B-D. The category "suspension" is still the right answer. The "4-3" label and the hint are wrong. |
| B-8 | CONFIRMED | agree S1 | Hint at `exercisesL5.ts:719` (the finding cites the id line 707). G7 has no C, and F to B is a diminished 5th. The module's own task `l5u17m4t1` states it correctly. |
| B-9 | CONFIRMED | S2 (see note) | I checked all 5 passages (`curriculumL3.ts:148,171`; `curriculumL5.ts:29,36,51`). B up to F is a diminished 5th and contracts to C-E. L4 (`curriculumL4.ts:192`) says "contracts". Severity is inconsistent: this is wrong theory in 5 places yet S2, while B-6 is S1. |
| B-10 | CONFIRMED | agree S2 | `ChoiceInput.tsx:18` greens the correct option on submit. `validateExercise.ts` choice feedback ("The correct answer is …") is shown by `ExerciseFeedback`. `ExerciseRunner.tsx:154` pays 0.5 on the retry. It is an intended 2-attempt design (`CLAUDE.md:183`), but the reveal is a design flaw. |
| B-11 | CONFIRMED | agree S2 | I recomputed from the data. Unique sets: 226/303 (74.6%) have the strictly longest option as correct (authored 102/150, templates 124/153). The headline "341/450 = 76%" counts generated items as well as the template sets they come from. The conclusion holds; the figure should read about 75%. |
| B-12 | CONFIRMED | agree S2 | `ExercisePrompt.tsx` draws no stimulus for MC. I verified `l1u1m1g1/g3` (stem about "the indicated line" with clef-statement options) and `l1u3m2g1-4`. The 91 count is regex-based, so treat it as approximate. |
| B-13 | **PARTIAL** | S2 / **S3** | All 15 verified. The 12 build items still require selecting notes on the instrument, so S3 fits. The two `l3u11m5e1/e2` interval prompts really do give away the answer. `l2u7m5e2` ("vii°" implying diminished) is marginal. |
| B-14 | CONFIRMED | agree S2 | `InstrumentInput.tsx:59,94-95` use `PITCH_CLASS_SPELLINGS[pc][0]`, the sharp-first spelling. `useKeyContext.ts:204-206` is a deliberate comment-documented choice. The `templatesL2.ts:20` prompt asks for "correct sharps or flats", which the input cannot express. |
| B-15 | **PARTIAL** | S2 / **S3** | The facts hold: 4 ear note items in `l1u1m2`, no reference tone, adjacent-semitone distractors. "Needs perfect pitch" is overstated. The playable piano is always on screen outside Drill (`AppShell.tsx:33-75`, `Piano.tsx` `noteOn`, "click keys to play"), so the learner can match candidates by ear. They are still off-topic in a ledger-lines module. |
| B-16 | CONFIRMED | agree S2 | L1 has 16 interval items (7 in `l1u1m3`, 9 in `l1u3m3`), as the auditor counted. `curriculumL1.ts:353` says "the number is enough". Forward references are real: `l1u3m2` teaches only C, G, D, F but `g2-4` test E, Bb, Ab. The L1 curriculum has no 6/8, compound, 2/2 or alla breve. |
| B-17 | **PARTIAL** | S2 / **S3** | Verified by WebFetch: "sounding an octave and a major second lower". `curriculumL3.ts:737` omits the octave. It is right for pitch class, which is the lesson's concert-pitch point. |
| B-18 | CONFIRMED | S2 / **S3** | C2 is below the stated E2-C4 range (`curriculumL3.ts:286` vs `:262`). The other voices and gaps are right. "All valid" refers to the spacing rules, not range. |
| B-19 | **PARTIAL** | S2 / **S3** | `curriculumL4.ts:362`: "B to C" is a minor 2nd if read ascending. It is read as the pair B and C in Cmaj7, so it is ambiguous wording, not a hard error. |
| B-20 | CONFIRMED | agree S2 | `curriculumL4.ts:239,258`: the parser builds `G/D` and `G/B` as the G-B-D triad with no F (`out_derivations.txt`). Those are V6/4 and V6, not V4/3 and V6/5. |
| B-21 | CONFIRMED | S2 / **S3** | `curriculumL3.ts:223`: G# is in A major too. The task should compare against natural minor. It is a wording slip. |
| B-22 | **PARTIAL** | S2 / **S3** | The L4/L5 tension is real (`curriculumL4.ts:765` vs `exercisesL5.ts:511`). Calling major IV in minor borrowed from the parallel major (or Dorian IV) is mainstream, so the key is defensible. The fix is to reconcile the framing. |
| B-23 | CONFIRMED | agree S2 | `templatesL4.ts:58` says both are "typically accented". `curriculumL4.ts` concept says the escape tone is on a weak beat. |
| B-24 | **PARTIAL** | S2 / **S3** | `templatesL5.ts:473` conflicts with the lesson's list of harmonic and modal variations (`curriculumL5.ts:659`). "Preserves the harmonic structure" is a defensible generalisation for common-practice sets. The distractors are clearly wrong. |
| B-25 | **PARTIAL** | S2 / **S3** | The counterexample is real (m7 vs m7♭5 share guide tones). It is also standard jazz shorthand, so it is overstated rather than false. |
| B-26 | **PARTIAL** | S2 / **S3** | `exercisesL3.ts:605` puts "sentence" in scare quotes as a metaphor. It clashes with the Satz taught in the same module, but is not an outright error. |
| B-27 | CONFIRMED | agree S2 | `templatesL2.ts:310-327`: intervals [1,3,4,6,8,10,11] give only m2, m3, M3, Tritone, m6, m7, M7. The prompt promises augmented, diminished or compound. |
| B-28 | **PARTIAL** | S2 / **S3** | Grep found 0 guitar/fret mentions in L1-L5 (positive control: piano/keyboard 18 in L1). It is a scope or feature gap, not a content defect. |
| B-29 | **PARTIAL** | S2 / **S3** | A debatable question. Diminished (tritone) as "most dissonant" is standard, and the hint explains why. The auditor's own status was "inferred". |

**B-5 corrections**
- **Real, forward-referencing (7 modules):**
  - l3u10m3: 5 cadence items.
  - l3u10m4: 4 phrase-structure items.
  - l3u11m1: 3 passing-tone items.
  - l3u11m2: 3 neighbor-tone items.
  - l3u11m3: 4 suspension items.
  - l3u11m4: 2 pedal-point items; the third generated item (anticipation) is on-topic.
  - l4u13m4: 3 sequence items.
  - These are taught in later modules, so S1 holds.
- **l4u13m2 is mostly on-topic.** Its concept and objectives teach iii7 and vi7 as tonic substitutes and V7-vi7 deceptive resolution (`curriculumL4.ts:326-345`). That covers `g2`, `g3` and `g4`. Only `g1` (vii° as dominant) is off-topic. Remove it from the table.
- **Weaker cases:**
  - l4u13m3 tests harmonic rhythm, taught earlier in l3u11m3.
  - l4u13m5 has 4 plain-triad build items, which are L1-L2 level.
  - l3u11m5 tests NCTs (taught earlier) plus interval items.
  - A learner can pass these with earlier knowledge. "Unreachable" holds only if "the module's own content" is read literally.
- **Counts.** The table's "Generated / total" column sums to 44, not 43. After the corrections the off-topic count is about 38-40.

**Not in the findings (noticed while checking)**
1. `l1u2m2g2` ("Common time (C) is equivalent to 4/4") tests the C symbol, which L1 never teaches. `check_order.mts` missed it because its `common time` regex matches "most common time signature" (`curriculumL1.ts:223`). I grepped L1 for `(C)`, `2/2` and `alla`: no matches. A positive control on L4 matched.
2. The auditor's `check_mc.mts` counts generated items on top of the template sets they were drawn from (this inflates the B-11 denominator). The same double counting could affect other "unique" totals.
3. B-3's root cause is a hardcoded clef rule (octave < 4 gives bass), not the content. The authored hint for `l1u1m2e1` is correct for treble clef.

Model: Claude Sonnet 5.5 (claude-sonnet-5-5).