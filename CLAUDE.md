# CLAUDE.md

## Product Overview

Interactive music theory education platform that teaches through instrument-first pedagogy — theory emerges from playing, not the other way around. Users interact with a virtual piano or guitar fretboard that's always visible at the bottom of the screen (hidden in Drill, which owns its vertical space), with three main views above it:

- **Explore** — browse scales, chords, intervals, and keys. The Circle of Fifths, scale degree bar, and chord grid let users visualize relationships. Selecting any entity highlights it on the instrument below. Detail panels show staff notation, constituent notes, and related structures.
- **Learn** — structured 9-level curriculum (beginner → advanced) with 118 modules, 918 exercises (387 authored + 531 generated), spaced repetition review. Progress is tracked per-module. Drill's ~1,321-item bank is a separate product surface — never add it to the curriculum exercise count.
- **Drill** (WS9) — phone-first spaced-retrieval micro-sessions over ~1,321 fundamentals facts (key signatures, circle of fifths, scales, degrees, intervals, triad/seventh spelling both directions, Roman numerals, cadences/function). Per-fact FSRS scheduling (`ts-fsrs`), "by heart" mastery = right on the FIRST answer of each session for 3+ sessions in a row over 2+ calendar days and 18 h+ from first to last, median <3s (decision D-15; one first-answer miss demotes), new facts introduced round-robin across topics, an item and its reverse never back to back (sibling groups, `drillBank/siblings.ts`), enharmonic near-miss feedback, mastery map, optional 60s sprint. The item bank is GENERATED from `src/core/` at runtime (`src/core/utils/drillBank/`) — no authored drill content. State lives in its own persisted store `fermata-drill-v1` (`src/state/drillStore.ts`, persist v3 since W9b: a reload — an app update, the OS killing the page — resumes a session ON the question on screen, verdict included, with its summary tally, and a Sprint with the same questions, score and time left); deliberately NO coupling to curriculum/module progress, no XP/streaks/badges (spec: docs/superpowers/specs/2026-06-10-fermata-drill-mode-design.md). ts-fsrs must stay out of the entry chunk (ErrorBoundary uses a dynamic import + inlined key literal for its reset path).

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
- Degree hues are FILLS with dark ink on them (`--on-degree`, 5.8–9.6:1) — never a hue as text on cream (1.3–2.4:1). Coloured text uses the ink tokens `--deg-ink-1…7` (800 shades by day, 400 at night; `DEGREE_INKS` / `inkFor()` in `design/tokens/colors.ts`).

### Design system v2 (W11-A, 2026-10-31, decision D-28 "Editorial")

