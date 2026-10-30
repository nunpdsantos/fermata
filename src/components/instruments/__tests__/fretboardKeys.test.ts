/**
 * Review #6: the fretboard's i18n namespace carries no dead keys, and the
 * three locales carry the same keys. (fretboard.scalePos was left over from
 * the CAGED "Scale pos:" chips.)
 */
import { describe, it, expect } from 'vitest';
import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';
import fretboardSrc from '../Fretboard.tsx?raw';
import selectorSrc from '../FretboardPositionSelector.tsx?raw';

const SOURCES = fretboardSrc + selectorSrc;

describe('fretboard i18n keys', () => {
  it('every fretboard.* key is used by the fretboard code', () => {
    const unused = Object.keys(en.fretboard).filter((k) => !SOURCES.includes(`'fretboard.${k}'`));
    expect(unused).toEqual([]);
  });

  it('EN, PT and ES carry exactly the same fretboard keys', () => {
    const keys = Object.keys(en.fretboard).sort();
    expect(Object.keys(pt.fretboard).sort()).toEqual(keys);
    expect(Object.keys(es.fretboard).sort()).toEqual(keys);
  });
});
