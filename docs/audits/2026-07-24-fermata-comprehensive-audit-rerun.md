# Fermata Comprehensive Product Audit: Verification Rerun

**Rerun date:** 24 July 2026  
**Production URL:** https://fermata-music.vercel.app/  
**Audited production deployment:** `dpl_BLDnNkLpbU2cYehjftJpoTuhAW4j`  
**Audited Git commit:** `c5614b7ca6582f4793d0db04e337adf2231dab93`  
**Original audit baseline:** `6ae575a99b47cf15daa6e52e25a39cd16c8e1a53`  
**Original report:** `docs/audits/2026-07-24-fermata-comprehensive-audit.md`

## Executive verdict

Fermata's original assessment-integrity blockers have been materially fixed. The
correct answer is no longer predictably first, note-identification prompts no
longer disclose the target, Level 9 now plays and grades real listening
material, failed exercise downloads block completion, fresh offline Drill works,
and progress can be exported and restored.

That changes the verdict. Fermata is now a credible, technically strong alpha
for self-directed use. It is not yet a fully validated learning product suitable
for broad public claims about mastery or learning outcomes.

The remaining weakness is evidence, not feature count:

- 517 of 870 Learn exercises, 59.4%, remain ordinary multiple choice.
- Levels 4 through 8 still contain no `ear_training` configurations.
- The new Level 9 audio implementation is not directly covered by unit,
  component or end-to-end tests.
- The Replay guard releases after 800 ms even when a scale or chord progression
  continues for several seconds, allowing overlapping prompts.
- Mobile first load still transfers approximately 3.24 MB and produced a
  Lighthouse performance score of 60 in this run.
- Portuguese still contains systematic missing diacritics.
- No learner study, retention measurement or trustworthy outcome data exists.

There were no confirmed P0 implementation failures in the rerun. The release
gate remains unmet for a different reason: Fermata can now administer far more
valid exercises, but it has not yet demonstrated that the whole curriculum
teaches, transfers or retains the skills it claims.

## Release judgment

| Area | Rerun judgment | Evidence |
|---|---|---|
| Production identity | Pass | Live production is READY and exactly matches audited commit `c5614b7` |
| Music-theory engine | Pass with narrow caveats | 1,550 engine checks passed; four informational respelling cases |
| Assessment answer order | Pass | 517 rendered correct positions distributed 125 / 125 / 127 / 140 |
| Note-prompt integrity | Pass for current corpus | All 21 `note_id` prompts pass the new leakage invariant |
| Level 9 ear training | Pass structurally and in sampled browser flow | 98 of 126 L9 exercises are real audio configurations; autoplay and Replay each scheduled audio |
| Learn failure handling | Pass in sampled flow | Aborted L1 exercise chunks showed error/retry and completion stayed unavailable |
| Drill offline entry | Pass | Fresh-profile production build opened `/?view=drill` while offline |
| Progress durability | Pass for local backup | Export/import round trip restored preferences, Learn progress and Drill data |
| Automated code gates | Pass | Lint, forced TypeScript, build, 5,656 tests and 13 Chromium E2E tests passed |
| Test assurance | Needs work | Coverage is 66.48%; `ExerciseRunner` and `LearnView` remain at 0%; coverage command masks a parse error |
| Curriculum breadth | Broad, not fully skills-aligned | 870 exercises across 118 modules, but advanced performance skills remain recognition-heavy |
| Accessibility | Needs work | Lighthouse 96; contrast and visible-label/accessibility-name failures remain |
| Performance | Needs work | Transfer improved from about 4.82 MB to 3.24 MB, but mobile performance was 60 and recorded LCP was noisy and slow |
| Security | Pass with maintenance | Strong response headers and zero known production dependency vulnerabilities |
| Internationalisation | Not publication-ready | Structural parity and one semantic correction improved; Portuguese editorial debt remains |
| Operations | Acceptable for private alpha | No Vercel runtime clusters, but static client failures are still not reported |
| Learning effectiveness | Not established | No real learner outcome or retention evidence |

## What was rerun

