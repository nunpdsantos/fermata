/**
 * Drill text in Portuguese and Spanish (audit W6-07 / E-10, decisions D-17,
 * D-18, D-19) and Drill text polish (audit W7-12 / D-22).
 *
 * The bank keeps English display strings (they are the grading values); the
 * view translates degree, function and cadence names, Yes/No, and key/scale/
 * triad names ("C major" → "C maior" / "C mayor") at render time. Interval
 * labels, seventh-chord quality names and Roman numerals stay as they are
 * (nomenclature convention; chord-quality symbols stay symbols per D-17).
 * English must render exactly as before.
 *
 * Ported from the auditors' render-drill probe (all items × EN/PT/ES).
 */
import { describe, it, expect } from 'vitest';
import i18n from '../../../i18n';
import { generateDrillBank } from '../../../core/utils/drillBank';
import type { DrillItem } from '../../../core/types/drill';
import { choiceLabel, itemPrompt, itemWhy, localizeTerm } from '../drillText';

const BANK = generateDrillBank();
const BY_ID = new Map(BANK.map((i) => [i.id, i]));
const item = (id: string): DrillItem => {
  const found = BY_ID.get(id);
  expect(found, id).toBeDefined();
  return found!;
};
type Lang = 'en' | 'pt' | 'es';
const T = (lang: Lang) => i18n.getFixedT(lang);
const prompt = (id: string, lang: Lang) => itemPrompt(item(id), T(lang), lang);
const why = (id: string, lang: Lang) => itemWhy(item(id), T(lang), lang);
const labels = (id: string, lang: Lang) => {
  const it = item(id);
  return it.input.format === 'choice' ? it.input.choices.map((c) => choiceLabel(it, c, T(lang), lang)) : [];
};
const answer = (id: string, lang: Lang) => {
  const it = item(id);
  return it.answer.kind === 'choice' ? choiceLabel(it, it.answer.correct, T(lang), lang) : '';
};

describe('English renders exactly as before', () => {
  it('every choice label, prompt param and why param is unchanged in EN', () => {
    const t = T('en');
    for (const it of BANK) {
      if (it.input.format === 'choice') {
        for (const c of it.input.choices) expect(choiceLabel(it, c, t, 'en'), it.id).toBe(c);
      }
      for (const v of [...Object.values(it.promptParams), ...Object.values(it.whyParams)]) {
        if (typeof v === 'string') expect(localizeTerm(v, { t, lang: 'en', family: it.family }), it.id).toBe(v);
      }
    }
  });

  it('a few English prompts read as they always did', () => {
    expect(prompt('degree:name-to-num:Tonic', 'en')).toBe('The Tonic is which scale degree?');
    expect(prompt('keysig:key-to-count:A:major', 'en')).toBe('How many sharps or flats does A major have?');
    expect(prompt('function:chord-function:C:ii', 'en')).toBe('In C major, D minor (ii) functions as…?');
    expect(why('function:cadence:V-vi', 'en')).toBe('Deceptive cadence (UK: interrupted).');
  });
});

describe('degree names in PT/ES (W6-07)', () => {
  it('PT', () => {
    expect(labels('degree:num-to-name:1', 'pt')).toContain('Tónica');
    expect(answer('degree:num-to-name:7', 'pt')).toBe('Sensível');
    expect(prompt('degree:name-to-num:Tonic', 'pt')).toBe('A Tónica é que grau da escala?');
    expect(why('degree:name-to-num:Tonic', 'pt')).toBe('O grau 1 da escala é a Tónica.');
  });
  it('ES', () => {
    expect(labels('degree:num-to-name:1', 'es')).toContain('Tónica');
    expect(answer('degree:num-to-name:7', 'es')).toBe('Sensible');
    expect(prompt('degree:name-to-num:Supertonic', 'es')).toBe('¿Qué grado de la escala es la Supertónica?');
    expect(why('degree:name-to-num:Supertonic', 'es')).toBe('El grado 2 de la escala es la Supertónica.');
  });
});

