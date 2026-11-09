/**
 * W4b (owner's update-robustness decision): a reload loses nothing in Learn.
 * The session store keeps the open lesson / section and an in-progress check
 * in its OWN persisted key, versioned and shape-guarded; it expires after
 * 24 h, when the content under the saved ids changed (W4a identity) or in
 * another language; and it never touches saved progress.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  useLearnSessionStore,
  LEARN_SESSION_KEY,
  LEARN_SESSION_VERSION,
  LEARN_SESSION_TTL_MS,
  restorableScreen,
  restorableCheck,
  learnCheckInProgress,
  fingerprintsOf,
  identitiesOf,
  pairTriedOptions,
  isValidLearnSession,
  type RunSnapshot,
  type SavedCheck,
} from '../learnSessionStore';
import { withSourceFingerprints } from '../../data/exerciseLoader';
import legacyFixture from './fixtures/learn-session-v1.json';
import { hasWorkInProgress } from '../../services/workInProgress';
import { useProgressStore } from '../progressStore';
import { useAppStore } from '../store';
import type { ExerciseDefinition } from '../../core/types/exercise';
import errorBoundarySource from '../../components/ErrorBoundary.tsx?raw';

const ex = (id: string, prompt = `Q ${id}?`): ExerciseDefinition => ({
  id, type: 'multiple_choice', prompt,
  config: { type: 'multiple_choice', choices: [{ label: 'yes', correct: true }, { label: 'no', correct: false }, { label: 'maybe', correct: false }] },
});
const LIST = [ex('l1u1m1e1'), ex('l1u1m1e2'), ex('l1u1m1e3')];

function savedCheck(over: Partial<SavedCheck> = {}): SavedCheck {
  return {
    moduleId: 'l1u1m1', kind: 'check', lang: 'en', fingerprints: fingerprintsOf(LIST),
    run: { order: ['l1u1m1e2', 'l1u1m1e1', 'l1u1m1e3'], index: 1, scores: [1], items: [{ id: 'l1u1m1e2', answers: ['yes'], score: 1, answer: 'yes' }], attempt: 2, selectedNotes: [], tried: [{ value: 'no', words: 'no' }], missed: 'no', final: null },
    finished: false, at: Date.now(), ...over,
  };
}

beforeEach(() => {
  localStorage.clear();
  useLearnSessionStore.setState({ screen: null, check: null });
});

describe('Learn session store', () => {
  it('persists under its own key and version — never inside the progress save', () => {
    useProgressStore.getState().replaceProgress({ completedModules: ['l1u1m1'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} });
    const progressBefore = localStorage.getItem('music-theory-progress');
    useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'c1', at: Date.now() });
    useLearnSessionStore.getState().setCheck(savedCheck());
    const raw = JSON.parse(localStorage.getItem(LEARN_SESSION_KEY)!);
    expect(raw.version).toBe(LEARN_SESSION_VERSION);
    expect(raw.state.screen.section).toBe('c1');
    expect(raw.state.check.run.index).toBe(1);
    expect(localStorage.getItem('music-theory-progress')).toBe(progressBefore);
  });

  it('a reload restores the same screen and the same check', async () => {
    useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'tasks', at: Date.now() });
    useLearnSessionStore.getState().setCheck(savedCheck());
    const raw = localStorage.getItem(LEARN_SESSION_KEY)!;
    useLearnSessionStore.setState({ screen: null, check: null });
    localStorage.setItem(LEARN_SESSION_KEY, raw);
    await useLearnSessionStore.persist.rehydrate();
    expect(restorableScreen()).toMatchObject({ moduleId: 'l1u1m1', section: 'tasks' });
    const r = restorableCheck('l1u1m1', LIST, 'en');
    expect(r?.ordered.map((e) => e.id)).toEqual(['l1u1m1e2', 'l1u1m1e1', 'l1u1m1e3']);
    expect(r?.check.run).toMatchObject({ index: 1, scores: [1], attempt: 2, missed: 'no' });
  });

  it('expires: after 24 h, in another language, or when a saved id now names another exercise', () => {
    const old = Date.now() - LEARN_SESSION_TTL_MS - 1;
    useLearnSessionStore.getState().setScreen({ type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: null, at: old });
    expect(restorableScreen()).toBeNull();

    useLearnSessionStore.getState().setCheck(savedCheck({ at: old }));
    expect(restorableCheck('l1u1m1', LIST, 'en')).toBeNull();
    expect(useLearnSessionStore.getState().check).toBeNull(); // dropped

    useLearnSessionStore.getState().setCheck(savedCheck());
    expect(restorableCheck('l1u1m1', LIST, 'pt')).toBeNull();

    useLearnSessionStore.getState().setCheck(savedCheck());
    const changed = [ex('l1u1m1e1'), ex('l1u1m1e2', 'A different question?'), ex('l1u1m1e3')];
    expect(restorableCheck('l1u1m1', changed, 'en')).toBeNull();

    useLearnSessionStore.getState().setCheck(savedCheck());
    expect(restorableCheck('l1u1m1', LIST.slice(1), 'en')).toBeNull(); // an id is gone
  });

  it('malformed or other-version saves are dropped, without touching progress', async () => {
    useProgressStore.getState().replaceProgress({ completedModules: ['l1u1m1'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} });
    for (const bad of [
      { state: { screen: { type: 'module' }, check: null }, version: 1 },
      { state: { screen: null, check: { ...savedCheck(), run: { order: 'x' } } }, version: 1 },
      { state: { screen: null, check: savedCheck() }, version: 99 },
      'not json',
    ]) {
      localStorage.setItem(LEARN_SESSION_KEY, typeof bad === 'string' ? bad : JSON.stringify(bad));
      await useLearnSessionStore.persist.rehydrate();
      const s = useLearnSessionStore.getState();
      expect([s.screen, s.check]).toEqual([null, null]);
    }
    expect(useProgressStore.getState().progress.completedModules).toEqual(['l1u1m1']);
    expect(isValidLearnSession({ screen: null, check: savedCheck() })).toBe(true);
  });

  it("'learn' work in progress: the overview and reading a lesson or review are idle", () => {
    useAppStore.setState({ view: 'learn' });
    expect(hasWorkInProgress()).toBe(false);
    for (const type of ['module', 'review'] as const) {
      useLearnSessionStore.getState().setScreen({ type, levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'c1', at: Date.now() });
      expect(restorableScreen()).not.toBeNull();
      expect(hasWorkInProgress()).toBe(false);
    }
    useAppStore.setState({ view: 'explore' });
    expect(hasWorkInProgress()).toBe(false);
  });

  it('the first question counts before any answers, even behind another view', () => {
    const check = savedCheck();
    check.run = { ...check.run, index: 0, scores: [], items: [], attempt: 1, tried: [], missed: null };
    expect(isValidLearnSession({ screen: null, check })).toBe(true);
    useLearnSessionStore.getState().setCheck(check);
    useAppStore.setState({ view: 'explore' });
    expect(hasWorkInProgress()).toBe(true);
  });

  it('hasWorkInProgress(): true while a check is under way, false when finished, gone or stale', () => {
    expect(hasWorkInProgress()).toBe(false);
    useLearnSessionStore.getState().setCheck(savedCheck());
    expect(learnCheckInProgress()).toBe(true);
    expect(hasWorkInProgress()).toBe(true);
    useLearnSessionStore.getState().setCheck(savedCheck({ finished: true }));
    expect(hasWorkInProgress()).toBe(false);
    useLearnSessionStore.getState().setCheck(savedCheck({ at: Date.now() - LEARN_SESSION_TTL_MS - 1 }));
    expect(hasWorkInProgress()).toBe(false);
    useLearnSessionStore.getState().setCheck(null);
    expect(hasWorkInProgress()).toBe(false);
  });
});

describe('recovery clears the Learn session', () => {
  it('ErrorBoundary carries the key verbatim and removes it in both resets', () => {
    expect(errorBoundarySource).toContain(`'${LEARN_SESSION_KEY}'`);
    const removals = errorBoundarySource.match(/localStorage\.removeItem\(LEARN_SESSION_KEY_LITERAL\)/g) ?? [];
    expect(removals.length).toBe(2);
  });
});


describe('inconsistent saves are rejected before mounting', () => {
  const corruptions = [
    ['index at end', { index: 3 }], ['fractional index', { index: 0.5 }],
    ['duplicate order', { order: ['l1u1m1e2', 'l1u1m1e2', 'l1u1m1e3'] }],
    ['missing scores', { scores: [] }], ['missing items', { items: [] }],
    ['wrong item order', { items: [{ id: 'l1u1m1e3', answers: ['yes'], score: 1, answer: 'yes' }] }],
    ['mismatched score', { scores: [0] }], ['retry without miss', { missed: null }],
    ['fractional pitch class', { selectedNotes: [0.5] }], ['out of range pitch class', { selectedNotes: [12] }],
    ['duplicate pitch classes', { selectedNotes: [0, 0] }],
  ] as const;
  it.each(corruptions)('%s', async (_, patch) => {
    const check = savedCheck();
    const data = { screen: null, check: { ...check, run: { ...check.run, selectedNotes: [], ...patch } } };
    expect(isValidLearnSession(data)).toBe(false);
    localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify({ state: data, version: 1 }));
    await useLearnSessionStore.persist.rehydrate();
    expect(useLearnSessionStore.getState().check).toBeNull();
  });
  it('unfinished result and unknown or mismatched screen ids', () => {
    expect(isValidLearnSession({ screen: null, check: savedCheck({ finished: true }) })).toBe(false);
    for (const patch of [{ levelId: 'l99' }, { unitId: 'u99' }, { moduleId: 'gone' }, { levelId: 'l2' }]) {
      expect(isValidLearnSession({ screen: { type: 'module', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: null, at: Date.now(), ...patch }, check: null })).toBe(false);
    }
  });
});

// ─── 2026-11-05 follow-up 3: a translation-only fix keeps the check ─────────
// The saved check is keyed by the ENGLISH item's fingerprint (what
// exerciseIdentity.snapshot.test.ts calls the exercise), which the loader puts
// on every served item; before, a PT/ES rewording of a question or its answer
// changed the served fingerprint and dropped the learner's half-done check.

const mcItem = (id: string, prompt: string, [right, ...wrong]: string[]): ExerciseDefinition => ({
  id, type: 'multiple_choice', prompt,
  config: { type: 'multiple_choice', choices: [{ label: right, correct: true }, ...wrong.map((label) => ({ label, correct: false }))] },
});
const buildItem = (id: string, prompt: string, quality = 'major'): ExerciseDefinition => ({
  id, type: 'chord_build', prompt, config: { type: 'chord_build', root: 'C', rootAccidental: '', quality, noteCount: 3 },
});
/** The English items — and the same three as legacy-fixture content. */
const EN = [
  mcItem('l1u1m1e1', 'Which clef curls around G?', ['Treble', 'Bass', 'Alto']),
  mcItem('l1u1m1e2', 'How many lines does a staff have?', ['Five', 'Four', 'Six']),
  buildItem('l1u1m1e3', 'Build C major.'),
];
const PT = [
  mcItem('l1u1m1e1', 'Que clave se enrola à volta do sol?', ['Clave de sol', 'Clave de fá', 'Clave de dó']),
  mcItem('l1u1m1e2', 'Quantas linhas tem uma pauta?', ['Cinco', 'Quatro', 'Seis']),
  buildItem('l1u1m1e3', 'Constrói dó maior.'),
];
/** As the loader serves them: PT text, each item carrying its English item's fingerprint. */
const serve = (items: ExerciseDefinition[], en: ExerciseDefinition[] = EN) =>
  withSourceFingerprints({ l1u1m1: items }, { l1u1m1: en }).l1u1m1;
