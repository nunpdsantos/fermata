/**
 * The microphone switch's second tap and its sentences' wording (brief U):
 * lazy, with MicLines.tsx (kept apart from the components for fast refresh).
 */
import type { TFunction } from 'i18next';
import { micAttempt, openMicWith, tapContext, type MicIssue } from '../../services/microphone/micSwitch.ts';

/** "Turn on the microphone" (the second tap): the audio context is made in it, then the browser asks. */
export function confirmMic(): void {
  openMicWith(tapContext(), ++micAttempt.n, false);
}

/** A problem's sentence; in a check, followed by "You can still answer on the screen." */
export function micProblemText(t: TFunction, problem: MicIssue, check: boolean): string {
  if (problem === 'idle') return t('tuner.mic.idle');
  const line = t(`tuner.mic.problem.${problem}`);
  return check ? `${line} ${t('tuner.mic.onScreen')}` : line;
}

