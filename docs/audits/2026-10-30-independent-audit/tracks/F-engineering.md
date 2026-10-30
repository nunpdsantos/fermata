<!-- Saved by main session from the agent's SubagentHandback (agent Write was blocked by harness) -->
## Summary

I couldn't write `findings.md`: the harness blocks subagents from writing report files. The full findings document is below the summary; save it verbatim to `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/F-engineering/findings.md` if a file is needed. All logs, scripts and probes are already in that folder.

**Gates:** all pass except the full audit and a flaky test.

| Command | Exit |
|---|---|
| `npx tsc -b --force` | 0 |
| `npx vitest run` | 0 (5,670 tests in 95 files) |
| `npm run lint` | 0 (0 errors, 0 warnings) |
| `npm run build` | 0 (main bundle warning: 514 kB over the 500 kB limit; VexFlow 1,128 kB) |
| `npm audit --omit=dev` | 0 (no issues) |
| `npm audit` (full) | 1 (22 advisories, all in development tools) |
| `npx playwright test` | 0 (11 passed, 1 flaky, 3 PWA tests skipped) |
| Learn E2E repeated 6× without retries | 1 (failed 2 of 6) |
| PWA E2E against a production preview | 0 (5/5) |
| Coverage run | 0 (thresholds met by about 1–2 points; CI never checks them) |

**The live site is running the current code.** Its files are byte-identical to my build of `228f541`, and `vercel inspect` shows it was deployed 3 seconds after that commit.

**Counts:** 1 S1, 8 S2, 17 S3. Labels: 23 verified, 2 inferred, 1 verified-partial.

**Top 5:**
1. **F-01 (S1):** in ear training, answering before the sound finishes leaves the next question silent. My test reproduced it (4 chords played instead of 8).
2. **F-02 (S2):** scale, arpeggio and progression playback can't be stopped and stacks up if Play is pressed again. The stop functions are never called.
3. **F-03 (S2):** a quick piano tap while audio is still starting up leaves the note sounding and the key shown as pressed. Reproduced in a test.
4. **F-04 (S2):** the Portuguese and Spanish song descriptions never appear. The translation files aren't in the shipped app at all.
5. **F-05 (S2):** on the default light theme, Drill's right/wrong feedback, exercise hints and review headings are close to unreadable (contrast 1.1–2.5:1, against a 4.5:1 minimum).

One process note: I briefly created a probe file in `src/` by mistake and deleted it about 2 seconds later. `git status` shows only the existing `package-lock.json` change.

=====

# findings.md (full content)

# Fermata audit, track F: engineering health and UX-from-code

Auditor: Claude Opus 5.5 (agent F). Date: 2026-10-30. Repo HEAD `228f541` (local `main` == `origin/main`).
Paths are relative to `/Users/nunosantos/Documents/Base/Music/new_music_app` unless absolute.
`$A` = `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/F-engineering` (all logs, scripts and probes).

## Gate results

| Command | Exit | Key output | Log |
|---|---|---|---|
| `npx tsc -b --force` | 0 | 3.4 s. `tsc -p tsconfig.app.json --listFilesOnly` lists 444 `src/` files. Known positive (`const x: number = "s"`) gives TS2322, exit 2 | `$A/gate-tsc.log` |
| `npx vitest run` | 0 | 95 files, 5,670 tests passed (CLAUDE.md still says 5,656 / 93) | `$A/gate-vitest.log` |
| `npm run lint` | 0 | 365 files linted (353 in `src/`), 0 errors, 0 warnings. Known-positive hex literal via `--stdin` is flagged by `no-restricted-syntax` | `$A/gate-lint.log`, `$A/eslint.json` |
| `npm run build` | 0 | Warning "Some chunks are larger than 500 kB": `index-ekhSVtmO.js` 513.94 kB (gzip 134.99), `vexflow-Dq7MFmvV.js` 1,128.46 kB (gzip 690.98). PWA precache: 23 entries, 1,390.96 KiB | `$A/gate-build.log` |
| `npm audit --omit=dev` | 0 | 0 vulnerabilities. Same result for the committed lockfile (`$A/gate-audit-prod-committed.log`) | `$A/gate-audit-prod.log` |
| `npm audit` (full) | 1 | 22 vulns (6 low, 6 moderate, 10 high) on the working-tree lockfile. Committed lockfile: 24 (7 low, 6 moderate, 11 high) | `$A/gate-audit-full.log`, `$A/gate-audit-full-committed.log` |
| `npx playwright test` (default config: dev server, retries 1) | 0 | 11 passed, **1 flaky**, **3 skipped** (every PWA spec skips itself on the dev server) | `$A/gate-playwright.log` |
| Learn E2E repeated ×6, `--retries=0` | 1 | `learn-exercise.spec.ts` failed 2/6, same step | `$A/pw-flaky.log` |
| `e2e/pwa.spec.ts` against `vite preview` (scratch config `$A/pw.preview.config.mjs`) | 0 | 5/5 passed, including "Drill opens offline" | `$A/gate-playwright-preview-pwa.log` |
| `npx vitest run --coverage` (report to `$A/coverage`) | 0 | 69.16 / 60.21 / 66.88 / 70.93 % (statements / branches / functions / lines) against thresholds 68 / 59 / 65 / 69 | `$A/gate-coverage.log` |

**Lockfile note.** `package-lock.json` has an uncommitted change that isn't mine: patch bumps, e.g. `@babel/*` 7.29.0→7.29.7 and esbuild 0.28.0→0.28.1. Local builds used the working-tree `node_modules`. The live deploy, built by Vercel from the committed lockfile, is byte-identical, so the change doesn't affect what ships.

## Production parity: live site = HEAD `228f541` (verified, high confidence)

**Method 1: byte comparison.**
- `curl https://fermata-music.vercel.app/` succeeded (exit 0).
- `diff` against local `dist/index.html` gives exit 0. Same entry assets: `index-ekhSVtmO.js`, `i18next-CJIIPw1K.js`, `framer-motion-iPtzilV_.js`, `zustand-DJA_m-wR.js`, `index-DyHZo5Nl.css`.
- `cmp` of live vs local `sw.js` gives exit 0. `sw.js` embeds every precache revision.
- `cmp` of `ExploreView-DuhjDgaH.js`, `LearnView-DktiUYnc.js` and `DrillView-DrMbPa_L.js` each give exit 0.

