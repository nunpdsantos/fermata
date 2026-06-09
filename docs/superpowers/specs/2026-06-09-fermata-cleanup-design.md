# Fermata — Workstream 1: Cleanup (design spec)

**Date:** 2026-06-09
**Status:** Draft — awaiting owner review
**Workstream:** 1 of 5 (Cleanup → Audio → Theme → Unified Explore → Theory layer)

## Goal

Reduce Fermata from a "ship-to-strangers product" to a lean, elegant, single-user
tool centred on **Explore** + the instruments. This workstream removes everything
that serves an audience of strangers or that the owner does not use, with **zero
change to Explore, the instruments, the audio engine, staff notation, the kept
Learn curriculum/exercises, the three languages, or offline/PWA behaviour**.

This is a pure subtraction pass. No features are added; no kept feature changes
behaviour. The build and the test suite must stay green.

## Scope

### Removed
1. **Play view, entirely** — the Play tab and every feature in it (metronome, MIDI
   in/out, note recorder, chord-progression sequencer, the 5-preset sound chooser).
2. **Accounts** — Supabase magic-link auth (AuthModal, AccountMenu, `useAuth`).
3. **Cloud sync** — `useSync`, sync service, `syncMerge`, `syncStore`, offline queue.
   Other stores keep persisting to localStorage exactly as before.
4. **Supabase backend** — `lib/supabase.ts`, `lib/database.types.ts`, the `supabase/`
   directory, the `@supabase/supabase-js` dependency, the `VITE_SUPABASE_*` env vars.
5. **Onboarding** — `GuidedTour`.
6. **Marketing docs** — `DISTRIBUTION_STRATEGY.md`, `SEO_SITE_PLAN.md`,
   `LAUNCH_READINESS.md`, `QA_CHECKLIST.md`, `ES_TRANSLATION_STATUS.md`.
7. **Gamification + concept tracking** — XP, streaks, achievements, ConceptRadar,
   adaptive difficulty (`components/gamification/*`, `gamificationStore`,
   `conceptStore`, `services/gamification.ts`, `useGamificationEffects`, the TopBar
   streak badge, and all call-sites in `LearnView`).

### Kept (must not change behaviour)
- Explore view, Piano + Fretboard instruments, the audio engine, staff notation.
- The **Learn curriculum + exercise engine** (minus gamification). `progressStore`
  (curriculum completion) is preserved. Spaced-repetition review mode is preserved.
- All three languages (EN/PT/ES) and the i18n system.
- localStorage persistence and the PWA/offline setup.

### Resolved decisions
- **`conceptTagger.ts` is KEPT** (a pure helper `exerciseSelector` imports). Only its
  UI consumers and `conceptStore` are removed. `ExerciseRunner` passes an empty
  weak-concepts array, so exercise weighting becomes an inert no-op (plain shuffle)
  without deleting working code.
- **`src/core/` is left entirely untouched.** Two files there become dead
  (`core/types/gamification.ts`, `core/services/midi.ts`) but are inert and cost
  nothing; leaving them respects the DO-NOT-MODIFY-core convention.
- **`synthPreset` state is KEPT** with default `'piano'` (the audio engine reads it to
  pick FM-piano vs Karplus-guitar). Only the chooser UI and the `setSynthPreset`
  setter are removed.
- **Borderline docs deferred** — `ROADMAP.md`, `AUDIT_TRACKER.md`, `Codex review.md`
  are NOT removed in this pass; the owner decides separately.
- **i18n key pruning deferred** — orphaned locale namespaces are non-breaking
  (i18next ignores unused keys). Pruning is optional, symmetric-across-3-files, and
  left for later to avoid parity-test churn now.

## Removal manifest

### A. Files to delete

