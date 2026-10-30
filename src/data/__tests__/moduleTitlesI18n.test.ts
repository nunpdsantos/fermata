/**
 * The PT/ES module-title files used by Cmd+K and the review queue are a
 * generated copy of the curriculum overlays. If an overlay title or subtitle
 * changes, this fails: run `npm run i18n:module-titles` to regenerate.
 */
import { describe, it, expect } from 'vitest';
import { MODULE_INDEX } from '../moduleIndex';
import { LOCALIZED_KEYWORDS, getModuleTitle, loadModuleIndex } from '../moduleIndexI18n';
import ptTitles from '../moduleTitles.pt';
import esTitles from '../moduleTitles.es';
import type { CurriculumLevelOverlay } from '../../i18n/content/types';
import pt1 from '../../i18n/content/pt/curriculumL1';
import pt2 from '../../i18n/content/pt/curriculumL2';
import pt3 from '../../i18n/content/pt/curriculumL3';
import pt4 from '../../i18n/content/pt/curriculumL4';
import pt5 from '../../i18n/content/pt/curriculumL5';
import pt6 from '../../i18n/content/pt/curriculumL6';
import pt7 from '../../i18n/content/pt/curriculumL7';
import pt8 from '../../i18n/content/pt/curriculumL8';
import pt9 from '../../i18n/content/pt/curriculumL9';
import es1 from '../../i18n/content/es/curriculumL1';
import es2 from '../../i18n/content/es/curriculumL2';
import es3 from '../../i18n/content/es/curriculumL3';
import es4 from '../../i18n/content/es/curriculumL4';
import es5 from '../../i18n/content/es/curriculumL5';
import es6 from '../../i18n/content/es/curriculumL6';
import es7 from '../../i18n/content/es/curriculumL7';
import es8 from '../../i18n/content/es/curriculumL8';
import es9 from '../../i18n/content/es/curriculumL9';

const OVERLAYS: Record<'pt' | 'es', CurriculumLevelOverlay[]> = {
  pt: [pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9],
  es: [es1, es2, es3, es4, es5, es6, es7, es8, es9],
};
const FILES = { pt: ptTitles, es: esTitles };

describe('generated PT/ES module titles match the curriculum overlays', () => {
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: one entry per module, equal to the overlay title + subtitle`, () => {
      const modules = Object.assign({}, ...OVERLAYS[lang].map((o) => o.modules)) as CurriculumLevelOverlay['modules'];
      const drift = MODULE_INDEX.filter((e) => {
        const file = FILES[lang][e.id];
        const ov = modules[e.id];
        return !file || !ov || file[0] !== ov.title || file[1] !== ov.subtitle;
      }).map((e) => e.id);
      expect(drift, `stale ${lang} titles (run npm run i18n:module-titles): ${drift.join(', ')}`).toEqual([]);
      expect(Object.keys(FILES[lang]).sort()).toEqual(MODULE_INDEX.map((e) => e.id).sort());
    });

    it(`${lang}: keyword lists only name real modules`, () => {
      const ids = new Set(MODULE_INDEX.map((e) => e.id));
      expect(Object.keys(LOCALIZED_KEYWORDS[lang]).filter((id) => !ids.has(id))).toEqual([]);
    });
  }

  it('getModuleTitle: English from the index, PT once loaded, unknown → null', async () => {
    expect(getModuleTitle('l3u11m1', 'en')).toBe(MODULE_INDEX.find((e) => e.id === 'l3u11m1')!.title);
    await loadModuleIndex('pt');
    expect(getModuleTitle('l3u11m1', 'pt')).toBe(ptTitles.l3u11m1[0]);
    expect(getModuleTitle('nope', 'pt')).toBeNull();
  });
});
