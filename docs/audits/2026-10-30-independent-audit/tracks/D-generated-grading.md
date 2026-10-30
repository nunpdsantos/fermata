<!-- Saved by main session from the agent's SubagentHandback (agent Write was blocked by harness) -->
## Track D audit result

`findings.md` was not written. The harness refused it ("Subagents should return findings as text, not write report files"), so the full findings are below. Every script and output referenced is in `$D` = `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/D-generated-grading/`. The repo was not modified.

**Summary:** 24 findings: S1 4, S2 10, S3 10. All verified (four carry an inferred part). Every check was exhaustive, the oracle was proven against textbook facts, and every verifier caught its planted defects.

**Top 5:**
1. **D-3 (S1):** 12 of 43 Learn interval exercises draw an interval whose letters contradict the accepted answer. For example, the staff shows F–G♯ and only "Minor 3rd" is graded right. The prompt for `l2u7m1e2` says E♭ but the staff draws D♯.
2. **D-4 (S1):** Missing the last question in a short queue puts the same item straight back. Spelling and naming inputs then stay locked, and only ✕ (End session) escapes. Shown with a real `DrillView` render test plus a passing control.
3. **D-1 (S1):** "A perfect fifth UP from F♯" is graded as D♭, and "DOWN from D♭" as F♯. The correct C♯ and G♭ are not among the choices.
4. **D-2 (S1):** For all 10 "Is X diatonic? → No" items, the explanation says X *is* the diatonic chord, in EN, PT and ES.
5. **D-5 (S2):** "By heart" takes the last answer per session, so an item missed on the first try in all 3 sessions still reaches "by heart". It can also be reached within 10 minutes (D-17).

**What was checked:**
- **Drill bank:** all 1,315 items.
- **Learn exercises:** all 870, in 3 languages (2,610 instances).
- **Chord parser:** 4,944 inputs.
- **Reverse chord naming:** 745 inputs.
- **Scale parser:** 665 inputs.
- **Existing tests:** the drill, parser and exercise test files pass (2,073 tests, exit 0), and none catch D-1 to D-4.

**Models:** all of this was run by me (Opus 5.5); nothing was delegated.

---

# FINDINGS (findings.md content)

All scripts run as `cd /Users/nunosantos/Documents/Base/Music/new_music_app && npx tsx $D/<script>`. The render tests run with `npx vitest run --config $D/vt/vitest.audit.config.mts`.

The oracle is `$D/oracle.ts`. It imports nothing from the app and works from letters (pitch classes 0 2 4 5 7 9 11) plus intervals as (letter distance, semitone distance). `$D/oracle-selftest.ts` checks it against 27 textbook facts: all pass, exit 0. The `--plant` modes caught every injected defect (see the `*.plant.out` files).

## Findings

### D-1: Circle of fifths: "a P5 UP from F♯" is graded D♭, "DOWN from D♭" is graded F♯
- **Severity:** S1
- **Type:** incorrect
- **Where:** `src/core/utils/drillBank/genCircle.ts:21` (the `CIRCLE_DISPLAY` table), used at `:86-87`. Items `circle:fifth-up:F#` and `circle:fifth-down:Db`.
- **Evidence:** `$D/verify-drill.ts` → `$D/verify-drill.out`:
  - `app="D♭" oracle="C♯"`
  - `app="F♯" oracle="G♭"`
  - The choices are `["B","D♭","E","A♭"]`, so C♯ is not offered.
- **Derivation:** A P5 spans 5 letters and 7 semitones. F♯ up 4 letters is C, and pitch class 6+7=1, so the note is C♯. F♯→D♭ is a diminished 6th.
- **Expected vs actual:** C♯ and G♭ expected; the app gives D♭ and F♯.
- **Scope:** 2 items × 3 languages.
- **Suggested fix:** Spell the answer with `noteAtIntervalAbove(note, 5, 7)`.
- **Status:** verified

### D-2: The "Is X diatonic? → No" explanation asserts that X *is* the diatonic chord
- **Severity:** S1
- **Type:** incorrect
- **Where:** `src/core/utils/drillBank/genRoman.ts:306-307` (`drill.why.diatonicMember` is reused with `chord: noChord`).
- **Evidence:** `$D/rendered-en.txt` (and the PT/ES renders):
  - `Q: Is D major diatonic in C major?`
  - `ANSWER: No`
  - `WHY: D major is the diatonic chord built on that degree of C major.`
