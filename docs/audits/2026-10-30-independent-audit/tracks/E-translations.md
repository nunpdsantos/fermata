<!-- Saved by main session from the agent's SubagentHandback (agent Write was blocked by harness) -->
## Track E summary: European Portuguese and Spanish

`findings.md` was not written: the harness refused the Write with "Subagents should return findings as text", so the full findings follow below. All scripts and their outputs are in `/private/tmp/claude-501/-Users-nunosantos/2c236006-c5b2-4c0c-8541-483f648fb071/scratchpad/audit/E-translations/`. This is not a native-speaker review.

**25 findings: 4 S1, 10 S2, 11 S3.** The cause behind most of the serious ones: English theory corrections made on 2026-03-09 (`b355d71`), 2026-04-18 (`6bad6a3`) and in `03dc15e` were never carried into Portuguese and Spanish. Git blame shows 36 overlay blocks per language last edited before a later English change. Grading itself is intact: no answer-key, option-count or generated-answer drift between English and Portuguese/Spanish.

**Top 5:**
1. **E-1 (S1):** the Portuguese and Spanish prompt for exercise l1u1m2e1 describes B3 ("the space just below middle C") while the exercise grades A3. A learner who follows the words is marked wrong.
2. **E-2 (S1):** the Portuguese and Spanish 2-3 bass-suspension lesson says it resolves upward. The Portuguese exercise hint for the same module says downward.
3. **E-3 / E-4 (S1):**
   - The common-tone diminished-seventh lesson says all three moving voices resolve by half step (one moves by whole step); 6 strings per language.
   - C to D♭ is called "six positions" round the circle of fifths (it is five).
   - "Seven pitches" should be nine in the polymodality example.
   - Two upper-structure chord names are wrong.
4. **E-7 / E-8 (S2):**
   - Song-reference translations are never applied, so "Songs That Use This" is always English.
   - Plural feedback never works because the `_plural` keys don't match what i18next v25 looks up. Learners see "falta 2 nota", and English shows "missing 2 note".
5. **E-9 / E-10 (S2):**
   - Note names mix solfège (Dó, Ré) in lessons with letters (C, D) on the instruments and answers; 111 Portuguese strings mix both in one sentence.
   - The Drill is mostly English in Portuguese and Spanish beyond the settled chord and interval naming: degree names, key names, cadence names. 723 of 1,315 items are affected.

---

# Track E: European Portuguese and Spanish findings

Path prefixes: `pt/…` and `es/…` = `src/i18n/content/{pt,es}/…`; `pt.json` and `es.json` = `src/i18n/locales/`. The Portuguese and Spanish overlay files are line-aligned, so where only a Portuguese line is cited, Spanish is at the same line (checked at 15 locations).

## Findings

### E-1: Exercise l1u1m2e1 describes a different note in Portuguese and Spanish than the one it grades
- Severity: S1
- Type: incorrect
- Where: `pt/exercisesL1.ts:46` and `es/exercisesL1.ts:46` (`l1u1m2e1.prompt`). English at `src/data/exercises/exercisesL1.ts:76`; the answer is A3 (`:79-81`).
- Evidence:
  - English: "…it sits on the second ledger line below."
  - Portuguese: "…encontra-se no espaço logo abaixo do C central" (that position is B3).
  - Spanish: "…en el espacio justo por debajo del C central".
  - The Portuguese hint contradicts its own prompt ("A3 situa-se duas linhas suplementares abaixo").
  - Git: `b355d71` (2026-03-09) changed the English prompt. The overlay was last edited in `b63cb0f`.
- Scope: 1 string × 2 languages.
- Suggested fix: re-translate the prompt and hint from the current English.
- Status: verified.

### E-2: The 2-3 bass suspension is taught with the wrong resolution direction
- Severity: S1
- Type: incorrect
- Where: module `l4u12m1`, `pt/curriculumL4.ts:32` (objective), `:50` (explanation), `:51` (Try-This label). Spanish at the same lines.
- Evidence:
  - English (fixed in `6bad6a3`, citing Kostka/Payne ch. 12): the bass "resolves downward by step".
  - Portuguese: "resolve para cima… É a única suspensão padrão que resolve para cima".
  - Spanish: "el único retardo que resuelve hacia arriba".
  - The Portuguese exercise hint for the same module was updated and says the opposite (`pt/templatesL4.ts:21`: "resolve para baixo").