describe('function and cadence names in PT/ES, no "(RU: …)" gloss (W6-07, D-19)', () => {
  it('function labels', () => {
    expect(labels('function:chord-function:C:ii', 'pt').sort()).toEqual(
      ['Dominante', 'Subdominante (pré-dominante)', 'Tónica'].sort(),
    );
    expect(labels('function:chord-function:C:ii', 'es').sort()).toEqual(
      ['Dominante', 'Subdominante (predominante)', 'Tónica'].sort(),
    );
    expect(prompt('function:chord-function:C:ii', 'pt')).toBe('Em C maior, D menor (ii) funciona como…?');
    expect(prompt('function:chord-function:C:ii', 'es')).toBe('En C mayor, D menor (ii) funciona como…?');
  });

  it('cadence names follow each language\'s own lesson (l3u11m1)', () => {
    expect(answer('function:cadence:V-I', 'pt')).toBe('Cadência perfeita');
    expect(answer('function:cadence:IV-I', 'pt')).toBe('Cadência plagal');
    expect(answer('function:cadence:I-V', 'pt')).toBe('Cadência suspensiva');
    expect(answer('function:cadence:V-vi', 'pt')).toBe('Cadência interrompida');
    expect(answer('function:cadence:V-I', 'es')).toBe('Cadencia auténtica perfecta');
    expect(answer('function:cadence:IV-I', 'es')).toBe('Cadencia plagal');
    expect(answer('function:cadence:I-V', 'es')).toBe('Semicadencia');
    expect(answer('function:cadence:V-vi', 'es')).toBe('Cadencia interrumpida');
  });

  it('PT/ES cadence explanations carry no UK gloss', () => {
    for (const lang of ['pt', 'es'] as const) {
      for (const it of BANK.filter((i) => i.id.startsWith('function:cadence:'))) {
        const w = itemWhy(it, T(lang), lang);
        expect(w, `${lang} ${it.id}`).not.toMatch(/\b(RU|UK):|\binterrupted\b|\bimperfect\b|\bperfect\b|\bplagal\)/);
      }
    }
    expect(why('function:cadence:V-vi', 'pt')).toBe('Cadência interrompida.');
    expect(why('function:cadence:V-vi', 'es')).toBe('Cadencia interrumpida.');
    expect(why('function:cadence:V-I', 'pt')).toContain('cadência imperfeita');
  });
});

describe('Yes / No and key names in PT/ES (W6-07, D-17)', () => {
  it('Yes / No', () => {
    expect(labels('roman:is-diatonic:C:2:yes', 'pt')).toEqual(['Sim', 'Não']);
    expect(labels('roman:is-diatonic:C:2:yes', 'es')).toEqual(['Sí', 'No']);
    expect(answer('roman:is-diatonic:C:2:no', 'pt')).toBe('Não');
  });

  it('key, scale and triad names', () => {
    expect(prompt('keysig:key-to-count:A:major', 'pt')).toBe('Quantos sustenidos ou bemóis tem A maior?');
    expect(prompt('keysig:key-to-count:f#:minor', 'es')).toBe('¿Cuántos sostenidos o bemoles tiene F♯ menor?');
    expect(prompt('scale:spell:a:harmonic_minor', 'pt')).toBe('Soletra a escala de A menor harmónica');
    expect(prompt('scale:spell:a:melodic_minor', 'es')).toBe('Deletrea la escala de A menor melódica');
    expect(answer('keysig:rel-minor:C', 'pt')).toBe('A menor');
    expect(answer('roman:degree-to-chord:C:major:7', 'pt')).toBe('B diminuto');
    expect(answer('roman:degree-to-chord:C:major:7', 'es')).toBe('B disminuido');
    expect(prompt('triad:name-to-notes:C#:augmented', 'pt')).toBe('Soletra C♯ aumentado');
    expect(labels('roman:pattern:major:7', 'pt')).toContain('diminuto (vii°)');
    expect(prompt('roman:pattern:major:2', 'pt')).toBe('Em qualquer tonalidade maior, a tríade do grau 2 é…?');
  });

  it('nomenclature stays: interval labels, seventh-chord names, numerals', () => {
    expect(labels('interval:pair-to-name:C:E', 'pt')).toContain('Major 3rd');
    expect(prompt('seventh:name-to-notes:C:major7', 'pt')).toBe('Soletra C Major 7th');
    expect(prompt('roman:degree-to-chord:C:major:6', 'pt')).toBe('O que é vi em C maior?');
  });
});

