# Decisions taken for the fix programme (2026-10-30)

Nuno, 2026-10-30: "we need to do all the improvements … do it all the way until all is solved and improved as you see best". The 24 open decisions in `decisions.md` were therefore taken by Claude (Opus 5.5) on the basis below. Each is reversible; Nuno can overrule any of them.

| # | Decision | Call | Why |
|---|---|---|---|
| D-01 | Ask Zoltán first | Not blocking. Build generated positions with standard one-finger-per-fret fingering **plus** a fingering override (D-03), so his fingerings slot in later without rework. Nuno to ask him at the next lesson. | The override removes the rework risk that made this a blocker. |
| D-02 | Position system / default view | Classical positions generated from the scale engine (Open, I–XII; 4-fret window with marked stretches; left-hand finger numbers), as the default practice view; whole neck stays available as "All"; the hand-typed CAGED/3NPS data is removed, not repaired; the chosen position persists across key changes. | Track G + Track A agree; repairing rock boxes has little value for a classical player. |
| D-03 | Fingering authority | Both: generated default, local override that becomes the default when set. | |
| D-04 | Exam intent | None branded. Implement a syllabus-neutral Grade-5 technical set (2-octave scales, arpeggios, dominant and diminished 7ths, scales in 3rds/6ths/octaves). | No stated exam plan; the set is common to ABRSM, Trinity, LCM and the Madeira EAE. |
| D-05 | Staff with guitar selected | Treble clef with the small 8 below (written an octave above sounding) when the guitar is the instrument; plain treble for piano. One sentence in the L1 clef lesson. | Standard guitar convention; VexFlow supports it. |
| D-06 | Instrument in Drill | Yes, only for the new reading drill. | |
| D-07 | Repertoire data | Key-only "key of the piece" workspace; no built-in piece list. | Avoids three-language upkeep. |
| D-08 | Microphone experiment | Skip for now. | Unknown value, large effort; available on request. |
| D-09 | Answer reveal | Hint only after a first wrong try; reveal after the final attempt. | Makes scores mean something; keeps two attempts. |
| D-10 | Level gating | "Unlock anyway" on locked levels + soft "pairs with Level n" badges in Level 9. | Least restrictive change that still signals order. |
| D-11 | Ear-training scope | Add a key/reference pre-roll; add a melody ear mode so the dictation modules do what they say. | "Do all the improvements". |
| D-12 | Harmonic-minor modes | Reword the L7 objective to the two modes the app has. | Off a classical path; adding five scales adds translation and test surface for little use. |
| D-13 | Notation conventions | Blues blue note as ♭5; flat-prefixed numerals for church modes (♭VII); scale-degree labels in ♭3 style, interval names in m3 style (two different concepts). **Amended 2026-10-30 (coordinator):** blues blue note is ♭5, except where ♭5 would need a double flat; then ♯4 (E♭ blues = E♭ G♭ A♭ A B♭ D♭). | Matches the L7 lessons and common usage. The amendment avoids a double flat where the blue note's degree identity allows the enharmonic ♯4; heptatonic spellings are unchanged. |
| D-14 | Theory conventions | Second species: Fux (passing tones only). 7♯9: blues / half-whole first, altered for 7alt. maj11: Major first. | Track C's suggestions; textbook-standard. |
| D-15 | Drill "by heart" | First answer per session, across ≥ 3 sessions spread over ≥ 2 calendar days; one lapse demotes. | Matches the Drill spec's acceptance criterion. |
| D-16 | `points` field | Delete. | Weighting would change every pass mark. |
| D-17 | Scale names in PT/ES | Translate scale chips, key names in Drill, toasts and all interface text. Chord-quality symbols stay as symbols. | PT prompts already say "menor natural"; a translator exists. |
| D-18 | Note names in PT/ES | Letters (C, D, E) throughout PT/ES text, matching instruments, answers and chord symbols. A Dó-Ré-Mi display option can follow on request. | The app is used in English (Nuno's saved settings); letters are the only form chord symbols allow. |
| D-19 | PT/ES terminology | "fundamental" for chord root; "meio-tom"; one cadence term set per language, taken from each language's own lesson text. | Consistency; both PT forms are correct. |
| D-20 | Instrument dock in Learn | Collapsed by default in Learn; opens automatically when an exercise needs the instrument. | |
| D-21 | App updates | Ask before reloading (prompt mode); check for updates when the app returns to the foreground. | |
| D-22 | First-visit downloads | Load samples on first use; Bravura-only notation fonts; static index for the Learn banner. | |
| D-23 | Unit milestone summaries | Show at unit completion. | Data and translations already exist. |
| D-24 | L6–L8 planning docs | Mark as superseded. | |

## Amendments

- **D-13 (2026-10-30, coordinator):** Blues blue note is ♭5, except where ♭5 would need a double flat; then ♯4. Implemented in `src/core/utils/degreeSpelling.ts` (`spellScale`), branch `fix/w1-w2-spelling-harmony`.
