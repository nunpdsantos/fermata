import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlossaryUi } from './glossaryUi.ts';
import type { TermId } from './termIds.ts';
import { visibleTermIds } from './visibleTerms.ts';
import { Button } from '../components/ui/Button.tsx';

/**
 * A word the learner can tap for its meaning (wave 1, brief C): a plain
 * label (a section label, "V · dominant", the key summary, the circle's
 * facts) becomes a button with a discreet dotted underline. A word that sits
 * INSIDE another control (a strip column, a chord card, a chip) is never a
 * button of its own — it carries `data-term` (see `termAttr`) and "Words on
 * this screen" explains it.
 *
 * A screen reader hears the word as a button that opens a dialog; the
 * explanation is that dialog's content (GlossaryHost).
 */
export function Term({ id, also, children, className, testId }: {
  id: TermId;
  /** More words in the same label, explained after the first. */
  also?: TermId[];
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      className={className ? `term ${className}` : 'term'}
      data-term={also?.length ? [id, ...also].join(' ') : id}
      data-testid={testId}
      aria-haspopup="dialog"
      onClick={(e) => useGlossaryUi.getState().openTerm(id, e.currentTarget, also)}
    >
      {children}
    </button>
  );
}

/** "Words on this screen": one visible control that lists and explains every marked word shown. */
export function WordsButton({ className, inline = false }: {
  className?: string;
  /** A phone: a link-like control at the end of the summary line, whose
   *  full-height tap box does not make the line taller. */
  inline?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Button
      variant={inline ? 'link' : 'quiet'}
      className={['words-button', inline && 'words-inline', className].filter(Boolean).join(' ')}
      data-testid="words-open"
      aria-haspopup="dialog"
      aria-label={t('glossary.ui.wordsLabel')}
      // Inside a modal sheet (the practice sheet) only that sheet's words count.
      onClick={(e) => useGlossaryUi.getState().openWords(visibleTermIds(e.currentTarget.closest('[role="dialog"]') ?? document), e.currentTarget)}
      startIcon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.4-2.7 4.1" />
          <circle cx="12" cy="17.6" r="0.6" fill="currentColor" />
        </svg>
      }
    >
      {t('glossary.ui.words')}
    </Button>
  );
}
