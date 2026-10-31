# CLAUDE.md

## Product Overview

Interactive music theory education platform that teaches through instrument-first pedagogy — theory emerges from playing, not the other way around. Users interact with a virtual piano or guitar fretboard that's always visible at the bottom of the screen (hidden in Drill, which owns its vertical space), with three main views above it:

- **Explore** — browse scales, chords, intervals, and keys. The Circle of Fifths, scale degree bar, and chord grid let users visualize relationships. Selecting any entity highlights it on the instrument below. Detail panels show staff notation, constituent notes, and related structures.
- **Learn** — structured 9-level curriculum (beginner → advanced) with 118 modules, 870 exercises (385 authored + 485 generated), spaced repetition review. Progress is tracked per-module. Drill's ~1,321-item bank is a separate product surface — never add it to the curriculum exercise count.
- **Drill** (WS9) — phone-first spaced-retrieval micro-sessions over ~1,321 fundamentals facts (key signatures, circle of fifths, scales, degrees, intervals, triad/seventh spelling both directions, Roman numerals, cadences/function). Per-fact FSRS scheduling (`ts-fsrs`), "by heart" mastery = right on the FIRST answer of each session for 3+ sessions in a row over 2+ calendar days and 18 h+ from first to last, median <3s (decision D-15; one first-answer miss demotes), new facts introduced round-robin across topics, an item and its reverse never back to back (sibling groups, `drillBank/siblings.ts`), enharmonic near-miss feedback, mastery map, optional 60s sprint. The item bank is GENERATED from `src/core/` at runtime (`src/core/utils/drillBank/`) — no authored drill content. State lives in its own persisted store `fermata-drill-v1` (`src/state/drillStore.ts`); deliberately NO coupling to curriculum/module progress, no XP/streaks/badges (spec: docs/superpowers/specs/2026-06-10-fermata-drill-mode-design.md). ts-fsrs must stay out of the entry chunk (ErrorBoundary uses a dynamic import + inlined key literal for its reset path).

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
**Tests:** 6,943 passing (Vitest + React Testing Library, 188 test files; counted 2026-10-31) + Playwright e2e on the dev server and on the production build
**Languages:** English + Portuguese + Spanish (react-i18next + content overlay system)
**PWA:** Offline-capable with Workbox precaching

### Commands

