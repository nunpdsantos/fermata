<!-- Saved by main session from the agent's SubagentHandback (agent Write was blocked by harness) -->
## Track B summary: L1–L5 curriculum (English)

**`findings.md` was not written.** The harness refuses report files from subagents, so the full report follows below this summary. Scripts and their outputs are in `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/B-learn-L1-L5/` (called `$B` from here on). Every check script fails on a planted bad case before it runs.

**Counts:** 35 findings — 8 S1, 21 S2, 6 S3. B-34 bundles about 10 small prose errors.

**Top 5:**
1. **B-5:** in 11 modules (L3–L4), the generated exercises test a different, mostly later topic. Example: Root Position Part Writing is quizzed on cadences. These items are 43–67% of each module's pass gate, so the learner cannot reach 80% on the module's own content. 43 items.
2. **B-1:** the interval staff spells every upper note with a sharp, so the drawn interval contradicts the answer key. "C up to Eb" is drawn as C→D# and keyed "Minor 3rd". Scope: 3 of 14 authored, 9 of 29 generated, 67 of 302 possible configs.
3. **B-4:** generated scale-degree questions never show which note to identify (3 items, unanswerable). **B-3:** ledger-line exercises draw notes with no ledger line, or in bass clef while the prompt says treble (4 items).
4. **B-10:** a first wrong answer turns the correct option green and spells it out, then "Try again" pays 0.5. This affects all 369 choice items.
5. **Wrong theory a learner would absorb:**
   - VI in a minor key is said to share "only one tone" with i; it shares two (B-6).
   - A 7-6 suspension over V is keyed "4-3" (B-7).
   - The guide-tone hint swaps the notes (B-8).
   - The tritone in V7 and V7/V is said to resolve "outward" in 5 places; as spelled it contracts inward (B-9).
   - The tenor sax is said to sound a major 2nd lower; it sounds a major 9th lower (B-17).

**Clean results (checks proven able to fail):**
- Grading for all 263 scale/chord build items matches my independent oracle.
- 0 multiple-choice items with other than exactly one correct option.
- Key-signature, relative-key and note-list claims in the prose: no errors.

**Improvement:** add these checks to `npm run audit:all`. CLAUDE.md reports the content audits as clean ("exercises 0, generated 0"), and none of B-1, B-3, B-4 or B-5 is caught today.

---

# FULL FINDINGS (intended content of findings.md)

Run any script with: `cd /Users/nunosantos/Documents/Base/Music/new_music_app && npx tsx $B/<script>.mts`
Outputs are in `$B/out_*.txt`. The full content dump I read is `$B/dump_L1–5.txt`.
The oracle (`$B/oracle.mts`) is my own first-principles theory code and imports nothing from the app.
"Generated" means what the app's seeded `generateExercises` produces. "Template space" means every configuration a template could produce (`$B/collect.mts`).

## Findings

### B-1: The interval staff spells every upper note with a sharp, so the drawn interval contradicts the answer key
- Severity S1. Type: bug / incorrect.
- **Where:**
  - `src/components/learn/exercises/ExercisePrompt.tsx:49-62` uses a sharps-only lookup table.
  - The answer key is semitone-only: `validateExercise.ts:159-174` and `INTERVAL_LABELS` at `chords.ts:428-444`.
