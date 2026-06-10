# Fermata Drill Mode — Design Spec & Build Brief

**Date:** 2026-06-10
**Status:** Approved by Nuno (option "inside Fermata", build now)
**Workstream:** WS9, branch `ws9-drill-mode`

This document is self-sufficient: an agent with access to this repository and this file
should be able to build the feature end-to-end without asking the user anything.
Read the repo's `CLAUDE.md` first for conventions, gates, and gotchas.

---

## 1. Context

Fermata (this repo) is Nuno's personal music-theory learning PWA — React 19 + TS 5.9 +
Vite 7 + Zustand 5, deployed on Vercel at https://fermata-music.vercel.app, installed on
his iPhone. It has two views: **Explore** (theory browser with always-visible piano/
fretboard) and **Learn** (9-level curriculum, ~1,000 exercises, module-level spaced
repetition). It is deliberately lean: no accounts, no cloud, no gamification (removed
2026-06-09 by explicit decision).

**The gap this feature fills:** Nuno wants to pull out his phone during work breaks
(NHS 12-hour shifts) and be drilled for ~3 minutes on music-theory *fundamentals* until
he knows them by heart — key signatures, circle of fifths, scales, scale degrees,
intervals, chord spelling in both directions, diatonic chords/Roman numerals, cadences
and dominant function. Today's Learn view can't serve that: exercises are locked inside
curriculum modules (navigate → level → module → exercise set), the review queue only
covers completed modules, and scheduling is module-granular with fixed intervals.
Nothing remembers which *individual facts* he confuses.

**Drill mode** is a third top-level view: open the app → one tap (or zero, see §4.1) →
first question on screen. A per-fact scheduler decides what he sees; response time is
tracked silently; facts graduate to "by heart" only when answered correctly *and* fast
across multiple sessions.

## 2. Evidence base (drives every design decision below)

Research summary from 2026-06-10 session (meta-analyses and domain pedagogy; full
citations in the session record):

1. **Retrieval practice with spaced repetition** is the best-supported method for
   paired-associate knowledge (testing-effect meta-analyses d ≈ 0.5–0.7). The format is
   a drill, not a game: gamification's cognitive benefit comes entirely from immediate
   feedback, visible mastery, and adaptive difficulty. Reward tokens (XP, streaks,
   badges, leaderboards) add nothing and risk undermining intrinsic motivation
   (Deci/Koestner/Ryan; Sailer & Homner 2020). **Do not add any.**
2. **Production beats recognition** (Little & Bjork): the user must construct answers
   (spell the chord) rather than recognize them, except where the answer set is
   naturally small — and then multiple-choice lures must be the *actual confusions*.
3. **Both directions are separate memories**: C–E–G→"C major" and "C major"→C–E–G must
   be distinct scheduled items. Same for key→signature / signature→key.
