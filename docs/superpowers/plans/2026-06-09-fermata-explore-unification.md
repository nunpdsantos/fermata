# Fermata Explore Unification (WS4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Each task must leave the build green before the next starts.

**Goal:** Unify Fermata's Explore chord/degree area into one cohesive workspace where the scale-degree bar and all three chord modes (Diatonic / All / Build) drive piano + guitar + a single staff through one shared selection (`selectedChord`).

**Architecture:** `selectedChord` is the single source of truth (already converted to instrument + staff highlights by `useKeyContext` — which is **not** modified). Degree clicks select that degree's diatonic chord. The three pickers become tabs inside a new `ChordWorkspace` that renders one inline `CurrentChordPanel` + one `StaffNotation`. The auto-popping `DetailPanel` sidebar and the duplicate staves / label dictionaries / second inversion system are removed.

**Tech Stack:** React 19, TypeScript 5.9, Zustand 5, Vite 7, Tailwind v4, Framer Motion 12, VexFlow 5, Vitest 4.

**Spec:** `docs/superpowers/specs/2026-06-09-fermata-explore-unification-design.md` (read it, incl. §13 refinements, before starting).

**Hard constraints:** `src/core/` is READ-ONLY (import only). Keep EN/PT/ES i18n. No theme changes. Persist stays v5 (selections aren't persisted — no migration).

**Green gate (every task):** `npx tsc -b --force` exits 0 **and** `npx vitest run` passes. Add `npm run build` on Tasks 5, 7, and the final task. Never trust plain `tsc -b` (incremental cache) or IDE/LSP diagnostics during this refactor — they lag. Commit trailer on every commit: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

## File Structure

**Create:**
- `src/components/theory/CurrentChordPanel.tsx` — inline chord detail (name, notes, formula, inversion, compatible scales, play) extracted from `ChordDetail`, **without** its own staff. One clear job: render the selected chord's details inline.
- `src/components/theory/ChordWorkspace.tsx` — the unified host: mode tabs + active picker + `CurrentChordPanel`/scale-summary + one `StaffNotation`.
- Test files alongside: `src/components/theory/__tests__/CurrentChordPanel.test.tsx`, `ChordWorkspace.test.tsx`.

**Modify:**
- `src/components/theory/ChordGrid.tsx` — drop local label dicts; use core labels.
- `src/components/theory/ScaleDegreeBar.tsx` — wire degree → diatonic chord; derive active from `selectedChord`.
- `src/components/theory/ChordBuilderPanel.tsx` — live `setSelectedChord` on exact match; drop `ChordBuilderStaff`.
- `src/state/slices/musicSlice.ts` — `setSelectedChord` no longer opens the detail panel.
- `src/views/ExploreView.tsx` — render `ChordWorkspace`; drop the standalone scale staff, the chord-mode toggle block, and `DetailPanel`.

**Delete (final cleanup task, after verifying importers):**
- `src/components/panels/DetailPanel.tsx`, `src/components/theory/ChordBuilderStaff.tsx`, and — if no remaining importers — `src/components/panels/ChordDetail.tsx`, `src/components/panels/ScaleDetail.tsx`.

---

## Task 1: Consolidate chord-label dictionaries (ChordGrid → core)

**Files:** Modify `src/components/theory/ChordGrid.tsx`. Test: `src/components/theory/__tests__/ChordGrid.test.tsx` (create or extend).

`ChordGrid` currently carries local `QUALITY_LABELS` / `QUALITY_FULL` (lines 9-33). `ChordBrowser` already imports `CHORD_SYMBOLS` + `CHORD_QUALITY_NAMES` from `core/constants/chords.ts`. Use those instead so there is one label source.

- [ ] **Step 1 — Test:** assert a diatonic chord chip renders its core symbol + name. Render `<ChordGrid/>` for C major; assert the ii chip shows the symbol from `CHORD_SYMBOLS['minor']` and the name from `CHORD_QUALITY_NAMES['minor']` (import the maps in the test and assert against them, not hard-coded strings).
- [ ] **Step 2:** run it, expect FAIL (local dict still used).
- [ ] **Step 3 — Implement:** delete `QUALITY_LABELS` + `QUALITY_FULL`; `import { CHORD_SYMBOLS, CHORD_QUALITY_NAMES } from '../../core/constants/chords.ts'`; replace `qualityLabel = QUALITY_LABELS[...]` with `CHORD_SYMBOLS[chord.quality]` and `qualityFull = QUALITY_FULL[...]` with `CHORD_QUALITY_NAMES[chord.quality]`. (Symbols may be empty string for `major` — acceptable; preserve the existing `?? chord.quality` fallback.)
- [ ] **Step 4:** run tests, expect PASS. Green gate.
- [ ] **Step 5 — Commit:** `feat(ws4): one chord-label source in ChordGrid`.

## Task 2: Wire the scale-degree bar → diatonic chord (fix the dead-end)

**Files:** Modify `src/components/theory/ScaleDegreeBar.tsx`. Test: `src/components/theory/__tests__/ScaleDegreeBar.test.tsx`.

`ScaleDegreeBar` currently reads/writes only `selectedDegree` (dead-end). Make a click select that degree's diatonic chord; derive the active chip from `selectedChord`.

- [ ] **Step 1 — Test:** (a) clicking degree 5 in C major calls `setSelectedChord` with the chord equal to `diatonicChords[4].chord` (G major). (b) when `selectedChord` equals `diatonicChords[4].chord`, degree-5 chip has `aria-pressed="true"`. (c) clicking the active degree again clears it (`setSelectedChord(null)`). Use the store; assert via the chip's `aria-pressed` and the store's `selectedChord`.
- [ ] **Step 2:** run, expect FAIL.
- [ ] **Step 3 — Implement:** pull `diatonicChords` + (existing) `scale` from `useKeyContext`; read `selectedChord` + `setSelectedChord` from the store. For each degree `i` (0-based), `const dc = diatonicChords[i]`. `isSelected = !!selectedChord && !!dc && noteToString(selectedChord.root) === noteToString(dc.chord.root) && selectedChord.quality === dc.chord.quality`. `onClick = () => dc && setSelectedChord(isSelected ? null : dc.chord)`. When `dc` is undefined (exotic scale, no diatonic chord at that degree), render the chip non-interactive (disabled, no onClick). Stop reading `selectedDegree`/`setSelectedDegree`.
- [ ] **Step 4:** run, expect PASS. Manually reason: instruments already react to `selectedChord` via `useKeyContext`, so piano/guitar/staff now light on a degree click. Green gate.
- [ ] **Step 5 — Commit:** `feat(ws4): scale-degree clicks select the diatonic chord (lights instruments)`.

## Task 3: Extract `CurrentChordPanel` from `ChordDetail` (inline, no own staff)

**Files:** Create `src/components/theory/CurrentChordPanel.tsx` + `__tests__/CurrentChordPanel.test.tsx`. Do **not** modify `ChordDetail.tsx` yet (it keeps working via `DetailPanel`; both coexist until cleanup).

`CurrentChordPanel` = the body of `ChordDetail.tsx` (header/name, notes chips, formula, inversion radios → global `chordInversion`, compatible scales, play chord/arpeggio, `LearnMoreButton`) **minus** the `<StaffNotation>` block (lines ~213-225 of `ChordDetail`). Props: `{ chord: Chord }`. Reuse the same hooks/logic (`useKeyContext().getNoteDegree`/`invertedNotes`, `chordInversion`, `setChordInversion`, `useAudio`/playback as in `ChordDetail`).

- [ ] **Step 1 — Test:** render `<CurrentChordPanel chord={Cmaj} />`; assert it shows the chord name (`CHORD_QUALITY_NAMES`), the note chips, and an inversion control whose click calls `setChordInversion`. Assert it renders **no** `<canvas>`/StaffNotation (the workspace owns the staff).
- [ ] **Step 2:** run, expect FAIL (file absent).
- [ ] **Step 3 — Implement:** copy `ChordDetail`'s implementation into `CurrentChordPanel`, drop the staff section + its `StaffNotation`/`Suspense` imports, keep everything else. Keep it a focused presentational component.
- [ ] **Step 4:** run, expect PASS. Green gate.
- [ ] **Step 5 — Commit:** `feat(ws4): add inline CurrentChordPanel (chord detail without its own staff)`.

## Task 4: Create `ChordWorkspace` (tabs + picker + panel + one staff)

**Files:** Create `src/components/theory/ChordWorkspace.tsx` + `__tests__/ChordWorkspace.test.tsx`. Additive — not wired into `ExploreView` yet.

Host that owns the mode-tab state (lifted from `ExploreView`'s `chordMode`) and renders, in order: the mode tabs (`Diatonic | All | Build` — reuse i18n keys `explore.diatonic` / `explore.allChords` / `explore.build`); the active picker (`<ChordGrid/>` / `<ChordBrowser/>` / `<ChordBuilderPanel/>`); the **single** `StaffNotation`; and below it `CurrentChordPanel` when `selectedChord` else a scale summary.

The single staff (mirror the two existing staff configs):
- chord selected → `notes={getVoicedChordNotes(invertedNotes.length ? invertedNotes : selectedChord.notes, 4)}`, `duration="w"`, `chord` (from `useKeyContext().invertedNotes` so it respects global `chordInversion`). This replaces `ChordDetail`'s + `ChordBuilderStaff`'s staves and unifies inversion.
- no chord → `notes={getScaleNotesWithOctaves(scale.notes, 4)}`, `keySignature={getKeySignatureForScale(scale.root, selectedScale) ?? undefined}`, degree-coloured `noteColors` (copy from `ExploreView:206-214`), `duration="q"`. This replaces `ExploreView`'s standalone scale staff.

- [ ] **Step 1 — Test:** (a) renders three tabs; clicking "All" swaps `ChordGrid` for `ChordBrowser`. (b) with no `selectedChord`, renders the scale staff + no `CurrentChordPanel`. (c) with a `selectedChord` set in the store, renders `CurrentChordPanel`. (Mock `StaffNotation` via the existing test pattern / lazy boundary; assert on the picker + panel, not VexFlow pixels.)
- [ ] **Step 2:** run, expect FAIL.
- [ ] **Step 3 — Implement** the component as above. Lazy-load `StaffNotation` exactly as `ExploreView` does (`lazy` + `Suspense` + `StaffNotationSkeleton`).
- [ ] **Step 4:** run, expect PASS. Green gate.
- [ ] **Step 5 — Commit:** `feat(ws4): add ChordWorkspace (unified tabs + one staff + inline panel)`.

## Task 5: Switch `ExploreView` to `ChordWorkspace`; remove the auto-pop sidebar

**Files:** Modify `src/views/ExploreView.tsx`, `src/state/slices/musicSlice.ts`. Test: `src/views/__tests__/ExploreView.test.tsx` (create or extend). **Run `npm run build` too.**

- [ ] **Step 1 — Test:** render `<ExploreView/>`; assert (a) `ChordWorkspace` is present; (b) the old standalone "Staff Notation" section heading + the `Diatonic|All|Build` toggle block are gone (now inside the workspace); (c) selecting a chord does **not** mount a `DetailPanel` sidebar. Plus a `musicSlice` unit test: `setSelectedChord(chord)` leaves `detailPanelOpen === false`.
- [ ] **Step 2:** run, expect FAIL.
- [ ] **Step 3 — Implement:**
  - `musicSlice.ts:15` — change `setSelectedChord` to `set({ selectedChord: chord, chordInversion: 0 })` (drop `detailPanelOpen: chord !== null`).
  - `ExploreView.tsx` — remove the standalone Staff Notation section (lines ~199-217), the chord-mode toggle + `chordMode` state + the `{chordMode === ...}` block (lines ~56, ~224-279 — replace the whole "Chords" left column with `<ChordWorkspace/>`; keep the Circle of Fifths right column), and the `{detailPanelOpen && <DetailPanel/>}` render (line ~284). Keep `KeySelector`, the scale hero, `ScaleDegreeBar` (now wired), `ScaleComparison`, `CircleOfFifths`. Remove the now-unused `handleShowScale`/Details button (scale info lives in the workspace's no-chord state) and unused imports.
- [ ] **Step 4:** run tests + `npm run build`, expect PASS / success. Green gate.
- [ ] **Step 5 — Commit:** `feat(ws4): ExploreView uses the unified ChordWorkspace; drop the auto-pop sidebar`.

## Task 6: Build picker drives `selectedChord` live; drop `ChordBuilderStaff`

**Files:** Modify `src/components/theory/ChordBuilderPanel.tsx`. Test: extend `src/components/theory/__tests__/` for the builder.

Now that there is no auto-pop sidebar, the Build tab can set `selectedChord` continuously so the instruments + workspace staff follow as the user toggles.

- [ ] **Step 1 — Test:** toggling the strip so `inputNotes` form a recognised chord sets `selectedChord` to the identified chord; toggling to an unrecognised set clears `selectedChord` to `null`. The component no longer renders `ChordBuilderStaff`.
- [ ] **Step 2:** run, expect FAIL.
- [ ] **Step 3 — Implement:** add `useEffect(() => { setSelectedChord(top && top.confidence === 'exact' ? top.chord : null); }, [top, setSelectedChord])`. Remove the `setSelectedChord(top.chord)` from `handlePlay` (keep its audio). Remove `<ChordBuilderStaff .../>` and its import (the workspace staff renders the built chord via `selectedChord`).
- [ ] **Step 4:** run, expect PASS. Green gate.
- [ ] **Step 5 — Commit:** `feat(ws4): Build tab lights instruments live; remove its private staff`.

## Task 7: Delete dead code + trim vestigial state

**Files:** Delete `src/components/panels/DetailPanel.tsx`, `src/components/theory/ChordBuilderStaff.tsx`. Conditionally delete `src/components/panels/ChordDetail.tsx` + `src/components/panels/ScaleDetail.tsx`. Modify `src/state/slices/navigationSlice.ts` + `src/state/storeTypes.ts` to drop `detailPanelOpen`/`setDetailPanelOpen` if unused. **Run `npm run build`.**

- [ ] **Step 1 — Verify importers:** `grep -rn "DetailPanel\|ChordBuilderStaff\|ChordDetail\|ScaleDetail\|detailPanelOpen\|setDetailPanelOpen" src --include=*.tsx --include=*.ts`. Anything still importing `ChordDetail`/`ScaleDetail` (other than their own files/tests) means keep them; otherwise delete. `DetailPanel` + `ChordBuilderStaff` should have no non-test importers after Tasks 5-6.
- [ ] **Step 2:** delete the confirmed-dead files + their tests; remove `detailPanelOpen`/`setDetailPanelOpen` from `navigationSlice.ts` + `storeTypes.ts` only if grep shows no remaining readers. Leave `selectedDegree` in place (low-value to remove; out of scope) unless grep shows it is fully unused — if so, remove it from `musicSlice`/`storeTypes`/`navigationSlice`/`CircleOfFifths` consistently.
- [ ] **Step 3:** run `npx tsc -b --force` — fix any dangling references it surfaces (trust forced tsc over the IDE).
- [ ] **Step 4:** `npx vitest run` + `npm run build`, expect PASS / success. Green gate.
- [ ] **Step 5 — Commit:** `refactor(ws4): delete the dead sidebar, duplicate staves, and vestigial detail-panel state`.

## Task 8: Final verification + review + PR

- [ ] **Step 1:** `npx tsc -b --force` (exit 0), `npx vitest run` (all pass — note the count vs the ~790 baseline; removed-component tests will lower it, that's expected), `npm run build` (success).
- [ ] **Step 2:** request a whole-branch code review (superpowers:requesting-code-review) covering: the unified state flow, no orphaned imports, i18n parity (any new keys present in en/pt/es), and that degree/diatonic/all/build all drive one selection + one staff.
- [ ] **Step 3:** address review findings (each fix re-greens the gate).
- [ ] **Step 4:** push `ws4-explore-unify`; open the PR (title `WS4 (explore): unify the chord/degree workspace`; body summarising the consolidation + linking the spec). Vercel posts a preview. **Stop here — Nuno reviews the preview and merges.**

---

## Self-Review (plan vs spec)

- **Spec §2 (workspace), §4 (layout), §5 (components):** Tasks 3-5 build `CurrentChordPanel` + `ChordWorkspace` + the `ExploreView` switch. ✓
- **Spec §3/§13 (degree → diatonic chord, single source of truth, no `useKeyContext`/instrument change):** Task 2; `useKeyContext` + `Piano`/`Fretboard` untouched anywhere in the plan. ✓
- **Spec §6 (consolidations — labels / inversion / staves):** labels = Task 1; one staff = Task 4 (using `invertedNotes`, which folds inversion into the global model); `ChordBuilderStaff` removed = Task 6/7. ✓
- **Spec §3/§13 (Build live, no synthetic chord):** Task 6 (sets `selectedChord` on exact, clears otherwise). ✓
- **Spec §6 (remove sidebar / auto-open):** Task 5 (`musicSlice` + drop `DetailPanel`). ✓
- **Spec §10/§13 (persist — no migration):** confirmed; no persist task. ✓
- **Spec §9 (i18n EN/PT/ES):** reuse existing keys; Task 8 review checks parity for any additions. ✓
- **Type consistency:** `CurrentChordPanel` props `{ chord: Chord }`; `ChordWorkspace` reads `selectedChord`/`scale`/`invertedNotes`; `setSelectedChord` signature unchanged. ✓
- **No placeholders:** every task has concrete files, the key code, a test intent, and the green gate. Line-level edits to large existing files (`ExploreView`, `ChordBuilderPanel`) are specified by what changes + line refs; the executing subagent reads the current file (source of truth) for exact surrounding code.

## Execution

Per Nuno's standing delegation ("decide what's best, run to done"), execute **subagent-driven** (superpowers:subagent-driven-development): one fresh subagent per task, two-stage review between tasks, each task green before the next. No inline-vs-subagent question back to Nuno — proceed. Surface only the final PR + preview for his merge.
