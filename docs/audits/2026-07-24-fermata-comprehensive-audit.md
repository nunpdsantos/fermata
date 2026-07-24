# Fermata Comprehensive Product Audit

**Audit date:** 24 July 2026  
**Production URL:** https://fermata-music.vercel.app/  
**Audited production deployment:** `dpl_9Vjv6k5B2GT7xDuxzfWUTVbVkJbt`  
**Audited Git commit:** `6ae575a99b47cf15daa6e52e25a39cd16c8e1a53`

## Executive verdict

Fermata is a technically strong music-theory explorer and drill engine, but it is not yet a trustworthy comprehensive learning product.

The main failure is not code stability. It is assessment validity. A learner can produce high scores without knowing the material because 521 of 522 ordinary multiple-choice exercises place the correct answer first, and 26 of 39 note-identification prompts literally include the answer. Level 9 is called “Ear Training & Aural Skills,” yet none of its 125 exercises uses the only exercise type that plays an ear-training prompt.

That invalidates Learn completion, review, and mastery signals. The current test count and green content-audit scripts do not detect those problems.

### Release judgment

| Area | Judgment | Reason |
|---|---|---|
| Music-theory engine | Pass with caveats | Deterministic engine audits and unit tests are strong |
| Explore experience | Pass with improvements | Coherent, useful and functional; first load is heavy |
| Drill engine | Pass online, fail offline-first story | FSRS logic is well tested; fresh offline Drill crashes |
| Learn assessment validity | Fail | Systematic answer leakage and unsupported listening prompts |
| Curriculum claim | Fail | Broad content is present, but exercise modality does not support many claimed skills |
| Reliability | Fail release gate | Failed exercise chunks can silently remove assessment requirements |
| Accessibility | Needs work | Lighthouse 96, but repeated contrast and accessible-name failures remain |
| Performance | Needs work | Roughly 4.8 MB on first load; mobile Lighthouse performance 54 |
| Security | Pass with maintenance | Strong headers and zero production dependency vulnerabilities |
| Data durability | Needs work | Long-term progress is browser-local with no backup or transfer path |
| Internationalisation | Not publication-ready | Structural parity exists; language quality and semantic parity do not |
| Evidence of learning outcomes | Not established | No learner study or trustworthy in-product assessment signal |

## What was audited

- Production deployment identity, availability, headers, manifest and service worker
- Repository state and deployed-code parity
- Product structure, navigation and initial responsive presentation
- Curriculum inventory, lesson structure and product claims
- Every generated and authored exercise configuration
- Exercise rendering, answer ordering, scoring and completion logic
- Ear-training and audio-trigger paths
- Drill bank and spaced-repetition implementation
- Offline and failed-chunk behavior using the production build
- Progress persistence and recovery options
- English, European Portuguese and Spanish content architecture
- Accessibility through Lighthouse/axe evidence and source inspection
- Performance, bundles and network payload
- Security headers and dependency audit
- Unit, integration, end-to-end, coverage and custom content-audit quality
- Vercel production deployment and runtime evidence

### Important limits

- No claim is made about piano/guitar timbre or audio quality. That requires listening on real speakers/headphones.
- No complete native-speaker editorial review of Portuguese or Spanish was performed.
- No real learner study was performed, so teaching effectiveness and retention cannot be established.
- The in-app interactive browser was unavailable. Visual evidence came from production Lighthouse captures, and critical runtime paths were reproduced in headless Chromium against the production build.
- Safari, iOS PWA installation, real mobile touch behavior, screen-reader speech output and physical MIDI hardware were not manually tested.

## P0 blockers

### F-01: 521 of 522 multiple-choice exercises put the answer first

**Evidence**

- The resolved English curriculum contains 522 `multiple_choice` exercises.
- Correct-answer positions are: index 0 in 521 exercises, index 1 in one exercise.
- `ExerciseRunner` passes `cfg.choices` directly to the UI.
- `ChoiceInput` renders `options.map(...)` without shuffling.
- Exercise order is shuffled, but answer order is not.
- Portuguese and Spanish use the same answer-order mechanism.

