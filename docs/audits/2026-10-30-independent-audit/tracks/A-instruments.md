<!-- Saved by main session from the agent's SubagentHandback (agent Write was blocked by harness) -->
## Track A summary

The harness would not let me save `findings.md` ("Subagents should return findings as text"). The full report is below this summary; please save it as `$A/findings.md` if you want the file.

`$A = /private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/A-instruments`. All scripts, outputs (`out_*.txt`) and real-component render tests (`render/*.test.tsx`, run with `npx vitest run --config $A/vitest.audit.config.ts <name>`) are there.

**32 findings: 10 S1, 18 S2, 4 S3.** All are verified by script output or rendered DOM except where marked.

**Top 5:**
1. **A-2: four scales crash the whole app, and it stays crashed after reload.** Dim W-H, Dim H-W, Bebop Dom and Bebop Maj all crash it. Confirmed on the live site for Bebop Dom. The only in-app way out is "Reset app data", which deletes all progress. I restored Nuno's saved settings exactly afterwards; his progress and Drill data were never touched.
2. **A-1: scale-position chips (confirms and refines your starting fact).** 74 of 85 positions are wrong, checked against my own independent oracle. Across the 972 position views actually drawn, 3,074 dots sound a note outside the scale and 7,037 carry the wrong degree label. Open-string notes in a position are never drawn (431 notes), and the boxes don't move up the neck in order.
3. **A-3 and A-4: the staff shows wrong notes.**
   - Harmonic and melodic minor in flat keys have no natural signs, so C harmonic minor reads as natural minor (12 key/scale cases). Confirmed with a real VexFlow render.
   - Any C♭ or B♯ is drawn an octave off (74 scale cases you can actually select, 137 chords such as A♭m and E+).
4. **A-6 and A-7: your two circle-of-fifths observations, confirmed and enumerated.**
   - Modes, minor pentatonic and blues show the root's *major* key signature; C♯ major shows "5♭" and A♭ minor shows "5♯" (90 combos).
   - Roman numerals are major-key numerals assigned by note order, so they are wrong for every non-major scale (252 combos).
   - Also, on load the circle takes keyboard focus and shows "C · Current key" whatever key is selected (A-21, confirmed live).
5. **A-5 and A-9: the fretboard leaves notes out.** It shows only 7 of 12 notes of Chromatic and 7 of 8 of Bebop Dorian. In guitar-mode exercises it shows none of the notes the learner taps, while the piano shows 22 keys.

Your blues spelling question is A-12: "b5 / D♯" contradictions in 36 combos, plus the same pattern in whole tone and chromatic. A-13 and A-14 cover the same problem in the scale-comparison and chord-builder panels.

---

# Track A — Instruments and visual displays: findings

Repo state: commit `228f541` (read-only). Date: 2026-10-30.

**How to rerun:**
- Engine scripts: `cd /Users/nunosantos/Documents/Base/Music/new_music_app && npx tsx $A/<script>.ts`
- Real components in jsdom: `npx vitest run --config $A/vitest.audit.config.ts <name>`. Each writes `$A/out_<name>.txt`. The vite cache lives in `$A/.vitecache`, and `$A/node_modules` is a symlink, so nothing is created in the repo.
- The oracle, `$A/oracle.ts`, imports nothing from the app. It builds scales from step patterns and rotations or from explicit degree formulas, spells one letter per degree, and counts key signatures from the spelled major scale.
- The oracle's self-tests in `engine_scales.ts` pass, and a planted wrong value is caught.

## Findings

