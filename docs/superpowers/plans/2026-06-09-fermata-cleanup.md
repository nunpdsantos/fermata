# Fermata Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip Fermata down to a lean, single-user, Explore-centred tool by removing the Play view, accounts, cloud sync, the Supabase backend, onboarding, marketing docs, and gamification — with zero behaviour change to any kept feature.

**Architecture:** Pure subtraction. Work on a `ws1-cleanup` branch off `main`. Each task removes one feature cluster, fixes every importer, prunes its tests, and must leave the app green (`npx tsc -b`, `npx vitest run`, and — for tasks touching build config — `npm run build`) before committing. Removal order is chosen so every intermediate state compiles. `src/core/` is never touched. The full source of truth is the spec at `docs/superpowers/specs/2026-06-09-fermata-cleanup-design.md`.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Zustand 5, Vitest, Playwright (e2e).

**Commit convention:** every commit message ends with a blank line then:
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

---

## Pre-flight

- [ ] **Create the working branch**

Run:
```bash
cd /Users/nunosantos/Desktop/Base/Music/new_music_app
git checkout -b ws1-cleanup
git add docs/superpowers/specs/2026-06-09-fermata-cleanup-design.md docs/superpowers/plans/2026-06-09-fermata-cleanup.md
git commit -m "docs: cleanup workstream spec + plan" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Baseline green** — confirm the suite is green before any removal so later failures are attributable.

Run: `npx tsc -b && npx vitest run`
Expected: typecheck clean; all tests pass (~800+).

---

## Task 1: Remove marketing docs

Pure file deletion, no code references. Warm-up.

**Files:**
- Delete: `DISTRIBUTION_STRATEGY.md`, `SEO_SITE_PLAN.md`, `LAUNCH_READINESS.md`, `QA_CHECKLIST.md`, `ES_TRANSLATION_STATUS.md`

- [ ] **Step 1: Delete the docs**

Run:
```bash
git rm DISTRIBUTION_STRATEGY.md SEO_SITE_PLAN.md LAUNCH_READINESS.md QA_CHECKLIST.md ES_TRANSLATION_STATUS.md
```

- [ ] **Step 2: Verify nothing references them**

Run: `rg -n "DISTRIBUTION_STRATEGY|SEO_SITE_PLAN|LAUNCH_READINESS|QA_CHECKLIST|ES_TRANSLATION_STATUS" --glob '!docs/**'`
Expected: no matches (CLAUDE.md references `ROADMAP.md`, not these — confirm none of the five appear).

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove ship-to-strangers marketing docs" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Remove GuidedTour onboarding

**Files:**
- Delete: `src/components/layout/GuidedTour.tsx`, `e2e/onboarding.spec.ts`
- Modify: `src/App.tsx` (remove import + `<GuidedTour />`)
- Modify (only the inert onboarding initScript guard): `e2e/navigation.spec.ts`, `e2e/learn-flow.spec.ts`, `e2e/pwa.spec.ts`

- [ ] **Step 1: Remove the usage in App.tsx**

In `src/App.tsx`: remove the `import GuidedTour from ...` line and the `<GuidedTour />` element in the render tree. Leave everything else.

- [ ] **Step 2: Delete the component and its e2e spec**

Run:
```bash
git rm src/components/layout/GuidedTour.tsx e2e/onboarding.spec.ts
```

- [ ] **Step 3: Remove the onboarding-complete localStorage guards from other e2e specs**

In `e2e/navigation.spec.ts`, `e2e/learn-flow.spec.ts`, `e2e/pwa.spec.ts`: remove any `initScript`/`localStorage.setItem('music-theory-onboarding-complete', …)` lines (they become no-ops). Inspect first:
Run: `rg -n "onboarding" e2e/`
Then delete only the matched onboarding-guard lines. Leave the `data-tour="…"` attributes in `InstrumentSelector.tsx`, `AppShell.tsx`, `KeySelector.tsx` — they are inert HTML attributes, no break.

- [ ] **Step 4: Typecheck + tests**

Run: `npx tsc -b && npx vitest run`
Expected: clean typecheck; all unit/component tests pass.

- [ ] **Step 5: Verify removal is complete**

Run: `rg -n "GuidedTour|onboarding-complete" src/`
Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git commit -am "chore: remove first-run guided tour" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Remove accounts + cloud sync

Merged because `App.tsx` couples them: `const { user } = useAuth(); useSync(user);`. Removing one without the other leaves a dangling reference.

**Files:**
- Delete: `src/hooks/useAuth.ts`, `src/hooks/useSync.ts`, `src/services/sync.ts`, `src/services/syncMerge.ts`, `src/state/syncStore.ts`, `src/components/auth/AuthModal.tsx`, `src/components/auth/AccountMenu.tsx`
- Delete tests: `src/hooks/__tests__/useAuth.test.ts`, `src/hooks/__tests__/useSync.test.ts`, `src/services/__tests__/sync.test.ts`, `src/services/__tests__/syncMerge.test.ts`, `src/state/__tests__/syncStore.test.ts`, `src/components/auth/__tests__/AuthModal.test.tsx`
- Modify: `src/App.tsx`, `src/components/layout/TopBar.tsx`

- [ ] **Step 1: Detach in App.tsx**

In `src/App.tsx`: remove the `useAuth` and `useSync` imports, the `const { user } = useAuth();` line, and the `useSync(user);` line. Keep `useTheme()`/`useLanguage()`.

- [ ] **Step 2: Remove auth UI from TopBar**

In `src/components/layout/TopBar.tsx`: remove the `AuthModal`, `AccountMenu`, and `useAuth` imports; the `useAuth()` destructure; the `authModalOpen` state; the auth-button block; and the trailing `{… && <AuthModal …/>}`. Leave the theme menu, language selector, and quick-search button untouched. (The `StreakBadge` is removed later in Task 5 — leave it for now.)

- [ ] **Step 3: Check for stray sync-store / auth consumers**

Run: `rg -n "useAuth|useSync|syncStore|services/sync|syncMerge|AuthModal|AccountMenu" src/ --glob '!**/__tests__/**' --glob '!src/hooks/useAuth.ts' --glob '!src/hooks/useSync.ts' --glob '!src/services/sync.ts' --glob '!src/services/syncMerge.ts' --glob '!src/state/syncStore.ts' --glob '!src/components/auth/**'`
Expected: only `App.tsx`/`TopBar.tsx` (now edited). If any other consumer appears (e.g. a sync-status indicator), remove that reference too before deleting files.

- [ ] **Step 4: Delete the source + test files**

Run:
```bash
git rm src/hooks/useAuth.ts src/hooks/useSync.ts src/services/sync.ts src/services/syncMerge.ts src/state/syncStore.ts src/components/auth/AuthModal.tsx src/components/auth/AccountMenu.tsx
git rm src/hooks/__tests__/useAuth.test.ts src/hooks/__tests__/useSync.test.ts src/services/__tests__/sync.test.ts src/services/__tests__/syncMerge.test.ts src/state/__tests__/syncStore.test.ts src/components/auth/__tests__/AuthModal.test.tsx
```
(`src/components/auth/` should now be empty — remove the dir if git leaves it.)

- [ ] **Step 5: Typecheck + tests**

Run: `npx tsc -b && npx vitest run`
Expected: clean typecheck; all remaining tests pass. (`lib/supabase.ts` + `lib/database.types.ts` are now unimported but still present — that is fine; they are removed in Task 4.)

- [ ] **Step 6: Commit**

```bash
git commit -am "feat: remove accounts (Supabase auth) and cloud sync" -m "Single-device tool: localStorage persistence is retained; cloud sync, magic-link auth, and the offline sync queue are removed." -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Remove the Supabase backend

