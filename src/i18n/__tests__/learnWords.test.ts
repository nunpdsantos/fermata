/**
 * The `learnWords` namespace (audit fixes, 18 November 2026, stream E): the
 * level card's optional-unit line and the check's staff descriptions. Lazy —
 * it loads with Learn's code, never with the entry bundle — and the same in
 * all three languages: the same keys, the same placeholders.
 */
import { describe, it, expect } from 'vitest';
import en from '../learnWords/en.json';
import pt from '../learnWords/pt.json';
import es from '../learnWords/es.json';
import enLocale from '../locales/en.json';
import ptLocale from '../locales/pt.json';
import esLocale from '../locales/es.json';

type Tree = { [k: string]: string | Tree };
const flat = (t: Tree, p = ''): [string, string][] =>
  Object.entries(t).flatMap(([k, v]) => (typeof v === 'string' ? [[`${p}${k}`, v] as [string, string]] : flat(v, `${p}${k}.`)));
const holes = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

/**
 * Every sentence, word for word, in the three languages (review of e92e44e:
 * a Portuguese "acima" swapped for "abaixo", or a Spanish natural sign called
 * "bemol", must fail a test). Changing one is a deliberate change: change it
 * here too, and in the readers of staffDescriptionMeaning.corpus.test.ts.
 */
const PINNED: [key: string, en: string, pt: string, es: string][] = [
  ["optionalUnits_one", "+ {{count}} optional unit", "+ {{count}} unidade opcional", "+ {{count}} unidad opcional"],
  ["optionalUnits_other", "+ {{count}} optional units", "+ {{count}} unidades opcionais", "+ {{count}} unidades opcionales"],
  ["staff.clef", "{{clef}}.", "{{clef}}.", "{{clef}}."],
  ["staff.clefSignature", "{{clef}}, {{signature}}.", "{{clef}}, {{signature}}.", "{{clef}}, {{signature}}."],
  ["staff.noSignature", "no sharps or flats in the key signature", "sem sustenidos nem bemóis na armação de clave", "sin sostenidos ni bemoles en la armadura de clave"],
  ["staff.sharps_one", "one sharp in the key signature: {{places}}", "um sustenido na armação de clave: {{places}}", "un sostenido en la armadura de clave: {{places}}"],
  ["staff.sharps_other", "{{count}} sharps in the key signature: {{places}}", "{{count}} sustenidos na armação de clave: {{places}}", "{{count}} sostenidos en la armadura de clave: {{places}}"],
  ["staff.flats_one", "one flat in the key signature: {{places}}", "um bemol na armação de clave: {{places}}", "un bemol en la armadura de clave: {{places}}"],
  ["staff.flats_other", "{{count}} flats in the key signature: {{places}}", "{{count}} bemóis na armação de clave: {{places}}", "{{count}} bemoles en la armadura de clave: {{places}}"],
  ["staff.sigLine", "on the {{letter}} line", "na linha do {{letter}}", "en la línea del {{letter}}"],
  ["staff.sigSpace", "in the {{letter}} space", "no espaço do {{letter}}", "en el espacio del {{letter}}"],
  ["staff.sigSpaceAbove", "in the {{letter}} space above the staff", "no espaço do {{letter}} acima da pauta", "en el espacio del {{letter}} por encima del pentagrama"],
  ["staff.sigSpaceBelow", "in the {{letter}} space below the staff", "no espaço do {{letter}} abaixo da pauta", "en el espacio del {{letter}} por debajo del pentagrama"],
  ["staff.oneNote", "One note, {{place}}.", "Uma nota, {{place}}.", "Una nota, {{place}}."],
  ["staff.notesInOrder", "{{count}} notes, one after the other: {{places}}.", "{{count}} notas, uma depois da outra: {{places}}.", "{{count}} notas, una después de otra: {{places}}."],
  ["staff.chord", "{{count}} notes stacked as one chord, from the lowest: {{places}}.", "{{count}} notas sobrepostas num só acorde, da mais grave para a mais aguda: {{places}}.", "{{count}} notas superpuestas en un solo acorde, de la más grave a la más aguda: {{places}}."],
  ["staff.then", ", then ", ", depois ", ", después "],
  ["staff.place.line", "on line {{n}}", "na linha {{n}}", "en la línea {{n}}"],
  ["staff.place.space", "in space {{n}}", "no espaço {{n}}", "en el espacio {{n}}"],
  ["staff.place.spaceBelowStaff", "in the space just below the staff", "no espaço logo abaixo da pauta", "en el espacio justo debajo del pentagrama"],
  ["staff.place.spaceAboveStaff", "in the space just above the staff", "no espaço logo acima da pauta", "en el espacio justo encima del pentagrama"],
  ["staff.place.ledgerBelow", "on ledger line {{n}} below the staff", "na linha suplementar {{n}} abaixo da pauta", "en la línea adicional {{n}} por debajo del pentagrama"],
  ["staff.place.ledgerAbove", "on ledger line {{n}} above the staff", "na linha suplementar {{n}} acima da pauta", "en la línea adicional {{n}} por encima del pentagrama"],
  ["staff.place.spaceUnderLedger", "in the space below ledger line {{n}}, under the staff", "no espaço abaixo da linha suplementar {{n}}, sob a pauta", "en el espacio debajo de la línea adicional {{n}}, bajo el pentagrama"],
  ["staff.place.spaceOverLedger", "in the space above ledger line {{n}}, over the staff", "no espaço acima da linha suplementar {{n}}, sobre a pauta", "en el espacio encima de la línea adicional {{n}}, sobre el pentagrama"],
  ["staff.acc.sharp", "with a sharp", "com um sustenido", "con un sostenido"],
  ["staff.acc.flat", "with a flat", "com um bemol", "con un bemol"],
  ["staff.acc.doubleSharp", "with a double sharp", "com um duplo sustenido", "con un doble sostenido"],
  ["staff.acc.doubleFlat", "with a double flat", "com um duplo bemol", "con un doble bemol"],
  ["staff.acc.natural", "with a natural sign", "com um bequadro", "con un becuadro"],
  ["staff.counted", "The staff's lines and spaces are counted from the bottom.", "As linhas e os espaços da pauta contam-se de baixo para cima.", "Las líneas y los espacios del pentagrama se cuentan de abajo arriba."],
  ["staff.countedLedger", "Ledger lines are counted outwards from the staff.", "As linhas suplementares contam-se a partir da pauta, para fora.", "Las líneas adicionales se cuentan desde el pentagrama hacia fuera."],
];