### A-1: Most hand-authored scale positions (the "Scale Pos" chips) are wrong
- **Severity / type:** S1, incorrect.
- **Where:** `src/core/constants/guitarScalePositions.ts`, the data at lines 36–2909 and the base-fret logic at 2988–3012. Drawn via `Fretboard.tsx:91-109` and `FretCell.tsx`.
- **Evidence:**
  - `npx tsx $A/scalepos_data_oracle.ts` checks against the independent oracle: `unique authored positions: 85; fully correct: 11`. Of 1,303 notes, 635 are mislabelled, 275 sound outside the scale, and 27 positions are missing at least one degree.
  - The 11 correct positions: pent. minor Box 1, blues Box 1, major Pos 1–2, lydian Pos 1–2, mixolydian Pos 1–2, whole tone Pos 1, lydian dominant Pos 2, major blues Pos 2.
  - Real render (`scalepos_render`): 972 renders (33 scales × 12 roots × each chip) draw 14,389 dots. Of these, 3,074 are out of scale and 7,037 have the wrong label; only 121 renders are clean.
  - Examples (`out_scalepos_layout_A.txt`):
    - A minor pentatonic Box 2: the dot labelled `6/7:b3` actually sounds B.
    - A major Pos 5: all 17 notes are wrong.
    - A natural minor Pos 1: the B and E strings are shifted one fret (the B-string offset was ignored).
  - 30 positions have a `rootString/rootFretOffset` that does not point at a "1" (`out_audit.txt`).
  - In one dot, the label comes from the data but the colour from the true pitch (`FretboardString.tsx:118-120`), so a wrong dot shows a mismatched label and colour. Out-of-scale dots are still drawn, in the accent colour.
- **Scope:** 74 of 85 positions. The errors are the same in every key. `ionian` and `aeolian` are dead alias entries.
- **Fix:** generate positions from the formula and tuning instead of hand data, and add a CI test equivalent to `scalepos_data_oracle.ts`.
- **Status:** verified.

### A-2: Four scale types crash the whole app and persist through reload
- **Severity / type:** S1, bug.
- **Where:** `chords.ts:686-694`. `getRomanNumeral` looks up `baseNumerals[7]`, which is undefined, then calls `.toLowerCase()` on it. This is reached from `useKeyContext.ts:71`. The 8-entry quality lists are at `chords.ts:591, 601, 627, 638`. `selectedScale` is persisted and passes the store guard (`store.ts:36`).
- **Evidence:**
  - `diatonic_crash.ts`: throws for dim W-H, dim H-W, bebop dominant and bebop major, for all 12 roots. A planted case proves the detector works.
  - All render audits record the same 4 crashes.
  - Live: "More scales → Bebop Dom" replaces the page with "Something went wrong — Cannot read properties of undefined (reading 'toLowerCase') — Reload / Reset app data — clears saved progress". After a reload the same screen returns, with `selectedScale` still `bebop_dominant`.
  - I then restored the original `music-theory-app` value exactly. The Drill (10,886 chars) and progress (217 chars) entries were untouched.
- **Expected vs actual:** the scale should display. Instead the app is dead until the user wipes all their data.
- **Scope:** 4 of 37 scale types; 48 of 444 root × scale combos.
- **Fix:** guard degree ≥ 7 in `getRomanNumeral`. Make recovery reset `selectedScale` only, keeping progress.
- **Status:** verified (live for Bebop Dom; jsdom for all four).

### A-3: The staff has no natural signs for raised 6th/7th in flat-key minor scales, so it reads as the wrong notes
- **Severity / type:** S1, incorrect.
- **Where:** `useStaffNotation.ts:127-134` only draws an accidental when the note has one. The minor key signature comes from `notationHelpers.ts:60-74`. Shown in `ChordWorkspace.tsx:102-111`.
- **Evidence:**
  - `staff_audit.ts`: 17 notes are misread, e.g. "C harmonic_minor: B♮ drawn without ♮ — reader sees Bb".
  - Real VexFlow render (`staff_vexflow`): C harmonic minor draws 5 flats and no natural; C melodic minor draws 4 flats and no natural.
- **Expected vs actual:** C harmonic minor should read C D E♭ F G A♭ B♮. It reads as C natural minor.
- **Scope:** 12 combos. Harmonic minor on C, E♭, F, A♭, B♭; melodic minor on C, D, E♭, F, G, A♭, B♭.
- **Fix:** `Accidental.applyAccidentals(voices, keySig)`, or emit `'n'` for naturals the signature alters.
- **Status:** verified.