- **Expected vs actual:** The explanation should say why the chord is not diatonic. Instead it states the false fact.
- **Scope:** 10 items × 3 languages.
- **Suggested fix:** Add a "not diatonic; degree n is Y" explanation.
- **Status:** verified

### D-3: Learn interval staff contradicts the accepted answer
- **Severity:** S1
- **Type:** incorrect
- **Where:** `src/components/learn/exercises/ExercisePrompt.tsx:42-63`. The upper note is spelled from a fixed sharp table; grading uses semitone labels only.
- **Evidence:** `$D/interval-staff.mts` → `$D/interval-staff.out`: 12 of 43 exercises. Examples:
  - `gen:l1u3m3g4 F–G# (Augmented 2nd) accepted "Minor 3rd"`, with the prompt "Count both letter names and semitones".
  - `auth:l2u7m1e2` prompt "from C up to Eb", staff shows C–D♯.
  - `auth:l2u7m2e2` prompt "C up to Db", staff shows C–C♯.
- **Expected vs actual:** The staff should spell by letter distance (F–A♭). Instead it shows F–G♯ and grades "Minor 3rd".
- **Scope:** 12 exercises (9 generated, 3 authored), across L1, L2 and L4.
- **Suggested fix:** Spell the target by interval number, reusing `drillBank/intervalEngine.ts`.
- **Status:** verified

### D-4: Drill input locks when the same item is requeued adjacently
- **Severity:** S1
- **Type:** bug
- **Where:**
  - `src/services/drillSession.ts:166`: `pos = min(index+offset, queue.length)`, so a miss on the last item is re-inserted at index+1.
  - `src/views/DrillView.tsx:169`: `key={item.id}`, so there is no remount.
  - `NoteChips`, `AccidentalSlots` and `RootQualityChips` lock on commit and only reset on remount.
- **Evidence:**
  - `$D/store-sim.mts` (real store, new learner, Triads only): `ADJACENT DUPLICATE: index 8 … complete=false; input format=rootQuality`.
  - `$D/vt/src/__tests__/stuck.test.tsx` renders the real `DrillView`: `after retry taps: asked 8 (was 8)`. The control with a different next item passes (`$D/stuck-test.out`).
