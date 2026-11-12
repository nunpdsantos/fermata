import { APP_RELEASE, BUILD_DATE } from '../buildInfo';
import { toast } from '../state/toastStore';

/**
 * "Report a problem" (2026-11-12): one Google Form per language, opened in a
 * new tab by the learner's tap ("⋯" → Report a problem, and the link at the
 * foot of a lesson). The form's fourth box ("Details added by Fermata") is
 * filled in through the link with one line saying where the learner was.
 * Nothing is sent before the tap: no request, no preconnect; the link is
 * built on the device and the browser opens it only when tapped. Offline,
 * a one-line notice says the form needs a connection and nothing opens.
 */

export type ReportLanguage = 'en' | 'pt' | 'es';

export interface ReportForm {
  /** The form's public address (`…/viewform`). */
  url: string;
  /** The entry id of its "details" box (pre-filled through `entry.<id>`). */
  detailsEntry: string;
}

export const REPORT_FORMS: Readonly<Record<ReportLanguage, ReportForm>> = {
  en: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfI4qQGg8oRbptK9oy4zASrremaS4T2n7mDRyeYVppSTpZyUw/viewform', detailsEntry: '1697729701' },
  pt: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSf2rxSG77Ob4ATDFYbblTLabkLJtVpIIPYnLGXvBH_ROtFMyQ/viewform', detailsEntry: '202781657' },
  es: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfMzJEA18XRIx3wQxFD-PKVvY7NLbPwI-XkmK4g-RceatMaUA/viewform', detailsEntry: '1963274376' },
};

/** A lesson's title is cut to this many characters in the details. */
export const REPORT_TITLE_MAX = 60;
/** The whole details line is cut to this many characters (the browser's user agent goes first). */
export const REPORT_DETAILS_MAX = 600;
const SEPARATOR = ' · ';

export interface ReportContext {
  /** The view, by its English id. */
  view: 'explore' | 'learn' | 'drill';
  /** The app's language code (i18next's `language`). */
  language: string;
  /** The lesson open at the tap, when the report comes from its foot. */
  module?: { id: string; title: string };
}

/** What the device says about itself (defaults: this build and this window). */
export interface ReportEnvironment {
  release: number;
  buildDate: string | null;
  width: number;
  height: number;
  userAgent: string;
}

function currentEnvironment(): ReportEnvironment {
  return {
    release: APP_RELEASE.release,
    buildDate: BUILD_DATE,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
}

/** The first `max` characters (by code point, so an accent or emoji is never split). */
function cut(text: string, max: number): string {
  const chars = Array.from(text);
  return chars.length > max ? chars.slice(0, max).join('') : text;
}

/**
 * The one line put in the form's details box, in this order, joined by " · ":
 * view · (lesson id · lesson title, cut to 60) · language · release n (build
 * date, or "dev") · width×height · user agent. Capped at 600 characters by
 * cutting the user agent. Nothing else: no address, no saved progress, no
 * settings.
 */
export function reportDetails(context: ReportContext, env: ReportEnvironment = currentEnvironment()): string {
  const head = [
    context.view,
    ...(context.module ? [context.module.id, cut(context.module.title, REPORT_TITLE_MAX)] : []),
    context.language,
    `release ${env.release} (${env.buildDate ?? 'dev'})`,
    `${env.width}×${env.height}`,
  ].join(SEPARATOR);
  const room = REPORT_DETAILS_MAX - Array.from(head).length - SEPARATOR.length;
  if (room <= 0) return cut(head, REPORT_DETAILS_MAX);
  return `${head}${SEPARATOR}${cut(env.userAgent, room)}`;
}

/** The form for an app language: by its prefix ("pt-PT" → pt, "es-419" → es); anything else → English. */
export function reportForm(language: string): ReportForm {
  const prefix = language.toLowerCase().split(/[-_]/)[0];
  return prefix === 'pt' || prefix === 'es' ? REPORT_FORMS[prefix] : REPORT_FORMS.en;
}

/** The form's address with its details box filled in. */
export function reportUrl(language: string, details: string): string {
  const form = reportForm(language);
  return `${form.url}?usp=pp_url&entry.${form.detailsEntry}=${encodeURIComponent(details)}`;
}

/**
 * Offline: says so (the one-line notice, through the app's toast) and
 * returns true — the caller then opens nothing.
 */
export function stopIfOffline(offlineNotice: string): boolean {
  if (typeof navigator === 'undefined' || navigator.onLine !== false) return false;
  toast(offlineNotice, 'warning', 5000);
  return true;
}

/** Opens the form in a new tab, unless offline (then the notice, and nothing opens). */
export function openReportForm(url: string, offlineNotice: string): void {
  if (stopIfOffline(offlineNotice)) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}