- Scope: 3 strings × 2 languages.
- Suggested fix: re-translate from the current English.
- Status: verified.

### E-3: Common-tone diminished seventh: all three moving voices said to resolve by half step
- Severity: S1
- Type: incorrect
- Where: module `l6u19m2`, `pt/curriculumL6.ts` lines 256, 263, 269, 282, 286, 290. Spanish at the same lines.
- Evidence:
  - English: two voices move by half step, one by whole step (A to G).
  - Portuguese: "As três vozes… cada uma por meio-tom". Task 1 still allows "Mi mantém-se".
  - Spanish: "cada una por semitono".
- Scope: 6 strings × 2 languages.
- Suggested fix: re-translate from the current English.
- Status: verified.

### E-4: Three more stale strings state wrong facts
- Severity: S1
- Type: incorrect
- Where and evidence (Spanish identical):
  1. `pt/curriculumL6.ts:200` (`l6u18m4.tasks[2]`): "seis posições" round the circle of fifths. English says five (C→F→B♭→E♭→A♭→D♭).
  2. `pt/curriculumL8.ts:418` (`l8u27m3.concepts[1]`): C Lydian over C Mixolydian "produz as sete alturas diatónicas". English says nine pitch classes (adds F♯ and B♭).
  3. `pt/curriculumL7.ts:376` (`l7u22m2.concepts[0]`): E♭ triad over C7 = "C7#9b13" and A♭ triad over C7 = "C7b9b13". English and computation give C7(♯9) and C7(♯9,♭13).
- Scope: 3 strings × 2 languages.
- Suggested fix: re-translate from the current English.
- Status: verified.

### E-5: Two correct-answer labels still carry claims English removed
- Severity: S2
- Type: incorrect
- Where: `pt/exercisesL7.ts:186` (`l7u21m6e3.choices[0]`) and `pt/templatesL6.ts:260` (`l6u19m4[0].choiceSets[2][0]`). Spanish at the same lines.
- Evidence:
  - The rhythm-changes answer adds "a descer por tons" (descending by whole steps). English removed this in `b355d71`; the hint gives D7-G7-C7-F7, which moves in fifths.
  - The chromatic-mediant answer says the common tone is "(Dó/Mib)". English says (C). E♭ is not in C major.
  - Grading is unaffected; the learner is shown a wrong claim as the right answer.
- Scope: 2 strings × 2 languages.
- Suggested fix: re-translate both labels.
- Status: verified.

### E-6: Nine more stale lesson strings are misleading
- Severity: S2
- Type: incorrect
- Where and evidence (Portuguese line; Spanish identical):
  1. `pt/curriculumL3.ts:427`: Try-This label says "Ouve vi… cadência interrompida", but the button plays `Dm/F` (iv6).
  2. `pt/curriculumL4.ts:233`: label says "Toca G/B… V6/5", but the button plays `G7/F` (V4/2).
  3. `pt/curriculumL6.ts:360`: diminished scale described as "divisão simétrica por 3". English: 8 notes alternating whole and half steps.
  4. `pt/curriculumL7.ts:395`: tells the user to type "C13". English: "C13#11", which is the chord the sentence describes.
  5. `pt/curriculumL4.ts:598-600`: title "Troca de Vozes Cromática" plus an augmented-sixth claim. English retitled it "Chromatic Contrary Motion".
  6. `pt/curriculumL4.ts:680`: "II e IV da menor melódica". English: ii (minor).
  7. `pt/curriculumL5.ts:629`: "Dó mantém-se como nota comum". C is not in G7.
  8. `pt/curriculumL9.ts:188`: "5.ª P descendente = Flintstones". Commit `03dc15e` says that mnemonic is a fourth, not a fifth.
  9. `pt/curriculumL3.ts:232`: doubling advice without the English caveat "unless the soprano is a tendency tone".
