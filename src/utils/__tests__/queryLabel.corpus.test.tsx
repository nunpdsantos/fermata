/**
 * Every quoted phrase of every lesson task, in Portuguese and Spanish (the
 * owner, 19 November 2026: "the labels should be in the learner language as
 * well"), against utils/queryLabel.ts:
 *
 *  - its words hold no English word of the tokens (the list below, read off
 *    the 177 tokens that are not chord symbols; "natural" and "blues" are
 *    Portuguese and Spanish words too, and stay);
 *  - they are the name Explore gives what the token opens — Quick Search's
 *    own naming, which "names results as Explore does" (scaleResultName,
 *    chordResultName), with Dó-Ré-Mi beside a root when it is on; a scale
 *    with no root by the scale picker's name for it;
 *  - a chord symbol (‘C7’, ‘Am’, ‘Cmaj7/G’), English, and the token's
 *    resolution and action are unchanged;
 *  - the lesson's button reads (and is named, for a screen reader) ‘label’,
 *    never the token, and still runs the token; the public lesson page prints
 *    the same words.
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, cleanup, within, fireEvent, act } from '@testing-library/react';
import i18n from '../../i18n';
import { queryLabel } from '../queryLabel';
import { findQuotedQueries, resolveTheoryReadings } from '../theoryQuery';
import { parseChordSymbol, chordFromParsed } from '../../core/utils/chordParser';
import { EN_UNITS, curriculumOverlay } from '../../i18n/content/__tests__/overlayEntries';
import { chordResultName, scaleResultName, searchNames } from '../../components/navigation/quickSearchResults';
import { instructionHtml } from '../../site/html';
import { appText } from '../../site/content';
import { useAppStore } from '../../state/store';
import type { CurriculumModule, CurriculumUnit, CurriculumLevel } from '../../core/types/curriculum';

const shown = vi.hoisted(() => ({ queries: [] as string[] }));
vi.mock('../../services/lessonInstrument', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  showLessonQuery: (q: string) => { shown.queries.push(q); return false; },
}));

/** English words of the task tokens (none may be left inside a PT / ES phrase). */
const ENGLISH = ['major', 'minor', 'scale', 'chord', 'key', 'of', 'harmonic', 'melodic', 'altered', 'chromatic', 'whole', 'tone', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'dominant', 'pentatonic', 'diminished', 'double', 'hungarian'];
const ENGLISH_RE = new RegExp(`(?<!\\p{L})(?:${ENGLISH.join('|')})(?!\\p{L})`, 'iu');

type Lang = 'pt' | 'es';
interface Phrase { module: string; task: string; text: string; query: string }

function phrases(lang: 'en' | Lang): Phrase[] {
  const out: Phrase[] = [];
  for (let n = 1; n <= 9; n++) {
    for (const unit of EN_UNITS[n]) {
      for (const mod of unit.modules) {
        mod.tasks.forEach((t, index) => {
          const text = lang === 'en' ? t.instruction : curriculumOverlay(lang, n).modules[mod.id]?.tasks[index]?.instruction;
          if (!text) return;
          for (const q of findQuotedQueries(text)) out.push({ module: mod.id, task: t.id, text, query: q.query });
        });
      }
    }
  }
  return out;
}

const appNames = (lang: Lang, solfege = false) => {
  const s = searchNames(lang, solfege);
  return { lang, t: (k: string) => i18n.getFixedT(lang)(k) as string, note: s.note };
};
/** What Explore / Quick Search names what the token opens. */
function exploreName(query: string, lang: Lang, solfege = false): string | null {
  const names = searchNames(lang, solfege);
  names.t = (k) => i18n.getFixedT(lang)(k) as string;
  const r = resolveTheoryReadings(query)[0].resolved;
  switch (r.kind) {
    case 'scale': return scaleResultName(r.root, r.scaleType, names);
    case 'key': return scaleResultName(r.root, r.minor ? 'natural_minor' : 'major', names);
    case 'chord': return chordResultName(chordFromParsed(r.parsed), lang);
    // A scale with no root keeps Explore's key: the scale picker's own name for it.
    case 'rootlessScale': return names.t(`scaleName.${r.scaleType}`);
    default: return null;
  }
}

afterEach(() => {
  cleanup();
  useAppStore.setState({ showSolfege: false });
});