Tokens and component classes live in `src/index.css`; components in `src/components/ui/`. Mockups: the design review's `system.html` / `phone-shell.html` (Option A).
- **Type — five steps, nothing below 12 px:** caption 12 · ui 14 · body 16 · title 20 · display 28 (italic serif, `.learn-serif`). Defined ONCE in `@theme static` in Tailwind v4's `--text-*` namespace (`text-caption/ui/body/title/display`; Tailwind's stock `text-xs…3xl` are mapped onto the same five steps). There is no `text-2xs` (it was v3 `--font-size-*` naming: no CSS, it inherited 16 px) and no arbitrary `text-[Npx]` below 12 — `design/__tests__/typeScale.test.ts` fails on either, and on any inline `fontSize` < 12. Section labels: `.type-section` / `.type-label` = 14 px small caps. All Source Serif (`font-mono` too, with tabular figures).
- **Controls:** `--tap` = 36 px with a mouse, 44 px under `(pointer: coarse)` — every Button, chip, segment, select, list row, menu item and top-bar tab is at least that.
- **TWO selected states, and only two:** CHOICE CHIP (one value out of many — root, scale, octave, guitar position, chord shape, CoF minor variant): `ChipGroup`, a radiogroup, selected = solid `--accent` + `--on-accent`. SEGMENT (switches a view — Piano/Guitar, Fingers/Degrees/Notes, Day/Night/Auto, languages, Diatonic/All/Build, the app tabs): `Segment`, radiogroup or (only where it switches panels) tablist, selected = page colour + `--seg-on-border` edge (≥ 3:1). One keyboard pattern for both (`ui/roving.ts`): one Tab stop, arrows move AND select, Home/End.
- **Other tokens:** `--accent-text` for accent-coloured text (`--accent` itself is 4.45:1 on cream), `--focus-outline` (keyboard focus), `--piano-label` (≥ 4.5:1 on the ivory keys in both themes; a black key's label is `--piano-white`, 14:1). Toasts and the info tone use tokens, not the old Tailwind blue (`palette.accent` is still the L1 level hue only).
- **Components (`src/components/ui/`):** Button (primary / secondary / quiet / link; `IconButton` needs an aria-label; `buttonClass()` for an `<a>`), ChipGroup + ChoiceChip (aria-pressed toggle), Segment, SelectTrigger (native select as a pill), Card, ListRow, Badge (12 px, ink text), Feedback (correct / wrong / near-miss card: tone edge, title, hint, "Learn about this →"), Sheet (modal: focus in, Tab trap, Escape / scrim / drag closes, focus returned), DetentSheet (non-modal, Peek / Half / Full, a window-splitter handle: drag, tap, ↑↓ Home End Enter), Menu (the "⋯" menu button).
- **Shell (`components/layout/`):** TopBar = Fermata · tabs (a tabs-mode Segment: the highlight is the selected tab itself — nothing is measured, so it cannot drift on font load / resize / rotation / language change) · search · "⋯" Menu → **SettingsSheet** (Language, Theme Day / Night / Auto, Your data Export / Import with the W9 per-store vetting, footer "Fermata · build <date> · works offline" — date from vite `define` `__BUILD_DATE__` via `src/buildInfo.ts`; "works offline" only while a service worker controls the page). **InstrumentDock**: phones AND short screens (`SHEET_QUERY` in `hooks/useMediaQuery.ts` = `(max-width: 639px), (max-height: 500px)`, mirrored in index.css — a phone in landscape got 0–6 px of view under a docked panel) = DetentSheet (its Show / Hide is an icon button; the context line wraps, never ellipsizes); otherwise a docked panel that collapses to its bar; bar = Piano/Guitar + context line ("Position II", "C4 · 1 octave"; the fretboard publishes its position in `state/dockContextStore.ts`) + Show / Hide. Detent per view is persisted (`dockDetents`, shape-guarded); Learn rests at Peek (D-20). **API: `useAppStore.getState().requestDock('half' | 'peek' | 'full')`** (no-op in Drill) — an instrument-input exercise already calls it. **ToastRegion** (rendered by AppShell right under TopBar): the ONE place toasts render, PWA stack first. It is a fixed OVERLAY under the top bar — never in the page flow, so no page content moves when a toast comes or goes (0 px in the e2e; round 3's in-flow band shifted the keys / answers up to 269 px). The toasts themselves do re-lay out: when one leaves, the cards below it close up inside the overlay, which registers a small CLS of its own — 0.010–0.012 on phone / landscape in the review's measurement, 0.001–0.009 in ours — bounded by `layout/toastLayout.ts`: elements registered with `useToastAvoid` (the dock / sheet wrapper, Drill's answers, the Sprint input) are never covered; it publishes `--toast-top` / `--toast-room`, the region scrolls when the stack is taller. The phone sheet's Full leaves one toast's room above it (`fullGap` = tap + 32 px), so a toast at Full covers neither the bar nor the keys; Half never leaves the view < 120 px and gives the content ≥ 160 px when it can (a phone sideways: the piano's octave row / the fretboard's controls go under the instrument there). The ONLY layout-moving thing allowed is the learner's own action. The skip link sits above the top bar (z 90). Circle of fifths: the hover tint follows a real mouse only, and its strength is set per label colour (`hoverFillFor` in `circleOfFifthsConstants.ts`) so every hovered label stays ≥ 4.5:1 — `themeContrast.test.ts` pins every wedge at rest and hovered, and `design-system.spec.ts` hovers all 24 with a mouse. Chord-quality names in PT/ES: `i18n/chordQualityNames.ts` via `utils/qualityName.ts` (every quality; same names the exercises use where `musicTerms` has one); the chord panel's scale-note tooltips: `i18n/scaleSuggestionContext.ts` (unit test keeps it in step with `chordScaleRelationships.ts`).
- **Drill on phones:** question at the top; answers, the verdict and a big Continue in the lower half (thumb zone, `.drill-thumb`).
- **Theme:** `themeMode` is `fermata` (Day) | `fermata-night` | `auto` (follows `prefers-color-scheme`, live; `useResolvedTheme()`); the index.html pre-paint script handles all three.
- **Proof:** `e2e/design-system.spec.ts` sweeps 390×844, 844×390 (landscape) and 768×1024 (touch) and 1440×900 (mouse) × day / night — Explore (+ a chord in Diatonic / All / Build), the "⋯" menu, Settings, the dock (phone: Peek / Half / Full), piano keys with sharps and flats, Learn (levels, review queue, a lesson, an exercise with an answer selected / wrong / right, an instrument-answer exercise, an ear-training exercise, W4a's question screens — a key signature on a question staff, half / whole step and interval-number answers — the level-achievement overlay), Drill (question, feedback, settings, mastery map, summary, a Sprint) — plus PT and ES at 390 px (W4a's question screens included) and EN/PT/ES chord cards at 1024 px: computed font sizes (SVG at on-screen size), tap boxes, text-vs-painted-background contrast, sideways scroll, text cut off (ellipsis / line clamp / clipped by an overflow-hidden box; scroll boxes excluded), with `e2e/helpers/designAudit.ts`. Also: a Tab walk (first stop = skip link; every stop shows a focus change, is on screen and is the hit target at its centre); the full toast stack (update + offline-ready + install + an app toast, raised through the dev server's own modules) on screen, off the dock bar / sheet / top bar / Drill answers, every toast button hit-testable, and the dock, the instrument, the view and Drill's answers moving < 2 px as it comes AND goes, at phone Peek / Half / Full, landscape, tablet and laptop, then Reload reloads; landscape keeps ≥ 120 px for the view; the docked guitar ≤ half the screen with ‹ positions › on one line. Its only exemptions, COUNTED per screen (`AuditResult.exempt`): the instrument's keys / frets / open-string cells (tap size), a link inside a sentence (tap size), disabled controls (tap size; their text only when drawn faded), inert or screen-reader-only text (not on screen). `DESIGN_AUDIT_OUT=<dir>` writes each screen's audit + a screenshot. `design/__tests__/themeContrast.test.ts` pins every token pair; `i18n/__tests__/ptInterface.test.tsx` fails on listed English words (text, aria-label, title) in the PT/ES shell, pickers, dock, Drill settings, mastery map, every chord-browser category and the chord panel for every quality.
- **Drill settings / mastery map:** session length = ChipGroup; topics and answer-sound / timer = toggle chips (aria-pressed, the chip "on" look); no switches. In Drill the toast overlay stops above the answers (they register with `useToastAvoid`) — it may cover the question for a moment, never an answer, and moves nothing.

---

## Project

**Name:** Music Theory App
**Domain:** Music theory education / interactive instrument
**Stack:** React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4 + Zustand 5 + Framer Motion 12
**Tests:** 7,782 passing (Vitest + React Testing Library, 227 test files; counted 2026-11-02, W9b on top of the skipWaiting removal, W4a, W11-A and W10) + Playwright e2e: 72 tests on the production build (54 + 18 skipped PWA-only on the dev server — W9b's ten update tests among them; the design sweep's toast-stack and Sprint steps need the dev server's /src modules and are skipped, with a note, on the build)
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
- `npm run check:bundle` (after a build) — entry JS < 500 kB, ts-fsrs out of the entry, Fretboard / Quick Search in their own chunks, Bravura-only VexFlow, every inline `<script>` in the built index.html allowed by a CSP hash, the build id (dist/version.json) in no shipped code file or index.html
- `npm run check:sw` (after a build) — every JS/CSS chunk PRECACHED (W9b; runtime caching no longer counts), precache closure, every translated-content chunk precached, audio samples never precached, dist/version.json present, well-formed and NOT precached, sw.js imports `sw-window-count.js`
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
- App updates are `registerType: 'prompt'` (W9-06): a new service worker waits; the "new version — reload" toast asks; its Reload activates the waiting worker and the page reloads when it takes control (`usePWA.applyUpdateOrReload`; a plain `location.reload()` would be served the OLD precached index.html). Accepting the update in one tab no longer reloads the app's OTHER open tabs under their learners (the plugin's listener would): since the W9b review, a takeover a tab did not ask for is stopped by `guardUnaskedTakeover` (registered before the plugin's listeners; `stopImmediatePropagation`) and that tab shows "Reload to finish updating" instead — likewise for a takeover that arrives after a silent apply gave up (> 4 s). The first install's takeover and a takeover the tab asked for pass through. Such a tab keeps running its old code under the new worker; a chunk it never loaded that changed in the release is gone from the cache, and ViewSlot's "Try again" reloads. "Try again" on a view whose file 404s asks the server for the new version first, so one tap is enough.
- **Update robustness (W9b, 2026-11-02, `usePWA.ts`):**
  - **Checks:** on returning to the foreground (≤ 1/min) and every hour while the app is open (`PERIODIC_CHECK_MS`, vite-plugin-pwa "Periodic Service Worker Updates"); both via `checkForUpdate()` = the guide's edge-case guard: not while a worker installs, not offline, `registration.update()` only after a `no-store` probe of `/sw.js` answered 200. One interval per page.
  - **Silent apply only at a safe moment, never during work in progress.** A *fresh start* (`services/freshStart.ts`) begins at a cold launch (a page opened in the background: when first shown) or when the page is shown again after ≥ 30 min hidden (`LONG_ABSENCE_MS`), and ends at the first pointer down / key down / wheel / touch / focus move (focusin) / VERTICAL scroll — the last two for a screen-reader user in browse mode (review W9b-f); horizontal scrolls do not count, because the app centres the piano strip sideways by itself at boot — or after 15 s (`FRESH_START_WINDOW_MS`). Cues that arrive while a decision is under way are decided after it, never dropped. A waiting update applies WITHOUT asking (a) at a fresh start, unless "Later" was chosen in this page, or (b) if it is CRITICAL, at a fresh start or when the page is hidden, even after "Later" — and in both cases only when `hasWorkInProgress()` is false here AND in every other open tab (`services/otherTabs.ts`): a service worker counts the app's windows (`clients.matchAll({ type: 'window', includeUncontrolled: true })` in `public/sw-window-count.js`, imported by the generated sw.js via `workbox.importScripts`; the waiting worker is asked first, then the active one), then every OTHER window must answer "idle" over a BroadcastChannel within 300 ms. **Silence counts as busy** — a tab on a version older than W9b, or a frozen one, cannot answer, so the learner is asked instead; if no worker can count the windows, nothing applies silently. A tab on its own does not wait. Otherwise it asks, exactly as before. If the new worker never takes over, it falls back to the prompt (never a plain reload into the old version). The next page shows "Updated to the latest version" (+ What's new), carried over in sessionStorage, gone after 10 s of the page being VISIBLE (a critical update applied while away still greets the learner on return). /version.json is fetched once per waiting version (the plugin reports it twice).
  - **Work in progress = `src/services/workInProgress.ts`** (`registerWorkInProgress(source, isActive)` → unregister; `hasWorkInProgress()`; a throwing check counts as busy). Drill's source (`state/drillWork.ts`, registered in main.tsx): in the Drill view, a session with ≥ 1 answer not yet complete, a verdict on screen, or a Sprint with time left — read from the persisted drill state, so it holds from the first moment of a launch and never imports the drill store (ts-fsrs). **Learn — INTERIM (review W9b-B1):** `services/learnWorkInProgress.ts` registers source `'learn'` = the whole Learn view (`view === 'learn'`, overview included — which Learn screen is open lives in LearnView's own state, not a store; registered in main.tsx). Without it, a return after 30 min or another tab's cold launch reloaded a lesson to the Learn overview. W4b registers its precise check under the same key `'learn'` (it replaces this one) and drops the interim registration on rebase.
  - **What's new + critical:** `release-notes.json` (repo root, newest first): `release` (+1 per entry), `date`, `critical`, one-line `notes` in en / pt / es (≤ 160 chars). The build validates it (`src/release/releaseNotes.ts`; a bad file fails the build), compiles the newest release + note into the app (`__APP_RELEASE__`, `buildInfo.ts` — never the build id, so a commit that changes no code is no new version the same UTC day; **but the build DATE is in the bundle** (`__BUILD_DATE__`, the Settings footer), so any deploy on a later UTC day IS a new version, docs-only or not — kept on purpose (review W9b-b): moving the date out means redesigning the W11-A footer or reading git history Vercel may not have, and with silent updates at a fresh start such an update mostly goes unseen) and publishes `dist/version.json` {build, date, release, critical, criticalSince, notes} — NOT precached. The prompt fetches it (network, no-store): "What's new: <note>" when the waiting release is newer — shown only where the toast region has ≥ 160 px of room (`NOTE_MIN_ROOM_PX`, `useToastRoom()` in `layout/toastLayout.ts`): over a phone's instrument at Full or sideways a two-to-five-line card would cover the instrument, so there the prompt stays one line (the design sweep checks both); critical when `criticalSince` is newer than the running release (a skipped critical release still counts). **To ship a release note: add an entry on top with the next `release` number. To mark a release critical (an emergency fix every app must take soon): set `"critical": true` on that entry.** A deploy without a new entry shows no note and is not critical.
  - Proof: `usePWA.silent.test.tsx` (fake timers: hourly check, fresh start, WIP, other tabs, critical, notes EN/PT/ES, notice), `freshStart.test.ts`, `e2e/update-robustness.spec.ts` (preview + deploy proxy: silent at a cold launch; never during a Drill session or a Sprint, whose Reload resumes it exactly; critical + Later → applies when hidden; the stale page). The W9-06 e2e / unit tests model an update arriving mid-use (a key / pointer press first).
- The one-off transition skipWaiting was removed early, on 2026-11-02, at the owner's request (W9 B2; originally planned for 2026-11-14). A client not opened between W9 (2026-10-31) and that date still runs old autoUpdate code and needs one full quit.
- Precache (W9b — **supersedes D-22's "load on demand" for CODE chunks only**; samples still load on first use): EVERY JS/CSS file of the build is precached (`globPatterns` `assets/**/*.js` + css/html/fonts/icons): app code, every level's curriculum / exercises / templates, VexFlow, every translated-content `i18n-*` chunk (chunkFileNames). So a page still on an older build (an update waiting, "Later") opens any view / level / language from its own precache after a deploy removed those files from the server. Measured 2026-11-02 (workbox build output): 39 entries / 1,490.72 KiB → 125 entries / 4,359.75 KiB (122 distinct files — the icons are listed twice by the plugin; gzip 784 → 1,820 KiB, brotli 743 → 1,686 KiB). It downloads after the page has loaded (the worker registers on window load): bytes before `load` 682 → 688 KiB, FCP unchanged (preview, localhost, 3 runs: median 96 → 92 ms); a whole first visit moves 3,154 → 6,033 KiB uncompressed on `vite preview` (58 → 144 requests). Per update only files whose hashed names changed download. The only runtime caches left are the samples; the old code caches (vexflow-cache, content-cache, app-chunks) are deleted once a worker controls the page. The static-import closure transform stays (a no-op while the globs take everything). On a first visit, whatever the page loaded before the worker took control is re-fetched through it (`usePWA.warmRuntimeCaches`). Run `npm run check:sw` after changing chunking; `e2e/offline-after-visit.spec.ts` (preview) proves the app opens with every request blocked.
- PWA toasts (update — with its "What's new" line — / "Reload to finish updating" / updated / offline-ready / install) render in ONE stack (`PWAPrompts`), update first, inside the one `ToastRegion` (W11-A) — never give a toast its own fixed position. Offline-ready dismisses itself after `OFFLINE_READY_MS` (6 s, `usePWA.showOfflineReady`). The update toast has Reload (one tap, W9-06) and "Later" (`updateDeferred`): it hides, the "⋯" button gets a dot and the name "More — update ready" (`Menu` `badge` / `buttonLabel`), and the menu shows "Update ready: reload" while an update waits; a newer waiting version asks again.
- **Fretboard orientation is SETTLED — do not "fix" it.** It renders nut-RIGHT, low E on top (mirrored from printed chord charts). A flip to textbook orientation was shipped and **reverted on Nuno's feedback** (2026-06-09): he reads the original natively. Position legibility is handled instead by the anchor-fret badge ("3fr") + nut-closest default voicing for chords, and the Roman-numeral badge for scale positions (see Audio & instruments below).
- **Spelling is one engine** (`src/core/utils/degreeSpelling.ts`, W1/W2 2026-10-30): note names, degree labels and colours (read from the spelled letter), interval names, key signatures, staff octaves/accidentals and the key picker's root names all go through it — never derive a label from a semitone count or a note's position in a list. Staves that show what the instrument plays (Explore, `followInstrument`) write the guitar an octave above sounding (treble-8vb, D-05); Learn exercise staves are AUTHORED notation and are never transposed for the instrument; chords sound exactly the voicing the piano lights (`chordVoicingPitches` in `pianoLayout.ts`).
- **Learn exercise integrity (W4a, 2026-10-31):** every generated item must practise its own module (`templateTopics.corpus.test.ts` topic map) and use only concepts its lessons have taught (`conceptOrder.corpus.test.ts`, reads the cumulative lesson text). A question that points at notation carries a `stimulus` (staff: notes / clef / key signature, drawn by `exerciseStaff.ts`) or is worded "Which statement about X is true?"; ledger-line notes carry an authored `clef`; spelled intervals use `intervalNumber` (A4 ≠ d5); L1 intervals answer by number or half/whole step (`answer`); keyed builds use template `keys` → `{key}` (Neapolitan, Gr+6, tritone sub, vi7 …, all oracle-checked in `chromaticBuilds.corpus.test.ts`). On the multiple-choice items actually SERVED (authored + generated), per level and language (EN/PT/ES): the correct option is the strictly longest in ≤ 35% of sets and still ≥ 10% of the time where one option is uniquely longest or uniquely shortest, and no test-wiseness heuristic of the independent review (longest/shortest by characters or words, most/least like the others, prompt-word overlap, shared vocabulary, "no absolute words", longest without absolute words, most punctuation, most digits) picks it more than 40% of the time (`answerCues.corpus.test.ts`; chance is 25%). The rank family closes the "second-longest" variant: by characters, words, punctuation, numerals, parentheses and all punctuation marks, "pick the r-th largest option" (ties share their ranks) hits the answer in at most chance + 15 points of sets (4 options: 40%), and "pick one of the two largest" in at most 65% (chance 50%); where one option is at least 1.25× longer than all the others, it is the answer at most 40% of the time (levels with ≥ 10 such sets); and the option sharing the most content words with the module's own lesson text is the answer at most 45% of the time (stop-word lists per language), so distractors are written as lesson-vocabulary misconceptions rather than generic overclaims. Generated items never repeat an authored one (language-neutral `exerciseIdentity`, which treats a defaulted field such as `acceptEnharmonic` the same as the default written out). Ear chords/progressions sound in root position (`earChordPitches` / `earProgressionPitches`). The `points` field is gone (D-16).
- **Saved scores follow exercise identity (W4a):** per-exercise scores (`exerciseResults[module].scores[id]`) are only valid while the id names the same exercise. `exerciseIdentity.snapshot.test.ts` fails when a content edit changes the exercise behind an id (MC: prompt or keyed answer; others: the config); run `npm run progress:retire`, which appends those ids as a new version to `src/state/retiredExerciseIds.ts` (the progress store's persisted version follows) and re-records the snapshot. The store's migration drops retired scores from older saves and keeps completions, unlocks, schedules and "passed" flags; backups with an older progress version are migrated, not refused.
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
  state/drillWork.ts Drill's work-in-progress source for silent updates (W9b; reads the persisted drill state, no drill-store import)
  release/           releaseNotes.ts: parses release-notes.json (repo root) for the build's version.json + __APP_RELEASE__ (W9b)
  state/dock.ts      Instrument-dock detents (Peek / Half / Full) per view + shape guard; state/dockContextStore.ts = what the instrument shows (dock bar line)
  i18n/              i18next config + locales (en.json, pt.json, es.json) — 785 keys, 44 namespaces (counted 2026-11-02, W9b)
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
    ui/              Design system v2: Button/IconButton, ChipGroup/ChoiceChip, Segment, SelectTrigger, Card, ListRow, Badge, Feedback, Sheet, DetentSheet, Menu (+ roving.ts keyboard, focus.ts trap)
    layout/          AppShell, TopBar, SettingsSheet, InstrumentDock, ToastRegion, Toast, PWAPrompts
    notation/        StaffNotation, StaffNotationSkeleton, useStaffNotation (VexFlow 5.0)
    learn/           LevelsOverview, LevelCard, LevelDetail, LevelAchievement, UnitCard, UnitDetail, ModuleView, ModuleRow, ReviewQueue, ContinueBanner, LearnBreadcrumb, ProgressBar, DifficultyBadge, Confetti, ScreenFrame (a Learn screen; inert while it animates out)
      exercises/     ExerciseRunner, ExercisePrompt, ExerciseFeedback, ExerciseProgress
        inputs/      ChoiceInput, InstrumentInput
  views/             ExploreView, LearnView
  hooks/             useAudio, useKeyContext (incl. exercise-input mode), useTheme, usePWA (prompt-mode updates), useLanguage, useLearnProgress, useMediaQuery, useDegreeColors, useStopPlaybackOnViewChange, useServiceWorkerActive
  services/          workInProgress (W9b: what a silent update must not cut off), freshStart, otherTabs, appVersion (version.json, the "Updated" marker),
                     spacedRepetition, exerciseSelector, synthConfig (FM fallback voice),
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
      templatesL1-L9.ts      Exercise generation templates (110 modules, 179 templates)
      exerciseGenerator.ts   Seeded PRNG generator (531 generated, accepts lang for music term translation)
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
- **Exercise generation:** Seeded PRNG templates for 110 modules (531 generated, 918 total)
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
the phone-first Drill view: all functional, all gates green (7,782 tests / 227 files on
2026-11-02 after W9b — update robustness — on the skipWaiting removal, W4a and W11-A, eslint 0/0,
content audits clean).

WS9 details worth knowing: drill bank generated from core (`drillBank/` directory
module, ~1,321 items, token/params contract-tested against the i18n templates);
`drillScheduler` wraps ts-fsrs (request_retention 0.9, Easy never granted);
`drillSession` composes due→learning→new→confidence with seeded shuffles; persist
key `fermata-drill-v1` v3 (W7: v1 "by heart" tiers re-judged on load, never
promoted; W9b: `activeSession.feedback` / `.log` and `sprint` for a lossless reload —
`fixtures/drill-v2-store.json` is a real v2 save) with per-entry shape guards (one bad record drops only itself); PT/ES
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
