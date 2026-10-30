# Track G — fit for a classical guitarist (Opus subagent, 2026-10-30)

Saved by the main session from the agent's returned text (the agent's own Write was blocked by a harness rule). Source PDFs extracted under `src-abrsm/`, `src-trinity/`, `src-lcm/`, `src-pt/`, `src-hu/` in this folder. Labels: [V-src] quoted source · [V-code] file:line · [inferred] · [verify].

## Why the fretboard shows the whole neck
1. Default `guitarScalePosition = null` ("All"); `setKey`/`setScale` reset it to null (`src/state/slices/musicSlice.ts:12,14`); with null every in-scale cell is painted (`FretboardString.tsx:136`). [V-code]
2. Positions are opt-in chips from rock/pop pedagogy: header "based on the CAGED/5-position system" (`guitarScalePositions.ts:1`), pentatonic "Blues Box" (`:37`), 3-notes-per-string major (`:520-525`); chips "Pos 1 (E)" (`FretboardPositionSelector.tsx:92`); standard tuning only, no chord selected (`Fretboard.tsx:77-82`). [V-code]
3. Finger numbers authored but never drawn for scales — dots show degrees (`FretCell.tsx:164`); fingers only for chords (`FretboardString.tsx:127`). [V-code]
4. Classical "position" = fret under index finger, Roman numerals (V = index at 5) [R18, R19]; exam boards stage reading by position (Gr1 1st → Gr3 2nd → Gr5 up to 5th → Gr6 above) [R4]; scales examined over 2–3 octaves with shifts [R3, R9, R12, R21]. Fermata's "Pos 1 (E)" for C major sits at fret 8 — collides with lesson vocabulary. [V-code + inferred]
The whole-neck map still has a job ("where else can I play this pitch?") — not as the practice default.