- `npm run dev` — start dev server (localhost:5173)
- `npm run build` — production build to `dist/`
- `npx tsc -b --force` — type-check (ALWAYS `--force`: the incremental cache gives false "clean" results after file deletions/renames; IDE/LSP diagnostics also lag behind edits — trust forced tsc, not stale diagnostics)
- `npx vitest run` — run all tests
- `npm run lint` — eslint (covers src/core too)
- `npm run audit:all` — music-theory content audits (engine + exercises + generated templates); expected steady state: engine 0 serious (4 INFO enharmonic-respell notes), exercises 0, generated 0. Each audit EXITS 1 on a finding (engine: any non-INFO) — they used to exit 0 whatever they found
- `npx vitest run --coverage` — tests + coverage thresholds (vitest.config.ts; enforced only with --coverage; raise, never lower)
- `npm run test:e2e` — Playwright against the dev server (no SW, manifest or CSP there: the PWA and theme-prepaint specs skip). `PW_PORT=5391 …` runs its own server instead of reusing another checkout's on 5173
- `npm run test:e2e:preview` — build, then the same specs against `vite preview` (`playwright.preview.config.ts`, `PW_PREVIEW_PORT`); preview serves vercel.json's security headers, so these run under the production CSP
- `npm run check:bundle` (after a build) — entry JS < 500 kB, ts-fsrs out of the entry, Fretboard / Quick Search in their own chunks, Bravura-only VexFlow, every inline `<script>` in the built index.html allowed by a CSP hash
- `npm run check:sw` (after a build) — every JS/CSS chunk precached or runtime-cached, precache closure (a precached file's static imports are precached), every translated-content chunk on the content-cache route
- CI (`.github/workflows/audit.yml`) runs all of the above on every push / PR to main

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
- VexFlow loads its music fonts as base64 `data:` FontFaces at runtime — the CSP in `vercel.json` must keep `font-src 'self' data:` or production notation renders missing-glyph boxes (the dev server has no CSP; `vite preview` and the preview e2e run do). Notation imports `vexflow/bravura` (Bravura + Academico only — the same fonts the full entry selects; `vexflowBravuraParity.test` proves identical SVG).
- `index.html` has ONE inline script (applies the saved night theme before first paint). The CSP allows it by its exact sha256 hash in `vercel.json` — any edit to that script, even whitespace, needs the new hash (`documentShell.test.ts` and `check:bundle` fail until it matches; production would silently block it).
- Header-only deploys never reach installed PWAs: the service worker precaches `index.html` WITH its response headers, and identical content means no SW update. Any `vercel.json` header change must be paired with a content change (e.g. the build comment atop `index.html`).
- **KEEP the transition skipWaiting ON until 2026-11-14, then remove it in the first release after that date** (review B2; policy corrected 2026-10-31). Every release in that window ships workbox `skipWaiting: true` (`ONE_OFF_SKIP_WAITING` + `ONE_OFF_SKIP_WAITING_EXPIRES` in `vite.config.ts`). Why: installed clients still on the old autoUpdate page code only listen for the worker's `activated` event (then reload) and never send SKIP_WAITING, so a prompt-mode worker would wait unseen until every window closed. With skipWaiting on, such a client takes whichever release it meets next and reloads as before; turning it off in the release right after W9 would strand any client that had not yet loaded a skipWaiting release. Effect while on: a hotfix activates at once under pages already on a newer build — they don't reload, may hit files the deploy removed until the next reload, and "Try again" recovers. Removal (first release after 2026-11-14): set `ONE_OFF_SKIP_WAITING = false`, drop the transition branch in `e2e/pwa.spec.ts`, delete this note. `src/__tests__/oneOffSkipWaiting.test.ts` turns RED on 2026-11-15 while it is still on — intentionally, for every PR, until it is removed.
- App updates are `registerType: 'prompt'` (W9-06; fully in force from the first release after 2026-11-14 — see the note above): a new service worker waits; the "new version — reload" toast asks; its Reload activates the waiting worker and the page reloads when it takes control (`usePWA.applyUpdateOrReload`; a plain `location.reload()` would be served the OLD precached index.html). The app itself never reloads unasked, BUT accepting the update in one tab also reloads the app's other open tabs (vite-plugin-pwa reloads every tab when the new worker takes control — plugin design), and until 2026-11-14 the transition skipWaiting lets old autoUpdate clients reload themselves. Updates are re-checked when the app returns to the foreground; "Try again" on a view whose file 404s asks the server for the new version first, so one tap is enough.
- Precache: the shell's entry chunks — including the Explore and Learn views, StaffNotation, the Fretboard and Quick Search — are listed in `vite.config.ts` globPatterns; their static imports are added automatically (manifestTransforms closure). Translated-content chunks are named `i18n-*` (chunkFileNames) and runtime-cached by the content-cache route. On a first visit, whatever the page loaded before the worker took control (VexFlow, an early level, samples) is re-fetched through it (`usePWA.warmRuntimeCaches`) so it is cached for offline. Run `npm run check:sw` after changing chunking; `e2e/offline-after-visit.spec.ts` (preview) proves the app opens with every request blocked.
- PWA toasts (update / offline-ready / install) render in ONE stack (`PWAPrompts`), update first — never give a toast its own fixed position.
- **Fretboard orientation is SETTLED — do not "fix" it.** It renders nut-RIGHT, low E on top (mirrored from printed chord charts). A flip to textbook orientation was shipped and **reverted on Nuno's feedback** (2026-06-09): he reads the original natively. Position legibility is handled instead by the anchor-fret badge ("3fr") + nut-closest default voicing for chords, and the Roman-numeral badge for scale positions (see Audio & instruments below).
- **Spelling is one engine** (`src/core/utils/degreeSpelling.ts`, W1/W2 2026-10-30): note names, degree labels and colours (read from the spelled letter), interval names, key signatures, staff octaves/accidentals and the key picker's root names all go through it — never derive a label from a semitone count or a note's position in a list. Staves that show what the instrument plays (Explore, `followInstrument`) write the guitar an octave above sounding (treble-8vb, D-05); Learn exercise staves are AUTHORED notation and are never transposed for the instrument; chords sound exactly the voicing the piano lights (`chordVoicingPitches` in `pianoLayout.ts`).
- PT overlay files carry full PT-PT diacritics (restored 2026-07-24) — write proper European Portuguese orthography in every edit; conventions in `docs/pt-diacritic-todo.md`.
- The i18n content overlays REPLACE English text wholesale (keyed by module id + array index). Every English curriculum/template edit needs hand-mirrored PT + ES edits; `templateParity.test.ts` enforces token parity and will fail the suite if overlays drift.
- **English edits are gated (W6-14):** `sourceHashes.test.ts` fails when an English curriculum/exercise/template/song/level string changes after its PT/ES translation was last checked (hashes in `src/i18n/content/sourceHashes.json`). Update the PT/ES text, then `npm run i18n:rehash -- <pt|es|all> <key-prefix>` (it prints every key it re-records and refuses a bare `all` without `--force-all`; keys like `cur:l4u14m1`, `ex:l3u11m1e2`, `tm:l2u7m4[0]`). `structuralParity.test.ts` checks keys/counts/placeholders. Overlay titles feed Cmd+K: after changing a PT/ES module title run `npm run i18n:module-titles`. PT/ES house style (letters for note names, D-18; one term per concept, D-19; `3.ª` ordinals; tu-form) is enforced by `noteNames`/`terminology`/`orthography` tests — see `docs/pt-diacritic-todo.md`.

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
    ViewSlot         Code-split view behind its own boundary; "Try again" really retries a failed download (fresh lazy(), or reload/apply-update when online)
    instruments/     Piano, PianoKey, Fretboard, FretCell, FretboardString, FretboardPositionSelector, InstrumentSelector
    theory/          ScaleDegreeBar, ChordGrid, ChordBrowser, ChordWorkspace, ChordBuilderPanel, ChromaticStrip, CircleOfFifths (+ circleOfFifthsConstants.ts), ScaleComparison
    panels/          CurrentChordPanel, LearnMoreButton
    navigation/      KeySelector, QuickSearch (Cmd+K; lazy chunk), QuickSearchHost (owns Cmd/Ctrl+K until search first opens; a failed download is retried on the next open)
    layout/          AppShell, TopBar, Toast, PWAPrompts
    notation/        StaffNotation, StaffNotationSkeleton, useStaffNotation (VexFlow 5.0)
    learn/           LevelsOverview, LevelCard, LevelDetail, LevelAchievement, UnitCard, UnitDetail, ModuleView, ModuleRow, ReviewQueue, ContinueBanner, LearnBreadcrumb, ProgressBar, DifficultyBadge, Confetti, ScreenFrame (a Learn screen; inert while it animates out)
      exercises/     ExerciseRunner, ExercisePrompt, ExerciseFeedback, ExerciseProgress
        inputs/      ChoiceInput, InstrumentInput
  views/             ExploreView, LearnView
  hooks/             useAudio, useKeyContext (incl. exercise-input mode), useTheme, usePWA (prompt-mode updates), useLanguage, useLearnProgress, useMediaQuery, useDegreeColors, useStopPlaybackOnViewChange
  services/          spacedRepetition, exerciseSelector, synthConfig (FM fallback voice),
                     pianoSampler (sampled piano), guitarSampler (sampled guitar),
                     karplusStrong (guitar fallback engine), instrumentVoices (registers the
                     selected instrument's voice into core audio; samples load on first use)
  utils/             exportHelpers, notationHelpers, vexflowLoader, midiHelpers, celebrationSound,
                     queryExecutor (Try-This executor — routes through the core parsers; contract-tested
                     against every curriculum tryThisQuery)
  data/
    curriculumLoader.ts      Dynamic import + LEVEL_METADATA (accepts lang param for overlay loading)
    exerciseLoader.ts        Merges hand-authored + generated, lazy-loads per level (accepts lang param)
    moduleIndex.ts           Static 118-module search index (Cmd+K lesson hits)
    nextModule.ts            Continue-banner module from the static index (no level download; equivalence-tested)
    qualityToModule.ts       Static ChordQuality→moduleId map for "Learn about this" deep links
    songReferences.ts        Module→song reference map (L1–L3 + l4u14m2, ~70 entries)
    exercises/
      exercisesL1-L9.ts      Hand-authored exercises (~385 total)
      templatesL1-L9.ts      Exercise generation templates (118 modules, 156 templates)
      exerciseGenerator.ts   Seeded PRNG generator (485 generated, accepts lang for music term translation)
```

**Interaction model:** Instrument-first. Piano/fretboard always visible at bottom. Two views: Explore (theory), Learn (curriculum). Cmd+K for power-user search. Color encodes scale degree function (tonic=blue, dominant=amber, leading=red).

### Audio & instruments (state as of 2026-10-30)

- **Piano sound = sampled Salamander Grand** (30 mp3s, minor-third ladder A0–C8, ~2 MB,
  CC-BY-3.0 — `public/samples/piano/` + LICENSE.txt; credited in README).
  `src/services/pianoSampler.ts` is the engine; `instrumentVoices.ts`
  (`registerInstrumentVoices()`, called in `main.tsx`) registers it into core audio via
  the `setInstrumentVoice()` seam in `src/core/services/audio.ts`. EVERY piano path
  (keyboard sustain, chord/arpeggio/scale playback, ear training) goes through core
  `playNote`/`startSustainedNote`, which try the sampler first and fall back to the FM
  synth (`synthConfig.ts` WARMTH_OVERRIDES) until samples decode — so sound is never
  silent, including a first visit offline. Samples are runtime-cached CacheFirst
  (`piano-samples` cache) for offline reuse.
- **Guitar sound = sampled FreePats Spanish classical guitar** (`public/samples/guitar/`,
  39 mp3s, ~1.7 MB, licence in LICENSE.txt; `src/services/guitarSampler.ts`), with
  **Karplus-Strong** (`src/services/karplusStrong.ts`) as the fallback while samples decode
  or when offline-uncached — the guitar voice never declines, so the FM synth never sounds
  in guitar mode. Runtime-cached in `guitar-samples`.
- **Samples download on first use (W8-03):** only the selected instrument's bank, on the
  first tap / key press or the first note asked for (the other bank when the learner
  switches) — not on page load.
- **Stopping playback (W8-01):** a new playback (Explore Play, chord panel, Circle of
  Fifths, chord builder, Drill reveal) calls core `cancelScheduledAudio()` first, and a
  view change cancels too. Core settles a cancelled scale/arpeggio/sequence's visuals:
  pending key highlights are dropped and its onComplete clean-up runs at once.
- **Fretboard chord display:** shapes default to the NUT-CLOSEST voicing (position chips
  sorted the same way), and the anchor fret (lowest fretted note = the barre) wears a bold
  accent badge ("3fr") above the board plus an accented number below. This is the fix for
  "every barre shape looks identical"; orientation itself is nut-right by Nuno's explicit
  preference (see Gotchas). Anchor math must use ABSOLUTE frets (baseFret + pos.fret>0
  filter is wrong: transposed open shapes encode the barre as open strings + baseFret).
  Every displayed shape passes `isPlayableChordShape` (one finger per fret, no barre over
  open strings, ≤ fret 15); inversions / slash chords put the requested bass lowest when a
  grip allows it, else the board says so (`arrangeShapesForBass`). Default order is
  `sortShapesForDefault` (nut-closest; the C-/G-shape major barres are offered, never the
  default — a test pins main's default grip for all 24 major/minor triads).
- **Fretboard scale positions (W3, 2026-10-30, decision D-02):** classical positions
  Open + I–XII GENERATED from the scale engine for any tuning
  (`src/core/utils/guitarPositions.ts` — 4-fret window, one finger per fret, one-sided
  stretch only to keep the scale continuous, exhaustive oracle test). On a stretched
  string the hand spreads (e.g. frets 5-6-8-9 = fingers 1-2-3-4) so no finger plays two
  frets — true for every scale except the chromatic (five notes on one string). Strings a
  5th apart (Drop D, DADGAD, open tunings) leave one note out of reach; the UI says so.
  The default view is
  a position (lowest holding the root on string 6/5), "All" = whole neck; the choice
  persists across key/scale/tuning changes and reloads (`guitarScalePosition`: 0–12 |
  'all' | null = automatic). Dots show fingers / degrees / notes; fingering overrides
  (teacher's fingerings) live in `src/state/fingeringStore.ts` (`fermata-fingering-v1`,
  in the backup file; ErrorBoundary carries the key as a literal, like the drill key). The
  hand-typed CAGED/3NPS library was deleted, not repaired. The guitar dock is content-sized
  on desktop (`AppShell`; the piano keeps 260 px) — a fixed height hid the high-E string
  under the wrapped controls; `e2e/fretboard-fit.spec.ts` measures it in a real browser.
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
- Custom guitar tunings (6 presets, chord shapes gated for non-standard — the board shows the chord's notes + a notice; scale positions work in every tuning)
- Theme system (fermata day + fermata-night, CSS custom properties, full migration)
- PWA (offline, install prompt, update notification — reachable since W9-06's prompt mode, font caching)
- Scale comparison (chromatic diff grid, shared/unique visualization)
- Ear training + scale degree ID exercises
- Print/export (print stylesheet, clipboard copy)
- i18n (English + Portuguese + Spanish, 366 keys, 35 namespaces, language selector)

### Advanced (Phase 7)
- **Spaced repetition:** 6-level intervals (1d→90d), review queue, backfill for pre-SRS modules
- **Exercise generation:** Seeded PRNG templates for 118 modules (485 generated, 870 total)
- **Staff notation:** VexFlow 5.0 Bravura-only entry lazy-loaded (~728 kB separate chunk, was ~1,128 kB with five fonts), theme-reactive, integrated in Explore/panels/exercises

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
the phone-first Drill view: all functional, all gates green (6,943 tests / 188 files on
2026-10-31, eslint 0/0, content audits clean).

WS9 details worth knowing: drill bank generated from core (`drillBank/` directory
module, ~1,321 items, token/params contract-tested against the i18n templates);
`drillScheduler` wraps ts-fsrs (request_retention 0.9, Easy never granted);
`drillSession` composes due→learning→new→confidence with seeded shuffles; persist
key `fermata-drill-v1` v2 (W7: v1 "by heart" tiers re-judged on load, never
promoted) with per-entry shape guards (one bad record drops only itself); PT/ES
Drill text is translated at render time by `components/drill/drillText.ts` (the
bank keeps English strings as grading values); main store persist bumped
v6 (`lastView` restore + `?view=` boot param + PWA "Start Drill" shortcut).

**Open items, in rough priority:**
- Drill why-templates `functionPull` / `seventhLadder` embed English clause params
  inside translated sentences (works, reads mixed) — proposed v2: keyed short tokens
  translated per-language; needs an EN-side generator refactor. Nuno to judge on
  the preview whether it bothers him.
- Interval labels and seventh-chord quality names render in English inside PT/ES
  Drill/feedback sentences (nomenclature convention). Since W7 (decision D-17) key,
  scale and triad names, degree / function / cadence names and Yes/No ARE
  translated in the Drill.
- The L6/L7 "Learn about this" gap: scales/modes/intervals have no deep link (only
  chords do, via qualityToModule).
- Welcome banner in LevelsOverview is unreachable (fresh users always get the Continue
  card — since W9-19 even offline, built from the static module index) — harmless;
  remove or repurpose someday.