- **Evidence:** `$B/check_intervals.mts` → `out_intervals.txt`. Self-test: known-good C+4 passes; planted C+3 (drawn D#) is caught.
  - Authored `l2u7m1e2`: "C up to **Eb**" is drawn C4→D#4 (an augmented 2nd) and keyed "Minor 3rd".
  - Authored `l2u7m2e2`: "C up to **Db**" is drawn C→C# (an augmented unison) and keyed "Minor 2nd".
  - Generated `l1u3m3g4/g5` and `l2u7m1g6` are drawn F→G# and G→A#, keyed "Minor 3rd". The `l1u3m3` prompt says "Count both letter names", which gives a 2nd.
  - Also affected: `l1u1m3g1/g5`, `l2u7m1g3`, `l2u7m2g1/g5` (A→A#, F→F#, D→D# keyed "Minor 2nd") and `l4u14m1g6`.
  - Template space: 67 of 302 configs, for example C→G# keyed "Minor 6th" and C down to A#3 keyed "Major 2nd". The `l2u7m2` module is *about* augmented intervals, yet it draws augmented intervals and keys them minor.
- **Scope:** 3 of 14 authored, 9 of 29 generated, 67 of 302 configs.
- **Fix:** spell the target note from the interval number plus semitones. Store `intervalNumber` in the config.
- Status: verified.

### B-2: `l1u1m3e1` "C to C#" is keyed "Minor 2nd"; C→C# is an augmented unison
- Severity S1. Type: incorrect answer key.
- **Where:** `exercisesL1.ts:176`.
- **Evidence:** `out_intervals.txt`, section "prompts that name both notes" (`… WRONG for named notes`). Derivation: C and C# share a letter, so the interval is a unison plus one semitone, an augmented unison. A minor 2nd is C→Db.
- **Fix:** change the prompt to "C to Db".
- Status: verified.

### B-3: Ledger-line exercises draw notes with no ledger line, or in bass clef while the prompt says treble
- Severity S1. Type: bug.
- **Where:**
  - The clef rule at `ExercisePrompt.tsx:68` (`octave < 4 → bass`).
  - `exercisesL1.ts:74` (`l1u1m2e1`).
  - `templatesL1.ts:55-69`.
- **Evidence:** `$B/check_staff.mts` → `out_staff.txt`.
  - `l1u1m2e1` says "second ledger line below [treble]". The app draws A3 in bass clef, on the top line, with 0 ledger lines.
  - `l1u1m2g3` (B4, the middle line) is described as "on a ledger line below the treble staff".
  - `l1u1m2g4` (G5) is described as "requires ledger lines"; it needs none.
  - `l1u1m2g1` is A3 in bass clef.
- **Scope:** 1 of 7 authored, 3 of 14 generated, 17 of 26 module configs.
- **Fix:** add an explicit `clef` field to the config, and restrict the template to real ledger notes.
- Status: verified.

### B-4: Generated scale-degree questions never show the note to identify
- Severity S1. Type: bug (unanswerable).
- **Where:** `templatesL2.ts:67`, prompt "…what degree number is the given note?". For this exercise type, `ExercisePrompt.tsx:33-66` draws no staff and shows no highlight.
- **Evidence:** `$B/check_degree.mts` → `out_degree.txt`. `l2u4m2g1/g4/g6` are flagged "NOTE NOT SHOWN"; all 35 possible configs are affected. The answer keys themselves are correct (0 errors in 68).
- **Fix:** "…what degree number is the note {note}?", mirrored in PT/ES.
- Status: verified.

### B-5: Generated exercises in 11 modules test another topic, and the pass gate is unreachable with the module's own content
- Severity S1. Type: bug (assessment/order).
- **Where:**
  - `templatesL3.ts:245, 292, 337, 372, 407, 448, 483/520`.
  - `templatesL4.ts:256, 297, 332, 367/398`.
- **Evidence:** `$B/check_template_topics.mts` → `out_template_topics.txt`, plus `$B/check_order.mts` → `out_order.txt`.

| Module | Generated items ask about | Taught in | Generated / total | Pass needs |
|---|---|---|---|---|
| l3u10m3 Root Position Part Writing | cadences | l3u11m1 | 5/8 | 6.4 |
| l3u10m4 Triads in Inversion | periods, sentences | l3u11m2 | 4/7 | 5.6 |
| l3u11m1 Cadences | passing tones | l3u11m4 | 3/7 | 5.6 |
| l3u11m2 Phrases and Periods | neighbor / escape tones | l3u11m4, l4u12m2 | 3/6 | 4.8 |
| l3u11m3 Harmonic Rhythm | suspensions | l4u12m1 | 4/7 | 5.6 |
| l3u11m4 NCTs part 1 | pedal points (2 items) | l4u12m3 | 3/6 | 4.8 |
| l3u11m5 Transposition | NCT classification and intervals | — | 6/9 | 7.2 |
| l4u13m2 Mediant/Submediant/Tonic 7ths | function classification | l4u13m4 | 4/7 | 5.6 |
| l4u13m3 Leading-tone 7ths | harmonic rhythm | — | 3/6 | 4.8 |
| l4u13m4 Harmonic Function | sequences | l4u13m5 | 3/6 | 4.8 |
| l4u13m5 Harmonic Sequences | "50s progression", plain triads | — | 6/9 | 7.2 |

- In every row, the module's own authored items are worth 3–4 points, below the threshold (`ExerciseRunner.tsx:188`).
- **Scope:** 11 modules, 43 items.
- **Fix:** move the template sets back to the modules they describe (most look shifted 1–4 modules), and mirror in PT/ES.
- Status: verified.

### B-6: "VI shares only one tone with i"; it shares two
- Severity S1. Type: incorrect.
- **Where:** `curriculumL3.ts:505` (l3u11m1, the half/plagal/deceptive cadence concept).
- **Evidence:** `out_derivations.txt`: in A minor, VI = F-A-C and i = A-C-E share A and C (2 tones).
- **Fix:** rewrite the sentence around the 5→♭6 bass motion and VI being major.
- Status: verified.

### B-7: `l4u12m1e3` keys a 7-6 suspension over V as "4-3"
- Severity S1. Type: incorrect key and hint.
- **Where:** `exercisesL4.ts:47`.
- **Evidence:** `out_derivations.txt`:
  - G up to F is a minor 7th; G up to E is a major 6th.
  - E is not in V (G-B-D).
  - A real 4-3 over V is C→B.
  - The hint claims "a 4th above the bass G … E (the 3rd)".
- **Fix:** use C held over V, resolving to B.
- Status: verified.

### B-8: The `l5u17m4e2` hint swaps the guide tones
- Severity S1. Type: incorrect hint.
- **Where:** `exercisesL5.ts:707`.
- **Evidence:** `out_derivations.txt`.
  - The hint says "C holds … becoming the 7th of G7", but G7 (G-B-D-F) does not contain C.
  - The hint says "F drops to B", but F to B is a diminished 5th, not a step.
  - Correct: F holds; C moves down to B.
  - The module's own task states it correctly.
- Status: verified.

### B-9: The tritone is said to resolve "outward"; as spelled, it contracts inward
- Severity S2. Type: incorrect.
- **Where:** `curriculumL3.ts:148` and `:171` (task "B-F opens outward to C-E"); `curriculumL5.ts:29`, `:36`, `:51`.
- **Evidence:** `out_derivations.txt`.
  - B up to F is a diminished 5th; it resolves to C–E, a major 3rd, which is inward.
  - F# up to C resolves to G–B, also inward.
  - Only the inverted form (an augmented 4th) expands outward to a 6th.
  - L4 (l4u12m4) states this correctly.
- **Scope:** 5 passages.
- Status: verified.

### B-10: A first wrong answer reveals the correct option, then the retry pays 0.5
- Severity S2. Type: bug (scoring).
- **Where:**
  - `inputs/ChoiceInput.tsx:18` turns the correct option green on any submit.
  - `validateExercise.ts:152-155, 168-172, 251-256, 270-274` write the correct answer into the feedback.
  - `ExerciseFeedback.tsx:87-96` shows that feedback with "Try again".
  - `ExerciseRunner.tsx:154` scores a second-try correct as 0.5.
- **Evidence:** `$B/check_misc.mts` → `out_misc.txt` section B: 369 of 369 choice items reveal the answer on the first wrong attempt (e.g. `The correct answer is "A minor".`).
- **Effect:** the stored scores, and so spaced repetition, can't tell a guess from a known answer.
- **Fix:** reveal only after the final attempt.
- Status: verified.

### B-11: The correct option is the longest one 76% of the time
- Severity S2. Type: ux (test-wiseness leak).
- **Evidence:** `$B/check_mc.mts` → `out_mc.txt`: 341 of 450 unique choice sets, against about 25% by chance (authored 102/154, template sets 124/153). The same check finds 0 sets without exactly one correct answer and 0 duplicate labels.
- **Fix:** balance option lengths.
- Status: verified.

### B-12: 91 of 293 generated multiple-choice prompts point at something that isn't there
- Severity S2. Type: ux.
- **Evidence:** `$B/check_deictic.mts` → `out_deictic.txt`. Examples:
  - "Which note sits on the indicated line or space of the staff?" — the options are about clef names, and no staff is shown.
  - "What is the key signature for this major key?"
  - "Classify this cadence type … described."
- No stimulus is ever rendered for multiple choice. The real task is always "pick the true statement".
- Status: verified.

### B-13: Answers given away in the prompt (15 authored items)
- Severity S2. Type: ux.
- **Evidence:** `out_misc.txt` sections A and A2.
  - 12 build prompts list the answer notes, e.g. l4u12m4e1 "This is G dominant 7th: G-B-D-F".
  - l3u11m5e1/e2 ("Transpose C4 up by a major 2nd…") state the answer.
  - l2u7m5e2 asks for "the quality of the vii° chord"; the ° symbol is the answer.
- **Where:** `exercisesL4/L5`, `exercisesL3.ts:749/764`, `exercisesL2.ts:755`.
- Status: verified.

### B-14: Build answers are spelling-blind, and the note chips show sharp names
- Severity S2. Type: ux / content.
- **Where:**
  - `inputs/InstrumentInput.tsx:59, 94-95` always uses the sharp spelling.
  - `useKeyContext.ts:204-206` uses `spellSharpDefault` in exercise mode.
  - Grading is by pitch class only.
- **Evidence:** `out_misc.txt` section C: in 26 of 97 build items, a correct note is labelled with a different name. Examples: F major shows Bb as "A#"; C natural minor shows "D#, G#, A#"; F diminished 7th shows "G# B D".
- `l2u4m1`'s prompt asks for "the correct sharps or flats", which the input can't express.
- The grading answers themselves match my oracle for all 263 items (`$B/check_build.mts` → `out_build.txt`; the 8 flagged rows are hint references to other chords, reviewed by hand).
- Status: verified.

### B-15: The `l1u1m2` ear note-ID items need perfect pitch
- Severity S2. Type: ux / content.
- **Where:** `exercisesL1.ts:116`; playback at `ExerciseRunner.tsx:84-86`.
- **Evidence:** `out_misc.txt` section E: one note is played with no reference tone, and the distractors are the adjacent semitones (e.g. C4 against B, C#, D).
- Wikipedia, *Absolute pitch*: the ability to identify a pitch "without the benefit of a reference tone"; "1 in 10,000 is widely reported" (accessed 2026-10-30).
- The items are also off-topic in a ledger-lines module. 4 items.
- Status: behaviour verified; pedagogical impact inferred.

### B-16: Ideas used before the lessons teach them
- Severity S2. Type: ordering.
- **Evidence:** `out_order.txt` (16 module–term pairs).
  - **L1 interval items** (16 items) offer only quality names, though L1 says "for now, the number is enough" (`curriculumL1.ts:353`). The `l1u1m3` prompt asks "half step or whole step?" but offers neither.
  - `l1u2m2g4` (6/8) and `l1u2m2g3` (cut time) appear in L1; they are taught in l2u6m1 and l4u14m2.
  - `l1u3m2g2–g4` test E, Bb and Ab key signatures in "First Four Keys".
  - `l2u6m2g3`: the correct answer is about **hemiola**, first taught in **L8**.
  - `l2u7m4g1` tests the cadential 6/4 before l3u10m4.
- Status: verified.

### B-17: Wrong tenor-sax transposition
- Severity S2. Type: incorrect.
- **Where:** `curriculumL3.ts:737` (also the spec, `curriculum/03-harmony-foundations.md:447`).
- **Evidence:**
  - The text says the tenor sax "sound[s] a major second lower". Wikipedia, *Tenor saxophone*: "sounds an octave and a major second lower than written".
  - The alto line "(or equivalently, a minor third higher)" gives the same pitch class, not the same sounding pitch.
- Status: verified.

### B-18: The SATB example puts the bass below its own stated range and calls it valid
- Severity S2. Type: incorrect.
- **Where:** `curriculumL3.ts:286`. The stated bass range is E2–C4; the example uses C2 and says "All valid".
- **Evidence:** `out_derivations.txt`: C2 is 2 steps below E2.
- Status: verified.

### B-19: "The major 7th interval (B to C)"
- Severity S2. Type: incorrect.
- **Where:** `curriculumL4.ts:362`.
- **Evidence:** B up to C is a minor 2nd; C up to B is the major 7th.
- Status: verified.

### B-20: The V6/5 and V4/3 demos play plain triads
- Severity S2. Type: incorrect.
- **Where:**
  - `curriculumL4.ts:239`: Try This `G/D`, labelled "V4/3".
  - `curriculumL4.ts:258-259`: task "G/B — this is V6/5".
- **Evidence:** the app's own parser builds G/D and G/B as G-B-D with no F (`out_derivations.txt`).
- **Fix:** use `G7/D` and `G7/B`.
- Status: verified.

### B-21: The harmonic-minor task compares against A major, which already has G#
- Severity S2. Type: incorrect.
- **Where:** `curriculumL3.ts:223`.
- **Evidence:** G# is in both A major and A harmonic minor; the comparison only makes sense against A natural minor.
- Status: verified.

### B-22: L4 and L5 disagree on what major IV in minor is
- Severity S2. Type: inconsistent answer key.
- **Where:** `exercisesL5.ts:511` (l5u16m5e3) keys major IV as mode mixture and excludes V because it "comes from harmonic minor". But `curriculumL4.ts:765` says IV comes from melodic minor ascending.
- **Evidence:** A melodic minor ascending contains D, F# and A (`out_derivations.txt`), so by L4's own account major IV belongs to the minor system just as V does.
- Status: verified.

### B-23: The appoggiatura/escape-tone hint says both are "typically accented"
- Severity S2. Type: incorrect hint.
- **Where:** `templatesL4.ts:58`, shown on 3 generated items.
- **Evidence:** the module's own concept says the escape tone falls on a weak beat.
- Status: verified.

### B-24: A theme-and-variations answer contradicts its own lesson
- Severity S2. Type: incorrect key.
- **Where:** `templatesL5.ts:473`.
- **Evidence:** the answer marked correct says each variation "preserves the harmonic structure". The module's concept C2 lists harmonic and modal variations as types.
- Status: verified.

### B-25: "The 3rd and 7th ARE the chord's identity… everything else is color"
- Severity S2. Type: incorrect.
- **Where:** `curriculumL5.ts:755`.
- **Evidence:** Cm7 and Cø7 have identical 3rd and 7th (Eb, Bb); only the 5th differs. Also, "the 7th tells you dominant vs minor 7th" fails: both have a minor 7th.
- Status: verified.

### B-26: A hint calls a period a musical "sentence"
- Severity S2. Type: terminology clash.
- **Where:** `exercisesL3.ts:605`. The same module (l3u11m2) teaches the sentence (Satz) as a different form.
- Status: verified.

### B-27: The "augmented, diminished, or compound" interval template can produce none of those
- Severity S2. Type: bug.
- **Where:** `templatesL2.ts:310-327`. Its intervals [1, 3, 4, 6, 8, 10, 11] only ever produce minor, major or "Tritone" labels, with nothing above 11 semitones.
- Status: verified.

### B-28: No guitar content in L1–L5
- Severity S2. Type: content-gap.
- **Evidence:**
  - Grepping `curriculumL1–5.ts` for `guitar|fretboard|fret` gives 0 for every level. The same kind of grep for `piano|keyboard` gives 18 in L1, which shows the grep can match.
  - The clef module never says guitar music is written in treble clef and sounds an octave lower. Wikipedia, *Clef*: "music for some instruments (such as guitar) … have used treble clef, although they sound an octave lower".
- Status: verified.

### B-29: Ambiguous "most unstable and dissonant triad" question
- Severity S2. Type: ambiguity.
- **Where:** `exercisesL2.ts:667`.
- **Evidence:** both the diminished and augmented triads contain an altered, dissonant 5th, and the lesson itself calls both unstable.
- Status: inferred.

### B-30: The same exercise appears twice in one session (21 pairs)
- Severity S3. Type: bug.
- **Where:** `exerciseGenerator.ts:326-328` only removes duplicates among generated items, not against authored ones.
- **Evidence:** `out_mc.txt`, e.g. l1u3m4e1 = l1u3m4g5.
- Status: verified.

### B-31: Grammar and raw identifiers in generated prompts
- Severity S3. Type: polish.
- **Evidence:** `out_misc.txt` section D:
  - 16 "a A / a E / a F" (e.g. "Build a E major triad").
  - 3 raw identifiers ("Build a F minor7 chord").
  - 16 "going ascending".
- Status: verified.

### B-32: The `points` field is never used in scoring
- Severity S3. Type: tech-debt.
- **Where:** `exercise.ts:120,130`; `ExerciseRunner.tsx:154-188`.
- **Evidence:** the `pts=2` set on build items has no effect, and the type comment ("80% of max points") is stale.
- Status: verified.

### B-33: The note-ID instrument highlight is dead code
- Severity S3. Type: tech-debt.
- **Where:** `ExercisePrompt.tsx:22`. `highlightedNotes` is only rendered in build mode (`useKeyContext.ts:181-192`).
- **Risk:** if someone "fixes" it, note-ID answers would leak, because the instruments show note names.
- Status: verified.

### B-34: Small prose errors (S3, each checked against the line cited)
- `curriculumL2.ts:76` describes the submediant as "below the mediant". Wikipedia, *Submediant*: it is halfway between the tonic and the subdominant. In the same concept, "Subdominant (below dominant)" conflicts with the hint at `exercisesL2.ts:125`.
- `exercisesL1.ts:610` uses "minor 5th" as a distractor; that interval name doesn't exist (it's a diminished 5th).
- `curriculumL3.ts:90` says figured bass gives "the chord and its voicing"; it gives the inversion.
- `curriculumL4.ts:772` calls VII–i "Mixolydian-flavored". A Mixolydian contains C#, so VII–i is Aeolian.
- `exercisesL3.ts:513` lists "three contexts" for the 6/4 chord; the concept lists four.
- `curriculumL3.ts:611` and `:634` define slow/moderate/fast harmonic rhythm differently.
- Try-This buttons that don't match their concept: `curriculumL4.ts:356` plays Am7 in the blues-tonic concept; `curriculumL3.ts:448` plays F/A in the cadential 6/4 concept.
- `templatesL4.ts:219-221` says any "minor seventh chord functions as a pre-dominant" (iii7 and vi7 don't). l5u15m2 TPL0 calls dom7 "the chord quality used for every secondary dominant", though V/V triads are taught one module earlier.
- `templatesL1.ts:128,138` say "Use its sharp/flat name", but only one spelling is offered.
- l3u9m1 (seventh chords) has 4 ear items that are triads.

### B-35: The curriculum README's "Current State" table is stale
- Severity S3. Type: tech-debt.
- **Where:** `curriculum/README.md` says 5 units and 23 modules. There are 118 modules (64 in L1–L5), per `$B/check_structure.mts`.
- The spec markdown also carries the B-17 and B-34 submediant errors.

## Improvements
1. Spelling-aware intervals and notes, both for drawing and grading where the lesson is about spelling (fixes B-1, B-2, B-14 and B-27).
2. Add my self-testing checks to `npm run audit:all`. Current audits report "exercises 0 / generated 0" and catch none of B-1, B-3, B-4 or B-5. The checks: `check_intervals`, `check_staff`, `check_degree`, `check_order`, `check_template_topics`, `check_deictic`.
3. Reveal the answer only after the final attempt (B-10).
4. Show an actual stimulus (staff, chord, cadence) for "this chord / this cadence" questions (B-12).
5. Rhythm modules (l1u2m1, l1u2m2, l2u6m1, l2u6m2, l4u14m2) have no rhythm notation or audio; every Try-This plays a scale or chord. l5u17m3 asks to "identify the five textures by ear" with no audio.
6. A guitar track: fretboard twins for the piano tasks, plus the octave treble clef (B-28).
7. Ear note-ID by relative pitch, with a reference tone (B-15).

## Unconfirmed suspicions
- l5u15m5 calls III7–VI7–II7–V7–I the "countdown progression". I believe Coltrane's "Countdown" means major-third-cycle changes, but didn't verify against a source.
- l4u14m2: "11 = 2+2+3+2+2, used by Dave Brubeck". Not verified.
- `templatesL3.ts:487`: "All non-chord tones create dissonance that resolves to consonance" is an overgeneralization, but loosely defensible.
- `templatesL2.ts:220`: 3/8 being "simple triple" is the textbook view, but fast 3/8 is felt in one, so the rejected option is defensible.
- `ExerciseRunner.tsx:95-97` and `ExercisePrompt.tsx:52-54` ignore '##' and 'bb' root accidentals. Latent only: `$B/dbl.mts` shows L1–L5 interval and ear items use natural roots only.

## Coverage
- **Read in full:** all 64 modules, 184 concepts, 185 tasks, milestones, 217 authored and 261 generated exercises, and the grading, rendering and generator code (listed in the dumps).
- **Checked exhaustively by script** (each with a planted failing case):

| Check | Items (authored + generated + template space) | Result |
|---|---|---|
| Interval display vs key | 14 + 29 + 302 | B-1 |
| Note-ID staff claims | 7 + 14 + 50 | B-3 |
| Scale-degree key and visibility | 4 + 8 + 56 | B-4 |
| Build grading and noteCount vs oracle | 30 + 67 + 166 | 0 errors |
| Multiple-choice integrity | 450 unique sets | B-11, B-30 |
| Ordering (concept before taught) | 478 playable items | B-16 |
| Prompts referring to missing stimulus | 293 | B-12 |
| Prose note lists | 80 parsed + 95 reviewed by hand | 0 errors |
| Key-signature claims | 16 | 0 errors |
| Relative-key claims | 8 | 0 errors |
| Module/prerequisite structure | — | 0 issues |

- **Prose:** judged by reading plus first-principles derivation (`$B/check_derivations.mts`). Web sources were used only for the tenor sax, absolute pitch, the submediant and the guitar clef.
- **Not checked:**
  - PT/ES overlays (another track). Every fix needs mirrored PT/ES edits; `templateParity.test.ts` enforces this.
  - Live rendering in a browser. VexFlow output was inferred from the props passed to it.
  - Audio.
  - Execution of Try-This queries.
  - L6–L9.
  - The `curriculum/*.md` spec files were only grepped, not read in full; they aren't user-facing.

Model: everything above was done by Claude Opus 5.5; no sub-agents were spawned.