- Scope: 9 strings × 2 languages.
- Suggested fix: re-translate these strings; for items 1–2, also check that the label names the chord the button plays.
- Status: verified.

### E-7: Song-reference translations are never applied
- Severity: S2
- Type: bug
- Where: `src/components/learn/ModuleView.tsx:121` calls `getSongReferences(module.id)` and renders `ref.context` at `:350`. `loadSongOverlay` and `applySongOverlay` are called nowhere outside tests (grep rc=0).
- Evidence:
  - The 68 translated contexts per language never render; Portuguese and Spanish users see English.
  - The overlays have also drifted: `l2u6m1` has 3 songs in English but 2 translations; `l4u14m2` has no translations.
- Scope: 36 modules / 71 contexts, both languages.
- Suggested fix: load and apply the song overlay in ModuleView, keyed by language; add the 3 missing contexts.
- Status: verified.

### E-8: Plural feedback never pluralizes
- Severity: S2
- Type: bug
- Where: `pt.json:235-236` (`scaleMissing` / `scaleMissing_plural`) plus 3 more pairs (`scaleExtra`, `chordMissing`, `chordExtra`); the same in en.json and es.json. Reached via `validateExercise.ts` `buildMissingExtraParts`.
- Evidence:
  - The installed i18next 25.8.4, initialised without `compatibilityJSON`, never reads `_plural` keys.
  - Rendered output with count=2: English "missing 2 note", Portuguese "falta 2 nota", Spanish "falta 2 nota".
  - The test-only `fallbackT` handles `_plural` by hand, so the tests pass.
- Scope: 4 key pairs × 3 languages; every build exercise with 2 or more notes missing or extra.
- Suggested fix: rename the keys to `_one` / `_other` and test through a real i18next instance.
- Status: verified.