Now orphaned (only auth/sync imported it). Touches build config, so build is verified here.

**Files:**
- Delete: `src/lib/supabase.ts`, `src/lib/database.types.ts`, `supabase/` (whole dir)
- Modify: `package.json`, `vite.config.ts`, `.env.example`, `.env.local`

- [ ] **Step 1: Confirm zero importers remain**

Run: `rg -n "@supabase/supabase-js|lib/supabase|lib/database.types|database\.types" src/`
Expected: no matches (auth/sync already gone).

- [ ] **Step 2: Delete the backend files**

Run:
```bash
git rm src/lib/supabase.ts src/lib/database.types.ts
git rm -r supabase
```
(`src/lib/` should now be empty — remove the dir if git leaves it.)

- [ ] **Step 3: Remove the dependency**

In `package.json`: delete the `"@supabase/supabase-js": "..."` line from `dependencies`. Then:
Run: `npm install`
Expected: lockfile updates; no errors.

- [ ] **Step 4: Clean vite.config.ts**

In `vite.config.ts`: remove the `assets/supabase-*.js` entry from `globPatterns`; remove the `if (id.includes('node_modules/@supabase')) return 'supabase';` line from `manualChunks`; remove the `*.supabase.co` `NetworkOnly` rule from `runtimeCaching`. Optionally drop now-dead `PlayView-` tokens from `globIgnores`/cache regex (harmless if left; Play is removed in Task 6).

