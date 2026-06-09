# CLAUDE.md

## Product Overview

Interactive music theory education platform that teaches through instrument-first pedagogy — theory emerges from playing, not the other way around. Users interact with a virtual piano or guitar fretboard that's always visible at the bottom of the screen, with two main views above it:

- **Explore** — browse scales, chords, intervals, and keys. The Circle of Fifths, scale degree bar, and chord grid let users visualize relationships. Selecting any entity highlights it on the instrument below. Detail panels show staff notation, constituent notes, and related structures.
- **Learn** — structured 9-level curriculum (beginner → advanced) with 118 modules, 1,000+ exercises, spaced repetition review. Progress is tracked per-module.

### Curriculum (9 Levels, 118 Modules)

| Level | Title | Modules | Topics |
|-------|-------|---------|--------|
| L1 | Foundations of Music Literacy | 10 | Staff notation, pitch, rhythm/meter, major scale, basic intervals, major triads |
| L2 | Expanding Fundamentals | 12 | All key signatures, scale degrees, minor scales, compound meter, syncopation, all triad types, inversions, diatonic harmony |
| L3 | Harmony Foundations | 13 | Seventh chords, voice leading, cadences, phrase structure, non-chord tones |
| L4 | Diatonic Mastery | 15 | Advanced non-chord tones, dominant seventh, harmonic function, sequences, counterpoint |
| L5 | Chromaticism & Modulation | 14 | Secondary dominants, tonicization, modulation, mode mixture, musical form |
| L6 | Chromatic Harmony | 12 | Neapolitan chord, augmented sixths, enharmonic modulation, advanced counterpoint |
| L7 | Jazz, Pop & Modal Harmony | 16 | Jazz chord symbols, ii-V-I, modal harmony, pop analysis, scale/chord taxonomy |
| L8 | Analysis, Counterpoint & Post-Tonal | 11 | Fugue analysis, large form, orchestration, set theory, 20th-century techniques |
| L9 | Ear Training & Aural Skills | 15 | Interval recognition, chord ID, melodic dictation, sight singing (parallel track, all levels) |

### Color System

Scale degree function is encoded in color throughout the app:
- Tonic (1) = blue, Supertonic (2) = violet, Mediant (3) = pink
- Subdominant (4) = emerald, Dominant (5) = amber, Submediant (6) = orange, Leading tone (7) = red

---

## Project

**Name:** Music Theory App
**Domain:** Music theory education / interactive instrument
**Stack:** React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4 + Zustand 5 + Framer Motion 12
**Tests:** 793 passing (Vitest + React Testing Library, 35 test files)
**Languages:** English + Portuguese + Spanish (react-i18next + content overlay system)
**PWA:** Offline-capable with Workbox precaching

### Commands

- `npm run dev` — start dev server (localhost:5173)
- `npm run build` — production build to `dist/`
- `npx tsc -b` — type-check (no emit)
- `npx vitest run` — run all tests

### Gotchas

- `src/core/` is copied from the original app at `~/Desktop/studio/projects/Music AI/src/`. Do not modify these files — they're framework-agnostic shared logic.
- TypeScript strictness is relaxed (`noUnusedLocals: false`, `noUnusedParameters: false`) to accommodate copied core files.
- Three core files were removed (queryProcessor, parserRegistry, queryOptionHandler) because they had unresolvable imports to UI components from the old app.
- `visual.ts` has `SynthPresetName` inlined (was imported from a hook in the old app).
- Tailwind v4 uses CSS-first config (`@import "tailwindcss"` in index.css) + `@tailwindcss/vite` plugin.
- Framer Motion uses `<LazyMotion features={domAnimation}>` + `m` component (not `motion`).
- VexFlow 5.0 uses camelCase API: `numBeats`/`beatValue` (not `num_beats`/`beat_value`).

### Architecture