4. **"By heart" is operationalized as automaticity**: correct AND fast. Standard
   benchmark ~< 3 s response (Logan's instance theory; precision teaching). Accuracy
   first, speed second; visible countdowns are opt-in only.
5. **Successive relearning** (Rawson & Dunlosky): a new fact needs ~3 correct retrievals
   in its first session, then 1 correct retrieval in ≥ 3 widely-spaced later sessions.
   Diminishing returns beyond that.
6. **Interleave confusables, block the brand-new** (Brunmair & Richter 2019): new
   categories get a short blocked run (3–5 items) on introduction; everything mature
   arrives fully mixed.
7. **Micro-sessions are the right shape**: 20–40 retrievals ≈ 2–5 minutes is a complete
   session. Cap new facts at ~4/session; the rest is review.
8. **Letter-first spelling discipline (domain-critical):** intervals and chords are
   letter-name entities. A–C♯ (major 3rd) ≠ A–D♭ (diminished 4th) despite 4 semitones
   both. The spelling algorithm to instill is *generic size first (letter distance),
   quality second*. Semitone counts are taught as separate recognition facts
   (7 semitones ↔ P5), never as the spelling method. The core engine already spells
   correctly — answer validation must therefore be **spelling-exact**, with a kind
   "right sound, wrong spelling" feedback when the user answers an enharmonic
   equivalent (counts as wrong, explains why).
9. **Scaffolds get retired by speed**: mnemonics (Father Charles…, last-sharp rule) are
   shown in *feedback*, never in prompts. The < 3 s criterion forces direct retrieval.

Market check (June 2026): no existing tool combines constructed-response drilling +
true per-fact spaced repetition + this topic list, phone-first. Closest are Tenuto
(content, no memory) and Anki (memory, no construction). Patterns stolen from the
survey: zero-submit tap answers with auto-advance, restrictable item pools, one-line
"why" on misses, opt-in timing, instant-launch entry points.

## 3. Product design

### 3.1 Entry & flow

- New top-level view `drill`, third tab in TopBar: Explore | Learn | **Drill**.
- `ViewMode` union (`src/state/storeTypes.ts`) gains `'drill'`; view lazy-loads like the
  others (`src/views/DrillView.tsx`).
- **Zero-friction rule:** tapping the Drill tab when no session is active starts one
  immediately with last-used settings — question 1 renders, no menu, no confirmation.
  A small header row above the question shows: session progress (`7/24`), an
  unobtrusive end-session ✕, and a settings (⚙) icon. That's all the chrome.
- **Resume behavior:** app remembers the last active view in the persisted preferences
  slice and restores it on launch (`explore` remains the default for first-ever run).
  Combined with PWA install, this makes "open app → already in Drill, question ready"
  the steady state on his phone.
- The PWA manifest (`vite.config.ts`) gains a `shortcuts` entry "Start Drill" pointing
  at `/?view=drill`; the app reads the `view` query param at boot. (iOS ignores manifest
  shortcuts today — the query param still gives him a dedicated home-screen bookmark if
  he wants one; Android/desktop get the long-press shortcut for free.)
- Ending mid-session is lossless: every answer is committed to the store as it happens.
  Closing the app mid-question costs nothing.
- The instrument bar (piano/fretboard) **stays hidden during drill sessions** — drill
  questions are self-contained and phone-first; vertical space goes to the question
  card. (The Learn exercise system keeps its instrument input; out of scope here.)

### 3.2 The item bank — nine fact families

The bank is **generated deterministically at runtime from `src/core/`** — no
hand-authored item content to drift out of sync with the engine. Each item has a
stable string ID (`<family>:<direction>:<payload>`, e.g. `keysig:key-to-acc:A:major`,
`triad:notes-to-name:C#:diminished`) so scheduler state survives bank regeneration and
app updates. Items carry: id, family, a prompt (i18n template key + params), an answer
spec, an input format, a feedback "why" line (template), and a difficulty rank for
introduction ordering.

Generation functions to use (verified to exist): `buildScale(root, type)`,
`getRelativeMinor/Major`, `buildChord(root, quality)`, `buildInterval(root, semitones)`,
`getDiatonicChordsForScale(scale)`, `getDiatonicSeventhChords*(root)`,
`SCALE_DEGREE_NAMES` + `getSeventhDegreeName`, `INTERVAL_LABELS`,
`INTERVAL_NAME_TO_SEMITONES`, `CHORD_SYMBOLS`, `CHORD_QUALITY_NAMES`, `parseChordSymbol`,
`identifyChordFromNotes`, `getPitchClass`, `areEnharmonic`. The WS6-fixed
`INTERVAL_LABELS[8] = 'Minor 6th'` is authoritative.

**F1 — Key signatures** (the 15 major + 15 minor spellable keys, incl. the enharmonic
trio C♯/D♭ etc.)
- key → number of accidentals ("A major?" → `3♯`)
- key → ordered accidental list ("A major?" → `F♯ C♯ G♯`)
- accidental count/list → key, asked separately for major and minor answers
- relative pairs, both directions ("relative minor of C major?" → `A minor`)
- Feedback teaches the derivation rules: *last sharp = leading tone; second-to-last
  flat = tonic; F major memorized*.

**F2 — Circle of fifths**
- order-of-sharps facts (F C G D A E B) and order-of-flats (reverse), as next-in-chain
  questions ("after C♯, the next sharp added is?" → `G♯`)
- neighbor questions ("a fifth up from D?" → `A`; "a fifth down from F?" → `B♭`)

**F3 — Scale spelling** (major, natural/harmonic/melodic minor; 15 + 15 tonics)
- spell-the-scale with the **accidental-slot input** (§3.3): the seven letters are
  shown fixed (they're forced — only accidentals vary); the user sets ♭/♮/♯ per slot.
  Harmonic/melodic minor asked ascending only in v1.
- degree extraction ("the 3rd degree of A major?" → `C♯`) — each (key, degree∈2..7)
  is its own item.

**F4 — Scale degree names**
- number ↔ name both directions (1↔Tonic … 7↔Leading Tone; Subtonic noted in feedback
  for the natural-minor 7th). Tiny family; mastered early; feeds F8/F9 prompts.

**F5 — Intervals** (ascending only in v1)
- natural-note pair → name ("E up to F?" → `minor 2nd`) — all 21 natural ascending
  pairs within the octave; these are the white-key landmark facts.
- altered pair → name for a curated confusable set (M3 vs P4 boundaries, tritone
  spellings A4/d5, m6/M6 region, M7).
- root + interval name → note ("a perfect 5th above B?" → `F♯`; "a major 3rd above
  E♭?" → `G`) across the 12 common roots × {m3, M3, P4, P5, m6, M6, m7, M7}.
- letter-skeleton micro-skill: "a third above G (letter only)?" → `B` — the
  C-E-G-B-D-F-A thirds cycle, 7 items, introduced before any chord spelling.
- semitone ↔ interval recognition facts (13 items, e.g. "7 semitones = ?" → `P5`),
  explicitly framed in feedback as recognition facts, not the spelling method.

**F6 — Triad spelling, both directions** (maj/min/dim/aug × 14 practical roots:
C C♯ D♭ D E♭ E F F♯ G♭ G A♭ A B♭ B)
- name → notes ("spell F♯ minor") via note chips
- notes → name ("D F A = ?") via root+quality chips; validation via
  `buildChord`-generated answer, not `identifyChordFromNotes` (single correct spelling).

**F7 — Seventh chords, both directions** (maj7, dominant 7, m7, m7♭5, dim7 × the same
roots; mMaj7 excluded from v1 introduction order but generated)
- same two directions as F6
- ladder relationship facts in feedback ("from Amaj7 to A7: lower the 7th a half step")
  — Nuno's "darkening ladder" framing from his chord reference doc.

**F8 — Diatonic chords & Roman numerals**
- pattern facts: quality sequence in major (I ii iii IV V vi vii°), natural minor
  (i ii° III iv v VI VII), harmonic-minor V and vii° ("in minor keys with the raised
  7th, the chord on 5 is?" → `major (V)`).
- instances: "(key, degree) → chord" ("vi of E major?" → `C♯ minor`) and reverse
  ("in G major, A minor is which degree?" → `ii`) for all 15 major + 15 minor keys ×
  degrees 1–7, priority-ordered (see introduction order below).
- is-it-diatonic judgments ("does B♭ major contain a D minor chord?" → yes/iii).

**F9 — Function & cadences** (the concept-heavy ~20%; mostly multiple-choice with
confusable lures)
- chord → function in key ("in C major, F major functions as?" → `subdominant/
  pre-dominant`)
- cadence ID from Roman-numeral pairs ("V → vi at a phrase end?" → `Deceptive
  cadence`). Terminology follows the app's existing curriculum (Perfect Authentic,
  Imperfect Authentic, Half, Deceptive, Plagal) with the UK/ABRSM equivalent shown in
  feedback ("Deceptive — UK: interrupted").
- dominant-function spelling hooks ("the V7 of E♭ major?" → `B♭7`) — bridges F7/F8.

Approximate bank size: ~1,000–1,200 items (the exact count emerges from generation;
invariant tests assert per-family ranges). That is intended — new items trickle in at
≤ the configured per-session cap (default 4) in **introduction order**: F4 → F2 → F1 (common keys first: C G D A E F
B♭ E♭ A♭, then the rest) → F5 letter-skeleton + naturals → F6 common roots → F3 →
F5 altered → F7 → F8 → F9, interleaved across families once ≥ 2 families are active.
Family toggles in settings let him focus (default: all on).

### 3.3 Answer input formats (4 components, all thumb-sized, zero-submit)

All inputs grade on the final tap — no confirm button. Tap targets ≥ 44 pt. No typing.

1. **NoteChips** — chips for the 7 letters, long-row of accidental variants as needed
   (e.g. `C C♯ D♭ D …` for root selection; for spelling, tap 3–4 chips in any order;
   the chip set per question is the 12–17 plausible notes). Order-insensitive for
   chord spelling (root is named in the prompt). Auto-grades when the expected note
   count is reached.
2. **AccidentalSlots** (scale spelling) — seven fixed letter slots, each cycling
   `♮ → ♯ → ♭` on tap; grades on a single "done" tap (the one exception to
   zero-submit, since slots are toggled). Pre-filled with all-natural.
3. **ChoiceChips** — 3–5 chips for naturally-small answer sets (interval names, chord
   qualities, Roman numerals, cadence types, keys, counts like "3♯"). Lures are
   generated confusables: adjacent circle-of-fifths keys, m/M quality flips, the
   actual enharmonic traps — never random.
4. **RootQualityChips** (notes → name) — two-stage single surface: pick root chip,
   then quality chip; grades on the second tap.

A shared `DrillAnswerSurface` wrapper gives all four identical feedback behavior.

### 3.4 Feedback (the "teach me" half)

- **Correct:** chip flashes the success state, a compact tick + the canonical answer
  line renders, auto-advance after ~600 ms. Optional sound: the chord/interval/scale
  plays briefly on the sampled piano (existing core audio; respects a settings
  toggle, default ON — it reinforces the ear link and the silent-switch on iPhone
  governs it at work anyway).
- **Wrong:** the correct answer + a one-line *why* render (e.g. "Key signatures add
  sharps in F-C-G-D-A-E-B order; A major takes the first three: F♯ C♯ G♯."), advance
  on tap so he actually reads it. The why-line is part of the item definition.
- **Enharmonic near-miss** (answered G♭ where F♯ was right, etc.): distinct feedback
  ("That's the same *sound* but the wrong *spelling* — in this context it must be F♯
  because …"). Graded wrong for the scheduler.
- **Learn more:** a small link on wrong answers deep-links into the relevant Learn
  module via a static `family → moduleId` map (pattern: `src/data/qualityToModule.ts`).

### 3.5 Scheduler & mastery model

- **Library:** `ts-fsrs` (MIT, actively maintained), wrapped in a thin
  `src/services/drillScheduler.ts` so the dependency stays swappable and all calls take
  an injectable `now` (repo testing convention). If the package proves unsuitable
  during implementation (size, API, determinism), implement the FSRS-4.5 scheduling
  math directly in the wrapper with published default parameters — the wrapper API is
  the contract, the library is an implementation detail.
- Desired retention 0.9. Grade mapping from the binary+latency result is a single
  rule: wrong → `Again`; correct but slow (> 6 s) → `Hard`; correct (≤ 6 s) → `Good`.
  `Easy` is never auto-granted (FSRS treats it aggressively); the mastery tier
  (below) carries the "by heart" semantics instead of the FSRS grade.
- **Intra-session relearning:** a new item must be answered correctly twice within its
  introduction session (initial + one re-queue ~8–12 questions later) before FSRS
  scheduling takes over. A wrong answer re-queues the item within the session
  (successive-relearning step 1).
- **Mastery tiers** (display semantics, computed from history, independent of FSRS
  internals): `new` → `learning` (seen, not yet 2-correct) → `review` (in FSRS
  rotation) → **`by heart`** = last 3 *cross-session* answers all correct with median
  response time < 3 s. Lapses demote to `review`.
- Response times are recorded per answer (capped log, last 10 per item + lifetime
  counts). Time is measured from prompt render to grading tap; the timer is **never
  displayed** unless sprint mode (§3.7).

### 3.6 Session composer

- Default session: 24 questions (settings: 12 / 24 / 40). A session is a *target*, not
  a cage — ending early loses nothing; reaching the end shows the summary.
- Composition per session: all FSRS-due items first (most overdue first), then weak
  `learning` items, then up to 4 new items (introduced as a mini-block of the same
  family, then re-queued interleaved), topped up with near-due "confidence" reviews to
  fill the target (~70/30 weak-vs-confident overall). Within those tiers, order is
  shuffled (seeded PRNG, repo convention) with the constraint that the same item never
  appears twice in a row and new-item second exposures sit ≥ 6 questions after the
  first.
- **All-caught-up state** (no due, no new enabled): the session becomes a pure
  confidence/speed mix of `review`/`by heart` items — the app never says "nothing to
  do" and never manufactures fake urgency.
- Family toggles in settings filter the whole pipeline.

### 3.7 Sprint mode (the one game-shaped thing, deliberately self-referenced)

- A small "Sprint" button on the session-summary and mastery-map screens — never
  interrupts normal flow.
- 60 seconds, items drawn ONLY from `review`/`by heart` tiers (sprinting new material
  is anti-pedagogical), count of correct answers, personal best stored per family
  filter. No leaderboards, no sounds of failure, no streaks. Sprint results update
  sprint bests ONLY — they touch neither FSRS state nor the response-time logs that
  feed mastery tiers (sprint pressure must not punish scheduling or demote items).

### 3.8 Mastery map

- Reachable from the drill header (⚙ row) — one screen: per family, a horizontal
  stacked bar of new / learning / review / by-heart counts, plus overall totals and
  "due today" count. Tapping a family toggles it on/off for sessions (same state as
  settings). Informational only — no goals, no guilt mechanics.

### 3.9 Settings (inside Drill, minimal)

Session length (12/24/40) · family toggles · feedback sound on/off · show timer
during questions (off by default; showing it is the opt-in time pressure) · new items
per session (0–8, default 4; 0 = review-only mode).
Persisted in the drill store. No global settings page changes.

### 3.10 i18n & accessibility

- New `drill` namespace in `en.json` + mirrored `pt.json` / `es.json` (~50 keys: UI
  labels + prompt/feedback templates with interpolation). Music nomenclature stays in
  English per the repo convention (note names, interval names, chord symbols, Roman
  numerals untranslated). Prompt templates live in the regular locale files (drill
  items are generated, not curriculum content — the overlay system is NOT involved).
- A11y per repo standard: ARIA labels on all chips, focus management between
  questions, `aria-live="polite"` feedback region, WCAG AA contrast in both themes,
  `prefers-reduced-motion` respected (no confetti in drill regardless).

## 4. Engineering design

New files (names indicative, follow repo idiom):

```
src/core/utils/drillBank.ts        item generation from core (framework-agnostic, pure)
src/core/types/drill.ts            DrillItem, DrillFamily, AnswerSpec, InputFormat types
src/services/drillScheduler.ts     ts-fsrs wrapper, grade mapping, mastery-tier logic (pure, injectable now)
src/services/drillSession.ts       session composer (pure, seeded PRNG, injectable now)
src/state/drillStore.ts            Zustand + persist: per-item SRS state, RT logs, settings, sprint bests
src/views/DrillView.tsx            view shell: session runner / summary / mastery map / settings
src/components/drill/              QuestionCard, NoteChips, AccidentalSlots, ChoiceChips,
                                   RootQualityChips, DrillAnswerSurface, FeedbackStrip,
                                   SessionSummary, MasteryMap, DrillSettings, SprintRunner
```

- **drillStore persistence:** new key `fermata-drill-v1` (do NOT touch the legacy
  `music-theory-*` keys). Persisted shape: `{ items: Record<itemId, ItemState>,
  settings, sprintBests, lifetime counters }`. Shape-validate in `migrate` AND `merge`
  per the WS6 pattern; unknown item IDs are dropped lazily; missing IDs start fresh.
  Wire into the existing reset-app-data escape hatch.
- **View wiring:** extend `ViewMode`, `VIEW_COMPONENTS` in `App.tsx`, `VIEWS` +
  `VIEW_KEYS` in `TopBar.tsx`, lazy import like the others. AppShell hides the
  always-visible instrument bar when `view === 'drill'` (drill owns its vertical
  space; §3.1). Add `view` query-param handling at boot + persisted last-view restore
  in the preferences slice (persist version bump with migration).
- **Audio on reveal:** route through the existing core audio seam (`playNote` paths —
  sampled piano with FM fallback); never block grading on audio.
- **Validation:** reuse `getPitchClass`/`areEnharmonic`/`buildChord`/`buildScale` for
  grading; enharmonic near-miss detection = pitch-class match with spelling mismatch.
- **Bundle:** DrillView lazy-loads; `ts-fsrs` is imported only by the scheduler module
  inside the drill chunk. No VexFlow in drill v1.
- **PWA:** drill chunk participates in the existing Workbox precache automatically
  (verify in build output); manifest gains `shortcuts`. Remember the repo gotcha:
  pairing any header change with a content change (not expected here).

### Testing (repo gates apply: `tsc -b --force`, full vitest, eslint, build, audits)

- **drillBank invariants:** every generated item's answer re-validates against the
  core engine (spelling-exact); no duplicate IDs; counts per family within expected
  ranges; introduction order monotone in difficulty rank.
- **Golden fixtures (hand-verified in the test file):** A major = F♯ C♯ G♯; E♭ major =
  B♭ E♭ A♭; F♯ major = 6♯ incl. E♯; relative minor of E♭ = C minor; P5 above B = F♯;
  M3 above E♭ = G; spell C♯m7♭5 = C♯ E G B; vi of E major = C♯ minor; harmonic minor
  of A spells G♯; "D F A" = D minor; V7 of E♭ = B♭7; deceptive cadence = V→vi.
  (These catch generator-logic bugs that engine-roundtrip checks can't.)
- **Scheduler:** deterministic-now unit tests for grade mapping, relearning steps,
  mastery-tier transitions incl. lapse demotion; property test that intervals grow on
  Good and reset on Again.
- **Session composer:** mix ratios, new-item cap and mini-block placement, no
  immediate repeats, family filtering, all-caught-up behavior, determinism per seed.
- **Store:** persistence round-trip, corrupt-state shape-guard, version migration,
  reset integration.
- **Components:** RTL tests per input component (grading on expected tap counts,
  a11y roles), FeedbackStrip states (correct / wrong / enharmonic near-miss),
  view-switch integration (tab renders, session starts, mid-session exit preserves
  state).
- **i18n:** drill namespace key-parity across en/pt/es (extend the existing parity
  test or add one).

## 5. What NOT to build (binding)

- No XP, streaks, badges, leaderboards, daily goals, reminder notifications, lives.
- No accounts, no cloud, no analytics.
- No staff-notation question rendering in v1 (keep VexFlow out of the drill chunk).
- No ear-training question type (L9 owns that; the feedback sound is reinforcement,
  not an exercise).
- No instrument-tap answer input in v1 (Learn's exercise system already offers it;
  drill optimizes for one-hand phone speed).
- No descending intervals, no modes, no jazz extensions in the v1 bank.
- No curriculum coupling: drill state never reads or writes module progress/SRS.
- No new themes, no design-token changes.

## 6. Acceptance criteria

1. From a fresh install on an iPhone-sized viewport: tap Drill → first question visible
   in < 1 s (post-load), complete 24 questions entirely with one thumb, kill the app at
   question 13 → reopen → state intact, no answer lost.
2. All four input formats reachable in one session when families allow; every grading
   decision matches the core engine's spelling exactly; enharmonic near-miss feedback
   triggers on (at minimum) F♯/G♭, C♯/D♭, D♯/E♭ confusions in spelling items.
3. A wrong answer always shows the why-line; its content states the rule, not just the
   answer.
4. New-item introductions per session never exceed the setting; due items always
   precede new ones; mastery map counts reconcile with store state.
5. An item answered correctly < 3 s (median) across 3 sessions shows as "by heart";
   one lapse demotes it.
6. PT and ES render every drill string (no raw keys), nomenclature untranslated.
7. All repo gates green: `npx tsc -b --force`, `npx vitest run`, `npm run lint`,
   `npm run build`, `npm run audit:all` (existing audits unaffected; drill invariants
   live in vitest).
8. PR opened from `ws9-drill-mode` with the Vercel preview link; production untouched
   until Nuno approves on his phone.

## 7. Build order (for the implementation plan)

1. Core types + `drillBank.ts` for F1/F2/F4 + invariant/golden tests (proves the
   generation pattern).
2. `drillScheduler.ts` (ts-fsrs wrapper) + tests.
3. `drillStore.ts` + persistence guards + tests.
4. `drillSession.ts` composer + tests.
5. View shell + TopBar/ViewMode wiring + QuestionCard + ChoiceChips (first playable
   slice, F1/F2/F4 end-to-end).
6. Remaining inputs (NoteChips, AccidentalSlots, RootQualityChips) + F3/F5/F6 bank.
7. F7/F8/F9 bank + feedback audio + Learn deep-links.
8. Mastery map + settings + sprint mode.
9. i18n PT/ES mirror + a11y pass + PWA manifest/boot param + last-view restore.
10. Gates, self-review, PR.

## 8. Deferred (explicitly v2+, do not half-build)

Staff-notation prompts (VexFlow variant of F6/F7) · instrument-tap input mode ·
descending intervals & compound intervals · modes · sprint history charts ·
home-screen widget · Apple Shortcuts integration.