const reword = (item: ExerciseDefinition, prompt: string, labels?: string[]): ExerciseDefinition => {
  if (!labels || item.config.type !== 'multiple_choice') return { ...item, prompt };
  return { ...item, prompt, config: { ...item.config, choices: item.config.choices.map((c, i) => ({ ...c, label: labels[i] })) } };
};

/** A PT check started on `items`: question 2 of 3 (l1u1m1e1), a first miss on "Clave de fá". */
function ptCheck(items: ExerciseDefinition[], run: Partial<SavedCheck['run']> = {}): SavedCheck {
  return {
    moduleId: 'l1u1m1', kind: 'check', lang: 'pt', fingerprints: fingerprintsOf(items), identities: identitiesOf(items),
    run: {
      order: ['l1u1m1e2', 'l1u1m1e1', 'l1u1m1e3'], index: 1, scores: [1], items: [{ id: 'l1u1m1e2', answers: ['Cinco'], score: 1, answer: 'Cinco' }],
      attempt: 2, selectedNotes: [], tried: [{ value: 'Clave de fá', words: 'Clave de fá' }], missed: 'Clave de fá', final: null, ...run,
    },
    finished: false, at: Date.now(),
  };
}

describe('a saved check follows the English identity, not the served wording', () => {
  it('the loader gives a PT item its English fingerprint; an English item its own', () => {
    expect(serve(PT).map((ex) => ex.sourceFingerprint)).toEqual(EN.map((ex) => fingerprintsOf([ex])[ex.id]));
    expect(identitiesOf(serve(PT))).toEqual(fingerprintsOf(EN));
    expect(identitiesOf(EN)).toEqual(fingerprintsOf(EN)); // no loader: an English item is its own source
    expect(fingerprintsOf(PT)).not.toEqual(fingerprintsOf(EN)); // what the old key compared
  });

  it('a translation-only fix (the PT question and its answer reworded) restores the run exactly', () => {
    useLearnSessionStore.getState().setCheck(ptCheck(serve(PT)));
    const fixed = serve([
      reword(PT[0], 'Que clave se enrola à volta da linha do sol?', ['Clave de Sol', 'Clave de fá', 'Clave de dó']),
      reword(PT[1], 'Quantas linhas tem a pauta?'),
      PT[2],
    ]);
    expect(fingerprintsOf(fixed)).not.toEqual(fingerprintsOf(serve(PT))); // the old rule dropped it here
    const r = restorableCheck('l1u1m1', fixed, 'pt');
    expect(r?.ordered.map((e) => e.prompt)).toEqual(['Quantas linhas tem a pauta?', 'Que clave se enrola à volta da linha do sol?', 'Constrói dó maior.']);
    expect(r?.check.run).toMatchObject({ index: 1, scores: [1], attempt: 2, missed: 'Clave de fá', tried: [{ value: 'Clave de fá', words: 'Clave de fá' }] });
    expect(useLearnSessionStore.getState().check?.fingerprints).toEqual(fingerprintsOf(fixed));
  });

  it('a distractor rewritten in English keeps the exercise (as the identity snapshot does)', () => {
    useLearnSessionStore.getState().setCheck(ptCheck(serve(PT)));
    const en = [reword(EN[0], EN[0].prompt, ['Treble', 'Bass', 'Tenor']), EN[1], EN[2]];
    expect(restorableCheck('l1u1m1', serve(PT, en), 'pt')).not.toBeNull();
  });

  it.each([
    ['the English prompt', [reword(EN[0], 'Which clef curls around the G line?'), EN[1], EN[2]]],
    ['the English keyed answer', [reword(EN[0], EN[0].prompt, ['Treble clef', 'Bass', 'Alto']), EN[1], EN[2]]],
    ['the config of a build', [EN[0], EN[1], buildItem('l1u1m1e3', 'Build C major.', 'minor')]],
  ] as const)('a change of %s drops it, even with the PT text untouched', (_, en) => {
    useLearnSessionStore.getState().setCheck(ptCheck(serve(PT)));
    expect(restorableCheck('l1u1m1', serve(PT, [...en]), 'pt')).toBeNull();
    expect(useLearnSessionStore.getState().check).toBeNull();
  });

  it('a language switch mid-run still drops it (the saved answers are in the other language)', () => {
    useLearnSessionStore.getState().setCheck(ptCheck(serve(PT)));
    expect(restorableCheck('l1u1m1', serve(EN), 'en')).toBeNull();
  });
});