**Method 2: Vercel CLI, read-only.**
- `vercel whoami` returns `nunpdsantos`.
- `vercel inspect fermata-music.vercel.app` shows deployment `dpl_CKXvoz45ycmTJZurUn9in4ADrf2n`: production, Ready, created Fri Jul 24 2026 13:33:41 +0100.
- `git log` shows HEAD `228f541` committed 2026-07-24 13:33:38 +0100, 3 seconds earlier.

---

## Findings

### F-01: The next ear-training question goes silent if the learner answers before the previous sound finishes
- **Severity: S1.** In ear training the audio *is* the question. A fast learner hits this in normal use on progression and scale items, which make up the "audio-first" Level 9. Replay only works once the stale lock expires.
- **Type:** bug
- **Where:** `src/components/learn/exercises/ExerciseRunner.tsx:76-133`.
  - The `playingRef` lock is held for `earPlaybackLockMs(cfg)`: 4,150 ms for a 4-chord progression, about 3,320 ms for a major scale.
  - The runner isn't remounted between exercises; only the inner `m.div` is keyed.
  - So the auto-play effect (`:134-141`) calls `playEarAudio`, which returns early while the *previous* exercise's lock is still set.
- **Evidence:** probe `$A/vt/tests/earAutoplay.test.tsx`, run in the scratch Vitest harness `$A/vt/vitest.config.mts` with the real `ExerciseRunner`, mocked audio and fake timers. Command: `cd $A/vt && npx vitest run --config $A/vt/vitest.config.mts tests/earAutoplay.test.tsx` (log `$A/vt-run3.log`).
  - Control, answering at 5 s (after the lock expires): `playChord` called 8 times. Pass.
  - Probe, answer + Submit + Continue at 2 s: `PROBE playChord calls with fast answer = 4`, then `AssertionError: expected 4 to be 8`. The second exercise never auto-played.
- **Expected vs actual:** each new exercise should auto-play its sound 300 ms after appearing. Instead it stays silent until the learner presses Replay after the old lock clears.
- **Scope:** all ear-training modes. The window is widest for progression (4.15 s) and scale (about 3.3 s) items.
- **Suggested fix:** tie the lock to the exercise (store the locked exercise id, or reset `playingRef` when `exercise` changes), and cancel the previous sound's pending `setTimeout`s on advance (see F-02).
- **Status:** verified

### F-02: Scheduled playback (scales, arpeggios, progressions) can't be stopped and overlaps when re-triggered
- **Severity:** S2
- **Type:** bug
- **Where:**
  - `src/core/services/audio.ts:238-279`: `stopPlayback` only stops FM oscillators and visual timeouts.
  - The `InstrumentVoice` interface (`:166-174`) has no stop-all method.
  - `playScale`, `playSequence` and `playArpeggioAscending` schedule every note up front through `instrumentVoice.playNote(midi, whenOffset, …)` (`:332-345`, `:737-776`).
  - The samplers create one-shot sources that nothing tracks (`src/services/pianoSampler.ts:162-169`; same pattern in `guitarSampler.ts`).
  - `ExploreView.handleQuickPlay` (`src/views/ExploreView.tsx:43-47`) doesn't check whether playback is already running.
  - `ExerciseRunner`'s progression and interval playback use bare `setTimeout`s (`:107,123`) that nothing cancels.
- **Evidence:**
  - `grep -rn "stopPlayback\|stopAllAudio\|stopAll()" src --include='*.ts' --include='*.tsx' | grep -v __tests__` returns only the definitions (`audio.ts:238,1059`, `guitarSampler.ts:189`, `pianoSampler.ts:151`, `karplusStrong.ts:416`). The app never calls them.
  - The dead-export scan `$A/dead-exports.cjs` lists `stopPlayback` and `stopAllAudio` with 0 importers. The scan was validated: `ErrorBoundary` is correctly absent and these are correctly present.
  - Once samples decode (the boot preload makes sure they do, see F-16), the sampler handles every note. So even adding a `stopPlayback()` call wouldn't silence them.
- **Expected vs actual:** Play again should restart cleanly, and leaving a view or moving to the next exercise should stop old audio. Instead sequences pile up, and the visuals drift away from the sound.
- **Scope:** Explore scale play, the chord-panel arpeggio, Circle of Fifths, ear training, Drill answer audio.
- **Suggested fix:** add `stopAll()` to `InstrumentVoice`, and make the samplers and the Karplus-Strong guitar track one-shot sources. Make `stopPlayback()` call it, and call it from play handlers, `setView`, and exercise advance.
- **Status:** verified statically (grep + code). The audible overlap is inferred from how scheduling works; I didn't listen to it.

### F-03: A quick piano tap while audio is starting up leaves the note sounding and the key stuck "pressed"
- **Severity:** S2
- **Type:** bug
- **Where:** `src/components/instruments/Piano.tsx:161-181`.
  - `handleNoteOn` records the MIDI number in `activeMidiMap` only in `.then()`, after the async `noteOn` resolves.
  - `noteOn` awaits `resumeAudio()` (`src/hooks/useAudio.ts:34-52`).
  - If the key is released first, `handleNoteOff` finds nothing and does nothing.
  - Mouse, touch (via `PianoKey`) and computer keyboard all share these handlers.
- **Evidence:** probe `$A/vt/tests/pianoQuickTap.test.tsx` renders the real `<Piano/>` with `resumeAudio` returning a pending promise, sends keydown and keyup for "a", then resolves the promise. Output (`$A/vt-run4.log`): `PROBE started= 1 stopped= 0 activeNotes after release= [60]`, then `AssertionError: expected +0 to be 1`.
- **Expected vs actual:** the release should stop the note. Instead `startSustainedNote` runs after the release, and no note-off ever follows.
  - If the FM synth fallback is active (samples not decoded yet, or offline and not cached), the piano preset holds at `sustain: 0.15` (`audio.ts:~1096`) indefinitely.
  - With samples loaded, the sample rings out, but the key stays highlighted in `activeNotes` until pressed again.
  - Knock-on in instrument-input exercises: the next press of that key doesn't register, because `InstrumentInput` only reacts to newly added notes (`InstrumentInput.tsx:34-52`).
