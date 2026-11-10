/**
 * "Follow my lessons" (wave 2) — the switch and what it shows in its place
 * of the topic chips: what the lessons have unlocked, and what comes next.
 * Used by DrillSettings, DrillIntro and (captions only) MasteryMap.
 */
import { useTranslation } from 'react-i18next';
import type { DrillFamily } from '../../core/types/drill';
import type { DrillUnlock } from '../../data/drillUnlocks';
import { partLabel, useLessonTitle } from './followText';
import { ChoiceChip } from '../ui/ChoiceChip';
import { Button } from '../ui/Button';

/** What the view knows about the lessons while the switch is on. */
export interface FollowInfo {
  unlock: DrillUnlock;
  /** Families with something open (whole ones flagged). */
  open: { family: DrillFamily; whole: boolean }[];
  /** The next lesson that opens something, and what; null = nothing left. */
  next: { moduleId: string; families: DrillFamily[] } | null;
  /** The lesson that opens a family the learner has nothing of yet. */
  lessonOpening: (family: DrillFamily) => string;
  /** Open a lesson in Learn. */
  onOpenLesson: (moduleId: string) => void;
}

/**
 * The switch itself: a toggle chip (the Drill settings' chip style, D-28),
 * with one line under it (left out where the screen already says it).
 */
export function FollowSwitch({ on, onToggle, hint = true }: { on: boolean; onToggle: () => void; hint?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <ChoiceChip
        pressed={on}
        onClick={onToggle}
        aria-describedby={hint ? 'drill-follow-hint' : undefined}
        data-testid="drill-follow-switch"
      >
        {t('drillFollow.switch')}
      </ChoiceChip>
      {hint && (
        <p id="drill-follow-hint" className="text-caption" style={{ color: 'var(--text-muted)' }}>
          {t('drillFollow.switchHint')}
        </p>
      )}
    </div>
  );
}

/** What is unlocked and what comes next, with "Choose topics myself". */
export function FollowSummary({ info, onChooseMyself }: { info: FollowInfo; onChooseMyself: () => void }) {
  const { t } = useTranslation();
  const title = useLessonTitle();
  const topics = (families: DrillFamily[]) => families.map((f) => t(`drill.families.${f}`)).join(', ');
  const nextTitle = info.next ? title(info.next.moduleId) : null;

  return (
    <section className="flex flex-col gap-2" data-testid="drill-follow-summary">
      <p className="type-label">{t('drillFollow.unlockedHeading')}</p>
      {info.open.length === 0 ? (
        <p className="text-ui" style={{ color: 'var(--text-muted)' }}>{t('drillFollow.nothingYet')}</p>
      ) : (
        <ul className="flex flex-col gap-1 text-ui" style={{ color: 'var(--text)' }}>
          {info.open.map(({ family, whole }) => (
            <li key={family} data-family={family}>
              {t(`drill.families.${family}`)}
              {!whole && (
                <span style={{ color: 'var(--text-muted)' }}>
                  {' · '}
                  {t('drillFollow.soFar', { list: partLabel(info.unlock.rows.filter((r) => r.family === family), t) })}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="text-ui" style={{ color: 'var(--text-muted)' }} data-testid="drill-follow-next">
        {info.next
          ? nextTitle
            ? t('drillFollow.next', { topics: topics(info.next.families), lesson: nextTitle })
            : t('drillFollow.nextLater', { topics: topics(info.next.families) })
          : t('drillFollow.allOpen')}
      </p>
      <Button variant="link" className="self-start -ml-1.5" onClick={onChooseMyself}>
        {t('drillFollow.chooseMyself')}
      </Button>
    </section>
  );
}

/** Mastery-map caption for a family while following: locked → the lesson that opens it; part-open → what is. */
export function FollowCaption({ info, family }: { info: FollowInfo; family: DrillFamily }) {
  const { t } = useTranslation();
  const title = useLessonTitle();
  const open = info.open.find((o) => o.family === family);
  if (open?.whole) return null;
  let text: string;
  if (open) {
    text = t('drillFollow.soFar', { list: partLabel(info.unlock.rows.filter((r) => r.family === family), t) });
  } else {
    const lesson = title(info.lessonOpening(family));
    text = lesson ? t('drillFollow.opensWith', { lesson }) : t('drillFollow.opensLater');
  }
  return (
    <p className="text-caption" style={{ color: 'var(--text-muted)' }} data-follow-caption={open ? 'part' : 'locked'}>
      {text}
    </p>
  );
}