describe('the current question\'s tried option is paired by its words, or that question starts again', () => {
  const withTried = (label: string) => serve([reword(PT[0], PT[0].prompt, ['Clave de sol', label, 'Clave de dó']), PT[1], PT[2]]);

  it('the tried option reworded mid-retry: only that question starts again; the answered ones keep their scores', () => {
    useLearnSessionStore.getState().setCheck(ptCheck(serve(PT)));
    const r = restorableCheck('l1u1m1', withTried('A clave de fá'), 'pt');
    expect(r?.check.run).toMatchObject({ index: 1, scores: [1], items: [{ id: 'l1u1m1e2', score: 1 }], attempt: 1, tried: [], missed: null, final: null });
    expect(useLearnSessionStore.getState().check?.run.attempt).toBe(1);
  });

  it('a saved try whose words now name the RIGHT answer is never struck through: the question starts again', () => {
    useLearnSessionStore.getState().setCheck(ptCheck(serve(PT)));
    const swapped = serve([reword(PT[0], PT[0].prompt, ['Clave de fá', 'Clave de sol', 'Clave de dó']), PT[1], PT[2]]);
    expect(restorableCheck('l1u1m1', swapped, 'pt')?.check.run).toMatchObject({ attempt: 1, tried: [] });
  });

  it('with its verdict showing, the verdict stays and an unpaired option is simply not struck', () => {
    const final = { score: 0.5 as const, correct: true, explanation: '', expected: 'Clave de sol' };
    const items = [{ id: 'l1u1m1e2', answers: ['Cinco'], score: 1 as const, answer: 'Cinco' }, { id: 'l1u1m1e1', answers: ['Clave de fá', 'Clave de sol'], score: 0.5 as const, answer: 'Clave de sol' }];
    useLearnSessionStore.getState().setCheck(ptCheck(serve(PT), { final, scores: [1, 0.5], items }));
    const r = restorableCheck('l1u1m1', withTried('A clave de fá'), 'pt');
    expect(r?.check.run).toMatchObject({ index: 1, scores: [1, 0.5], attempt: 2, final, tried: [{ value: '', words: 'Clave de fá' }] });
    expect(isValidLearnSession({ screen: null, check: r?.check })).toBe(true);
  });

  it('values that never depend on wording (a build\'s notes) are left alone', () => {
    const run: RunSnapshot = { ...ptCheck(serve(PT)).run, index: 2, scores: [1, 1], items: [{ id: 'l1u1m1e2', answers: ['Cinco'], score: 1 as const, answer: 'Cinco' }, { id: 'l1u1m1e1', answers: ['Clave de sol'], score: 1 as const, answer: 'Clave de sol' }], tried: [{ value: 'C D G', words: 'C D G' }], missed: '', selectedNotes: [0, 4] };
    expect(pairTriedOptions(run, PT[2])).toBe(run);
  });
});

