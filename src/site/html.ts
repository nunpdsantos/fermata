/**
 * HTML for the search pages: escaping, the lesson text's one markup, and the
 * JSON-LD data block. Pure, no DOM.
 */
import { findQuotedQueries } from '../utils/theoryQuery';

const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Text or an attribute value, escaped (& < > " '). */
export function esc(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ENTITIES[c]);
}

/**
 * A concept's explanation, as the app renders it (ModuleView: the string as
 * the text of one paragraph, React escaping it). No markup of its own.
 */
export function proseHtml(text: string): string {
  return esc(text);
}

/**
 * A practice task's instruction. The app's one markup in lesson text is the
 * QUOTED QUERY ("Type 'C major scale'", «Dó maior», “G7”): ModuleView's
 * `renderTaskInstruction` turns every quoted token that names something the
 * app can show (`findQuotedQueries`) into a button reading ‘query’. Here it
 * is the same words in the same quotes, as text: the raw token (its own
 * quote marks) never reaches the page. Quoted prose that is not a query
 * ("the 'and' between beats") stays as written, as in the app.
 */
export function instructionHtml(text: string): string {
  let out = '';
  let last = 0;
  for (const { index, length, query } of findQuotedQueries(text)) {
    out += esc(text.slice(last, index));
    out += `<span class="query">‘${esc(query)}’</span>`;
    last = index + length;
  }
  return out + esc(text.slice(last));
}

/** The raw quoted-query tokens of a task ('C major scale' with its own quotes): none may appear on a page. */
export function rawQueryTokens(text: string): string[] {
  return findQuotedQueries(text).map(({ index, length }) => text.slice(index, index + length));
}

/**
 * A JSON-LD data block. `<`, `>`, `&` and the two JavaScript line separators
 * are written as \u escapes, so no text in it can close the element or be
 * read as markup; JSON.parse reads it back unchanged.
 */
export function jsonLdHtml(data: unknown): string {
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `<script type="application/ld+json">${json}</script>`;
}