- **Scope:** only when `ctx.resume()` actually has to wait: the first tap after load, or after the browser suspends audio (inferred: e.g. iOS backgrounding). With a running AudioContext, the awaits resolve as microtasks before `pointerup`, so normal taps are fine.
- **Suggested fix:** record a "pending note-on" synchronously (e.g. a token in `activeMidiMap` before the await), and have `noteOff` cancel or stop it once `noteOn` resolves. Alternatively, start the note synchronously and resume in parallel.
- **Status:** verified in the test harness. How often it triggers on real devices is inferred.

### F-04: Portuguese and Spanish "Songs That Use This" text is never translated (the song translations are dead code)
- **Severity:** S2
- **Type:** bug (i18n)
- **Where:**
  - `src/components/learn/ModuleView.tsx:121,343-351` renders `getSongReferences(module.id)` directly, which is the English source (`src/data/songReferences.ts:187`).
  - `loadSongOverlay` (`src/i18n/content/overlayLoader.ts:102`) and `applySongOverlay` (`src/i18n/content/contentResolver.ts:172`) are never called outside tests.
  - The PT and ES `songs.ts` translation files, described as "100% complete" in CLAUDE.md, are never included in the shipped app.
- **Evidence:**
  - `grep -rn "loadSongOverlay\|applySongOverlay" src` (excluding tests) finds only the definitions.
  - `grep -l "Escrita predominantemente na clave de sol" dist/assets/*.js` gives exit 1: the first PT song description (`src/i18n/content/pt/songs.ts:17`) is in no chunk.
  - Known positive: the PT curriculum string "Notação" is found in `dist/assets/curriculumL1-B7LijCy8.js` and other chunks.
  - `ls dist/assets | grep -i song` gives exit 1.
- **Expected vs actual:** PT and ES users should see the translated description under each song. They always see English.
- **Scope:** about 70–80 song entries (L1–L3 plus `l4u14m2`), in both PT and ES.
- **Suggested fix:** load `loadSongOverlay(language)` in `ModuleView` (or in the level loader) and pass the result through `applySongOverlay`. Add a test that renders a module in PT and checks for the PT text.
- **Status:** verified

### F-05: On the default light theme, feedback and status text uses dark-theme colours at 1.1–2.5:1 contrast
- **Severity:** S2
- **Type:** accessibility. This is a legibility problem for everyone, not only low-vision users.
- **Where:** all of these render on the default cream "fermata" theme.
  - Drill feedback titles: `text-emerald-300`, `text-red-300`, `text-amber-300`, with `-400` icons (`src/components/drill/FeedbackStrip.tsx:30-39`).
  - Exercise hint: `text-amber-400/80` (`src/components/learn/exercises/ExerciseFeedback.tsx:93`).
  - "Review Queue" and "All caught up!" headings: `color: AMBER` (`#FBBF24`) in `src/components/learn/ReviewQueue.tsx:83,109`.
  - "Complete" chips: `text-emerald-400` in `UnitCard.tsx:61`, `ModuleView.tsx:176,181`, `ModuleRow.tsx:33`.
- **Evidence:**
  - `node $A/contrast.mjs` (sanity check: black on white gives 21.00). Output `$A/contrast.txt`: amber on the card colour 1.32:1, emerald-400 1.52:1, the palette's accent blue 2.01:1. The same colours on the night theme score 5.9–9.7:1.
  - I took Tailwind's actual colour values (OKLCH) from the built CSS and converted them with `$A/oklch-contrast.mjs` (sanity: white has luminance 1.000). Against the cream background: emerald-300 1.32, red-300 1.68, amber-300 1.26, amber-400 1.50.
  - A scan of the built CSS finds exactly one rule per colour class, so no theme-specific override exists.
  - Also below the 4.5:1 minimum for small text:
    - light theme: `--text-dim` (used 123 times, mostly for 10–11 px text) at 3.15–3.85:1
    - night theme: piano key labels at 2.23:1, white text on accent buttons at 3.03:1
- **Expected vs actual:** body and small text should reach 4.5:1 (WCAG AA). As it stands, Drill's right/wrong feedback and the retry hint are nearly invisible on cream.
- **Scope:** Drill feedback, Learn feedback and hints, the review queue, completion chips, and coloured text in general.
- **Suggested fix:** add darker text colours for the light theme (e.g. `--success-text`, `--warning-text`, `--danger-text` using the 700/800 shades) and use them for text. Keep the 300/400 shades for the dark theme and for fills.
- **Status:** verified by computation. I didn't screenshot every state.

### F-06: Tap targets on a phone are far below 24 px, including the main Explore / Learn / Drill tabs
- **Severity:** S2
- **Type:** accessibility / UX
- **Where:** view tabs in `src/components/layout/TopBar.tsx`; octave tabs in `Piano.tsx`; position chips in `src/components/instruments/FretboardPositionSelector.tsx:22-23` (`text-[10px] px-2 py-0.5`); open-string buttons in `FretboardString.tsx`; breadcrumb and back button in `UnitDetail.tsx:40-62`.
- **Evidence:** Playwright probe at 390×844 with touch (`$A/e2e-a11y/a11y.spec.mjs`, log `$A/probe-a11y.log`, exit 0). Measured sizes:
  - Explore / Learn / Drill tabs: 58×19, 48×19, 41×19
  - octave tabs C0–C8: 28×19
  - guitar "All" and "Pos 1 (E)" chips: 21 px tall
  - open-string targets: 40×20
  - breadcrumb "Learn" and "Level 1": 31×15 and 38×15
  - unit-page back button: 14×14
  - toast dismiss button: 22×22
- **Expected vs actual:** at least 24×24 (WCAG 2.2 AA 2.5.8), ideally about 44 px for a phone-first Drill. The sizes are as measured above.
- **Scope:** every screen on a phone. Drill's home screen is least affected (only the top tabs).
- **Suggested fix:** add `min-h-[44px]` (or padding) on touch layouts for the view tabs, octave tabs, position chips, breadcrumb and back button. Extra tap padding lets the visual size stay as it is.
- **Status:** verified