### E-9: Note names mix solfège and letters, often in one sentence
- Severity: S2
- Type: incorrect (inconsistent terminology)
- Where: all Portuguese and Spanish overlays; instrument labels (`PianoKey.tsx:201`); answer chips.
- Evidence:
  - Portuguese: 624 strings use solfège, 448 use letters; 111 Portuguese and 100 Spanish strings mix both in one string.
  - Mixed examples:
    - "sobre D em Lá menor" (generated prompt from `pt/templatesL3.ts:104`)
    - "…de Lá menor harmónica… resolve para A" (`l3u9m4e1.hint`)
    - "em torno de E em Dó maior" (`l4u12m3.tasks[2]`)
    - "Sidim7" (a solfège root inside a chord symbol)
  - The same module uses both: the lesson says "Dó central", the exercise hint says "C central" (`pt/exercisesL1.ts:19`).
  - The exercise files declare letter notation (`pt/exercisesL1.ts:5`).
  - Inferred cost: Portuguese answer labels like "A menor" or "E maior" read as "the minor" / "and major".
  - Sources:
    - Universidade de Aveiro thesis (https://ria.ua.pt/handle/10773/24392): "o paradigma estabelecido em Portugal (dó fixo), no contexto do Ensino Especializado de Música".
    - A Portuguese school Formação Musical plan (https://edu.azores.gov.pt/wp-content/uploads/sites/3/2020/12/Planifica%c3%a7%c3%a3o-Forma%c3%a7%c3%a3o-Musical-3%c2%ba-Grau.pdf) uses "Clave de Dó na 3º linha" and "armação de clave".
    - Spanish dictionary (RAE) "la": "Sexta nota de la escala musical" (seen via a search snippet; the page returned 403).
- Scope: about 1,100 strings use note names; 111 Portuguese and 100 Spanish mix within a string.
- Suggested fix (Nuno's choice):
  - (a) use letters throughout the Portuguese and Spanish text, matching the instrument and answers; or
  - (b) add a Dó/Ré/Mi vs C/D/E display setting.
- Status: verified (the mix); that solfège is what a Portuguese conservatório student expects is inferred from the sources.

### E-10: The Drill is mostly English in Portuguese and Spanish
- Severity: S2
- Type: content-gap
- Where: `src/core/utils/drillBank/*` (English display strings), `genFunction.ts:56-68`, `pt.json:659`.
- Evidence (all 1,315 items rendered in Portuguese, excluding the settled chord/interval naming):
  - 71 items show English degree names ("O grau 1 da escala é Tonic"), although `degree.*` and `exercise.degreeN` translations exist and are used in Learn.
  - About 677 show key names like "C major" ("Em C major, D minor (ii) funciona como…").
  - 35 show English function or cadence names, e.g. "Perfect authentic cadence (RU: perfect)". The UK gloss means nothing in Portuguese.
  - 160 show English clause parameters (already an open item in CLAUDE.md).
- Scope: 723 of 1,315 items per language.
- Suggested fix: pass keys instead of display strings and translate at render time.
- Status: verified.

### E-11: Hardcoded English in the visible UI
- Severity: S2
- Type: bug
- Where:
  - `KeySelector.tsx:23-102`: all 36 scale chips ("Major", "Harm. Minor", "Dorian"…) are English literals. The `scaleGroup.*` translation keys exist but are never referenced.
  - `Fretboard.tsx:493`: literal "Tuning:", while `:474` uses `t('fretboard.tuning')`.
  - Screen-reader labels: `Toast.tsx:79` "Dismiss", `ScaleDegreeBar.tsx:34`, `ChordGrid.tsx:40`, `QuickSearch.tsx:124`, `RootQualityChips.tsx:59,107`.
- Scope: 36 chips + 1 visible label + 7 screen-reader labels.
- Suggested fix: route through `t()` or `translateScaleType`.
- Status: verified (grep with a planted positive).

### E-12: Search and Try-This instructions work only in English
- Severity: S2
- Type: content-gap
- Where: `src/data/moduleIndex.ts` (English-only titles); the scale and chord parsers.
- Evidence:
  - "cadence" finds 2 lessons; "cadência" and "cadencia" find 0. Same for "suspensão" / "retardo" and "napolitano".
  - Lesson hits show English titles.
  - "Dó maior", "Ré menor harmónica" and "Do mayor" all parse to nothing.
  - So about 160 Portuguese strings quote English queries ("Escreve "Ab major scale"").
- Suggested fix: a per-language lesson index plus Portuguese/Spanish parser aliases.
- Status: verified.

### E-13: Chord Builder uses "tónica" (tonic) for the chord root
- Severity: S2
- Type: incorrect
- Where: `pt.json:502` (`chordRoot`), `:505` (`syncRootTitle`), `:514` (`nonDiatonicAt`: "a tónica é o {{numeral}} de {{key}}"); Spanish at the same lines.
- Evidence:
  - Elsewhere the app uses "fundamental" for the root (170 times in Portuguese, 136 in Spanish).
  - "A tónica é o III de …" literally says the key's tonic is the third degree.
  - The `{{key}}` there renders in English ("C natural minor", `ChordBuilderPanel.tsx:150`).
- Scope: 3 keys × 2 languages.
- Suggested fix: use "fundamental" in these keys and translate the key label.
- Status: verified.

### E-14: Cadence names are inconsistent within each language
- Severity: S2
- Type: incorrect (inconsistent terminology)
- Where: lesson `pt/curriculumL3.ts:411` vs exercises `pt/exercisesL3.ts:317`, `pt/templatesL3.ts:213-237`, `pt/exercisesL9.ts:363`; Spanish `es/curriculumL3.ts:418,427,437` and `es/exercisesL5.ts:133`.
- Evidence:
  - Portuguese: the lesson glosses CAP as "cadência perfeita" and CAI as "cadência imperfeita"; the exercises gloss them as "Cadência Autêntica Perfeita/Imperfeita". "Suspensiva" appears 15 times, "meia-cadência" once.
  - Spanish deceptive cadence: "rota" 14 times, "interrumpida" 3, "engañosa" 1.
- Suggested fix: pick one term per cadence per language and normalise.
- Status: verified (the inconsistency); the preferred terms are unconfirmed.

### E-15: About 20 more stale strings omit later English precision
- Severity: S3
- Type: incorrect (drift)
- Where:
  - `l4u13m3` (`pt/curriculumL4.ts:370`): says "Nível 5"; English says Level 6.
  - `l5u16m5` (`:443`): "quase sempre" for English "often".
  - `l6u18m2` (`:89`): "fundamental duplicada" for English "scale degree 1 doubled".
  - `l7u21m5` (`:237`): Am7 for English A7.
  - `l9u30m4` (`:182`): "The Entertainer" for English "Love Story".
  - Missing sentences in about 13 more concepts; list in `stale_pairs.out.txt` and `staleness.out.txt`.
- Suggested fix: one re-translation pass over the modules in `staleness.out.txt`.
- Status: verified.

### E-16: Spanish questions and exclamations missing the opening ¿ / ¡
- Severity: S3
- Type: incorrect
- Where:
  - Exercises `l4u12m5e2`, `l6u18m3e1`, `l6u18m3e3`, `l6u18m4e2`, `l6u20m2e1`, `l7u21m2e1`, `l7u23m3e3`.
  - `es.json:622,634,636,637` (Drill prompts).
  - `es.json:494` (unused key).
- Evidence:
  - 437 of the 452 Spanish question marks do have their opening ¿.
  - RAE *Ortografía* §3.4.9 rule located via search; the page returned 403, so it is not quoted verbatim.
- Scope: 11 visible strings.
- Status: verified (the inconsistency); the convention source was located but not quoted.

### E-17: `<html lang>` always stays "en"
- Severity: S3
- Type: bug
- Where: `index.html:5`; `useLanguage.ts` only changes i18next.
- Evidence: no code anywhere updates the page language. Screen readers and spellcheck will treat Portuguese text as English.
- Status: verified.

### E-18: Portuguese UI mixes "você" and "tu" forms
- Severity: S3
- Type: incorrect
- Where: `pt.json:11` "Clique nas teclas para tocar", `nav.themeLabel` "Clique para alterar", `:69` "Escolha uma escala…", `:214` "Passou!". Everything else uses tu.
- Suggested fix: "Clica", "Escolhe", "Passaste!".
- Status: verified.

### E-19: Typography is inconsistent
- Severity: S3
- Type: incorrect
- Evidence:
  - Portuguese ordinals: 891 written "3.a" / "7.o" against 294 written "3.ª" / "7.º". Spanish: 270 against 959.
  - Portuguese uses " -- " as a dash 419 times.
  - Spanish writes the diminished sign as the ordinal "º" (U+00BA) 57 times, e.g. "viiº", instead of "°".
  - Degree labels: "1.º (Tónica)" in one place, "Tónica (1º)" in another.
  - One "caráter" against 60 "carácter" (Priberam: "Grafia em Portugal: carácter").
- Suggested fix: one scripted normalisation pass, plus a test forbidding "3.a"-style ordinals in Portuguese.
- Status: verified.

### E-20: "meio-tom" (244 times) and "semitom" (108 times) both used in Portuguese
- Severity: S3
- Type: incorrect (inconsistent terminology)
- Evidence:
  - The UI shows both side by side: `chordBuilder.halfSteps` "Semitons" vs `exerciseFeedback.semitones` "meios-tons".
  - Both words are correct Portuguese (Priberam "semitom … = MEIO-TOM", no regional mark), so this is consistency, not a Brazilian form.
- Suggested fix: standardise on "meio-tom".
- Status: verified.

### E-21: English scale names inside Portuguese and Spanish feedback
- Severity: S3
- Type: content-gap
- Where: `validateExercise.ts:180,201`; `ChordBuilderPanel.tsx:150`.
- Evidence:
  - Prompt "Constrói a escala de C menor natural", then feedback "A escala de C natural minor tem 7 notas".
  - The CLAUDE.md convention names chord qualities and intervals, not scale types, and a scale-type translator already exists.
- Suggested fix: use `translateScaleType` in both places.
- Status: verified.

### E-22: Music-terms dictionary gaps and odd standalone labels
- Severity: S3
- Type: tech-debt
- Evidence:
  - `minor_major7` and `augmented_major7` have no Portuguese or Spanish entries. Latent today: no prompt displays them.
  - Ear-training answer buttons read "De sétima da dominante", starting with a preposition, while hand-written choices say "Sétima da dominante".
- Status: verified.

### E-23: Silent English fallback and no test for exercise-overlay parity
- Severity: S3
- Type: tech-debt
- Where: `overlayLoader.ts:62-70` caches a failed load as empty for the whole session, so that level shows in English with no indication.
- Evidence:
  - No test checks exercise overlays (coverage, option counts, hints), song overlays, or English edits made after translation.
  - My `structural.ts` finds all of these clean today, with planted defects detected.
- Suggested fix: promote the script's checks into the test suite and store an English-source hash per overlay entry.
- Status: verified (code paths); the impact of transient failures is inferred.

### E-24: Wording that misleads or reads as an anglicism
- Severity: S3
- Type: ux
- Evidence:
  - "Quase" / "Casi" ("almost") is shown for any wrong answer.
  - "o/a {{degree}}" although all degree names are feminine.
  - Anglicisms: "Voicing", "Nota de baixo slash", "Confirmar reset".
- Status: verified that these render; the awkwardness is inferred.

### E-25: First run always starts in English
- Severity: S3
- Type: improvement
- Where: `preferencesSlice.ts:9`.
- Evidence: no detection of the browser language. Persistence itself works (`store.ts:79`).
- Status: verified.

## Improvements
1. A note-name display setting (Dó/Ré/Mi vs C/D/E).
2. Make the parity, drift and staleness scripts test gates.
3. Translate the Drill at render time.
4. A per-language search index.
5. Delete the 210 unused locale keys (`unused_keys.txt`).
6. For another track (English content): `drill.prompts.relMajor` renders "relative major of A" with no "minor".

## Unconfirmed suspicions
- Which Portuguese cadence terms conservatórios prefer. The Graciosa plan uses "cadências Perfeitas, Picarda e Plagal".
- "Tonalidade paralela" vs "homónima" for same-tonic keys.
- "Acorde perfeito maior" vs "tríade maior".
- Spanish "computadora" (`es/exercisesL8.ts:346`) in a file labelled Castilian.
- "Soletra" / "Deletrea" as a calque of "spell".

## Coverage
**Structural checks** (planted defects caught on every run):
- Locale files: 555 keys × 2 languages, all present.
- Curriculum overlays: 118 modules, 346 concepts, 347 tasks, 378 objectives, all present.
- Exercises: all 385 present; the 291 with options match English option counts.
- Templates: 110 modules / 152 templates match.
- Generated exercises (485 per language): same answers and settings as English, no leftover placeholders.
- 1,104 option sets showed no sign of reordered options (length-ratio heuristic).

**Drift checks:**
- 9,386 English↔translation pairs compared for numbers, note names, Roman numerals and chord symbols.
- Git blame staleness check: 106 rewritten English strings paired with their translations and reviewed.
- Drill: 1,315 items × 2 languages rendered through a real i18next instance.

**Scans:**
- Portuguese: no Brazilian spellings, vocabulary or gerund progressives found.
- Spanish punctuation (planted defect caught).
- Hardcoded English in all 67 .tsx files.
- Search queries.

**Read by eye:**
- All 555 Portuguese and Spanish locale keys.
- Every Level 2 multiple-choice exercise, English vs Portuguese.
- The stale modules and 21 Try-This labels.

**Not checked:**
- A full sentence-by-sentence read of the Level 5–9 curricula. Meaning changes without number or note tokens could be missed there.
- Spanish read sentence by sentence; I treated it as mirroring Portuguese (same structure and stale items, spot-checked).
- The live site in a browser.
- RAE and Infopédia returned 403, and a browser-user-agent retry was blocked by the permission guard. Not pursued.

**Model:** everything above ran on this agent (Opus 5.5); no further delegation.
