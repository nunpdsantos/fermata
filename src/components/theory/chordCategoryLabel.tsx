import type { ContentLanguage } from '../../i18n/content/types';

const ORDINAL_NAMES = {
  pt: { '6': 'sextas', '7': 'sétimas', '9': 'nonas', '11': 'décimas primeiras', '13': 'décimas terceiras' },
  es: { '6': 'sextas', '7': 'séptimas', '9': 'novenas', '11': 'oncenas', '13': 'trecenas' },
} as const;

/** PT/ES plural ordinal: the period stays on the baseline, only “as” is raised. */
export function chordCategoryLabel(text: string, lang: ContentLanguage) {
  const match = /^(6|7|9|11|13)\.as$/.exec(text);
  if (lang === 'en' || !match) return { label: text };
  const number = match[1] as keyof typeof ORDINAL_NAMES.pt;
  return {
    label: <span aria-hidden="true">{number}.<sup style={{ fontSize: 'var(--text-caption)', top: '-0.2em' }}>as</sup></span>,
    ariaLabel: ORDINAL_NAMES[lang][number],
  };
}