**Impact**

A learner can score almost perfectly by always choosing the first option. Module completion, review schedules and apparent mastery therefore do not measure knowledge.

**Required fix**

Shuffle choices with a stable per-exercise seed, keep the order fixed across retries, and add a generated invariant test proving that correct positions are distributed and not predictable.

### F-02: two-thirds of note-identification prompts state the answer

**Evidence**

- There are 39 `note_id` exercises.
- 26 prompts literally name the target. Examples include:
  - “Identify this note that requires ledger lines: A3.”
  - “Listen to the pitch and identify it. This is D in octave 4.”
  - “Identify this chromatic note: G#.”

The staff notation is a legitimate stimulus, not answer leakage. `ExercisePrompt` does write the target into `highlightedNotes`, but `useKeyContext` only surfaces that state while `exerciseInputActive` is true. Choice-based `note_id` exercises do not enable that mode, so the current instrument does not visibly expose the target. The proven leak is the prompt text.

**Impact**

Twenty-six of the 39 exercises cannot validly assess note identification because the answer is in the question. The remaining 13 are not proven invalid by this finding.

**Required fix**

Do not place the target in the prompt. Add a corpus-level check that compares the rendered prompt with the configured answer while handling single-letter note names safely.

### F-03: the Ear Training level does not deliver ear-training exercises

**Evidence**

- Level 9 contains 125 exercises:
  - 41 `interval_id`
  - 28 `multiple_choice`
  - 18 `note_id`
  - 18 `scale_build`
  - 17 `chord_build`
  - 3 `scale_degree_id`
  - 0 `ear_training`
- Seventy-six Level 9 prompts say “listen,” “hear,” “by ear,” or “sound.”
- `ExerciseRunner` automatically plays a prompt only for `config.type === 'ear_training'`.
- Across all nine levels, only 12 of 869 exercises are `ear_training`, four each in Levels 1, 2 and 3. Levels 4 through 9 have none.

**Impact**

Level 9 frequently shows notation or construction tasks while asking the learner to listen. Claims such as pitch recognition, dictation and aural identification are not implemented as assessed listening skills.

**Required fix**

Convert auditory objectives to genuine audio-first exercises. Play the intended note, interval, chord, cadence or progression; hide visual answer cues until submission; test autoplay failure and replay behavior on browsers with audio restrictions.

### F-04: a failed exercise download lets the learner bypass assessment

**Evidence**

- `LearnView` represents “not loaded,” “failed” and “loaded but empty” with the same `{}` state.
- `loadLevel(...).then(...)` and `loadExercises(...).then(...)` have no rejection handling.
- `ModuleView` treats `exercises.length === 0` as “this module has no exercises.”
- Its completion rule is `allTasksDone && (!hasExercises || exercisesPassed)`.
- Runtime reproduction:
  1. Abort the Level 1 exercise chunk.
  2. Open “The Staff and Clefs.”
  3. No exercise section appears and the page reports a failed dynamic import.
  4. Tick the two practice tasks.
  5. “Mark Module Complete” becomes enabled.

**Impact**

Slow, offline or failed content delivery silently changes the learning requirement instead of showing an error. A transient network problem can create false completion.

**Required fix**

Use explicit `loading`, `ready`, `empty` and `error` states. Every current module is expected to have exercises, so completion must remain blocked unless the exercise payload loaded successfully and passed.

## P1 serious findings

### F-05: the advertised offline Drill entry fails

**Evidence**

- The PWA manifest advertises a “Start Drill” shortcut to `/?view=drill`.
- The service worker caches `ExploreView`, `LearnView`, curriculum and notation chunks, but its content-cache pattern omits `DrillView`.
- Runtime reproduction on a fresh production-build browser profile:
  1. Load the app and wait for the service worker.
  2. Go offline before opening Drill.
  3. Reload and select Drill.
  4. Fermata displays: “This view encountered an error. Try Again.”