### A-4: C♭ and B♯ notes (scales and chords) are drawn an octave off on the staff
- **Severity / type:** S1, bug.
- **Where:** `pianoLayout.ts:217-252` and `265-289` give B♯ the *next* octave number (the octave its pitch falls in), but VexFlow places notes by letter (`vexflow/build/esm/src/tables.js:282`). `notationHelpers.ts:21-25` passes the number straight through.
- **Evidence:**
  - `staff_audit.ts`: 138 of 518 scale cases. That is 89 with KeySelector roots, of which 74 are selectable (excluding the four crashing scales). Examples: C♯ major `b#/5` (+12); A♭ minor `cb/4` (−12).
  - 137 of 750 chord cases, e.g. A♭m `[ab/4 cb/4 eb/5]` and E+ `[e/4 g#/4 b#/5]`.
  - Real VexFlow: C♯ major notehead y-positions `…90,50,80`; A♭ minor `90,85,115,…`.
- **Expected vs actual:** the scale should step upward. Instead one note jumps an octave.
- **Scope:** 74 selectable scale combos and 137 chords.
- **Fix:** assign octaves by letter (scientific pitch) when building pitched notes.
- **Status:** verified.

### A-5: Scales with more than 7 notes lose notes on the full-neck fretboard
- **Severity / type:** S1, bug.
- **Where:** `useKeyContext.ts:105` only has colours for degrees 1–7, so degree 8+ gets no colour. `FretboardString.tsx:122,136` treats "no colour" as "not in scale" and draws nothing.
- **Evidence:** `fretboard_fullneck`, 2,772 renders (6 tunings × 37 scales × 14 roots × 96 cells):
  - Chromatic: 3,367 cells not lit (e.g. C: string 6 fret 3, G, not lit).
  - Bebop Dorian: 677 not lit.
  - Every other scale: 0 missing and 0 extra, so the detector works.
  - The piano lights these notes, so the two instruments disagree.
- **Scope:** Chromatic (7 of 12 notes shown) and Bebop Dorian (7 of 8), in all roots and tunings.
- **Fix:** decide scale membership from pitch class, and colour separately (see A-15).
- **Status:** verified.

### A-6: The circle of fifths centre shows the wrong key signature
- **Severity / type:** S1, incorrect.
- **Where:** `CircleOfFifths.tsx:18-20, 63-70, 372`.
- **The rule it uses:** if the scale is natural, harmonic or melodic minor, it finds the root's pitch class on the *minor* ring; otherwise on the *major* ring. It then prints that slot's signature, ignoring both spelling and mode.
- **Evidence:** `circle_degreebar`, 462 real renders: 110 wrong.
  - By type: each of the 5 modes 14; pent. minor 14; blues 14; each of the 3 minor types 3; major, pent. major and major blues 1 each.
  - Examples: A dorian shows "A · 3♯" (should be 1♯); C♯ major shows "C# · 5♭" (should be 7♯); A♭ minor shows "Abm · 5♯" (should be 7♭); A pent. minor shows "A · 3♯" and highlights the A-major segment.
  - The circle's constants themselves are correct: 0 mismatches (`misc_engine.ts`).
- **Scope:** 90 root × scale combos that have a standard signature. The other 280 non-diatonic cases show the root's major signature without saying that none applies.
- **Fix:** take the signature from the spelled parent key of the built scale; hide it for non-diatonic scales.
- **Status:** verified.

### A-7: The circle's Roman numerals are major-key numerals by note order, for every scale
- **Severity / type:** S1, incorrect.
- **Where:** `CircleOfFifths.tsx:125-131, 259-271` together with the numeral table in `circleOfFifthsConstants.ts:43-45`.
- **Evidence:** 294 of 308 seven-note cases are wrong; only major is right.
  - Example, A dorian: A shows I (should be i), C shows iii (III), E shows V (v), F♯ shows vi (vi°), G shows vii° (VII).
  - Blues gets numerals by note order, as you observed live.
- **Scope:** 252 root × scale combos, plus every non-heptatonic scale.
- **Fix:** use `diatonicChords[i].numeral` placed on the matching ring; show nothing when that list is empty.
- **Status:** verified.