- **Expected vs actual:** The repeated question should accept an answer. Instead every tap is ignored and only ✕ escapes.
- **Scope:** 306 non-choice items, whenever the queue is shorter than the session length (typical for a new learner's first sessions and on light review days).
- **Suggested fix:** Never requeue at index+1. Also, or instead, key the input by `${id}:${asked}`.
- **Status:** verified

### D-5: "By heart" uses the last answer of each session
- **Severity:** S2
- **Type:** bug
- **Where:** `src/services/drillScheduler.ts:126` and `:139-145`.
- **Evidence:** `$D/sched-probe.out` Scenario A: the item is wrong on the first try in all 3 sessions and right on the requeue, which gives `-> byHeart`. The control gives `review`.
- **Expected vs actual:** An item never answered correctly first time should not be "by heart"; it is.
- **Scope:** All items, and therefore the mastery map, the session summary and sprint eligibility.
- **Suggested fix:** Use the first answer per session.
- **Status:** verified

### D-6: Minor "pattern" items teach v and VII, and add "the pattern never changes"
- **Severity:** S2
- **Type:** incorrect / ambiguous
- **Where:** `genRoman.ts:41`, items `roman:pattern:minor:5` and `roman:pattern:minor:7`.
- **Evidence:** "In any minor key, the triad on degree 5 is…?" Answer: minor (v). The choices include major (V). The app's own `roman:harmonic-fact:5` item teaches major (V) for minor with the raised 7th.
- **Derivation:** E–G–B is minor; E–G♯–B is major. Likewise G–B–D versus G♯–B–D.
- **Expected vs actual:** The prompt should say "natural minor"; as written the bank contradicts itself.
- **Scope:** 2 items.
- **Suggested fix:** Change the prompt to "natural minor" and drop "never changes".
- **Status:** verified (the contradiction); inferred (the learner impact)

### D-7: Wrong-answer feedback prints raw strings
- **Severity:** S2
- **Type:** bug
- **Where:** `src/views/DrillView.tsx:214-225` (`canonicalAnswer`).
- **Evidence:** `$D/rtl-tests.out`:
  - `"Not quite — C# half_diminished7"`
  - `"…the correct spelling here is C# E# G##"`
- **Expected vs actual:** Unicode spelling and quality names expected; an enum key and ASCII are shown.
- **Scope:** 306 items.
- **Suggested fix:** Format with `displayNote` and `CHORD_QUALITY_NAMES`.
- **Status:** verified

### D-8: Chord-spelling chips lack the quality-defining wrong note
- **Severity:** S2
- **Type:** content-gap
- **Where:** `genTriad.ts:139-166` and `genSeventh.ts:146-177` (root variants fill the first distractor slots).
- **Evidence:** `$D/chip-coverage.out`:
  - `triad:3rd untested 52/56`
  - `seventh:3rd untested 42/70`
  - the half-step 7th trap is missing in 70/70
- **Expected vs actual:** Spelling a chord should require choosing the 3rd's and 7th's accidentals; most items reduce to picking letters.
- **Scope:** 126 items.
- **Suggested fix:** Seed the 3rd ±1 and 7th ±1 first.
- **Status:** verified (data); inferred (effect)

### D-9: The classical labels MM7, Mm7 and mm7 all parse as minor-major 7th
- **Severity:** S2
- **Type:** incorrect
- **Where:** `src/core/utils/chordParser.ts:188`.
- **Evidence:** `$D/parser-matrix.out`: 77 failures per label, e.g. `CMm7 → C minor_major7 [C Eb G B]`. `$D/parser-debug.out`: `GMm7 → [G Bb D F#]`.
- **Source:** Open Music Theory 2e §1.17: "major-major … major-minor … minor-minor seventh chord…" and "The major-minor seventh chord is also often called the dominant seventh chord." https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)/01%3A_Fundamentals/1.17%3A_Seventh_Chords (accessed 2026-10-30).
- **Expected vs actual:** Mm7 is the dominant 7th, MM7 the major 7th, mm7 the minor 7th; all three return minor-major 7th, with different pitches.
- **Scope:** 231 inputs.
- **Suggested fix:** Handle the three labels case-sensitively before lower-casing.
- **Status:** verified

### D-10: New facts are introduced one family at a time
- **Severity:** S2
- **Type:** ux
- **Where:** `src/services/drillSession.ts:111` and `FAMILY_BASE`.
- **Evidence:** `$D/coverage-gaps.out`, defaults: first triad at about session 81, Roman numerals at about 203, harmonic function at about 317.
- **Expected vs actual:** Topics should be mixed; most of the bank is effectively unreachable with defaults.
- **Suggested fix:** Pick new items round-robin across the enabled families.
- **Status:** verified

### D-11: Progress shows "x of 24" in a session that ends after 8
- **Severity:** S3
- **Type:** ux
- **Where:** `useDrillRunner.ts:276`.
- **Evidence:** `$D/sched-probe.out` Scenario C.
- **Suggested fix:** Use `min(length, queue.length)`.
- **Status:** verified

### D-12: A wrong tap on a choice item is never marked red
- **Severity:** S3
- **Type:** bug
- **Where:** `DrillInput.tsx:33` (`selected={null}`).
- **Evidence:** `$D/rtl-tests.out`: no red class on the tapped chip, while the green-control test passes.
- **Scope:** About 1,000 items.
- **Suggested fix:** Track the tapped choice and pass it through.
- **Status:** verified

### D-13: Learn prompts promise what the input and grader cannot do
- **Severity:** S2
- **Type:** incorrect / ux
- **Where:**
  - `templatesL2.ts:314` (l2u7m2): "may be augmented, diminished, or compound", but `intervals [1,3,4,6,8,10,11]` and the labels from `INTERVAL_LABELS` cannot produce those answers.
  - l2u4m1 says "using the correct sharps or flats", but the grader only sees pitch classes.
- **Evidence:** `$D/learn-prompts.out`, `$D/learn-templates-scan.out`.
- **Suggested fix:** Reword the prompts, or extend the interval engine to spelled intervals.
- **Status:** verified

### D-14: F major explanation: "The second-to-last flat names the key. F major: B♭."
- **Severity:** S2
- **Type:** incorrect
- **Where:** `genKeysig.ts:163`.
- **Evidence:** `$D/rendered-*.txt`. F major has only one flat, so the rule does not apply.
- **Scope:** 1 item × 3 languages.
- **Suggested fix:** Use a dedicated explanation for one-flat keys.
- **Status:** verified