**Impact**

The app shell appears offline-ready, but an explicitly advertised core destination crashes unless its chunk happened to be cached earlier.

### F-06: the “1,000+ exercises” claim is false

**Evidence**

- The resolved Learn curriculum has 869 exercises: 385 authored and 484 generated.
- It has 28 units, 118 modules, 346 concepts, 347 practice tasks and approximately 25,847 words of concept explanation.
- The separate Drill bank has 1,315 generated items. Those are not Learn curriculum exercises.
- README and project documentation claim “118 modules, 1,000+ exercises.”

**Impact**

This is a measurable claim-integrity problem. Adding a separate drill-item bank to the curriculum count would conflate different products and learning mechanics.

### F-07: breadth is being mistaken for instructional coverage

**Evidence**

- Every module has between 3 and 14 exercises, but 522 of 869 Learn exercises, 60.1%, are ordinary multiple choice.
- Only 12 of 869, 1.4%, are real ear-training configurations.
- The Drill bank is also choice-heavy: 1,009 of 1,315 items, 76.7%, use a choice input.
- Rhythm and meter lessons explicitly note that the app has no rhythm/notation visualisation UI and substitute scale or chord queries.
- Advanced topics such as dictation, sight singing, counterpoint and orchestration are often represented by prose plus recognition checks rather than performance of the claimed skill.

**Impact**

Fermata has broad subject coverage, but not equivalent practice coverage. A list of advanced topics is not the same as a curriculum that trains those abilities.

### F-08: first load is unnecessarily heavy

**Evidence**

- Production Lighthouse transferred approximately 4.8 MB on initial load.
- The app preloads both instrument sample banks on the first idle slot: approximately 2.0 MB piano plus 1.7 MB guitar, even when only one instrument is selected.
- The build contains a 1.1 MB raw VexFlow chunk and a 497 KB raw main bundle.
- Build output reports a chunk-size warning.
- Lighthouse:

| Profile | Performance | FCP | TBT | CLS | Recorded LCP | Transfer |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 54 | 2.63 s | 657 ms | 0.0002 | 25.45 s | 4.82 MB |
| Desktop | 77 | 0.82 s | 42 ms | 0.0001 | 4.47 s | 4.95 MB |

The Lighthouse run emitted an LCP instrumentation error, so the exact LCP values should be treated as noisy. The transfer size, FCP and blocking-time problem remain clear.

**Impact**

The preload strategy makes every first-time user pay for two instruments. It is especially expensive on mobile or constrained connections.

### F-09: long-term progress has no backup or transfer path

**Evidence**

- App preferences, Learn progress and Drill progress are stored in browser `localStorage`.
- Shape validation and migrations exist, which is good.
- No user-facing export, import, backup or device-transfer path exists for Learn/Drill progress.

**Impact**

Clearing browser data, changing browser/device, storage eviction or reinstalling the PWA can erase progress across 118 modules and the Drill schedule.

### F-10: multilingual completeness is structural, not editorial

**Evidence**

- Automated parity tests verify that PT/ES overlay keys and arrays exist.
- Project documentation itself records mixed-English clauses, English chord/interval feedback and unresolved Portuguese diacritic restoration.
- Twenty-two Portuguese content files have zero or only a handful of Portuguese diacritic characters.
- A semantic translation error exists in both PT and ES Level 4:
  - English correctly says the root of ii7, D, is the fifth of V and a common tone.
  - PT and ES say the seventh of ii7 is common with the root of V. In C major that means C and G, which are not the same note.

**Impact**

“100% complete” currently means files are populated, not that the language is publication-quality or musically equivalent.

### F-11: the browser suite gives false confidence

**Evidence**

