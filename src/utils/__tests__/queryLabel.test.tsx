/**
 * The task phrases' WORDS, pinned by hand (review of bd14071, item 6): the
 * corpus test compares queryLabel with Explore's naming code; this table says
 * what the learner reads, written out, so a change to either shows here.
 * Includes the branches no task token reaches today (a minor key, a named
 * chord over a bass, a chord the parser names itself), Dó-Ré-Mi, and the
 * lesson drawing them with Dó-Ré-Mi on.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import i18n from '../../i18n';
import { isChordSymbol, queryLabel, taskText } from '../queryLabel';
import { useAppStore } from '../../state/store';
import { solfegeName, withSolfege } from '../../i18n/solfege';
import type { CurriculumLevel, CurriculumModule, CurriculumUnit } from '../../core/types/curriculum';
import type { Note } from '../../core/types/music';

const names = (lang: 'en' | 'pt' | 'es', solfege = false) => ({
  lang,
  t: (k: string) => i18n.getFixedT(lang)(k) as string,
  ...(solfege ? { note: (n: Note) => withSolfege(n, solfegeName(n, lang)) } : {}),
});

/** token → [PT, ES], written by hand. */
const TABLE: [string, string, string][] = [
  ['C major scale', 'C maior', 'C mayor'],
  ['key of G', 'G maior', 'G mayor'],
  ['key of A minor', 'A menor natural', 'A menor natural'],
  ['key of F# minor', 'F♯ menor natural', 'F♯ menor natural'],
  ['Bb major scale', 'B♭ maior', 'B♭ mayor'],
  ['A harmonic minor scale', 'A menor harmónica', 'A menor armónica'],
  ['E melodic minor scale', 'E menor melódica', 'E menor melódica'],
  ['D dorian', 'D dórico', 'D dórico'],
  ['G mixolydian', 'G mixolídio', 'G mixolidio'],
  ['C whole tone scale', 'C tons inteiros', 'C tonos enteros'],
  ['chromatic scale', 'cromática', 'cromática'],
  ['G major chord', 'G Maior', 'G Mayor'],
  ['A minor chord', 'A Menor', 'A Menor'],
  ['C diminished chord', 'C Diminuto', 'C Disminuido'],
  // A named chord over a bass (a slash chord in words).
  ['C major/E', 'C Maior/E', 'C Mayor/E'],
  ['C minor/Eb', 'C Menor/E♭', 'C Menor/E♭'],
  // A chord the parser names itself: its own name, as the chord heading and Quick Search write it.
  ['C major add9', 'C(add9)', 'C(add9)'],
  ['C major 7#9', 'Cmaj7♯9', 'Cmaj7♯9'],
  // Dó-Ré-Mi in the token: the letters, as everywhere a name is written.
  ['Sol maior', 'G maior', 'G mayor'],
  // A syllable glued to a symbol is solfège only: kept as written.
  ['Sol7', 'Sol7', 'Sol7'],
  // Symbols: the same in every language.
  ['C7', 'C7', 'C7'],
  ['Am', 'Am', 'Am'],
  ['Cmaj7/G', 'Cmaj7/G', 'Cmaj7/G'],
  // Nothing it resolves to: kept.
  ['Diabelli', 'Diabelli', 'Diabelli'],
];

afterEach(() => {
  cleanup();
  useAppStore.setState({ showSolfege: false });
});

describe('the words, by hand', () => {
  it.each(TABLE)('‘%s’ → PT ‘%s’, ES ‘%s’', (token, pt, es) => {
    expect(queryLabel(token, names('pt'))).toBe(pt);
    expect(queryLabel(token, names('es'))).toBe(es);
    expect(queryLabel(token, names('en'))).toBe(token);
  });

  it('the table covers scales, keys (major and minor), named chords, a bass, a parser-built name, Dó-Ré-Mi and symbols', () => {
    expect(TABLE.length).toBeGreaterThanOrEqual(12);
  });

  it('a chord symbol is written without a space; a phrase the parser also reads ("C major/E") is words', () => {
    expect(['C7', 'Am', 'Cmaj7/G', 'C7alt', 'Csus4'].every(isChordSymbol)).toBe(true);
    expect(['C major/E', 'C minor add9', 'C major scale'].some(isChordSymbol)).toBe(false);
  });

  it('with Dó-Ré-Mi on: the syllable beside a root\'s letter (scales, keys); chords stay in letters', () => {
    expect(queryLabel('G major scale', names('pt', true))).toBe('G (Sol) maior');
    expect(queryLabel('key of D', names('es', true))).toBe('D (Re) mayor');
    expect(queryLabel('key of F# minor', names('pt', true))).toBe('F♯ (Fá♯) menor natural');
    expect(queryLabel('G major chord', names('pt', true))).toBe('G Maior');
  });

  it('a task as the learner reads it: each token as ‘its words’, the rest as written', () => {
    const label = (q: string) => queryLabel(q, names('pt'));
    expect(taskText('Carrega em "C major scale" e depois em "key of A minor"', label)).toBe('Carrega em ‘C maior’ e depois em ‘A menor natural’');
    expect(taskText('Toca «G7» e depois \'C major chord\'', label)).toBe('Toca ‘G7’ e depois ‘C Maior’');
  });
});

describe('in the lesson, with Dó-Ré-Mi on (PT)', () => {
  it('the phrase and the tick box read ‘G (Sol) maior’', async () => {
    await i18n.changeLanguage('pt');
    act(() => useAppStore.setState({ language: 'pt', showSolfege: true }));
    const { ModuleView } = await import('../../components/learn/ModuleView');
    const tasks = [{ id: 'x1', instruction: 'Carrega em "G major scale" e depois em "G major chord"' }];
    const module_ = { id: 'l1u3m1', unitId: 'u3', levelId: 'l1', title: 'T', subtitle: '', objectives: [], concepts: [], tasks, prerequisites: [] } as unknown as CurriculumModule;
    const unit = { id: 'u3', levelId: 'l1', title: 'U', description: '', modules: [module_] } as unknown as CurriculumUnit;
    const level = { id: 'l1', number: 1, title: 'L', description: '', accentColor: '#60a5fa', units: [unit] } as unknown as CurriculumLevel;
    render(
      <ModuleView
        module={module_} unit={unit} level={level} unitIndex={0} moduleIndex={0}
        isModuleCompleted={false} isTaskCompleted={() => false} completedTaskCount={0}
        exercises={[]} exercisesState="ready" exercisesPassed={false} levelCompletedModuleCount={0}
        onToggleTask={() => {}} onCompleteModule={() => {}} onRecordExerciseResult={() => {}}
        onExercisesComplete={() => {}} onBack={() => {}} onBackToLevels={() => {}} onNavigateModule={() => {}}
      />,
    );
    const section = document.querySelector('[data-section="tasks"]') as HTMLElement;
    const phrases = within(section).getAllByRole('button').filter((b) => b.hasAttribute('aria-expanded')).map((b) => b.textContent);
    expect(phrases).toEqual(['‘G (Sol) maior’', '‘G Maior’']);
    expect(screen.getByRole('button', { name: 'Carrega em ‘G (Sol) maior’ e depois em ‘G Maior’' })).toBeDefined();
    await i18n.changeLanguage('en');
    act(() => useAppStore.setState({ language: 'en' }));
  });
});
