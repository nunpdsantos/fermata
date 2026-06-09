# Fermata — restart prompt for the remaining work (WS4 + WS5)

Paste the block below into a fresh session.

---

I'm continuing a multi-part improvement of my music-theory app **Fermata**. Four workstreams already shipped to production this session (cleanup, audio, theme, and slice 1 of the Explore work). I want to finish the two big remaining pieces. **Before doing anything, read `~/Obsidian/Experiments/Music Theory App.md`** — it has the full architecture, the 5-workstream plan, and every decision made so far. Then help me finish what's left.

## Project facts
- **Repo:** `/Users/nunosantos/Desktop/Base/Music/new_music_app` (React 19 + TypeScript + Vite 7 + Zustand 5 + Tailwind v4 + VexFlow + Web Audio; Vitest ~790 tests; offline PWA).
- **Deploy:** Vercel auto-deploys `main` → `fermata-music.vercel.app` (production). Any pushed branch gets a **preview** deploy. Convention: one workstream = one branch off `main` → PR → **squash-merge + delete branch** → auto-deploys.
- **`src/core/` is read-only** (shared with another project — never modify it; only import from it).

## Already done & live (don't redo)
- **WS1 Cleanup** — removed the Play view, accounts, cloud sync, the Supabase backend, gamification + concept-tracking, the onboarding tour, and marketing docs (~11k lines). Nav is now two tabs (Explore, Learn).
- **WS2 Audio** — unified the piano into one voice via `src/services/synthConfig.ts` (`getSynthConfig()`), used by the keyboard, the Explore playback callers, and Learn ear-training; retuned the piano envelope.
- **WS3 Theme** — collapsed four themes to **Fermata** (warm day, the base `:root`) + a new **Fermata-night** (warm walnut/espresso dark). `useDegreeColors.ts` now always returns true (functional scale-degree colours on everywhere — pedagogy). Persist is at **v5**.
- **WS4 slice 1** — the chord **Build** feature now plays + lights the piano/fretboard (`ChordBuilderPanel.tsx` Play button → `playChordVoiced` + `setSelectedChord`).

## What's left

### WS4 (the rest) — the Explore unification centrepiece (DESIGN-HEAVY)
This is open-ended UX. **Brainstorm with me and bring mockups before building — don't autonomously redesign.** The problems (verified earlier; re-confirm in code):
- **Scale-degree clicks dead-end.** `ScaleDegreeBar` sets `selectedDegree`, but nothing else reads it — clicking a degree doesn't light the piano/fretboard/staff. Wire it through (`musicSlice.setSelectedDegree`; instruments consume via `useKeyContext`).
- **Three chord modes are three separate mini-apps.** `ExploreView` swaps `ChordGrid` (Diatonic) / `ChordBrowser` (All) / `ChordBuilderPanel` (Build) — three internal states, three visual languages, inconsistent root/key handling. Goal: one cohesive chord/degree workspace where selecting OR building a chord drives piano + guitar + staff together.
- Also flagged earlier: duplicate chord-label dictionaries across modes, several separate `StaffNotation` instances, two inversion systems, `DetailPanel` duplicates on-screen content.

### WS5 — theory content audit (LARGE)
Full **correctness audit** of the 118 curriculum modules + ~1,000 exercises against authoritative music-theory sources, then wire the verified explanations into Explore as contextual "go deeper." Settle one open question first: does "content" mean the drill exercises too, or only the explanatory text?

## How to work (this worked well — keep it)
- **For WS4's layout:** use the **brainstorming** skill first — explore intent, propose 2-3 approaches *with mockups*, get my approval, then spec → plan → subagent-driven execution. It's a design problem; align before building.
- **For mechanical pieces:** branch off `main` → implement (subagent-driven, one task at a time, each leaves the build green) → spec + code review → verify → PR → merge.
- **Verification:** ALWAYS `npx tsc -b --force` (plain `tsc -b` gives false "clean" from its incremental cache; and this repo's IDE/LSP diagnostics *lag behind edits* and throw phantom errors for already-deleted/edited files — trust forced `tsc` + `npm run build`, not the diagnostics). Run full `npx vitest run`.
- **Perceptual changes** (sound, look, interaction feel) can't be verified by an agent — PR them with a Vercel preview and get my eyes/ears at merge. I've been happy to merge on trust for low-risk ones.
- Commit trailer on everything: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## Decisions locked (don't re-litigate)
Keep all 3 languages (EN/PT/ES). Play/accounts/sync/Supabase/gamification stay removed. Degree colours always-on. Fermata + Fermata-night only. `synthConfig.ts` is the single source for synth voices.

## Start by
Reading the experiment note, then asking me whether to start with **WS4's unified Explore layout** (a design pass with mockups) or **WS5's theory audit** — and for WS4, kick off the brainstorming skill.
