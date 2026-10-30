/**
 * Regression gate for Drill explanation / prompt corrections (audit batch
 * W5a: W5-27, W5-28, W5-61, W5-62, W5-63).
 *
 * Each claim the Drill makes in these items is re-derived here from the core
 * theory engine (scales, chords, pitch classes) rather than trusted from the
 * generator, and the rendered text is checked in all three languages.
 */
import { describe, expect, it } from 'vitest';
import { buildScale } from '../../constants/scales';
import { buildChord } from '../../constants/chords';
import { getPitchClass } from '../../constants/notes';
import { stringToNote } from '../../types/music';
import type { ChordQuality } from '../../types/music';
import type { DrillItem } from '../../types/drill';
import { generateDrillBank, keySignatureOf, MAJOR_KEYS, FLAT_ORDER, SHARP_ORDER } from '../drillBank';
import { noteToString } from '../../types/music';
import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';

const bank = generateDrillBank();
const byId = new Map(bank.map((i) => [i.id, i]));
const LOCALES = { en, pt, es } as const;

/** Resolve a dotted key against a locale JSON and interpolate {{params}}. */
function render(lang: keyof typeof LOCALES, key: string, params: Record<string, unknown> = {}): string {
  let node: unknown = LOCALES[lang];
  for (const part of key.split('.')) node = (node as Record<string, unknown>)[part];
  expect(typeof node, `${lang}:${key} must be a string`).toBe('string');
  return (node as string).replace(/\{\{(\w+)\}\}/g, (_, t: string) => {
    expect(params, `${lang}:${key} needs {{${t}}}`).toHaveProperty(t);
    return String(params[t]);
  });
}

/** "F♯ minor" → { root: F#, quality: 'minor' } (display string from the bank). */
function parseChordDisplay(display: string): { root: string; quality: ChordQuality } {
  const [rootDisplay, quality] = display.split(' ');
  const root = rootDisplay.replace(/♯/g, '#').replace(/♭/g, 'b');
  return { root, quality: quality as ChordQuality };
}

function chordPitchClasses(display: string): number[] {
  const { root, quality } = parseChordDisplay(display);
  return buildChord(stringToNote(root), quality).notes.map(getPitchClass);
}

function majorScalePitchClasses(keyDisplay: string): Set<number> {
  const tonic = keyDisplay.split(' ')[0].replace(/♯/g, '#').replace(/♭/g, 'b');
  return new Set(buildScale(stringToNote(tonic), 'major').notes.map(getPitchClass));
}

function item(id: string): DrillItem {
  const found = byId.get(id);
  expect(found, `missing drill item ${id}`).toBeDefined();
  return found!;
}