### A-8: The interval-exercise staff spells notes with sharps only
- **Severity / type:** S1, incorrect.
- **Where:** `ExercisePrompt.tsx:47-63`.
- **Evidence:** `interval_staff.ts` flags 12 of the 43 interval exercises (authored + generated). Three are half-step questions where C–C♯ is legitimate, leaving 9 real errors:
  - l2u7m1e2: the prompt says "C up to Eb", the staff shows C–D♯.
  - l2u7m2e2: the prompt says "C up to Db", the staff shows C–C♯.
  - l1u3m3g4/g5: the prompt says "Count both letter names", the staff shows F–G♯ (a 2nd by letters, but the answer is a minor 3rd).
  - Also l2u7m1g3/g6, l2u7m2g1/g5 and l4u14m1g6.
- **Fix:** spell the target note by interval (letter = root + number − 1).
- **Status:** verified.

### A-9: In guitar mode, notes tapped during an exercise are never shown on the fretboard
- **Severity / type:** S1, bug.
- **Where:** `useKeyContext.ts:194-210` sends the tapped notes through a chord-highlight channel. `Fretboard.tsx:25` never reads that channel (only tests do).
- **Evidence (`exercise_input`):**
  - C, E and G tapped: 0 fretboard dots, while the piano shows 22 lit keys.
  - Control (normal Explore): 51 dots.
- **Scope:** every instrument-answer exercise done on guitar.
- **Fix:** light the tapped pitch classes on the fretboard.
- **Status:** verified.

### A-10: "Diatonic" chord buttons contain notes outside the scale
- **Severity / type:** S1, incorrect.
- **Where:** `DIATONIC_QUALITIES` at `chords.ts:558-680`, and `getDiatonicChordsForScale` at `702-723`, which assigns numerals by note order.
- **Evidence:** `misc_engine.ts`: 492 of 2,256 buttons. Examples in C:
  - Hungarian minor: II+ = D augmented, but A♯ is not in the scale.
  - Persian: I = C major, but G is not in the scale.
  - Hirajoshi: II = D major (F♯ and A are not in the scale), and G is labelled "IV".
- **Scope:** 13 scale types. This overlaps the chord-theory track.
- **Fix:** build triads by stacking thirds within the scale; return nothing for non-heptatonic scales.
- **Status:** verified.

### A-11: Ear-training chords and progressions sound inverted
- **Severity / type:** S2, bug.
- **Where:** `ExerciseRunner.tsx:112,123` calls `playChord(notes, 4)`, and `audio.ts:716-729` plays every note in the same octave.
- **Evidence (`audio_audit.ts`):**
  - 475 of 600 chords have a non-root bass (28 of 48 basic triads). Example: G major plays G4 B4 D4, so D is lowest.
  - Of the diatonic triads in C, IV, V, vi and vii° all play inverted.
- **Fix:** use `playChordVoiced`.
- **Status:** verified.

### A-12: The Scale Degrees bar labels one interval but spells another ("b5 / D♯")
- **Severity / type:** S2, incorrect.
- **Where:** labels come from semitone counts (`scales.ts:115-124` and `chords.ts:455-467`). Spellings come from the degree maps at `scales.ts:222/224/228`: blues `[0,2,3,3,4,6]` gives ♯4, although the code comment says b5.
- **Evidence:** 42 of 462 renders contradict themselves (14 each for blues, whole tone and chromatic). Examples: A blues "b5/D#"; C♯ blues "b5/F##"; A whole tone "b7/F##"; C chromatic "m3/D#".
- **Source:** Wikipedia "Blues scale" (fetched 2026-10-30): the blue note "can be spelled as either a ♭5 or a ♯4". Either is fine, but label and spelling must agree.
- **Scope:** 36 root × scale combos. The same spelling appears on fretboard and piano labels.
- **Fix:** spell blues with ♭5, and label all non-heptatonic degrees from letter distance.
- **Status:** verified.

### A-13: Scale Comparison uses fixed column labels ("b5" over Lydian's F♯)
- **Severity / type:** S2, incorrect.
- **Where:** `ScaleComparison.tsx:13`.
- **Evidence (`scale_comparison`, all 1,188 pairs in C):** 1,288 contradictions. Examples: major vs lydian shows "b5" over F♯; lydian augmented shows "b6" over G♯; altered shows "3" over F♭.
- **Fix:** label each row from its own spelling.
- **Status:** verified.

