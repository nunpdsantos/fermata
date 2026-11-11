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
 */
import { useTranslation } from 'react-i18next';
import { DRILL_FAMILIES } from '../../core/types/drill';
import type { DrillSettings } from '../../state/drillStore';
import { Button } from '../ui/Button';
import { FollowSummary, FollowSwitch, type FollowInfo } from './FollowLessons';
import { useLessonTitle } from './followText';

interface DrillIntroProps {
  settings: DrillSettings;
  onStart: () => void;
  onOpenSettings: () => void;
  /** The follow switch's value in force. Absent = the switch is not shown (the intro as before). */
  follow?: boolean;
  /** What the lessons open (needed while following). */
  followInfo?: FollowInfo | null;
  /** Following, and nothing to ask: no Start, the lesson that opens the first questions instead. */
  nothingToAsk?: boolean;
  onSetFollow?: (on: boolean) => void;
}

export function DrillIntro({
  settings, onStart, onOpenSettings, follow, followInfo, nothingToAsk = false, onSetFollow,
}: DrillIntroProps) {
  const { t } = useTranslation();
  const lessonTitle = useLessonTitle();
  const following = follow === true && followInfo != null;
  const empty = following && nothingToAsk;
  const firstLesson = followInfo?.next?.moduleId ?? null;
  const firstTitle = firstLesson ? lessonTitle(firstLesson) : null;
  const topics = DRILL_FAMILIES.filter((family) => settings.families[family]);
  // At most 2 asks per new fact (fewer when a second look has no place), so
  // below the length this bound proves the first session is shorter.
  const firstIsShorter = settings.newPerSession > 0 && 2 * settings.newPerSession < settings.length;

  return (
    <section className="drill-run gap-5" aria-labelledby="drill-intro-title" data-testid="drill-intro">
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
              {onSetFollow && <FollowSwitch on hint={false} onToggle={() => onSetFollow(false)} />}
              <FollowSummary info={followInfo} onChooseMyself={() => onSetFollow?.(false)} />
            </>
          )}
        </>
      ) : (
      <div className="flex flex-col gap-1.5">
        <p className="type-label">{t('drill.settings.families')}</p>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-ui" style={{ color: 'var(--text-muted)' }}>
          {topics.map((family) => (
            <li key={family}>{t(`drill.families.${family}`)}</li>
          ))}
        </ul>
        <Button variant="link" className="self-start -ml-1.5" onClick={onOpenSettings}>
          {t('drill.intro.settings')} <span aria-hidden="true">→</span>
        </Button>
        {follow !== undefined && onSetFollow && (
          <div className="mt-2">
            <FollowSwitch on={follow} onToggle={() => onSetFollow(!follow)} />
          </div>
        )}
      </div>
      )}

      {!empty && (
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
            <Button variant="secondary" size="lg" block onClick={() => onSetFollow?.(false)}>
              {t('drillFollow.chooseMyself')}
            </Button>
          </div>
        ) : (
          <Button variant="primary" size="lg" block onClick={onStart}>
            {t('drill.intro.start')}
          </Button>
        )}
      </div>
    </section>
  );
}
