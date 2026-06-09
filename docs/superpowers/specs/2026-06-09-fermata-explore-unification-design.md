# Fermata — Explore Unification (WS4) — Design Spec

- **Date:** 2026-06-09
- **Workstream:** WS4 (the rest of the Explore work) — unify the chord/degree surface
- **Branch:** `ws4-explore-unify`
- **Status:** Direction chosen (Approach B). Proceeding to implementation plan → subagent-driven build.
- **Decision authority:** Nuno delegated the design-direction call. The perceptual sign-off happens at the **Vercel preview before merge**, not on a wireframe — the working build is the checkpoint.

---

## 1. Problem (verified in code, this session)

Explore's chord/degree area is three disconnected mini-apps plus a dead-end:

- **Scale-degree clicks dead-end.** `setSelectedDegree` (`state/slices/musicSlice.ts:17`) only sets `selectedDegree`. `useKeyContext` (`hooks/useKeyContext.ts`) — the hook every instrument and the staff read from — never reads `selectedDegree`. `ScaleDegreeBar` is its sole consumer, only for its own button styling. Clicking a degree changes nothing on piano/guitar/staff.
- **Three chord modes = three internal worlds.** `ExploreView` swaps `ChordGrid` (Diatonic) / `ChordBrowser` (All) / `ChordBuilderPanel` (Build) on a local `chordMode` state (`views/ExploreView.tsx:56`). Diatonic + All write the global `selectedChord`; Build keeps its own local `chordRoot` + toggled-steps and only weakly syncs (`setSelectedChord` on Play, exact match only).
- **4 separate `StaffNotation` instances inside Explore:** the scale staff (`ExploreView:206`), `ScaleDetail`, `ChordDetail`, and `ChordBuilderStaff` — each hand-fed different data.
- **2 inversion systems:** global `chordInversion` (`musicSlice`, voiced onto instruments by `useKeyContext`, driven by `ChordDetail`'s radios) vs. `ChordBuilderStaff`'s own local `inversion`/`register` that only moves its own staff.
- **3 chord-label dictionaries:** `ChordGrid` local `QUALITY_LABELS`/`QUALITY_FULL`; `ChordBrowser` uses core `CHORD_SYMBOLS`/`CHORD_QUALITY_NAMES`; `ChordDetail`/`ChordBuilderPanel` use core `CHORD_QUALITY_NAMES`.
- **DetailPanel duplicates on-screen content.** `setSelectedChord` auto-sets `detailPanelOpen` (`musicSlice:15`); selecting a chord pops a sidebar repeating its name/notes and a *third* staff.

## 2. Chosen direction — B: one Chord & Degree Workspace

Collapse the degree bar + the three chord modes into **one surface** with a single shared selection that drives **one chord display + one staff + the always-visible instruments together**. The three modes become three *ways in* to the same selection, not three separate states/outputs. The auto-popping sidebar is removed; its unique controls move inline.

This is the lowest-regret restructure that satisfies the brief: bigger UX payoff than "wire it in place" (Approach A), without re-laying-out a page that already works (Approach C).

## 3. Unified "focus" model (the spine)

One source of truth in `musicSlice`, consumed by `useKeyContext`, reflected everywhere:

- **State:** `selectedChord: Chord | null`, `selectedDegree: number | null`, `chordInversion: number` (all already exist).
- **Precedence for "what's lit":** `selectedChord` > `selectedDegree` > scale (default).
- **Mutual exclusivity (new):** `setSelectedChord(c)` clears `selectedDegree`; `setSelectedDegree(d)` clears `selectedChord`. Selecting one focus drops the other so the instruments/staff never show a contradictory mix.
- **`useKeyContext` extension:** when `selectedDegree` is set and no chord, expose the highlight payload for that single scale-degree note (pitch class + MIDI for piano, pitch class for guitar/circle) and a single-note staff payload. Today it computes scale + chord highlighting; add the degree case.
- **Degree behaviour:** clicking degree *n* lights that scale note on instruments + staff **and** offers a one-click "build the diatonic chord on this degree" affordance that promotes it to a chord (`setSelectedChord(diatonicChords[n-1].chord)`). Keeps the literal single-note meaning *and* the path into a chord.
- **Build goes live:** the Build picker writes `selectedChord` on identification (confidence `exact`) as the user toggles, so the instruments follow while building — not only on Play. When notes are toggled but no chord is identified, light the **raw toggled notes** on instruments + staff (improvement over today, which lights nothing until an exact match). The strip's toggled-steps stay local to the Build tab; its *output* is the shared selection.

## 4. Target `ExploreView` layout

1. `KeySelector` — unchanged.
2. Scale hero (root + scale name, notes, Play / Details / Copy / Print) — kept.
3. **`ChordWorkspace`** (the unified block):
   - **Degree row** — `ScaleDegreeBar`, now wired (lights instruments + staff; offers "chord on this degree").
   - **Mode tabs** — `Diatonic | All | Build`.
   - **Active picker** — `ChordGrid` / `ChordBrowser` / Build strip (each only sets the shared selection).
   - **Current panel** — inline: when a chord is selected → the consolidated chord detail (name, notes, formula, inversion, compatible scales, play chord/arpeggio, Learn More); when a degree is selected → a light degree readout; when neither → scale summary.
   - **One staff** — a single `StaffNotation` reflecting the current focus (scale ↔ degree ↔ chord).
4. `ScaleComparison` — kept (position may shift).
5. `CircleOfFifths` — kept (beside/below).
6. Instruments (piano/guitar) — unchanged; driven by `useKeyContext` as today.

## 5. Components

- **New `ChordWorkspace`** (`components/theory/`) — host described in §4. Owns the mode-tab state (lifted from `ExploreView`) and the single staff.
- **Refactor `ChordDetail` → an inline `CurrentChordPanel`** — keep its content (name, notes, formula, inversion radios → global `chordInversion`, compatible scales, play chord/arpeggio, Learn More) but render inline in the workspace, **not** in a sidebar, and **remove its own `<StaffNotation>`** (the workspace owns the single staff).
- **Reuse pickers** — `ChordGrid`, `ChordBrowser`, and the `ChromaticStrip` + identification from `ChordBuilderPanel`. Each picker's only responsibility becomes "set the shared selection." The Build tab keeps its toggled-steps + detected-chord readout but **drops `ChordBuilderStaff`** (the workspace staff renders it).
- **Remove the sidebar** — delete the `DetailPanel` auto-open path. `ScaleDetail`'s unique scale info folds into the workspace's "no chord" state. `ChordBuilderStaff` removed.
- **`ExploreView`** — replace the separate `ScaleDegreeBar` + chord-toggle block + standalone scale staff + `DetailPanel` with the scale hero + `ChordWorkspace` + `ScaleComparison` + `CircleOfFifths`.

## 6. Consolidations (each its own green task)

- **One chord-label dictionary** — delete `ChordGrid`'s local `QUALITY_LABELS`/`QUALITY_FULL`; use core `CHORD_SYMBOLS` + `CHORD_QUALITY_NAMES` everywhere (add a small short-suffix helper if the grid needs the bare suffix form). *Confirm core exposes a short-suffix form; if not, add one app-side rather than re-deriving per component.*
- **One inversion model** — global `chordInversion` + `useKeyContext` voicing. `CurrentChordPanel`'s inversion control drives it (as `ChordDetail` already does); the Build-identified chord uses the same. Remove `ChordBuilderStaff`'s local `inversion`. *Decision: keep a single optional register/octave control on the unified staff (carried over from the builder's `low/mid/high`) so low chords still render cleanly; it's display-only and does not fork the inversion model.*
- **One staff** — a single `StaffNotation` in `ChordWorkspace`. Remove the `ExploreView` scale staff, `ChordBuilderStaff`, the `ChordDetail` staff, and the `ScaleDetail` staff.

## 7. Data flow

```
degree click | diatonic chord | all-chords pick | build-strip toggle
      └────────────────────────┬───────────────────────────┘
                         musicSlice (selectedChord XOR selectedDegree, + chordInversion)
                                │
                         useKeyContext  (scale / degree / chord highlight + inversion voicing)
                                │
        ┌───────────────┬───────┴────────┬─────────────────┐
   piano/guitar     one staff      CurrentChordPanel    (all read the same selection)
```

One selection, many consistent views — replacing four independently-fed render paths.

## 8. Edge cases

- **Exotic scales with no diatonic chords** — `ChordGrid` already renders an empty state; degree→chord promotion is a no-op there (degree still lights the note).
- **Build with notes but no identified chord** — light the raw toggled notes on instruments + staff; `CurrentChordPanel` shows "no match" but the instruments still respond.
- **Inversion clamp when a chord shrinks** — preserve the existing clamp logic (`ChordBuilderStaff` does this today) in the unified staff.
- **>7-note scales** — degree highlight uses pitch class; `ScaleDegreeBar`'s existing compact mode is unaffected.

## 9. Out of scope (YAGNI)

- Learn view — untouched.
- No new chord types/qualities; no instrument changes; no theme changes (Fermata day/night + degree-colours-always-on are locked).
- `CircleOfFifths` / `ScaleComparison` logic unchanged (may be repositioned only).
- i18n — reuse existing keys; add the minimum new keys for any new labels, in EN/PT/ES (all three locked-in).
- `src/core/` — read-only; not modified (only imported from).

## 10. Testing & verification

- **Unit:** `musicSlice` mutual-exclusivity (chord-select clears degree and vice versa); `useKeyContext` degree-highlight payload; degree→chord promotion.
- **Component:** `ChordWorkspace` renders each mode; selecting in each mode updates the shared selection and lights nothing contradictory; degree click sets `selectedDegree` + highlight; `CurrentChordPanel` inversion drives global `chordInversion`; Build "no match" still lights raw notes.
- **Regression:** update/remove tests tied to the removed `DetailPanel` auto-open and the removed staves; keep the rest green.
- **Gates (every task leaves these green):** `npx tsc -b --force` (forced — the incremental cache and IDE diagnostics lie during refactors), `npx vitest run` (~790), `npm run build`.
- **Persist:** confirm whether `selectedChord`/`selectedDegree` are in the persist whitelist. They read as transient session selections; if they are **not** persisted, no migration is needed. If they are, bump the persist version with a migrate that preserves preferences. *Confirm during the first build task; do not assume.*

## 11. Risks

- **Perceptual** — this moves layout. Mitigation: Nuno reviews the Vercel preview at merge (the checkpoint).
- **Scope/refactor breadth** — touches `ExploreView`, `musicSlice`, `useKeyContext`, the three pickers, `ChordDetail`/`DetailPanel`, the staves. Mitigation: sequence as small subagent-driven tasks, each leaving the build green, with per-task review + a whole-branch review before PR.

## 12. Execution

One branch (`ws4-explore-unify`) → subagent-driven tasks (one at a time, each green) → spec + per-task code review → forced `tsc` + full `vitest` + `build` → PR with Vercel preview for Nuno's merge. Commit trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