### A-14: The chord-builder chromatic strip mis-spells intervals
- **Severity / type:** S2, incorrect.
- **Where:** `ChordBuilderPanel.tsx:79-86` and `ChromaticStrip.tsx:5-7`.
- **Evidence (`chromatic_strip`):** 64 of 720 blocks. Examples: C major shows m2 as C♯, m3 as D♯, m6 as G♯, m7 as A♯; D minor shows M3 as G♭ and M7 as D♭.
- **Fix:** spell each step by its interval above the chord root.
- **Status:** verified.

### A-15: Degree colours follow note order, not function, for non-7-note scales
- **Severity / type:** S2, incorrect.
- **Where:** `useKeyContext.ts:80-106`, `ScaleDegreeBar.tsx:44-46`, `ScaleComparison.tsx`, `ChordWorkspace.tsx:107`.
- **Evidence:** fretboard and piano renders show colour mismatches for every pentatonic and hexatonic scale (e.g. pent. minor 2,518; heptatonic scales 0). In C major pentatonic, G is emerald (the subdominant colour) and A is amber (the dominant colour).
- **Fix:** take the degree number from the spelled letter.
- **Status:** verified.

### A-16: The fretboard's string-name column is re-spelled by key
- **Severity / type:** S2, ux.
- **Where:** `FretboardString.tsx:66-68,170-176`.
- **Evidence:** 2,888 instances. Examples: the B string labelled "Cb" in G♭ major; the E string "Fb" in A♭ minor; the G string "F##" in C♯ lydian.
- **Fix:** always print the tuning name in that column.
- **Status:** verified.

### A-17: Diminished, whole-tone and C♯ blues spellings use needless double accidentals
- **Severity / type:** S2, incorrect.
- **Where:** `scales.ts:212-240`.
- **Evidence:** `engine_scales.ts` finds 0 wrong pitches in 777 cases, but the spellings are poor:
  - C dim H-W: C D♭ E♭ F♭ G♭ A♭♭ B♭♭ B♭ (conventional: C D♭ D♯ E F♯ G A B♭).
  - E♭ dim H-W has four double flats.
  - C♯ whole tone: C♯ D♯ E♯ F## G## A##.
  - Across all 444 KeySelector combos (`dbl_acc_count.ts`), 52 use at least one double accidental, and 30 of those need fewer from the enharmonic root.
- **Status:** verified. That these spellings are unconventional is inferred from common practice.

### A-18: The staff repeats accidentals already in the key signature
- **Severity / type:** S2, incorrect.
- **Where:** `useStaffNotation.ts:129-134`.
- **Evidence:** 168 redundant accidentals. VexFlow draws 7 flats for E♭ major (3 in the signature + 4 on notes) and 15 sharps for C♯ major.
- **Fix:** same as A-3.
- **Status:** verified.

### A-19: Some chord fingerings and barres cannot be played
- **Severity / type:** S2, incorrect.
- **Where:** `guitarChordShapes.ts:1280-1297` (A6 shape) and `guitarVoicingGenerator.ts:541-573` (computer-generated shapes).
- **Evidence (`chord_shapes_audit.ts`):** 600 combos and 2,292 displayed shapes.
  - Clean: 0 wrong notes, 0 missing roots, 0 badge/barre mismatches. The existing `chordDisplay.test` also passes (exit 0, 1,201 tests).
  - The A6 shape uses finger 1 on two different frets (x,5,7,7,7,7 with fingers bar,1,1,1,2). It is the default voicing for D♭6 to E6.
  - About 40 generated shapes put finger 4 on two frets.
  - 41 generated barres lie over open strings; e.g. the default G aug7 (3,2,1,0,0,1) has a barre on strings 4–1 at fret 1 with strings 3 and 2 open.
  - 1 shape reaches fret 16, past the 15 frets drawn.
  - 73 default voicings have a non-root bass.