## Research (cited, accessed 2026-10-30)
| # | Claim | Source | Excerpt | Status |
|---|---|---|---|---|
| R1 | ABRSM: from Gr5 fingers-only scales in both strokes | abrsm.org/sites/default/files/2023-09/complete_guitar_syllabus.pdf | "from Grade 5, these scales must be prepared with both right-hand techniques" | verified |
| R2 | ABRSM: LH fingering free | same | "Any left-hand fingering may be used" | verified |
| R3 | ABRSM Gr5 set | same p.25 | D maj / A min harm 2 oct; E maj / G min melodic 2 oct thumb+fingers; chromatic from B 2 oct; interval scales (A maj 6ths, F maj octaves, A min mel 10ths); broken chord E min; arpeggios D,E maj / A,G min 2 oct; dom7 in D; dim7 on A | verified |
| R4 | ABRSM sight-reading positions by grade | same p.12 | Gr1 "1st position"; Gr3 "2nd position"; Gr5 "up to 5th position"; Gr6 "above 5th position … partial barrés"; Gr8 "full barrés" | verified |
| R5 | ABRSM Gr5 list incl. Carcassi Op.60 No.16 (F), Take Five, Bye Bye Blackbird | same p.24 | quoted | verified |
| R6 | ABRSM Gr6 theory prerequisite | same p.25 | "PREREQUISITE FOR ENTRY: ABRSM Grade 5 (or above) in Music Theory…" | verified |
| R7 | ABRSM scale rules; Gr5 speed ♩=96 | same pp.10–11 | "from memory … lowest possible tonic … legato" | verified |
| R8 | 2019 syllabus still current | — | — | [verify] |
| R9 | Trinity Gr5 technical work (Digital Grades, Apr 2023) | trinitycollege.com/resource?id=9181 | E♭ maj / A nat min 2 oct; G maj broken 3rds; C maj 6ths; dom7 in A; Set B dim7 on E; scales ♩=92; ppppima / ppimim | verified (face-to-face equivalence [verify]) |
| R10 | Trinity studies grouped "for tone and phrasing / articulation / idiomatic" | same | quoted | verified |
| R11 | Trinity syllabus has no end date | trinitycollege.com/qualifications/music/grade-exams/classical-guitar | "no longer operate with an end date" | verified |
| R12 | LCM Gr5 technical | lcme.uwl.ac.uk/…/technical-requirements-…classical-guitar.pdf (rev. 28 Apr 2023) | E maj 3 oct ♩=96; B mel min 2 oct; chromatic from E 3 oct; dom7 in B♭; G maj 3rds; F maj octaves; G maj 6ths | verified |
| R13 | LCM positions as exam content | same | Gr1 "C major in three positions"; Gr3 "move smoothly between 1st and 2nd position"; Gr6 "A major in four positions" | verified |
| R14 | LCME 2022 syllabus current; written by RGT@LCM | lcme.uwl.ac.uk; rgt.org | quoted | verified |
| R15 | RGT@LCM: early-grade scales come from the pieces' keys | rgt.org/exams/classical-guitar.php | "taken from the keys of the pieces … relate their learning of scales to practical music" | verified |
| R16 | Madeira EAE programme Gr1–5 | conservatorioescoladasartes.com/…/EAE-Programa-de-GUITARRA.pdf | "1 escala diatónica na primeira posição"; 3º grau "mudanças de posição", "terceiras paralelas"; 5º grau 3rds/6ths/octaves, dom7 & dim7 arpeggios, Carcassi Op.60 nº6–10 | verified (date unclear) |
| R17 | Coimbra: Carcassi Op.60 nº3 at 5º grau; scales in binary & ternary subdivision | conservatoriomcoimbra.pt/…/2026/03/Guitarra-Classica-Matrizes… | quoted | verified |
| R18 | Classical "nth position" definition + Roman numerals | en.wikipedia.org/wiki/Classical_guitar_technique | "first finger over the nth fret" | verified (secondary) |
| R19 | Same, teaching site | classicalguitarcorner.com/playing-in-positions-on-the-guitar | "first finger … fifth fret … fifth position" | verified (secondary) |
| R20 | Notation: LH 1–4, circled string numbers, p-i-m-a | Wikipedia, Classical guitar technique | quoted | verified (secondary) |
| R21 | Segovia scales: one fixed 2–3 oct fingering per key, with shifts | tonebase.co/guitar-blog-posts/segovia-scales-classical-guitar | "one fixed fingering across two or three octaves" | verified (secondary) |
| R22 | Carlevaro Cuaderno 1 = diatonic scales, detailed fingering | allclassicalguitar.co.uk review | quoted | verified (secondary); shift approach [verify] |
| R23 | Giuliani Op.1 Part 1 = 120 RH arpeggios (1812) | imslp.org Op.1 | quoted | verified; single-progression claim [verify] |
| R24 | Sor Op.60 = 25 progressive lessons | imslp.org | quoted | verified |
| R25 | Carcassi Op.60 = 25 studies, keys listed | imslp.org | No.16 key inconsistent on page; ABRSM says F | verified |
| R26 | Azores secondary: position shifts, 3-oct scales | edu.azores.gov.pt/…/Criterios-Secundario-Guitarra.pdf | quoted | verified (above his level) |
| R27 | Hungarian teacher training uses Carcassi/Carulli/Sor/Giuliani, tirando–apoyando, shifts | u-szeged.hu (Szeged, not Miskolc) | quoted | verified; Miskolc [verify] |
| R28 | Kodály movable-do encodes degree function | Wikipedia | quoted | verified (secondary); Zoltán's use [verify] |
| R29 | Guitar sounds an octave below written | Wikipedia, Transposing instrument | quoted | verified (secondary) |
| R30 | VexFlow 5.0.0 in repo supports treble 8vb clef | node_modules/vexflow/build/esm/src/clef.js:89-91 | `annotation === '8vb' … gClef8vb` | verified (local) |
| R31 | Soundslice fretboard synced to notation/playback | soundslice.com/features | quoted | verified (vendor claim) |
| R32 | Guitar Pro 8 scale tool: >1,000 scales, follows tuning | guitar-pro.com/docs/gp8/tools/scales | quoted | verified (vendor docs) |
| R33 | musictheory.net: 4 fretboard ID drills; reverse drill only for keyboard | musictheory.net/exercises | list | verified (absence inferred) |
| R34 | JustinGuitar names patterns 1–5 after CAGED, avoids "position" | justinguitar.com (403) | snippet only | [verify] |