### F-07: When a screen fails to load, its "Try again" button can never recover
- **Severity:** S2
- **Type:** bug
- **Where:** `src/App.tsx:22-37,49-51,108-112`.
  - Each view is loaded on demand (`React.lazy`).
  - The error screen's "Try again" calls `ErrorBoundary.handleReset`, which just re-renders the same lazy component.
  - React remembers the failed download and never retries it.
- **Evidence:** probe `$A/vt/tests/lazyRetry.test.tsx` uses the repo's real `ErrorBoundary` and a loader that fails once, then succeeds. Output (`$A/vt-run2.log`): `PROBE import factory calls = 1 ; VIEW OK visible = false ; Try again visible = true`.
- **Expected vs actual:** "Try again" should retry the download (e.g. after reconnecting). It does nothing; only a full reload helps.
- **Scope:** Explore, Learn and Drill whenever a file download fails: offline before it was cached, a flaky connection, or a 404 for an old file name after a deploy. Live check: requesting an old file name returns `old-hash-probe http=404`.
- **Suggested fix:** make the loader retryable (recreate the `lazy()` on reset via a key or counter), or have the view's error screen do `location.reload()` when the error is a failed download.
- **Status:** verified. The test copies App's structure with the real ErrorBoundary; not reproduced in a browser.

### F-08: App updates reload the page without asking, and the "new version" prompt can never appear
- **Severity:** S2
- **Type:** bug / UX (risk)
- **Where:** `vite.config.ts:10` (`registerType: 'autoUpdate'`), `src/hooks/usePWA.ts:15-22,34`, `src/components/layout/PWAPrompts.tsx:12-18`.
- **Evidence:**
  - In the PWA plugin's client code (`node_modules/vite-plugin-pwa/dist/client/build/register.js`), auto mode does `wb.addEventListener("activated", (event) => { if (event.isUpdate || event.isExternal) window.location.reload(); })`. The `onNeedRefresh` callback is only wired in the non-auto branch.
  - `dist/sw.js` contains `skipWaiting`, `clientsClaim` and `cleanupOutdatedCaches` (once each).
  - `grep -n "registration.update\|\.update()\|setInterval" src/hooks/usePWA.ts src/main.tsx` gives exit 1: the app never checks for updates periodically.
  - The `updateSW(true)` call in the cleanup does nothing in auto mode.
- **Expected vs actual:** after a deploy, the app should either ask before reloading or reload only at a safe moment. Instead:
  - The page reloads by itself a few seconds after launch, once the new version has downloaded (about 1.39 MB). That can interrupt a Learn exercise set in progress: the set's state is in memory only, though each answered exercise's result is kept. Drill sessions are saved (`drillStore.ts:316`), so Drill resumes.
  - The "new version" toast and its `pwa.newVersion` text can never appear.
  - An installed app left open for days never checks for updates until it's relaunched.
- **Can an installed app get stuck on an old build?** No permanent stuck state found. `sw.js` is served with `max-age=0, must-revalidate`, the update-on-launch check works, and old caches are cleaned up. At worst the app is out of date until the next launch.
- **Scope:** installed-app users, most visibly right after Nuno deploys and opens the app to check.
- **Suggested fix:** switch to `registerType: 'prompt'` (the toast UI already exists), or keep auto-update but delay the reload until no exercise is active. Also call `registration.update()` when the app comes back to the foreground (`visibilitychange`).
- **Status:** mechanism verified from the plugin source and `sw.js`. How often it interrupts a session is inferred.

### F-09: CI never builds, never runs the browser tests, never checks coverage, and the offline tests always skip by default
- **Severity:** S2
- **Type:** test gap
- **Where:**
  - `.github/workflows/audit.yml` runs lint, `tsc -b --noEmit`, `npm run test` and the three content audits. There's no `npm run build`, no Playwright, and no coverage run.
  - The thresholds in `vitest.config.ts:33-41` only apply when run with `--coverage`.
  - `playwright.config.ts:17-22` always tests the dev server, where `e2e/pwa.spec.ts:16,43,65` skip themselves.
- **Evidence:**
  - Default run (`$A/gate-playwright.log`): "3 skipped".
  - The same specs against a production preview (`$A/pw.preview.config.mjs`): 5/5 passed, exit 0. They work; they just never run.
  - Coverage run: thresholds pass by 1.2 / 1.2 / 1.9 / 1.9 points (`$A/gate-coverage.log`). Nothing would catch a drop.
- **Expected vs actual:** the tests protecting the lessons documented in CLAUDE.md (CSP fonts, the offline Drill shortcut, the offline file list) should run on every push. Today they only run if someone remembers to.
- **Scope:** failures that only appear in a production build (offline file-list drift, chunk naming), offline regressions, and coverage slipping.
- **Suggested fix:** add CI steps for `npm run build` and `npx vitest run --coverage`, and run Playwright with a second config using `vite preview` for `pwa.spec.ts`.
- **Status:** verified

### F-10: The Learn browser test is flaky (fails 2 of 6 without retries); cause found
- **Severity:** S3
- **Type:** test gap
- **Where:** `e2e/learn-exercise.spec.ts:9-28`, together with `src/views/LearnView.tsx:187` (`AnimatePresence mode="wait"`) and `src/components/learn/LevelDetail.tsx:110-117`.
- **Evidence:** `$A/pw-flaky.log` shows 2 failed / 22 passed, both at `getByText('Exercises')`. A click-logging probe (`$A/e2e-flaky/click-probe.spec.mjs`, log `$A/flaky-probe.log`) shows what happened in the failing run:
  - The test's "click the module" landed 315 ms after the unit click on `CONTINUE | The Staff and Clefs | Level 1 · …`.
  - That's the Level page's Continue banner, still on screen and clickable while it animates out.
  - It matches the test's text filter (`hasText: 'The Staff and Clefs'`), and clicking it opens the *unit*, so the test ends on the unit list.
- **Expected vs actual:** the test should be deterministic. It fails about 33% of the time without retries, hidden by `retries: 1`.
- **Suggested fix:** narrow the locator to the unit's module list (or wait for the Level page heading to disappear). Also set `pointer-events: none` on screens that are animating out in LearnView, which stops real double-taps hitting the outgoing screen too.
- **Status:** verified

