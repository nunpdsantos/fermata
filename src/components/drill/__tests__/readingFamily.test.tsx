import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { generateDrillBank, genRead } from '../../../core/utils/drillBank';
import { DRILL_FAMILIES } from '../../../core/types/drill';
import { DEFAULT_SETTINGS } from '../../../state/drillStore';
import { DrillSettings } from '../DrillSettings';
import { MasteryMap } from '../MasteryMap';
import { computeMasteryByFamily, computeReadingMastery } from '../masterySelectors';
import { eligibleSprintItems, sprintFamiliesKey } from '../sprintSelectors';
import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';

const bank = generateDrillBank({ includeRead: true });
afterEach(cleanup);

describe('reading family wiring', () => {
  it('adds only the reading ladder; the entire existing bank is unchanged', () => {
    expect(DRILL_FAMILIES).toContain('read');
    expect(bank.filter((i) => i.family !== 'read')).toEqual(generateDrillBank());
    expect(bank.filter((i) => i.family === 'read')).toEqual(genRead());
    expect(DEFAULT_SETTINGS.families.read).toBe(true);
  });

  it('counts new cards per stage, with every reading item in exactly one rung', () => {
    const stages = computeReadingMastery(bank, {});
    const reading = computeMasteryByFamily(bank, {}).read;
    expect(stages).toHaveLength(5);
    expect(stages.every((s) => s.total > 0 && s.newCount === s.total && s.byHeart === 0)).toBe(true);
    expect(stages.reduce((n, s) => n + s.total, 0)).toBe(reading.total);
  });

  it('settings toggles the family and mastery shows all five stages', () => {
    const onUpdate = vi.fn();
    const { unmount } = render(<DrillSettings settings={DEFAULT_SETTINGS} onUpdate={onUpdate} onBack={() => {}} onMasteryMap={() => {}} onResetProgress={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: en.drill.families.read }));
    expect(onUpdate).toHaveBeenCalledWith({ families: { ...DEFAULT_SETTINGS.families, read: false } });
    unmount();
    const onToggleFamily = vi.fn();
    render(<MasteryMap bank={bank} items={{}} families={DEFAULT_SETTINGS.families} now={0} onToggleFamily={onToggleFamily} onBack={() => {}} />);
    for (const name of Object.values(en.drill.reading.stages)) expect(screen.getByText(name)).toBeDefined();
    expect(document.querySelectorAll('[data-reading-stage]')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: en.drill.families.read }));
    expect(onToggleFamily).toHaveBeenCalledWith('read', false);
  });

  it('keeps reading out of Sprint and preserves existing personal-best keys', () => {
    const q = genRead()[0];
    const state = { card: { due: 0, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 1, reps: 3, lapses: 0, state: 2, learning_steps: 0 }, history: [], tier: 'byHeart' as const, introCorrectCount: 2 };
    expect(eligibleSprintItems([q], { [q.id]: state }, DEFAULT_SETTINGS.families)).toEqual([]);
    expect(sprintFamiliesKey(DEFAULT_SETTINGS.families)).toBe(sprintFamiliesKey({ ...DEFAULT_SETTINGS.families, read: false }));
    expect(sprintFamiliesKey(DEFAULT_SETTINGS.families)).not.toContain('read');
  });
});

function leaves(value: object, prefix = ''): Record<string, string> {
  return Object.fromEntries(Object.entries(value).flatMap(([key, v]) => typeof v === 'string' ? [[`${prefix}${key}`, v]] : Object.entries(leaves(v, `${prefix}${key}.`))));
}

describe('reading EN/PT/ES parity', () => {
  const tokens = (s: string) => (s.match(/{{\w+}}/g) ?? []).sort();
  for (const [lang, locale] of Object.entries({ pt, es })) {
    it(`${lang} has every reading key and matching placeholders, including generated prompts and why`, () => {
      const source = leaves(en.drill.reading);
      const translated = leaves(locale.drill.reading);
      expect(Object.keys(translated).sort()).toEqual(Object.keys(source).sort());
      for (const key of Object.keys(source)) {
        expect(translated[key].length).toBeGreaterThan(0);
        expect(tokens(translated[key]), key).toEqual(tokens(source[key]));
      }
      expect(locale.drill.families.read).not.toBe(en.drill.families.read);
      for (const key of ['readAnywhere', 'readOpenPosition', 'readInPosition'] as const) {
        expect(tokens(locale.drill.prompts[key])).toEqual(tokens(en.drill.prompts[key]));
      }
      expect(tokens(locale.drill.why.readPlaces)).toEqual(tokens(en.drill.why.readPlaces));
    });
  }
});
