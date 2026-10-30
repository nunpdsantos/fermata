<!-- Saved by main session from the agent's SubagentHandback (agent Write was blocked by harness) -->
## Track D verification: 13 findings (D-1 to D-10, D-13, D-14, D-15)

The repo was not modified. My scratch files are in `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/verify/D/`. All cited file:line references check out against the code.

The findings file defines no severity scale. I judged severity by learner impact times reach.

| ID | Verdict | Severity (agree / suggest) | One-line reason |
|---|---|---|---|
| D-1 | CONFIRMED | S1 / lean S2 | `genCircle.ts:21,86-87`: `CIRCLE_DISPLAY[(i+1)%12]` after F♯ is D♭. Letters F to C give C♯, so F♯ to D♭ is a diminished 6th. The same fault applies to "down from D♭" giving F♯ instead of G♭. The pitch class is right and only the spelling is wrong, and it covers 2 items. I checked the other 10 positions by hand and all are right. |
| D-2 | CONFIRMED | S1 agree (borderline S2) | `genRoman.ts:306`: the "No" items reuse `diatonicMember` with `chord: noChord`. I listed all 10 and each "No" is correct, but each explanation says, for example, "D major is the diatonic chord built on that degree of C major". `FeedbackStrip.tsx:95` shows the explanation on both correct and wrong answers, so it is always seen. |
| D-3 | CONFIRMED | S1 agree | `ExercisePrompt.tsx:48-62` uses a sharp-only table. My own script (`d3.mts`, independent of the auditor's oracle) found the same 12 of 43 letter-inconsistent exercises. The worst are `l2u7m1e2` (prompt says "C up to Eb", staff shows D♯) and `l2u7m2e2`. Nuance: the `l1u1m3` items (C–C♯ graded "Minor 2nd") are the usual beginner half-step simplification and are much milder. |
| D-4 | PARTIAL | S1 / S2 | Mechanism is real, but "typical for a new learner" is wrong. Details below the table. |
| D-5 | CONFIRMED | S2 agree | `drillScheduler.ts:126,139-145`: I reproduced "wrong first time in 3 sessions, right on requeue" giving `byHeart` (`d5.mts`). Existing tests at `drillScheduler.test.ts:83-111` encode last-answer-per-session, so it is deliberate and arguably a literal reading of the spec. The effect is limited to the mastery label and summary, because `review` and `byHeart` are scheduled identically. It also breaks the spec's acceptance criterion 5 ("one lapse demotes it"); see extras. |
| D-6 | PARTIAL | S2 / S3 | `genRoman.ts:41`: the answers (`minor (v)`, `major (VII)`) are correct for natural minor. The prompt omits "natural", so "contradicts itself" is overstated, because `roman:harmonic-fact` carries the "raised 7th" qualifier. What is real is the omitted qualifier and the explanation "the quality pattern never changes", which is misleading for V in minor. That covers 2 items. |
| D-7 | CONFIRMED | S2 / S3 | `DrillView.tsx:214-225` returns raw ASCII and enums, for example `C half_diminished7` and `C# E# G##`. I counted 306 non-choice items, matching the auditor. It is cosmetic and understandable, with no wrong content. |
| D-8 | CONFIRMED | S2 agree | My own parser reproduced the counts: triad 3rd untested in 52 of 56, seventh 3rd in 42 of 70, seventh 5th in 35 of 70. For Cmaj7 the chips contain B and B♯ but no B♭. The data is verified, the learning effect is inferred, and it is a design weakness rather than an error. |
| D-9 | PARTIAL | S2 / S3 | `chordParser.ts:188` plus the lowercase step makes MM7, Mm7 and mm7 all parse as minor-major 7th, which I confirmed. The cited OMT page does NOT contain the letter labels MM7, Mm7 or mm7 (WebFetch: it uses words only). It does say "The major-minor seventh chord is also often called the dominant seventh chord". A search shows the letter labels exist in other textbooks, such as Carleton and uidaho, and one source says the notation is not fully standardised. `grep` shows the labels appear nowhere else in `src/`, including the curriculum. They are rare as input, but the result is silently wrong. |
| D-10 | CONFIRMED | S2 agree | `drillSession.ts:109-111`: fresh items are sorted by rank and sliced to `newPerSession`. Item counts per family (degree 14, circle 36, keysig 102, interval 171) give the first triad at about session 81 at 4 per session. The spec (§3.2, lines 193-196) says "interleaved across families once ≥ 2 families are active", so this deviates from the spec. Mitigations: the family toggles and `newPerSession` up to 8. |
| D-13 | PARTIAL | S2 / S2 (l2u7m2), S3 (l2u4m1) | `templatesL2.ts:314` says "may be augmented, diminished, or compound". The intervals are `[1,3,4,6,8,10,11]` and `INTERVAL_LABELS` (`chords.ts:428`) has no augmented, diminished or compound answer options, so the module's own topic cannot be answered. The l2u4m1 "correct sharps or flats" wording is near-trivial, because the piano input cannot express spelling. |
| D-14 | CONFIRMED | S2 / S3 | `genKeysig.ts:163` applies `penultimateFlat` to the F major item, which has only one flat. The explanation "second-to-last flat names the key" is therefore inapplicable. It is 1 item, plus PT and ES. |
| D-15 | PARTIAL | S2 / S3 | `genFunction.ts:57`. I fetched Puget Sound and it matches the auditor's quote: a PAC requires V–I, root position and tonic in the top voice, otherwise it is an IAC. But the choice set is PAC, plagal, half and deceptive, so there is no IAC or plain "authentic" option. "V → I = PAC" is the standard introductory simplification. At most it needs a "root position, 1̂ on top" qualifier. |

### D-4 detail

- **The lock is real.** `DrillView.tsx:169` has `key={item.id}`. `NoteChips.tsx` and `RootQualityChips.tsx` hold `locked = useRef(false)` and never re-arm it. `ChoiceChips.tsx` re-arms in an effect, so choice items are not affected.
- **I reproduced it independently.** My test `vt/src/__tests__/lock.test.tsx` starts a real `startSession`, answers via the store, misses the last item through the real `DrillView`, and clicks Continue. The retry then ignores the taps: `asked 8 (was 8)`. The auditor's control passes.
- **The frequency claim fails under defaults.** `DEFAULT_SETTINGS` has all 9 families on, 4 new items per session, length 24. I ran a store-level Monte Carlo (`d4mc.mts`, 200 simulated learners per scenario, random answers at 70% accuracy).

| Scenario | Learners hit by a lock |
|---|---|
| Default settings, 100 sessions | 0 of 200 |
| Triads only | 108 of 200 (54%), first lock around session 2 |
| Triads only, 85% accuracy | 75 of 200 (37%) |
| Sevenths only | 108 of 200 |
| Scale only | 20 of 200 |

- **Why it is rare under defaults.** The first ~80 sessions introduce only choice items. By the time triads arrive the queue is always full length (24). `composeSession` fills the queue from every non-new item, so the "light review days" claim is also wrong.
- **When it fires.** The lock needs a restricted Topics selection, such as the family toggles in `MasteryMap.tsx`, so the queue is shorter than the session length and the last item is missed. The ✕ button escapes it, which is why I suggest S2.

### Extras the auditor missed or understated

1. **Same-item-twice-in-a-row also happens with choice items.** Under default settings, 108 of 200 simulated new learners (70% accuracy) were re-shown a just-missed question immediately. This does not lock, but it breaks spec §3.6 ("the same item never appears twice in a row") and the comment at `drillSession.ts:30-32`. Evidence: `d4mc.mts`.
2. **D-5 is stronger than reported: a lapse is undone.** Four correct sessions give `byHeart`. A first-try miss drops the tier to `review`, but the fast requeue answer restores `byHeart` (`d5b.mts`). That violates spec acceptance criterion 5 ("one lapse demotes it"), whereas the auditor reported only the 3-sessions-wrong case.
3. **Independent re-check of bank content agreed with the auditor.** My Python oracle found 0 errors in 96 note-above items, 56 pair-to-name items, 126 name-to-notes chord spellings, and 54 scale spellings. Three pair-to-name "failures" were gaps in my own interval table, and F–B, B–F and C–E♯ are correctly augmented 4th, diminished 5th and augmented 3rd.
4. **D-9 source mismatch.** The auditor's quoted OMT sentence is real, but it does not support the letter-label notation (MM7, Mm7, mm7) the finding relies on.

Model: Sonnet 5.5 (claude-sonnet-5-5).