# Track C — Learn Levels 6–9 + Explore reference content (English source)

Auditor: track C (Claude Opus 5.5). Work split: the parent did L9, the exercise rendering/grading/audio engine, the structural checks and the merge review. Three forks of the same model did the close reading: L6+L8, L7, and Explore reference content. Every fork finding was read in full by the parent. The S1 items were re-checked against source: L6-1/2/3/4, L8-1, L7-1/2/3, L7-13/14 confirmed. For L6-3 a caveat was added.
Repo state audited: working tree at /Users/nunosantos/Documents/Base/Music/new_music_app on 2026-10-30 (no .git, so no commit hash).

`<T>` = `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/C-learn-L6-L9-explore` (partials also write it as `<track>`). Run `.mts` scripts as `cd /Users/nunosantos/Documents/Base/Music/new_music_app && npx tsx <path>` and `.py` scripts as `python3 -I <path>`. Per-area scripts live in `<T>/L6L8/`, `<T>/L7/` and `<T>/explore/`; parent scripts are at `<T>/` root. The working id in each title (L6-n, L7-n, L8-n, E-n, EX-n) matches the per-area partial file `<T>/partial_*.md`.

Findings are ordered S1 → S2 → S3, then by area (L6/L8, L7, L9+engine, Explore).

**Counts:** 93 findings — S1: 14, S2: 45, S3: 34.

## Findings

### C-1: The German sixth is described as having "a minor quality in its lower three notes". Those notes form a major triad.  _(area: L6/L8; working id L6-1)_
- Severity: S1
- Type: incorrect
- Where: src/core/constants/curriculumL6.ts:135 (l6u18m3, concept "The German Sixth (Gr+6)")
- Evidence: `<track>/L6L8/theory_oracle.mts` → `MISMATCH Gr+6 "minor quality in its lower three notes" (Ab-C-Eb) claim="minor" oracle="major"`. Derivation: Ab→C = 4 semitones (M3) and Ab→Eb = 7 (P5), so Ab-C-Eb is an Ab major triad. The same text spells the chord Ab-C-Eb-F#, and its lower three notes are Ab-C-Eb.
- Expected vs actual: the lower three notes are expected to be described as major, matching the Ab7 twin that the next concept presents. Actual: "minor quality".
- Scope: 1 concept explanation, which is the defining description of the chord.
- Suggested fix: Replace with "its lower three notes form a major triad (Ab-C-Eb); the b3 (Eb) is borrowed from the minor mode".
- Status: verified