describe('learnWords', () => {
  it('every sentence is exactly the reviewed one, in EN, PT and ES', () => {
    expect(flat(en)).toEqual(PINNED.map(([k, e]) => [k, e]));
    expect(flat(pt)).toEqual(PINNED.map(([k, , p]) => [k, p]));
    expect(flat(es)).toEqual(PINNED.map(([k, , , s]) => [k, s]));
  });

  it('EN, PT and ES have the same keys and the same placeholders in each', () => {
    const [e, p, s] = [flat(en), flat(pt), flat(es)];
    expect(p.map(([k]) => k)).toEqual(e.map(([k]) => k));
    expect(s.map(([k]) => k)).toEqual(e.map(([k]) => k));
    for (const [k, v] of e) {
      expect(holes(Object.fromEntries(p)[k]), `pt ${k}`).toEqual(holes(v));
      expect(holes(Object.fromEntries(s)[k]), `es ${k}`).toEqual(holes(v));
    }
  });

  it('is not in the entry locales (it loads with Learn\'s chunk)', () => {
    for (const loc of [enLocale, ptLocale, esLocale]) expect(loc).not.toHaveProperty('learnWords');
  });

  it('says no note letter of its own: letters come only through {{letter}} (a key signature\'s lines)', () => {
    for (const lang of [en, pt, es]) for (const [k, v] of flat(lang)) expect(v.replace(/\{\{\w+\}\}/g, ''), k).not.toMatch(/(?<![\p{L}])[A-G](?![\p{L}])/u);
  });
});