```
src/
  core/              ~40 files, framework-agnostic music theory engine (types, constants, utils)
  design/tokens/     Color system (degree colors, surface colors) + motion tokens
  state/store.ts     Single Zustand store (music, instrument, audio, navigation, preferences)
  state/storeTypes.ts Type definitions for store slices (avoids circular imports)
  state/slices/      Slice creators (musicSlice, instrumentSlice, audioSlice, navigationSlice, preferencesSlice)
  state/progressStore.ts  Zustand curriculum progress (persisted)
  state/toastStore.ts  Standalone toast queue (Zustand, not in main store)
  i18n/              i18next config + locales (en.json, pt.json, es.json) — 366 keys, 35 namespaces
  i18n/content/      Translation overlay system for educational content (lazy-loaded per level)
    types.ts         ContentLanguage, CurriculumLevelOverlay, ExerciseLevelOverlay, TemplateLevelOverlay, SongOverlay
    contentResolver.ts  Pure apply functions (applyCurriculumOverlay, applyExerciseOverlay, etc.)
    overlayLoader.ts    Dynamic import.meta.glob loaders + cache (keyed by lang:levelId)
    levelMetaResolver.ts  Eager translator for 9 level titles/descriptions
    musicTerms.ts       Scale/chord/direction dictionaries (PT + ES)
    pt/              29 files: levelMeta + curriculumL1-L9 + exercisesL1-L9 + templatesL1-L9 + songs (100% complete)
    es/              29 files: levelMeta + curriculumL1-L9 + exercisesL1-L9 + templatesL1-L9 + songs (100% complete)
  components/
    ErrorBoundary    App-level error boundary with auto-recovery
    instruments/     Piano, PianoKey, Fretboard, FretCell, FretboardString, FretboardPositionSelector, InstrumentSelector
    theory/          ScaleDegreeBar, ChordGrid, ChordBrowser, CircleOfFifths (+ circleOfFifthsConstants.ts), ScaleComparison
    panels/          DetailPanel, ChordDetail, ScaleDetail (with staff notation)
    navigation/      KeySelector, QuickSearch (Cmd+K)
    layout/          AppShell, TopBar, Toast, PWAPrompts
    notation/        StaffNotation, StaffNotationSkeleton, useStaffNotation (VexFlow 5.0)
    learn/           LevelsOverview, LevelCard, LevelDetail, LevelIcon, LevelAchievement, UnitCard, UnitDetail, ModuleView, ModuleRow, ReviewQueue, ContinueBanner, LearnBreadcrumb, ProgressBar, DifficultyBadge, Confetti
      exercises/     ExerciseRunner, ExercisePrompt, ExerciseFeedback, ExerciseProgress
        inputs/      ChoiceInput, InstrumentInput
  views/             ExploreView, LearnView
  hooks/             useAudio, useKeyContext, useTheme, usePWA, useLanguage, useLearnProgress, useMediaQuery
  services/          spacedRepetition, conceptTagger, exerciseSelector
  utils/             exportHelpers, notationHelpers, vexflowLoader, midiHelpers, celebrationSound, queryExecutor
  data/
    curriculumLoader.ts      Dynamic import + LEVEL_METADATA (accepts lang param for overlay loading)
    exerciseLoader.ts        Merges hand-authored + generated, lazy-loads per level (accepts lang param)
    songReferences.ts        Module→song reference map (L1–L3, ~80 entries)
    exercises/
      exercisesL1-L9.ts      Hand-authored exercises (~385 total)
      templatesL1-L9.ts      Exercise generation templates (118 modules, 156 templates)
      exerciseGenerator.ts   Seeded PRNG generator (~627 generated, accepts lang for music term translation)
```

**Interaction model:** Instrument-first. Piano/fretboard always visible at bottom. Two views: Explore (theory), Learn (curriculum). Cmd+K for power-user search. Color encodes scale degree function (tonic=blue, dominant=amber, leading=red).

---

## What's Built (Phases 1–12)

### Foundation (Phase 1–3)
- Error boundaries (app-level + per-view with auto-recovery)
- Code-splitting: React.lazy views, curriculum/exercise data lazy-loaded per level
- Fretboard decomposition (657-line monolith → 5 focused files)
- Full accessibility: ARIA roles, keyboard nav, skip-to-content, focus management
- 170+ unit tests for parsers, store, hooks, curriculum helpers

### Performance (Phase 4)
- LearnView bundle: 388 KB → 35 KB initial (9 curriculum chunks on demand)
- Framer Motion: `motion` → `m` + LazyMotion (514 KB → 470 KB main bundle)
- Fretboard: 2D arrow-key navigation, roving tabindex, screen reader announcements