### C-2: A generated answer key says the Gr+6→V7 pivot reaches "keys a half step away from the dominant". The target is a half step from the tonic and a tritone from the dominant.  _(area: L6/L8; working id L6-2)_
- Severity: S1
- Type: incorrect
- Where: src/data/exercises/templatesL6.ts:160 (l6u18m4, generated l6u18m4g3, the keyed correct option)
- Evidence: theory_oracle.mts → `key C: Gr+6 root pc 8, as V7 resolves to pc 1; semitones from tonic = 1; from dominant = 6` (the same holds for D, A and F#), and `MISMATCH ... "keys a half step away from the dominant" claim=1 oracle=6`. The lesson itself says the pivot moves C→Db (curriculumL6.ts l6u18m4 concept 1) and that "every key has access to a modulation target a half step above or below".
- Expected vs actual: expected "a half step away from the tonic". Actual: "from the dominant", and that wrong statement is the only option marked correct, so the learner is trained on it.
- Scope: 1 template choice set (1 generated exercise in EN; the PT/ES overlays probably mirror it, not checked).
- Suggested fix: Change the label to "...to keys a half step above or below the tonic".
- Status: verified

### C-3: The answer key says Gr+6/V7 modulation reaches keys "up to a tritone or more apart". The lesson-consistent answer, "exactly a half step apart", is marked wrong.  _(area: L6/L8; working id L6-3)_
- Severity: S1
- Type: incorrect
- Where: src/data/exercises/exercisesL6.ts:191 (keyed option) and :197 (hint), exercise l6u18m4e2
- Evidence: theory_oracle.mts → `C -> Db circle-of-fifths distance = 5`. Derivation: the Gr+6 of key K is a dominant 7th on b6 of K. Read as V7, it resolves to (b6 + P4) = K + 1 semitone. The tonic therefore always moves by exactly a half step, which is 5 fifths on the circle. No two keys are more than 6 fifths apart (a tritone), so "or more" is impossible. The module objective (curriculumL6.ts l6u18m4) reads "Map the key relationships accessible through this pivot (keys a half step apart)", and concept 2 says "Any key pair related by a half step is accessible through this technique". The distractor "Exactly a half step apart and no further" is the answer the lesson teaches.
- Expected vs actual: expected the half-step option to be keyed correct. Actual: "Distant keys -- up to a tritone or more apart" is keyed correct, and the hint repeats "a tritone or more apart".
- Scope: 1 hand-authored exercise plus its hint.
- Suggested fix: Key "Exactly a half step apart" as correct (reword it to "Keys whose tonics are a half step apart, 5 steps around the circle") and fix the hint.
- Status: verified
- Merge-review note (parent re-check): the keyed answer is wrong as written ("or more" is impossible; the module objective says "keys a half step apart"). However, "exactly a half step … and no further" is not airtight either. Reinterpreting an applied dominant also works: D7 (V7/V in C), respelled D-F#-A-B# as the Gr+6 of F#, reaches F#, a tritone away. The fix should therefore re-key to the half-step option AND reword it to "a half step (when the tonic's own V7/Gr+6 is the pivot)". Otherwise both options stay arguable.

### C-4: A hint gives "C major to Db minor" as a doubly chromatic mediant. Those roots are a half step apart, so it is not a mediant relation at all.  _(area: L6/L8; working id L6-4)_
- Severity: S1
- Type: incorrect
- Where: src/data/exercises/exercisesL6.ts:371 (hint of l6u19m3e3)
- Evidence: theory_oracle.mts lists every minor triad that shares 0 common tones with C major. The only third-related ones are pc 3 (Eb minor) and pc 8 (Ab minor). Db (pc 1) is not in the list, and the check prints `MISMATCH Db minor root interval from C is a third ... oracle=false`. Source: Wikipedia, "Chromatic mediant", gives doubly chromatic mediants of C major as "C major and E♭ or A♭ minor".
- Expected vs actual: expected "C major to Ab minor (or Eb minor)". Actual: "C major to Db minor".
- Scope: 1 hint, the only example given for the term.
- Suggested fix: Replace with "C major to Ab minor (Ab-Cb-Eb)".
- Status: verified

### C-5: A task has the learner clap 3 even notes across 4 pulse beats, which is 3-against-4, but calls it "the fundamental 3-against-2 cross-rhythm".  _(area: L6/L8; working id L8-1)_
- Severity: S1
- Type: incorrect
- Where: src/core/constants/curriculumL8.ts:608 (task l8u27m5t1)
- Evidence: theory_oracle.mts → `MISMATCH ... "3-against-2" claim="3:2" oracle="3:4"`. The "coincide only on beat 1" part is correct (MATCH). Derivation: 3 equal claps over 4 equal beats gives the ratio 3:4. A 3:2 cross-rhythm needs 3 against 2 beats.
- Expected vs actual: expected either "pulse of 2 beats" (to keep the label 3:2) or the label "3-against-4" (to keep the 4 beats). Actual: the 4-beat set-up is labelled 3:2.
- Scope: 1 task instruction, in the module that teaches cross-rhythms.
- Suggested fix: "Clap a steady pulse of 2 beats ... 3 evenly-spaced claps ..." or relabel it "4-against-3".
- Status: verified

### C-6: The tritone-substitution build template grades the original chord, not the substitute  _(area: L7; working id L7-1)_
- Severity: S1
- Type: bug
- Where: src/data/exercises/templatesL7.ts:188-198 (l7u21m4, template 0). In English this produces l7u21m4g2, l7u21m4g3 and l7u21m4g5.
- Evidence: `<track>/L7/exercises_check.mts --plant`, saved in `exercises_check.out`:
  - `WRONG-KEY l7u21m4g2: prompt asks sub of Cb7 -> pcs {0,3,5,9}; grader accepts Cb7 {3,6,9,11}`
  - `WRONG-KEY l7u21m4g3: prompt asks sub of Ab7 -> pcs {0,2,6,9}; grader accepts Ab7 {0,3,6,8}`
  - `WRONG-KEY l7u21m4g5: prompt asks sub of Db7 -> pcs {2,5,7,11}; grader accepts Db7 {1,5,8,11}`
  - `template l7u21m4[0]: 7/7 drawable roots produce a wrong answer key`
  - A planted G7 case is also caught.
  - Cause: the prompt says "Build the tritone substitution for the dominant 7th on {root}", but `config.root` is that same {root}. `validateChordBuild` therefore expects {root}7 itself.
- Expected vs actual:
  - For "tritone sub of Cb7", the right answer is F7 (F A C Eb). The grader accepts only Cb7 (B D# F# A).
  - A learner who answers correctly is marked wrong. A learner who rebuilds the named chord is marked right.
  - l7u21m4g5 also has the same config as the authored l7u21m4e1 (Db7). Within one module, the same notes are the right answer to one prompt and the wrong answer to the other.
- Scope: 3 of the 5 generated exercises in l7u21m4 (EN). Every root the template can draw is affected. The PT/ES overlays share the config, so they almost certainly have the same bug (not checked).
- Suggested fix: name the original dominant in the prompt and keep the config on the substitute: Db/Ab/Eb/Gb/Cb/F#/B ↔ G/D/A/C/F/C/F. This needs a fixed choice set or a per-root prompt string, because the generator has no `{root+6}` token.
- Status: verified

### C-7: The bass Ab-Db-C is called "chromatic" twice  _(area: L7; working id L7-2)_
- Severity: S1
- Type: incorrect
- Where:
  - src/core/constants/curriculumL7.ts:197, l7u21m4 concept 2: "The bass line descends chromatically: Ab-Db-C ... the tritone-sub path is entirely chromatic"
  - src/core/constants/curriculumL7.ts:218, task l7u21m4t2: "The bass line descends Ab-Db-C — pure chromatic motion"
  - The same claim appears in curriculum/07-jazz-pop-modal.md:89.
- Evidence: `<track>/L7/derivations.mts` prints `FAILS Abm7-Db7-Cmaj7 bass Ab-Db-C is entirely chromatic ... moves (smallest distance) = 5, 1 semitones`. Ab→Db is a perfect 4th up (or a perfect 5th down). Only Db→C is a half step.
- Expected vs actual: Ab-Db-C is a 5th-motion followed by a half step. The chromatic tritone-sub line is the one concept 1 already gives, D-Db-C (Dm7-Db7-Cmaj7).
- Scope: 2 learner-facing strings, plus 1 in the spec.
- Suggested fix: say the Abm7-Db7 pair keeps ii-V root motion and only the final Db→C is chromatic. Point to Dm7-Db7-C for the fully chromatic bass.
- Status: verified

### C-8: "Db major triad over C7 = C7(b9,#11,b13), the tritone-sub voicing" is wrong  _(area: L7; working id L7-3)_
- Severity: S1
- Type: incorrect
- Where: src/core/constants/curriculumL7.ts:416, l7u22m2 concept 1 (upper-structure triads)
- Evidence:
  - `derivations.mts` gives `Db/C7: Db=b9, F=11 (natural), Ab=b13 ; Gb/C7: Gb=#11, Bb=b7, Db=b9`. F is 5 semitones above C, a natural 11. A #11 would be F#/Gb.
  - The tritone sub of C7 is Gb7 (`tritone sub root = F#`).
  - Source: Wikipedia, "Upper structure" (fetched 2026-10-30), citing Levine, *The Jazz Piano Book* (1989), ch. 14. It lists the bV triad, Gb over C7, as C7♭9♯11. It has no Db-major entry; its D♭ entry is a D♭ *minor* triad (US♭ii) = C7♭9♭13.
  - The other three claims in the same paragraph check out: D/C7 = 13#11, Eb/C7 = 7#9, Ab/C7 = 7#9b13.
- Expected vs actual:
  - The text says Db/C7 = C7(b9,#11,b13), the tritone-sub voicing.
  - Actually, Db/C7 = C7(b9,11,b13), with a natural 11 that clashes with the 3rd. The tritone-sub voicing is Gb/C7 = C7(b9,#11).
- Scope: 1 sentence
- Suggested fix: replace the sentence with "A Gb (F#) major triad over C7 gives C7(b9,#11), the tritone-sub sound."
- Status: verified

### C-9: Shell voicings: "the 5th is perfect in all standard chord types", and "the 3rd and 7th make each quality distinct", including Cm7b5  _(area: L7; working id L7-4)_
- Severity: S1
- Type: incorrect
- Where:
  - curriculumL7.ts:80, l7u21m2 concept 1: "The 5th is omitted because it adds no quality information (it is perfect in all standard chord types)"
  - curriculumL7.ts:103, task l7u21m2t1, which builds Cmaj7/Cm7/C7/**Cm7b5**: "The 3rd and 7th change — that is what makes each quality distinct."
  - exercisesL7.ts:76, hint for l7u21m2e1: "The 5th is redundant."
- Evidence: `derivations.mts` prints:
  - `m7b5: 5th = 6 semitones (NOT perfect), shell(3rd,7th) = (3,10)`
  - `m7: ... shell(3rd,7th) = (3,10)`
  - `FAILS 3rd+7th distinguish Cm7 from Cm7b5`
- Expected vs actual: Cm7 and Cm7b5 have the same root-3rd-7th shell (C Eb Bb). Only the diminished 5th tells them apart. The diminished and augmented chord families also have non-perfect 5ths. The task asks the learner to see a distinction that the shell cannot show.
- Scope: 2 curriculum strings and 1 exercise hint
- Suggested fix: say "the 5th is perfect in maj7, m7 and 7, so it can be dropped there. In m7b5 (and dim7) the b5 is the defining tone and is kept."
- Status: verified

### C-10: The first wrong answer shows the correct answer, so the retry earns 0.5 points for copying it  _(area: L9+engine; working id E-1)_
- Severity: S1
- Type: bug
- Where: src/components/learn/exercises/ExerciseFeedback.tsx:25,88 (renders `result.explanation` while `canRetry`); validateExercise.ts:272 (`choiceIncorrect` = 'The correct answer is "{{label}}".'), :154 (`noteIncorrect`), :171 (`intervalIncorrect`); inputs/ChoiceInput.tsx:18,31 (`showCorrect = submitted && opt.correct` paints the right option green on attempt 1 too); ExerciseRunner.tsx:147-160 (attempt 2 correct = 0.5).
- Evidence: `<T>/retry_reveal.mts`; run `npx tsx <T>/retry_reveal.mts`. Output: `choice-based exercises: 325; feedback after 1st wrong attempt names the correct answer: 325`. Sample: `l6u18m1e2: wrong="Dominant -- it resolves directly to the tonic" -> feedback "The correct answer is "Pre-dominant -- it substitutes for ii or iv and moves to V"."` The "Try again" button appears under that text (ExerciseFeedback.tsx:102).
- Expected vs actual: Expected: after a first wrong attempt, show the hint and hold back the answer until the second attempt is spent. Actual: the answer is printed and highlighted, then "Try again" gives 0.5 points for re-entering it. Any learner can earn at least 0.5 on every item. The 80% pass bar therefore only needs about 60% first-try accuracy. The 2-attempt design and every authored hint stop doing anything.
- Scope: all 325 choice-based exercises in L6–L9 (every multiple_choice, ear note/interval/chord/scale/progression and scale_degree_id item). The same code serves L1–L5. Build exercises (chord_build/scale_build) only reveal how many notes are missing or extra.
- Suggested fix: when `canRetry`, show only "Not quite" plus the hint and don't mark `opt.correct`. Show the explanation and highlight once the exercise is final (correct, or attempt 2).
- Status: verified

### C-11: interval_id notation is spelled with sharps only, so the staff shows a different interval from the answer key (outside L6–L9; shared rendering code)  _(area: L9+engine; working id E-13)_
- Severity: S1
- Type: incorrect
- Where: src/components/learn/exercises/ExercisePrompt.tsx:49-63 (sharps-only `NATURALS/ACCIDENTALS` table for the second note).
- Evidence: `<T>/interval_staff.mts`; run `npx tsx <T>/interval_staff.mts`. Output: `interval_id exercises: 43; staff mis-spelled: 12`, e.g. `l2u7m1e2: C4 ascending 3st -> staff shows C & D# (a 2th-type interval) but key expects a 3`; `l1u1m3e1: C4 ascending 1st -> staff shows C & C# … key expects a 2`. The planted C+3 case was caught.
- Expected vs actual: Expected: C–Eb on the staff when the answer is "Minor 3rd", and C–Db for "Minor 2nd". Actual: C–D# (an augmented 2nd) and C–C# (an augmented unison) are shown and graded as minor 3rd / minor 2nd. Beginners learn the wrong spelling.
- Scope: 12 of 43 interval_id exercises (L1 ×5, L2 ×6, L4 ×1). None are in L6–L9. Reported here because the defect is in the exercise rendering code; other tracks may also flag it.
- Suggested fix: spell the upper note by letter distance (interval number from the semitone count), e.g. reuse the core interval-spelling helper rather than a sharps table.
- Status: verified

### C-12: Choosing four scales crashes the whole app, and the crash comes back on every reload (Diminished W-H, Diminished H-W, Bebop Dominant, Bebop Major)  _(area: Explore; working id EX-1)_
- Severity: S1
- Type: bug
- Where:
  - Root cause: `src/core/constants/chords.ts:686-699` (`getRomanNumeral` reads `baseNumerals[7]`, which is undefined, then calls `.toLowerCase()`). The trigger is the 8-entry tables at `chords.ts:591-610` and `chords.ts:627-638`, read by `getDiatonicChordsForScale` at `chords.ts:714`.
  - Called on every render by `src/hooks/useKeyContext.ts:70-77`.
  - Ways to reach it:
    - KeySelector options, `src/components/navigation/KeySelector.tsx:61-62` and `:81-82`.
    - 11 "Compatible Scales" chips in the chord panel, `src/components/panels/CurrentChordPanel.tsx:268-273` (for example C7 → "Bebop Dominant", Cdim7 → "Diminished (W-H)").
    - Cmd+K ("C diminished", "bebop dominant").
    - Curriculum Try-This "C diminished scale" at `curriculumL6.ts:428`, `curriculumL6.ts:450` (task) and `curriculumL8.ts:546`.
- Evidence:
  - `EXP/oracle.mts`: `C diminished_whole_half: THROWS TypeError: Cannot read properties of undefined (reading 'toLowerCase')`. The same happens for diminished_half_whole, bebop_dominant and bebop_major: 48 crashing (root, scale) pairs over the 12 KeySelector roots.
  - `EXP/crash_probe_dom.mts` mounts the real `ChordGrid` in jsdom for every scale type. The control (dorian) renders `iCmMinor…VIIBbMajor`. The output is `RENDER ERROR diminished_whole_half … diminished_half_whole … bebop_dominant … bebop_major` and `render errors: 4`.
  - `EXP/crash_paths.mts`: `11 chord-panel chips lead to a crashing scale` (dominant7, dominant9, 7b9, 7#9, 7alt, 13b9, dim, dim7, dim(maj7), 7b5b9, 7b5#9).
  - `EXP/trythis.mts`: `executeTheoryQuery('C diminished scale')` leaves `store scale: C diminished_whole_half`, then `diatonic THROWS`.
- Consequence, inferred from reading the code:
  - Piano and Fretboard call `useKeyContext` (`Piano.tsx:67`, `Fretboard.tsx:25`). They sit in AppShell, outside the per-view ErrorBoundary at `App.tsx:108`, so the throw reaches the app-level boundary at `main.tsx:21`, which shows the full-page "Something went wrong" screen.
  - `selectedScale` is persisted (`store.ts:69-71`), so Reload crashes again.
  - The only way out is "Reset app data". It removes every `music-theory*` key (`ErrorBoundary.tsx:58-63`), including `music-theory-progress` (`progressStore.ts:212`), so the learner loses all curriculum progress.
- Expected vs actual:
  - Expected: the diatonic-chord strip shows chords, or is empty.
  - Actual: a TypeError during render.
- Scope:
  - 4 scale types × every root.
  - 11 chord-panel chips.
  - 3 curriculum Try-This entries.
  - Also: `bebop_dorian` degree 8 gets the numeral `undefined`. It renders blank, and Copy-summary throws (`EXP/misc.mts`: `summary bebop_dorian THROWS: Cannot read properties of undefined (reading 'padEnd')`, `exportHelpers.ts:31`).
- Suggested fix: make `getRomanNumeral` safe beyond 7 degrees, or return `[]` for 8-note scales. Also add a test that mounts every `ScaleType`.
- Status: verified that it throws on render and through all four paths above. Full-app crash and progress-loss path: inferred from code.
- Merge-review note: the parent reproduced this independently with `<T>/spot_ex1.mts`. The script calls `getDiatonicChordsForScale(buildScale(C, type))` for all 37 types. The control `dorian -> i ii III IV v vi° VII` passes, and `throwing scale types: 4` (diminished_whole_half, diminished_half_whole, bebop_dominant, bebop_major; TypeError reading 'toLowerCase'). The persisted-state guard (store.ts:36-38) only drops unknown scale types, so these four survive a reload.

### C-13: The "diatonic chords" for 12 scale types include notes that are not in the scale  _(area: Explore; working id EX-2)_
- Severity: S1
- Type: incorrect
- Where: hand-written tables in `DIATONIC_QUALITIES`, `src/core/constants/chords.ts:621` (major_blues), `:640` (bebop_dorian), `:652-682` (Hungarian minor/major, double harmonic, Persian, Neapolitan minor/major, hirajoshi, in sen, iwato, egyptian). Shown by the Explore ChordGrid and the ScaleDegreeBar click-to-select.
- Evidence: `EXP/oracle.mts`, section "diatonic chords wrong". The oracle stacks scale degrees i, i+2, i+4 and checks that every chord tone is in the scale. Examples:
  - `persian: deg1 I = C major [C E G] — NOT IN SCALE: G`
  - `double_harmonic: deg3 III+ = E augmented [E G# B#] — stacked-thirds triad is minor`
  - `hungarian_minor: deg7 vii° = B diminished [B D F] — NOT IN SCALE: F`
  - `hirajoshi: deg2 II = D major [D F# A] — NOT IN SCALE: F#,A`
  - `egyptian: deg1 I = C major [C E G] — NOT IN SCALE: E`
- Expected vs actual:
  - Expected: chords built only from the scale's own notes, or no chords where thirds don't stack (the code already does that for pentatonic scales, `chords.ts:586-590`).
  - Actual: chords with outside notes, wrong qualities, and impossible numerals.
- Scope: 47 chord chips at root C across 12 scale types. The table does not depend on the root, so every root shows the same errors.
- Suggested fix: work the chords out from the scale itself (stack thirds, classify, drop combinations that aren't stacked thirds) instead of using hand tables. For 5- and 6-note scales, return `[]`.
- Status: verified

### C-14: For maj11 and add11 chords, the "primary" compatible scale is Lydian, which lacks the chord's own 11th  _(area: Explore; working id EX-3)_
- Severity: S1
- Type: incorrect
- Where: `src/core/constants/chordScaleRelationships.ts:51-54` (`major11` → Lydian primary, "#11 matches the lydian 4th — defining sound") and `:67-70` (`add11` → Lydian primary, "#11 preferred over natural 4"). The chords are defined with a natural 11 at `chords.ts:80` and `chords.ts:98` (17 semitones), and the panel shows their formula as "… 11".
- Evidence: `EXP/oracle.mts`:
  - `major11 → lydian [primary] missing chord tone(s) 11`
  - `add11 → lydian [primary] missing chord tone(s) 11`
- Derivation: Cmaj11 is C G B D F, and C Lydian is C D E F# G A B. The chord's F is not in the scale, and the scale's F# sits a semitone from it. The "#11" in the context text describes a different chord (maj7#11, which the app models separately).
- Expected vs actual:
  - Expected: Major (Ionian) as the scale that contains every chord tone, or the chord defined with #11.
  - Actual: Lydian is ranked primary, and Major is demoted with the note "Natural 4 clashes slightly with 3rd", even though maj11 here has no 3rd.
- Scope: 2 chord qualities
- Suggested fix: swap the ranks (Major primary for maj11 and add11), and point to maj7#11 for the Lydian sound.
- Status: verified

### C-15: The "Equal division of the octave" text counts by step size ("division by 2 = whole-tone") instead of by number of parts. This contradicts L8 and makes an exercise hint point at the distractor.  _(area: L6/L8; working id L6-5)_
- Severity: S2
- Type: incorrect
- Where: src/core/constants/curriculumL6.ts:420 and :422 (l6u19m4 concept 1 and its Try-This label "division by 2"). src/data/exercises/templatesL6.ts:362 (hint "aug triad (3 notes, div by 4)") together with :367 (distractor "An augmented triad divides the octave into 4 equal parts", marked wrong). Affects generated exercises l6u20m2g2 and g4.
- Evidence: theory_oracle.mts → `MISMATCH whole-tone ... claim=2 oracle=6`, `dim7 ... claim=3 oracle=4`, `augmented triad ... claim=4 oracle=3` (number of equal parts = 12 / step size). The app uses the standard reading elsewhere: curriculumL8.ts:504 says "the whole tone divides the octave into 6 equal steps", and the keyed option in the same template says the augmented triad "divides the octave into 3 equal major 3rds". A learner who trusts the hint ("div by 4") picks the option marked wrong.
- Expected vs actual: expected whole-tone = octave in 6 parts, dim7 = 4 parts, aug = 3 parts (or explicitly "steps of N semitones"). Actual: "Division by 2/3/4" pairs each structure with its step size.
- Scope: 1 concept, 1 Try-This label, 1 template hint shown on 2 generated exercises.
- Suggested fix: Say "divides the octave into 6 / 4 / 3 equal parts (steps of 2 / 3 / 4 semitones)" everywhere, and rewrite the hint the same way.
- Status: verified

### C-16: The octatonic scale is said to contain "four tritones and four minor thirds". It has 8 interval-class-3 pairs (minor thirds).  _(area: L6/L8; working id L6-6)_
- Severity: S2
- Type: incorrect
- Where: src/core/constants/curriculumL6.ts:449 (task l6u19m4t2)
- Evidence: theory_oracle.mts → `octatonic tritone (ic6) count = 4` MATCH and `MISMATCH octatonic minor-third (ic3) count = 4 (claimed) oracle=8`. The interval vector of {0,2,3,5,6,8,9,11} is <4,4,8,4,4,4>.
- Expected vs actual: expected "four tritones and eight minor thirds" (or "two interlocking diminished-seventh chords"). Actual: "four minor thirds".
- Scope: 1 task.
- Suggested fix: "...contains two complete diminished-seventh chords (8 minor thirds) and 4 tritones".
- Status: verified

### C-17: A Try-This label says Bb major is "the key a Bb clarinet reads in". A Bb clarinet reads C major to sound Bb major.  _(area: L6/L8; working id L6-7)_
- Severity: S2
- Type: incorrect
- Where: src/core/constants/curriculumL6.ts:662 (l6u20m4 concept 3 tryThisLabel)
- Evidence: theory_oracle.mts → `MISMATCH Concert Bb major for a Bb clarinet is WRITTEN in ... oracle=0` (written = concert + M2, so concert Bb is written C). The same module's task t3 says it correctly ("reads C, audience hears Bb"), and L8 says it correctly too (curriculumL8.ts l8u26m3: "See Bb — the concert pitch when a Bb clarinet reads C").
- Expected vs actual: expected "See Bb major — what a Bb clarinet sounds when it reads C major". Actual: the label says it reads in Bb.
- Scope: 1 label.
- Suggested fix: Reuse the L8 wording.
- Status: verified

### C-18: L6 gives two contradictory rules for second-species dissonance. The lesson allows neighbor tones; the exercise key says passing tones only.  _(area: L6/L8; working id L6-8)_
- Severity: S2
- Type: incorrect (inconsistent)
- Where: src/core/constants/curriculumL6.ts:488 (l6u20m1 concept "Second Species": weak beats may be dissonant as a passing tone "or if they step away and return (neighbor tone)"). Contradicted by src/data/exercises/exercisesL6.ts:457 (l6u20m1e2, keyed "Dissonances may appear only on weak beats as passing tones approached and left by step") and :479 (l6u20m1e3 hint: third species "introduces neighbor tones").
- Evidence: direct text comparison (the quotes above). Both conventions exist in textbooks: strict Fux allows passing tones only in 2nd species, and some modern texts allow neighbors. The app just has to pick one.
- Expected vs actual: expected one rule taught and tested. Actual: the lesson teaches one rule and the answer key enforces the other.
- Scope: 1 concept, 1 exercise, 1 hint.
- Suggested fix: Drop the neighbor-tone clause from the concept (Fux convention). That matches the exercise and the third-species hint.
- Status: verified

### C-19: Generated exercises in 7 L6/L8 modules come from templates written for a different module ordering. Their topics don't match the module they appear in.  _(area: L6/L8; working id L6-9)_
- Severity: S2
- Type: bug (content mis-mapping)
- Where: templatesL6.ts:275-451, templatesL8.ts:285-416. Each template's own header comment names a different topic from the curriculum module title:
  - l6u19m4 "Late Romantic" gets chromatic-mediant items (3)
  - l6u20m1 "Species 1–3" gets "Chromatic Voice Leading" / parsimonious voice-leading items (2)
  - l6u20m2 "Species 4–5" gets whole-tone / augmented-triad items (6)
  - l6u20m4 "Part Writing & Score Reading" gets triple/quadruple counterpoint items (3)
  - l8u27m2 "Twelve-Tone" gets interval-vector items (3)
  - l8u27m3 "Planing/Polytonality" gets twelve-tone items (3)
  - l8u27m5 "Advanced Rhythm" gets extended-technique/microtonal/spectral items (3)
- Evidence: `python3 -I <track>/L6L8/module_topic_mismatch.py` (output in module_topic_mismatch.out), e.g. `L6 l6u20m2: curriculum='Species Counterpoint: Fourth and Fifth Species' | template='Equal Division of the Octave' | generated=6`. Consequences:
  - In l6u20m2, 6 of 9 exercises test a different module's topic. The pass mark is 80%, so the module can be passed without knowing anything about 4th/5th species.
  - l6u20m1g1 tests "parsimonious voice leading", a term no curriculum file defines. `grep -c -i parsimonious` over curriculumL1–L9.ts returns 0 for every file; the same grep finds "Neapolitan" 17× in curriculumL6, so the grep works.
  - "Quadruple counterpoint" (l6u20m4g2) is also never taught.
- Expected vs actual: expected generated items to test their own module. Actual: 23 generated items test other modules' topics, and 2 of them test topics never taught.
- Scope: 23 generated exercises across 7 modules.
- Suggested fix: Re-key these template blocks to the modules whose topics they match (or write new templates for species 4–5, part-writing and rhythm). Mirror the change in the PT/ES template overlays.
- Status: verified

### C-20: 26 generated multiple-choice prompts refer to "this chord/technique/element" when no stimulus is shown.  _(area: L6/L8; working id L6-10)_
- Severity: S2
- Type: ux
- Where: templatesL6.ts:61 ("Identify the type and structure of this augmented sixth chord.") and the "Analyze this chromatic voice-leading technique" template. templatesL8.ts:20, :61, :102, :141, :361, :390.
- Evidence: `python3 -I <track>/L6L8/dangling_this.py` → `total 26` (4 aug-6, 2 chromatic VL, 4 fugue exposition, 4 fugal technique, 3 canon, 4 sonata, 2 minimalism, 3 contemporary). The plant run (`--plant`) counts a synthetic "Identify this chord." (27). multiple_choice configs carry no notation or audio (core/types/exercise.ts MultipleChoiceConfig has only `choices`), so "this augmented sixth chord" points at nothing. The options are self-contained statements, so the items can be answered, but the wording suggests a chord failed to render.
- Expected vs actual: expected "Which statement about augmented sixth chords is true?". Actual: "Identify the type and structure of this augmented sixth chord."
- Scope: 26 exercises (8 templates).
- Suggested fix: Reword each to "Which statement about X is correct?".
- Status: verified

### C-21: The "real vs tonal answer" key says the tonal answer adjusts intervals "to stay in the dominant key". It actually exists to protect the tonic.  _(area: L6/L8; working id L8-2)_
- Severity: S2
- Type: incorrect
- Where: src/data/exercises/exercisesL8.ts:38 (l8u25m1e2, keyed option)
- Evidence: Derivation: a subject opening C→G (1→5) gets the real answer G→D, which sits comfortably in G (the dominant key). The tonal answer G→C answers 5 with 1, pulling the answer's head back toward the tonic. Source: Wikipedia, "Fugue": a tonal answer is used when the subject has a prominent dominant note near its start, to prevent "an undermining of the fugue's key". The app's own generated item l8u25m1g3 (templatesL8.ts) gets it right: "adjusts intervals to avoid tonicizing the dominant at the entry point".
- Expected vs actual: expected "...a tonal answer adjusts intervals (typically 5→1) to preserve the tonic key". Actual: "...to stay in the dominant key", which contradicts g3 in the same module.
- Scope: 1 exercise. It is still the best option because the distractors are absurd, but it teaches the wrong reason.
- Suggested fix: Change the label to "...a tonal answer alters the subject's 1–5 intervals so the answer doesn't undermine the tonic".
- Status: verified

### C-22: La Monte Young is listed as a "pulse-based" minimalist. He is the canonical drone / sustained-tone composer.  _(area: L6/L8; working id L8-3)_
- Severity: S2
- Type: incorrect
- Where: src/core/constants/curriculumL8.ts:531 (l8u27m4 concept 1: "Pulse-based minimalism (La Monte Young, Terry Riley) sustains a steady rhythmic pulse")
- Evidence: Wikipedia, "La Monte Young": "best known for his exploration of sustained tones, beginning with his 1958 composition Trio for Strings"; "known for his pioneering work in drone music"; "Most of his pieces after this point are based on select pitches, played continuously". The article does not describe his music as pulse-based. Riley (In C) fits the pulse description.
- Expected vs actual: expected Young under drone/sustained-tone minimalism (Riley and Reich for pulse). Actual: Young listed as pulse-based.
- Scope: 1 sentence.
- Suggested fix: "Drone minimalism (La Monte Young) sustains tones for very long spans; pulse-based minimalism (Terry Riley's In C) keeps a steady pulse while patterns evolve".
- Status: verified

### C-23: "Chromatic planing" has two different definitions: "all half steps" in L6, exact transposition at any interval in L8.  _(area: L6/L8; working id L6-11)_
- Severity: S2
- Type: incorrect (inconsistent)
- Where: src/core/constants/curriculumL6.ts:434 ("Chromatic planing (all half steps)") vs src/core/constants/curriculumL8.ts l8u27m3 concept 1 ("chromatic planing transposes every note by the same number of semitones (preserving exact chord quality)")
- Evidence: direct text comparison. The L8 definition is the standard "real planing" (Kostka, Materials and Techniques of Post-Tonal Music: real vs. diatonic planing). The movement interval is not part of the definition; the L6 task t3 example happens to move by half steps.
- Expected vs actual: expected one definition: chord quality preserved exactly, any interval. Actual: L6 defines it by step size.
- Scope: 1 concept sentence.
- Suggested fix: In L6, write "Chromatic (real) planing keeps the exact chord quality as it moves; diatonic planing adjusts qualities to stay in the key".
- Status: verified (internal inconsistency). The textbook attribution is from memory, so treat that part as inferred.

### C-24: 9sus explanation: "a perfect 5th above the root of a minor chord (V-of-ii position)", and "Dm11/G" given as the same sound  _(area: L7; working id L7-5)_
- Severity: S2
- Type: incorrect
- Where: curriculumL7.ts:94, l7u21m2 concept 3
- Evidence:
  - `derivations.mts` prints `FAILS G is a perfect 5th ABOVE D :: D->G ascending = 5 semitones (P4); P5 above D = A`.
  - V-of-ii in C is A7, not G.
  - `HOLDS G9sus4 (G C D F A) = Dm7 over G`
  - `FAILS Dm11/G = G9sus4 :: Dm11 adds E`
- Expected vs actual: the standard idea, which the text's own example follows, is that the 9sus chord sits on V, a P4 above (P5 below) the ii root. G9sus4 = Dm7/G (or F/G). The text's rule points to A, and "Dm11/G" adds E, the 13th.
- Scope: 1 concept
- Suggested fix: "a 9sus chord built a perfect 4th above (5th below) the ii root, i.e. on V (G9sus = Dm7/G = F/G), fuses ii and V."
- Status: verified

### C-25: An exercise marks as wrong what the module's own concept teaches (sus chord substituting for ii)  _(area: L7; working id L7-6)_
- Severity: S2
- Type: incorrect
- Where: exercisesL7.ts:96-104, l7u21m2e3. The distractor "It acts as a substitute for the ii chord" is marked false.
- Evidence: the concept text at curriculumL7.ts:94, in the same module, says: "a 9sus chord ... substitutes for the ii chord."
- Expected vs actual: a learner who absorbed the concept picks a "wrong" answer. Two options are defensible.
- Scope: 1 exercise
- Suggested fix: replace the distractor with one that is clearly false (for example, "It is a tonic chord that ends pieces").
- Status: verified

### C-26: Characteristic modal tones are called "avoid notes in tonal theory", which the app's own exercises contradict  _(area: L7; working id L7-7)_
- Severity: S2
- Type: incorrect
- Where: curriculumL7.ts:534, l7u22m4 concept 2: "In tonal theory these are 'avoid notes'". The four tones named are Dorian ♮6, Phrygian b2, Lydian #4 and Mixolydian b7.
- Evidence:
  - The app's own definition, in templatesL7.ts (l7u23m4g3 hint and answer), is "a scale degree ... a half step above a chord tone".
  - Under that definition, `derivations.mts` prints:
    - `FAILS characteristic #4 of lydian is an avoid note over maj7 :: avoid notes ... []`
    - `FAILS ... b7 of mixolydian ... :: avoid notes of mixolydian over 7: [5]; b7 ... is a CHORD TONE`
    - `FAILS ... natural 6 of dorian ...`
    - Only Phrygian b2 holds.
  - Exercise l7u23m4g2 (templatesL7.ts:573) marks as correct "Lydian is often preferred over Ionian for maj7 chords because it has no avoid notes".
- Expected vs actual: Lydian's #11 is the standard available tension, and Mixolydian's b7 is the dominant's own 7th. 3 of the 4 tones are not avoid notes. The term also belongs to jazz chord-scale theory, not "tonal theory".
- Scope: 1 concept (also curriculum/07 md: §7.4 "the 'avoid' note in tonal thinking")
- Suggested fix: drop the avoid-note sentence, or say "these are the notes tonal harmony treats as non-diatonic colour; modal writing emphasises them".
- Status: verified

### C-27: Guide-tone answer: "the 7th of ii becomes the 3rd of V"  _(area: L7; working id L7-8)_
- Severity: S2
- Type: incorrect
- Where: templatesL7.ts:131 (correct choice in l7u21m2g3) and templatesL7.ts:121 (hint on l7u21m2g2 and g3: "the 3rd of one chord becomes the 7th of the next and vice versa")
- Evidence: Dm7 = D F A C and G7 = G B D F. The 3rd of ii (F) is the 7th of V, the same pitch. The 7th of ii (C) is not the 3rd of V (B): it moves down a half step. curriculumL7.ts (l7u21m3 concept 1) says this correctly: "the 7th of ii (C) steps down to the 3rd of V (B)".
- Expected vs actual: the stored "correct" answer and the hint say "becomes" (a common tone) where the motion is a step.
- Scope: 1 answer key and 2 hints
- Suggested fix: "The 3rd of ii is held as the 7th of V; the 7th of ii falls a half step to the 3rd of V."
- Status: verified

### C-28: Generated exercises in 8 L7 modules come from a different (older) module plan  _(area: L7; working id L7-9)_
- Severity: S2
- Type: bug
- Where: src/data/exercises/templatesL7.ts. The template comments at :305, :325, :366, :407, :481, :501, :521, :562 and :597 name a different module than curriculumL7.ts.
- Evidence: `exercises_check.mts`, section 6, prints the template comment, the module title and the generated count:

  | Module | Module title | Template written for | Generated items |
  |---|---|---|---|
  | l7u22m2 | Upper Structures & Reharmonization | "Modal Harmony and Vamps" | 4 |
  | l7u22m3 | Coltrane Changes | "Modal Interchange in Pop" | 5 |
  | l7u22m4 | Modal Harmony Fundamentals | "Pop Progressions (Nashville Numbers)" | 3 |
  | l7u23m1 | Pop Progressions & Nashville | "Pentatonic and Blues Scales" | 6 |
  | l7u23m2 | Modal Mixture & Chromatic Mediants | "Symmetric Scales" | 5 |
  | l7u23m3 | Melodic Minor Modes | "Bebop and Jazz Scales" (builds Dorian/Mixolydian) | 5 |
  | l7u23m4 | Harmonic-minor/Symmetric/World | "Chord-Scale Theory" | 3 |
  | l7u23m5 | Complete Chord Taxonomy | "Exotic and Non-Western Scales" | 3 |

  - l7u22m1 (Chord-Scale Theory, built from "Modal Scales and Characteristics") is loosely related and is not counted.
- Consequences:
  - Concepts are tested before they are taught: Nashville numbers in l7u22m4 (taught in l7u23m1), pop modal interchange in l7u22m3 (taught in l7u23m2), and whole-tone in l7u23m2 (taught in l7u23m4).
  - Hirajoshi (l7u23m5g3) is never taught anywhere: `grep -i hirajoshi src/core/constants/curriculumL*.ts` returns nothing.
  - l7u22m3g1-g4 ask for "a chord pop music borrows" (Bb, F, Ab, Cm) with no key given.
  - The "Melodic Minor Modes" module generates no melodic-minor-mode items at all.
- Expected vs actual: each module's generated exercises should practise what that module teaches. Today 34 of the 72 generated L7 items practise another module's topic, and spaced review keeps serving them.
- Scope: 34 generated exercises across 8 modules
- Suggested fix: re-key the template blocks to the current module IDs (the content mostly exists, one or two modules out of place) and write new templates for Coltrane, upper structures, melodic-minor modes and chord taxonomy.
- Status: verified

### C-29: Many task strings the learner is told to type or compare return nothing in Cmd+K; one Type button is dead  _(area: L7; working id L7-10)_
- Severity: S2
- Type: bug
- Where:
  - Dead **button**: l7u23m4t3, "type 'C double harmonic major'" (curriculumL7.ts:842). The scale parser accepts "double harmonic" but not "... major" (scaleParser.ts:277 regex).
  - Under type/compare wording, not clickable: 'G altered scale' (l7u22m1t3), 'F major scale' (l7u22m4t3), 'D natural minor scale' (l7u22m5t3), 'C altered scale' (l7u23m3t1, l7u23m3t3).
  - 18 more "play 'X major chord'" tokens (l7u22m3t2, l7u22m4t2, l7u23m1t1-t3, l7u23m2t2-t3).
- Evidence:
  - `<track>/L7/taskreach.mts --plant` copies ModuleView's `QUERY_VERB_PATTERN` (ModuleView.tsx:19). Only the token right after "Type/Open/Search for" becomes a button. Every other token goes to Cmd+K `getResults`.
  - Output: `tokens=144 clickable=28 dead=25` (24 typed-in-Cmd+K plus 1 dead button), e.g. `DEAD typed l7u23m3t3 'C altered scale' -> (no results)` and `DEAD-BUTTON l7u23m4t3 'C double harmonic major'`.
  - `quicksearch.mts` gives `"C altered scale" -> (no results)` and `"C double harmonic" -> Scale:C Double Harmonic`.
  - Root cause: `queryExecutor` retries without a trailing " scale" and maps "X major chord" word forms. `quickSearchResults.getResults` does neither.
- Expected vs actual: each named scale or chord should be reachable. Today the learner gets an empty result list.
- Scope: 13 L7 tasks
- Suggested fix:
  - Make every quoted query in a task clickable, not just the first after "Type".
  - Route Cmd+K through the same normalisation as queryExecutor.
  - Add a "double harmonic major" alias.
- Status: verified ("play" tokens are listed as typed queries; whether the learner meant to type them rather than play them is inferred)

### C-30: Objective "Navigate all seven modes of harmonic minor": the engine has 2 of 7  _(area: L7; working id L7-11)_
- Severity: S2
- Type: content-gap
- Where:
  - curriculumL7.ts:800 (objective)
  - curriculumL7.ts:809 (concept names Dorian #4 / Ukrainian Dorian and Lydian #2)
  - Spec: curriculum/07 md §7.6 lists all 7 modes.
- Evidence: `<track>/L7/hmmodes.mts` prints:
  - `mode 2 ... engine: [NONE] parser: "C locrian #6"->null`
  - `mode 3 ... NONE`
  - `mode 4 ... NONE ("C ukrainian dorian"->null)`
  - `mode 6 ... NONE`
  - `mode 7 ... NONE`
  - Positive controls: `mode 1 ... [harmonic_minor]`, `mode 5 ... [phrygian_dominant]`
- Expected vs actual: modes 2, 3, 4, 6 and 7 cannot be displayed, heard or searched. (All 7 melodic-minor modes do exist.)
- Scope: 1 objective, 1 concept (5 missing scale types)
- Suggested fix: add the 5 formulas and names to scales.ts and the parser, or reword the objective to "the two most-used harmonic-minor modes".
- Status: verified

### C-31: The diatonic modes are never taught as a system, yet L7 uses them from its 6th module on  _(area: L7; working id L7-12)_
- Severity: S2
- Type: content-gap
- Where:
  - First uses: l7u21m6t2 ("matching each chord to its Mixolydian scale", curriculumL7.ts:328); l7u22m1 concept 1 (curriculumL7.ts:361: Ionian, Lydian, Dorian, Aeolian, Phrygian, Locrian); l7u22m1g6 "Build the B locrian scale".
  - Spec: curriculum/07 md:359 says "covered in Level 2".
- Evidence:
  - `grep -lni "Dorian" src/core/constants/curriculumL[1-7].ts` returns only L7.
  - `grep -noi "ionian|aeolian|locrian|phrygian|lydian|mixolydian" curriculumL[1-6].ts` hits only the Phrygian half-cadence (L3:511-515), a "Mixolydian-flavored cadence" aside (L4:772) and L6:17/37 (Phrygian). The grep finds known positives, so it works.
  - L2's module titles (Major keys, Scale degrees, Natural minor, Harmonic/Melodic minor, Relative/Parallel, meter, triads...) include no modes module.
  - In L7 only l7u22m4 explains characteristic tones, and only for 4 modes, after l7u22m1 already uses all 7.
- Expected vs actual: someone should explain what a mode is (rotations of the major scale, parent scale, brightness order) before chord-scale theory relies on it.
- Scope: about 3 modules (l7u21m6, l7u22m1, l7u22m2 generated items) depend on knowledge never taught
- Suggested fix: add a "Modes of the major scale" concept/module before l7u22m1, or move l7u22m4 ahead of l7u22m1 and cover all 7 modes there.
- Status: verified

### C-32: "IV-V-vi-IV" presented as a rotation of the four-chord loop  _(area: L7; working id L7-13)_
- Severity: S2
- Type: incorrect
- Where: curriculumL7.ts:658, l7u23m1 concept 3: "The same four chords ... depending on which chord starts the loop ... IV-V-vi-IV (starting on IV)"
- Evidence: `derivations.mts` prints `FAILS IV-V-vi-IV is a rotation of I-V-vi-IV :: rotations: I-V-vi-IV | V-vi-IV-I | vi-IV-I-V | IV-I-V-vi`
- Expected vs actual: the rotation that starts on IV is IV-I-V-vi. IV-V-vi-IV drops I altogether.
- Scope: 1 concept
- Suggested fix: change the example to IV-I-V-vi.
- Status: verified

### C-33: "C#dim7 → Dm7: every voice moves by a half step or stays the same" is impossible  _(area: L7; working id L7-14)_
- Severity: S2
- Type: incorrect
- Where: curriculumL7.ts:449, task l7u22m2t3
- Evidence: `derivations.mts` searches every voice assignment and prints `FAILS ... best possible max move = 2 semitones (Db->D, E->F, G->A, Bb->C)`. G has no Dm7 tone within 1 semitone.
- Expected vs actual: at least one voice must move a whole step. Only the Cmaj7→C#dim7 half of the claim holds.
- Scope: 1 task
- Suggested fix: "most voices move by half step; the G rises a whole step to A."
- Status: verified

### C-34: "Between F and Em, insert F#dim7" offered as a chromatic bass walk  _(area: L7; working id L7-15)_
- Severity: S2
- Type: incorrect
- Where: curriculumL7.ts:430, l7u22m2 concept 3
- Evidence: `derivations.mts` gives `F->F# = +1, F#->E = -2 (direction reverses; second move is a whole step)`.
- Expected vs actual: F-F#-E is not a chromatic passing line. F and E are already a half step apart. The standard passing chord after IV is F-F#°7-G (or C/G), which ascends.
- Scope: 1 sentence
- Suggested fix: "Between F and G (or C/G), insert F#dim7: F-F#-G."
- Status: verified

### C-35: Answer leaks in authored chord-build prompts  _(area: L7; working id L7-16)_
- Severity: S2
- Type: bug
- Where: exercisesL7.ts:118 (l7u21m3e1, "Select all 4 notes: D, F, A, C"), exercisesL7.ts:132 (l7u21m3e2, "G, B, D, F"), exercisesL7.ts:166 (l7u21m4e1, "Db, F, Ab, Cb")
- Evidence: `exercises_check.mts` section 1 prints `LEAK` for all three. `leak2.mts` independently flags l7u21m3e1 and l7u21m4e1, and a planted case is caught. l7u21m3e2 is missed by `leak2` only because "C major" adds a C token.
- Expected vs actual: the prompt hands over the exact answer set, so the exercise tests copying.
- Scope: 3 exercises
- Suggested fix: drop the note lists from the prompts. They are already in the hints, which appear after a first wrong attempt.
- Status: verified

### C-36: "Build a D minor7 chord ... this extended chord": 7th chords called extended, with raw identifiers  _(area: L7; working id L7-17)_
- Severity: S2
- Type: incorrect
- Where: templatesL7.ts:22 and :27 (qualities `['major7','minor7','dominant7']`), l7u21m1g2-g5
- Evidence: `exercises_check.mts` section 4 prints `NOT-EXTENDED` for all 4. The module's own definition (curriculumL7.ts, l7u21m1 concept 2) is "Extensions are chord tones beyond the seventh". Rendered prompts read "Build a E dominant7 chord", with a raw enum and "a E".
- Expected vs actual: the prompt contradicts the definition the module teaches, and the hint (about 9ths/11ths/13ths) does not apply.
- Scope: 4 generated exercises
- Suggested fix: use major9/minor9/dominant9/dominant13 qualities (all in CHORD_FORMULAS), or drop "extended" and render readable names.
- Status: verified

### C-37: A distractor in the C7(#9) item is literally true  _(area: L7; working id L7-18)_
- Severity: S2
- Type: incorrect
- Where: templatesL7.ts:53, l7u21m1g1. Distractor: "The #9 means the 9th is sharpened above a major 9th".
- Evidence: an augmented 9th is a major 9th raised by one semitone (14 → 15 semitones; CHORD_FORMULAS.dominant7sharp9 uses 15). "Sharpened above a major 9th" describes exactly that.
- Expected vs actual: two choices are defensible.
- Scope: 1 choice set
- Suggested fix: rewrite it as a clearly false option (for example, "The #9 replaces the chord's 3rd").
- Status: verified

### C-38: Ear-training chords play every note in octave 4, so most stimuli sound inverted, and four are literally root-position 6 / m6 chords  _(area: L9+engine; working id E-2)_
- Severity: S2
- Type: bug
- Where: src/components/learn/exercises/ExerciseRunner.tsx:112 (`playChord(chord.notes, 4, …)`); core playChord (src/core/services/audio.ts:716-731) calls `playNote(note, octave)` for every note at the same octave. Explore uses `playChordVoiced` (CurrentChordPanel.tsx:106, ChordBuilderPanel.tsx:136), which stacks the chord in root position. Affects L9 l9u30m2, l9u31m4, l9u31m5.
- Evidence: `<T>/ear_exhaustive.mts` covers the full template parameter space (81 chord stimuli) plus the authored items. It replicates playChord's MIDI arithmetic (`12 + oct*12 + pc`). Run `npx tsx <T>/ear_exhaustive.mts`. Output section `## chord (52)` contains, among others: `l9u31m5/tpl0 A half_diminished7: plays C4 Eb4 G4 A4 (bass C4 = not the root) => identical to a ROOT-POSITION minor6 (m6) on C`; `B half_diminished7: plays D4 F4 A4 B4 => … minor6 (m6) on D`; `A minor7: plays C4 E4 G4 A4 => … major6 (6) on C`; `B minor7: plays D4 F#4 A4 B4 => … major6 (6) on D`; `E major7: plays Eb4 E4 Ab4 B4` (a semitone clash at the bottom). Live generated items are also affected: l9u30m2g4, l9u31m4g5/g6, l9u31m5e2, g1–g5 (structural.out). Planted control (`--plant`) caught `PLANT-chord`.
- Expected vs actual: Expected: quality-recognition stimuli in root position (ascending stack from the root, as Explore plays them and as the lesson says: "Root position sounds grounded"; hints like "the major 3rd (4 semitones from root)"). Actual: any chord whose root is above C wraps under it. For 4 seventh-chord stimuli the sound is exactly a root-position C6/D6/Cm6/Dm6, which is labelled "Minor 7" or "Half diminished 7".
- Scope: 52 of 81 template chord stimuli plus 1 authored (l9u31m5e2). That is 9 of the 20 chord exercises the current seeds generate.
- Suggested fix: use `playChordVoiced(chord.notes, 4, 1.2, cfg)` (or `playPitchedNotes` with ascending octaves) in ExerciseRunner's chord branch.
- Status: verified

### C-39: Progression and cadence audio uses inverted chords, so the taught "follow the bass" method gives wrong numerals  _(area: L9+engine; working id E-3)_
- Severity: S2
- Type: incorrect
- Where: ExerciseRunner.tsx:117-124 (`playChord(entry.chord.notes, 4, …)` per numeral); templatesL9.ts l9u32m3 (both templates; hint "Focus on the bass motion…"); curriculumL9.ts l9u32m3 C0 ("The bass note … tells you the root") and C2 ("Step 4: assign Roman numerals based on the scale degree of each bass note"); exercisesL9.ts l9u32m3e1 (PAC "V to I, both in root position").
- Evidence: `npx tsx <T>/ear_exhaustive.mts`, section `## prog (8)`: `V-I: voicings [D4 G4 B4] [C4 E4 G4] bass line D4 C4`; `I-V-vi-IV: … bass line C4 D4 C4 C4 (roots C G A F)`; `I-IV-V-I: bass line C4 C4 D4 C4`; `I-vi-IV-V: bass line C4 C4 C4 D4`.
- Expected vs actual: Expected: early harmonic dictation in root position (the project's own curriculum/09-ear-training.md:286-291 lists "Progressions with inversions" as difficulty level 3, after "Two-chord cadences" and "Four-chord diatonic progressions"). Actual: V is always a 6/4 chord, IV a 6/4 and vi a 6/3. A learner who follows the hint and lesson Step 4 hears bass C–D–C–C for I–V–vi–IV and would write I–ii–I–I. The "V – I" stimulus is not the root-position authentic cadence that l9u32m3e1 defines.
- Scope: all 8 progression sets in l9u32m3 (6 live generated items: g1–g6).
- Suggested fix: voice each chord with its root as the bass (e.g. root in octave 3 plus a close-position upper triad), or rewrite the hint/Step 4 to say "identify the bass, then decide if it is the root".
- Status: verified

### C-40: Cadence items play no key reference, so "IV – I" and "I – V" are the same harmonic event  _(area: L9+engine; working id E-4)_
- Severity: S2
- Type: incorrect
- Where: templatesL9.ts l9u32m3 template 0 (progressionSets [V,I],[IV,I],[V,vi],[I,V]; prompt "Listen to this cadence in C major and identify it."); ExerciseRunner.tsx:117-124 plays only the two chords.
- Evidence: `npx tsx <T>/ear_exhaustive.mts`, section `## progAmb (1)`: `"IV - I" and "I - V" have identical relative shape [M 7:M] -> indistinguishable without a tonic reference`. Derivation: F→C and C→G are both a major triad followed by a major triad whose root is a perfect 5th higher. Only knowing which chord is the tonic separates them, and nothing establishes C before the two chords sound. The planted pair `PLANT-prog` is caught.
- Expected vs actual: Expected: the listener can infer the answer from what is heard (a tonic chord or scale first, as the lesson's own Step 1 "listen for the key" assumes). Actual: telling plagal from half cadence needs absolute pitch, or relies on a voicing accident (static vs moving bass).
- Scope: 2 of the 4 options in the cadence template (live items l9u32m3g1 IV–I and g4 I–V).
- Suggested fix: play a short tonic establishment (I chord or scale) before the cadence, or replace I–V with ii–V / IV–V so the set is unambiguous.
- Status: verified (structural identity); inferred (that learners can't separate them by voicing cues)

### C-41: Note-naming ear items give no reference pitch, so they require absolute pitch that the module itself says isn't the goal  _(area: L9+engine; working id E-5)_
- Severity: S2
- Type: ux
- Where: templatesL9.ts l9u30m1 (2 note templates), l9u32m1 tpl0, l9u32m2 tpl0; exercisesL9.ts l9u30m1e1/e2, l9u32m1e1/e2; ExerciseRunner.tsx:84-86 plays the single note only. Lesson text curriculumL9.ts l9u30m1 C0: "The goal is not perfect pitch … but reliable relative pitch — hearing a note in relation to a reference."
- Evidence: dump (`<T>/dump_L9.txt`) shows 16 ear `mode:"note"` items. The prompts and audio offer no reference tone. Hints such as l9u32m1e1 "This pitch is the 3rd degree of C major. Sing up from C to locate it" refer to a C that is never played. Distractors are the neighbouring semitones (generateNoteChoices offsets ±1, ±2; e.g. `C#: choices [C, C#, D, D#]` in `<T>/ear_exhaustive.out`). Module completion requires ≥80% (ModuleView.tsx:118-119, useLearnProgress.ts:83-91). Derivation for l9u30m1 (8 note items + 2 text MCQs): a relative-pitch-only learner guessing at 25% scores 2 + 8×(0.5) + 0.5k with k first-try hits (the 0.5 retry comes from E-1). Passing (≥8) needs k≥4. P(Bin(8, .25) ≥ 4) = 1 − (0.1001+0.2670+0.3115+0.2076) ≈ 0.11.
- Expected vs actual: Expected: name a pitch relative to a played reference (e.g. play C4 or the tonic first), consistent with the lesson. Actual: absolute pitch identification. Without the E-1 retry giveaway the pass chance would be lower still.
- Scope: 16 exercises (l9u30m1: 8 of its 10).
- Suggested fix: play a reference (C4, or the tonic of a stated key) before the target and say so in the prompt, or convert these to "higher/lower/same" and interval-from-reference items.
- Status: verified (no reference is played; probability derivation); inferred (learner impact)

### C-42: "It includes an accidental" plus the choice generator gives the answer away for D# and A#  _(area: L9+engine; working id E-6)_
- Severity: S2
- Type: incorrect
- Where: templatesL9.ts:30-40 (l9u30m1 tpl1, roots C#/D#/F#/G#/A#, prompt "…It includes an accidental."); exerciseHelpers.ts generateNoteChoices (offsets [1,-1,2,…], first spelling of each pitch class).
- Evidence: `npx tsx <T>/ear_exhaustive.mts`, section `## note`: `D#: choices [D, D#, E, F] -> 1 accidental option(s) <-- prompt gives the answer away`; `A#: choices [A, A#, B, C] -> 1 accidental option(s) <-- …`. C#, F# and G# each have 2 accidental options. The live item l9u30m1g6 (A#4) is one of the giveaways.
- Expected vs actual: Expected: the prompt doesn't eliminate the distractors. Actual: for 2 of 5 roots exactly one option has an accidental, so the prompt alone identifies it. For the other 3 it halves the choice.
- Scope: template space 2/5 roots fully leaked; 1 live item (l9u30m1g6), plus l9u30m1g5 (C#) at 50/50.
- Suggested fix: drop "It includes an accidental" from the prompt, or make distractors all accidentals (e.g. other black keys).
- Status: verified

### C-43: The "Chromatic" dictation module calls diatonic intervals "chromatic" and a diatonic semitone a "chromatic half step"  _(area: L9+engine; working id E-7)_
- Severity: S2
- Type: incorrect
- Where: templatesL9.ts l9u32m2 tpl1 (intervals [1,3,6,8,10,11]; prompt "Listen to this chromatic interval…"; hint "Chromatic intervals include augmented and diminished qualities. This interval uses a note outside the diatonic scale."); exercisesL9.ts l9u32m2e1 hint ("A chromatic half step (1 semitone)…" for E4→F4).
- Evidence: the answer key labels are INTERVAL_LABELS 1,3,6,8,10,11 = Minor 2nd, Minor 3rd, Tritone, Minor 6th, Minor 7th, Major 7th (chords.ts:428-441). Source: Wikipedia, "Interval (music) – Diatonic and chromatic": "all perfect, major and minor intervals are diatonic … no augmented or diminished interval is diatonic, except for the augmented fourth and diminished fifth" (https://en.wikipedia.org/wiki/Interval_(music), accessed 2026-10-30). E–F is a minor 2nd (two letter names), i.e. a diatonic semitone. A chromatic semitone keeps the letter (F–F#).
- Expected vs actual: Expected: chromatic stimuli (augmented/diminished spellings, or a diatonic line with a chromatic note) or honest labels. Actual: every interval this template can emit is diatonic, and the hint asserts aug/dim qualities that the answer options never use. Live items: l9u32m2g1 (M7), g3 (m6), g4 (m3).
- Scope: 6 interval values × 6 roots × 2 directions in the template (3 live items) + 1 authored hint; the "chromatic note" prompt (2 live items) has no key context either.
- Suggested fix: retitle as "intervals with accidentals" or play a diatonic context with a chromatic passing tone. Fix the e1 hint ("diatonic half step").
- Status: verified

### C-44: The "Melodic dictation" modules never play a melody  _(area: L9+engine; working id E-8)_
- Severity: S2
- Type: content-gap
- Where: curriculumL9.ts l9u32m1 (objective "Transcribe short diatonic melodies by ear"), l9u32m2 (objective "…two-part dictation"); templatesL9.ts l9u32m1 tpl0 prompt "Listen to this pitch from a stepwise melody and identify it."; src/core/types/exercise.ts:61 `EarTrainingConfig.mode` has no melody mode ('note'|'interval'|'chord'|'scale'|'progression').
- Evidence: dump_L9.txt, l9u32m1 (9 items) and l9u32m2 (8 items): every ear item is a single note or a single interval. ExerciseRunner.tsx:84-125 has no sequence-of-notes branch.
- Expected vs actual: Expected: hear a short melody and reproduce or identify it. Actual: isolated pitches (absolute pitch, see E-5) and isolated intervals, under a prompt claiming they come "from a stepwise melody".
- Scope: 2 modules, 17 exercises.
- Suggested fix: add a 'melody' ear mode (play 3–5 notes after a tonic, answer by choosing among notated or numbered options, or by instrument input), or retitle the modules honestly.
- Status: verified

### C-45: Task l9u31m3t1 says the blues scale is the "C pentatonic scale" plus one note, but that query opens C major pentatonic  _(area: L9+engine; working id E-10)_
- Severity: S2
- Type: incorrect
- Where: curriculumL9.ts l9u31m3 task t1 ("Play 'C pentatonic scale' then 'C blues scale' — the blues scale adds one note (Gb, the blue note)" [q: C pentatonic scale]).
- Evidence: `npx tsx <T>/l9_queries.mts` gives `C pentatonic scale -> scale C pentatonic_major: C D E G A`. Derivation: C blues = C Eb F Gb G Bb. Against C D E G A they share only C and G (3 notes removed, 4 added). The "+Gb" relation holds for C minor pentatonic (C Eb F G Bb), as the module's own C1 text says.
- Expected vs actual: Expected: compare C minor pentatonic with C blues. Actual: the button opens C major pentatonic, and the claim is false for what is shown.
- Scope: 1 task. A related task, l9u31m3t2, says "Play 'C whole tone scale'" but its query is rootless `whole tone scale`, which keeps the current key (queryExecutor.ts:101-106).
- Suggested fix: change the query and instruction to 'C minor pentatonic'. Give t2 the query 'C whole tone scale'.
- Status: verified

### C-46: The verse-chorus question's wording is the textbook definition of rondo  _(area: L9+engine; working id E-11)_
- Severity: S2
- Type: incorrect
- Where: exercisesL9.ts l9u32m5e2 ("A song alternates between a recurring section and contrasting sections (A-B-A-B). What form is this?" key: Verse-chorus; distractor: Rondo form).
- Evidence: Wikipedia "Rondo": "a musical form that contains a principal theme (sometimes called the 'refrain') which alternates with one or more contrasting themes" (https://en.wikipedia.org/wiki/Rondo, accessed 2026-10-30). The module's own C1 also defines rondo as "alternates a recurring theme with contrasting episodes".
- Expected vs actual: Expected: one defensible answer. Actual: the prose points to rondo and only "A-B-A-B" and the word "song" point to verse-chorus. A careful learner can defend "Rondo".
- Scope: 1 exercise.
- Suggested fix: "A pop song alternates verses (new lyrics, same music) with a repeated chorus…"
- Status: verified

### C-47: L9 is open to beginners but drills material first taught in L5–L7  _(area: L9+engine; working id E-12)_
- Severity: S2
- Type: content-gap
- Where: src/core/constants/levels.ts:105-113 (l9: difficulty beginner, "All Levels", `prerequisites: []`, parallel) and src/data/curriculumLoader.ts:51 (difficulty 'beginner', label "All Levels"). The project's design note curriculum/09-ear-training.md:12-27 says sub-levels should unlock with the matching theory levels. That isn't implemented.
- Evidence: grep counts of first appearance in curriculumL1–L8 (command in Coverage): Dorian first in L7, Phrygian L3 (passing mention) / L7, pentatonic L7, whole-tone L6, secondary dominant / V/V L4–L5, solfège never in L1–L8. L9 drills these in l9u31m2 (modes), l9u31m3 (pentatonic/blues/whole-tone) and l9u32m2 (V/V) behind only intra-L9 prerequisites.
- Expected vs actual: Expected: the parallel track is gated or annotated by theory level ("best after L7"). Actual: a day-one learner can open the modes and pentatonic ear drills. Each L9 lesson has a short explanation, which partly mitigates this.
- Scope: at least 3 of 15 L9 modules.
- Suggested fix: add per-module "pairs with Lx" badges or soft prerequisites (e.g. l9u31m2 after l7u22m1).
- Status: verified (data); inferred (learner impact)

### C-48: Answering an ear item while it still plays makes the next ear item start silent, and Replay is blocked too  _(area: L9+engine; working id E-19)_
- Severity: S2
- Type: bug
- Where: src/components/learn/exercises/ExerciseRunner.tsx:76-79 (`playingRef` is one ref for the whole runner, and `playEarAudio` returns early while it is true); :128-133 (lock released by `setTimeout(…, earPlaybackLockMs(cfg))` of the PREVIOUS exercise); :135-141 (autoplay fires once, 300 ms after the new exercise mounts). The lock lasts up to ~3.3 s for a scale and ~4.2 s for a 4-chord progression (exerciseHelpers.ts earPlaybackLockMs).
- Evidence: vitest repro `<T>/vitest/earAutoplayLock.test.tsx` with config `<T>/vitest/vitest.audit.config.mts`; run `npx vitest run --config <T>/vitest/vitest.audit.config.mts --silent=false`. Output (`<T>/vitest/earAutoplayLock.out`): the CONTROL (answer after 3.5 s) autoplays the second scale (2 calls). The BUG case (answer after 1.5 s) logs `playScale calls after next exercise autoplay window: 1` and `playScale calls 5 s later (no further autoplay attempt is scheduled): 1`.
- Expected vs actual: Expected: each ear exercise plays its own stimulus on arrival. Actual: a learner who answers quickly (e.g. names a mode by its 4th note) gets a silent next exercise, and Replay does nothing until the old lock expires. The old progression's `setTimeout` chords are also never cancelled on exercise change, so they can sound over the new item (inferred from code; not measured).
- Scope: any two consecutive ear items in a session. All L9 ear modules have runs of 5–9 consecutive ear items.
- Suggested fix: reset `playingRef` (and clear pending timeouts and stop playback) in the effect that runs on exercise change. Key the lock to the exercise id.
- Status: verified

### C-49: Systemic: generated-exercise templates are keyed to an older module order in L3, L4, L6, L7 and L8 (L1, L2, L5 and L9 are aligned)  _(area: L9+engine; working id E-20)_
- Severity: S2
- Type: bug
- Where: src/data/exercises/templatesL3.ts (l3u10m3 to l3u11m5), templatesL4.ts (l4u13m2 to l4u13m5), and the L6/L7/L8 blocks itemised in the per-level findings on template mis-mapping (fork working ids L6-9, L7-9).
- Evidence: `<T>/template_header_vs_title.py` (`python3 -I <T>/template_header_vs_title.py`, output `template_header_vs_title.out`) prints each template block's own header comment next to the curriculum module title, for all 9 levels. L1, L2, L5 and L9 headers match their modules row for row. Positive control: `l6u20m2 curr='Species Counterpoint: Fourth and Fifth Species' || tpl='Equal Division of the Octave'`. Mismatches outside my levels: `l3u10m3 curr='Root Position Part Writing' || tpl='Cadences — PAC, IAC, HC'`, `l3u11m5 curr='Transposition' || tpl='Non-Chord Tone Review'`, `l4u13m3 curr='Leading-Tone Sevenths' || tpl='Harmonic Rhythm'`, `l4u13m4 curr='Harmonic Function' || tpl='Sequences'`, and so on. Content confirmation: `<T>/l3l4_gen_prompts.mts` (output `.out`) shows l3u10m3's generated items are "Classify this cadence type…", l3u11m5 "Transposition" gets non-chord-tone items, and l4u13m3 "Leading-Tone Sevenths" gets "Answer this question about harmonic rhythm."
- Expected vs actual: Expected: each module's generated items practise that module. Actual: in the shifted ranges they practise a neighbouring module's topic. The pattern looks like a one-or-two-slot shift after modules were inserted or reordered.
- Scope: L3 7 modules / 28 generated items; L4 4 modules / 16 items (l4u13m2 is loosely related). L6/L8 have 23 and L7 has 34, as itemised. Total ≈ 101 generated exercises.
- Suggested fix: re-key the blocks by topic, and add a test asserting that each template block's header topic matches its module title (or store the topic in data and compare).
- Status: verified (header and prompt level for L3/L4; item-level detail for L3/L4 is left to the L3/L4 track)

### C-50: The diminished-seventh formula is displayed as "R m3 b5 6"  _(area: Explore; working id EX-4)_
- Severity: S2
- Type: incorrect
- Where: `src/core/constants/chords.ts:484-491`. `CHORD_CONTEXT_LABELS` has no override for 9 semitones inside `diminished7`. It falls back to `INTERVAL_SHORT_LABELS[9]` = "6" (`:465`). Shown in the "Formula" row at `CurrentChordPanel.tsx:89, 246-254`.
- Evidence: `EXP/oracle.mts`: `diminished7: chord tone bb7 shown as "6" (degree number wrong)`. That is the only label error across all 50 qualities.
- Expected vs actual:
  - Expected: "bb7" (or "°7"). The fourth tone of a dim7 is a diminished 7th, and the chord itself is spelled with Bbb (`buildChord` correctly gives C Eb Gb Bbb).
  - Actual: "6".
- Scope: 1 quality, every root
- Suggested fix: add `diminished7: { 9: { label: 'Diminished 7th', short: 'bb7' } }` to `CHORD_CONTEXT_LABELS`.
- Status: verified

### C-51: Circle of Fifths shows the wrong key signature for modes, C# major and Ab minor  _(area: Explore; working id EX-5)_
- Severity: S2
- Type: incorrect
- Where: `src/components/theory/CircleOfFifths.tsx:61-68`. Any scale that isn't one of the three minor scales is located on the major ring by its tonic. The centre text is at `:362-372`.
- Evidence: `EXP/circle.mts` reproduces the component's selection logic with the app's constants and compares it with an oracle key signature (accidentals in the correctly spelled scale):
  - `62 wrong` out of 7 modes × 12 KeySelector roots
  - `D dorian: centre shows "D" with "2♯", correct signature no ♯/♭`
  - `E phrygian: … "4♯", correct … no ♯/♭`
  - `C# major: centre shows "C#" with "5♭", correct signature 7♯`
  - `Ab natural_minor: centre shows "Abm" with "5♯", correct signature 7♭`
- Expected vs actual:
  - Expected for a mode: the parent key's signature (D Dorian = no sharps or flats) and highlight.
  - Expected for C# and Ab: a label that agrees with the signature.
  - Actual: D Dorian is shown as "D / 2♯", and C# major as "C# / 5♭".
- Scope:
  - All 60 (mode, root) combinations for dorian, phrygian, lydian, mixolydian and locrian.
  - Plus C# major and Ab minor.
  - Any non-diatonic scale also falls back to its tonic's major key. That case was not counted.
- Suggested fix: compute the circle position from the scale's parent major (for example, the tonic minus the mode's offset), and display the enharmonic name the circle actually uses (Db rather than C#) or both.
- Status: verified

### C-52: The Circle of Fifths labels its segments with major-key Roman numerals whatever scale is selected  _(area: Explore; working id EX-6)_
- Severity: S2
- Type: incorrect
- Where: `src/components/theory/circleOfFifthsConstants.ts:43-45` (a fixed `I ii iii IV V vi vii°`), used at `CircleOfFifths.tsx:262-271`.
- Evidence: `EXP/circle.mts`, section "major-ring Roman numerals": 8 of 9 seven-note scales are wrong. For example, in C natural minor:
  - `C: "I" (… is i)`
  - `Eb: "iii" (… is III)`
  - `Ab: "vi" (… is VI)`
  - `Bb: "vii°" (… is VII)`
- Expected vs actual:
  - Expected: numerals that match the triad on each degree of the selected scale (minor: i ii° III iv v VI VII).
  - Actual: the major-key numerals.
- Scope: 8 scale types (natural, harmonic and melodic minor, dorian, phrygian, lydian, mixolydian, locrian)
- Suggested fix: take the numeral from `useKeyContext().diatonicChords[degree-1].numeral` instead of the constant.
- Status: verified

### C-53: Several "Compatible Scales" suggestions contradict their own chord, and the 7#9 ranking is backwards  _(area: Explore; working id EX-7)_
- Severity: S2
- Type: incorrect
- Where: `src/core/constants/chordScaleRelationships.ts`. The context text is shown as a tooltip on each chip (`CurrentChordPanel.tsx:280`).
- Evidence: `EXP/oracle.mts`, "chord-scale map" section, 107 suggestions checked. Each case below is listed with the derivation for C:
  - **sus4 → Major Pentatonic**, "Safe, no clash with 3rd" (`:246`). C major pentatonic is C D E G A: it contains the major 3rd (E) that a sus chord replaces, and it lacks the chord's 4th (F). The claim is the opposite of the facts. sus2sus4 → Major Pentatonic (`:250`) also lacks F.
  - **maj7#11 → Lydian Dominant** (`:324`, "Add b7 flavor") and **maj9#11 → Lydian Dominant** (`:213-218`, "Swap to b7"). They put Bb against the chord's own B, a semitone clash with a chord tone.
  - **13b9 → Phrygian Dominant** (`:234`). The scale has Ab (b13) where the chord has A (13).
  - **7#9 → Altered** ranked *primary* as "THE Hendrix chord scale" (`:156-160`), with Blues only a "color" option (`:166`).
    - The app's 7#9 contains the perfect 5th (`chords.ts:74`), which the altered scale lacks.
    - Wikipedia, "Dominant seventh sharp ninth chord" (fetched 2026-10-30): "The dominant 7♯9 chord is usually found in blues contexts"; "it is one option when seeing the chord symbol 7alt"; the chord includes the perfect fifth.
  - **7#5 → Whole Tone**, "Every note is aug chord tone" (`:181`). False: the whole-tone scale has 6 notes and C7#5 has 4 (D and F# are not chord tones).
  - **maj7b5 → Whole Tone** (`:311`): the scale lacks the chord's major 7th.
  - **7#11 → Whole Tone** (`:210`): the scale lacks the chord's natural 5th (C7#11 is C E G Bb F#; whole tone has G# instead of G).
- Expected vs actual: each suggested scale should contain the chord's tones, or the context should honestly name the clash. Actually, 9 suggestions contain a scale note a semitone from a chord tone, or their prose is false.
- Scope: 9 suggestions across 8 chord qualities
- Suggested fix:
  - Re-rank 7#9: half-whole diminished or blues first, altered when the symbol is 7alt.
  - Drop or re-word the clashing secondary and colour entries.
  - Fix the sus4 and 7#5 wording.
- Status: verified (chord-tone containment by script; the Hendrix and blues ranking against a cited source)

### C-54: Diminished (H-W), Diminished (W-H) and chromatic scales are displayed with wrong letter names  _(area: Explore; working id EX-8)_
- Severity: S2
- Type: incorrect
- Where: degree maps in `src/core/constants/scales.ts:225-227`. Shown in the Explore header note row (`ExploreView.tsx:99-100`), on ScaleDegreeBar and on the instruments.
- Evidence:
  - `EXP/oracle.mts`: `diminished_half_whole: 84 mis-spelled notes`, for example `C*: deg6 Abb (expected G)`, `deg4 Fb (expected E)`.
  - `EXP/show_scales.mts`:
    - `C diminished_half_whole notes: C Db Eb Fb Gb Abb Bbb Bb`
    - `Eb diminished_half_whole notes: Eb Fb Gb Abb Bbb Cbb Dbb Db`
    - `C diminished_whole_half … Bbb B`
    - `F# chromatic notes: F# F## G# G## A# B B# C# C## D# D## E#`
  - `EXP/doubles.mts`: across the 12 KeySelector roots there are 19 double accidentals in Diminished (H-W), 15 in chromatic and 7 in Diminished (W-H).
- Expected vs actual:
  - Expected, in standard jazz spelling: C half-whole = C Db Eb E F# G A Bb. The perfect 5th is G, never Abb.
  - Expected for the chromatic scale: naturals where they exist (F# G G# A …).
  - Actual: spellings that rename the 5th as a diminished 6th, and chromatic scales written with double sharps.
- Scope:
  - Diminished (H-W): 84 notes over 21 roots.
  - Chromatic: every sharp-side root.
  - Diminished (W-H): degree 7 spelled bb7 at every root.
- Suggested fix: use explicit spelled formulas for symmetric scales (H-W: 1 b2 #2 3 #4 5 6 b7) and spell the chromatic scale as "sharps ascending, naturals preferred".
- Status: verified

### C-55: The scale-degree bar's interval labels contradict the note name printed directly beneath them  _(area: Explore; working id EX-9)_
- Severity: S2
- Type: incorrect
- Where: `src/core/constants/scales.ts:108-118`. Scales that don't have 7 notes fall back to the semitone-based `INTERVAL_SHORT_LABELS`. Rendered at `ScaleDegreeBar.tsx:29, 85-95`.
- Evidence: `EXP/oracle.mts`, "ScaleDegreeBar label vs note letter" section:
  - whole_tone: 36 cases, e.g. `C: label "b6" over note G#`, `"b7" over A#`
  - blues: 12 cases, e.g. `C: label "b5" over note F#`
  - diminished H-W: 36 cases, e.g. `"5" over Abb`
  - diminished W-H: 12 cases
  - chromatic: 60 cases, e.g. `"m2" over C#`
  - `EXP/show_scales.mts` shows the full rows, e.g. `C whole_tone notes: C D E F# G# A# bar labels: R 2 3 b5 b6 b7`.
- Expected vs actual:
  - Expected for whole tone: 1 2 3 #4 #5 b7/#6.
  - Expected for C blues: either F# labelled #4, or Gb labelled b5.
  - Actual: "b6" printed above G#.
- Scope: 156 label/note contradictions over 5 scale types × 12 roots
- Suggested fix: derive the label from the spelled note's letter distance and accidental, as is already done for 7-note scales.
- Status: verified

### C-56: Phrygian Dominant is listed under "Mel. Minor Modes"  _(area: Explore; working id EX-10)_
- Severity: S2
- Type: incorrect
- Where: `src/components/navigation/KeySelector.tsx:66-77`
- Evidence: `EXP/oracle.mts`: `phrygian_dominant listed under "Mel. Minor Modes" but is not a mode of melodic minor (it is mode 5 of harmonic minor)`. The app's own comment at `scales.ts:30` says "Mode 5 of harmonic minor".
- Expected vs actual:
  - Expected: grouped with harmonic-minor modes, or the group renamed.
  - Actual: shown as a melodic-minor mode.
- Scope: 1
- Suggested fix: move it, or rename the group to "Minor-scale modes".
- Status: verified

### C-57: The Chord Builder spells chord tones by the key, not by the chord (C minor shown as C–D#–G)  _(area: Explore; working id EX-11)_
- Severity: S2
- Type: incorrect
- Where: `src/components/theory/ChordBuilderPanel.tsx:76-85`. A note outside the scale is spelled from a fixed sharp table, or a flat table if the key has any flat. The intervals row is fixed at `:51`.
- Evidence: `EXP/builder.mts` replicates `noteAtStep`, parsing the two spelling tables from the component source:
  - `791/1296 mis-spelled (12 keys x 12 roots x 9 qualities)`, of which 664 are plain-accidental errors.
  - `key C major, C minor: shows C–D#–G expected C–Eb–G`
  - `C dominant7: shows C–E–G–A#`
  - `Db major: shows C#–F–G#`
  - `351 show the chosen ROOT under a different name`: the root picker says Db, and the Notes row starts with C#.
  - The intervals row also labels the augmented 5th as "m6" (C+ → "R, M3, m6" above "C – E – G#").
- Expected vs actual:
  - Expected: spelling by chord degree, as `buildChord` already does (the panel's chord *name* is correct).
  - Actual: the Notes row disagrees with the detected chord name and with its own interval labels.
- Scope: 664–791 of 1,296 (key, root, quality) combinations
- Suggested fix: spell the Notes row from `top.chord.notes` when there is a match. Otherwise spell letter-by-interval from the chosen root.
- Status: verified. Chord *identification* itself is correct: `EXP/identify.mts` gives `600 chords: wrong root 0, different pitch set 0, not 'exact' 0`.

### C-58: Explore writes modal numerals without accidentals, while the curriculum writes bII and bVII  _(area: Explore; working id EX-12)_
- Severity: S2
- Type: incorrect
- Where: `src/core/constants/chords.ts:686-699` (`getRomanNumeral` never adds b or #), used by ChordGrid and ScaleDegreeBar. The source's own comments say `#iv°` (`:577`), while the UI shows `iv°`.
- Evidence: `EXP/numerals.mts` compares the app's numerals with numerals written against the parallel major:
  - `phrygian app: i II III iv v° VI vii relative-to-major: i bII bIII iv v° bVI bvii`
  - `mixolydian … VII vs bVII`
  - `locrian … V vs bV` (a "V" shown for Gb major)
  - 19 numerals differ across the modes.
  - The L7 curriculum uses the flat forms: `curriculumL7.ts:184` (bVII7-I), `:541` (bII, bVII), `:644` (bVII-IV).
- Expected vs actual:
  - Expected: Mixolydian's Bb chord written bVII, as the lessons teach.
  - Actual: "VII".
  - Classical minor-key III, VI and VII are a defensible convention, so only the 5 church modes are counted here.
- Scope: 5 modes, about 14 numerals
- Suggested fix: prefix b or # in `getRomanNumeral` when the degree differs from the major-scale degree, for the modal scale types.
- Status: verified

### C-59: For chords with five or more notes, the extra inversion buttons are all labelled "Root"  _(area: Explore; working id EX-13)_
- Severity: S2
- Type: bug
- Where: `src/components/panels/CurrentChordPanel.tsx:38` (4 label keys) and `:218-233` (one button per note; `?? 'panel.rootPos'`)
- Evidence: `EXP/misc.mts`: `inversion buttons: 25 qualities have more notes than labels`, for example `major9 (5 notes): Root | 1st Inv | 2nd Inv | 3rd Inv | Root`. 7alt (7 notes) gets three extra "Root" buttons.
- Expected vs actual:
  - Expected: "4th Inv" for the button that puts the 9th in the bass (or no such button).
  - Actual: a second "Root" button that actually puts the 9th in the bass.
- Scope: 25 chord qualities
- Suggested fix: use `chordBuilder.inversion.nth` ("Inv {{n}}"), which already exists in en.json, for i ≥ 4, or cap inversions at 3.
- Status: verified

### C-60: Two generated question prompts don't match their keyed answer.  _(area: L6/L8; working id L6-12)_
- Severity: S3
- Type: ux
- Where: templatesL6.ts:32 + :43 (l6u18m1g1: prompt "How does the Neapolitan chord function and resolve?", correct option "The Neapolitan chord in C minor is Db major (Db-F-Ab)"). templatesL6.ts:149 + :166 (l6u18m4g1: prompt "How does enharmonic reinterpretation ... enable modulation?", correct option "...was exploited extensively by Romantic composers").
- Evidence: `<track>/dump_L6.txt` entries l6u18m1g1 and l6u18m4g1.
- Expected vs actual: expected the prompt to ask what the options answer. Actual: the prompt asks "how/function" and the answer is an identity or history fact.
- Scope: 2 generated exercises.
- Suggested fix: Give each choice set its own prompt (e.g. "Which chord is the Neapolitan in C minor?").
- Status: verified

### C-61: Chord-build prompts call a bare triad or 7th "the Neapolitan" / "enharmonic German sixth" without naming a key. They also use the wrong article ("a F", "a Ab", "a Eb").  _(area: L6/L8; working id L6-13)_
- Severity: S3
- Type: ux
- Where: templatesL6.ts:20 (l6u18m1g2/g4/g5: "Build a F / Cb / Gb major triad (Neapolitan chord).") and templatesL6.ts:129 (l6u18m3g1/g4/g5/g6: "Build a Ab / Cb / Eb / Db dominant seventh chord (enharmonic German augmented sixth)").
- Evidence: dump_L6.txt. Without a key, "(Neapolitan chord)" carries no information: F is bII of E minor, Cb of Bb minor and Gb of F minor, none stated. The exercise is just "build a major triad".
- Expected vs actual: expected "Build the Neapolitan of E minor (F major)" or "Build the Neapolitan in {key}". Actual: a key-less label.
- Scope: 7 generated exercises.
- Suggested fix: Template on the tonic ("Build the Neapolitan (bII) of {key} minor") and compute the root, or drop the parenthetical. Use "an" before vowel-sound letters (A, E, F).
- Status: verified

### C-62: Third species: the cambiata is called "the only exception" to dissonance resolving by step. The double neighbor, which the same module permits, also leaves a dissonance by leap.  _(area: L6/L8; working id L6-14)_
- Severity: S3
- Type: incorrect
- Where: src/core/constants/curriculumL6.ts:514 (task l6u20m1t3), compared with the l6u20m1 concept "Third Species" ("Double neighbors ... are also permitted")
- Evidence: Derivation: in the double-neighbor figure C–D–B–C over a C cantus note, D (a 9th/2nd, dissonant) leaps a third down to B. Treatment varies by textbook, which is why this is inferred.
- Expected vs actual: expected "one of the few exceptions (with the double neighbor)". Actual: "the only exception".
- Scope: 1 task.
- Suggested fix: Reword as above.
- Status: inferred

### C-63: "Each additional voice exponentially increases the number of interval pairs." The growth is quadratic (n(n−1)/2).  _(area: L6/L8; working id L6-15)_
- Severity: S3
- Type: incorrect
- Where: src/core/constants/curriculumL6.ts:591 (l6u20m3 concept 1)
- Evidence: theory_oracle.mts → `voice pairs for 2,3,4 voices ... [1,3,6]`. The task right after it (l6u20m3t1) correctly says "three pairs instead of one".
- Expected vs actual: expected "rapidly" or "quadratically". Actual: "exponentially".
- Scope: 1 sentence.
- Suggested fix: Replace "exponentially" with "quickly (2 voices = 1 pair, 3 = 3, 4 = 6)".
- Status: verified

### C-64: The It+6 sentence "It resolves directly to V with scale degree 1 doubled" reads as though V doubles scale degree 1, which V doesn't contain.  _(area: L6/L8; working id L6-16)_
- Severity: S3
- Type: ux (ambiguous)
- Where: src/core/constants/curriculumL6.ts:86 (l6u18m2 concept "The Italian Sixth")
- Evidence: Derivation: V = 5-7-2 has no scale degree 1. The doubled tonic belongs to the four-voice It+6 itself, and it resolves to V with a doubled root (curriculum/06 md: "Resolves to V with doubled root").
- Expected vs actual: expected "In four voices the tonic is doubled; it resolves to V with doubled root". Actual: the doubling is attached to V.
- Scope: 1 sentence.
- Suggested fix: As in "expected".
- Status: verified

### C-65: Canon text claims "the further the canonic interval from the unison, the more constrained" the writing. The octave is the furthest of the common intervals and among the least constrained.  _(area: L6/L8; working id L8-4)_
- Severity: S3
- Type: incorrect
- Where: src/core/constants/curriculumL8.ts:134 (l8u25m3 concept 1). The md repeats it (curriculum/08 "the further from unison, the more challenging").
- Evidence: Derivation: a canon at the octave has the same pitch-class content as a canon at the unison, so its intervals with the leader invert at the octave (3↔6, 5↔4) and the constraints are essentially those of the unison canon. A canon at the 2nd is much harder although it is "nearer" the unison. The app's own Goldberg task (l8u25m3t2) invites exactly this comparison.
- Expected vs actual: expected "Canons at the unison and octave are the most straightforward; other intervals change interval qualities and add constraints". Actual: a monotonic "further = harder" rule.
- Scope: 1 sentence (+ md).
- Suggested fix: As in "expected".
- Status: inferred

### C-66: Sprechstimme is "developed by Schoenberg". Humperdinck used it first (1897); Schoenberg made it famous.  _(area: L6/L8; working id L8-5)_
- Severity: S3
- Type: incorrect
- Where: src/core/constants/curriculumL8.ts:545 (l8u27m4 concept 3)
- Evidence: Wikipedia, "Sprechgesang": "The earliest compositional use of the technique was in the first version of Engelbert Humperdinck's 1897 melodrama Königskinder". Schoenberg used it in Gurre-Lieder (1911) and throughout Pierrot lunaire (1912).
- Expected vs actual: expected "made famous by Schoenberg (Pierrot lunaire)". Actual: "developed by Schoenberg".
- Scope: 1 phrase.
- Suggested fix: As in "expected".
- Status: verified

### C-67: A task says neither the whole-tone nor the octatonic scale "has a ... leading tone". The C diminished scale the app plays contains B.  _(area: L6/L8; working id L8-6)_
- Severity: S3
- Type: incorrect
- Where: src/core/constants/curriculumL8.ts:504 (task l8u27m3t2)
- Evidence: `<track>/L6L8/trythis.out`: "C diminished scale" → `diminished_whole_half [C D Eb F Gb Ab Bbb B]`. theory_oracle.mts → `MISMATCH C W-H octatonic contains B (leading-tone pitch)? ... oracle=true`. It does lack G, so "no dominant" is right.
- Expected vs actual: expected "Neither contains the dominant (G), so the B in the octatonic has nothing to pull with" (or simply "no dominant"). Actual: claims no leading tone.
- Scope: 1 task.
- Suggested fix: Drop "or leading tone".
- Status: verified (pitch membership). Whether B counts as a functional leading tone without G is interpretive.

### C-68: Small wording errors in L8 answer keys.  _(area: L6/L8; working id L8-7)_
- Severity: S3
- Type: incorrect
- Where:
  - templatesL8.ts:261 (l8u27m1 generated, keyed: "A pitch-class set removes octave and enharmonic equivalence"). Pitch-class theory *assumes* octave and enharmonic equivalence and removes the octave/spelling *distinctions*.
  - exercisesL8.ts:446 (l8u27m3e1, keyed: planing is "maintaining the same intervallic structure"). That excludes the diatonic planing the same module teaches ("changing quality to fit the key", curriculumL8.ts l8u27m3 concept 1).
- Evidence: text derivation as stated.
- Expected vs actual: expected "...treats octave- and enharmonically-equivalent notes as one class" and "...in parallel motion (exactly, or adjusted to the scale in diatonic planing)".
- Scope: 2 exercises.
- Suggested fix: As in "expected".
- Status: verified

### C-69: The sonata-form hint uses Hepokoski–Darcy labels "P-T-S-C" that the module never introduces; the module teaches FTG/TR/STG/CT.  _(area: L6/L8; working id L8-8)_
- Severity: S3
- Type: ux (term used before taught)
- Where: templatesL8.ts:142 (hint on l8u26m1g1–g4)
- Evidence: the curriculumL8.ts l8u26m1 concept text uses FTG, TR, MC, STG, CT only, and "P-T-S-C" appears nowhere in the curriculumL*.ts files.
- Scope: 4 generated exercises.
- Suggested fix: Use "Exposition (FTG–TR–STG–CT)".
- Status: verified

### C-70: The orchestration module promises instrument ranges, but no range information is given.  _(area: L6/L8; working id L8-9)_
- Severity: S3
- Type: content-gap
- Where: src/core/constants/curriculumL8.ts:298 (objective "Identify instrument ranges and timbres"); also moduleIndex.ts:161 ("...ranges, timbres..."). The concepts of l8u26m3 give families, transpositions and doublings, but no ranges. The md (curriculum/08 §8.4) has a full range table that never reached the app.
- Evidence: reading of curriculumL8.ts l8u26m3 (all 3 concepts and 3 tasks).
- Scope: 1 module.
- Suggested fix: Port the md range table (sounding ranges) into a concept, or drop "ranges" from the objective and subtitle.
- Status: verified

### C-71: Some concepts are used before they are taught, or are never defined: "whole-tone" in the French-sixth lesson, "voice exchange", "double passing tones".  _(area: L6/L8; working id L6-17)_
- Severity: S3
- Type: content-gap
- Where:
  - curriculumL6.ts:73, :93, :107 (l6u18m2 Fr+6 relies on "whole-tone collection/scale on C"). The whole-tone scale is first explained in l6u19m4, five modules later, and grep shows no "whole-tone|whole tone" in curriculumL1–L5.
  - curriculumL6.ts:358, :378 and template hints (omnibus = "chromatic voice-exchange pattern"). `grep -n -i "voice exchange" curriculumL*.ts` finds no definition anywhere.
  - exercisesL6.ts:479 hint ("double passing tones") is never defined.
- Evidence: grep runs in this session (the same grep finds "cadential 6/4" in L3 and "Phrygian" in L3, so it works).
- Scope: 3 terms.
- Suggested fix: Add one-line glosses where each term first appears.
- Status: verified

### C-72: Cmd+K keyword "florid" points to the first-to-third species module. Florid (fifth-species) counterpoint is taught in l6u20m2.  _(area: L6/L8; working id L6-18)_
- Severity: S3
- Type: bug
- Where: src/data/moduleIndex.ts:57 (`'l6u20m1': ['counterpoint', 'cantus firmus', 'species', 'florid']`)
- Evidence: curriculumL6.ts l6u20m2 concept "Fifth Species: Florid Counterpoint". l6u20m1 never mentions florid.
- Scope: 1 keyword.
- Suggested fix: Move 'florid' to an l6u20m2 entry (add 'suspension' there too).
- Status: verified

### C-73: Unit milestone content (skills summary, bridge text, Try-This, prompt) is authored, and translated where checked, but no component renders it.  _(area: L6/L8; working id L6-19)_
- Severity: S3
- Type: tech-debt
- Where: milestones in curriculumL6.ts (u18/u19/u20) and curriculumL8.ts (u25/u26/u27, where u27 even has `bridgeText: ''` at line 684). The same pattern likely applies to every level (not checked beyond L6/L8).
- Evidence: `grep -rn "milestone\|skillsSummary\|tryThisPrompt\|completionContent" src --exclude-dir=__tests__` (excluding the curriculum data and PT/ES overlays) matches only src/core/types/curriculum.ts. The same grep style finds `tryThisLabel` in ModuleView.tsx:293, so it would have found a renderer.
- Expected vs actual: expected milestone content either shown at unit completion or deleted. Actual: dead content. The empty u27 bridgeText is harmless only because nothing renders it.
- Scope: 6 milestones in L6/L8.
- Suggested fix: Decide whether to show these at unit completion (cheap: the data exists) or delete them along with their overlays.
- Status: verified

### C-74: curriculum/06-chromatic-harmony.md and curriculum/08-advanced-analysis.md contain factual errors that the shipped .ts gets right (the md files are not bundled).  _(area: L6/L8; working id L6-20)_
- Severity: S3
- Type: incorrect
- Where / Evidence (derivations; theory_oracle.mts for the computable ones):
  - 06 §6.3: "Ab-Cb-Ebb-Gbb = viio7 of A". The leading tone of A is G#, so viio7 of A = G#-B-D-F. Ab-Cb-Ebb-Gbb is viio7 of Bbb. The .ts (l6u19m1) spells it correctly.
  - 06 §6.3 CTo7: "the other three voices resolve by half step". In C-D#-F#-A → C-E-G, A→G is a whole step. The .ts correctly says "two by half step, one by whole step".
  - 06 §6.4: chromatic mediants defined as having "at least one common tone", then "Doubly chromatic mediant: No common tones at all". The doc contradicts itself.
  - 06 §6.2: "Fr+6 → V: 2 resolves to leading tone (7)". D (2) is the fifth of V and is normally held; 1 moves to 7. This item is inferred.
  - 06 §6.5: "By 3: augmented triad / diminished seventh (4 notes)". The augmented triad (3 notes, step 4) is listed twice.
  - 08 §8.6 Polymodality: "C Lydian + C Mixolydian = all notes of C major". The union is 9 pitch classes (theory_oracle: `C Lydian ∪ C Mixolydian = 9` MATCH); the .ts correctly says nine.
  - 08 §8.6 Planing lists "Real" and "Tonal" planing as extra types, but they are synonyms of chromatic and diatonic planing.
- Expected vs actual: as listed.
- Scope: 7 statements across 2 md files.
- Suggested fix: Correct the md files or mark them as superseded planning docs. They read as authoritative specs.
- Status: verified, except the Fr+6 item (inferred). That the md is not bundled is inferred (no import of curriculum/*.md found in src).

### C-75: Engine counts stated in the lessons are wrong (46 scales, 42 chord types)  _(area: L7; working id L7-19)_
- Severity: S3
- Type: incorrect
- Where: curriculumL7.ts:842, :853, :878, :957, :963, :964
- Evidence: `<track>/L7/counts.mts` gives `SCALE_TYPE_NAMES keys: 37`, `CHORD_FORMULAS keys: 50`.
- Expected vs actual: the lessons say 46 and 42; the engine has 37 and 50.
- Scope: 6 strings (code comments in quickSearchResults.ts also say "46" and "47")
- Suggested fix: drop the numbers, or derive them from the constants.
- Status: verified

### C-76: 20 generated prompts point to "this X" that the prompt never shows  _(area: L7; working id L7-20)_
- Severity: S3
- Type: ux
- Where: templatesL7.ts, several promptTemplates: "Decode this jazz chord symbol.", "Analyze the ii-V-I progression in this context.", "Identify the characteristic chord or vamp that establishes this mode.", "Identify the modal interchange used in this pop progression.", "Analyze this common pop chord progression.", "Describe this harmonic technique…", "Which scale works best over this chord type?", "Identify this scale or its cultural context."
- Evidence: `exercises_check.mts` section 3 gives `vague prompts: 20` (two of these are false positives: l7u22m4e1 and e2 legitimately say "This mode").
- Expected vs actual: the subject appears only inside the options, so the learner has to reverse-engineer the question. For example, l7u22m2g1 asks for a "chord or vamp", but the answer is a note (#4).
- Scope: 18 exercises
- Suggested fix: write one stem per choice set that names the subject ("What does C7(#9) mean?").
- Status: verified

### C-77: Smaller prose inaccuracies in curriculumL7.ts  _(area: L7; working id L7-21)_
- Severity: S3
- Type: incorrect
- Where and evidence:
  - (a) :204, back-door: "D rises to E and Ab falls to G, both *upper* leading tones". D approaches E from below (`derivations.mts`: `FAILS D->E is an UPPER leading tone`).
  - (b) :375: "All three scales share the same notes", while offering "C Ionian (or C Lydian)". `derivations.mts`: `FAILS major ii-V-I ... | 0,2,4,6,7,9,11`; Lydian adds F#.
  - (c) :590: quintal "D-A-E-B ... is the inversion of a quartal voicing (D-G-C-F inverted gives open fifths)". D-G-C-F inverts to F-C-G-D; D-A-E-B inverts B-E-A-D.
  - (d) :527: "'So What' uses just two chords over a Dorian pedal". Wikipedia, "So What (Miles Davis composition)" (fetched 2026-10-30): "16 bars of D Dorian, followed by eight bars of E♭ Dorian and another eight of D Dorian … The use of the double bass to play the central theme". The bass carries the theme, not a pedal.
  - (e) Half-diminished "primary" scale is inconsistent: l7u23m4g1 (templatesL7.ts:585) marks "Locrian is the primary scale for half-diminished", while curriculumL7.ts (l7u23m3 concept 3) says "Locrian natural 2 (mode 6) is the standard half-diminished scale" and l7u22m1 concept 3 pairs Dm7b5 with Locrian ♮2.
  - (f) l7u21m4g1 (templatesL7.ts:213) answers "Explain why tritone substitution works" with a consequence ("creates a chromatic bass line"), not the reason (the shared tritone, which l7u21m4g4 gives).
- Scope: 6 strings
- Suggested fix: one-line rewordings for each.
- Status: verified

### C-78: curriculum/07-jazz-pop-modal.md (spec, not learner-facing) has theory errors and stale references  _(area: L7; working id L7-22)_
- Severity: S3
- Type: tech-debt
- Where and evidence (`<track>/L7/md_checks.mts`):
  - md:173: "Eb triad over C7 = C7#9b13". Eb G Bb over C = #9, 5, b7, so there is no b13 (.ts:416 correctly says C7(#9)).
  - md:192: "D/C … creates Cmaj9 sound". D F# A over C = 9, #11, 13, with no 3rd or maj7.
  - md:92: back-door "Ab resolve[s] to the … root of I". Ab→G is the 5th, which .ts:204 has right.
  - md:233: "Aeolian: lowered 6th and 7th (compared to major)". Degrees 3, 6 and 7 differ.
  - md:240: Dorian key chord "II". The triad on degree 2 is minor (ii), and the md's own example uses Em.
  - md:243: Mixolydian "avoid vii°". The degree-7 triad is major bVII; the diminished triad is on degree 3.
  - md:301: "i-bVI-bIII-bVII | Andalusian". The Andalusian cadence is i-bVII-bVI-V, as .ts:644 says.
  - md:399: "Bebop melodic minor: melodic minor + b3". It already has b3.
  - md:444: mystic chord "augmented fourth + two perfect fourths + two whole steps". The intervals are 6, 4, 6, 5, 5 semitones (A4, d4, A4, P4, P4).
  - md:83: "Dm7 is its [A7's] related ii". The related ii of A7 is Em7.
  - md:138, :266, :342 cite `progressionPatterns.ts` and `modes.ts`, which do not exist (`exists ... false`).
  - md:359: modes "covered in Level 2" (see L7-12).
- Scope: 13 spec lines
- Suggested fix: fix them, or mark the md as a historical spec that the .ts supersedes.
- Status: verified

### C-79: The triangle chord symbol typed with the macOS glyph (∆, U+2206) does not parse  _(area: L7; working id L7-23)_
- Severity: S3
- Type: bug
- Where: src/core/utils/chordParser.ts (quality token table). Taught at curriculumL7.ts (l7u21m1 concept 1): "maj7 (or triangle)".
- Evidence: `<track>/L7/symbols.mts` prints `NO-PARSE C∆7`, while `ok CΔ7 quality=major7` (Greek Δ U+0394) works. Every other taught spelling parses: C-7, Cø7, Co7, C°7, C+, C7(#9), Cmin7(b5), C6/9, C13#11. A planted wrong expectation is caught.
- Expected vs actual: the triangle the learner can actually type is rejected.
- Scope: 1 glyph
- Suggested fix: add U+2206 as an alias of Δ.
- Status: verified for the parser. That Option-J on a Mac produces U+2206 is inferred.

### C-80: Many L9 objectives and milestone claims have no exercise behind them  _(area: L9+engine; working id E-9)_
- Severity: S3
- Type: content-gap
- Where: curriculumL9.ts. Objectives not exercised: l9u30m3 "unison … tritone" (template intervals [1,2,3,4,5,7]); l9u30m5 "compound intervals (9ths, 10ths, 11ths)" (no stimulus >12 semitones) plus the u30 milestone "Recognize compound intervals"; l9u31m1 "Identify melodic minor" (choices are major/natural/harmonic only); l9u31m2 "each of the seven church modes" (only Dorian/Phrygian/Lydian/Mixolydian); l9u31m3 "diminished scales" (none); l9u31m4 "Recognize triad inversions" (none; see E-2 for accidental inversions); l9u31m5 "minor-major 7th" (none); l9u32m3 "Perform bass line dictation" (no bass-line item; progression items are answered by Roman-numeral choice).
- Evidence: dump_L9.txt scale/chord/interval inventories; `<T>/structural.out` counts (ear chord qualities: major, minor, diminished, augmented, major7, minor7, dominant7, half_diminished7, diminished7 only).
- Expected vs actual: Objectives and milestones promise skills that the exercises check. Here 8 objectives are never tested.
- Scope: 8 modules, 8 objectives, 1 milestone line.
- Suggested fix: add the missing choices (melodic_minor, aeolian/locrian/ionian, diminished_half_whole, minor_major7, compound intervals), or trim the objectives.
- Status: verified

### C-81: "The tritone is the most dissonant interval of all" is stated as fact  _(area: L9+engine; working id E-14)_
- Severity: S3
- Type: incorrect
- Where: curriculumL9.ts l9u30m3 C1 ("The tritone is the most dissonant interval of all"); exercisesL9.ts l9u32m2e2 hint ("…is the most dissonant interval").
- Evidence: Wikipedia, "Consonance and dissonance" (accessed 2026-10-30). Schulter groups "minor seconds, tritones, and major sevenths" together as "strongly discordant". Johannes de Garlandia's "perfect dissonance" is "semitone, tritone, major seventh". Haerle "places the minor ninth as the most dissonant interval of all" and moves the tritone "from most-dissonant position".
- Expected vs actual: Expected: "one of the most dissonant / the most unstable in tonal music". Actual: an unqualified superlative.
- Scope: 2 texts.
- Suggested fix: say "one of the sharpest dissonances (with the m2 and M7)".
- Status: verified

### C-82: The minor 6th song cue ("Love Story") sits in an ascending list but is the conventional descending example  _(area: L9+engine; working id E-15)_
- Severity: S3
- Type: incorrect
- Where: curriculumL9.ts l9u30m4 C0 ("Minor 6th = Love Story (Where Do I Begin). Major 6th = My Bonnie … Octave = Somewhere Over the Rainbow"; every other cue in the list is ascending).
- Evidence: the project's own curriculum/09-ear-training.md interval table gives m6 ascending = "The Entertainer", descending = "Love Story" theme. Wikipedia "Interval recognition" (accessed 2026-10-30) lists "Where Do I Begin?" in the same column as "Hey Jude" and "Mary Had a Little Lamb", which are descending examples in the md.
- Expected vs actual: the .ts drops the md's ascending cue and keeps the descending one without saying so.
- Scope: 1 concept.
- Suggested fix: "Minor 6th = The Entertainer (ascending); Love Story (descending)."
- Status: inferred (the Wikipedia column header did not render in the fetch; the md's direction is verified)

### C-83: `points: 2` is ignored by scoring  _(area: L9+engine; working id E-16)_
- Severity: S3
- Type: tech-debt
- Where: templates/authored `points` (e.g. templatesL9.ts l9u31m1–m5, l9u32m3–m4); the only consumer is exerciseGenerator.ts:339. ExerciseRunner.tsx:153 and useLearnProgress.ts:77,89 sum 1/0.5/0 per exercise.
- Evidence: `grep -rn -E "\.points\b" src` → only exerciseGenerator.ts:339 and a generator test. Counts from all_exercises.json: points=2 on L6 13, L7 52, L9 34 = 99 exercises.
- Expected vs actual: authors weighted harder items ×2. Every item counts 1.
- Scope: 99 exercises in L6–L9.
- Suggested fix: weight the score and threshold by `points`, or delete the field.
- Status: verified

### C-84: Build-exercise feedback names chords and scales with raw enum strings  _(area: L9+engine; working id E-17)_
- Severity: S3
- Type: ux
- Where: validateExercise.ts:180,201 chord/scale name built as `${root} ${quality.replace(/_/g,' ')}`.
- Evidence: `npx tsx <T>/feedback_names.mts` (output `<T>/feedback_names.out`): "The C major9 chord has 5 notes", "The Ab dominant7 chord…", "The C diminished7 chord…".
- Expected vs actual: "Cmaj9 / C major 9th", "Ab7".
- Scope: 28 chord_build and 39 scale_build items in L6–L9 (scales read acceptably).
- Suggested fix: use the chords.ts display name/symbol.
- Status: verified

### C-85: Small L9 text errors  _(area: L9+engine; working id E-18)_
- Severity: S3
- Type: incorrect
- Where/evidence:
  - curriculumL9.ts l9u30m5 C1: "the 9th in a Cmaj9 is the note D an octave above the root". D is a ninth (octave + M2) above C.
  - templatesL9.ts l9u32m4 tpl1 hint "{scaleType} scale has a distinctive sound pattern." renders "…numbers before selecting notes. natural minor scale has a distinctive sound pattern." (lower-case sentence start, content-free; seen in l9u32m4g1/g5).
  - templatesL9.ts l9u30m2 tpl0 prompt "Is the third major or minor?" is shown with 4 options from generateIntervalChoices (distractor pool for m3 = 1,2,4,5,6 semitones; `<T>/ear_exhaustive.out` "info" lines), so non-thirds such as Tritone appear.
  - curriculum/09-ear-training.md lines 60, 109, 163, 216, 312 say `earTrainingGenerator.ts` "already exists in core". `grep -rln earTrainingGenerator src curriculum` matches only .md files; no such source file exists.
- Scope: 4 items.
- Suggested fix: as described in each line.
- Status: verified

### C-86: "Learn about this" sends 12 chord qualities to lessons that never mention them  _(area: Explore; working id EX-14)_
- Severity: S3
- Type: ux
- Where: `src/data/qualityToModule.ts:20-26` (major6, minor6, 6/9, m6/9, add11 → `l7u21m1`), `:33-36` (aug7, maj7#5, dim(maj7), maj7b5 → `l3u9m1` "The Five Qualities") and `:40-42` (sus2, sus4, sus2/4 → `l7u21m1`)
- Evidence:
  - `EXP/index_links.mts` checks the target module's full text against a per-quality pattern, then I reviewed each hit by hand (`EXP/dump_module.mts`, output `EXP/modules_dump.txt`).
  - l7u21m1 covers chord symbols, extensions and alterations only. Sus chords, 6/9 and added tones are taught in `l7u23m5` ("Suspended and Added-Tone Chords", `curriculumL7.ts:871`).
  - Augmented-seventh types appear in `l6u19m3` (`curriculumL6.ts:357`), not in l3u9m1.
  - 26 raw hits were reduced to 12 real ones; for example "minor" → l2u7m3 was a pattern miss, and the extension and alteration links are covered in concept.
- Expected vs actual:
  - Expected: a link to the lesson that teaches the chord.
  - Actual: a lesson that never names it.
- Scope: 12 links
- Suggested fix: point sus, 6, 6/9 and add chords at `l7u23m5`, and aug7 / 7#5 at `l6u19m3`.
- Status: verified

### C-87: Lydian Augmented's #5 is labelled "Dominant" while an "Aug. 5th" string exists unused  _(area: Explore; working id EX-15)_
- Severity: S3
- Type: incorrect
- Where: `src/core/constants/scales.ts:131`. Index 4 returns `dominant` unless it is 6 semitones. `en.json` has `degreeShort.augFifth` = "Aug. 5th", and no code uses it.
- Evidence: `EXP/oracle.mts`: `lydian_augmented: #5 (8 semitones) labelled "Dominant"`
- Expected vs actual: "Aug. 5th" (expected) vs "Dominant" (actual).
- Scope: 1 scale type, every root
- Suggested fix: `case 4: return semitones === 6 ? tritone : semitones === 8 ? augFifth : dominant`.
- Status: verified

### C-88: 16 semitones is named "Minor 10th"; it is a major 10th  _(area: Explore; working id EX-16)_
- Severity: S3
- Type: incorrect
- Where: `src/core/constants/chords.ts:445` (`INTERVAL_LABELS[16]`) and `:472` (`INTERVAL_SHORT_LABELS[16] = 'm10'`)
- Evidence: `EXP/oracle.mts`: `INTERVAL_LABELS[16] = "Minor 10th" — expected one of Major 10th`. Derivation: 12 + 4 (major 3rd) = major 10th; the minor 10th is 15.
- Expected vs actual: "Major 10th" / "10" (expected) vs "Minor 10th" / "m10" (actual).
- Scope: 2 table entries. Nothing in the UI reaches them today, because no chord formula uses 16.
- Suggested fix: correct both entries.
- Status: verified (latent)

### C-89: The chord browser omits three qualities and lists two identical chords twice  _(area: Explore; working id EX-17)_
- Severity: S3
- Type: content-gap
- Where: `src/components/theory/ChordBrowser.tsx:7-56`
- Evidence: `EXP/misc.mts`:
  - `ChordBrowser omits qualities: dominant7sharp11, major9sharp11, dominant7flat13`. These appear in the chord-scale map and Cmd+K but can't be browsed.
  - `same-pitch-set qualities listed separately: augmented7 = dominant7sharp5; dominant9sus4 = dominant11`
- Expected vs actual: every quality browsable, and duplicates marked as equivalent (expected), vs 3 missing and 2 unmarked duplicates (actual).
- Scope: 3 + 2
- Suggested fix: add the three to 11ths and Alt. Dom, and add a "same as" note on the duplicates.
- Status: verified

### C-90: Unused reference tables contain wrong theory  _(area: Explore; working id EX-18)_
- Severity: S3
- Type: tech-debt
- Where:
  - `chordScaleRelationships.ts:428`: dim7 → half-dim7 "Add minor 7th". Half-diminished *raises* the existing diminished 7th; nothing is added.
  - `:378`: maj7 → maj6 "Avoid b7 in melody". A maj7 chord has no b7.
  - `intervals.ts:97-125`: `buildInterval` spells by pitch class.
  - Also unused: `MODE_SCALE_MAP`, `getRelatedModes`, `getChordsForScale` and `DIATONIC_SEVENTH_CHORD_QUALITIES`. The seventh-chord table is correct: the oracle gave 0 issues.
- Evidence:
  - `EXP/misc.mts`: `buildInterval C+3 -> D# | E+8 -> C | D+6 -> G#`. These are an augmented 2nd, a diminished 6th and an augmented 5th, where the names asked for are a minor 3rd, a minor 6th and a tritone.
  - Usage count with grep: `CHORD_SUBSTITUTIONS`, `getChordsForScale`, `MODE_SCALE_MAP`, `getRelatedModes` and `buildInterval` are each referenced only in their own file (non-test files = 1).
- Expected vs actual: either correct or deleted (expected) vs wrong text waiting to be wired up (actual).
- Scope: 3 wrong items in dead code
- Suggested fix: delete the dead tables, or fix the strings before using them.
- Status: verified

### C-91: Raw internal identifiers leak into user-facing text  _(area: Explore; working id EX-19)_
- Severity: S3
- Type: ux
- Where:
  - `src/utils/exportHelpers.ts:30, 38`: Copy summary prints `dc.chord.quality`, for example "B half_diminished7".
  - `ChordBuilderPanel.tsx:150`: `scale.type.replace('_',' ')` replaces only the first underscore, so the text reads "of C diminished whole_half" and "C pentatonic major" (the word order is reversed from the display name "Major Pentatonic").
- Evidence: code at those lines. `EXP/misc.mts` prints the summary lines `ii     D minor`. The code only has to call `SCALE_TYPE_NAMES` and `CHORD_QUALITY_NAMES`, which already exist.
- Expected vs actual: display names (expected) vs ids (actual).
- Scope: 2 surfaces
- Suggested fix: use `SCALE_TYPE_NAMES` and `CHORD_QUALITY_NAMES`.
- Status: verified

### C-92: The same minor 3rd is labelled "m3" or "b3" depending on how the chord was entered  _(area: Explore; working id EX-20)_
- Severity: S3
- Type: ux
- Where:
  - `chords.ts:455-479` uses "m3" alongside "b5 b6 b7".
  - `algorithmicChordBuilder.ts:766` uses "b3" for chords typed in a form the table doesn't cover.
  - Both feed the same "Formula" row (`CurrentChordPanel.tsx:89`).
- Evidence: `EXP/oracle.mts`: `labels using m-prefix style: minor:m3, diminished:m3, … (12 qualities)`.
- Expected vs actual: one notation, chord-formula style (1 b3 5 b7) (expected) vs mixed (actual).
- Scope: 12 qualities
- Suggested fix: "b3" in `INTERVAL_SHORT_LABELS[3]`; check that the drill and exercise paths use their own label tables first.
- Status: verified

### C-93: The search index subtitle differs from the curriculum by one space  _(area: Explore; working id EX-21)_
- Severity: S3
- Type: tech-debt
- Where: `src/data/moduleIndex.ts:89` (l3u9m4, "i(mΔ 7)") vs the curriculum ("i(mΔ7)")
- Evidence: `EXP/index_links.mts`: `curriculum modules: 118; index entries: 118; mismatches: 1`
- Expected vs actual: identical text (expected) vs a stray space (actual).
- Scope: 1
- Suggested fix: regenerate the index.
- Status: verified

## Improvements (each tied to something observed)

**Learn engine and L9 (parent):**
- **Root-position voicing helper for all ear audio** (C-ids of the E-2/E-3 items). Explore already uses `playChordVoiced`, so the ear trainer is the odd one out. One helper would fix both chords and progressions.
- **"Establish the key" pre-roll for every tonal ear item** (cadences, progressions, note naming): a I–IV–V–I or the tonic triad, then a short rest. This fixes E-4 and E-5 at once, and matches the lesson's own Step 1 ("listen for the key").
- **A melody ear mode** (3–5 notes after a tonic, answered with scale-degree numbers or solfège). It would make l9u32m1/m2 deliver what their titles promise (E-8), and reuse the existing `scale_degree_id` choice UI.
- **Hide the answer until the item is final** (E-1) and make hints formula-only, e.g. "R-3-5-7-9" rather than "C, E, G, B, D" (observed in L7 authored hints and most L9 authored hints). Then the 2-attempt design measures something.
- **"Is the third major or minor?"** (l9u30m2 template) should offer exactly the two thirds rather than 4 random neighbours.
- **Reset ear-audio state on exercise change** (E-19): a single `stopPlayback()` plus clearing the progression timeouts would also stop old chords bleeding into the next item.

**L6/L8 (fork, reviewed by parent):**
- Several Try-This buttons are unrelated to their concepts (stretto → "Bdim"; invertible counterpoint → "C/E"; chaconne → "Am" with an unsupported "common key" claim). Remove filler buttons rather than keep them.
- The K.545 task (l8u26m1t1) uses a famous exception (the recapitulation starts in the subdominant, per Wikipedia "Piano Sonata No. 16"). Flag it in the text.
- Once the template mis-mapping is fixed, l6u20m2, l8u27m5 and l6u20m4 will have only 3 on-topic items each. Computable item types would fit here (transposing-instrument arithmetic, figured-bass symbols, prime form).

**L7 (fork, reviewed by parent):**
- Make every quoted query in a task clickable, not only the first after "Type/Open/Search for". Today 28 of 144 L7 tokens are buttons.
- Route Cmd+K through the same normalisation as the Try-This executor (trailing "scale", "X major chord").
- l7u22m2 C1's Try-This opens C13 while the text is about C13#11. 'C13#11' parses and would show the described sound.
- Add a short note that both Cm7 and Cm(maj7) are standard minor-key tonic chords. The L7 lessons use both without comment.

**Explore (fork, reviewed by parent):**
- **Test that every `ScaleType` mounts:** render ChordGrid, ScaleDegreeBar and CircleOfFifths for all 37 types. This would have caught EX-1 in CI.
- **One source for scale facts:** make the spelled degree formula the single source, then derive the semitone formula, the per-degree labels (EX-9), the letter spelling (EX-8) and the diatonic chords (EX-2) from it. Today the three are separate hand tables that disagree with each other.
- **Check the chord-scale map automatically:** add a unit test that every primary or secondary suggestion contains all chord tones, with an explicit whitelist for idiomatic exceptions such as blues over a dominant 7th. This would stop the EX-3 and EX-7 class of error coming back.
- **Circle of Fifths for modes:** show "D Dorian → C major key signature". That is the single most useful modal fact, and the circle currently gets it wrong (EX-5).

## Unconfirmed suspicions
- **L9 (parent):**
  - "Feelings" as the descending perfect-5th cue (l9u30m4 C1). No source found; the project md uses "Flintstones".
  - "Take On Me (take-on)" as the M7 cue: I couldn't confirm which syllables form the M7.
  - "perfect pitch (which is largely innate)" (l9u30m1 C0) is likely overstated (early training and critical-period effects); not sourced.
  - The old progression's `setTimeout` chords sounding over the next item (part of E-19) is inferred from code, not measured.
- **L6/L8 (fork):**
  - The PT/ES overlays probably mirror the L6/L8 S1 errors (English only was checked).
  - The Forte vs Rahn prime-form disagreements list is from memory.
  - The md attributions (Petrushka pandiatonicism, Boulez irrational meters) were not checked.
  - The "shift mode" wording in l6u19m4g2 is probably loose phrasing rather than an error.
- **L7 (fork):**
  - The Levine *Jazz Theory Book* "UST appendix" citation could not be confirmed; the source found cites *The Jazz Piano Book*.
  - Possibly-defensible distractors: "vi-IV-I-V is a minor key progression" and "Dorian vamps use only one chord".
  - "Indian classical music is entirely built on a drone" is an overgeneralisation (unsourced).
  - The md's "Bon Jovi" modulation size was not verified.
- **Explore (fork):**
  - **Input aliases with cultural names:** `scaleParser.ts` accepts "gypsy minor", "gypsy major", "jewish", "hindu", "javanese" and "assyrian". They are input-only aliases; what the user sees is the neutral SCALE_TYPE_NAMES label. I did not source whether each alias is musicologically accurate (for example, the "javanese" → dorian b2 mapping versus actual slendro/pelog) or how "gypsy" is currently regarded. Not reported as findings.
  - **Hirajoshi variant:** `hirajoshi` = [0,2,3,7,8] is one of several published versions. Not verified against a primary source.
  - **Unknown-type fallback:** `getDiatonicChordsForScale` falls back to *major* triads for unknown types (`chords.ts:705-708`). It is unreachable today, because every ScaleType has an entry.
  - **Phrygian Dominant suggested for Phrygian:** the dead `MODE_SCALE_MAP` (`:518`) suggests Phrygian Dominant over Phrygian, where its major 3rd clashes with the mode's minor 3rd. Dead code, so not reported.
  - **Roots set from Cmd+K:** E#, Cb and Fb can be set as the key through Cmd+K ("E# major"). The circle then shows an F-position signature beside "E#", the same class of problem as EX-5. Inferred, not counted.

## Coverage

### Parent: L9, engine and structural checks
- **Dump:** `<T>/dump.mts` loads every L6–L9 exercise (authored + generated, EN) through the real generator: **392** total (L6 78, L7 120, L8 68, L9 126). Written to `dump_L6..9.txt` and `all_exercises.json`.
- **Structural and oracle checks on all 392** (`<T>/structural.mts`, output `structural.out`):
  - exactly one correct choice; no duplicate or empty labels; at least 2 choices
  - correct label verbatim in the prompt
  - chord_build: 28/28 pitch-class sets and noteCounts against an independent interval-table oracle
  - scale_build: 39/39, same oracle
  - ear chord/scale stimuli against the oracle, and ear chord correct label against quality
  - progression numerals playable and matching the oracle
  - Result: 0 issues except the voicing items (E-2). The `--plant` run catches 6/6 planted defects (`structural_plant.out`).
- **L9 audio, exhaustive over the full template parameter space plus every authored ear item** (`<T>/ear_exhaustive.mts`, output `ear_exhaustive.out`). It replicates ExerciseRunner + core playNote/playChord/playScale arithmetic as "actual" against a first-principles MIDI oracle.
  - Coverage: 51 note, 406 interval, 81 chord, 71 scale and 8 progression stimuli.
  - Intervals: interval played = interval asked in 406/406, including descending and octave wrap.
  - Scales: played sequence = oracle in 71/71.
  - Notes: correct octave in 51/51.
  - Chords: correct pitch classes, but inverted voicing in 53 cases (E-2).
  - Progressions: inverted voicings (E-3) and one ambiguous pair (E-4). Same-audio-supports-another-option was checked for every chord, scale, interval and progression set. Only the IV–I / I–V pair (E-4) is ambiguous at option level. Chord inversions change the sound (E-2) but never make another offered option correct.
  - The `--plant` run catches all 4 planted defects.
- **Grading/flow:**
  - `retry_reveal.mts`: 325/325 choice items reveal the answer on attempt 1.
  - vitest repro of the cross-exercise audio lock (`<T>/vitest/`), with a passing control case.
  - `feedback_names.mts`; `interval_staff.mts` over all 43 interval_id exercises in L1–L9, with a planted case.
- **L9 text:** curriculumL9.ts read in full via `<T>/curr_dump.mts 9` (`curr_L9.txt`): 15 modules, 45 concepts, 45 tasks, 3 milestones and all objectives.
  - Every L9 tryThisQuery and task query resolved through the core parsers (`l9_queries.mts`, 30 distinct queries, all resolve).
  - curriculum/09-ear-training.md read in full.
- **Cross-level template alignment** (`template_header_vs_title.py`, all 9 levels; positive control l6u20m2): L9 templates match their modules 14/14 (l9u32m5 has none, by design).
- **Web sources** (accessed 2026-10-30): Wikipedia "Interval (music)", "Consonance and dissonance", "Rondo", "Interval recognition".
- **Not checked:**
  - PT/ES overlays (English source only, per the brief).
  - How the stimuli actually sound: sampler or Karplus-Strong timbre and loudness balance. That needs ears; the MIDI numbers sent to the voice are verified.
  - The drill bank, and L1–L5 content beyond the two cross-level findings E-13 and E-20, which belong to other tracks.
  - In the browser: the shipped bundle was not compared with the local source.
- **Model note:** the parent and all three forks ran on Claude Opus 5.5 (forks inherit the parent model). There was no cross-family verification, so the S1s were re-checked by the parent against source rather than by an independent model.

### L6 + L8 (fork)
- curriculumL6.ts: all 12 modules read in full (36 concepts, 36 tasks, 3 milestones, objectives, unit text). There is no childDescription in L6.
- curriculumL8.ts: all 11 modules read in full (33 concepts, 33 tasks, 3 milestones). There is no childDescription in L8.
- Exercises: 78/78 L6 and 68/68 L8 (authored + generated, EN, from the parent's dumps) read item by item: prompt, every option, keyed answer, hint.
- Computable claims: theory_oracle.mts, an independent oracle with no app imports, checked 50+ claims, covering:
  - set theory: normal/prime form, ICV, Z-pairs (exhaustive over all 2–4-note set classes)
  - aug-6 spellings and the Gr+6 pivot targets for 4 keys
  - dim7 resolutions, CTo7 voice leading, chromatic-mediant common tones (exhaustive over the 12 minor triads)
  - invertible-counterpoint maps at the octave, 10th and 12th
  - transposing instruments, polymodality, Petrushka, metric modulation, cross-rhythm ratio, quartal stack

  Result: 11 mismatches, all reported above. The plant run (`--plant`, theory_oracle_plant.out) shows an altered prime-form claim is caught (12).
- Try-This: all 36 distinct L6/L8 tryThisQuery/task/milestone queries were routed through the replicated executor chain (trythis.mts). All resolve (no dead queries) and all but one match hand-written expectations. The planted bad expectation is flagged (trythis_plant.out).
- Template/module mapping checked for all 23 modules (module_topic_mismatch.py). The dangling-"this" detector was planted (27 vs 26).
- curriculum/06 and /08 md read in full.
- Not checked:
  - PT/ES overlays
  - L6/L8 rendering in the browser (e.g. how VexFlow shows Bbb/Cb in chord_build feedback)
  - whether the generated chord_build items for Cb roots render sensibly on the fretboard
  - the parent's structural checks (choice integrity, build oracles), which were not repeated per instructions
- Citations used: Wikipedia articles "Sprechgesang", "La Monte Young", "Fugue", "Chromatic mediant", "Piano Sonata No. 16 (Mozart)", all accessed 2026-10-30.

### L7 (fork)
- **Exercises:** 120/120 L7 exercises read (48 authored, 72 generated, EN). Choice integrity and the chord/scale oracle were done by the parent and not redone.
  - Every build exercise was checked for prompt/config wording against its quality or scale and for answer leaks: 52/52 (leak check verified against a planted case).
  - Every tritone-sub template root was checked: 7/7.
  - Duplicates: 1 within a module (l7u21m4g5 = l7u21m4e1, see L7-1). Others are cross-module repeats of basic chords, not reported.
- **Curriculum text:** curriculumL7.ts read in full: 16 modules, 64 objectives, 48 concepts, 48 tasks, 3 milestones. There are no childDescription fields in L7.
- **Try-This and typed tokens:** every tryThisQuery (51) and every quoted task token (144) was resolved through a copy of queryExecutor's logic (`queries.mts`) and through Cmd+K `getResults` (`taskreach.mts`), with planted dead queries caught.
- **Chord–scale claims:** 21 pairings checked with my own oracle (`derivations.mts` part A). All hold except "plain 7 in whole-tone / altered": those scales lack the natural 5th. I treated that as standard jazz pedagogy ("depending on context") and did not report it.
  - Mode-of relations, the altered = melodic-minor-a-half-step-above shortcut, and the step formulas all hold.
- **Other claims verified:** the jazz symbol spellings the lessons teach, the engine scale/chord counts, and the harmonic-minor mode coverage. Song and form claims checked against the web: rhythm changes (Wikipedia: Gershwin, 32-bar AABA, bridge III7-VI7-II7-V7 at 2 bars each), Giant Steps (keys B, G, Eb), So What.
- **curriculum/07 md:** read in full. Spec errors checked by script (`md_checks.mts`). Its melodic- and harmonic-minor step formulas were read and are correct.
- **Not checked:**
  - PT/ES overlays (English only, per the brief), though L7-1 almost certainly reproduces in them.
  - How Explore detail panels render these chords (e.g. whether C13#11, internal quality `dominant9sharp11`, shows a misleading name). That is the Explore part of this track.
  - The exact wording of every pop and jazz "emotional character" claim (taste, not fact).
  - Audio for L7: L7 has no ear-training items.

### Explore (fork)
- **Scale formulas:** 37 checked against the oracle's spelled formulas, 0 differences. Plant: Lydian with a natural 4 was caught.
- **Mode-of claims:** 13 checked, all correct. Plant: Phrygian Dominant as a melodic-minor mode was caught.
- **KeySelector groups:** 7 memberships checked, 1 wrong (EX-10).
- **Scale spelling:** 37 types × 21 roots (C D E F G A B, each natural, sharp or flat) = 5,334 notes. Only dim H-W, dim W-H (Cb, Fb) and chromatic are wrong. Double accidentals were counted per type over the 12 UI roots; most are correct spellings of theoretical keys such as Ab Phrygian.
- **Chord formulas:** 50 qualities, 0 differences. Plant: minor7 with a major 7th was caught. Chord spelling: 50 × 21 roots = 4,746 tones, 0 wrong letters or pitches; this uses the same comparator that flagged the 84 scale errors. Formula short labels: 50 qualities, 1 wrong (EX-4).
- **Interval tables:** `INTERVAL_LABELS` and `INTERVAL_SHORT_LABELS`, 0–22 semitones: 1 wrong entry in each (EX-16). Plant: [9] = "Minor 6th" was caught. `PITCH_CLASS_SPELLINGS`: 35 spellings, all correct. `intervals.ts` name and abbreviation maps: read, correct.
- **Diatonic chords:** 37 types × 12 UI roots (EX-1, EX-2). The seventh-chord table: 9 scales × 7 degrees, 0 issues. Relative major and minor: 15 keys each way, 0 issues.
- **Chord-scale map:** all 107 suggestions checked for chord-tone containment, and every context string read by hand (EX-3, EX-7). Plant: minor7 → Major as primary was caught.
- **Circle of Fifths:** key signatures for 7 modes × 12 roots; numerals for 9 seven-note scales; 6 distance labels, all correct (plant caught).
- **ScaleDegreeBar:** labels vs notes for 37 × 12; function names for every 7-note scale.
- **Chord Builder:** spelling for 1,296 combinations; identification for 600 chords (50 qualities × 12 roots), all correct (plant: C E G A expected with root A was flagged).
- **Search index and deep links:** moduleIndex 118 / 118 entries vs the curriculum; qualityToModule all 50 links.
- **Cmd+K:** sampled, 41 queries through the real `getResults` (`EXP/quicksearch.out`). No errors in labels or chord notes.
- **Crash probe:** all 37 scale types mounted through the real ChordGrid in jsdom.
- **Not checked:**
  - PT/ES text (out of scope).
  - Staff-notation rendering and audio playback.
  - Note spelling on the Piano and Fretboard (`spelling.ts`).
  - `guitarChordShapes.ts` and `guitarScalePositions.ts`.
  - The ranking of the Chord Builder's "Other interpretations".
  - Drill content.
  - The live site: I deliberately did not click the crashing scales in Nuno's browser, because the bad state persists and would trigger the crash loop there.
- **For the parent's L6, L7 and L8 tracks:**
  - The Try-This query "C diminished scale" at `curriculumL6.ts:428`, `:450` and `curriculumL8.ts:546` triggers EX-1.
  - `l7u23m5` says "All 42 chord types" (`curriculumL7.ts:853`) and "The engine covers 42 chord types" (`:878`), but the engine has 50 qualities.
