# WS5 Audit — Core Escalation (8 bugs in `src/core/`)

These bugs were found during the Fermata WS5 music-theory audit (L1–L9). Every defect below lives in
`src/core/constants/` — the shared-engine constants and curriculum files that Fermata imports **read-only**
from Music AI. Fermata cannot fix these at the source; the corrections must be applied in the Music AI repo
and then re-synced. Items are ordered by learner-facing impact.

---

## B1 — `INTERVAL_LABELS[8]` and `INTERVAL_SHORT_LABELS[8]` are wrong (recurring, highest impact)

**File + lines:** `src/core/constants/chords.ts` line 425 and line 452

**What's wrong now:**
```
INTERVAL_LABELS[8]       = 'Augmented 5th'   // line 425
INTERVAL_SHORT_LABELS[8] = '#5'              // line 452
```

**Correct value:**
```
INTERVAL_LABELS[8]       = 'Minor 6th'
INTERVAL_SHORT_LABELS[8] = 'b6'
```

**Why:** The same file already declares `SEMITONES_TO_INTERVAL[8] = { quality: 'minor', number: 6 }`
(in `src/core/constants/intervals.ts` line 78) and `CHORD_QUALITY_NAMES.minor6 = 'Minor 6th'` (line 198
of `chords.ts`). `INTERVAL_LABELS[8]` is internally inconsistent with both. 8 semitones is canonically a
**minor 6th** in any interval-identification context; "augmented 5th" is the enharmonic chord-context
spelling (raised 5 of an augmented triad), not the default generic-interval label. All adjacent entries
(9 = Major 6th, 10 = Minor 7th, 11 = Major 7th) use the 6th/7th naming correctly; only 8 breaks the
pattern.

**Impact — levels affected (six levels raise this; two at ERROR severity):**
- **L9 E1 (ERROR, active):** L9 is the only level that drills bare m6 by ear. A learner who answers the
  m6 item (8 semitones) is told "Correct! That's an Augmented 5th" — directly contradicting the prompt
  they just read. This is the most visible learner-facing symptom.
- **L2 E1 (ERROR):** Templates `l2u7m1` and `l2u7m2` include 8 in their interval ranges; module title is
  *"Interval Quality: Perfect, Major, Minor"* — "Augmented 5th" is the wrong quality family for that
  lesson.
- Also surfaces as lower-severity notes in L1 (nitpick), L4 (nitpick), L6 (questionable), L7 (nitpick).

**Severity:** Error (L9/L2 active); systemic across six levels.

**App-side mitigation (Fermata, TEMPORARY):** Both consumer sites in Fermata already carry an override
map `{ 8: 'Minor 6th' }` that intercepts the label before falling through to `INTERVAL_LABELS`:
- `src/components/learn/exercises/validateExercise.ts` line 109 (`INTERVAL_LABEL_OVERRIDES`)
- `src/components/learn/exercises/exerciseHelpers.ts` line 16 (`INTERVAL_LABEL_OVERRIDES`)

These overrides are explicitly tagged `// WS5 mitigation … until the core constant is fixed (REMEDIATION B1)`.
**Once `INTERVAL_LABELS[8]` is corrected in core, both override maps should be removed from Fermata.**

---

## B2 — Wrong interval label in worked SATB voicing (`curriculumL3.ts`)

**File + line:** `src/core/constants/curriculumL3.ts` line 286, task `l3u10m1t1`

**What's wrong now:**
```
"alto-tenor gap (a major 3rd — under an octave)"
```

**Correct value:**
```
"alto-tenor gap (a major 6th — under an octave)"
```

**Why:** The voicing is Bass C2, Tenor G3, Alto E4, Soprano C5. G3→E4 = 9 semitones = a **major 6th**,
not a major 3rd (which is 4 semitones; G3→B3 would be a 3rd). The soprano-alto label on the same line
("a minor 6th") is correct. The N1 nitpick from L3 is a fold-in candidate: C2→G3 = 19 semitones = a
perfect 12th (compound P5), not literally "a perfect 5th" — the mod-octave class label is acceptable
shorthand but literally inaccurate.

**Impact:** Module `l3u10m1` (Voice Leading — SATB Basics). Teaching-text error with no exercise-grading
consequence; a careful student following the worked example will compute a different interval from the
label they're given.

**Severity:** Error (wrong arithmetic stated as fact in a worked example).

**App-side mitigation:** None possible — core teaching prose.

---

## B3 — SATB voice ranges stated inconsistently between concept and template (`curriculumL3.ts`)

**File + line:** `src/core/constants/curriculumL3.ts` line 263, concept text for `l3u10m1`

**What's wrong now:**
```
concept:  Alto F3–C5,  Bass E2–C4
template hint (templatesL3.ts, editable): Alto F3–D5,  Bass E2–D4
```

**Correct value:** Pick one convention and apply it to both. The internal contradiction (alto top C5 vs D5,
bass top C4 vs D4 for the same module) is the error — the specific bounds are convention-dependent.

