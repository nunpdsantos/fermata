import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { chordCategoryLabel } from '../chordCategoryLabel';
import { ChipGroup } from '../../ui/ChoiceChip';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';
import en from '../../../i18n/locales/en.json';

const keys = ['sixths', 'sevenths', 'ninths', 'elevenths', 'thirteenths'] as const;
describe('chord-family ordinal chips', () => {
  it.each([
    ['pt', pt, ['sextas', 'sétimas', 'nonas', 'décimas primeiras', 'décimas terceiras']],
    ['es', es, ['sextas', 'séptimas', 'novenas', 'oncenas', 'trecenas']],
    ['en', en, ['6ths', '7ths', '9ths', '11ths', '13ths']],
  ] as const)('%s renders superscript letters with complete accessible names', (lang, resource, names) => {
    render(<ChipGroup label="families" value={0} onChange={() => {}} options={keys.map((k, i) => ({ value: i, ...chordCategoryLabel(resource.chordCategory[k], lang) }))} />);
    names.forEach((name, i) => {
      const chip = screen.getByRole('radio', { name });
      expect(chip.textContent).toBe(resource.chordCategory[keys[i]]);
      if (lang === 'en') expect(chip.querySelector('sup')).toBeNull();
      else expect(chip.querySelector('sup')?.textContent).toBe('as');
    });
    cleanup();
  });
});