- Unit tests pass, but coverage is 66.61% statements, 54.8% branches, 65.54% functions and 67.93% lines.
- The Learn rendering and exercise UI path is effectively at 0% unit coverage, including `LearnView`, `ExerciseRunner`, prompts, feedback and inputs.
- Coverage has no enforced thresholds.
- Coverage reports a parse error for `usePWA.ts` but still exits successfully.
- End-to-end results are 11 passed and 1 skipped, Chromium desktop only.
- Existing E2E tests do not answer an exercise, submit a wrong answer, finish a module, exercise Drill, verify persistence, switch language content, run on mobile, test audio or test offline behavior.
- The service-worker test asserts registration count is `>= 0`, which can never fail.
- The navigation test is still named “two view tabs” and does not assert the Drill tab.
- The content-audit scripts prove that the validator accepts an answer derived from the same configuration. They do not test prompt semantics, answer leakage, distractor quality, answer order or whether audio plays.

**Impact**

The current green suite proves many implementation units are stable. It does not prove the learning product works.

## P2 quality findings

### F-12: accessibility is good in structure but not conformant

Production Lighthouse accessibility scored 96, with repeated failures:

- Language selector and muted body text: 3.84:1 contrast where 4.5:1 is required.
- Inactive Guitar tab: 3.42:1.
- Active octave tab: 4.11:1.
- Piano octave labels: 4.05:1.
- Multiple Circle of Fifths SVG controls have visible text that does not match the accessible name.

Existing tests check selected ARIA attributes and keyboard behavior, but do not run axe or validate contrast.

### F-13: mobile presentation is coherent but too dense

The mobile production capture shows a consistent visual system, stable layout and a usable stacked structure. The trade-off is very small typography, a large persistent instrument occupying the bottom of the viewport, and the install prompt overlaying part of that instrument. This needs real-device testing with one-handed use, zoom, large text and the on-screen keyboard.

### F-14: client-side production failures are invisible operationally

Vercel reported no runtime error clusters during the sampled seven-day window, but Fermata is a static client app and has no client error reporting. The reproduced lazy-chunk and offline Drill failures therefore do not appear in Vercel runtime logs.

For private personal use this may be acceptable. For other users, it means failures are learned through complaints rather than evidence.

### F-15: content tone and terminology need a final editorial pass

Examples include repeated subjective/culturally broad descriptions such as “exotic” and a generated answer describing a “gypsy flavor.” The latter is dated and avoidable. Claims such as “dark,” “bright,” “folk-like,” “jazzy” and “sophisticated” are sometimes presented as intrinsic properties rather than listening conventions or context-dependent associations.

This is not the largest product risk, but it undermines the authority expected from an advanced curriculum.

### F-16: maintenance debt remains

- `npm audit` reports seven development/build-chain vulnerabilities: five high and two low.
- `npm audit --omit=dev` reports zero production dependency vulnerabilities.
- Browser compatibility data is approximately six months old.
- Production Lighthouse reports missing source maps for large first-party JavaScript.
- Project documentation reports three different test baselines: about 2,286, about 2,642 and the actual 5,619.

## What is genuinely strong

- Production is deployed from the same exact commit that was audited.
- Production HTML references the same main bundle hash generated locally.
- `npm run lint`, forced TypeScript compilation and production build pass.
- All 5,619 Vitest tests pass.
- Engine audit: 1,550 checks, zero failures and four informational enharmonic-respelling cases.
- Authored-exercise audit: 385 scanned, zero validator/config findings.
- Generated-template audit: 1,667 combinations, zero validator/config findings.
- All 118 modules have exercise data.
- Drill scheduling, session composition, grading and persistence have substantial unit coverage.
- Security headers are strong: CSP, HSTS, `nosniff`, frame denial, strict referrer policy and restrictive permissions policy.
- The browser runtime dependency set has zero known production vulnerabilities.
- There are no accounts, cloud data or payment flows, so the current privacy and security attack surface is limited.
- Piano and guitar sample licence files are present, with attribution in the repository.
- The initial visual system is coherent, layout shift is negligible and the desktop/mobile structure adapts cleanly.
- State migrations and corrupt-storage guards are materially better than a typical prototype.

These strengths are real. They are not enough to compensate for invalid assessment.

## Remediation order

### Phase 1: restore assessment integrity

