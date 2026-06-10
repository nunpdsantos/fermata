# CLAUDE.md

## Product Overview

Interactive music theory education platform that teaches through instrument-first pedagogy — theory emerges from playing, not the other way around. Users interact with a virtual piano or guitar fretboard that's always visible at the bottom of the screen (hidden in Drill, which owns its vertical space), with three main views above it:

- **Explore** — browse scales, chords, intervals, and keys. The Circle of Fifths, scale degree bar, and chord grid let users visualize relationships. Selecting any entity highlights it on the instrument below. Detail panels show staff notation, constituent notes, and related structures.
- **Learn** — structured 9-level curriculum (beginner → advanced) with 118 modules, 1,000+ exercises, spaced repetition review. Progress is tracked per-module.
- **Drill** (WS9) — phone-first spaced-retrieval micro-sessions over ~1,315 fundamentals facts (key signatures, circle of fifths, scales, degrees, intervals, triad/seventh spelling both directions, Roman numerals, cadences/function). Per-fact FSRS scheduling (`ts-fsrs`), "by heart" mastery = correct + <3s median across 3 distinct sessions, enharmonic near-miss feedback, mastery map, optional 60s sprint. The item bank is GENERATED from `src/core/` at runtime (`src/core/utils/drillBank/`) — no authored drill content. State lives in its own persisted store `fermata-drill-v1` (`src/state/drillStore.ts`); deliberately NO coupling to curriculum/module progress, no XP/streaks/badges (spec: docs/superpowers/specs/2026-06-10-fermata-drill-mode-design.md). ts-fsrs must stay out of the entry chunk (ErrorBoundary uses a dynamic import + inlined key literal for its reset path).

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
**Tests:** ~2,286 passing (Vitest + React Testing Library, 48 test files)
**Languages:** English + Portuguese + Spanish (react-i18next + content overlay system)
**PWA:** Offline-capable with Workbox precaching

### Commands

- `npm run dev` — start dev server (localhost:5173)
- `npm run build` — production build to `dist/`
- `npx tsc -b --force` — type-check (ALWAYS `--force`: the incremental cache gives false "clean" results after file deletions/renames; IDE/LSP diagnostics also lag behind edits — trust forced tsc, not stale diagnostics)
- `npx vitest run` — run all tests
- `npm run lint` — eslint (covers src/core too)
- `npm run audit:all` — music-theory content audits (engine + exercises + generated templates); expected steady state: engine 0 serious (4 INFO enharmonic-respell notes), exercises 0, generated 0
- `npm run test:e2e` — Playwright (manifest test self-skips against the dev server)

### Deploy & conventions

- Vercel auto-deploys `main` → https://fermata-music.vercel.app (production). Any pushed branch gets a preview. Verify a deploy by comparing the live `index-*.js` bundle hash against a local `npm run build` of the same commit.
- One workstream = one branch → PR → squash-merge + delete branch. Direct pushes to `main` are fine for small fixes Nuno has asked for.
- Perceptual changes (sound, look) cannot be verified by an agent — ship behind green gates, then ask Nuno to judge with his eyes/ears, and iterate.
- WS6 decisions log (D1–D20: every editorial/content call and its rationale): `docs/superpowers/plans/2026-06-09-ws6-hardening.md`.

### Gotchas