- [ ] **Step 5: Remove Supabase env vars**

In `.env.example`: remove the four `VITE_SUPABASE_*` lines.
In `.env.local`: remove `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. (These are now dead; the publishable key was already client-public.)

- [ ] **Step 6: Typecheck, tests, and build**

Run: `npx tsc -b && npx vitest run && npm run build`
Expected: typecheck clean; tests pass; production build succeeds (validates the workbox/manualChunks edits).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove Supabase backend dependency and config" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Remove gamification + concept tracking

Keeps `conceptTagger.ts` and `exerciseSelector.ts` (the exercise engine survives) and `progressStore` (curriculum completion). `ExerciseRunner` keeps `selectWeightedExercises` but passes an empty weak-concepts list, making weighting an inert shuffle.

**Files:**
- Delete: `src/components/gamification/` (whole dir, incl. its `__tests__/ConceptRadar.test.tsx`), `src/state/gamificationStore.ts`, `src/state/conceptStore.ts`, `src/services/gamification.ts`, `src/hooks/useGamificationEffects.ts`, `src/data/achievements.ts`
- Delete tests: `src/services/__tests__/gamification.test.ts`, `src/state/__tests__/conceptStore.test.ts`
- Modify: `src/views/LearnView.tsx`, `src/components/learn/LevelsOverview.tsx`, `src/components/learn/exercises/ExerciseRunner.tsx`, `src/components/learn/exercises/inputs/InstrumentInput.tsx`, `src/components/layout/TopBar.tsx`

- [ ] **Step 1: Strip gamification from LearnView.tsx**

In `src/views/LearnView.tsx`: remove imports/usage of `useGamificationStore`, `useShallow`, `computeModuleXP` (from `services/gamification`), `useGamificationEffects`, and the lazy `ProgressDashboard` import. Remove `useGamificationEffects();`, the `useGamificationStore(useShallow(...))` destructure block, `goToDashboard`, the `'dashboard'` value from the `LearnScreen` union and its render branch, and the three gamification effects (backfill/prune, achievement check, dashboard-request). In `onCompleteModule`, reduce to `completeModule(moduleId)` plus the existing `onLevelComplete` celebration — drop the `logActivity()`/`incrementModulesCompleted()`/`addXP(...)` calls. In the review `onExercisesComplete`, keep `recordReviewResult(mod.id, passed)` and the toast — drop the `logActivity()`/`incrementReviewsCompleted()`/`addXP(...)` calls. Keep all curriculum, review, deep-link, and navigation logic.

- [ ] **Step 2: Strip gamification from LevelsOverview.tsx**

In `src/components/learn/LevelsOverview.tsx`: remove the `XPDisplay` and `useGamificationStore` imports, the `weeklyXP`/`totalXP` selectors, and the `<XPDisplay/>` + dashboard `<Button>` block. Remove the `onOpenDashboard` prop and its type. Keep `ReviewQueue`, `ContinueBanner`, `LevelCard`, `ProgressBar`.

- [ ] **Step 3: Decouple ExerciseRunner.tsx (keep the runner working)**

In `src/components/learn/exercises/ExerciseRunner.tsx`: remove the `useGamificationStore`, `useConceptStore`, and `getExerciseConcepts` imports; keep the `selectWeightedExercises` import. Remove the gamification selectors (`gamLogActivity`/`gamIncrementExercise`/`gamAddXP`) and concept selectors (`recordConceptResult`, `getWeakConcepts`). Replace the `orderedExercises` memo with a plain shuffle via the kept selector:

```tsx
const orderedExercises = useMemo(
  () => selectWeightedExercises(exercises, [], exercises.length),
  [exercises]
);
```

In `handleSubmitChoice` and `handleSubmitInstrument`: delete the `const concepts = getExerciseConcepts(...)` lines and every `gamLogActivity()`/`gamIncrementExercise(...)`/`gamAddXP(...)`/`recordConceptResult(...)` call. Keep `onRecordResult(...)`, the `setAccumulatedScore(...)` update, and scoring. Remove the deleted identifiers from each `useCallback` dependency array.

- [ ] **Step 4: Remove the MIDI-input badge from InstrumentInput.tsx**

In `src/components/learn/exercises/inputs/InstrumentInput.tsx`: remove the `midiInputEnabled` selector and the `{midiInputEnabled && <span>…{t('midiInput.badge')}…</span>}` block. Keep the `activeNotes` effect and the instrument-driven note toggling. (This pre-empts a dangling `midiInputEnabled` reference when audio state is trimmed in Task 6.)

- [ ] **Step 5: Remove the streak badge from TopBar.tsx**

In `src/components/layout/TopBar.tsx`: remove the `useGamificationStore` import, the `StreakBadge` import, the `currentStreak` selector, and the `<StreakBadge .../>` block. (Auth was already removed in Task 3.)

- [ ] **Step 6: Delete the gamification + concept source and tests**

Run:
```bash
git rm -r src/components/gamification
git rm src/state/gamificationStore.ts src/state/conceptStore.ts src/services/gamification.ts src/hooks/useGamificationEffects.ts src/data/achievements.ts
git rm src/services/__tests__/gamification.test.ts src/state/__tests__/conceptStore.test.ts
```

- [ ] **Step 7: Orphaned-key cleanup at boot (optional but tidy)**

In `src/main.tsx` (or the app entry that runs before render), add a one-time removal of the now-dead persisted stores:
```ts
['music-theory-gamification', 'music-theory-concept-tracking'].forEach(
  (k) => localStorage.removeItem(k)
);
```
(Skip if you prefer leaving inert localStorage entries — both are harmless.)

- [ ] **Step 8: Typecheck + tests**

Run: `npx tsc -b && npx vitest run`
Expected: clean typecheck; tests pass. (`conceptTagger.test.ts` and `exerciseSelector.test.ts` stay green — those modules survive.)

- [ ] **Step 9: Verify removal is complete**

Run: `rg -n "gamificationStore|conceptStore|useGamificationEffects|StreakBadge|XPDisplay|ConceptRadar|ProgressDashboard|getExerciseConcepts|data/achievements" src/`
Expected: no matches.

- [ ] **Step 10: Commit**

```bash
git commit -am "feat: remove gamification (XP/streaks/achievements) and concept tracking" -m "Curriculum + exercises + spaced-repetition review are retained; exercise selection falls back to a plain shuffle." -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Remove the Play view

