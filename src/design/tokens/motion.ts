export const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 500, damping: 30 };
export const SPRING_MICRO = { type: 'spring' as const, stiffness: 600, damping: 35 };
/** Chip / checkmark reveal — same stiffness as SNAPPY but less damped so
 *  it bounces once on entry. */
export const SPRING_BOUNCY = { type: 'spring' as const, stiffness: 500, damping: 25 };
/** Navigation transitions between learn-view steps (level → unit → module).
 *  Medium stiffness, high damping — no bounce, just a crisp slide. */
export const SPRING_NAV = { type: 'spring' as const, stiffness: 400, damping: 35 };
