/**
 * The Google Forms Fermatina links to, in one module that imports NOTHING
 * (no store, no i18n, no toast), so three places read the same addresses
 * and ids:
 *  - the app's "⋯" → "Feedback or a problem" and a lesson's foot link
 *    (services/reportProblem.ts, which re-exports REPORT_FORMS);
 *  - the foot of every public page (src/site/render.ts), which may not import
 *    a store (src/site/__tests__/content.test.ts reads its imports);
 *  - the tester's sheet at /test/ (src/site/testSheet/).
 * The forms live in the owner's Google account. Nothing reaches one except
 * through the person's own tap: a link (or `window.open`) opens Google's page
 * with some boxes filled in, and only Google's own button on that page sends.
 */

export type ReportLanguage = 'en' | 'pt' | 'es';

export interface ReportForm {
  /** The form's public address (`…/viewform`). */
  url: string;
  /** The entry id of its "Details added by Fermatina" box (pre-filled through `entry.<id>`). */
  detailsEntry: string;
}

/**
 * Feedback or a problem: one form per language (2026-11-12; widened from
 * "a problem" to "feedback or a problem" on 2026-11-14 — titles and
 * questions on Google's side only: addresses and entry ids unchanged).
 */
export const REPORT_FORMS: Readonly<Record<ReportLanguage, ReportForm>> = {
  en: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfI4qQGg8oRbptK9oy4zASrremaS4T2n7mDRyeYVppSTpZyUw/viewform', detailsEntry: '1697729701' },
  pt: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSf2rxSG77Ob4ATDFYbblTLabkLJtVpIIPYnLGXvBH_ROtFMyQ/viewform', detailsEntry: '202781657' },
  es: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfMzJEA18XRIx3wQxFD-PKVvY7NLbPwI-XkmK4g-RceatMaUA/viewform', detailsEntry: '1963274376' },
};

/**
 * The test sheet's answers (2026-11-14): ONE form for the three languages.
 * "Test sheet" (short text) gets `<sheet id> · <lang> · <date>`; "Answers"
 * (paragraph, required) the answers' text, line breaks as `%0A` (they arrive
 * as line breaks: checked by the seat); "Anything to add?" (paragraph) is
 * left for the tester to fill in on Google's page.
 */
export const TEST_FORM = {
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSfikfucnesRqOi087tAkq1vE5l-lXVY4yNsL4zexq3XXTW6iw/viewform',
  sheetEntry: '405030784',
  answersEntry: '602393800',
  /** Not pre-filled: the tester's own box on Google's page. */
  anythingElseEntry: '533014578',
} as const;

/**
 * The longest pre-filled test-form address the sheet will open, in bytes,
 * the WHOLE address after encoding (an accented letter is 6 bytes, a space
 * or a line break 3). Measured by the seat on 2026-11-14: 7,292 and 8,052
 * bytes loaded; 9,040 bytes got HTTP 400 from Google. 7,000 keeps a margin
 * below what was seen to work.
 */
export const TEST_FORM_URL_BUDGET = 7000;

/** Every address a public page or the sheet may link to on another host: the four forms, nothing else. */
export const FORM_ADDRESSES: readonly string[] = [...Object.values(REPORT_FORMS).map((f) => f.url), TEST_FORM.url];
