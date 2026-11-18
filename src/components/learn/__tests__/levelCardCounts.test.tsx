/**
 * Audit 2026-11-18, Q7: the Level 1 card said "4 units · 10 modules" — it
 * counted the optional unit (Guitar Notation, 3 modules, outside progress) as
 * a unit but left its modules out. Every level card now counts ONE way: the
 * required units and the required modules (what the progress bar under it
 * counts), and names an optional unit as optional, apart.
 *
 *  - the hand-kept metadata (eager, for the cards) equals the curriculum data
 *    for all nine levels: required units, required modules, optional units
 *    (a starting track is not part of its level's page and counts nowhere);
 *  - the card, in EN / PT / ES, says what the data says.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { LevelCard } from '../LevelCard';
import { LEVEL_METADATA, loadLevel } from '../../../data/curriculumLoader';
import { translateLevelMetadata } from '../../../i18n/content/levelMetaResolver';
import { useAppStore } from '../../../state/store';
import i18n from '../../../i18n';

afterEach(async () => {
  cleanup();
  useAppStore.setState({ language: 'en' });
  await i18n.changeLanguage('en');
});

describe('the level cards count the way the levels are built', () => {
  it('metadata = data for every level: required units, required modules, optional units', async () => {
    const rows: string[] = [];
    for (const meta of LEVEL_METADATA) {
      const level = (await loadLevel(meta.id))!;
      const listed = level.units.filter((u) => !u.track);
      const required = listed.filter((u) => !u.optional);
      const optional = listed.filter((u) => u.optional);
      rows.push(`${meta.id} ${meta.unitCount}/${required.length} ${meta.moduleCount}/${required.reduce((n, u) => n + u.modules.length, 0)} ${meta.optionalUnitCount ?? 0}/${optional.length}`);
    }
    // Each row: id, card units / data units, card modules / data modules, card optional units / data optional units.
    expect(rows).toEqual([
      'l1 3/3 10/10 1/1',
      'l2 4/4 12/12 0/0',
      'l3 3/3 13/13 0/0',
      'l4 3/3 15/15 0/0',
      'l5 3/3 14/14 0/0',
      'l6 3/3 12/12 0/0',
      'l7 3/3 16/16 0/0',
      'l8 3/3 11/11 0/0',
      'l9 3/3 15/15 0/0',
    ]);
  });

  const WANT = {
    en: { l1: ['3 units · 10 modules', '+ 1 optional unit'], l2: ['4 units · 12 modules', null] },
    pt: { l1: ['3 unidades · 10 módulos', '+ 1 unidade opcional'], l2: ['4 unidades · 12 módulos', null] },
    es: { l1: ['3 unidades · 10 módulos', '+ 1 unidad opcional'], l2: ['4 unidades · 12 módulos', null] },
  } as const;

  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: Level 1 says 3 units · 10 modules and names its optional unit apart; Level 2 has no optional line`, async () => {
      useAppStore.setState({ language: lang });
      await i18n.changeLanguage(lang);
      for (const id of ['l1', 'l2'] as const) {
        const meta = translateLevelMetadata(LEVEL_METADATA, lang).find((m) => m.id === id)!;
        const { unmount } = render(
          <LazyMotion features={domAnimation}>
            <LevelCard level={meta} state="available" completedModuleCount={0} index={0} onClick={() => {}} />
          </LazyMotion>,
        );
        const [counts, optional] = WANT[lang][id];
        const stats = screen.getByTestId('level-card-counts');
        expect(stats.textContent).toBe(optional ? `${counts} ${optional}` : counts);
        // The bar under it counts the same modules.
        expect(screen.getByText(`0/${meta.moduleCount}`)).toBeTruthy();
        if (optional) expect(screen.getByTestId('level-card-optional').textContent).toBe(optional);
        else expect(screen.queryByTestId('level-card-optional')).toBeNull();
        unmount();
      }
    });
  }
});