**Play view**
- `src/views/PlayView.tsx`
- `src/components/play/MetronomeControl.tsx`
- `src/components/play/MidiInputControl.tsx`
- `src/components/play/MidiOutputControl.tsx`
- `src/components/play/RecordingControl.tsx`
- `src/components/play/ChordProgressionBuilder.tsx`
- `src/services/noteRecorder.ts`
- `src/services/midiAccess.ts`
- `src/services/midiInput.ts`
- `src/services/midiOutput.ts`
- `src/services/metronome.ts`
- `src/hooks/useMetronome.ts`
- `src/hooks/useMidi.ts`
- `src/state/slices/metronomeSlice.ts`

**Accounts / auth**
- `src/components/auth/AuthModal.tsx`
- `src/components/auth/AccountMenu.tsx`
- `src/hooks/useAuth.ts`
- remove the now-empty `src/components/auth/` directory

**Cloud sync**
- `src/hooks/useSync.ts`
- `src/services/sync.ts`
- `src/services/syncMerge.ts`
- `src/state/syncStore.ts`

**Supabase backend**
- `src/lib/supabase.ts`
- `src/lib/database.types.ts`
- `supabase/` (entire directory)
- remove the now-empty `src/lib/` directory

**Onboarding**
- `src/components/layout/GuidedTour.tsx`

**Marketing docs (root)**
- `DISTRIBUTION_STRATEGY.md`, `SEO_SITE_PLAN.md`, `LAUNCH_READINESS.md`,
  `QA_CHECKLIST.md`, `ES_TRANSLATION_STATUS.md`

**Gamification + concept tracking**
- `src/components/gamification/` (entire directory: AchievementCard, AchievementGrid,
  ConceptRadar, ProgressDashboard, StatCard, StreakBadge, StreakCalendar, WeeklyChart,
  XPDisplay, and `__tests__/ConceptRadar.test.tsx`)
- `src/state/gamificationStore.ts`
- `src/state/conceptStore.ts`
- `src/services/gamification.ts`
- `src/hooks/useGamificationEffects.ts`
- `src/data/achievements.ts`

> NOT deleted (revises the raw analysis): `src/services/conceptTagger.ts` and
> `src/services/exerciseSelector.ts` are KEPT (see resolved decisions). `src/core/`
> files are KEPT.

### B. Files to edit

**`src/App.tsx`** — remove imports + usage of `GuidedTour`, `useMidi`, `useAuth`,
`useSync`; remove the `PlayView` lazy import and the `play:` entry in
`VIEW_COMPONENTS`; remove `useMidi()`, `useAuth()`/`useSync(user)` calls and
`<GuidedTour />`. Keep `useTheme()` and `useLanguage()`.

**`src/components/layout/TopBar.tsx`** — remove imports/usage of `useGamificationStore`,
`StreakBadge`, `AuthModal`, `AccountMenu`, `useAuth`; remove the `currentStreak`
selector, `authModalOpen` state, the auth-button block, the `<StreakBadge/>` block,
and the trailing `<AuthModal/>`. Change `VIEWS` from `['explore','play','learn']` to
`['explore','learn']` and drop the `play` entry from `VIEW_KEYS`. Keep the theme
menu, language selector, and quick-search button.

**`src/views/LearnView.tsx`** — remove imports/usage of `useGamificationStore`,
`useShallow`, `computeModuleXP`, `useGamificationEffects`, and the `ProgressDashboard`
lazy import. Remove the gamification store destructure, the `'dashboard'` screen type
and its render branch, `goToDashboard`, and the three gamification effects
(backfill/prune, achievement check, dashboard-request). In `onCompleteModule`, reduce
to `completeModule(moduleId)` + the existing `onLevelComplete` celebration (drop the
XP calls). In the review `onExercisesComplete`, keep `recordReviewResult(...)` + the
toast (drop the XP/activity calls). Keep all curriculum/review/navigation logic.

**`src/components/learn/LevelsOverview.tsx`** — remove `XPDisplay`,
`useGamificationStore`, the XP selectors, and the XPDisplay + dashboard-button block;
drop the `onOpenDashboard` prop (and its type). Keep ReviewQueue, ContinueBanner,
LevelCard, ProgressBar.

