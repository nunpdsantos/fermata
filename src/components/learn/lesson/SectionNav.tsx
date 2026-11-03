import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';

export interface LessonSection {
  id: string;
  label: string;
  /** Shown in the marker: a number, ♪ (tasks) or ? (the check). */
  marker: string;
  /** Read past, ticked (tasks) or passed (the check). */
  done: boolean;
}

function Marker({ section, current }: { section: LessonSection; current: boolean }) {
  const filled = current || section.done;
  return (
    <span
      aria-hidden="true"
      className="w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-caption shrink-0"
      style={
        current
          ? { backgroundColor: 'var(--accent)', color: 'var(--on-accent)', border: '1.5px solid var(--accent)' }
          : section.done
            ? { backgroundColor: 'var(--success-text)', color: 'var(--bg)', border: '1.5px solid var(--success-text)' }
            : { border: '1.5px solid var(--border)', color: 'var(--text-muted)' }
      }
    >
      {filled && !current && section.done ? '✓' : section.marker}
    </span>
  );
}

function SectionButton({ section, current, onJump, fill }: { section: LessonSection; current: boolean; onJump: (id: string) => void; fill?: boolean }) {
  const { t } = useTranslation();
  const state = current ? t('lesson.current') : section.done ? t('lesson.done') : null;
  return (
    <button
      type="button"
      onClick={() => onJump(section.id)}
      aria-current={current ? 'location' : undefined}
      aria-label={state ? `${section.label} (${state})` : section.label}
      data-section-link={section.id}
      className={`w-full flex items-center gap-2.5 min-h-[max(var(--tap),40px)] px-2.5 py-1.5 rounded-[10px] text-left text-ui transition-colors ${fill ? '' : 'hover:bg-[var(--card-hover)]'}`}
      style={current ? { backgroundColor: 'var(--card)', color: 'var(--text)', fontWeight: 600 } : { color: 'var(--text-muted)' }}
    >
      <Marker section={section} current={current} />
      <span className="min-w-0">{section.label}</span>
    </button>
  );
}

interface SectionNavProps {
  sections: LessonSection[];
  currentId: string;
  onJump: (id: string) => void;
  crumb: string;
  next?: { title: string; onOpen: () => void };
}

/**
 * The lesson's section rail (laptop, D-27): where you are (the current
 * section, ✓ for those read), and every section — the check included — one
 * tap away. It sticks while the lesson scrolls.
 */
export function SectionRail({ sections, currentId, onJump, crumb, next }: SectionNavProps) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('lesson.sections')} className="sticky top-0 pt-6 flex flex-col gap-1" data-testid="section-rail">
      <p className="text-ui mb-1.5" style={{ color: 'var(--text-muted)' }}>{crumb}</p>
      <ol className="flex flex-col gap-1">
        {sections.map((s) => (
          <li key={s.id}>
            <SectionButton section={s} current={s.id === currentId} onJump={onJump} />
          </li>
        ))}
      </ol>
      {next && (
        <button type="button" onClick={next.onOpen} className="mt-3 text-left min-h-(--tap) px-2.5 py-1 rounded-[10px] hover:bg-[var(--card-hover)]">
          <span className="block text-ui" style={{ color: 'var(--text-muted)' }}>{t('lesson.nextLesson')}</span>
          <span className="block text-ui font-semibold" style={{ color: 'var(--text)' }}>{next.title} <span aria-hidden="true">→</span></span>
        </button>
      )}
    </nav>
  );
}

/**
 * On a phone the rail folds into one sticky line: "2 / 5  Section ▾" opens
 * the section list (a sheet); "Check" stays one tap away beside it.
 */
export function SectionPicker({ sections, currentId, onJump, checkId }: SectionNavProps & { checkId?: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const index = Math.max(0, sections.findIndex((s) => s.id === currentId));
  const current = sections[index];
  const position = t('lesson.position', { current: index + 1, total: sections.length });
  return (
    <div className="sticky top-0 z-10 -mx-3 px-3 py-2 flex items-center gap-2" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border-subtle)' }} data-testid="section-picker">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t('lesson.pickerLabel', { current: index + 1, total: sections.length, title: current?.label ?? '' })}
        className="flex-1 min-w-0 flex items-center gap-2 min-h-(--tap) text-left"
      >
        <span className="shrink-0 px-2.5 py-1 rounded-full text-ui font-semibold tabular-nums" style={{ backgroundColor: 'var(--accent)', color: 'var(--on-accent)' }}>
          {position}
        </span>
        <span className="text-ui font-semibold min-w-0" style={{ color: 'var(--text)' }}>{current?.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="shrink-0" style={{ color: 'var(--text-muted)' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {checkId && currentId !== checkId && (
        <Button variant="secondary" onClick={() => onJump(checkId)}>
          {t('lesson.check')}
        </Button>
      )}
      <Sheet open={open} onClose={() => setOpen(false)} title={t('lesson.sections')} closeLabel={t('common.close')} testId="section-sheet">
        <ol className="flex flex-col gap-1 pb-2">
          {sections.map((s) => (
            <li key={s.id}>
              <SectionButton
                section={s}
                current={s.id === currentId}
                fill
                onJump={(id) => {
                  setOpen(false);
                  // After the sheet has handed focus back.
                  setTimeout(() => onJump(id), 0);
                }}
              />
            </li>
          ))}
        </ol>
      </Sheet>
    </div>
  );
}