// ---------------------------------------------------------------------------
// W5-27 — "Is X diatonic? → No" must not claim X is diatonic
// ---------------------------------------------------------------------------
describe('roman is-diatonic "No" explanations (W5-27)', () => {
  const noItems = bank.filter((i) => /^roman:is-diatonic:.*:no$/.test(i.id));

  it('covers the 10 "No" items', () => {
    expect(noItems.length).toBe(10);
  });

  it('uses the not-diatonic explanation, never the membership one', () => {
    for (const it_ of noItems) {
      expect(it_.whyKey, it_.id).toBe('drill.why.notDiatonic');
    }
  });

  it('the named chord really is outside the key, and the named diatonic triad really is inside', () => {
    for (const it_ of noItems) {
      const p = it_.whyParams as Record<string, string>;
      const scale = majorScalePitchClasses(p.key);
      const outside = chordPitchClasses(p.chord).filter((pc) => !scale.has(pc));
      expect(outside.length, `${p.chord} should need a note outside ${p.key}`).toBeGreaterThan(0);
      expect(chordPitchClasses(p.diatonic).every((pc) => scale.has(pc)), `${p.diatonic} in ${p.key}`).toBe(true);
      // Same root: the explanation compares the triad on the same degree.
      expect(parseChordDisplay(p.diatonic).root).toBe(parseChordDisplay(p.chord).root);
    }
  });

  it('renders in EN/PT/ES without asserting membership', () => {
    for (const it_ of noItems) {
      const params = it_.whyParams as Record<string, unknown>;
      const enText = render('en', it_.whyKey, params);
      expect(enText).toContain('is not diatonic');
      expect(enText).not.toContain('is the diatonic chord built on');
      expect(render('pt', it_.whyKey, params)).toContain('não é diatónico');
      expect(render('es', it_.whyKey, params)).toContain('no es diatónico');
    }
  });

  it('"Yes" items keep the membership explanation, and it is true', () => {
    const yesItems = bank.filter((i) => /^roman:is-diatonic:.*:yes$/.test(i.id));
    expect(yesItems.length).toBe(10);
    for (const it_ of yesItems) {
      expect(it_.whyKey).toBe('drill.why.diatonicMember');
      const p = it_.whyParams as Record<string, string>;
      const scale = majorScalePitchClasses(p.key);
      expect(chordPitchClasses(p.chord).every((pc) => scale.has(pc)), `${p.chord} in ${p.key}`).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// W5-28 — key-signature explanations must apply to the key they explain
// ---------------------------------------------------------------------------
describe('key-to-accidentals explanations (W5-28)', () => {
  it('F major (one flat) does not use the second-to-last-flat rule', () => {
    const f = item('keysig:key-to-acc:F:major');
    expect(f.whyKey).toBe('drill.why.singleFlat');
    const params = f.whyParams as Record<string, unknown>;
    const enText = render('en', f.whyKey, params);
    expect(enText).toContain('F major');
    expect(enText).toContain('B♭');
    expect(enText).not.toMatch(/second-to-last flat names the key/);
    for (const lang of ['pt', 'es'] as const) {
      expect(render(lang, f.whyKey, params)).toContain('B♭');
    }
  });

  it('every flat key using the second-to-last-flat rule really is named by that flat', () => {
    let checked = 0;
    for (const key of MAJOR_KEYS) {
      const sig = keySignatureOf(key);
      if (sig.type !== 'b') continue;
      const it_ = item(`keysig:key-to-acc:${noteToString(key)}:major`);
      if (sig.count < 2) {
        expect(it_.whyKey).toBe('drill.why.singleFlat');
        continue;
      }
      expect(it_.whyKey).toBe('drill.why.penultimateFlat');
      const penultimate = FLAT_ORDER[sig.count - 2];
      expect(noteToString(penultimate), `${noteToString(key)} major`).toBe(noteToString(key));
      checked++;
    }
    expect(checked).toBe(6); // Bb, Eb, Ab, Db, Gb, Cb
  });

  it('every sharp key’s last sharp is a half step below its tonic (the leading tone)', () => {
    let checked = 0;
    for (const key of MAJOR_KEYS) {
      const sig = keySignatureOf(key);
      if (sig.type !== '#') continue;
      const it_ = item(`keysig:key-to-acc:${noteToString(key)}:major`);
      expect(it_.whyKey).toBe('drill.why.lastSharp');
      const last = SHARP_ORDER[sig.count - 1];
      expect((getPitchClass(key) - getPitchClass(last) + 12) % 12, noteToString(key)).toBe(1);
      checked++;
    }
    expect(checked).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// W5-61 — minor "pattern" items are natural-minor facts and must say so
// ---------------------------------------------------------------------------
describe('minor pattern items name natural minor (W5-61)', () => {
  /** Triad quality on a scale degree, derived from the core natural-minor scale. */
  function naturalMinorTriadQuality(degree: number): string {
    const pcs = buildScale(stringToNote('A'), 'natural_minor').notes.map(getPitchClass);
    const r = pcs[degree - 1];
    const third = (pcs[(degree + 1) % 7] - r + 12) % 12;
    const fifth = (pcs[(degree + 3) % 7] - r + 12) % 12;
    if (third === 4 && fifth === 7) return 'major';
    if (third === 3 && fifth === 7) return 'minor';
    if (third === 3 && fifth === 6) return 'diminished';
    if (third === 4 && fifth === 8) return 'augmented';
    throw new Error(`unexpected triad on degree ${degree}`);
  }

  for (let n = 1; n <= 7; n++) {
    it(`degree ${n}: prompt says natural minor and the answer matches the natural-minor triad`, () => {
      const it_ = item(`roman:pattern:minor:${n}`);
      expect(it_.promptKey).toBe('drill.prompts.patternNaturalMinor');
      expect(it_.whyKey).toBe('drill.why.romanPatternNaturalMinor');
      expect(render('en', it_.promptKey, it_.promptParams)).toContain('natural minor');
      expect(render('pt', it_.promptKey, it_.promptParams)).toContain('menor natural');
      expect(render('es', it_.promptKey, it_.promptParams)).toContain('menor natural');
      const why = render('en', it_.whyKey, it_.whyParams as Record<string, unknown>);
      expect(why).not.toContain('never changes');
      const correct = (it_.answer as { kind: 'choice'; correct: string }).correct;
      expect(correct.split(' ')[0]).toBe(naturalMinorTriadQuality(n));
    });
  }

  it('major pattern items still state the (fixed) major-scale pattern', () => {
    expect(item('roman:pattern:major:5').promptKey).toBe('drill.prompts.pattern');
  });
});

// ---------------------------------------------------------------------------
// W5-62 — V → I is a PAC only in root position with the tonic on top
// ---------------------------------------------------------------------------
describe('V → I cadence item states the PAC conditions (W5-62)', () => {
  it('prompt and explanation carry the root-position / tonic-on-top qualifier', () => {
    const it_ = item('function:cadence:V-I');
    expect((it_.answer as { kind: 'choice'; correct: string }).correct).toBe('Perfect authentic cadence');
    expect(it_.promptKey).toBe('drill.prompts.cadenceRootPosition');
    const prompt = render('en', it_.promptKey, it_.promptParams);
    expect(prompt).toContain('root position');
    expect(prompt).toMatch(/tonic/);
    expect(render('pt', it_.promptKey, it_.promptParams)).toContain('estado fundamental');
    expect(render('es', it_.promptKey, it_.promptParams)).toContain('estado fundamental');
    expect(render('en', it_.whyKey, it_.whyParams as Record<string, unknown>)).toContain('imperfect authentic cadence');
  });

  it('the other cadence items keep the plain prompt', () => {
    for (const pair of ['IV-I', 'ii-V', 'I-V', 'V-vi']) {
      expect(item(`function:cadence:${pair}`).promptKey).toBe('drill.prompts.cadence');
    }
  });
});

// ---------------------------------------------------------------------------
// W5-63 — relative-key prompts name the mode of the given key
// ---------------------------------------------------------------------------
describe('relative-key prompts name the mode (W5-63)', () => {
  it('"relative major of A minor" / "relative minor of C major"', () => {
    // every relative-key prompt names the given key together with its mode
    for (const it_ of bank.filter((i) => i.id.startsWith('keysig:rel-'))) {
      const key = String(it_.promptParams.key);
      const minorGiven = it_.id.startsWith('keysig:rel-major');
      const mode = { en: minorGiven ? 'minor' : 'major', pt: minorGiven ? 'menor' : 'maior', es: minorGiven ? 'menor' : 'mayor' };
      for (const lang of ['en', 'pt', 'es'] as const) {
        expect(render(lang, it_.promptKey, it_.promptParams), `${lang} ${it_.id}`).toContain(`${key} ${mode[lang]}`);
      }
    }
  });

  it('every relative-key answer is a minor third away and shares the key signature', () => {
    for (const it_ of bank.filter((i) => i.id.startsWith('keysig:rel-'))) {
      const given = String(it_.promptParams.key).replace(/♯/g, '#').replace(/♭/g, 'b');
      const answer = (it_.answer as { kind: 'choice'; correct: string }).correct;
      const ans = answer.split(' ')[0].replace(/♯/g, '#').replace(/♭/g, 'b');
      const majorRoot = it_.id.startsWith('keysig:rel-major') ? ans : given;
      const minorRoot = it_.id.startsWith('keysig:rel-major') ? given : ans;
      // relative minor = 3 semitones below the relative major
      expect((getPitchClass(stringToNote(majorRoot)) - getPitchClass(stringToNote(minorRoot)) + 12) % 12, it_.id).toBe(3);
      const majorPcs = new Set(buildScale(stringToNote(majorRoot), 'major').notes.map(getPitchClass));
      const minorPcs = buildScale(stringToNote(minorRoot), 'natural_minor').notes.map(getPitchClass);
      expect(minorPcs.every((pc) => majorPcs.has(pc)), it_.id).toBe(true);
    }
  });
});