### F-11: The Level page's "Continue" banner names a module but opens the unit
- **Severity:** S3
- **Type:** UX
- **Where:** `src/components/learn/LevelDetail.tsx:115` uses `onClick={() => onOpenUnit(nextUp.unit.id)}`, while the same banner on the overview (`src/components/learn/LevelsOverview.tsx:149`) uses `onOpenModule(...)`.
- **Evidence:** code; the click probe above shows the banner reads "CONTINUE · The Staff and Clefs".
- **Expected vs actual:** "Continue → The Staff and Clefs" should open that module, as the overview's banner does. It opens the unit list, which needs another tap.
- **Suggested fix:** pass `onOpenModule` into LevelDetail and use it for the banner.
- **Status:** verified

### F-12: The review queue shows English times, intervals and level titles in Portuguese and Spanish
- **Severity:** S3
- **Type:** bug (i18n)
- **Where:**
  - `src/services/spacedRepetition.ts:126-147`: `formatNextReview` and `getIntervalLabel` return English text, which `src/components/learn/ReviewQueue.tsx:62,87,125-126,159` inserts into translated sentences.
  - `levelMeta?.title` comes from the untranslated `LEVEL_METADATA`.
  - A `review.dueNow` translation key exists but is unused.
- **Evidence:** probe `$A/vt/tests/reviewQueuePT.test.tsx` (`$A/vt-run2.log`):
  - PT, review due: `"Fila de Revisão1Nível 1 · Unidade 1 · Módulo 1Foundations of Music Literacy · Intervalo: 1 weekDue now"`
  - PT, all caught up: `"Tudo em dia!Próxima revisão In 4 days"`
- **Also:** each review row is labelled "Level 1 · Unit 1 · Module 1" instead of the module's name, so the learner can't tell what they're reviewing without opening it.
- **Suggested fix:** move these strings into the translation files (e.g. `t('review.inDays', {count})`), use `translateLevelMetadata` for titles, and show the module name.
- **Status:** verified

### F-13: Other English text hard-coded into the interface
- **Severity:** S3
- **Type:** bug (i18n)
- **Evidence:** code scans `node $A/i18n-scan.cjs` and `node $A/i18n-scan2.cjs`, which found the known positive `Tuning:`. Output in `$A/i18n-scan.txt` and `$A/i18n-scan2.txt`.
- **Visible text:**
  - `src/components/instruments/Fretboard.tsx:493`: `Tuning:` (desktop only; the mobile version is translated).
  - Circle of Fifths hover text, e.g. "Closely related · 6 shared notes" (`DISTANCE_LABELS`, `src/components/theory/circleOfFifthsConstants.ts:111-119`, shown at `CircleOfFifths.tsx:345`).
  - The backup import confirmation inserts English section names ("preferences / learn progress / drill progress", `src/utils/backupHelpers.ts:89-95`) into the PT and ES sentence.
  - `ErrorBoundary.tsx:75`: "An unexpected error occurred."
- **Screen-reader-only labels:**
  - `Toast.tsx:79` "Dismiss"
  - `QuickSearch.tsx:124` "Quick search"
  - `ChordGrid.tsx:40,72`
  - `ScaleDegreeBar.tsx:34,76`
  - `ChromaticStrip.tsx:77`
  - `CircleOfFifths.tsx:231,283` ("major" / "minor")
  - `FretCell.tsx:98` ("fret N, string N")
  - `App.tsx:106` ("explore view")
  - `RootQualityChips.tsx:59,107`
- **Not counted:** scale and chord names in the key selector. CLAUDE.md records the owner's convention of leaving music nomenclature untranslated.
- **Suggested fix:** add these to the EN, PT and ES files, plus a test that renders key screens in PT and fails if listed English interface words appear.
- **Status:** verified

### F-14: Changing key throws away the selected guitar scale position, even though positions don't depend on the key
- **Severity:** S3
- **Type:** UX
- **Where:**
  - `src/state/slices/musicSlice.ts:12`: `setKey` resets `guitarScalePosition: null`.
  - `src/core/constants/guitarScalePositions.ts:3016-3028`: `getScalePositions` returns a fixed list per scale type in a fixed order; only `baseFret` changes with the key.
- **Evidence:** code read. Position *i* is the same CAGED shape (e.g. "Pos 2 (D)") in every key of a given scale type. Resetting on scale change (`:14`) makes sense because the list differs; resetting on key change doesn't.
- **Expected vs actual:** a guitarist practising "Pos 2" should be able to step through keys and stay in Pos 2. Every key change snaps back to "All".
- **Suggested fix:** remove `guitarScalePosition: null` from `setKey`. Keep the `?? null` safety check in `Fretboard.tsx:88`.
- **Status:** behaviour verified. Whether Nuno wants the position kept is his call.

### F-15: An unlabelled icon button, and position chips that misuse tab roles
- **Severity:** S3
- **Type:** accessibility
- **Where:**
  - `src/components/learn/UnitDetail.tsx:40-54`: the back button is an icon with no `aria-label`. The probe found it as `button "" 14x14`, the only unlabelled control across the five screens checked.
  - `FretboardPositionSelector.tsx:51-95`: the chips use `role="tablist"` / `"tab"` but have no `tabpanel` and no arrow-key handling (no `onKeyDown` in the file). They behave as toggle buttons, so they should be `aria-pressed` buttons or a radiogroup.
  - `FretboardPositionSelector.tsx:52,73`: the label uses `text-zinc-500` (a dark-theme shade) on cream.
- **Evidence:** `$A/probe-a11y.log` and code.
- **Checked and fine:** Quick Search. It is marked as a modal (`aria-modal="true"`), Tab keeps focus inside it, and Escape returns focus to the trigger.
- **Suggested fix:** add `aria-label={t('common.back')}` to the back button, and change the chips' roles.
- **Status:** verified

### F-16: The first visit downloads about 3 MB the user may never need
- **Severity:** S3
- **Type:** performance
- **What downloads:** all 30 piano samples before any tap; VexFlow with five music fonts; and all nine curriculum levels as soon as Learn opens.
- **Where:**
  - `src/services/instrumentVoices.ts:89-99` starts `preloadFor(current)` when the browser is idle (`requestIdleCallback`), so all 30 Salamander mp3s load at startup. The file's own header (`:13-16`) and `pianoSampler.ts:9-11` still say loading starts on the "first user gesture".
  - `src/utils/vexflowLoader.ts:10` imports `vexflow`, the build containing all fonts.
  - `src/components/learn/LevelsOverview.tsx:38-41` calls `loadAllLevels(language)`, loading all nine levels just to work out the Continue banner.