The largest task: deletes the whole view plus its services/hooks/slice, and trims the shared store + audio engine without breaking instrument sound (the `synthPreset` field stays, default `'piano'`).

**Files:**
- Delete: `src/views/PlayView.tsx`; `src/components/play/` (MetronomeControl, MidiInputControl, MidiOutputControl, RecordingControl, ChordProgressionBuilder); `src/services/` noteRecorder, midiAccess, midiInput, midiOutput, metronome; `src/hooks/useMetronome.ts`, `src/hooks/useMidi.ts`; `src/state/slices/metronomeSlice.ts`
- Delete tests: `src/hooks/__tests__/useMetronome.test.ts`, `src/hooks/__tests__/useMidi.test.ts`, `src/services/__tests__/metronome.test.ts`, `src/services/__tests__/midiAccess.test.ts`, `src/services/__tests__/midiInput.test.ts`
- Modify: `src/App.tsx`, `src/components/layout/TopBar.tsx`, `src/hooks/useAudio.ts`, `src/state/storeTypes.ts`, `src/state/slices/audioSlice.ts`, `src/state/store.ts`, `src/state/slices/navigationSlice.ts`
- Update tests: `src/hooks/__tests__/useAudio.test.ts`, `src/state/__tests__/store.test.ts`, `src/__tests__/integration.test.tsx`, `e2e/navigation.spec.ts`

- [ ] **Step 1: Remove Play from App.tsx routing**

In `src/App.tsx`: remove the `useMidi` import and the `useMidi();` call; remove the `PlayView` lazy import and the `play:` entry in `VIEW_COMPONENTS`.

- [ ] **Step 2: Reduce TopBar to two tabs**

In `src/components/layout/TopBar.tsx`: change `VIEWS` from `['explore','play','learn']` to `['explore','learn']`, and remove the `play: 'nav.play'` entry from `VIEW_KEYS`.

