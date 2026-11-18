/**
 * Audit of 18 November 2026 (browser audit A23–A26, A28, A30–A35, and the
 * stale "Type '…'" wording, in the thirteen modules of stream G): the
 * corrected claims, in English, Portuguese and Spanish.
 *
 * Wherever a claim can be computed it is re-derived here from the theory
 * engine (scales, the chord parser, the query resolver) or from melodies
 * written out in this file from their sources, instead of being restated; the
 * other checks pin the corrected wording and make sure no language still
 * states the old, wrong fact. Sources are named beside each block.
 * (A22, A27 and A29 are about what is PLAYED: `components/learn/__tests__/
 * auditDemonstrations.test.tsx`.)
 */
import { describe, expect, it } from 'vitest';
import type { CurriculumModule } from '../../core/types/curriculum';
import { buildScale } from '../../core/constants/scales';
import { getPitchClass } from '../../core/constants/notes';
import { stringToNote, type Note } from '../../core/types/music';
import { parseChordSymbol, chordFromParsed } from '../../core/utils/chordParser';
import { findQuotedQueries, resolveTheoryQuery } from '../../utils/theoryQuery';
import { getSongReferences } from '../songReferences';
import { EN_UNITS, curriculumOverlay, songOverlay, exerciseOverlay, type Lang } from '../../i18n/content/__tests__/overlayEntries';
import exercisesL7 from '../exercises/exercisesL7';
import templatesL7 from '../exercises/templatesL7';
import enGlossary from '../../i18n/glossary/en.json';
import ptGlossary from '../../i18n/glossary/pt.json';
import esGlossary from '../../i18n/glossary/es.json';

type AnyLang = 'en' | Lang;
const LANGS: AnyLang[] = ['en', 'pt', 'es'];

function enModule(id: string): CurriculumModule {
  const n = Number(id[1]);
  for (const unit of EN_UNITS[n]) {
    const m = unit.modules.find((x) => x.id === id);
    if (m) return m;
  }
  throw new Error(`no module ${id}`);
}

/** The module as a learner reads it in `lang` (title, concepts, tasks; English where an overlay has nothing). */
function moduleIn(lang: AnyLang, id: string) {
  const en = enModule(id);
  if (lang === 'en') {
    return {
      objectives: en.objectives,
      concepts: en.concepts.map((c) => ({ explanation: c.explanation, tryThisLabel: c.tryThisLabel })),
      tasks: en.tasks.map((t) => t.instruction),
    };
  }
  const ov = curriculumOverlay(lang, Number(id[1])).modules[id];
  expect(ov, `${lang} overlay of ${id}`).toBeDefined();
  return {
    objectives: ov.objectives,
    concepts: ov.concepts.map((c) => ({ explanation: c.explanation, tryThisLabel: c.tryThisLabel })),
    tasks: ov.tasks.map((t) => t.instruction),
  };
}

const songContexts = (lang: AnyLang, id: string): string[] =>
  lang === 'en' ? getSongReferences(id).map((s) => s.context) : songOverlay(lang)[id];

const queriesOf = (text: string) => findQuotedQueries(text).map((q) => q.query);
const pcs = (notes: readonly Note[]) => notes.map(getPitchClass);
const pcSet = (notes: readonly Note[]) => [...new Set(pcs(notes))].sort((a, b) => a - b);

// ─── The thirteen modules of this stream ───────────────────────────────────
const MODULES = ['l9u30m4', 'l4u14m5', 'l3u11m5', 'l7u23m3', 'l7u21m2', 'l4u12m5', 'l4u14m4', 'l7u21m5', 'l1u3m2', 'l9u30m3', 'l1u1m2', 'l2u6m1', 'l8u25m3'];