- `src/core/` is fermata-owned (the original shared source project was deleted); it is the framework-agnostic theory engine — edit freely but keep it framework-agnostic.
- TypeScript strictness is fully on (`noUnusedLocals: true`, `noUnusedParameters: true` since WS6); prefix genuinely-needed-but-unused params with `_`.
- Three core files were removed (queryProcessor, parserRegistry, queryOptionHandler) because they had unresolvable imports to UI components from the old app.
- `visual.ts` has `SynthPresetName` inlined (was imported from a hook in the old app).
- Tailwind v4 uses CSS-first config (`@import "tailwindcss"` in index.css) + `@tailwindcss/vite` plugin.
- Framer Motion uses `<LazyMotion features={domAnimation}>` + `m` component (not `motion`).
- VexFlow 5.0 uses camelCase API: `numBeats`/`beatValue` (not `num_beats`/`beat_value`).
- VexFlow loads its music fonts as base64 `data:` FontFaces at runtime — the CSP in `vercel.json` must keep `font-src 'self' data:` or production notation renders missing-glyph boxes (dev has no CSP, so local checks won't catch it).
- Header-only deploys never reach installed PWAs: the service worker precaches `index.html` WITH its response headers, and identical content means no SW update. Any `vercel.json` header change must be paired with a content change (e.g. the build comment atop `index.html`).
- **Fretboard orientation is SETTLED — do not "fix" it.** It renders nut-RIGHT, low E on top (mirrored from printed chord charts). A flip to textbook orientation was shipped and **reverted on Nuno's feedback** (2026-06-09): he reads the original natively. Position legibility is handled instead by the anchor-fret badge ("3fr") + nut-closest default voicing (see Audio & instruments below).
- PT overlay files vary in diacritic usage (older files are diacritic-free) — match each file's existing style when editing; full restoration is tracked in `docs/pt-diacritic-todo.md`.
- The i18n content overlays REPLACE English text wholesale (keyed by module id + array index). Every English curriculum/template edit needs hand-mirrored PT + ES edits; `templateParity.test.ts` enforces token parity and will fail the suite if overlays drift.

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
    theory/          ScaleDegreeBar, ChordGrid, ChordBrowser, ChordWorkspace, ChordBuilderPanel, ChromaticStrip, CircleOfFifths (+ circleOfFifthsConstants.ts), ScaleComparison
    panels/          CurrentChordPanel, LearnMoreButton
    navigation/      KeySelector, QuickSearch (Cmd+K)
    layout/          AppShell, TopBar, Toast, PWAPrompts
    notation/        StaffNotation, StaffNotationSkeleton, useStaffNotation (VexFlow 5.0)
    learn/           LevelsOverview, LevelCard, LevelDetail, LevelAchievement, UnitCard, UnitDetail, ModuleView, ModuleRow, ReviewQueue, ContinueBanner, LearnBreadcrumb, ProgressBar, DifficultyBadge, Confetti
      exercises/     ExerciseRunner, ExercisePrompt, ExerciseFeedback, ExerciseProgress
        inputs/      ChoiceInput, InstrumentInput
  views/             ExploreView, LearnView
  hooks/             useAudio, useKeyContext (incl. exercise-input mode), useTheme, usePWA, useLanguage, useLearnProgress, useMediaQuery, useDegreeColors
  services/          spacedRepetition, exerciseSelector, synthConfig (FM fallback voice),
                     karplusStrong (guitar engine), pianoSampler (sampled piano engine),
                     pianoVoiceRegistration (wires sampler into core audio at boot)
  utils/             exportHelpers, notationHelpers, vexflowLoader, midiHelpers, celebrationSound,
                     queryExecutor (Try-This executor — routes through the core parsers; contract-tested
                     against every curriculum tryThisQuery)
  data/
    curriculumLoader.ts      Dynamic import + LEVEL_METADATA (accepts lang param for overlay loading)
    exerciseLoader.ts        Merges hand-authored + generated, lazy-loads per level (accepts lang param)
    moduleIndex.ts           Static 118-module search index (Cmd+K lesson hits)
    qualityToModule.ts       Static ChordQuality→moduleId map for "Learn about this" deep links
    songReferences.ts        Module→song reference map (L1–L3 + l4u14m2, ~70 entries)
    exercises/
      exercisesL1-L9.ts      Hand-authored exercises (~385 total)
      templatesL1-L9.ts      Exercise generation templates (118 modules, 156 templates)
      exerciseGenerator.ts   Seeded PRNG generator (~627 generated, accepts lang for music term translation)
```

**Interaction model:** Instrument-first. Piano/fretboard always visible at bottom. Two views: Explore (theory), Learn (curriculum). Cmd+K for power-user search. Color encodes scale degree function (tonic=blue, dominant=amber, leading=red).

### Audio & instruments (state as of 2026-06-09)

- **Piano sound = sampled Salamander Grand** (30 mp3s, minor-third ladder A0–C8, ~2 MB,
  CC-BY-3.0 — `public/samples/piano/` + LICENSE.txt; credited in README).
  `src/services/pianoSampler.ts` is the engine; `pianoVoiceRegistration.ts` (called in
  `main.tsx`) registers it into core audio via the `setPianoVoice()` seam in
  `src/core/services/audio.ts`. EVERY piano path (keyboard sustain, chord/arpeggio/scale
  playback, ear training) goes through core `playNote`/`startSustainedNote`, which try the
  sampler first and fall back to the FM synth (`synthConfig.ts` WARMTH_OVERRIDES) until
  samples decode — so sound is never silent, including a first visit offline. Samples are
  runtime-cached CacheFirst (`piano-samples` cache) for offline reuse.
- **Guitar sound = Karplus-Strong** (`src/services/karplusStrong.ts`) — separate engine,
  separate AudioContext, untouched by the sampler work.
- **Fretboard chord display:** shapes default to the NUT-CLOSEST voicing (position chips
  sorted the same way), and the anchor fret (lowest fretted note = the barre) wears a bold
  accent badge ("3fr") above the board plus an accented number below. This is the fix for
  "every barre shape looks identical"; orientation itself is nut-right by Nuno's explicit
  preference (see Gotchas). Anchor math must use ABSOLUTE frets (baseFret + pos.fret>0
  filter is wrong: transposed open shapes encode the barre as open strings + baseFret).
- **Exercise instrument input:** `useKeyContext` has an exercise-input mode
  (`exerciseInputActive` in the instrument slice) that suppresses Explore's scale/chord
  visuals during exercises and surfaces the learner's toggled notes through the
  chord-highlight channel on every octave.
- **One-shot playback follows the selected instrument (WS8, 2026-06-10).** Core's
  voice seam is now `InstrumentVoice`/`setInstrumentVoice()` (was PianoVoice);
  `src/services/instrumentVoices.ts` registers the sampler-backed piano voice or a
  Karplus-Strong-backed guitar voice per `store.instrument` (persisted — boot can
  land on either) and re-registers on change, pushing the session volume into the
  swapped-in voice. Explore play buttons, Circle of Fifths, **ear training**
  (Nuno's call, 2026-06-10) and the celebration fanfare all follow. The FM synth
  remains the piano-only fallback while samples decode; the guitar voice never
  declines, so no synth leak in guitar mode.
  `karplusStrong.playNote(midi, when, duration, velocity)` is the scheduled
  one-shot (gain = velocity × 0.9; 0.3 s finger-lift release after duration;
  buffer capped to ~duration + 0.5 s for cheap scheduling). KS `setVolume` now
  remembers a value set before the chain exists (latent fix).

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
- Theme system (fermata day + fermata-night, CSS custom properties, full migration)
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

### Hardening & Sound (WS6–WS7, 2026-06-09) — COMPLETE
- **WS6** (PR #12 + follow-ups): all 8 CORE-ESCALATION theory bugs fixed at the source
  (src/core became fermata-owned — the shared Music AI project no longer exists);
  C-item editorial queue settled (decisions log D1–D20 in docs/superpowers/plans/);
  Try-This executor rebuilt on the core parsers (was ~60% dead buttons); "Learn about
  this" now uses the static quality→module map; exercise input wired to the instruments;
  9 PT/ES mis-grading templates repaired + templateParity test (1,400 assertions);
  real security headers via vercel.json; persisted-state shape guards + reset-app-data;
  22 dead modules deleted; eslint covers src/core; npm audit 0; docs rewritten.
- **Production hotfixes learned the hard way:** CSP must allow `data:` fonts (VexFlow),
  and header-only deploys never reach installed PWAs (see Gotchas — both documented).
- **WS7 (sound + fretboard):** sampled Salamander piano replaced the FM synth voice
  (see Audio & instruments); fretboard chord display gained nut-closest default voicings
  + the anchor-fret badge after the orientation flip experiment was reverted on Nuno's
  feedback.
- **WS8 (2026-06-10):** one-shot playback follows the selected instrument — core
  seam renamed to `InstrumentVoice`, KS gained a scheduled one-shot, registration
  (`instrumentVoices.ts`) tracks the store. Ear training follows the instrument
  (decided with Nuno). Also fixed: KS volume set before the first note now applies.
  First direct contract tests for the core audio seam
  (`src/core/services/__tests__/audio.test.ts`).

---

## Current State

The app is a lean, single-user personal tool — no accounts, no cloud sync, no
gamification. Curriculum, exercises, spaced repetition, trilingual content, offline
PWA, sampled piano, instrument-aware playback, and (WS9, branch `ws9-drill-mode`)
the phone-first Drill view: all functional, all gates green (≈2,642 tests / 71 files,
eslint 0/0, content audits clean).

WS9 details worth knowing: drill bank generated from core (`drillBank/` directory
module, ~1,315 items, token/params contract-tested against the i18n templates);
`drillScheduler` wraps ts-fsrs (request_retention 0.9, Easy never granted);
`drillSession` composes due→learning→new→confidence with seeded shuffles; persist
key `fermata-drill-v1` v1 with WS6-style shape guards; main store persist bumped
v6 (`lastView` restore + `?view=` boot param + PWA "Start Drill" shortcut).

**Open items, in rough priority:**
- Drill why-templates `functionPull` / `seventhLadder` embed English clause params
  inside translated sentences (works, reads mixed) — proposed v2: keyed short tokens
  translated per-language; needs an EN-side generator refactor. Nuno to judge on
  the preview whether it bothers him.
- PT diacritics restoration across the older overlay files (`docs/pt-diacritic-todo.md`).
- Chord-quality names / interval labels render in English inside PT/ES feedback
  sentences (deliberate "nomenclature untranslated" convention — revisit only as a
  product decision).
- The L6/L7 "Learn about this" gap: scales/modes/intervals have no deep link (only
  chords do, via qualityToModule).
- Welcome banner in LevelsOverview is unreachable (fresh users always get the Continue
  card) — harmless; remove or repurpose someday.