**Why:** A single curriculum module gives two different range limits for the same two voices. Learners who
read both will receive contradictory "facts."

**Impact:** Module `l3u10m1`. Teaching prose only; no grading effect.

**Severity:** Error (internal contradiction).

**App-side mitigation:** Partial. The template hint (`src/data/exercises/templatesL3.ts`, editable) can
be aligned to whatever the core concept states, removing the contradiction app-side. The core concept
text itself must be authoritative.

---

## B4 — Diminished-7th "Four Possible Resolutions": "strictly Bbb minor" parenthetical is incoherent (`curriculumL6.ts`)

**File + line:** `src/core/constants/curriculumL6.ts` line 259, module `l6u19m1`, concept "Four Possible
Resolutions"

**What's wrong now:**
```
"Respell as Ab-Cb-Ebb-Gbb: resolves to A minor (strictly Bbb minor; A minor via enharmonic respelling as G#-B-D-F)."
```

**Correct value:**
```
"Respell the original chord as G#-B-D-F (G# as leading tone): resolves to A minor.
The four target tonics — C, Eb, Gb, A — are each a minor third apart."
```
Drop the "Bbb minor" parenthetical entirely.

**Why:** No Bbb appears in the chord and nothing points to a "Bbb minor" tonic. The leading tone to A is
G# (= Ab enharmonically), resolving up to A. The clean resolution to A minor requires spelling the
original B-D-F-Ab as **G#-B-D-F** (G# as leading tone) — which the very next concept in the same file
states correctly. The Ab-Cb-Ebb-Gbb spelling is the stackedminor-thirds continuation; pairing it with
"(strictly Bbb minor)" is a confused conflation that will mislead a careful student.

**Impact:** Module `l6u19m1` (Diminished 7th Enharmonic Reinterpretation). The four target tonics and the
symmetry claim are correct; only the fourth-resolution spelling logic is garbled.

**Severity:** Error (incoherent theoretical claim in an explanation).

**App-side mitigation:** None possible — core teaching prose.

---

## B5 — Chromatic turnaround bass-motion description: self-contradictory and factually wrong (`curriculumL7.ts`)

**File + line:** `src/core/constants/curriculumL7.ts` line 333, module `l7u21m6`, task `l7u21m6t3`

**What's wrong now:**
```
"The bass descends chromatically by minor thirds and fourths: C–Eb–Ab–Db."
```

**Correct value:**
```
"Roots C–Eb–Ab–Db move by ascending minor 3rd then two ascending perfect 4ths."
```
(Or equivalently: descending major 6th / descending 5ths for the last two moves.)

**Why:** Two independent errors in one clause:
1. "Descends" is wrong — C→Eb is up a minor 3rd; Eb→Ab and Ab→Db are up perfect 4ths. The line
   **ascends**.
2. "Chromatically" is wrong and internally contradicts the same clause — chromatic motion means by
   half-step; motion by minor thirds and perfect fourths is not chromatic by definition.

The tritone-sub identifications in the same sentence (Eb7 subs for A7, Ab7 for D7, Db7 for G7) are
correct.

**Impact:** Module `l7u21m6` (Rhythm Changes and Turnarounds). A student who tries to hear "chromatic
descent" will be confused by what they actually play. No exercise-grading effect.

**Severity:** Error (two compounding factual errors in a task instruction).

**App-side mitigation:** None possible — core task text.

---

## B6 — "Andalusian cadence" attached to the wrong four chords (`curriculumL7.ts`)

**File + line:** `src/core/constants/curriculumL7.ts` line 644, module `l7u23m1`, concept "Common Pop
Progressions"

**What's wrong now:**
```
"The i-bVI-bIII-bVII 'Andalusian' cadence sounds dark and cinematic."
```

**Correct value:** Either:
- Rename to the actual Andalusian cadence: **i–bVII–bVI–V** (the descending-tetrachord-to-dominant
  progression from flamenco), or
- Keep i-bVI-bIII-bVII and relabel it (e.g. "minor Axis / vi-rotation of I-V-vi-IV").

Do not call i-bVI-bIII-bVII "Andalusian."

**Why:** The Andalusian cadence is **i–bVII–bVI–V** — it ends on the dominant (V), which is its defining
harmonic motion (descending tetrachord bass from tonic to dominant). The progression the text labels
"Andalusian" (i-bVI-bIII-bVII) contains no V chord and ends on bVII. It is in fact the minor-key
rotation of the I-V-vi-IV "Axis" loop, which the same module correctly discusses under a different name.
The label is simply attached to the wrong progression. (Source: Wikipedia "Andalusian cadence";
StudyBass; Chordly — all define it as i-bVII-bVI-V.)

**Impact:** Module `l7u23m1` (Pop Progressions). A student who searches for or listens to "Andalusian
cadence" examples will find a different progression than what the app teaches under that name.

