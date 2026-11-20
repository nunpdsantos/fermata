/**
 * DrillIntro — what Drill is, shown once before a learner's first session
 * (brief 2026-11-09). Drill used to open straight on "1 of 4 · Scale degree 1
 * is called…?" with no word on what it was.
 *
 * Shown only while the drill store's `introDone` is false (no drill history);
 * any session starting sets it, so it never comes back. The topics, new facts
 * and session length are read from the learner's settings, so the text stays
 * true after a visit to the settings screen.
 *
 * Wave 2, "Follow my lessons": the switch is shown here too. While it is in
 * force the topics are replaced by what the lessons have unlocked and what
 * comes next; with nothing unlocked yet the intro says so, names the lesson
 * that opens the first questions (a link into Learn) and offers no Start —
 * no empty session can begin. Also shown, in that form, to a learner with
 * Drill history whose lessons and saved facts leave nothing to ask.
 *
 * Audit 2 (19 November 2026): the topics listed are the ones in force (P4:
 * guitar reading only on the guitar until chosen), and nothing to ask for
 * any other reason (P6: every topic off; no new facts and none met) is the
 * same rule: the intro says why, offers the settings where it can be put
 * right, and has no Start — never a session of nothing.
 */
import { useTranslation } from 'react-i18next';
import { DRILL_FAMILIES, type DrillFamily } from '../../core/types/drill';
import type { DrillSettings } from '../../state/drillStore';
import { Button } from '../ui/Button';
import { FollowSummary, FollowSwitch, type FollowInfo } from './FollowLessons';
import { useFollowFocus } from './useFollowFocus';
import { useLessonTitle } from './followText';
// The lines saying why there is nothing to ask load with the Drill (P6).
import '../../i18n/drillNothing';

/**
 * Why there is nothing to ask (services/drillSession.ts sessionHasNothing):
 * following, nothing the lessons open yet; every topic off; or no new facts
 * per session and no fact met yet among those on offer.
 */
export type NothingReason = 'lessons' | 'topics' | 'newFacts';

interface DrillIntroProps {
  settings: DrillSettings;
  /** The topics in force (reading's derived where it was never set). Absent = as saved. */
  families?: Record<DrillFamily, boolean>;
  onStart: () => void;
  onOpenSettings: () => void;
  /** The follow switch's value in force. Absent = the switch is not shown (the intro as before). */
  follow?: boolean;
  /** What the lessons open (needed while following). */
  followInfo?: FollowInfo | null;
  /** Nothing to ask, and why: no Start. Following with nothing open: the lesson that opens the first questions instead. */
  nothing?: NothingReason | null;
  onSetFollow?: (on: boolean) => void;
}