- **Evidence:** Playwright probe on the preview build (`$A/e2e-console/console.spec.mjs`, logs `$A/probe-console.log` and `$A/probe-console2.log`):
  - `samples(before any interaction)= 30`
  - on the default Explore screen, the fonts Bravura, Academico (×2), Gonville, Petaluma and Petaluma Script all show `loaded`
  - opening Learn: `LEARN overview curriculum chunks fetched: 9`
  - first 6 s: 45 requests, 4,117 KiB on disk (piano samples 1,966, VexFlow 1,102, other JS 706, fonts 293)
- **Measured saving:** I bundled `vexflow` and `vexflow/bravura` with esbuild. The installed vexflow 5.0.0 offers both entry points (`[".","./core","./bravura"]`).
  - `vexflow`: 1,109 KiB (674 KiB gzipped)
  - `vexflow/bravura`: 718 KiB (380 KiB gzipped)
  - So the Bravura-only entry saves about 294 KiB gzipped.
- **Suggested fix:**
  - Preload samples on the first tap or key press (or the first Play), as the comments already intend.
  - Try `import('vexflow/bravura')` and check the notation by eye.
  - Use a static module index for the Continue banner instead of loading all nine levels; `src/data/moduleIndex.ts` already exists.
- **Status:** measurements verified. Whether the trade-off matters on Nuno's connection is his call.

### F-17: The main bundle is over the 500 kB warning, and about 20% of it is guitar data piano users never use
- **Severity:** S3
- **Type:** performance
- **Where:** `src/components/layout/AppShell.tsx:4-5,75` imports both `Piano` and `Fretboard` up front. The guitar data lives in `src/core/constants/guitarScalePositions.ts` and `guitarChordShapes.ts`.
- **Evidence:** sourcemap breakdown via `node $A/bundle-composition.mjs $A/dist-sm/assets/index-ekhSVtmO.js` (scratch sourcemap build, exit 0; output `$A/bundle-composition.txt`). Of 512,869 bytes:
  - `guitarScalePositions.ts`: 62,671 B
  - `guitarChordShapes.ts`: 43,307 B
  - `moduleIndex.ts`: 15,902 B, only needed for Cmd+K search
  - chord and scale parsers: about 29.8 kB, search only
  - react-dom: about 242 kB
- **Suggested fix:** load the Fretboard (with its data) and Quick Search on demand (`lazy()`). That takes about 150 kB off startup and clears the build warning.
- **Status:** verified

### F-18: The unused "Inter" font is still preloaded and stored for offline use
- **Severity:** S3
- **Type:** performance / cleanup
- **Where:** `index.html` has `<link rel="preload" href="/fonts/inter-latin.woff2">`. `src/index.css:5-20` declares Inter, but both font settings (`--font-sans` and `--font-serif`) point to "Source Serif 4" (`index.css:113-114,150-151`), and the Tailwind theme defines no font.
- **Evidence:**
  - In the browser, `document.fonts` still shows both Inter faces as `unloaded` after 6 s, yet the request log includes `/fonts/inter-latin.woff2`.
  - `dist/sw.js` stores `inter-latin` (48,432 B) and `inter-latin-ext` (85,272 B) for offline use.
  - The built CSS mentions `font-family:Inter` only in its two font declarations.
- **Suggested fix:** remove the Inter declarations, the preload and the files, or point the preload at `source-serif-4-latin.woff2`, which is actually used.
- **Status:** verified

### F-19: The app's versioned files aren't cached long-term by the browser
- **Severity:** S3
- **Type:** performance
- **Where:** `vercel.json`, which only sets security headers (CSP etc.).
- **Evidence:** `curl -sSI https://fermata-music.vercel.app/assets/index-ekhSVtmO.js` returns `cache-control: public, max-age=0, must-revalidate`.
- **Expected vs actual:** files under `/assets/` have a content hash in their names, so they can be cached for a year: `public, max-age=31536000, immutable`. As served, the browser re-checks each file with the server on every launch when the service worker doesn't answer. `must-revalidate` may also stop browsers using a cached copy when offline.
- **Suggested fix:** add a header rule for `/assets/(.*)`. Per the CLAUDE.md gotcha, pair it with a content change in `index.html` so installed apps pick it up.
- **Status:** verified

### F-20: The night theme flashes the light theme on launch; the browser bar colour is wrong; `class="dark"` is leftover
- **Severity:** S3
- **Type:** UX
- **Where:**
  - `src/hooks/useTheme.ts:22-31` applies the night theme in `useEffect`, i.e. after the first paint.
  - `index.html` has `<html class="dark">`; no CSS refers to `.dark` (0 occurrences in the built CSS).
  - `<meta name="theme-color" content="#0a0a12">` matches neither theme (`#f5efe2` and `#181208`).
- **Evidence:** code, plus the count in the built CSS.
- **Suggested fix:** add a tiny inline script that applies the saved theme and bar colour before the first paint. It needs a CSP hash, since `script-src 'self'` blocks inline scripts. Alternatively, default to the system's light/dark setting. Remove `class="dark"`.
- **Status:** code verified. I didn't measure how long the flash lasts.

### F-21: Security advisories in development tools, and an unused package (`sharp`) carrying "high" advisories
- **Severity:** S3
- **Type:** security
- **Where:** `package.json` devDependencies.
- **Evidence:**
  - `npm audit` exits 1 with 22 advisories (working tree) or 24 (committed lockfile), in `vite` 7.0.0–7.3.6 (dev-server issues), `vitest` / `@vitest/mocker`, `sharp` (CVEs in its image libraries), `undici`, `brace-expansion` and `js-yaml`.
  - Production-only audit (`--omit=dev`): 0.
  - `sharp` is imported nowhere: `bash $A/dep-usage.sh` gives grep exit 1 (the known-positive `vexflow` import is found). It has been there since the initial commit `2ff5f5f`.
  - `@vitest/ui` isn't used by any script.
- **Risk:** the local development machine only; nothing that ships is affected.
- **Suggested fix:** remove `sharp` (and `@vitest/ui` if unused), then run `npm audit fix` (non-breaking for the rest).
- **Status:** verified