- **Scope:** 53 shapes with finger problems and 53 with barre problems (12 hand-authored, the rest generated), plus 1 off-board.
- **Status:** verified.

### A-20: Under alternate tunings, a selected chord silently shows the scale
- **Severity / type:** S2, bug.
- **Where:** `Fretboard.tsx:45` and `FretboardString.tsx:136`.
- **Evidence (`alt_tuning_chord`):** in Drop D with C major selected (key D major), the board shows the D major scale and no notice.
- **Also checked:** all 6 tunings have correct pitches, MIDI numbers and Hz, and the full-neck scale display is correct in all 6.
- **Status:** verified.

### A-21: On load, the circle grabs focus and shows "C · Current key"
- **Severity / type:** S2, bug.
- **Where:** `CircleOfFifths.tsx:115-120`.
- **Evidence:** in jsdom, focus lands on "C major" at mount. Live, with A minor selected: the focused element is the C-major segment and the centre reads "C / Current key / no ♯/♭ · rel: Am".
- **Status:** verified.

### A-22: Circle clicks bypass the store's reset logic
- **Severity / type:** S2, bug.
- **Where:** `CircleOfFifths.tsx:72-91` writes state directly, and `KeySelector.tsx:8-21,135-142` has one button per pitch class.
- **Evidence (`ux_state`):**
  - After the circle's "Harmonic" button, the stale position index is 4 and no chip is selected.
  - Clicking E major keeps "Pos 5" selected.
  - D♭ or G♭ chosen from the circle leaves no root highlighted in the KeySelector.
- **Status:** verified. The stale highlight position is inferred from code.

### A-23: Position view hides open-string notes but shows unrelated open-string dots
- **Severity / type:** S2, bug.
- **Where:** `Fretboard.tsx:133` and `FretboardString.tsx:209`.
- **Evidence (`open_in_position`):**
  - E minor pentatonic Box 1 has 12 notes, 6 of them open strings; only 6 dots are drawn.
  - A major Pos 2 sits at frets 7–12, yet shows open-string dots E A D B E.
  - Across all renders, 431 authored notes are hidden.
- **Status:** verified.

### A-24: Positions do not tile the neck or run in order
- **Severity / type:** S2, incorrect.
- **Where:** `guitarScalePositions.ts:2988-3012`.
- **Evidence:**
  - A minor pentatonic box base frets: 5, 7, 0, 0, 5. Box 3 and Box 4 overlap; frets 11–15 are never covered.
  - Every scale has gaps on the neck in key C (`out_audit.txt`).
  - The highest note any position reaches is fret 15, so nothing falls off the board.
- **Status:** verified.

### A-25: Double-accidental roots fall back to C when placing positions
- **Severity / type:** S2, bug.
- **Where:** `guitarScalePositions.ts:2961-2994`.
- **Evidence:** 37 double-accidental roots are reachable through the "Compatible scales" button (`CurrentChordPanel.tsx:269-272`). Example: F## locrian positions land at frets [8,10,3,3,8] (C's) instead of [3,5,10,10,3] (G's).
- **Fix:** use `getPitchClass`.
- **Status:** verified. The full click path is inferred from code.

### A-26: The fretboard ignores chord inversion and slash-chord bass
- **Severity / type:** S2, ux.
- **Where:** `Fretboard.tsx:43-60` and `guitarChordShapes.ts:3503`.
- **Evidence:** C major inversions 0, 1 and 2 draw identical dots. Dm7/G never shows a G.
- **Status:** verified.

### A-27: Low-octave piano chords put a non-root in the bass; octave buttons can leave the keyboard
- **Severity / type:** S2, bug.
- **Where:** `pianoLayout.ts:265-330` and `Piano.tsx:359`.
- **Evidence:**
  - At octaves 1–3, 147 of 252 root-position chords are lit with a non-root at the bottom (e.g. F major at octave 1 lights C1 F1 A2).
  - Octave button C8 with G major: 0 of 8 scale keys exist. C7 with B major: 1 of 8. C0 with C major: 3 of 8.
- **Status:** verified.