- Repository cleanliness, branch, origin parity and deployed commit identity
- Live Vercel deployment state, build logs and seven-day runtime error clusters
- Lint, forced TypeScript checking and production build
- All Vitest suites and the coverage run
- All custom music-engine, authored-exercise and generated-exercise audits
- Dependency vulnerability scans with and without development dependencies
- The full Playwright end-to-end suite
- Independent corpus counts by exercise type, level and ear-training mode
- Correct-answer position distribution after rendered option shuffling
- Current note-identification prompt leakage checks
- Level 9 browser navigation, audio autoplay and Replay scheduling
- Failed dynamic exercise-chunk behavior and module-completion gating
- Fresh-profile offline Drill behavior
- User-facing backup export/import across all three persisted stores
- Desktop and mobile rendering in headless Chromium
- Live Lighthouse mobile and desktop audits
- Live production HTML, manifest, service worker and security headers
- Portuguese content-file diacritic sampling
- Source review of the new audio playback, PWA and backup paths

## Important limits

- This was not a full native-speaker editorial review of European Portuguese or
  Spanish.
- Audio scheduling was verified in Chromium, but piano/guitar timbre, loudness,
  clipping and listening quality were not judged on real speakers or
  headphones.
- Safari, Firefox, iOS PWA installation, Android installation, real mobile
  touch ergonomics, screen-reader speech and physical MIDI were not tested.
- Lighthouse is a synthetic single-run measurement. It emitted `NO_LCP`
  instrumentation warnings, so recorded LCP values are directional, not a
  stable field measurement.
- There is no real-user monitoring or learner analytics with which to validate
  performance, errors, completion quality, retention or learning transfer.
- This audit did not modify product code. It verifies the current build and
  records remaining work.

## Baseline finding disposition

| Original finding | Status | Rerun evidence |
|---|---|---|
| F-01: correct answer almost always first | **Resolved** | Current 517 multiple-choice correct positions are 125, 125, 127 and 140 across indices 0–3; order is stable per exercise |
| F-02: note prompts disclose the answer | **Resolved for current corpus** | All 21 current `note_id` prompts pass the corpus leakage test |
| F-03: Level 9 is silent pseudo-ear-training | **Resolved structurally; QA gap remains** | L9 now has 98 audio exercises across note, interval, chord, scale and progression modes; browser autoplay and Replay both scheduled sound |
| F-04: failed exercise download bypasses assessment | **Resolved** | Forced L1 chunk failure displayed error and retry; task completion did not expose module completion |
| F-05: advertised offline Drill crashes | **Resolved** | Fresh service-worker profile opened manifest shortcut path while offline |
| F-06: false 1,000+ curriculum exercise claim | **Resolved** | README and project documentation now state 870 Learn exercises and separate Drill's approximately 1,315 items |
| F-07: breadth mistaken for instructional coverage | **Open** | Ear training improved, but 59.4% of Learn remains ordinary multiple choice and several claimed performance skills remain prose/recognition |
| F-08: first load unnecessarily heavy | **Partially resolved** | Only the selected instrument bank preloads; transfer fell about 32.8%, but 2.02 MB of piano samples and 692 KB of VexFlow still dominate |
| F-09: progress has no backup/transfer path | **Resolved for manual local transfer** | Browser round trip exported and restored all three valid persisted stores |
| F-10: multilingual completeness is only structural | **Partially resolved** | The PT/ES common-tone theory error was corrected; broad Portuguese editorial debt remains |
| F-11: browser suite gives false confidence | **Partially resolved** | E2E now meaningfully verifies service worker and offline Drill, but core Learn/audio journeys remain absent and coverage gaps persist |
| F-12: accessibility failures | **Open** | Score remains 96 with contrast and accessible-name failures |
| F-13: mobile presentation is dense | **Open** | No overflow at 390 px, but the persistent instrument and small labels still consume substantial viewport area |
| F-14: client failures are invisible operationally | **Open** | No client error reporting was found |
| F-15: content terminology/tone | **Partially resolved** | User-facing “gypsy flavor” wording was removed; a wider editorial review is still needed |
| F-16: maintenance debt | **Open** | Seven development-chain advisories, stale Browserslist data, large-chunk warning and missing coverage enforcement remain |

## Current corpus

### Learn inventory

| Measure | Current |
|---|---:|
| Levels | 9 |
| Units | 28 |
| Modules | 118 |
| Total Learn exercises | 870 |
| Authored exercises | 385 |
| Generated exercises | 485 |
| Separate Drill items | approximately 1,315 |

### Exercise modality

| Type | Count | Share |
|---|---:|---:|
| `multiple_choice` | 517 | 59.4% |
| `ear_training` | 110 | 12.6% |
| `chord_build` | 99 | 11.4% |
| `scale_build` | 65 | 7.5% |
| `interval_id` | 43 | 4.9% |
| `note_id` | 21 | 2.4% |
| `scale_degree_id` | 15 | 1.7% |
| **Total** | **870** | **100%** |

