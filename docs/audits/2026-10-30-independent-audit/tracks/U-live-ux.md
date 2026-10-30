# Track U — live walkthrough (Opus, in-session)

Surface: production build of `main` @ 228f541 (`npx vite build` → `vite preview` on localhost:4317), Chrome desktop window (screenshots at ~949×743 effective). Local origin used deliberately so Nuno's real progress stored on fermata-music.vercel.app was not touched. Same code as `main`; parity of `main` with the deployed site is Track F's check.

## Findings

### U-1: Scale positions draw notes outside the scale (live confirmation of A-1)
- Severity: S1 · Type: incorrect · Status: verified
- Where: Explore → Guitar → A, Pent. Min → "Box 2 (D)"
- Evidence: `U-box2-wrong-notes.png`. Low E string fret 7 drawn as "b3" (it is B, the 2nd — not in the scale); drawn in brown because the app's own colour lookup finds no scale degree for it. Several more brown dots in the same box. Box 1 is correct.
- Fix: replace hand-authored positions with engine-generated ones (see A-1).

### U-2: Answer feedback colours are nearly unreadable (Learn and Drill)
- Severity: S1 (the key learning moment) · Type: a11y/ux · Status: verified
- Where: Learn exercise feedback; Drill feedback uses the same palette
- Evidence: computed in-page (canvas colour conversion + WCAG formula), `U-feedback-contrast.png`:
  correct option "E" 94,233,181 on 208,231,211 → **1.16:1**; chosen wrong "D#" → 1.36:1; "Not quite" → 1.45:1; hint text (amber on pink) → **1.24:1**; "Try Again" → 1.76:1. WCAG AA needs 4.5:1.
- Fix: darken success/error/hint text tokens (or use dark text + coloured border/icon).

### U-3: Circle of fifths shows the MAJOR key of the root for every scale except major / natural minor
- Severity: S1 · Type: incorrect · Status: verified (pentatonic minor, dorian, blues); inferred for other modes/exotics
- Where: Explore → Circle of Fifths (`src/components/theory/CircleOfFifths*`)
- Evidence (in-page SVG text): A Pent. Min → centre "A · 3♯", A-major segment + F♯m highlighted (`U-circle-pentatonic-3sharps.png`). A Dorian → "A · 3♯", numerals C=iii, G=vii°, D=IV, A=I, E=V, B=ii, G♭=vi (A Dorian has C♮ and G♮; its signature is 1♯). A Blues → "A · 3♯", numerals assigned by note order: C=ii, D=iii, E♭=IV, E=V, G=vi. Natural minor is correct ("Am · no ♯/♭").
- Expected: minor-family/modal scales show their parent key signature (A minor pent → 0, A Dorian → 1♯) or hide numerals; never major-scale numerals by note index.

### U-4: Blues scale spells the ♭5 as D♯
- Severity: S2 · Type: incorrect · Status: verified (A blues)
- Where: Explore header "6 notes · A C D D# E G" and Scale Degrees bar "b5 / D#"
- Expected: E♭ (♭5 of A). The degree label says ♭5 while the letter is a sharpened 4. Check all roots (Track A).

### U-5: Instrument dock eats ~35–40% of the screen in Learn and shows unrelated Explore state
- Severity: S2 · Type: ux · Status: verified
- Where: Learn lesson pages. With the guitar open, the dock still showed "A minor pentatonic, Box 2" from Explore while reading "The Staff and Clefs"; exercise answer buttons were pushed below the fold until the dock was collapsed.
- Fix: in Learn, default the dock collapsed, or drive it from the lesson (show the notes the exercise is about).

### U-6: Drill puts an item and its reverse back-to-back
- Severity: S2 · Type: ux/pedagogy · Status: verified (one session)
- Evidence: fresh session: Q1 "Scale degree 1 is called…?" (Tonic) then Q2 "The Tonic is which scale degree?" — Q1 answers Q2. Q3/Q4 repeated "Scale degree 2 is called…" (re-queue after a miss) with the counter already on "4 of 24" while feedback for item 3 was shown.
- Fix: never schedule sibling/reverse items adjacently in a session; counter should advance on Continue.

### U-7: Exercise "Try Again" after the answer has been revealed
- Severity: S2 · Type: pedagogy · Status: verified
- Where: Learn L1 M1 "Identify this note" — after a wrong answer the panel says "The correct note is E" and offers "Try Again". Retrying a question whose answer is on screen measures nothing. (Track D/B check how retries are scored.)

### U-8: Treble-clef lesson never mentions guitar (sounds an octave lower)
- Severity: S2 · Type: content-gap · Status: verified (lesson text)
- Where: L1 M1 "Treble and Bass Clef" — talks about piano right/left hand only. For a guitarist, the treble clef with the octave-lower convention is the single most relevant fact.

### U-9: Portuguese UI leaves scale names and a toast in English
- Severity: S2 · Type: i18n · Status: verified
- Evidence: in PT, scale chips read "Major, Minor, Harm. Minor, Mel. Minor, Pent. Maj, Pent. Min, Maj. Blues"; the language-change toast says "Language updated". (CLAUDE.md keeps chord-quality names untranslated by convention; scale chips/toasts are UI, not nomenclature — owner's call.)

### U-10: Root selector offers only one spelling per pitch (C♯, E♭, F♯, A♭, B♭)
- Severity: S2 · Type: content/ux · Status: verified (UI)
- C♯ major (7♯) is offered but not D♭ major (5♭); F♯ but not G♭; no way to pick D♭ minor-vs-C♯ minor correctly per mode. Learners see theoretical spellings for common keys.

### U-11: Learn levels hard-locked in sequence; no placement
- Severity: S3 (owner decision) · Type: ux · Status: verified
- An adult at Grade-5 repertoire must complete all of L1 (10 modules) before L2 unlocks, etc.

### U-12: Practice task instruction is ambiguous
- Severity: S3 · "Type 'C major scale'" — where? (It's a link that presumably opens search; reads as an instruction to type somewhere.)

### U-13: Toasts cover the instrument (install prompt / "App ready for offline use") on first visit
- Severity: S3 · Type: ux · Status: verified

### U-14: Small, low-contrast labels on fretboard "All" view
- Severity: S3 · Type: ux/a11y · Status: verified visually (not measured)
- Non-root dots' letters are pale on pale circles; the position chips are 10px text.

## Coverage / limits
- Checked: Explore (root/scale selection, scale header, degrees bar, staff, circle of fifths, guitar positions, tunings visible), Learn (level list, L1 M1 lesson + one exercise + feedback), Drill (first 4 items + miss feedback), Cmd+K search (one query), PT language switch.
- Not checked live: phone width (Chrome window would not resize below the desktop frame — mobile is NOT tested here), Safari/iOS, audio quality, ES language, Learn beyond L1 M1, Build mode, Compare scales, alternate tunings visually, Print/Copy.
- First Cmd+K attempt lost typed text when typing immediately after clicking Search; second attempt (clicking the input) worked. Not reproduced — unconfirmed focus issue.

### U-15: Choosing a diminished scale crashes the whole app, persistently (live confirmation of C-12)
- Severity: S1 · Type: bug · Status: verified live
- Steps: Explore → More scales → "Dim H-W". Whole app replaced by the error screen ("Algo correu mal — Cannot read properties of undefined (reading 'toLowerCase')"), `U-dim-scale-crash.jpg`. Console: TypeError inside a useMemo in the i18n path. Reloading the page shows the same error screen (the scale is persisted). The only in-app exit offered is "Repor dados da aplicação — apaga o progresso guardado" (reset app data, deletes saved progress). Recovered locally only by editing localStorage by hand.