### A-28: The guitar's octave-transposing notation is neither applied nor stated
- **Severity / type:** S2, content-gap.
- **Where:** `useStaffNotation.ts:72-99` and `ChordWorkspace.tsx:102-111`.
- **Evidence:** a grep for 8vb or "octave lower" finds only orchestral curriculum text (which proves the grep works). With the guitar selected, the staff is in concert pitch with no treble-8vb clef and no note saying so.
- **Status:** verified. The impact on a guitarist reading the staff is inferred.

### A-29: Interval notation is mixed ("m3" next to "b7", "R" vs "1", "TT")
- **Severity / type:** S3, ux.
- **Evidence:** 98 degree bars mix the two styles; e.g. A minor pentatonic reads "R m3 4 5 b7".
- **Status:** verified.

### A-30: The position chip resets to "All" on every key or scale change
- **Severity / type:** S3, ux.
- **Where:** `musicSlice.ts:11-14`.
- **Fix:** keep the chip when the new scale has that many positions.
- **Status:** verified from code.

### A-31: Piano screen-reader labels give the wrong octave for B♯/C♭
- **Severity / type:** S3, incorrect.
- **Where:** `PianoKey.tsx:200-207,257,349`.
- **Evidence:** the C5 key is announced as "B#5" (B♯5 is a different, higher note).
- **Status:** verified.

### A-32: Tech debt in the shape libraries
- **Severity / type:** S3, tech-debt.
- **Evidence:**
  - Two scale-position entries (ionian, aeolian) can never be reached.
  - In a sample of 3 roots, 87 of 335 hand-made chord shapes sound a wrong note and are silently filtered out at runtime. This includes the C-shape and G-shape major barres, so CAGED shapes a learner expects are missing.
- **Status:** verified.

## Improvements
1. **One spelling/degree helper for every display.** A-12 to A-15, A-17 and A-29 share one cause: labels and colours are derived from semitone counts or note order, not from the spelled letter.
2. **Turn these harnesses into CI tests:** `scalepos_data_oracle.ts`, `staff_audit.ts` and the `fretboard_fullneck` render.
3. **Choose the root spelling by mode** (D♭ major, C♯ minor, G♯ minor). This would remove 30 of the 52 double-accidental spellings.
4. **Add a "reset view settings, keep progress" option** to the error screen.
5. **Generated 3-notes-per-string or Segovia-style fingerings** would suit a classical guitarist better than the CAGED boxes.
6. **Show both enharmonic names** at the bottom three positions of the circle of fifths.

## Unconfirmed suspicions
- The rules for which notes are *lit* and which are *played* at low octaves differ in code (`audio.ts:1018` vs `pianoLayout.ts:299`). I did not run audio.
- Ear-training exercises rooted on C♭ or F♭ would play the two notes an octave apart (`ExerciseRunner.tsx:94-100`). I found no such exercise.
- The KeySelector highlight position after choosing D♭ or G♭ on the circle: jsdom cannot measure layout.
- Bebop Dorian and Hirajoshi have competing definitions in the literature; I did not report these.

## Coverage
- **Scale positions:** all 85 positions; 972 rendered views. Also checked: base-fret range 0–11, highest fret 15, the open-string column, neck tiling, the C fallback, and chip reset behaviour.
- **Full-neck fretboard:** 2,772 renders × 96 cells.
- **Tunings:** 6 × 6 strings.
- **Chords:** 600 combos and 2,292 displayed shapes, plus the existing test run (exit 0, 1,201 passed).
- **Piano:** 396 renders × 88 keys, plus octave edge cases.
- **Staff:** 518 scale and 750 chord cases computed; 5 rendered with real VexFlow; all 43 interval-exercise staves.
- **Panels:** circle 462 renders, constants exact; degree bar 462; scale comparison 1,188 pairs; chromatic strip 720 blocks.
- **Audio:** MIDI 21–108 round trip through note name and frequency (0 mismatches, planted error caught); tunings; playback octave logic.

**Not checked:**
- Real sound output (an agent cannot hear it).
- Mobile layout.
- PT/ES labels for these components.
- Drill answer audio (it ascends correctly by code reading).
- Grading logic.
