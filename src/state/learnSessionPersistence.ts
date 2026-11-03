/** Shared with the startup check; keep this module free of store/content imports. */
export const LEARN_SESSION_KEY = 'fermata-learn-session-v1';
export const LEARN_SESSION_VERSION = 1;
/** A saved lesson position or check older than this is not restored. */
export const LEARN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export const isFresh = (at: number, now = Date.now()) => now - at >= 0 && now - at < LEARN_SESSION_TTL_MS;