describe('task phrases in the learner\'s language', () => {
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: no English word, Explore's name, symbols as written — every phrase`, () => {
      const all = phrases(lang);
      let changed = 0;
      let symbols = 0;
      const bad: string[] = [];
      for (const p of all) {
        const label = queryLabel(p.query, appNames(lang));
        if (parseChordSymbol(p.query)) {
          symbols++;
          if (label !== p.query) bad.push(`${p.task} symbol ‘${p.query}’ → ‘${label}’`);
          continue;
        }
        if (label !== p.query) changed++;
        else bad.push(`${p.task} ‘${p.query}’ kept its text`);
        if (ENGLISH_RE.test(label)) bad.push(`${p.task} ‘${label}’ (from ‘${p.query}’) holds English`);
        if (label !== exploreName(p.query, lang)) bad.push(`${p.task} ‘${label}’ ≠ Explore's ‘${exploreName(p.query, lang)}’`);
        // With Dó-Ré-Mi on, the root as the key summary writes it; chords stay in letters (as Explore's heading).
        const sol = queryLabel(p.query, appNames(lang, true));
        if (sol !== exploreName(p.query, lang, true)) bad.push(`${p.task} Dó-Ré-Mi ‘${sol}’ ≠ ‘${exploreName(p.query, lang, true)}’`);
      }
      expect(bad).toEqual([]);
      // The counts (each language's 398 phrases at 153caab: 221 symbols, 177 in words).
      expect(all.length).toBeGreaterThan(390);
      expect(symbols + changed).toBe(all.length);
      expect(changed).toBeGreaterThan(170);
      console.log(`${lang}: ${all.length} phrases, ${changed} relabelled, ${symbols} chord symbols kept`);
    });
  }

  it('en: every phrase is its token, byte for byte', () => {
    const all = phrases('en');
    expect(all.length).toBeGreaterThan(390);
    for (const p of all) expect(queryLabel(p.query, { lang: 'en', t: (k) => i18n.getFixedT('en')(k) as string })).toBe(p.query);
  });

  it('a token that does not resolve, or has no name, keeps its text', () => {
    const t = (k: string) => i18n.getFixedT('pt')(k) as string;
    expect(queryLabel('Diabelli', { lang: 'pt', t })).toBe('Diabelli');
    expect(queryLabel('C major scale', { lang: 'pt', t: (k) => k })).toBe('C major scale');
    expect(queryLabel('C major scale', { lang: 'pt', t: () => { throw new Error('no string'); } })).toBe('C major scale');
    expect(queryLabel('Sol7', { lang: 'pt', t })).toBe('Sol7');
  });

  it('the public lesson page prints what the app prints (no Dó-Ré-Mi: a page has no settings)', () => {
    for (const lang of ['pt', 'es'] as const) {
      for (const p of phrases(lang)) {
        const site = queryLabel(p.query, { lang, t: (k) => appText(lang, k) });
        expect(site, `${p.task} ${lang}`).toBe(queryLabel(p.query, appNames(lang)));
      }
      const html = instructionHtml("Carrega em 'C major scale' e depois em 'Cmaj7'", '/x', (q) => queryLabel(q, { lang, t: (k) => appText(lang, k) }));
      expect(html).toContain(lang === 'pt' ? '‘C maior’' : '‘C mayor’');
      expect(html).toContain('‘Cmaj7’');
      expect(html).not.toContain('major');
    }
  });
});

describe('in the lesson: the button reads and is named by the label, and runs the token', () => {
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: every task's phrases, as the lesson draws them`, async () => {
      await i18n.changeLanguage(lang);
      // One lesson holding every task of the course in this language (the module renders them as it renders any).
      const tasks = [] as { id: string; instruction: string }[];
      for (let n = 1; n <= 9; n++) for (const unit of EN_UNITS[n]) for (const mod of unit.modules) mod.tasks.forEach((t, index) => {
        const text = curriculumOverlay(lang, n).modules[mod.id]?.tasks[index]?.instruction;
        if (text) tasks.push({ id: `${t.id}`, instruction: text });
      });
      const { ModuleView } = await import('../../components/learn/ModuleView');
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
      const buttons = within(section).getAllByRole('button').filter((b) => b.hasAttribute('aria-expanded'));
      const want = tasks.flatMap((t) => findQuotedQueries(t.instruction).map((q) => `‘${queryLabel(q.query, appNames(lang))}’`));
      expect(buttons.map((b) => b.textContent)).toEqual(want);
      for (const b of buttons) {
        expect(b.getAttribute('aria-label')).toBeNull();
        expect(ENGLISH_RE.test(b.textContent!), b.textContent!).toBe(false);
      }
      // Its accessible name is its label (a screen reader hears the words, not the token).
      expect(screen.getAllByRole('button', { name: want[0] }).length).toBeGreaterThan(0);
      // Tapped, it opens the token's panel, which repeats the label.
      const first = buttons.find((b) => b.textContent === (lang === 'pt' ? '‘C maior’' : '‘C mayor’'))!;
      act(() => fireEvent.click(first));
      await screen.findByTestId('inline-try-this');
      const panel = within(screen.getByTestId('inline-try-this'));
      expect(panel.getByText(first.textContent!)).toBeDefined();
      // …and what it shows on the instrument is the token's, unchanged.
      shown.queries.length = 0;
      act(() => fireEvent.click(panel.getByRole('button', { name: lang === 'pt' ? 'Mostrar no piano' : 'Mostrar en el piano' })));
      expect(shown.queries).toEqual(['C major scale']);
      await i18n.changeLanguage('en');
    }, 60_000); // one lesson drawing all ~300 tasks of the course
  }
});
