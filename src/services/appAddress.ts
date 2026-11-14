/**
 * The address the app is on (2026-11-14: Fermata became Fermatina).
 *
 * One deployment serves two addresses: the old one, `fermata-music.vercel.app`,
 * and the new one, `fermatina.com`. A browser keeps what the app saves PER
 * ADDRESS, so a learner's progress on the old address does not follow them to
 * the new one: there the app says it has moved and offers the way to bring the
 * progress along (export a file there, import it here — services/movedNotice.ts,
 * components/moved/). Every other address — fermatina.com, www.fermatina.com, a
 * preview (`fermata-music-git-….vercel.app`), localhost — is not the old one
 * and never shows that notice nor reads or writes its flag.
 *
 * Eager and tiny: nothing here is fetched, and nothing asks another origin
 * for anything (the new address is only a link the learner may tap).
 */

/** The old address: the notice shows here, and only here. */
export const OLD_HOST = 'fermata-music.vercel.app';

/** The new address, as a link points at it. */
export const NEW_ORIGIN = 'https://fermatina.com';

/** The new address as a sentence writes it (each sentence that names it carries it literally). */
export const NEW_HOST_LABEL = 'fermatina.com';

/** The host this page was opened on ('' where there is no location). */
export function currentHostname(): string {
  try {
    return globalThis.location?.hostname ?? '';
  } catch {
    return '';
  }
}

/** True on the old address exactly: not on fermatina.com, www, a preview, localhost or anything else. */
export function onOldAddress(hostname: string = currentHostname()): boolean {
  return hostname === OLD_HOST;
}