describe('saves written before the English identities (today\'s v1 format, fixture)', () => {
  const at = legacyFixture.en.state.check.at + 60 * 60 * 1000;
  async function load(save: unknown) {
    localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify(save));
    await useLearnSessionStore.persist.rehydrate();
  }

  it('the fixture is what the shipped store wrote, and still passes the shape guard', async () => {
    for (const save of [legacyFixture.en, legacyFixture.pt]) {
      expect(save.version).toBe(LEARN_SESSION_VERSION);
      expect('identities' in save.state.check).toBe(false);
      expect(isValidLearnSession(save.state)).toBe(true);
      await load(save);
      expect(useLearnSessionStore.getState().check?.run.index).toBe(1);
    }
    expect(legacyFixture.pt.state.check.fingerprints).toEqual(fingerprintsOf(PT));
  });

  it('English: restores exactly (its served fingerprints ARE the English ones), and is upgraded', async () => {
    await load(legacyFixture.en);
    const r = restorableCheck('l1u1m1', serve(EN), 'en', at);
    expect(r?.check.run).toMatchObject({ index: 1, scores: [1], attempt: 2, missed: 'Bass', tried: [{ value: 'Bass' }] });
    expect(useLearnSessionStore.getState().check?.identities).toEqual(fingerprintsOf(EN));
  });

  it('PT, wording unchanged: restores as it always did, and is upgraded to the English identities', async () => {
    await load(legacyFixture.pt);
    const r = restorableCheck('l1u1m1', serve(PT), 'pt', at);
    expect(r?.check.run).toMatchObject({ index: 1, attempt: 2, tried: [{ value: 'Clave de fá' }] });
    expect(useLearnSessionStore.getState().check?.identities).toEqual(fingerprintsOf(EN));
  });

  it('PT after a wording fix: cannot be told from a real change, so it is dropped cleanly (no crash, no broken run)', async () => {
    await load(legacyFixture.pt);
    expect(() => restorableCheck('l1u1m1', serve([reword(PT[0], 'Que clave se enrola à volta da linha do sol?'), PT[1], PT[2]]), 'pt', at)).not.toThrow();
    expect(useLearnSessionStore.getState().check).toBeNull();
  });

  it('a save with a malformed identities map is dropped', () => {
    expect(isValidLearnSession({ screen: null, check: { ...ptCheck(serve(PT)), identities: { l1u1m1e1: 'x' } } })).toBe(false);
    expect(isValidLearnSession({ screen: null, check: { ...ptCheck(serve(PT)), identities: [] } })).toBe(false);
  });
});
