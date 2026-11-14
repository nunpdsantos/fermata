/**
 * The test sheet's data (src/site/testSheet/data.ts) and its labels:
 *  - every task, intro, word of the sheet and line of the guide is there in
 *    English, Portuguese and Spanish; task ids are unique;
 *  - every app label the sheet quotes comes from the app's own locale files
 *    BY KEY: a quoted span («…» / “…”) in data.ts is one placeholder or one
 *    of the listed non-labels, and no app view or menu name is typed;
 *  - after resolution, every quoted span of a task or the guide IS the app's
 *    current label (so the menu's new name reaches the hints), and a key
 *    that disappears fails.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { allAppStrings, appText } from '../../content';
import { GUIDE_TEMPLATE, NOT_LABELS, SHEET_TEMPLATES, UI_TEMPLATES } from '../data';
import { allTemplates, labelFor, placeholdersOf, resolveText, sheetContent, sheetData, usedAppKeys } from '../resolve';
import { SHEET_IDS, SHEET_LANGS, type SheetLang } from '../model';

const QUOTES: Record<SheetLang, RegExp> = { en: /“([^”]*)”/g, pt: /«([^»]*)»/g, es: /«([^»]*)»/g };
const WRONG_QUOTES: Record<SheetLang, RegExp> = { en: /[«»]/, pt: /[“”]/, es: /[“”]/ };
const quotedIn = (lang: SheetLang, text: string) => [...text.matchAll(QUOTES[lang])].map((m) => m[1]);

describe('the sheet\'s data', () => {
  it('every string is there in the three languages, none empty', () => {
    const all = allTemplates();
    expect(all.length).toBeGreaterThan(3 * 100); // known positive: the walk reads the data
    for (const lang of SHEET_LANGS) {
      const mine = all.filter((t) => t.lang === lang);
      expect(mine.length, lang).toBe(all.filter((t) => t.lang === 'en').length);
      for (const t of mine) expect(t.text.trim(), `${lang} ${t.where}`).not.toBe('');
    }
  });

  it('three sheets (8, 9 and 10 tasks) and a guide of six parts, as the owner\'s sheet had them; task ids unique', () => {
    expect(SHEET_IDS).toEqual(['new', 'player', 'instrument']);
    expect(SHEET_IDS.map((id) => SHEET_TEMPLATES[id].tasks.length)).toEqual([8, 9, 10]);
    expect(SHEET_IDS.map((id) => SHEET_TEMPLATES[id].kind)).toEqual(['find', 'find', 'check']);
    const ids = SHEET_IDS.flatMap((id) => SHEET_TEMPLATES[id].tasks.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(GUIDE_TEMPLATE.sections).toHaveLength(6);
    // A "find" task has a hint or says it has none; a "check" task says what should happen.
    for (const id of SHEET_IDS) {
      for (const task of SHEET_TEMPLATES[id].tasks) {
        if (SHEET_TEMPLATES[id].kind === 'find') expect(task.hint, task.id).not.toBeUndefined();
        else expect(task.expect, task.id).toBeDefined();
      }
    }
  });

  it('each language uses its own quotation marks (“…” in English, «…» in Portuguese and Spanish)', () => {
    for (const t of allTemplates()) expect(WRONG_QUOTES[t.lang].test(t.text), `${t.lang} ${t.where}: ${t.text}`).toBe(false);
  });
});

describe('app labels come from the app, by key', () => {
  it('every quoted span in data.ts is exactly one placeholder or one of the listed non-labels', () => {
    let quoted = 0;
    for (const t of allTemplates()) {
      for (const span of quotedIn(t.lang, t.text)) {
        quoted++;
        const one = placeholdersOf(span);
        const isOnePlaceholder = one.length === 1 && span === span.match(/\{\{[^}]+\}\}/)?.[0];
        expect(isOnePlaceholder || NOT_LABELS[t.lang].includes(span), `${t.lang} ${t.where}: “${span}” is typed — write {{app:<key>}}`).toBe(true);
      }
    }
    expect(quoted).toBeGreaterThan(40); // known positive: the hints' quotes were read
  });

  it('no app view or menu name is typed where the sheet names it without quotes', () => {
    const named = ['nav.explore', 'nav.learn', 'nav.drill', 'settings.title', 'tunerEntry.menuItem', 'metronomeToolEntry.menuItem', 'progression.open', 'micSwitchEntry.label', 'showMe.menuItem', 'report.menuItem'];
    for (const t of allTemplates()) {
      const bare = t.text.replace(/\{\{[^}]+\}\}/g, '');
      for (const key of named) {
        const label = appText(t.lang, key);
        const typed = new RegExp(`(^|[^\\p{L}])${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'u');
        expect(typed.test(bare), `${t.lang} ${t.where}: "${label}" is typed — write {{app:${key}}}`).toBe(false);
      }
    }
    // Known positive: the same scan finds a typed label.
    expect(new RegExp('(^|[^\\p{L}])Explore($|[^\\p{L}])', 'u').test('Go to Explore and tap')).toBe(true);
  });

  it('the non-labels are no string of the app\'s locale files; "⇄" is the flip button\'s own glyph', () => {
    for (const lang of SHEET_LANGS) {
      const app = new Set(allAppStrings(lang));
      expect(app.size).toBeGreaterThan(1000);
      for (const word of NOT_LABELS[lang]) expect(app.has(word), `${lang} "${word}"`).toBe(false);
    }
    const flip = readFileSync(join(__dirname, '../../../components/instruments/FlipNeckButton.tsx'), 'utf8');
    expect(flip).toContain('>⇄</span>');
  });

  it('after resolution, every quoted span of a task, a hint or the guide is the label its key gives today', () => {
    let checked = 0;
    for (const lang of SHEET_LANGS) {
      const ui = sheetContent(lang).ui;
      const templates = allTemplates().filter((t) => t.lang === lang && t.field !== 'ui' && !t.where.endsWith(' say'));
      for (const t of templates) {
        const allowed = new Set([...placeholdersOf(t.text).map((ref) => labelFor(lang, ref, ui)), ...NOT_LABELS[lang]]);
        for (const span of quotedIn(lang, resolveText(lang, t.text, ui))) {
          checked++;
          expect(allowed.has(span), `${lang} ${t.where}: “${span}” is not the app's label`).toBe(true);
        }
      }
    }
    expect(checked).toBeGreaterThan(80);
  });

  it('the menu\'s new name reaches the hints: "Feedback or a problem (Google form)" and its PT / ES', () => {
    for (const lang of SHEET_LANGS) {
      const c = sheetContent(lang);
      const label = appText(lang, 'report.menuItem');
      expect(c.sheets.new.tasks.find((t) => t.id === 'n8')!.hint, lang).toContain(label);
      expect(c.sheets.player.tasks.find((t) => t.id === 'p9')!.hint, lang).toContain(label);
    }
    expect(sheetContent('en').sheets.new.tasks.find((t) => t.id === 'n8')!.hint).toContain('“Feedback or a problem (Google form)”');
  });

  it('a key the app does not have fails (the build fails with it)', () => {
    expect(() => resolveText('en', 'Open “{{app:report.noSuchItem}}”.')).toThrow(/no string "report.noSuchItem" in en/);
    expect(() => resolveText('pt', '«{{lesson:l1u99m9}}»')).toThrow(/no lesson "l1u99m9"/);
    expect(() => resolveText('es', '«{{sheet:copy}}»')).toThrow(/sheet's words are not resolved/);
  });

  it('the keys the sheet uses (the list in CLAUDE.md and the report)', () => {
    expect(usedAppKeys()).toEqual([
      'capo.line', 'capo.setting', 'drill.intro.start', 'metronomeToolEntry.menuItem', 'micSwitchEntry.label', 'micSwitchEntry.off',
      'midiInput.title', 'midiInput.toggle', 'nav.drill', 'nav.explore', 'nav.languageLabel', 'nav.learn', 'neckView.flip',
      'progression.capoIdeas', 'progression.loop', 'progression.open', 'progression.tempo', 'report.menuItem', 'report.offline',
      'settings.title', 'showMe.menuItem', 'start.door.new.title', 'start.door.player.title', 'tracks.chords.title', 'tracks.sound.title',
      'tunerEntry.menuItem',
    ]);
  });

  it('resolves completely in every language: nothing left in braces, the lesson by its title in that language', () => {
    const data = sheetData();
    const json = JSON.stringify(data);
    expect(json).not.toMatch(/\{\{[a-z]+:/);
    expect(data.en.sheets.instrument.tasks.find((t) => t.id === 'i4')!.where).toContain('“Three Notes Make a Chord”');
    expect(data.en.guide.sections[4].items[3]).toBe('Whether the capo line makes sense to them (for example “E: the D shape, capo on fret 2”).');
    expect(data.pt.ui.tooLong).toContain(`«${UI_TEMPLATES.pt.copy}»`);
    expect(data.es.ui.open).toBe('Abrir Fermatina');
    expect(data.pt.ui.offline).toBe(appText('pt', 'report.offline'));
  });
});