## Gaps for a classical guitarist
Strengths to keep: Drill covers key signatures, circle, degree names, intervals, triads, sevenths, Roman numerals, cadences (`drillBank/index.ts`) — maps onto his stated gap; nylon-string guitar samples (`services/guitarSampler.ts`); L1–L4 harmony underpins dom7/dim7 requirements.

| ID | Sev | Gap | Evidence | Effort |
|---|---|---|---|---|
| G-1 | S1 | Position model is CAGED/pentatonic/3NPS; "Pos 1 (E)" for C major sits at fret 8 — clashes with classical naming | `guitarScalePositions.ts:1,37,520`; `FretboardPositionSelector.tsx:92`; base-fret math `:2988-3013` [V-code]; [R18,R19] | M |
| G-2 | S2 | "All" default, reset on every key/scale change | `musicSlice.ts:12,14` | S (with G-1) |
| G-3 | S2 | LH finger numbers authored but never drawn for scales; no RH p-i-m-a layer | `FretboardString.tsx:127`, `FretCell.tsx:164`; [R3,R9,R12] | S (after data replaced) |
| G-4 | S2 | No first-position (open-string) fingerings; positions are root-on-string mod 12 | `getScalePositionBaseFret`; [R16,R4] | M |
| G-5 | S2 | No 2–3 octave routes with shifts; Explore staff = 1 octave at octave 4; playback ascending only | `ChordWorkspace.tsx:104`; `ExploreView.tsx:47`; [R3,R9,R12,R21] | M–L |
| G-6 | S2 | No interval scales, broken chords, fingered dom7/dim7 arpeggio routes | [R3,R9,R12,R16] | M |
| G-7 | S2 | Staff not connected to guitar: written pitch octave 4, no 8vb, no staff→neck mapping, no reading Drill; exercise instrument input grades pitch classes only | `useStaffNotation.ts:99`; `InstrumentInput.tsx:10`; [R29,R30] | M |
| G-8 | S2 | No "key of the piece" practice bundle | [R15]; parts exist (ChordGrid, cadence modules) | M |
| G-9 | S2 | No technique scaffolding (stroke tags, RH patterns, tempo targets, practice log) | [R1,R9,R23,R10] | M |
| G-10 | S3 | Melodic minor ascending only; can't show classical up-raised/down-natural | `scales.ts:13`; [R3,R9] | S |
| G-11 | S3 | No guitar notation literacy (string numbers, Roman positions, LH/RH fingering, 8vb) | curriculum grep; [R18,R20] | S ×3 langs |
| G-12 | S3 | 72 song references, 0 classical-guitar composers | `songReferences.ts`, curriculum grep with positive control | S–M |
| G-13 | S3 | Tunings steel/rock-oriented; positions/shapes off in non-standard tuning (no Drop-D positions) | `guitarTunings.ts:134-141`; `Fretboard.tsx:45,79` | S–M |
| G-14 | S3 | L7 jazz + exotic scale library off his path (keep; optional) | `levels.ts`, `scales.ts` | none |

Bias that still has value: barre shapes (classical vocabulary; ABRSM partial barrés Gr6, full Gr8 [R4]); jazz chord symbols (ABRSM Gr5 List C has Take Five [R5]); whole-neck map for "where else"; pentatonic/blues boxes → behind an "other styles" toggle.