**`src/components/learn/exercises/ExerciseRunner.tsx`** — remove
`useGamificationStore`, `useConceptStore`, and `getExerciseConcepts` imports/usage and
all `gam*`/`recordConceptResult` calls; keep the `selectWeightedExercises` import.
Replace the `getWeakConcepts()`-driven ordering with
`selectWeightedExercises(exercises, [], exercises.length)` (empty weak-concepts →
plain shuffle). Keep `onRecordResult(...)`, score accumulation, and scoring. Fix the
affected `useCallback` dependency arrays.

**`src/components/learn/exercises/inputs/InstrumentInput.tsx`** — remove the
`midiInputEnabled` selector and the MIDI-input badge span. Keep the instrument-driven
note toggling (the kept Piano/Fretboard input path).

**`src/hooks/useAudio.ts`** — remove the `noteRecorder` and `midiOutput` imports, the
`midiOutput*` selectors, the MIDI-output init/select effects, the
`if (midiOutputEnabled) sendNoteOn/Off` lines, and the `recordNoteOn/Off` calls. Keep
`synthPreset`/`volume`/`addActiveNote`/`removeActiveNote`, the FM-vs-Karplus selection,
and `SYNTH_PRESETS` + `WARMTH_OVERRIDES`.

**`src/state/storeTypes.ts`** — `ViewMode`: `'explore' | 'learn'`. In `AudioSlice`
remove the four MIDI fields + their setters (keep `synthPreset`, `volume`, `isPlaying`).
Remove the `MetronomeSlice` interface and drop it from the composed `AppState`.

**`src/state/slices/audioSlice.ts`** — remove the four MIDI initial values + setters.
Keep `synthPreset: 'piano'`. Remove `setSynthPreset` (no kept caller).

**`src/state/store.ts`** — remove `createMetronomeSlice` import/spread. In `partialize`
drop `synthPreset`, the four `midi*` keys, and `metronomeBPM`/`metronomeBeats`/
`metronomeVolume`. Bump `version` 3 → 4 with a `migrate` that deletes those orphaned
keys from incoming persisted state and returns the rest (preserving kept preferences).

**`src/state/slices/navigationSlice.ts`** (and any `setView` typing) — ensure no
`'play'` view value remains.

**`package.json`** — remove `@supabase/supabase-js`. (Verified: only the deleted
files import it. No other prod dependency becomes unused.)

**`vite.config.ts`** — remove the `assets/supabase-*.js` glob, the
`node_modules/@supabase` manualChunks branch, and the `*.supabase.co` runtime-cache
rule. Optionally drop the now-nonexistent `PlayView-` chunk tokens.

