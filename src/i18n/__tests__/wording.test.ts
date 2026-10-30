/**
 * W6-12 — wording that misled or read as an anglicism in PT/ES.
 * (The Drill's "Quase"/"Casi" feedback is handled with the Drill work.)
 */
import { describe, it, expect } from 'vitest';
import i18next from 'i18next';
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import es from '../locales/es.json';

async function makeT(lng: 'pt' | 'es') {
  const inst = i18next.createInstance();
  await inst.init({
    resources: { en: { translation: en }, pt: { translation: pt }, es: { translation: es } },
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
  return inst.t.bind(inst) as (key: string, opts?: Record<string, unknown>) => string;
}

describe('degree feedback agrees with the (feminine) degree names', () => {
  it.each([
    ['pt', 'Correto! Essa nota é a Dominante (5.º) da escala.', 'Essa nota é a Sensível (7.º), não a Tónica (1.º).'],
    ['es', '¡Correcto! Esa nota es la Dominante (5.º) de la escala.', 'Esa nota es la Sensible (7.º), no la Tónica (1.º).'],
  ] as const)('%s', async (lang, correct, incorrect) => {
    const t = await makeT(lang);
    expect(t('exerciseFeedback.degreeCorrect', { degree: t('exerciseFeedback.degreeName5') })).toBe(correct);
    expect(
      t('exerciseFeedback.degreeIncorrect', {
        correctDegree: t('exerciseFeedback.degreeName7'),
        userDegree: t('exerciseFeedback.degreeName1'),
      }),
    ).toBe(incorrect);
  });

  it('no "o/a" or "el/la" article pairs remain in PT/ES', () => {
    expect(JSON.stringify(pt)).not.toMatch(/\bo\/a\b/);
    expect(JSON.stringify(es)).not.toMatch(/\bel\/la\b/);
  });
});

describe('interface labels are Portuguese/Spanish', () => {
  it('the inversion heading, slash-bass tooltip and Drill reset button', () => {
    expect(pt.panel.voicing).toBe('Inversão');
    expect(es.panel.voicing).toBe('Inversión');
    for (const loc of [pt, es]) expect(loc.panel.slashBass).not.toMatch(/slash/i);
    expect(pt.drill.settings.resetConfirm).not.toMatch(/reset/i);
  });
});
