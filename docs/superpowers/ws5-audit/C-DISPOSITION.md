# WS5 Audit — Category C Disposition (convention-dependent / editorial flags)

Triage of the Category C items from `REMEDIATION.md` (the "questionable"-severity, convention-dependent
flags from the L1–L9 theory audit). Each item is sorted into:

- **FACTUAL** — a checkable claim with a right answer (verified here, web-sourced, 2+ reputable sources).
- **EDITORIAL** — a genuine teaching-convention choice with no single right answer (framed, not decided —
  Nuno's call).

**Scope note.** `REMEDIATION.md` groups the ~28 per-level "questionable" raises into 20 numbered C items
(C1–C20); several C items bundle multiple per-level sub-flags (e.g. C2 = L1 Q1+Q3; C20 = L6 Q1+Q2).
**C14 (L9 Q1–Q4 reference-song mnemonics) is excluded** — already verified correct in
`MNEMONICS-VERIFICATION.md`. That leaves **19 C items** triaged below.

**Verification discipline.** Nothing is asserted from memory. Every factual verdict is web-checked against
at least two reputable sources, with URLs. Deterministic set-theory claims (C16) were also recomputed by
hand. "Defensible under a recognized convention" is **not** scored as wrong.

**Read-only / fixability key (from `REMEDIATION.md`):**
- `src/core/` (all `curriculumL*.ts`, `chords.ts`/`scales.ts`/`intervals.ts`/`modes.ts`/`notes.ts`) →
  **core-escalate** (shared with Music AI; cannot edit here).
- `src/data/exercises/` (`templatesL*.ts`, `exercisesL*.ts`) and `src/components/learn/exercises/` →
  **app-side fixable**.

---

## 1. Factual — resolved

These have a right answer. Verdicts: **CORRECT as-is** / **IMPRECISE** (defensible but loose/over-broad) /
**WRONG** (false under all common conventions) / **CONTESTED** (could not confirm).

| Item | Claim under review | Verdict | Accurate statement (if not correct as-is) | Source(s) | Location | Fix needed? |
|---|---|---|---|---|---|---|
| **C7** (L7 Q1) | Back-door dominant bVII7 derived as "the tritone sub of E7 (V7/vi)". | **IMPRECISE** (arithmetic true; derivation non-standard & misleading) | Bb *is* a tritone from E, so the literal sentence isn't false — but the standard derivation of bVII7→I is **borrowed from the parallel minor / the dominant of bIII (Eb)**, sharing guide tones with an **altered V (G7)**, not with E7. The E7 framing obscures why Bb7 resolves to C (Bb7's 3rd D→E and 7th Ab→G are upper leading-tones into Cmaj7). | Wikipedia "Backdoor progression"; LearnJazzStandards; jazzguitar.be | `curriculumL7.ts` `l7u21m4` concept "The Back-Door Dominant" (~line 204) — **core** | **core-escalate** (re-derive as parallel-minor/bIII-dominant). Residual editorial: how much to reword is taste; the *derivation source* is a correctness matter. |
| **C8** (L7 Q2) | "7sus4/9sus4 built on the 5th of a minor chord creates a Dorian flavor." | **IMPRECISE** (loose/backwards phrasing) | The standard statement: a **9sus chord a P5 above (= P4 below) a minor/ii chord — the V-of-ii position** — yields a Dorian/modal color and substitutes for ii (e.g. G9sus over Dm ≈ Dm11/G). "On the 5th *of* a minor chord" is shaky: G is the V-related root of Dm, not a chord-tone "of" a D-minor triad. The Dorian-color claim itself is sound. | jazzguitar.be forum "Dominant Sus Chords"; antonjazz.com "Sus chords"; standard jazz ii-substitute treatment | `curriculumL7.ts` `l7u21m2` concept "Suspended Dominants: 7sus4" (~line 94) — **core** | **core-escalate** (tighten phrasing). Low impact; not false, just imprecise. |
| **C10** (L7 N3) | "Hindu scale" is an alias for Mixolydian b6 (alongside "Aeolian dominant"). | **CORRECT as-is** | "Hindu scale" is a genuine, in-circulation alias for Mixolydian b6 / Aeolian dominant (5th mode of melodic minor; 1-2-3-4-5-b6-b7; = Raga Charukeshi). It is the least-standardized of the three names (informal/dated) but legitimately attested across jazz/guitar pedagogy. The engine itself comments `mixolydian_b6 … (Aeolian Dominant)`. | Wikipedia "Aeolian dominant scale"; jazz-guitar-licks.com "The Hindu Scale"; pianoscales.org | `curriculumL7.ts` `l7u23m3` (~line 761) — **core** | **none** (defensible alias). Whether to *keep* the informal name = editorial (see editorial note). |
| **C16** (L8 Q1) | Template hint: "Sets with the same interval vector are Z-related" + task using [0,1,4]/[0,3,4]. | **WRONG** (the hint, as stated) | [0,1,4] and [0,3,4] are **inversions of each other** — both reduce to prime form **[0,1,4] = set class 3-3** — so they are NOT a Z-pair (the module's own t2 shows inv{0,1,4} → [0,3,4]). Inversionally-equivalent sets *always* share an ICV; that is not the Z-relation. Correct hint: "Sets with the same interval vector **that are not related by transposition or inversion** are Z-related." Smallest true Z-pair: 4-Z15 [0,1,4,6] / 4-Z29 [0,1,3,7]. | Recomputed by hand; corroborated by Wikipedia "All-interval tetrachord" (4-Z15/4-Z29 sole Z-tetrachords) + Forte set-class catalog (3-3 = [0,1,4]; 3-4 = [0,1,5]) | **Split.** Template hint `templatesL8.ts` `l8u27m2` → **app-side fixable**. Task `l8u27m1t3` + concept 3 → `curriculumL8.ts` **core**. | **app-side fixable** (tighten the template hint to add the "not related by T/I" qualifier). Core task half → core-escalate (reframe the "gotcha"). |
| **C17** (L5 Q1) | "vii°7/x more common in minor, viiø7/x more common in major." | **IMPRECISE** (over-broad) | For *secondary* leading-tone chords the fully-diminished form is **very common in major keys too** — major targets may be tonicized by either ø7 or °7, while minor targets (and V-in-minor) **require** the fully-diminished °7. So "vii°7 ≈ minor / viiø7 ≈ major" oversimplifies; the real rule keys off the *quality of the tonicized chord*, not the home mode. | WVU CS2-9 secondary-LT handout; OpenMusicTheory "Tonicization"; pugetsound mt21c "Secondary Diminished Chords in Major and Minor" | `curriculumL5.ts` `l5u15m3` — **core** | **core-escalate** (soften per chosen authority, e.g. Kostka/Payne). Defensible-but-loose, not flatly wrong. |
| **C18** (L5 Q2) | L5 text says bVII is "borrowed from the parallel minor"; Explore data tags it "from Mixolydian". | **CORRECT (both)** — cross-surface inconsistency, not an error | bVII is legitimately described as borrowed from **either** the parallel minor **or** Mixolydian. In rock/pop, sources treat the **Mixolydian** derivation as the more apt one (it appears alongside a natural-7 V, unlike a strict parallel-minor reading). Neither label is wrong; they just disagree across two surfaces. | Popgrammar "Other Harmonic Concepts"; musicalchord.com "Modal Borrowing"; guitarwiz borrowed-chords | L5 text `curriculumL5.ts` `l5u16m4` (**core**) vs `progressionPatterns.ts` (**core**, engine data) | **none required** (both correct). Optional: note bVII is shared with Mixolydian for consistency — that wording call is **editorial**. |
| **C19** (L4 Q1) | 2nd-species weak-beat dissonance described as "passing tones OR neighbor tones". | **IMPRECISE under strict species** (convention-dependent) | Under **strict Fux**, the only *dissonance* allowed in 2nd species is the **passing tone**; a neighbor may appear in 2nd species only if **consonant** — dissonant neighbors are deferred to 3rd species. The module's own exercise `l4u14m1e3` states the strict rule correctly. So the prose is looser than both Fux and its own exercise. Some modern texts do admit dissonant neighbors earlier → genuinely convention-dependent. | OpenMusicTheory "Second-Species Counterpoint"; LibreTexts OMT 2e §2.3; pugetsound mt21c §30.3 | `curriculumL4.ts` `l4u14m1` concept "First and Second Species" — **core** | **core-escalate IF strict species intended.** Because pedagogies legitimately differ, the *whether* is editorial; the factual sub-claim (strict Fux = passing only) is confirmed. |
| **C15** (L8 Q2) — *real divergence* | Prime-form algorithm presented as the single universal method; "Forte vs Rahn diverge for a handful of hexachords." | **CORRECT** (the divergence is real) | Two standard algorithms exist (Forte 1973, Rahn 1980). They agree for all sets used in L8 (trichords) and the large majority of set classes, diverging only for a small set: **17 of 352** set classes by prime-form *spelling* (the figure Wikipedia's "List of set classes" uses; a narrower count of "5–6" appears in Wikipedia "Set (music)"). Divergent cases include pentachord **5-20** and hexachords **6-29 [0,2,3,6,7,9]** and **6-31 [0,1,4,5,7,9]**, among others. | Wikipedia "List of set classes" ("Rahn spelling … for the 17 out of 352 … where the two methods yield different results"); Wikipedia "Set (music)"; mta.ca pc-set "packed" page | `curriculumL8.ts` `l8u27m1` concept 2 (+ `templatesL8.ts` `l8u27m2`) — **core** | Whether to *add the caveat* = editorial (awareness-level module). **But see the next row — there is a factual correction to make if the caveat is added.** |
| **C15** (L8 Q2) — *audit's own attribution* | The audit's recommended fix says the curriculum's "most packed to the left" wording "is specifically the **Rahn** procedure." | **WRONG** (mis-attributed) | The dominant convention attributes **"packed to the left" to FORTE**; **Rahn** is "most dispersed from the right" / "packed from the right" (making the *small* numbers smaller works out from the left = Forte; working in from the right = Rahn). So the curriculum's "most tightly packed to the left" wording describes **Forte**, not Rahn. (The curriculum text itself is fine as a generic description; only the audit's parenthetical naming is reversed — correct it before quoting it into any fix.) | mta.ca pc-set "packed" page (Forte = "packed from the left"); Wikipedia "Set (music)" & "Forte number" (Forte = most packed left; Rahn = most dispersed from right) | n/a — this corrects `REMEDIATION.md` C15 / `L8.md` Q2 prose, not a source file | **doc-only.** No source file is wrong; this just prevents propagating a reversed attribution into a core-escalation. |

### Notes on the boundary cases (C7, C8, C17, C18, C19)

These five each have a **verifiable factual core** (scored above) *plus* a residual wording choice. The factual
core is settled here; the residual "exactly how to reword / whether to tighten" is editorial and is **not**
decided. C18 and C19 are the most convention-dependent: in C18 *both* labels are correct, and in C19 strict-vs-
modern species is a real pedagogical fork — so for those two the only hard requirement is internal consistency
(C18) or a conscious convention choice (C19), not a correctness fix.

---

## 2. Editorial — for Nuno (framed, not decided)

Genuine teaching-convention choices. For each: the competing conventions, what each implies, and a
one-line recommendation-**if-asked**. **Every one of these is your call.**

### Theme 1 — interval/chord labelling & enharmonic spelling

- **C1 (L1 Q2) — treble-staff template octave range.** `templatesL1.ts` `l1u1m1`, octaves `[4,5]`: C4/D4
  sit below the treble staff (ledger lines) while the prompt says "on the treble clef staff." The answer is
  still correct (octave ignored by grading); module is "The Staff and Clefs", ledger lines arrive next module.
  - **Conventions:** (a) restrict octaves to in-staff range so the prompt is literally true; (b) soften wording
    to "on the treble staff or its ledger lines." (a) keeps strict sequencing; (b) is a one-word edit.
  - **App-side** (`templatesL1.ts`). *Recommendation if asked:* lean (a) for L1 — cleanest for absolute
    beginners; the module hasn't taught ledger lines yet. **Your call.**

- **C2 (L1 Q1/Q3) — "count letter names" interval prompts & hard-coded note counts.** Interval prompt
  (`l1u3m3`) tells the learner to count letter names, but grading is semitone-only; build prompts hard-code
  "7 notes"/3-note text. **No L1 instance mis-grades** (latent only).
  - **Conventions:** keep the letter-counting instruction (pedagogically richer, but unchecked) vs. drop it /
    derive counts programmatically (honest about what's graded). *Recommendation if asked:* no action needed
    for L1 as shipped; revisit only if the interval range ever widens to 6/8. **Your call.**

- **C3 (L2 Q1) — double-sharp at L2 (B-aug = B–D#–F##).** Spelling is **correct** (F## keeps one letter per
  chord tone). The only question is exposure.
  - **Conventions:** expose the double-sharp at L2 (theoretically honest) vs. drop B / augmented-on-B from the
    L2 range (gentler for a "four triad types" intro). *Recommendation if asked:* drop B-aug from the L2
    generative range; reintroduce double-sharps when spelling is taught explicitly. **Your call.**

- **C4 (L2 Q3) — tritone forced to one label/spelling.** `INTERVAL_LABELS[6]='Tritone'` + `l2u7m1/m2`.
  "Tritone" is a legitimate quality-neutral name and the module teaches it; the aug4/dim5 distinction the
  concept text raises is never *exercised*.
  - **Conventions:** leave as-is (single "Tritone" label) vs. add aug4/dim5 spelling practice. *Recommendation
    if asked:* leave at L2; add aug4/dim5 spelling later where enharmonic spelling is the lesson. **Your call.**

- **C5 (L3 Q1) — "III+maj7" augmented-major-7 naming.** `curriculumL3.ts` `l3u9m4`. Spelling/quality are
  **correct** (C–E–G#–B from raised 7̂). Some texts treat III+ as non-functional or spell the 5th differently
  in specific voice-leading contexts.
  - **Conventions:** keep "III+maj7" (standard, defensible) vs. add a note that III+ is often treated as
    non-functional. *Recommendation if asked:* keep as-is; it's the standard naming. **Your call.**

- **C6 (L3 E3 residue) — which SATB range bounds to standardize on.** The *internal contradiction* (concept
  says Alto C5/Bass C4; template hint says D5/D4) is a **fix**, handled as B3 / app-side template alignment —
  **not** editorial. What *is* editorial: which textbook ranges to adopt (Laitz vs Clendinning vs Kostka all
  differ slightly).
  - **Conventions:** any one consistent published set works (e.g. Bass E2–C4, Tenor C3–G4, Alto F3–C5,
    Soprano C4–G5). *Recommendation if asked:* pick one source (Laitz) and use it verbatim in all three sites.
    **Your call** on which source; the consistency itself is non-negotiable (that's the B3 fix).

### Theme 2 — jazz / modal naming & emphasis

- **C9 (L7 Q4) — modal "gravity chord" recipes.** "Lydian → I, II, vii"; "Dorian → i, II, IV." The
  *characteristic* chords are well established (Lydian **II**, Dorian major-**IV**); the audit's only quibble is
  emphasis — listing "vii" (Lydian) and "II" (Dorian, which is minor and lacks the characteristic 6) as
  co-equal is debatable but not wrong.
  - **Conventions:** keep the broader list vs. foreground I–II (Lydian) and i–IV (Dorian) as primary, others
    secondary. *Recommendation if asked:* foreground the characteristic-note chords (Lydian II, Dorian IV);
    demote the rest. **Your call** — this is emphasis, not error.

- **C10 (keep/drop the "Hindu" alias).** *(The factual half — is it a real alias — is settled CORRECT above.)*
  The only open question is editorial: keep an informal/dated name or drop it for the two more-standard aliases.
  - *Recommendation if asked:* keep it but lead with "Aeolian dominant / Mixolydian b6" and offer "Hindu" as a
    secondary alias. **Your call.**

### Theme 3 — solfège & pedagogy-position statements (L9)

- **C11 (L9 Q5) — movable-do vs fixed-do framing.** `curriculumL9.ts` `l9u32m4`: "fixed-do … does not train
  functional hearing the same way" is a pedagogical **position stated as fact**, and "Kodály/Berklee" lumping
  is a simplification (Kodály traditionally uses **la-based** minor; Berklee uses **do-based** with numbers).
  - **Conventions:** movable-do and fixed-do are both mainstream, with real adherents; the "doesn't train
    functional hearing" claim is contested by fixed-do pedagogues. *Recommendation if asked:* soften to opinion
    / attribute it ("proponents of movable-do argue …") rather than stating it as neutral fact; the *factual*
    core (movable-do = do-on-tonic) is correct and can stay. **Your call.** (This is core prose → if you want it
    changed, it's a core-escalate; but it's framing, not a correctness bug.)

- **C12 (L9 Q6) — do-based vs la-based minor solfège.** Each instance is internally correct; the module commits
  to **do-based minor** but offers one **la-based** gloss. Mixing systems in one module can confuse.
  - **Conventions:** do-based minor (Berklee-style, b3=me/b6=le/b7=te) vs la-based minor (Kodály-style,
    minor on la). Both valid; the issue is consistency. *Recommendation if asked:* pick **one** (the module
    already leans do-based) and state it explicitly; drop or clearly label the other as "alternative system."
    **Your call.** (Core prose.)

- **C13 (L9 Q7) — m6 (8 semitones) listed as a "consonance."** Defensible — the m6 is an **imperfect
  consonance** (inversion of M3). Some textbooks treat the 6th as contextually dissonant.
  - **Conventions:** classify m6 as a consonance (common-practice consonance taxonomy) vs. footnote it as
    context-dependent. *Recommendation if asked:* leave it as a consonance (standard); optionally footnote.
    Lower priority than the genuine P5-omission bug (that's A11/E2, already an app-side fix). **Your call.**

### Theme 4 — post-tonal & analysis convention

- **C15 (L8 Q2) — prime-form Forte/Rahn caveat.** *(Factual halves settled above: the divergence is real;
  the audit's "packed-left = Rahn" attribution is reversed and must be corrected to Forte before quoting.)*
  The remaining choice is purely editorial: whether an awareness-level module should carry the caveat at all.
  - **Conventions:** add one clause naming both algorithms (rigorous, future-proofs a student who later checks a
    hexachord against a Forte table) vs. leave it (no L8 example is affected). *Recommendation if asked:* add a
    one-line caveat — and if you do, attribute "packed to the left" to **Forte** (not Rahn), naming Rahn as the
    more common modern choice. **Your call** on whether to add it; the attribution, if added, is fixed.

- **C20 (L6 Q1/Q2) — inversion-prompt over-specification + common-tone dim7 spelling.**
  - **Q1:** `templatesL6.ts` `l6u18m1` asks for "first inversion" / "place the 3rd in the bass," but
    `validateChordBuild` checks pitch-class sets only — inversion is invisible to grading. The answer is
    pitch-correct; the prompt over-specifies. The over-specifying prompt/hint is **app-side editable**, so
    dropping "in first inversion" is a concrete option (it would become a clean app-side fix if you want the
    prompt to match what's graded). Flagged editorial because "should inversion be assessed here at all" is a
    **product call**. *Recommendation if asked:* drop the inversion language from the generated prompt+hint to
    match grading (app-side), unless/until inversion grading is built. **Your call.**
  - **Q2:** `curriculumL6.ts` `l6u19m2` common-tone dim7 spelling (C–D#–F#–A) uses voice-leading spelling, not
    stacked-thirds — this is **correct and standard** for a CTo7 (not a defect; flagged only so a reviewer
    doesn't "fix" it to match the stacked-3rds dim7 elsewhere). No change recommended. Core prose.

---

## Summary

**Counts (19 C items triaged; C14 excluded as already-verified):**

- **Factual: 8 items** → C7, C8, C10, C16, C17, C18, C19, **C15** (C15 spans two factual sub-findings — the
  real divergence, and the audit's reversed Forte/Rahn attribution).
- **Editorial: 11 items** → C1, C2, C3, C4, C5, C6, C9, C11, C12, C13, C20. (C10 and C15 also carry a small
  editorial tail — *keep the informal alias?* / *add the caveat?* — but their substantive content is factual.)

**Factual verdicts:** 1 CORRECT-as-is (C10), 1 CORRECT-both/cross-surface (C18), 4 IMPRECISE (C7, C8, C17, C19),
2 WRONG (C16 template hint; the audit's C15 attribution), 1 REAL-divergence-confirmed (C15 substance). **Zero
CONTESTED** — everything resolved.

### Factual errors that warrant a fix

**App-side fixable (Fermata's queue):**
- **C16 — template hint in `templatesL8.ts` `l8u27m2`** ("Sets with the same interval vector are Z-related") is
  **WRONG** as stated and editable here. Tighten to: "Sets with the same interval vector **that are not related
  by transposition or inversion** are Z-related." (The paired task `l8u27m1t3` is core — see escalate list.)

**Core-escalate (add to `CORE-ESCALATION.md`; Music AI repo):**
- **C7 — `curriculumL7.ts` `l7u21m4`**: back-door dominant derivation is non-standard ("tritone sub of E7,
  V7/vi"); re-derive as parallel-minor/bIII-dominant sharing guide tones with an altered V. *(IMPRECISE, not
  flatly false — escalate as a clarity/correctness improvement.)*
- **C8 — `curriculumL7.ts` `l7u21m2`**: "7sus4 on the 5th of a minor chord = Dorian" is loose/backwards;
  restate as a 9sus a P5 above the ii-chord (V-of-ii) substituting for ii. *(IMPRECISE.)*
- **C16 (core half) — `curriculumL8.ts` `l8u27m1t3` + concept 3**: the Z-relation "gotcha" task walks the
  student into the inversional-equivalence misconception; reframe (or pick a genuinely distinct-ICV contrast).
- **C17 — `curriculumL5.ts` `l5u15m3`**: "vii°7≈minor / viiø7≈major" for secondary LT chords is over-broad;
  fully-dim secondary LT chords are common in major too. Soften per Kostka/Payne. *(IMPRECISE.)*
- **C19 — `curriculumL4.ts` `l4u14m1`** *(only if strict species is the intended convention)*: tighten
  "passing OR neighbor tones" to "passing tones only" for 2nd-species dissonance. *(Convention-dependent —
  escalate only on a deliberate strict-Fux choice.)*

**No fix (defensible / both-correct):** C10 (real alias), C18 (both labels correct; at most a consistency
note), C20-Q2 (CTo7 spelling correct). **C15** needs **no source-file fix** — its only actionable item is a
**doc correction** to `REMEDIATION.md`/`L8.md`: the "packed-to-the-left = Rahn" parenthetical is reversed
(it's **Forte**), so correct it before that line is ever quoted into a core escalation.

**Editorial items:** all 11 are **framed, not decided** — competing conventions stated, a recommendation-if-
asked offered, and each explicitly left as Nuno's call. None has been changed.

---

### Sources

- Backdoor dominant (C7): [Wikipedia — Backdoor progression](https://en.wikipedia.org/wiki/Backdoor_progression);
  [Learn Jazz Standards](https://www.learnjazzstandards.com/blog/learning-jazz/jazz-theory/backdoor-progression/);
  [jazzguitar.be](https://www.jazzguitar.be/forum/theory/82255-bvii7-functional-harmony.html)
- 9sus / Dorian (C8): [jazzguitar.be — Dominant Sus Chords](https://www.jazzguitar.be/forum/improvisation/15930-dominant-sus-chords.html);
  [Anton Schwartz — Understanding suspended chords](https://antonjazz.com/2013/03/sus-chords/)
- Hindu / Aeolian dominant scale (C10): [Wikipedia — Aeolian dominant scale](https://en.wikipedia.org/wiki/Aeolian_dominant_scale);
  [jazz-guitar-licks.com — The Hindu Scale](https://www.jazz-guitar-licks.com/pages/guitar-scales-modes/other-scales/the-hindu-scale-aka-aeolian-dominant-mixolydian-b6-olympian-scale-aeolian-major-melodic-major-scale-for-guitar.html);
  [pianoscales.org — Aeolian Dominant](https://www.pianoscales.org/aeolian-dominant.html)
- Z-relation / set classes (C16): [Wikipedia — All-interval tetrachord](https://en.wikipedia.org/wiki/All-interval_tetrachord);
  [Wikipedia — List of set classes](https://en.wikipedia.org/wiki/List_of_set_classes);
  [Open Music Theory — Set Class and Prime Form](https://viva.pressbooks.pub/openmusictheory/chapter/set-class-and-prime-form/)
- Secondary leading-tone chords (C17): [WVU — Writing Secondary Leading-Tone Chords (CS2-9)](https://community.wvu.edu/~mh0001/CS2-9.pdf);
  [Open Music Theory — Tonicization](https://viva.pressbooks.pub/openmusictheory/chapter/tonicization/);
  [pugetsound mt21c — Secondary Diminished Chords in Major and Minor](https://musictheory.pugetsound.edu/mt21c/SecondaryDiminishedChordsInMajorAndMinor.html)
- bVII source (C18): [Popgrammar — Other Harmonic Concepts](https://popgrammar.com/other-harmonic-concepts/);
  [musicalchord.com — Modal Borrowing](https://www.musicalchord.com/en/music-theory/modal-borrowing)
- Second-species counterpoint (C19): [Open Music Theory — Second-Species Counterpoint](https://viva.pressbooks.pub/openmusictheory/chapter/second-species-counterpoint/);
  [LibreTexts — Open Music Theory 2e §2.3](https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)/02:_Counterpoint_and_Galant_Schemas/2.03:_Second-Species_Counterpoint);
  [pugetsound mt21c §30.3 Second Species](https://musictheory.pugetsound.edu/mt21c/SecondSpecies.html)
- Forte vs Rahn prime form (C15): [Wikipedia — List of set classes](https://en.wikipedia.org/wiki/List_of_set_classes);
  [Wikipedia — Set (music)](https://en.wikipedia.org/wiki/Set_(music));
  [Mount Allison pc-set — "packed" (Forte = packed from the left)](http://mta.ca/pc-set/pc-set_new/pages/pc-table/packed.html);
  [Wikipedia — Forte number](https://en.wikipedia.org/wiki/Forte_number)