### Curriculum Engine (Phase 5)
- 7 exercise types: note_id, interval_id, scale_build, chord_build, multiple_choice, ear_training, scale_degree_id
- Validation engine reusing core music theory functions
- 2-attempt scoring: 1st try = 1pt, 2nd = 0.5pt, fail = 0. Pass at >= 80%
- ~380 hand-authored exercises across 118 modules in 9 levels

### Features (Phase 6)
- Custom guitar tunings (6 presets, chord shapes gated for non-standard)
- Theme system (dark/light/system, CSS custom properties, full migration)
- PWA (offline, install prompt, update notification, font caching)
- Scale comparison (chromatic diff grid, shared/unique visualization)
- Ear training + scale degree ID exercises
- Print/export (print stylesheet, clipboard copy)
- i18n (English + Portuguese + Spanish, 366 keys, 35 namespaces, language selector)

### Advanced (Phase 7)
- **Spaced repetition:** 6-level intervals (1d→90d), review queue, backfill for pre-SRS modules
- **Exercise generation:** Seeded PRNG templates for 118 modules (~627 generated, ~1,000+ total)
- **Staff notation:** VexFlow 5.0 lazy-loaded (~1,128 KB separate chunk), theme-reactive, integrated in Explore/panels/exercises

### Polish & Reach (Phase 8) — COMPLETE
- **8A:** Self-hosted fonts, toast system, typography tokens
- **8B:** Mobile responsiveness (all views + instruments WCAG-compliant)
- **8C:** Card elevation, empty states, micro-interactions, completion celebrations
- Small-screen optimization: piano keys 36px/130px, fretboard cells 36px/32px rows, compacted chrome, native touch scroll
- AppShell containers: guitar 240px, piano 195px (`overflow-x-hidden overflow-y-auto`), drag-to-scroll disabled on mobile

### Song References (Phase 12) — COMPLETE
- **Song references:** ~80 entries for L1–L3 modules (song + artist + educational context)
- **ModuleView:** "Songs That Use This" card between concepts and exercises sections
- **i18n:** `songRef` key in en.json + pt.json

### Content Translation Overlay System (Phase 12.5) — COMPLETE
- **Architecture:** Lazy-loaded per-language, per-level overlays that merge with English source data at load time
- **Infrastructure:** `src/i18n/content/` — types, contentResolver, overlayLoader (`import.meta.glob`), levelMetaResolver, musicTerms
- **Language threading:** `curriculumLoader`, `exerciseLoader`, `exerciseGenerator` all accept `lang` param; `LearnView` + `LevelsOverview` read language from store
- **Cache isolation:** Cache keys include language (`${lang}:${levelId}`) to prevent cross-language contamination
- **Portuguese:** 100% complete — 29 overlay files (levelMeta + 9×curriculum + 9×exercises + 9×templates + songs)
- **Spanish:** 100% complete — 29 overlay files (levelMeta + 9×curriculum + 9×exercises + 9×templates + songs), 13,310 lines
- **Music term dictionaries:** Scale types, chord qualities, directions for PT + ES (used by exercise generator)
- **Tests:** 45 new tests (contentResolver 22, musicTerms 11, generatorLang 7, levelMetaResolver 5)

### Audit Remediation (Phase 12.6) — COMPLETE
- **React 19 lint compliance:** Fixed Date.now() in render, setState in effects, ref mutations during render, incomplete dep arrays (9 components)
- **Type safety:** Removed all `as any` casts from source files, replaced with proper types (ChordQuality, Record<string, unknown>)
- **Dead code removal:** Unused imports, variables, and functions across 6 source files
- **PWA offline:** Added VexFlow runtime CacheFirst caching to workbox config
- **Code splitting:** Converted celebrationSound to dynamic import in LevelAchievement + ModuleView
- **ESLint config:** Added argsIgnorePattern/varsIgnorePattern for _ prefix convention, excluded src/core from linting
- 793 tests passing, 35 test files. 0 lint errors. 0 type errors.

---

## Current State

The app is now a lean, single-user, Explore-centred personal tool — no accounts, no cloud sync, no gamification. The curriculum and spaced-repetition review are fully functional. Next workstreams: real piano sound for the audio engine, theme consolidation (Fermata theme + a night variant), a unified Explore chord/degree surface, and a theory-content audit.
