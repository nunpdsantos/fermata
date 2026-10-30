<!-- Saved by main session from the agent's SubagentHandback (agent Write was blocked by harness) -->
## Verification of F-01 to F-09 (HEAD 228f541; repo untouched, `git status` shows only the pre-existing `package-lock.json` change)

My scratch files are in `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/verify/F/`. I used a separate build, tests and logs there. No edits to `src/`.

| ID | Verdict | Severity (agree / suggest) | One-line reason |
|---|---|---|---|
| F-01 | CONFIRMED | disagree / S2 | `ExerciseRunner.tsx:76-133` holds `playingRef` for `earPlaybackLockMs`. The auto-play at `:134-141` returns early while the previous lock is set. Details below. |
| F-02 | CONFIRMED | disagree / S3 | `stopPlayback` (`audio.ts:238`), `stopAllAudio` (`:1059`) and the three `stopAll`s (`pianoSampler.ts:151`, `guitarSampler.ts:189`, `karplusStrong.ts:416`) have no non-test callers. `ExploreView.tsx:43-47` doesn't guard against re-trigger. The sampler's scheduled one-shots (`pianoSampler.ts:161-169`) aren't tracked in `voices`. The effect is short overlapping or unstoppable sequences, not a stuck sound. |
| F-03 | PARTIAL | disagree / S3 | The code defect is real (`Piano.tsx:161-181`, `useAudio.ts:34-52`). In practice it only triggers when a release lands before `resume()` resolves, and I could not make that happen in Chromium. Details below. |
| F-04 | CONFIRMED | agree S2 (S3 defensible) | `ModuleView.tsx:121,343-351` renders English `getSongReferences()` directly. `loadSongOverlay` and `applySongOverlay` have zero non-test callers. Details below. |
| F-05 | CONFIRMED | agree S2 | I recomputed the ratios from the built CSS. The auditor missed the answer chips, so the real scope is wider. Details below. |
| F-06 | PARTIAL | disagree / S3 | I reran the probe and the sizes reproduce. The "fails WCAG 2.5.8" framing is overstated. Details below. |
| F-07 | CONFIRMED | agree S2 (S3 defensible) | React 19.2.4 `lazyInitializer` caches a rejected import permanently (`node_modules/react/cjs/react.development.js:478-486`), so `handleReset` re-throws the same error. `App.tsx:22-37,49-51,108-112` has no retry path. |
| F-08 | CONFIRMED | disagree / S3 | The mechanism is right. Impact is narrow. Details below. |
| F-09 | CONFIRMED | disagree / S3 | `.github/workflows/audit.yml` has no build, no Playwright and no coverage run. Details below. |

### Reruns and evidence

**F-01 (ear-training autoplay)**
- The auditor's probe imports the real `ExerciseRunner` and mocks only audio. The mocks don't create the bug. The control passes (8 chord calls); the probe fails with 4.
- Exit codes from rerunning the three auditor probes (`vt/`, `npx vitest run --config vitest.config.mts tests/<name>.test.tsx`): earAutoplay 1, pianoQuickTap 1, lazyRetry 1. Each failure is the intended assertion failure. The earAutoplay control test passes.
- My own variant (`verify/F/vt2/tests/ear.test.tsx`, exit 0, results in `verify/F/ear-results.txt`) varied the mode and the moment the learner moves on:
  - **progression:** second exercise silent when moving on at 0.5, 1.5 and 3.0 s, fine at 4.6 s.
  - **scale:** same pattern, silent through 3.0 s, fine at 4.6 s.
  - **chord and note:** silent only if the learner moves on within about 0.5 s, effectively never.
- Why not S1:
  - Only scale and progression items are realistically affected, and only if the learner answers and continues during playback (under about 3.3 to 4.4 s).
  - Score and data are unaffected, and Replay works once the lock clears.
  - It is a real defect, but recoverable with one tap.

**F-03 (stuck piano note)**
- The probe uses the real `<Piano/>`. It mocks `resumeAudio` to stay pending, which is exactly the required condition.
- I tried a real-browser repro: Playwright Chromium, Pixel 7 emulation, `--autoplay-policy=document-user-activation-required`, the real build, and a CDP touch hold on C4. The script is `verify/F/e2e-tap/tap.spec.mjs`; the log is `verify/F/tap.log`.
- For a 40 ms tap and a 120 ms tap, `ctx.resume()` was called with state suspended and resolved about 10 ms later. The release came after that, `bufsrc.stop` fired, and the note was not stuck.
- A human tap lasts 40 ms or more, so the race needs resume latency above that. That is unproven on iOS Safari and I could not test it.
- Even if it triggers, the sampler note decays naturally. Only the FM-synth fallback (samples not decoded yet or offline) would drone until the key is pressed again.