## Improvements (ranked)
Binding constraint before IMP-1/4/5: get Zoltán's scale fingerings/position names first.
1. **Classical position mode (M, highest):** Roman-numeral positions (Open/I…XII), 4-fret window + marked stretches, LH finger numbers, open position, computed from the engine (removes the bad hand-authored data); badge "8fr" → "VIII"; CAGED behind a toggle or dropped. Decision: default view; keep/drop CAGED.
2. **Key-of-the-piece workspace (M, very high):** choose the piece's key → 2-oct scale, tonic arpeggio, V7→I, diatonic triads with numerals, cadences, on staff + fretboard positions [R15]. Optional Carcassi Op.60 key list [R25]. After IMP-1. Decision: built-in piece list vs key-only.
3. **Staff↔fretboard reading drill (M, high):** new Drill family; treble (opt. 8vb [R30]); exact-pitch grading (sounding = written − 8ve [R29]); any valid string/fret or within a named position; reverse drill; ABRSM ladder 1st → 2nd → V → above V [R4]; FSRS. Needs octave-aware grading and Nuno's call on showing an instrument in Drill.
4. **Fingered scale routes + Grade-5 technical set (L, high):** 2–3 octave routes with shifts (Segovia-style one route per key [R21]), melodic minor descending natural, interval scales, broken chords, arpeggios, dom7→I, dim7; RH fingering, stroke, tempo tags [R1,R7]. Optional syllabus lens; generate fingerings, never copy exam books; ABRSM allows any LH fingering [R2]. Decision: exam intent.
5. **Teacher-fingering override (S–M):** edit/save Zoltán's fingering locally; becomes default.
6. **Right-hand pattern & stroke trainer (M):** progression + pattern (Trinity ppppima etc. [R9]; Giuliani-type [R23]); p/i/m/a notation, nylon playback, metronome + tempo ladder, binary/ternary subdivision [R17].
7. **Position walk (M after 1):** one key through positions with guide-finger shifts (LCM Gr6 "A major in four positions" [R13]).
8. **Guitar notation literacy mini-unit + 8vb option (S ×3 langs).**
9. **Small safe fixes (S each):** staff/playback 1/2/3 octaves, up & down, melodic minor descending; persist chosen position (with IMP-1); note-name display letters / Dó-Ré-Mi (PT prose already says "Dó maior" while instruments show letters, `i18n/content/pt/exercisesL5.ts:17`); movable-do only if Zoltán uses it.
10. **Experimental mic feedback (L, unknown value).**
Not recommended: fixing/expanding the CAGED/3NPS data in place; any cloud/teacher-sharing backend.

How others present positions: Soundslice (notation-synced fretboard) [R31]; Guitar Pro 8 (whole-neck reference, tuning-aware) [R32]; musictheory.net (identification drills; no fretboard reverse drill) [R33]; JustinGuitar (patterns vs positions) [R34, verify].

## Decisions only Nuno can make
1. Default fretboard view (position vs whole neck); keep CAGED behind toggle or remove.
2. Fingering authority: app vs Zoltán's (override) vs both.
3. Exam intent (ABRSM/Trinity/LCM or none → "Zoltán's list").
4. Instrument visible in Drill (needed for reading drill).
5. Staff convention (plain treble vs treble-8vb); note names (letters / Dó-Ré-Mi / both).
6. Repertoire data in the app (piece keys) — data + trilingual upkeep.
7. Microphone experiment.
8. Ask Zoltán (zero cost, first): scale fingerings, position names, solmization / Hungarian naming.

## Coverage / limits
Code read (not live app). ABRSM 2019 syllabus currency [verify]; Trinity Digital Grades doc only; LCM recorded-exam requirements only; Segovia/Carlevaro/Pujol from secondary sources (fingerings not seen); Portugal: Madeira EAE, Coimbra 2026, Azores — no single national programme confirmed; Hungary: Szeged only, Miskolc [verify]; JustinGuitar unreachable. Effort sizes inferred; new Learn/Drill text needs EN+PT+ES (parity test). Model: Opus 5.5, no sub-agents.