**Severity:** Error (wrong label for a named progression).

**App-side mitigation:** None possible — core teaching prose.

---

## B7 — `dominant7alt` engine formula carries only 2 of 4 canonical alterations (`chords.ts`)

**File + line:** `src/core/constants/chords.ts` line 82

**What's wrong now:**
```ts
dominant7alt: [0, 4, 6, 10, 13],  // R, 3, b5, b7, b9
```
This renders C7alt as C–E–Gb–Bb–Db: only two alterations (b5 and b9).

**Correct value:** The canonical alt chord carries **all four alterations**: b9, #9, #11 (= b5), and #5 (= b13).
A common voicing: `[0, 4, 6, 10, 13, 15, 20]` = R, 3, b5, b7, b9, #9, b13 (or rootless/5th-omitted
variant). The exact voicing choice is yours, but the formula must include at minimum b9 AND #9 AND b5/#11
AND #5/b13 to match the text.

**Why:** L7 curriculum text repeatedly and correctly defines the alt chord as carrying all four
alterations ("every non-shell tone is chromatically displaced", `l7u21m2` line 87; "b9, #9, #11/b5,
b13/#5", task `l7u21m2t2` line 108; and again in `l7u23m3` and `l7u23m5`). Every one of these passages
then instructs the student to type `C7alt` or `tryThisQuery: 'C7alt'` to hear the described chord — but
the engine renders only b5+b9, missing #9 and #5/b13. The lesson is internally inconsistent at the exact
moment of verification.

**Impact:** Modules `l7u21m1`, `l7u21m2`, `l7u23m3`, `l7u23m5` — all `tryThisQuery: 'C7alt'`
interactions, plus hand-authored exercise `l7u21m1e3` (answer text is canonically correct but
contradicts the rendered chord). L7 E3 (error) and L7 Q3 (questionable) both reference this.

**Severity:** Error — the curriculum makes a specific audible promise (`tryThisQuery`) and the engine
breaks it.

**App-side mitigation:** None. Both the engine formula (`chords.ts`) and the L7 prose (`curriculumL7.ts`)
are under `src/core/`; neither can be edited in Fermata. Escalate both together; the prose fix should
follow whichever formula is chosen.

---

## B3 addendum — Cut-time concept in `curriculumL4.ts` (mirror of app-side A12)

**File:** `src/core/constants/curriculumL4.ts`, module `l4u14m2` concept text (exact line not pinned —
search for "same written notes as 4/4" or "felt in 2").

**What's wrong:** The concept states cut time "contains the same number of quarter notes as 4/4 but is
felt in 2" — conflating note-count with beat-unit. The app-side exercise hint (`exercisesL4.ts`
`l4u14m2e3`) carries the same error and can be fixed by Fermata independently (A12). The core concept
text is noted here for completeness; fix alongside A12 for consistency.

**Correct value:** "Cut time (alla breve, 2/2) has two half-note beats per measure. A 2/2 bar has the
same total duration as a 4/4 bar, but the beat unit is a half note rather than a quarter note, giving a
broader, faster-moving feel."

**Severity:** Error (low impact). **App-side mitigation:** Partial (exercise hint is editable; concept
text is not).

---

## Summary table

| # | File | Symbol / line | One-line fix |
|---|------|---------------|--------------|
| B1 | `chords.ts:425,452` | `INTERVAL_LABELS[8]`, `INTERVAL_SHORT_LABELS[8]` | Change to `'Minor 6th'` / `'b6'` (matches `SEMITONES_TO_INTERVAL[8]`); remove Fermata overrides |
| B2 | `curriculumL3.ts:286` | `l3u10m1t1` task text | "alto-tenor gap (a **major 6th**)" not major 3rd |
| B3 | `curriculumL3.ts:263` | `l3u10m1` concept, voice-range sentence | Align Alto/Bass top notes with `templatesL3.ts` (C5/C4 or D5/D4 — pick one) |
| B4 | `curriculumL6.ts:259` | `l6u19m1` concept "Four Possible Resolutions" | Drop "strictly Bbb minor"; restate as "Respell as G#-B-D-F: resolves to A minor" |
| B5 | `curriculumL7.ts:333` | `l7u21m6t3` task text | "bass descends chromatically" → "roots ascend: m3 then two P4s" |
| B6 | `curriculumL7.ts:644` | `l7u23m1` concept "Common Pop Progressions" | Rename "Andalusian" to i–bVII–bVI–V, or relabel the given chords |
| B7 | `chords.ts:82` | `dominant7alt` formula | Expand to include b9+#9+b5/#11+#5/b13; align L7 text to chosen formula |
| B3a | `curriculumL4.ts` | `l4u14m2` concept (search "same written notes as 4/4") | Fix cut-time beat-unit vs. duration conflation (mirrors app-side A12) |

**Items not confirmed to exact line:** B3a (`curriculumL4.ts` cut-time concept) — line not pinned; the
symbol/search string above will locate it.