**F-04 (PT/ES song text)**
- I built to a scratch directory with `npx vite build --outDir verify/F/dist` (exit 0).
- No chunk contains the PT string "Escrita predominantemente na clave de sol" (grep exit 1).
- No chunk contains the ES string "Escrita predominantemente en la clave" (exit 1), nor the ES "Utiliza movimiento por grados conju…" (exit 1).
- No chunk contains the PT "Utiliza apenas semínimas e mínimas" (exit 1).
- There is no `*song*` file in `assets/`.
- The English "Money / Pink Floyd" entry is in `LearnView-DktiUYnc.js`.
- The known positive, PT "Notação", is found in `curriculumL1-B7LijCy8.js` and other chunks.
- `git log -S loadSongOverlay` shows only the commit that introduced it (b63cb0f), so it was never wired into a component.

**F-05 (contrast)**
- My OKLCH-to-sRGB conversion and WCAG formula check out (sanity: black on white gives 21.00).
- Ratios against the cream `--bg` `#f5efe2` (the auditor's cream-background figures):
  - emerald-300: 1.33
  - red-300: 1.67
  - amber-300: 1.26
  - amber-400/80: 1.40
  - `#FBBF24` on card: 1.32
  - emerald-300 on the emerald-500/10 composite: 1.22
  - `--text-dim` `#8b7551` on cream `--bg`, `--card` and `--card-hover`: 3.85, 3.49 and 3.15
- The default theme is `fermata` (day): `preferencesSlice.ts:6` and `useTheme.ts`. The built CSS has no override for these text classes.

**F-06 (tap targets)**
- I reran the auditor's probe copy (`verify/F/a11y.log`, exit 0). It reproduces: tabs 58×19, 48×19 and 41×19, octave tabs 28×19, one unnamed 14×14 back button.
- `TopBar.tsx:112` deliberately uses `max-sm:py-0.5`.
- The tabs and octave chips are at least 24 px wide and spaced apart, so the WCAG 2.5.8 spacing exception likely applies to them.
- The 14×14 back button and the 15 px breadcrumb items are the real 2.5.8 problems.
- The usability point (19 px main navigation on a phone) stands.

**F-08 (PWA autoUpdate)**
- `vite-plugin-pwa` 1.2.0 `register.js`: in auto mode only `activated` is wired (reload if `isUpdate || isExternal`). `waiting` and `onNeedRefresh` are wired only in the non-auto branch.
- The built bundle has the `activated` reload and no `waiting` listener.
- `sw.js` has `skipWaiting`, `clientsClaim` and `cleanupOutdatedCaches`.
- There is no `registration.update`, `setInterval` or `visibilitychange` in `usePWA.ts` or `main.tsx`.
- The `pwa.newVersion` toast really is unreachable.
- The reload comes within seconds of launch, once the new service worker activates. A mid-exercise interruption would need a deploy to land while the app is open, but updates are only checked on navigation or launch, so it is rare.
- The `isExternal` branch also reloads when another tab updates the service worker.

**F-09 (CI gaps)**
- The workflow file matches the finding.
- `vitest.config.ts` applies thresholds only under `--coverage`.
- I reran the PWA specs against `vite preview` with my port-shifted copy of the auditor's config: 5/5 passed, exit 0 (`verify/F/pw-preview.log`).
- `package.json` shows `build` is `tsc -b && vite build`. Vercel runs that on every push and preview, so the build is gated at deploy time. "CI never builds" is true of GitHub Actions only.
- The missing Playwright and coverage gates are process gaps, not product defects.

### Missed or understated by the auditor
1. **F-05 is wider than listed.**
   - The answered-state chips use `text-emerald-300` / `text-red-300` (/ `text-amber-300`) on a 15% tint.
   - Drill: `ChoiceChips.tsx:59-61`, `NoteChips.tsx:92-96`, `AccidentalSlots.tsx:92-94`, `RootQualityChips.tsx:66-67,111`.
   - Learn: `ChoiceInput.tsx:34,39` and the `ExerciseFeedback.tsx:76` title.
   - These are the most prominent right/wrong cues after an answer, so the light-theme effect is broader than the finding's list.
2. **F-08 doc drift.** CLAUDE.md lists an "update notification" as a built feature, but the build can never show it.
3. I did not review S3 items F-10 to F-26 in depth. Nothing I read suggests one should be higher than S3.

Model: Sonnet 5.5 (claude-sonnet-5-5).