export function DrillIntro({
  settings, families, onStart, onOpenSettings, follow, followInfo, nothing = null, onSetFollow,
}: DrillIntroProps) {
  const { t } = useTranslation();
  const lessonTitle = useLessonTitle();
  const following = follow === true && followInfo != null;
  const empty = following && nothing === 'lessons';
  // Nothing to ask for a reason the settings put right (P6).
  const blocked = nothing === 'topics' || nothing === 'newFacts';
  const firstLesson = followInfo?.next?.moduleId ?? null;
  const firstTitle = firstLesson ? lessonTitle(firstLesson) : null;
  const shown = families ?? settings.families;
  const topics = DRILL_FAMILIES.filter((family) => shown[family as keyof typeof shown]);
  const nothingLine = blocked && (
    <p className="text-body" style={{ color: 'var(--text)' }} data-testid="drill-nothing">
      {t(nothing === 'topics' ? 'drillNothing.topics' : 'drillNothing.newFacts')}
    </p>
  );
  // At most 2 asks per new fact (fewer when a second look has no place), so
  // below the length this bound proves the first session is shorter.
  const firstIsShorter = settings.newPerSession > 0 && 2 * settings.newPerSession < settings.length;
  // The switch swaps this screen's middle: keep keyboard focus on it.
  const { focusRef, markFocus } = useFollowFocus<HTMLElement>(follow);
  const setFollow = (on: boolean) => {
    markFocus();
    onSetFollow?.(on);
  };

  return (
    <section ref={focusRef} className="drill-run gap-5" aria-labelledby="drill-intro-title" data-testid="drill-intro">
      <div className="flex flex-col gap-3">
        <h2 id="drill-intro-title" className="learn-serif text-display" style={{ color: 'var(--text)' }}>
          {t('drill.intro.title')}
        </h2>
        <p className="text-body" style={{ color: 'var(--text)' }}>
          {t('drill.intro.lead')}
        </p>
      </div>

      {following ? (
        <>
          <p className="text-body" style={{ color: 'var(--text)' }} data-testid="drill-follow-lead">
            {t('drillFollow.follows')}
          </p>
          {empty ? (
            <p className="text-body" style={{ color: 'var(--text)' }} data-testid="drill-follow-empty">
              {firstTitle
                ? t('drillFollow.firstQuestions', { lesson: firstTitle })
                : t('drillFollow.firstQuestionsLater')}
            </p>
          ) : (
            <>
              {/* The lead above already says what it does: no second line. */}
              {onSetFollow && <FollowSwitch on hint={false} onToggle={() => setFollow(false)} />}
              {nothingLine}
              <FollowSummary info={followInfo} onChooseMyself={() => setFollow(false)} />
            </>
          )}
        </>
      ) : (
      <div className="flex flex-col gap-1.5">
        <p className="type-label">{t('drill.settings.families')}</p>
        {nothingLine || (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-ui" style={{ color: 'var(--text-muted)' }}>
            {topics.map((family) => (
              <li key={family}>{t(`drill.families.${family}`)}</li>
            ))}
          </ul>
        )}
        {/* Nothing to ask: the settings are the thumb zone's main action instead. */}
        {!blocked && (
          <Button variant="link" className="self-start -ml-1.5" onClick={onOpenSettings}>
            {t('drill.intro.settings')} <span aria-hidden="true">→</span>
          </Button>
        )}
        {follow !== undefined && onSetFollow && (
          <div className="mt-2">
            <FollowSwitch on={follow} onToggle={() => setFollow(!follow)} />
          </div>
        )}
      </div>
      )}

      {!empty && !blocked && (
      <ul className="flex flex-col gap-2 text-body list-disc pl-5" style={{ color: 'var(--text)' }}>
        {/* "Your first one is shorter: just the new facts" only when it is: a
            first session is the new facts, each asked twice (sessionCounter),
            so it is shorter only while 2 × new facts stays under the length. */}
        <li>{t(firstIsShorter ? 'drill.intro.length' : 'drill.intro.lengthOnly', { length: settings.length })}</li>
        {settings.newPerSession > 0 && <li>{t('drill.intro.newFacts', { count: settings.newPerSession })}</li>}
        <li>{t('drill.intro.comeBack')}</li>
      </ul>
      )}

      <div className="drill-thumb">
        {empty ? (
          <div className="flex flex-col gap-2">
            {firstLesson && followInfo && (
              <Button variant="primary" size="lg" block onClick={() => followInfo.onOpenLesson(firstLesson)}>
                {t('drillFollow.openLesson')}
              </Button>
            )}
            <Button variant="secondary" size="lg" block onClick={() => setFollow(false)}>
              {t('drillFollow.chooseMyself')}
            </Button>
          </div>
        ) : blocked ? (
          // Where it is put right: the topics, or (no new facts) the settings' stepper.
          <Button variant="primary" size="lg" block onClick={onOpenSettings}>
            {t(nothing === 'topics' ? 'drill.intro.settings' : 'drill.settings.title')}
          </Button>
        ) : (
          <Button variant="primary" size="lg" block onClick={onStart}>
            {t('drill.intro.start')}
          </Button>
        )}
      </div>
    </section>
  );
}
