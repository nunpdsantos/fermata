/**
 * A check put away by Back (second audit round, P3; the seat's ruling on the
 * review's A4): `away` in the Learn session save. A run that Back (or Learn
 * moving on) has left is kept — its lesson's card offers it — and is NOT work
 * in progress: an update, a shared link, the tour and other windows are not
 * held by it, since nothing on screen can be cut off. A run that is Learn's
 * current screen (on screen, or behind another view after a tab) is, as at
 * 153caab. The field is optional, written only when true, guarded, and a save
 * from before it loads unchanged and is written back byte for byte.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  useLearnSessionStore,
  LEARN_SESSION_KEY,
  LEARN_SESSION_TTL_MS,
  fingerprintsOf,
  identitiesOf,
  isValidLearnSession,
  learnCheckInProgress,
  putCheckAway,
  restorableCheck,
  resumableCheck,
  type SavedCheck,
} from '../learnSessionStore';
import { persistedLearnCheckInProgress } from '../learnWork';
import { hasWorkInProgress } from '../../services/workInProgress';
import legacyFixture from './fixtures/learn-session-v1.json';
import type { ExerciseDefinition } from '../../core/types/exercise';

const ex = (id: string, prompt = `Q ${id}?`): ExerciseDefinition => ({
  id, type: 'multiple_choice', prompt,
  config: { type: 'multiple_choice', choices: [{ label: 'yes', correct: true }, { label: 'no', correct: false }, { label: 'maybe', correct: false }] },
});
const LIST = [ex('l1u1m1e1'), ex('l1u1m1e2'), ex('l1u1m1e3')];
function check(over: Partial<SavedCheck> = {}): SavedCheck {
  return {
    moduleId: 'l1u1m1', kind: 'check', lang: 'en', fingerprints: fingerprintsOf(LIST), identities: identitiesOf(LIST),
    run: { order: ['l1u1m1e2', 'l1u1m1e1', 'l1u1m1e3'], index: 1, scores: [1], items: [{ id: 'l1u1m1e2', answers: ['yes'], score: 1, answer: 'yes' }], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null },
    finished: false, at: Date.now(), ...over,
  };
}
const saved = () => JSON.parse(localStorage.getItem(LEARN_SESSION_KEY) ?? 'null');

beforeEach(() => {
  localStorage.clear();
  useLearnSessionStore.setState({ screen: null, check: null });
});

describe('a check put away', () => {
  it('is kept, and is not work in progress — live, from the save before Learn loads, and for the update and other windows (hasWorkInProgress)', () => {
    useLearnSessionStore.getState().setCheck(check());
    expect(learnCheckInProgress()).toBe(true);
    expect(persistedLearnCheckInProgress()).toBe(true);
    expect(hasWorkInProgress()).toBe(true);
    putCheckAway();
    expect(useLearnSessionStore.getState().check).toMatchObject({ away: true, run: { index: 1 } });
    expect(saved().state.check.away).toBe(true);
    expect(learnCheckInProgress()).toBe(false);
    expect(persistedLearnCheckInProgress()).toBe(false);
    expect(hasWorkInProgress()).toBe(false);
  });

  it('comes back on screen when it continues: `away` is gone, and it is work in progress again', () => {
    useLearnSessionStore.getState().setCheck(check({ away: true }));
    const r = restorableCheck('l1u1m1', LIST, 'en');
    expect(r).not.toBeNull();
    expect('away' in useLearnSessionStore.getState().check!).toBe(false);
    expect(learnCheckInProgress()).toBe(true);
  });

  it('a finished run is not put away (it is no work), and the field is guarded', () => {
    useLearnSessionStore.getState().setCheck(check({ finished: true, run: { ...check().run, index: 2, scores: [1, 1, 1], items: check().run.items.concat([{ id: 'l1u1m1e1', answers: ['yes'], score: 1, answer: 'yes' }, { id: 'l1u1m1e3', answers: ['yes'], score: 1, answer: 'yes' }]), final: { score: 1, correct: true, explanation: '', expected: 'yes' } } }));
    putCheckAway();
    expect('away' in useLearnSessionStore.getState().check!).toBe(false);
    expect(isValidLearnSession({ screen: null, check: check({ away: true }) })).toBe(true);
    for (const away of [false, 'yes', 1, null]) expect(isValidLearnSession({ screen: null, check: { ...check(), away } }), String(away)).toBe(false);
  });
});

describe('one test for the card and the resume (resumableCheck, review A3)', () => {
  it('a check older than a day, one whose question changed, or in another language cannot continue', () => {
    const now = Date.now();
    expect(resumableCheck(check(), 'l1u1m1', LIST, 'en', now)).not.toBeNull();
    expect(resumableCheck(check({ at: now - LEARN_SESSION_TTL_MS - 60_000 }), 'l1u1m1', LIST, 'en', now)).toBeNull();
    expect(resumableCheck(check({ at: now - 25 * 60 * 60 * 1000 }), 'l1u1m1', LIST, 'en', now)).toBeNull();
    const changed = LIST.map((e) => (e.id === 'l1u1m1e2' ? ex(e.id, 'Another question?') : e));
    expect(resumableCheck(check(), 'l1u1m1', changed, 'en', now)).toBeNull();
    expect(resumableCheck(check(), 'l1u1m1', LIST, 'pt', now)).toBeNull();
    expect(resumableCheck(check(), 'l1u2m1', LIST, 'en', now)).toBeNull();
    // It changes nothing: restorableCheck is the one that drops.
    useLearnSessionStore.getState().setCheck(check({ at: now - 25 * 60 * 60 * 1000 }));
    resumableCheck(useLearnSessionStore.getState().check, 'l1u1m1', LIST, 'en', now);
    expect(useLearnSessionStore.getState().check).not.toBeNull();
    expect(restorableCheck('l1u1m1', LIST, 'en', now)).toBeNull();
    expect(useLearnSessionStore.getState().check).toBeNull();
  });
});

describe('a save from before the field', () => {
  it('loads unchanged and is written back byte for byte (the shipped v1 fixture)', async () => {
    for (const save of [legacyFixture.en, legacyFixture.pt]) {
      const raw = JSON.stringify(save);
      localStorage.setItem(LEARN_SESSION_KEY, raw);
      await useLearnSessionStore.persist.rehydrate();
      expect('away' in (useLearnSessionStore.getState().check ?? {})).toBe(false);
      // A write of the same state (any setState) gives back the same bytes.
      useLearnSessionStore.setState({ screen: useLearnSessionStore.getState().screen });
      expect(localStorage.getItem(LEARN_SESSION_KEY)).toBe(raw);
    }
  });
});