**`.env.example`** — remove the four Supabase lines.
**`.env.local`** — remove `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (they become
dead once Supabase is gone; the publishable key was already client-public).

### C. State / store changes
- **Deleted stores:** `gamificationStore`, `conceptStore`, `syncStore`.
- **Kept stores:** `progressStore` (curriculum completion), `toastStore`.
- **Main `useAppStore` slices:** `metronomeSlice` deleted; `audioSlice` trimmed (MIDI
  out, keep `synthPreset`/`volume`/`isPlaying`); `musicSlice`, `instrumentSlice`,
  `navigationSlice` (minus `play`), `preferencesSlice` kept.
- **Instruments after the chooser is gone:** the engine still reads `synthPreset`
  (default `'piano'`); guitar is forced to Karplus-Strong by `instrument === 'guitar'`.
  No UI required — piano sounds like the warm FM piano, guitar like a plucked string.

**Orphaned localStorage keys (handled, all non-fatal):**
- `music-theory-app` — orphaned sub-keys stripped by the v4 migrate.
- `music-theory-gamification`, `music-theory-concept-tracking`,
  `music-theory-onboarding-complete` — fully orphaned; optionally `removeItem` at boot,
  otherwise harmless dead entries.
- `music-theory-progress` — KEPT, untouched.
- `syncStore` is not persisted; nothing to clean.

### D. Tests

**Delete** (target fully removed):
`useMetronome.test`, `useMidi.test`, `useAuth.test`, `useSync.test`,
`metronome.test`, `midiAccess.test`, `midiInput.test`, `sync.test`, `syncMerge.test`,
`gamification.test`, `syncStore.test`, `conceptStore.test`,
`auth/__tests__/AuthModal.test`, `gamification/__tests__/ConceptRadar.test`,
`e2e/onboarding.spec.ts`.

> Keep `conceptTagger.test.ts` and `exerciseSelector.test.ts` (those modules survive).

**Update:**
- `store.test.ts` — remove the metronome describe block and MIDI assertions; remove
  `metronome*`/`midi*` from the default-state fixture; remove the `setSynthPreset`
  assertion; change any `setView('play')` to a kept view.
- `useAudio.test.ts` — drop the `midiOutput`/`noteRecorder` mocks and their assertions;
  keep the `synthPreset`/`pluck`/KS-vs-FM tests.
- `integration.test.tsx` — change `setView('play')` / `expect(view).toBe('play')` to a
  kept view (`'learn'`).
- `e2e/navigation.spec.ts` — drop the Play tab/panel assertions; expect two tabs.
- `e2e/learn-flow.spec.ts`, `e2e/pwa.spec.ts` — remove the no-op onboarding initScript
  guards and any `Play` tab reference (inspect matched lines before editing).
- `accessibility.test.tsx` — verify (likely no edit) that AppShell/TopBar still render
  after the TopBar edit.

### E. Risks & mitigations
- **exerciseSelector ↔ conceptTagger** (highest): resolved by keeping `conceptTagger.ts`.
- **`synthPreset` is shared state**: keep the field; only remove UI + setter.
- **persist migration**: v4 `migrate` must return the kept state (not undefined) so
  preferences survive; it only deletes orphaned keys.
- **`data-tour` attributes** on InstrumentSelector/AppShell/KeySelector become inert
  after GuidedTour is gone — no break; cosmetic cleanup optional.
- **i18n**: leave orphaned keys (non-breaking); if pruned later, prune all three
  locales identically to keep parity tests green.
- **No dynamic-import landmines** beyond `ProgressDashboard` (removed with its branch).

### F. Verification
From the app root:
```
npx tsc -b          # typecheck — catches every dangling import
npx vitest run      # unit/component tests — must end green
npm run lint        # 0 errors
npm run build       # validates vite config + PWA workbox globs
npx playwright test # e2e, after the spec edits above
```
Completeness greps (each must return nothing but definitions in deleted files):
```
rg -n "useMidi|useMetronome|useAuth|useSync|useGamificationEffects" src/
rg -n "gamificationStore|conceptStore|syncStore" src/
rg -n "@supabase/supabase-js|lib/supabase|database\.types" src/
rg -n "PlayView|components/play/|GuidedTour|StreakBadge|AccountMenu|AuthModal" src/
rg -n "'play'" src/state src/views src/components
```
Manual smoke test (`npm run dev`): two tabs (Explore, Learn); no auth button / no
streak badge; theme + language + Cmd-K work; Explore fully functional with audio;
piano (warm FM) and guitar (Karplus) both play with no chooser; Learn shows levels
(no XP bar / no dashboard button), Continue banner, Review Queue; a module runs
exercises, scores, marks complete with the celebration; review mode launches and
records; EN/PT/ES localize; reload persists preferences + curriculum progress with no
console errors; offline still loads the shell + instruments.

## Out of scope (later workstreams)
- Audio quality / sampled piano — WS3.
- Theme consolidation + Fermata-night — WS2.
- Unified Explore chord/degree surface — WS4.
- Theory-content correctness audit + Explore integration; final disposition of the
  Learn view and the 1,000 exercises — WS5.