### Ear-training distribution

| Level | Ear-training exercises |
|---|---:|
| Level 1 | 4 |
| Level 2 | 4 |
| Level 3 | 4 |
| Levels 4–8 | 0 |
| Level 9 | 98 |
| **Total** | **110** |

Level 9's 98 audio exercises cover:

- 16 note prompts
- 35 interval prompts
- 20 chord prompts
- 21 scale prompts
- 6 progression/cadence prompts

This is a substantial correction. It does not by itself solve the instructional
coverage problem. Rhythm, dictation, sight singing, counterpoint, form and
orchestration still need task-appropriate practice and evidence rather than
topic presence alone.

## Remaining priority findings

### R-01, P1: audio Replay can overlap the prompt it is meant to repeat

**Evidence**

- `ExerciseRunner` sets `playingRef.current = false` 800 ms after dispatching
  every ear-training prompt.
- A single note is configured for 1.0 s and a chord for 1.2 s.
- An interval can schedule its second note after 700 ms.
- An ascending seven-note scale plus octave schedules approximately 3.17 s of
  sound at the current 0.35 s note duration and 15% gap.
- Progressions schedule chords 950 ms apart and can contain up to four chords.
- The Level 9 browser flow proved that Replay starts another audio source once
  the guard has released.

**Impact**

A learner can hear two copies of a scale, interval or progression at once. That
can make the listening question unintelligible and corrupt the assessment
stimulus.

**Required fix**

Release the guard from a real playback-complete callback, or stop/fade the
current prompt before Replay begins. Add fake-timer component tests for every
ear mode and a browser test proving rapid Replay cannot overlap.

### R-02, P1: the most consequential new Learn path still has no direct automated coverage

**Evidence**

- `ExerciseRunner.tsx` is 0% statements, branches, functions and lines in the
  current coverage report.
- `LearnView.tsx` is 0%.
- `ChoiceInput`, `InstrumentInput` and the prompt path are effectively
  uncovered.
- There is no test file that renders `ExerciseRunner`.
- The 13 E2E cases do not answer a Learn question, trigger a retry, pass or fail
  an exercise set, complete a module, test audio modes or restore a backup.
- The coverage command reports a parse error while excluding
  `src/hooks/usePWA.ts`, but exits successfully.
- No coverage threshold is configured.

**Impact**

The corpus invariants are much better, but a rendering, scoring, audio or
completion regression can still ship with every automated gate green.

**Required release gate**

Add component coverage for each exercise type and both answer attempts. Add
browser journeys for wrong answer, retry, correct answer, pass, fail, completion
blocking, audio autoplay/replay, backup restoration and at least one mobile
Learn flow. Make coverage parsing fail the command and introduce ratcheted
thresholds.

### R-03, P1: curriculum breadth still exceeds demonstrated skill training

**Evidence**

- 517 of 870 Learn exercises are ordinary multiple choice.
- Levels 4 through 8 contain no audio configurations.
- Advanced areas are often assessed through conceptual recognition rather than
  production, transcription, timing, listening or performance.
- Product completion currently records in-app task and exercise success, not
  independent transfer or retention.

**Impact**

Fermata can credibly claim broad music-theory content and interactive
exploration. It cannot yet credibly claim comprehensive training or mastery of
every named advanced skill.

**Required work**

Map every module objective to the observable action the learner must perform.
Where the objective says identify by ear, transcribe, sight-sing, compose,
analyse or perform, the assessment must require that action or the claim must be
narrowed.

### R-04, P1: learning effectiveness has not been established

**Evidence**

- No learner study, pre/post comparison, delayed retention check or transfer
  task was provided.
- There is no analytics or research dataset showing where learners fail,
  abandon, guess or retain knowledge.
- Previous completion data would have been contaminated by the answer-order and
  prompt-leakage defects.

**Impact**

Code correctness and content volume do not establish teaching effectiveness.
The product may be useful, but that conclusion cannot be measured from the
available evidence.

**Required validation**

Run a small structured learner study only after the revised assessment paths
have been live long enough to trust. Use pre-test, guided use, immediate
post-test and delayed test with at least some questions not seen in Fermata.

### R-05, P1: mobile first load remains too heavy

**Current Lighthouse snapshot**

| Profile | Performance | FCP | TBT | CLS | Recorded LCP* | Transfer |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 60 | 5.32 s | 50 ms | 0 | 17.17 s | 3.24 MB |
| Desktop | 79 | 1.11 s | 61 ms | 0.00014 | 3.15 s | 3.24 MB |