### F-22: Documentation and code comments have drifted from the code
- **Severity:** S3
- **Type:** cleanup
- **Where:**
  - CLAUDE.md says "Guitar sound = Karplus-Strong … untouched by the sampler work". The code actually uses sampled FreePats guitar with Karplus-Strong as a fallback (`src/services/instrumentVoices.ts:33-61`, `guitarSampler.ts`). README is correct.
  - `src/state/storeTypes.ts:53-54` still says "guitar forces Karplus-Strong".
  - `instrumentVoices.ts:13-16` ("Both sample sets warm on the same first-gesture preload") contradicts `:89-91` in the same file ("Warm only the selected instrument's … first idle slot").
  - `pianoSampler.ts:9-10` says loading is "kicked off on the first user gesture"; it actually starts at idle (F-16).
  - CLAUDE.md's test counts (5,656 / 93) are out of date (actual 5,670 / 95).
  - CLAUDE.md calls the Welcome banner "unreachable", but it does appear when `loadAllLevels` fails (F-25).
- **Evidence:** code read and gate logs.
- **Suggested fix:** update the CLAUDE.md "Audio & instruments" section and the code comments.
- **Status:** verified

### F-23: Dead code left over from removed or unfinished features
- **Severity:** S3
- **Type:** cleanup
- **Evidence:** `node $A/dead-exports.cjs <repo>`, validated with a known negative (`ErrorBoundary` absent) and a known positive (`stopPlayback` present). Full list in `$A/dead-exports.tsv`. Nothing outside tests uses:
  - `stopPlayback` and `stopAllAudio` (`core/services/audio.ts`), and `stopAll` in `pianoSampler.ts`, `guitarSampler.ts` and `karplusStrong.ts`
  - `loadSongOverlay` and `applySongOverlay` (see F-04)
  - `getExercisesForModule` (`data/exerciseLoader.ts`), `getAllSongReferences` (`data/songReferences.ts`), `getLevelAccent` (`design/tokens/learnColors.ts`), `buildDescendingMidi` (`utils/midiHelpers.ts`)
  - the motion settings `SPRING_GENTLE`, `SPRING_PANEL`, `PANEL_SLIDE` and `CHIP_POP`
  - the "new version" UI path (F-08) and the `review.dueNow` translation key
  - the leftover `class="dark"`, and the `synthPreset` store field (fixed at 'piano', nothing can change it)
  - several helpers used only by tests (`isDueForReview`, `REVIEW_INTERVALS_MS`, `useIsTablet`, …)
  - 197 exported names in total, mostly types and helpers in `src/core`
- **Suggested fix:** delete them, or wire them up where intended (the song translations in F-04, the stop functions in F-02).
- **Status:** verified

### F-24: Saved settings are only partly checked, and a backup import can silently wipe progress
- **Severity:** S3
- **Type:** bug (robustness)
- **Where:**
  - `src/state/store.ts:22-54` checks only the selected key and scale, `lastView`, and that numbers are finite.
    - Not checked: `instrument`, `guitarTuningId`, `themeMode`, `colorMode`, `language`.
    - Number ranges aren't checked either; e.g. `baseOctave: 99` or `volume: 5` pass.
  - Backup import (`src/utils/backupHelpers.ts:56-86` with `TopBar.tsx:318-335`):
    - `validateBackup` checks only the file's outer structure, and `applyBackup` then overwrites the saved data.
    - The progress check (`isValidPersistedProgress`, `progressStore.ts:38-55`) is all-or-nothing. If the backup's progress section fails it, `merge` falls back to empty progress, and the next save writes that empty state.
    - By then the previous local progress has already been overwritten.
- **Evidence:** code read. Not reproduced, since backups exported by the app itself should pass the check.
- **Suggested fix:** run each store's check inside `validateBackup` before the confirmation dialog. Check allowed values and ranges in `sanitizePersistedAppState`.
- **Status:** inferred (from the code path)

### F-25: Opening Learn offline (or after a failed download) has no error handling for the Continue banner's data
- **Severity:** S3
- **Type:** bug
- **Where:** `src/components/learn/LevelsOverview.tsx:38-41`. `loadAllLevels(language).then(setAllLevels)` has no `.catch`, and isn't cancelled when the language changes. `Promise.all` (`curriculumLoader.ts:121-126`) fails if any one of the nine downloads fails.
- **Effect:**
  - An unhandled promise rejection is logged.
  - The Continue banner silently disappears.
  - A brand-new user sees the "unreachable" Welcome banner instead.
  - Switching language quickly can let the old language's result arrive last and win.
- **Evidence:** code read.
- **Suggested fix:** add `.catch(() => {})` with a cancelled flag, or use the static module index (F-16).
- **Status:** inferred