### D-15: "V → I" is graded as *Perfect* authentic cadence with no voicing given
- **Severity:** S2
- **Type:** incorrect
- **Where:** `genFunction.ts:57`.
- **Source:** Puget Sound mt21c §13.1: a PAC requires "V–I; both chords in root position; tonic scale degree in the highest voice… If at least one of these requirements is not met… Imperfect Authentic Cadence." https://musictheory.pugetsound.edu/mt21c/PerfectAuthenticCadence.html (accessed 2026-10-30).
- **Expected vs actual:** "Authentic cadence" expected; the item teaches V–I = PAC.
- **Scope:** 1 item.
- **Suggested fix:** Relabel the answer, or specify root position and 1̂ on top in the prompt.
- **Status:** verified

### D-16: Near-miss feedback only fires on chord-spelling chips
- **Severity:** S3
- **Type:** ux / tech-debt
- **Where:** `grading.ts:74-118`.
- **Evidence:** `$D/grading-probe.out`:
  - 96 note-above items have enharmonic distractors but get no near-miss (picking D𝄪 for E gives `nearMiss:false`).
  - The accidental-slots and root-quality near-miss branches are unreachable (0 of all variants).
- **Suggested fix:** Compare pitch classes for note-valued choice items.
- **Status:** verified

### D-17: "By heart" can be reached within 10 minutes
- **Severity:** S3
- **Type:** improvement (the spec is met literally)
- **Where:** `computeTier` has no spacing requirement, and the "confidence" bucket re-presents items that are not yet due.
- **Evidence:** `$D/sched-probe.out` Scenario B: `due? false; included? true … s3 (+10 min) -> byHeart`.
- **Suggested fix:** Require at least 2 calendar days across the 3 sessions.
- **Status:** verified

### D-18: A stale queue head on resume repeats the next item
- **Severity:** S3
- **Type:** bug
- **Where:** `useDrillRunner.ts:87` versus the store index.
- **Evidence:** `$D/store-sim.out`: `first shown degree:num-to-name:1; … next shown degree:num-to-name:1`. Non-choice items would hit the D-4 lock.
- **Scope:** Only after a release changes item ids mid-session.
- **Status:** verified

### D-19: One malformed item record wipes all drill progress
- **Severity:** S3
- **Type:** bug (robustness)
- **Where:** `drillStore.ts:96-99` and `:126`.
- **Evidence:** `$D/persist-probe.out`:
  - good: `items 3, answered 120, sprintBests {"degree":9}`
  - bad: `items 0, answered 0, sprintBests {}`
- **Suggested fix:** Drop only the invalid entries.
- **Status:** verified

### D-20: Unicode double-accidental roots break in the algorithmic parse path
- **Severity:** S3
- **Type:** bug
- **Where:** `chordParser.ts:493` (the root regex takes one accidental) and `:297` (`mi` is not in the explicit minor list).
- **Evidence:** `$D/parser-debug.out`:
  - `"C𝄪mi" → C major`
  - `"Cbbmi" → [Cbb Eb Gbb]`, which is not a minor triad
  - 18 failures in the matrix
- **Status:** verified

### D-21: Notes → name ignores spelling for symmetric chords
- **Severity:** S3
- **Type:** improvement
- **Where:** `reverseChordParser.ts:162-176`.
- **Evidence:** `$D/reverse-matrix.out`: 0 wrong pitch sets out of 745, but 94 names are respelled, e.g. written `E G# C` is named E augmented `[E G# B#]`.
- **Suggested fix:** Break ties in favour of a spelling match.
- **Status:** verified

### D-22: Drill text polish
- **Severity:** S3
- **Type:** ux
- **Evidence:** `$D/rendered-*.txt` and `$D/verify-drill.out`:
  - "1 semitones"
  - "a Octave"
  - `scaleKeySig` lists the whole scale in ASCII as "its key signature"
  - ES `drill.feedback.wrong` = "Casi" ("almost") for a plain wrong answer
  - PT/ES show English "Yes"/"No" and function and cadence labels (beyond the "nomenclature untranslated" convention in CLAUDE.md)
  - 66 choice items have only 3 options