\*Lighthouse emitted `NO_LCP`; treat the exact LCP values as noisy.

The improvement is real in payload terms: the original audit measured about
4.82 MB mobile, while the rerun measured 3.24 MB, a reduction of approximately
1.58 MB or 32.8%.

The remaining transfer is dominated by:

- 30 piano sample requests: approximately 2.02 MB
- VexFlow JavaScript: approximately 692 KB transferred
- Main application JavaScript: approximately 140 KB transferred

Lighthouse also estimated about 135 KB of unused JavaScript.

**Required work**

Do not preload the full selected sample bank before user intent. Load a small
core octave or use the synth immediately, then fill the sample cache after
interaction or during truly idle time. Keep VexFlow out of the initial path
until notation is visible.

### R-06, P1: European Portuguese is structurally present but editorially unfinished

**Evidence**

- Of 29 PT content files sampled, 14 contain zero Portuguese diacritic
  characters and 18 contain three or fewer.
- Files such as `curriculumL2.ts`, `exercisesL9.ts` and `templatesL9.ts` contain
  systematic unaccented prose: `armacoes`, `Circulo`, `funcoes`, `musica`,
  `direcao`, `harmonica`, `proxima`, and similar forms.
- The original common-tone semantic error in PT and ES Level 4 is fixed.
- Automated parity checks prove the overlay structure and current configured
  answers, not publication-quality language.

**Impact**

Portuguese users receive content that reads like accent-stripped draft text.
That is especially damaging in an educational product that depends on
precision and authority.

**Required release gate**

Complete native PT-PT and Spanish editorial review with music-theory expertise,
then keep semantic corpus checks for every configured correct answer.

### R-07, P2: accessibility remains below a conformant release bar

Lighthouse scored 96 on both profiles but reported:

- `color-contrast`: 16 affected nodes in the mobile snapshot and 46 in desktop
- `label-content-name-mismatch`: 19 affected nodes in mobile and 18 in desktop

Examples include the language selector, muted scale text, inactive instrument
and octave tabs, scale-degree controls, chord cards, search control and Circle
of Fifths controls.

The interface has good structural foundations: landmark, skip link, main
content, keyboard roles and negligible layout shift. The remaining failures are
repeated design-system issues, not isolated typos.

**Required work**

Raise muted foreground tokens to WCAG AA, ensure active accent combinations
meet contrast at small sizes, and make visible control text a substring of its
accessible name. Add axe checks to component and E2E suites.

### R-08, P2: static client failures remain operationally invisible

Vercel reported no runtime error clusters during the sampled seven-day window.
That is not proof of an error-free client: Fermata is a static application and
has no client-side error reporting. Lazy-chunk, storage, audio and browser-only
failures will not appear in Vercel function logs.

For personal use this can be acceptable. For external users, add a privacy-
appropriate client error channel with release version, route and coarse device
context, without collecting musical activity or personal data by default.

### R-09, P2: maintenance warnings remain

- `npm audit` reports seven development/build-chain advisories: five high and
  two low.
- `npm audit --omit=dev` reports zero known production dependency
  vulnerabilities.
- Build output warns that chunks exceed 500 KB.
- Browserslist compatibility data is approximately six months old.
- Coverage has no enforced thresholds.

These are maintenance tasks, not evidence of an active production compromise.

## Verification evidence

### Source and deployment parity

- Local branch: `main`
- Local HEAD: `c5614b7ca6582f4793d0db04e337adf2231dab93`
- `origin/main`: exact same commit
- Vercel production target: READY
- Vercel production commit: exact same commit
- Vercel aliases include `fermata-music.vercel.app`
- No environment files were found in the repository

### Production response and PWA

Live root, manifest and service worker returned HTTP 200.

The root response includes:

- restrictive Content Security Policy
- HSTS with subdomains and preload
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- restrictive camera, microphone and geolocation permissions policy

The manifest declares standalone display, 192 px and 512 px icons and a Drill
shortcut to `/?view=drill`.

### Automated gates

| Gate | Result |
|---|---|
| ESLint | Pass |
| Forced TypeScript build | Pass |
| Production build | Pass |
| Vitest | 93 files, 5,656 passed |
| Playwright | 13 passed, Chromium |
| Music engine audit | 1,550 checks, 0 failures, 4 informational cases |
| Authored exercise audit | 385 scanned, 0 findings |
| Generated exercise audit | 1,084 combinations, 0 findings |
| Production dependency audit | 0 vulnerabilities |
| Full dependency audit | 7 development-chain advisories |