### F-26: Important behaviour has no unit tests, and coverage margins are thin
- **Severity:** S3
- **Type:** test gap
- **Evidence:** coverage summary `$A/coverage/coverage-summary.json`:
  - 0% of lines covered:
    - `src/views/LearnView.tsx` (113 lines, all of Learn's screen-to-screen navigation)
    - `src/components/learn/ReviewQueue.tsx`
    - `src/components/learn/exercises/inputs/InstrumentInput.tsx` (scale and chord building)
    - `src/components/notation/useStaffNotation.ts`
  - Low: `ModuleView.tsx` 20.6%, `overlayLoader.ts` 25%, `TopBar.tsx` 42% (theme, language and backup controls).
- **Specific gaps that let earlier findings through:**
  - quick tap / release in `Piano` (F-03)
  - next-exercise auto-play (F-01)
  - stopping and overlapping playback (F-02)
  - Portuguese rendering of the review queue and song cards (F-04, F-12)
  - where the Level page's Continue banner goes (F-11)
  - retrying a failed screen download (F-07)
  - the app-update flow (F-08); the test stub `src/test/stubs/pwa-register.ts` makes registration a no-op, so the update UI is never exercised
- **Suggested fix:** add behaviour tests for the items above; the scratch probes in `$A/vt/tests/` can be adapted directly. Add coverage to CI (F-09).
- **Status:** verified

## Improvements
These are worthwhile but not bugs. Fixes already suggested inside findings aren't repeated.
1. **Make the guitar path the light one.** Guitar is Nuno's instrument, but piano is the default, and the guitar data and samples are exactly what a guitar user needs. Returning users already get their saved instrument. Combining F-16 and F-17 with "preload only the selected instrument, on the first tap" makes the guitar path cheap.
2. **A stop button for Explore playback.** Once F-02's stop-all exists, a play/stop toggle (and stopping when the view changes) is cheap.
3. **Resume audio when the app comes back to the foreground.** Calling `resumeAudio()` on `visibilitychange` means the first tap after switching back isn't spent waiting for audio to wake up. It also shrinks the F-03 window.
4. **Save a Learn exercise set in progress.** Drill already saves mid-session. Learn's exercise runner keeps the position and score only in memory, so a reload (F-08) or accidental back-navigation restarts the set.
5. **Stable chord-shape selection.** `Fretboard.tsx:65-67` resets the selected shape after rendering (via `queueMicrotask`), so the first render after a chord change uses the previous chord's index (`chordShapes[oldIdx] ?? null`). Deriving the reset from the chord avoids the one-frame mismatch.
6. **Keep browser-test traces.** Playwright keeps traces only `on-first-retry`, and the flaky spec passes on retry, so the evidence is thrown away. Use `retain-on-failure`, and `retries: 0` locally.
7. **Name modules in the review queue.** Show module titles instead of "Level 1 · Unit 1 · Module 1" (F-12).

## Unconfirmed suspicions
- **Offline use after a single first visit may rely on the browser's own cache.**
  - After one online visit, the service worker's caches held no Explore, Learn or curriculum files; only the precache with Drill (`CACHES after first visit`, `$A/probe-offline.log`).
  - Those files load before the service worker takes control of the page, and its runtime caching only applies to pages it controls.
  - In Chromium, reopening Explore and Learn offline still worked 8/8 on production (`$A/probe-offline-prod2.log`). Presumably they came from the browser cache despite `max-age=0, must-revalidate`.
  - iOS Safari, as an installed app, is untested.
  - One early production run failed to reopen `/` offline (`ERR_INTERNET_DISCONNECTED`). With a 2.5 s settle time it passed 8/8, so I attribute that to probe timing.
- **Backup export on iOS.** `TopBar.tsx:313` releases the file's temporary URL immediately after starting the download. Some WebKit versions are reported to cancel downloads when that happens. Not tested on a device.
- **A note held while the instrument disappears.** `AppShell.tsx:33,67,75` removes the Piano or Fretboard in Drill, when the instrument is collapsed, and on instrument switch. Piano has no clean-up that releases held notes. Holding a computer key or mouse button while switching could leave a note sounding. Not reproduced.
- **iOS "interrupted" audio state.** `resumeAudio` (`audio.ts:183-189`) and the samplers only resume when the state is `'suspended'`. If a WebKit version reports a different non-running state after an interruption (e.g. a phone call), resume would be skipped. Not checked against current WebKit documentation.
- **How often F-08 interrupts a Learn exercise.** The mechanism is verified, but I didn't measure how long the update download takes on a phone, so I can't say how often a reload lands mid-set.

## Coverage

**Checked, and how**
- **Gates:** all run, with exit codes recorded in the table above, and known positives for the type-checker and linter. The PWA browser tests were also run against a production preview, and the Learn browser test was repeated 6× without retries.
- **Production parity:** byte comparison of `index.html`, `sw.js` and three screen files, plus read-only `vercel whoami` and `vercel inspect`.
- **State:**
  - every part of the main store, with its saving, upgrade and validation logic
  - the progress store
  - only an outline of Drill's saving
  - the startup-view logic (`bootView`)
  - backup import
- **Effects and race conditions:**
  - LearnView's loading logic, LevelsOverview
  - ExerciseRunner's audio and lock
  - Piano and PianoKey pointer and keyboard paths
  - Fretboard's shape reset
  - the four places where a lint rule about effect dependencies is switched off (all deliberate)
- **Audio lifecycle:** the core audio hand-off, both samplers, instrument switching, the resume paths, and every playback call site.
- **Error handling and on-demand loading:** a test-harness probe.
- **PWA and service worker:**
  - the plugin's source and the generated `sw.js`
  - checked that every one of the 96 JS files is either precached or cached at runtime (`node $A/sw-coverage.mjs dist`: none missed)
  - offline probes against both the preview and production
- **Accessibility:**
  - contrast for every theme colour in both themes, including Tailwind's colours from the built CSS
  - a browser survey of tap-target sizes and unlabelled controls on five screens at phone width (390 px)
  - Quick Search focus behaviour
  - reduced motion: handled by a global CSS rule plus `MotionConfig reducedMotion="user"` (fine)
- **Translation:** code scans of interface text and string literals, plus a Portuguese rendering probe.
- **Performance:**
  - a breakdown of what's in the main bundle
  - a count of requests and bytes on first load
  - the VexFlow entry-point comparison
  - which fonts are actually used
- **Tests and cleanup:**
  - the coverage summary, the CI workflow, and the browser tests' skip logic
  - a validated scan for unused exports, plus a check of which packages are actually imported

**Not checked, and why**
- Music-theory correctness of content and grading, the Drill question bank, and the FSRS spaced-repetition scheduling: other tracks own these. I only looked at Drill where it overlapped engineering (saving, the offline shortcut, feedback contrast).
- Real devices (iOS Safari as an installed app, Android Chrome): I have no device access. All browser evidence comes from Playwright Chromium, desktop and phone-emulated.
- Sound quality, and whether the overlaps or stuck notes are actually objectionable to the ear: an agent can't judge sound.
- A visual review of every screen in both themes: contrast was calculated, not checked screen by screen.
- The rest of `src/core/` beyond the audio service and the files mentioned above.
- Measuring how often the instrument components re-render (React Profiler not run). I read their memoisation but didn't measure it.

**Process note.** While setting up a lint known-positive I accidentally created `src/__kp_lint_probe.ts`, one line of valid TypeScript. I deleted it about 2 seconds later, and `git status` afterwards showed only the existing `package-lock.json` change. The lint count was taken before the file existed. No other repo file was touched: build output went to `dist/` (allowed), and everything else went under `$A`. The scratch test harness links `$A/vt/node_modules` to the repo's `node_modules` and keeps its own cache (`$A/vt/.vite-cache`).