- **Status:** verified

### D-23: G♯, D♯ and A♯ harmonic and melodic minor are missing from scale spelling
- **Severity:** S3
- **Type:** content-gap
- **Where:** `genScale.ts:58` and `:107`. The slots cycle only ♮/♯/♭.
- **Evidence:** `$D/coverage-gaps.out`: 6 items missing.
- **Suggested fix:** Add 𝄪/𝄫 to the slot cycle.
- **Status:** verified

### D-24: Learn black-key naming: the answer is the only accidental among the choices
- **Severity:** S3
- **Type:** ux
- **Where:** `exerciseHelpers.ts:27-55`.
- **Evidence:** `$D/verify-learn.out`, e.g. `l1u1m4g1: C D Db D#` with the prompt "Use its flat name".
- **Scope:** 5 verified (flats). The sharp variants follow from the same algorithm (inferred).
- **Status:** verified / inferred

## Improvements (each tied to something observed)

1. **Format-aware latency thresholds.** `SLOW_MS` (6 s) and `BY_HEART_MS` (3 s) are global. Multi-tap items (7 slots + Done) will likely always grade "hard" and rarely, if ever, reach "by heart" (inferred).
2. **First answer per session plus spacing** for tiers (D-5, D-17).
3. **Round-robin introduction of new facts** across families (D-10).
4. **Reuse the Drill interval engine for Learn intervals** (D-3, D-13).
5. **One answer formatter** for chips, feedback and explanations (D-7).
6. **Confusion-first chip builder** (D-8).
7. **A queue-invariant test after every `recordAnswer`** (D-4). The comment at `drillSession.ts:30-32` ("cannot create an adjacent duplicate in practice") is falsified by `$D/store-sim.out`.
8. **Truth tests for explanations, not just token tests** (D-2, D-6, D-14).

## Unconfirmed suspicions

- **Sprint timer:** it is a 1 Hz `setInterval` counter, so background throttling or a phone lock probably stretches "60 s". Not measured.
- **Same-day FSRS reviews:** in-session requeues and early "confidence" reviews feed FSRS same-day; the effect on stability was not quantified.
- **Ear-training pitch for exotic roots:** the maths in `ExerciseRunner.tsx` ignores `##`/`bb` and the B♯/C♭ octave wrap. The plant shows the wrong interval size would play, but no current template uses such roots (0 real hits).
- **vi = Tonic:** this is a convention choice, not reported.

## Coverage

- **Drill bank, exhaustive (1,315/1,315).** For every item:
  - oracle answer;
  - answer is among the choices;
  - no distractor is also correct;
  - every interval label is one that exists;
  - choices and chips are unique;
  - chip completeness;
  - every answer can be entered with the slots;
  - exhaustive alternative-reading search for name-the-chord items;
  - id and prompt uniqueness.
  - Plants: 8 of 8 caught.
- **All items rendered in EN, PT and ES:** 0 unset tokens (the detector was proven on a planted string). Explanations were read by category.
- **Grading:** probed with unicode, ASCII, order, enharmonic, case, whitespace and ♭♭ payloads, plus near-miss reachability per format. The lowercase and whitespace near-miss cases cannot be reached by tapping, so they are not reported.
- **Scheduler, session and store:** driven end to end. RTL tests use real `DrillView` renders with controls.
- **Learn exercises:** 2,610 instances across EN, PT and ES.
  - Graders accept the oracle answer and reject wrong ones.
  - Build-exercise note counts match.
  - Degree ids are correct.
  - Multiple-choice and ear-training items have exactly one correct, unique label.
  - Progressions can be played.
  - Ear-interval playback sounds the right size.
  - Correct-option position after the shuffle is [125,125,127,140] over 517 items (roughly uniform); as authored, the correct option is first in 516/517.
  - Plants: 5 of 5 caught.
- **Chord parser:** 4,944 inputs; failures only D-9 and D-20.
- **Reverse naming:** 745 inputs, 0 wrong.
- **Scale parser:** 665 inputs, 0 failures.
- **Existing tests:** 30 files, 2,073 passed, exit 0.
- **Not checked:**
  - musical content of the 275 authored multiple-choice exercises (structure only);
  - perceived audio;
  - guitar voicings and 11th/13th voicing choices;
  - Learn spaced repetition;
  - the live bundle (all checks ran on local source).