### Coverage

| Measure | Result |
|---|---:|
| Statements | 66.48% |
| Branches | 55.46% |
| Functions | 65.23% |
| Lines | 67.95% |

Coverage is not a release gate because thresholds are absent and the command
still succeeds after its `usePWA.ts` exclusion parse error.

### Browser journeys independently reproduced

1. **Level 9 audio**
   - Open Learn → Level 9 → Pitch and Interval Training → Pitch Matching and
     Direction.
   - The first deterministic exercise asked the learner to listen and identify
     a pitch.
   - Autoplay scheduled one audio buffer source.
   - Replay scheduled a second audio buffer source.
   - No page errors, console errors or failed requests occurred.

2. **Failed exercise payload**
   - Block both Level 1 exercise/template chunks.
   - Open The Staff and Clefs.
   - Error and Try Again are visible.
   - Marking the two practice tasks does not expose module completion.

3. **Fresh offline Drill**
   - Open the production build in a new profile.
   - Wait for active service worker and precache.
   - Go offline and navigate to `/?view=drill`.
   - Drill renders and the view error boundary does not.

4. **Backup round trip**
   - Seed valid preference, Learn progress and Drill store envelopes in an
     isolated browser profile.
   - Export from the Backup menu.
   - Clear the three keys.
   - Import the file and accept reload.
   - All three keys return; Learn and Drill payloads are exact and the
     preference language is retained.

5. **Responsive structure**
   - At 390 × 844 CSS pixels, document and body widths remain 390 px.
   - No horizontal overflow occurs.
   - No page or console errors occur.

## What is now genuinely strong

- The assessment-order defect and direct note-answer leakage are fixed with
  corpus-level regression tests.
- Level 9 now contains actual auditory stimuli across five modes rather than
  silent prompts that merely say “listen.”
- Dynamic exercise loading now fails closed instead of deleting the assessment
  requirement.
- The manifest's Drill shortcut now works offline on a fresh profile.
- Progress has a visible, versioned export/import route.
- Production is exactly traceable to the audited Git commit.
- Engine, authored-content and generated-content audits all pass.
- The full unit and browser suites pass.
- The runtime production dependency set has no known vulnerabilities.
- Security headers are materially stronger than a typical prototype.
- Responsive layout is coherent and does not horizontally overflow in the
  sampled mobile viewport.

These are meaningful product improvements. They justify upgrading Fermata from
“not trustworthy as a learning product” to “credible alpha with unproven
learning effectiveness.”

## Recommended next sequence

### Release gate 1: make the audio assessment path reliable

1. Fix Replay overlap using real playback completion or stop-before-replay.
2. Add component tests for note, interval, harmonic interval, chord, scale and
   progression audio.
3. Add E2E coverage for one complete Level 9 exercise, including restricted
   autoplay behavior.

### Release gate 2: make green tests mean the learner journey works

1. Cover wrong answer, retry, correct answer, failure and completion.
2. Cover backup restore and failed-chunk completion blocking in committed E2E.
3. Fix the coverage parser error.
4. Ratchet coverage thresholds from the current baseline rather than selecting
   an arbitrary high target.

### Release gate 3: align claims with trained actions

1. Create an objective-to-assessment map for all 118 modules.
2. Narrow claims where Fermata only teaches recognition.
3. Add task-appropriate interaction only where the learning value justifies the
   complexity.

### Release gate 4: publication quality

1. Complete native PT-PT and Spanish music-editor reviews.
2. Resolve the repeated contrast and accessible-name classes.
3. Test iOS Safari, Android Chrome, Firefox and one screen-reader flow.
4. Move sample-bank loading and VexFlow off the critical first-load path.

### Release gate 5: establish learning evidence

1. Recruit a small set of learners at clearly defined starting levels.
2. Use unseen pre-test and post-test questions.
3. Repeat a subset after a delay to test retention.
4. Record failure patterns and revise content before making outcome claims.

## Final product judgment

Fermata is now a solidly engineered music-theory application and a plausible
self-study alpha. The original audit's worst defects are resolved.

It is not yet a “really solid learning product” in the stronger sense. That
requires reliable coverage of the new audio path, objective-to-assessment
alignment, publication-quality language and accessibility, lighter mobile
loading, and evidence that learners retain and transfer what they practice.

The correct next move is not more curriculum volume. It is to make the existing
learning loop observable, testable and pedagogically defensible.