describe('nothing is typed: a quoted query in a task is a link the learner taps', () => {
  // EN "Type"; PT "Escreve" / ES "Escribe" directly before a quoted query.
  const TYPING: Record<AnyLang, RegExp> = {
    en: /\btype\s+['"‘“«]/i,
    pt: /\bescreve\s+['"‘“«]/i,
    es: /\bescribe\s+['"‘“«]/i,
  };
  // The verbs the locale files use for "Tap …" that do not also mean "play":
  // PT "carrega em" (showMe.intro.chord), ES "pulsa" (learn.emptySubtitle, showMe.intro.chord).
  const TAP: Record<AnyLang, RegExp> = { en: /\btap\s+['"‘“«]/i, pt: /\bcarrega em\s+['"‘“«]/i, es: /\bpulsa\s+['"‘“«]/i };
  for (const lang of LANGS) {
    it(`${lang}: no task of the thirteen modules asks to type a query`, () => {
      const bad = MODULES.flatMap((id) => moduleIn(lang, id).tasks.filter((t) => TYPING[lang].test(t)).map((t) => `${id}: ${t}`));
      expect(bad).toEqual([]);
    });
  }
  it('every task that asked to type now says tap, in all three languages, with the same quoted queries', () => {
    const tapped = MODULES.flatMap((id) => enModule(id).tasks.map((t, i) => [id, i, t.instruction] as const)).filter(([, , t]) => TAP.en.test(t));
    // The fourteen tasks that said "Type '…'" on 6de6c0e (l4u14m5 t1, l7u23m3 t1–t3,
    // l7u21m2 t1–t2, l4u12m5 t1–t2, l4u14m4 t1, l1u3m2 t1–t3, l9u30m3 t1 and t3).
    expect(tapped.length).toBe(14);
    for (const [id, i] of tapped) {
      for (const lang of ['pt', 'es'] as const) {
        expect(moduleIn(lang, id).tasks[i], `${lang} ${id} task ${i}`).toMatch(TAP[lang]);
      }
    }
  });
});

describe('A23 — minor-key cadences resolve TO A minor (l4u14m5)', () => {
  it('the task plays E → Am, then Em → Am, in every language', () => {
    for (const lang of LANGS) {
      expect(queriesOf(moduleIn(lang, 'l4u14m5').tasks[1]), lang).toEqual(['E major chord', 'Am', 'Em', 'Am']);
    }
  });
  it('the G♯ of E major is the leading note of A minor: a half step below A', () => {
    const e = chordFromParsed(parseChordSymbol('E')!);
    expect((getPitchClass(stringToNote('A')) - getPitchClass(e.notes[1]) + 12) % 12).toBe(1);
  });
});

describe('A24 — transposition by scale degree, with a worked example (l3u11m5)', () => {
  // Source: C. Schmidt-Jones, "Transposition: Changing Keys", Understanding Basic
  // Music Theory (OpenStax CNX): use the new key signature, move every note the
  // same number of lines and spaces, and raise or lower an accidental's note
  // from the new key signature.
  const degreesOf = (notes: string[], key: string) => {
    const scale = buildScale(stringToNote(key), 'major').notes.map((n) => n.natural + n.accidental);
    return notes.map((n) => scale.indexOf(n));
  };
  const onDegrees = (degrees: number[], key: string) => {
    const scale = buildScale(stringToNote(key), 'major').notes.map((n) => n.natural + n.accidental);
    return degrees.map((d) => scale[d]);
  };
  it('C–D–E in C major, moved to the same degrees of G major, is G–A–B (the engine agrees)', () => {
    expect(onDegrees(degreesOf(['C', 'D', 'E'], 'C'), 'G')).toEqual(['G', 'A', 'B']);
  });
  it('the lesson teaches the degree method and the example, and no longer "change the signature and adjust accidentals"', () => {
    const SAME_DEGREE: Record<AnyLang, RegExp> = { en: /same scale degree/i, pt: /mesmo grau/i, es: /mismo grado/i };
    const OLD: Record<AnyLang, RegExp> = { en: /adjust any accidentals to match/i, pt: /ajusta quaisquer acidentes/i, es: /ajusta cualquier alteración/i };
    for (const lang of LANGS) {
      const text = moduleIn(lang, 'l3u11m5').concepts[1].explanation;
      expect(text, lang).toMatch(SAME_DEGREE[lang]);
      expect(text, lang).toMatch(/C–D–E/);
      expect(text, lang).toMatch(/G–A–B/);
      expect(text, lang).not.toMatch(OLD[lang]);
    }
  });
  it('the two song examples are about transposition, not ornaments', () => {
    const ORNAMENT: Record<AnyLang, RegExp> = { en: /ornament|suspension|passing tone/i, pt: /ornament|retardo|notas? de passagem/i, es: /ornament|retardo|notas? de paso/i };
    for (const lang of LANGS) {
      const ctx = songContexts(lang, 'l3u11m5');
      expect(ctx.length, lang).toBeGreaterThanOrEqual(1);
      for (const c of ctx) {
        expect(c, lang).toMatch(/transp/i);
        expect(c, lang).not.toMatch(ORNAMENT[lang]);
      }
    }
  });
});

describe('A25 — three modes of ONE parent: C melodic minor, F Lydian dominant, B altered (l7u23m3)', () => {
  // Source: Hutchinson, Music Theory for the 21st-Century Classroom, "Jazz
  // scales" (University of Puget Sound): Lydian dominant = 4th mode of melodic
  // minor; altered = 7th mode of melodic minor.
  it('the task\'s queries resolve, share one set of notes, and start on degrees 1, 4 and 7 of C melodic minor', () => {
    const parent = buildScale(stringToNote('C'), 'melodic_minor').notes;
    for (const lang of LANGS) {
      const qs = queriesOf(moduleIn(lang, 'l7u23m3').tasks[0]);
      expect(qs, lang).toEqual(['C melodic minor', 'F lydian dominant', 'B altered scale']);
      const scales = qs.map((q) => resolveTheoryQuery(q));
      expect(scales.map((s) => s?.kind), lang).toEqual(['scale', 'scale', 'scale']);
      const built = scales.map((s) => (s?.kind === 'scale' ? buildScale(s.root, s.scaleType).notes : []));
      for (const notes of built) expect(pcSet(notes), lang).toEqual(pcSet(parent));
      expect(built.map((notes) => pcs(parent).indexOf(getPitchClass(notes[0])) + 1), lang).toEqual([1, 4, 7]);
    }
  });
  it('the check\'s hint names the same modes (mode 4 on F, mode 7 on B), and the lesson no longer says melodic-minor modes do not share their notes', () => {
    const hint = templatesL7.find((t) => t.moduleId === 'l7u23m3')!.templates[1].hintTemplate;
    expect(hint).toMatch(/mode 4 starts on F/);
    expect(hint).toMatch(/mode 7 on B/);
    const OLD: Record<AnyLang, RegExp> = { en: /Unlike the diatonic modes/i, pt: /Ao contrário dos modos diatónicos/i, es: /A diferencia de los modos diatónicos/i };
    for (const lang of LANGS) expect(moduleIn(lang, 'l7u23m3').concepts[0].explanation, lang).not.toMatch(OLD[lang]);
  });
});

describe('A26 — C7alt: four alterations available, one or more needed in a voicing (l7u21m2)', () => {
  // Source: Hutchinson, Music Theory for the 21st-Century Classroom, "Altered
  // dominant seventh chords": a dominant seventh is altered "if either or both
  // the 5th or 9th are chromatically raised or lowered".
  const ONE_OR_MORE: Record<AnyLang, RegExp> = { en: /one or more/i, pt: /uma ou mais/i, es: /una o más/i };
  const ALL_REQUIRED: Record<AnyLang, RegExp> = {
    en: /with (every|all) (altered )?extensions? altered|with all altered extensions/i,
    pt: /com todas as extensões alteradas/i,
    es: /con todas las extensiones alteradas/i,
  };
  it('the lesson and its task say a voicing needs one or more alterations, never all four', () => {
    for (const lang of LANGS) {
      const m = moduleIn(lang, 'l7u21m2');
      for (const text of [m.concepts[1].explanation, m.tasks[1]]) {
        expect(text, lang).toMatch(ONE_OR_MORE[lang]);
        expect(text, lang).not.toMatch(ALL_REQUIRED[lang]);
      }
    }
  });
  it('the check keys the same definition', () => {
    const e2 = exercisesL7.l7u21m2.find((e) => e.id === 'l7u21m2e2')!;
    const right = e2.config.type === 'multiple_choice' ? e2.config.choices.findIndex((c) => c.correct) : -1;
    expect(e2.config.type === 'multiple_choice' && e2.config.choices[right].label).toMatch(ONE_OR_MORE.en);
    for (const lang of ['pt', 'es'] as const) expect(exerciseOverlay(lang, 7).l7u21m2e2.choices?.[right], lang).toMatch(ONE_OR_MORE[lang]);
  });
  it('the played example, C7alt, is the shell C–E–B♭ with all four alterations (D♭, D♯, F♯, A♭), as the lesson says', () => {
    const q = resolveTheoryQuery('C7alt');
    expect(q?.kind).toBe('chord');
    const notes = chordFromParsed(q!.kind === 'chord' ? q!.parsed : parseChordSymbol('C7')!).notes;
    expect(pcSet(notes)).toEqual([0, 1, 3, 4, 6, 8, 10]);
    expect(enModule('l7u21m2').concepts[1].explanation).toMatch(/all four/);
  });
});

describe('A28 — the bass C–F–G–C is not stepwise (l4u14m4)', () => {
  // Source: Open Music Theory, "Strengthening Endings with Strong
  // Predominants": ii6 and IV both put fa (4̂) in the bass.
  it('only F–G is a step: C–F and G–C are 4ths (counted by letter)', () => {
    const LETTERS = 'CDEFGAB';
    const up = (a: string, b: string) => ((LETTERS.indexOf(b) - LETTERS.indexOf(a) + 7) % 7) + 1;
    expect([up('C', 'F'), up('F', 'G'), up('G', 'C')]).toEqual([4, 2, 4]);
  });
  it('no language calls it a stepwise bass line', () => {
    const OLD: Record<AnyLang, RegExp> = {
      en: /stepwise bass line: C-F-G-C/i,
      pt: /por grau conjunto: C-F-G-C/i,
      es: /por grado conjunto: C-F-G-C/i,
    };
    const FOURTH: Record<AnyLang, RegExp> = { en: /4th/, pt: /4\.ª/, es: /4\.ª/ };
    for (const lang of LANGS) {
      const t = moduleIn(lang, 'l4u14m4').tasks[2];
      expect(t, lang).not.toMatch(OLD[lang]);
      expect(t, lang).toMatch(/C–F–G–C/);
      expect(t, lang).toMatch(FOURTH[lang]);
    }
  });
});

describe('A29 — the blues task names C7 with G in the bass (l7u21m5)', () => {
  it('F7, F♯dim7, C7/G in every language; C7/G resolves with G as its bass', () => {
    for (const lang of LANGS) expect(queriesOf(moduleIn(lang, 'l7u21m5').tasks[1]), lang).toEqual(['F7', 'F#dim7', 'C7/G']);
    const q = resolveTheoryQuery('C7/G');
    expect(q?.kind === 'chord' && q.parsed.bassNote && getPitchClass(q.parsed.bassNote)).toBe(7);
  });
});

describe('A30 — a key signature gives the default; a written natural changes it; one sharp is G major or E minor (l1u3m2)', () => {
  // Sources: Wikipedia, "Key signature" ("A key signature with one sharp must
  // show F♯, which indicates G major or E minor"); Wikipedia, "Accidental
  // (music)" ("A natural is used to cancel the effect of a flat or sharp").
  const ALWAYS: Record<AnyLang, RegExp> = { en: /always sharp/i, pt: /sempre sustenido/i, es: /siempre sostenido/i };
  const E_MINOR: Record<AnyLang, RegExp> = { en: /E minor/, pt: /E menor/, es: /E menor/ };
  it('no language says F is always sharp; both concepts name the natural sign; the scale-vs-key concept names E minor', () => {
    for (const lang of LANGS) {
      const m = moduleIn(lang, 'l1u3m2');
      for (const c of [m.concepts[0].explanation, m.concepts[2].explanation]) {
        expect(c, lang).not.toMatch(ALWAYS[lang]);
        expect(c, lang).toMatch(/♮/);
      }
      expect(m.concepts[2].explanation, lang).toMatch(E_MINOR[lang]);
    }
  });
  it('E natural minor uses exactly the notes of G major', () => {
    expect(pcSet(buildScale(stringToNote('E'), 'natural_minor').notes)).toEqual(pcSet(buildScale(stringToNote('G'), 'major').notes));
  });
});

describe('A31 — each song cue names the notes to compare (l9u30m3)', () => {
  // The openings, from their melodies (in C, or the key named): Wikipedia,
  // "Interval recognition" lists Twinkle as a unison "(on 'twin-kle')" and the
  // perfect fifth "(from 1st to 2nd 'twinkle')", i.e. between its 2nd and 3rd
  // notes; Happy Birthday opens sol-sol-la (G G A in C).
  const OPENINGS: Record<string, { notes: string[]; pair: [number, number]; semitones: number }> = {
    Jaws: { notes: ['E4', 'F4'], pair: [0, 1], semitones: 1 },
    'Happy Birthday': { notes: ['G4', 'G4', 'A4', 'G4', 'C5', 'B4'], pair: [1, 2], semitones: 2 },
    Greensleeves: { notes: ['A4', 'C5'], pair: [0, 1], semitones: 3 },
    'When the Saints': { notes: ['C4', 'E4', 'F4', 'G4'], pair: [0, 1], semitones: 4 },
    'Here Comes the Bride': { notes: ['D4', 'G4', 'G4', 'G4'], pair: [0, 1], semitones: 5 },
    'The Simpsons': { notes: ['C4', 'F#4', 'G4'], pair: [0, 1], semitones: 6 },
    Twinkle: { notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'], pair: [1, 2], semitones: 7 },
  };
  const midi = (p: string) => {
    const m = /^([A-G])(#|b)?(\d)$/.exec(p)!;
    return 12 * (Number(m[3]) + 1) + getPitchClass(stringToNote(m[1] + (m[2] ?? '')));
  };
  it('the pair each cue names spans the interval it teaches; the first two notes of Happy Birthday and Twinkle are one pitch', () => {
    for (const [song, o] of Object.entries(OPENINGS)) {
      expect(midi(o.notes[o.pair[1]]) - midi(o.notes[o.pair[0]]), song).toBe(o.semitones);
    }
    expect(midi(OPENINGS['Happy Birthday'].notes[1]) - midi(OPENINGS['Happy Birthday'].notes[0])).toBe(0);
    expect(midi(OPENINGS.Twinkle.notes[1]) - midi(OPENINGS.Twinkle.notes[0])).toBe(0);
  });
  it('the lesson says to compare the 2nd and 3rd notes of Happy Birthday and of Twinkle, in every language', () => {
    const SECOND_THIRD: Record<AnyLang, RegExp> = { en: /2nd and 3rd notes/, pt: /2\.ª e 3\.ª notas/, es: /2\.ª y 3\.ª notas/ };
    const SONGS: Record<AnyLang, [RegExp, RegExp]> = {
      en: [/Happy Birthday/, /Twinkle Twinkle/],
      pt: [/Parabéns a Você/, /Brilha Brilha Estrelinha/],
      es: [/Cumpleaños Feliz/, /Brilla Brilla Estrellita/],
    };
    for (const lang of LANGS) {
      const text = moduleIn(lang, 'l9u30m3').concepts[0].explanation;
      for (const song of SONGS[lang]) {
        const at = text.search(song);
        expect(at, `${lang} ${song}`).toBeGreaterThanOrEqual(0);
        // The cue follows the song's name, before the next cue starts.
        const cue = text.slice(at).split(/\. /)[0];
        expect(cue, `${lang} ${song}`).toMatch(SECOND_THIRD[lang]);
      }
    }
  });
  it('PT and ES name Wagner\'s bridal chorus, not "the" wedding march (Mendelssohn\'s opens on repeated notes)', () => {
    for (const lang of ['pt', 'es'] as const) {
      expect(moduleIn(lang, 'l9u30m3').concepts[0].explanation, lang).toMatch(/Wagner/);
    }
  });
});

describe('A32 — an arpeggio goes up or down (glossary)', () => {
  // Source: Wikipedia, "Arpeggio": the notes of a chord "individually sounded
  // in a progressive rising or descending order".
  const entries = { en: enGlossary.entries.arpeggio.plain, pt: ptGlossary.entries.arpeggio.plain, es: esGlossary.entries.arpeggio.plain };
  const BOTH: Record<AnyLang, RegExp> = { en: /up or down/i, pt: /a subir ou a descer/i, es: /subiendo o bajando/i };
  const OLD: Record<AnyLang, RegExp> = { en: /from the bottom up/i, pt: /de baixo para cima/i, es: /de abajo arriba/i };
  it('every language defines both directions and gives both examples (C, E, G and G, E, C)', () => {
    for (const lang of LANGS) {
      expect(entries[lang], lang).toMatch(BOTH[lang]);
      expect(entries[lang], lang).not.toMatch(OLD[lang]);
      expect(entries[lang], lang).toContain('C, E, G');
      expect(entries[lang], lang).toContain('G, E, C');
      expect(entries[lang].length, lang).toBeLessThanOrEqual(220);
    }
  });
});

describe('A33 — the brace joins the staves; middle C has a ledger line only where it is written (l1u1m2)', () => {
  // Source: Open Music Theory 2e, "The Keyboard and the Grand Staff": "The two
  // staves are connected on the left side with a line and a brace."
  const OLD: Record<AnyLang, RegExp> = {
    en: /shared middle-C ledger line|as the ledger line between/i,
    pt: /linha suplementar partilhada|como a linha suplementar entre/i,
    es: /línea adicional compartida|como la línea adicional entre/i,
  };
  const BRACE: Record<AnyLang, RegExp> = { en: /brace/, pt: /chaveta/, es: /llave/ };
  const BELOW_ABOVE: Record<AnyLang, [RegExp, RegExp]> = {
    en: [/below the treble staff/, /above the bass staff/],
    pt: [/abaixo da pauta de clave de sol/, /acima da pauta de clave de fá/],
    es: [/por debajo del pentagrama de clave de sol/, /por encima del pentagrama de clave de fa/],
  };
  it('no language describes a permanent shared ledger line; the grand-staff concept names the brace and both places middle C is written', () => {
    for (const lang of LANGS) {
      const m = moduleIn(lang, 'l1u1m2');
      const text = [...m.objectives, m.concepts[1].explanation].join(' ');
      expect(text, lang).not.toMatch(OLD[lang]);
      expect(m.concepts[1].explanation, lang).toMatch(BRACE[lang]);
      for (const where of BELOW_ABOVE[lang]) expect(m.concepts[1].explanation, lang).toMatch(where);
    }
  });
});

describe('A34 — 6/8 counts two beats a bar, 12/8 four; both divide each beat in three (House of the Rising Sun)', () => {
  // Source: Open Music Theory, "Compound Meters and Time Signatures": 6/8 is
  // compound duple (two beats), 12/8 compound quadruple (four beats).
  const OLD: Record<AnyLang, RegExp> = {
    en: /compound-duple feel is the same/i,
    pt: /sensação de compasso composto binário é a mesma/i,
    es: /sensación de compás compuesto binario es la misma/i,
  };
  const FOUR: Record<AnyLang, RegExp> = { en: /four/, pt: /quatro/, es: /cuatro/ };
  const THREE: Record<AnyLang, RegExp> = { en: /three/, pt: /três/, es: /tres/ };
  it('the note separates the beat count of a written bar from the shared division in threes', () => {
    for (const lang of LANGS) {
      const note = songContexts(lang, 'l2u6m1')[0];
      expect(note, lang).not.toMatch(OLD[lang]);
      expect(note, lang).toMatch(/12\/8/);
      expect(note, lang).toMatch(FOUR[lang]);
      expect(note, lang).toMatch(THREE[lang]);
    }
  });
});

describe('A35 — the Goldberg canons are Nos. 3 to 27; No. 30 is a quodlibet (l8u25m3)', () => {
  // Source: Netherlands Bach Society, BWV 988: the canons run from no. 3 "up
  // to a ninth in no. 27"; "Variation 30, which should have been the tenth
  // canon in the sequence, appears in the surprising form of a quodlibet".
  it('every language qualifies the pattern and names the exception', () => {
    const OLD: Record<AnyLang, RegExp> = {
      en: /\(every third variation is a canon\)/i,
      pt: /\(uma em cada três variações é um cânone\)/i,
      es: /\(una de cada tres variaciones es un canon\)/i,
    };
    for (const lang of LANGS) {
      const t = moduleIn(lang, 'l8u25m3').tasks[1];
      expect(t, lang).not.toMatch(OLD[lang]);
      expect(t, lang).toMatch(/27/);
      expect(t, lang).toMatch(/30/);
      expect(t, lang).toMatch(/quodlibet/);
    }
  });
});