describe('PT/ES sweep over the whole bank (port of E-10)', () => {
  const EN_TERMS = [
    'Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading Tone',
    'Subdominant (pre-dominant)', 'Perfect authentic cadence', 'Plagal cadence', 'Half cadence',
    'Deceptive cadence', 'Yes', 'No',
  ];
  const KEY_NAME = /^[A-G](?:𝄪|𝄫|♯|♭)? (major|minor|natural minor|harmonic minor|melodic minor|diminished|augmented)$/u;

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang.toUpperCase()}: no English term survives in choices, answers or params`, () => {
      const t = T(lang);
      const leaks: string[] = [];
      for (const it of BANK) {
        const values: string[] = [];
        if (it.input.format === 'choice') values.push(...it.input.choices);
        for (const v of [...Object.values(it.promptParams), ...Object.values(it.whyParams)]) {
          if (typeof v === 'string') values.push(v);
        }
        for (const v of values) {
          const out = localizeTerm(v, { t, lang, family: it.family });
          const english = EN_TERMS.includes(v) || KEY_NAME.test(v) || /^(major|minor|diminished|augmented) \(/.test(v);
          if (lang === 'es' && v === 'No') continue; // "No" is Spanish too
          if (english && out === v) leaks.push(`${it.id}: "${v}"`);
        }
      }
      expect(leaks.slice(0, 10)).toEqual([]);
    });

    it(`${lang.toUpperCase()}: rendered prompts and explanations keep letter note names (D-18) and no stray tokens`, () => {
      const t = T(lang);
      for (const it of BANK) {
        const text = `${itemPrompt(it, t, lang)} ${itemWhy(it, t, lang)}`;
        expect(text, it.id).not.toMatch(/\{\{|\}\}/);
        expect(text, it.id).not.toMatch(/\b(Dó|Ré|Fá|Lá)\b/);
      }
    });
  }
});

describe('text polish (W7-12)', () => {
  it('"1 semitone", not "1 semitones"', () => {
    expect(prompt('interval:semitones-to-name:1', 'en')).toBe('1 semitone is which interval?');
    expect(prompt('interval:semitones-to-name:7', 'en')).toBe('7 semitones is which interval?');
    expect(prompt('interval:semitones-to-name:1', 'pt')).toBe('Que intervalo tem 1 meio-tom?');
    expect(prompt('interval:semitones-to-name:2', 'pt')).toBe('Que intervalo tem 2 meios-tons?');
    expect(prompt('interval:semitones-to-name:1', 'es')).toBe('¿Qué intervalo tiene 1 semitono?');
    expect(prompt('interval:semitones-to-name:2', 'es')).toBe('¿Qué intervalo tiene 2 semitonos?');
  });

  it('no "a Octave" and no "1 semitones" in any semitone explanation', () => {
    for (const it of BANK.filter((i) => i.id.startsWith('interval:semitones-to-name:'))) {
      const w = itemWhy(it, T('en'), 'en');
      expect(w, it.id).not.toMatch(/\ba Octave\b|\b1 semitones\b/);
    }
    expect(why('interval:semitones-to-name:12', 'en')).toContain('the Octave spans 12 semitones');
    expect(why('interval:semitones-to-name:1', 'en')).toContain('the Minor 2nd spans 1 semitone.');
    expect(why('interval:semitones-to-name:1', 'pt')).toContain('1 meio-tom forma Minor 2nd');
    expect(why('interval:semitones-to-name:1', 'es')).toContain('1 semitono forma Minor 2nd');
  });

  it('Spanish wrong-answer title is a plain "wrong", not "Casi" (almost)', () => {
    expect(T('es')('drill.feedback.wrong')).toBe('Incorrecto');
  });

  it('scale explanations name the key signature in ♯/♭, not the whole scale in ASCII', () => {
    expect(why('scale:spell:A:major', 'en')).toBe('The A major scale uses its key signature: F♯ C♯ G♯.');
    expect(why('scale:spell:e:natural_minor', 'en')).toBe('The E natural minor scale uses its key signature: F♯.');
    expect(why('scale:spell:C:major', 'en')).toBe('The C major scale has no sharps or flats.');
    expect(why('scale:spell:a:natural_minor', 'pt')).toBe('A escala de A menor natural não tem sustenidos nem bemóis.');
    expect(why('scale:spell:Eb:major', 'es')).toBe('La escala de E♭ mayor usa su armadura de clave: B♭ E♭ A♭.');
    for (const it of BANK.filter((i) => i.family === 'scale')) {
      expect(itemWhy(it, T('en'), 'en'), it.id).not.toMatch(/[A-G](#|b)\b/);
    }
  });

  // Review of W7: a degree-of explanation that only gave the key signature
  // left the learner to rebuild the scale; it now spells the scale (♯/♭
  // glyphs) and names the degree, keeping the signature.
  it('degree-of explanations spell the scale and name the degree (all 180 items)', () => {
    expect(why('scale:degree-of:A:major:3', 'en')).toBe(
      'The A major scale is A B C♯ D E F♯ G♯, so degree 3 is C♯. Key signature: F♯ C♯ G♯.',
    );
    expect(why('scale:degree-of:C:major:5', 'en')).toBe(
      'The C major scale is C D E F G A B, so degree 5 is G. No sharps or flats.',
    );
    expect(why('scale:degree-of:e:natural_minor:2', 'en')).toBe(
      'The E natural minor scale is E F♯ G A B C D, so degree 2 is F♯. Key signature: F♯.',
    );
    expect(why('scale:degree-of:A:major:3', 'pt')).toBe(
      'A escala de A maior é A B C♯ D E F♯ G♯, por isso o grau 3 é C♯. Armação de clave: F♯ C♯ G♯.',
    );
    expect(why('scale:degree-of:a:natural_minor:4', 'pt')).toBe(
      'A escala de A menor natural é A B C D E F G, por isso o grau 4 é D. Sem sustenidos nem bemóis.',
    );
    expect(why('scale:degree-of:Eb:major:7', 'es')).toBe(
      'La escala de E♭ mayor es E♭ F G A♭ B♭ C D, así que el grado 7 es D. Armadura de clave: B♭ E♭ A♭.',
    );
    expect(why('scale:degree-of:C:major:2', 'es')).toBe(
      'La escala de C mayor es C D E F G A B, así que el grado 2 es D. Sin sostenidos ni bemoles.',
    );
    const degreeItems = BANK.filter((i) => i.id.startsWith('scale:degree-of:'));
    expect(degreeItems).toHaveLength(180);
    for (const it of degreeItems) {
      const answerText = it.answer.kind === 'choice' ? it.answer.correct : '';
      for (const lang of ['en', 'pt', 'es'] as const) {
        const w = itemWhy(it, T(lang), lang);
        expect(w, `${lang} ${it.id}`).toContain(answerText);
        expect(w, `${lang} ${it.id}`).not.toMatch(/[A-G](#|b)\b|\{\{/);
      }
    }
  });
});