- [ ] **Step 3: Trim useAudio.ts (keep instruments playing)**

In `src/hooks/useAudio.ts`: remove the `noteRecorder` import (`recordNoteOn`/`recordNoteOff`) and the `midiOutput` import; remove the `midiOutputEnabled`/`midiOutputDeviceId` selectors, the two MIDI-output `useEffect` init/select blocks, the `if (midiOutputEnabled) sendNoteOn/Off(...)` lines, and the `recordNoteOn(midi)`/`recordNoteOff(midi)` calls. Keep `synthPreset`, `volume`, `addActiveNote`/`removeActiveNote`, the `useKS` FM-vs-Karplus selection, and `SYNTH_PRESETS` + `WARMTH_OVERRIDES`.

- [ ] **Step 4: Trim storeTypes.ts**

In `src/state/storeTypes.ts`: change `ViewMode` to `'explore' | 'learn'`. In `AudioSlice`, remove `midiOutputEnabled`, `midiOutputDeviceId`, `midiInputEnabled`, `midiInputDeviceId` and their `setMidi*` setters; keep `synthPreset`, `volume`, `isPlaying` (+ their setters except `setSynthPreset`). Remove the entire `MetronomeSlice` interface and drop it from the composed `AppState`.

- [ ] **Step 5: Trim audioSlice.ts**

In `src/state/slices/audioSlice.ts`: remove the four `midi*` initial values and their setters, and remove `setSynthPreset` (no kept caller). Keep `synthPreset: 'piano'`, `volume`, `isPlaying`, and their remaining setters.

- [ ] **Step 6: Trim store.ts (drop metronome slice, bump persist version)**

In `src/state/store.ts`: remove the `createMetronomeSlice` import (line 7) and its spread (line 21). In `partialize`, remove `synthPreset`, `midiOutputEnabled`, `midiOutputDeviceId`, `midiInputEnabled`, `midiInputDeviceId`, `metronomeBPM`, `metronomeBeats`, `metronomeVolume`. Bump `version: 3` to `version: 4` and add a v4 migrate branch that strips the orphaned keys (place it after the existing `version < 3` block, before `return state;`):

```ts
if (version < 4 && state && typeof state === 'object') {
  const s = state as Record<string, unknown>;
  for (const k of [
    'synthPreset', 'midiOutputEnabled', 'midiOutputDeviceId',
    'midiInputEnabled', 'midiInputDeviceId',
    'metronomeBPM', 'metronomeBeats', 'metronomeVolume',
  ]) delete s[k];
}
```

- [ ] **Step 7: Confirm no remaining `'play'` view value**

In `src/state/slices/navigationSlice.ts` and anywhere `setView` is typed/used: ensure no `'play'` literal remains (the `ViewMode` change will surface these at typecheck).

- [ ] **Step 8: Delete the Play source files**

Run:
```bash
git rm src/views/PlayView.tsx
git rm -r src/components/play
git rm src/services/noteRecorder.ts src/services/midiAccess.ts src/services/midiInput.ts src/services/midiOutput.ts src/services/metronome.ts
git rm src/hooks/useMetronome.ts src/hooks/useMidi.ts
git rm src/state/slices/metronomeSlice.ts
```

- [ ] **Step 9: Delete the dead test files**

Run:
```bash
git rm src/hooks/__tests__/useMetronome.test.ts src/hooks/__tests__/useMidi.test.ts src/services/__tests__/metronome.test.ts src/services/__tests__/midiAccess.test.ts src/services/__tests__/midiInput.test.ts
```

- [ ] **Step 10: Update the affected surviving tests**

- `src/hooks/__tests__/useAudio.test.ts`: remove the `vi.mock('../../services/midiOutput.ts'…)` and `vi.mock('../../services/noteRecorder.ts'…)` mocks and every assertion on `mockSendNoteOn/Off`, `mockRecordNoteOn/Off`, and `midiOutputEnabled`. Keep the `synthPreset`/`pluck`/KS-vs-FM tests.
- `src/state/__tests__/store.test.ts`: remove the metronome `describe` block, the MIDI assertions, the `metronome*`/`midi*` fields in the default-state fixture, and the `setSynthPreset` assertion. Change any `setView('play')` to `setView('learn')`.
- `src/__tests__/integration.test.tsx`: change `setView('play')` calls and `expect(...view).toBe('play')` assertions to `'learn'`.
- `e2e/navigation.spec.ts`: drop the `Play` tab assertion and the `#play-panel` switch block; expect two tabs (Explore, Learn).

