import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrillRunner } from '../components/drill/useDrillRunner';
import { QuestionCard } from '../components/drill/QuestionCard';
import { ChoiceChips } from '../components/drill/ChoiceChips';
import { FeedbackStrip } from '../components/drill/FeedbackStrip';
import { useDrillStore } from '../state/drillStore';
import type { DrillItem } from '../core/types/drill';

const SESSION_LENGTHS = [12, 24, 40] as const;

export function DrillView() {
  const { t } = useTranslation();
  const runner = useDrillRunner();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { item, phase, result, asked, total, correctCount, sessionComplete } = runner;

  return (
    <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
      <div className="mx-auto w-full max-w-xl px-4 py-6 max-sm:py-5">
        {sessionComplete ? (
          <SessionSummary
            correct={correctCount}
            asked={asked}
            onNewSession={runner.startNewSession}
          />
        ) : item ? (
          <>
            <QuestionCard
              asked={asked}
              total={total}
              prompt={t(item.promptKey, item.promptParams)}
              onEndSession={runner.endSession}
              onOpenSettings={() => setSettingsOpen((v) => !v)}
            >
              <DrillInput
                item={item}
                phase={phase}
                onAnswer={(choice) => runner.answer({ format: 'choice', choice })}
              />
            </QuestionCard>

            {phase === 'feedback' && result && (
              <FeedbackStrip
                result={result}
                answerText={canonicalAnswer(item)}
                whyText={t(item.whyKey, item.whyParams)}
                onContinue={runner.advance}
                showContinue={!result.correct}
              />
            )}

            {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
          </>
        ) : (
          // Pre-auto-start tick: session not yet created. Brief, no flash of summary.
          <div className="h-24" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

// ─── Input router ─────────────────────────────────────────────────────────────

interface DrillInputProps {
  item: DrillItem;
  phase: 'answering' | 'feedback';
  onAnswer: (choice: string) => void;
}

function DrillInput({ item, phase, onAnswer }: DrillInputProps) {
  if (item.input.format === 'choice') {
    const correct = item.answer.kind === 'choice' ? item.answer.correct : null;
    return (
      <ChoiceChips
        choices={item.input.choices}
        disabled={phase === 'feedback'}
        selected={null}
        correctChoice={phase === 'feedback' ? correct : null}
        onSelect={onAnswer}
      />
    );
  }
  return <UnsupportedInput format={item.input.format} />;
}

/**
 * TEMPORARY placeholder for non-choice input formats. Task 9 replaces this
 * with real noteChips / accidentalSlots / rootQuality inputs. Honest and
 * visible rather than a crash. Drill settings in tests restrict families to
 * choice-only, so this never renders there.
 */
function UnsupportedInput({ format }: { format: string }) {
  const { t } = useTranslation();
  return (
    <div
      className="rounded-xl p-4 text-sm"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
        border: '1px dashed color-mix(in srgb, var(--border) 60%, transparent)',
        color: 'var(--text-muted)',
      }}
      data-format={format}
    >
      {t('drill.unsupported')}
    </div>
  );
}

// ─── Session summary (minimal — full screen is Task 11) ───────────────────────

interface SessionSummaryProps {
  correct: number;
  asked: number;
  onNewSession: () => void;
}

function SessionSummary({ correct, asked, onNewSession }: SessionSummaryProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center gap-5 py-10">
      <p className="text-2xl font-medium tabular-nums" style={{ color: 'var(--text)' }}>
        {t('drill.summary.score', { correct, asked })}
      </p>
      <button
        type="button"
        onClick={onNewSession}
        className="min-h-[44px] px-6 rounded-lg text-sm font-medium transition-colors"
        style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
      >
        {t('drill.summary.newSession')}
      </button>
    </div>
  );
}

// ─── Settings panel (minimal — full UI is Task 11) ────────────────────────────

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const length = useDrillStore((s) => s.settings.length);
  const updateSettings = useDrillStore((s) => s.updateSettings);

  return (
    <div
      role="group"
      aria-label={t('drill.settings.title')}
      className="rounded-xl p-4 mt-4"
      style={{
        backgroundColor: 'var(--bg-raised)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
        {t('drill.settings.length')}
      </p>
      <div
        className="grid grid-cols-3 gap-1 rounded-lg p-0.5"
        style={{ backgroundColor: 'color-mix(in srgb, var(--card-hover) 60%, transparent)' }}
      >
        {SESSION_LENGTHS.map((len) => {
          const active = len === length;
          return (
            <button
              key={len}
              type="button"
              onClick={() => {
                updateSettings({ length: len });
                onClose();
              }}
              className="min-h-[40px] rounded-md text-sm font-medium tabular-nums transition-colors"
              style={{
                backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: active ? 600 : 500,
              }}
              aria-pressed={active}
            >
              {len}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function canonicalAnswer(item: DrillItem): string {
  switch (item.answer.kind) {
    case 'choice':
      return item.answer.correct;
    case 'notes':
      return item.answer.notes.join(' ');
    case 'accidentals':
      return item.answer.spelled.join(' ');
    case 'rootQuality':
      return `${item.answer.root} ${item.answer.quality}`;
  }
}