1. Shuffle multiple-choice answers with a stable exercise seed.
2. Remove literal answers from note-identification prompts.
3. Replace Level 9 “listen” prompts with real audio-first configurations.
4. Add corpus-level tests for answer position, prompt leakage and audio/config alignment.

### Phase 2: stop silent false completion

1. Model exercise loading explicitly as loading, ready, empty or failed.
2. Block completion until the expected exercise payload loads and passes.
3. Show a retryable error state for failed curriculum/exercise chunks.
4. Add `DrillView` to runtime caching and test the manifest shortcut from a fresh offline profile.

### Phase 3: make progress durable

1. Add one export file containing app preferences, Learn progress and Drill state.
2. Add validated import with versioning and a preview before overwrite.
3. Test backup and restore across app versions.

### Phase 4: align claims with the product

1. Change “1,000+ exercises” to the verified count or remove the numeric claim.
2. Separate “topics explained” from “skills actively trained.”
3. Do not call Level 9 ear training complete until it plays and grades real auditory material.
4. Run a native-musician review for English, European Portuguese and Spanish.
5. Restore Portuguese diacritics and fix mixed-language feedback.

### Phase 5: broaden verification

1. End-to-end test Explore, Learn and Drill as actual user journeys.
2. Add wrong-answer, retry, pass/fail, completion, persistence and review tests.
3. Test mobile Chromium, WebKit and Firefox.
4. Test production service worker, offline shell, every advertised shortcut and update behavior.
5. Add automated axe checks and manual screen-reader/keyboard review.
6. Enforce coverage thresholds and repair the `usePWA.ts` coverage parse failure.
7. Test audio on Safari/iOS, Chrome/Android and real headphones.

### Phase 6: performance and polish

1. Preload only the selected instrument; fetch the second bank when the user chooses it.
2. Keep VexFlow outside initial Explore cost unless notation is visible.
3. Establish and enforce a first-load transfer and interaction budget.
4. Fix contrast tokens and Circle of Fifths accessible names.
5. Reassess mobile typography and the install-prompt collision on real devices.

## Release gates for a solid product

Fermata should not be described as a solid learning product until all of the following are true:

- A learner cannot predict answers from option position.
- No assessment prompt or persistent instrument reveals the answer before submission.
- Every prompt that says “listen” plays the exact intended audio without visual leakage.
- Failed or slow content loading cannot reduce module requirements.
- The Drill shortcut works from a fresh offline installation.
- Progress can be backed up and restored.
- A real browser test completes and fails exercises, completes a module, reviews it later and preserves state.
- PT and ES pass native-speaker music-theory review.
- Mobile, Safari/iOS, keyboard and screen-reader journeys have been exercised manually.
- At least a small learner test demonstrates comprehension or retention using assessments whose validity has first been repaired.

## Verification record

| Check | Result |
|---|---|
| Git state at start | Clean `main`, aligned with `origin/main` |
| Production commit parity | Exact match: `6ae575a99b47cf15daa6e52e25a39cd16c8e1a53` |
| Lint | Pass |
| TypeScript | Pass |
| Production build | Pass, 808 modules transformed |
| Unit/integration tests | 88 files, 5,619 passed |
| End-to-end suite | 11 passed, 1 skipped |
| Engine/content scripts | 1,550 engine checks; 385 authored; 1,667 template combinations; zero failures |
| Production dependencies | Zero known vulnerabilities |
| Development dependency tree | Seven known vulnerabilities |
| Production headers | Pass |
| Vercel build-error query | No build error evidence |
| Vercel runtime-error query | No server/edge error clusters; client failures not observable |
| Failed exercise chunk reproduction | Reproduced; exercises disappear and completion becomes available |
| Fresh offline Drill reproduction | Reproduced; error boundary shown |
| Lighthouse mobile | 54 performance, 96 accessibility, 100 best practices, 100 SEO |
| Lighthouse desktop | 77 performance, 96 accessibility, 100 best practices, 100 SEO |