- [ ] **Step 11: Typecheck, tests, build**

Run: `npx tsc -b && npx vitest run && npm run build`
Expected: typecheck clean; tests pass; build succeeds.

- [ ] **Step 12: Verify removal is complete**

Run:
```bash
rg -n "PlayView|components/play/|useMidi|useMetronome|services/(midiAccess|midiInput|midiOutput|metronome|noteRecorder)|metronomeSlice" src/
rg -n "'play'" src/state src/views src/components
```
Expected: no matches.

- [ ] **Step 13: Commit**

```bash
git commit -am "feat: remove the Play view (metronome, MIDI, recorder, progression)" -m "Nav reduces to Explore + Learn. Instruments keep playing via the retained synthPreset default; the sound-preset chooser is gone." -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Refresh CLAUDE.md + final verification

CLAUDE.md still documents Play, gamification, auth/sync, and Supabase as present. Bring it in line so future sessions aren't misled; then run the full gate end-to-end.

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update CLAUDE.md to match the slimmed app**

Edit `CLAUDE.md`: in Product Overview remove the **Play** bullet and the gamification clause from the **Learn** bullet (curriculum + spaced repetition stay; XP/streaks/achievements go). In Project, drop `Supabase` from the Stack line and `Backend: Supabase`. In Architecture, remove the `lib/`, `play/`, `gamification/`, `auth/` entries, the `syncStore`/`gamificationStore`/`conceptStore` lines, and the sync/gamification/concept entries under `hooks/` and `services/`. Remove the "Backend + Auth + Cloud Sync (Phase 10)", "Adaptive Difficulty (Phase 11)", and "Gamification (Phase 9)" sections from What's Built, and drop MIDI/recording/progression/metronome from the Phase 6/12 feature lists. Update the test count to the post-cleanup number from the final `vitest run`. Leave `src/core/` notes intact.

- [ ] **Step 2: Full green gate**

Run: `npx tsc -b && npx vitest run && npm run lint && npm run build`
Expected: typecheck clean; all tests pass; 0 lint errors; build succeeds. Record the final passing test count for the CLAUDE.md edit.

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev` and confirm at localhost:5173:
- TopBar shows exactly two tabs (Explore, Learn); no auth button, no streak badge; theme + language + Cmd-K work.
- Explore fully functional: key/scale selection, Circle of Fifths, chord grid/browser/builder, scale comparison, detail panels with staff notation, "Play scale" audio.
- Piano plays (warm FM) and Guitar/Fretboard plays (Karplus pluck) — no sound chooser anywhere.
- Learn: levels overview (no XP bar, no dashboard button), Continue banner, Review Queue; open a module → concepts, song refs, exercises run and score, "Mark complete" + celebration + toast fire; spaced-repetition review launches and records.
- Switch EN/PT/ES — curriculum + exercises localize.
- Reload: preferences + curriculum progress persist; no console errors about missing localStorage keys.
- DevTools offline after first load: app shell + instruments still load.

- [ ] **Step 4: Commit**

```bash
git commit -am "docs: update CLAUDE.md for the slimmed Explore-centric app" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-review (planner checklist — completed)

**Spec coverage:** every spec removal area maps to a task — docs→T1, GuidedTour→T2, auth+sync→T3, Supabase→T4, gamification+concept→T5, Play→T6; the kept-feature guarantees are verified in T7's smoke test. The spec's "resolved decisions" (keep `conceptTagger`/`exerciseSelector`, leave `src/core/`, keep `synthPreset`, defer borderline docs + i18n pruning) are honoured. Addition beyond the spec: T7 updates `CLAUDE.md` (the spec kept it but it would otherwise be stale).

**Placeholder scan:** no TBD/TODO; every edit names the exact file and the exact identifiers/blocks to remove; the two net-new code bits (the v4 migrate, the `orderedExercises` shuffle) are shown in full.

**Type consistency:** `ViewMode` becomes `'explore' | 'learn'` in T6 and is consumed consistently (TopBar `VIEWS`, navigation, tests). `synthPreset` stays a field (default `'piano'`) while `setSynthPreset` is removed — `useAudio` reads it, nothing writes it. The persist `version` goes 3→4 with a migrate that returns the kept state.
