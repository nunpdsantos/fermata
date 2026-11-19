/**
 * The guard for the search & sharing fixes (audit 2026-11-18, stream B):
 * lessons run their quoted phrases and their Try This queries through the
 * same query code that search uses ('C major scale', 'key of G', 'C7alt' …).
 * `fixtures/curriculumQueries.6de6c0e.json` records, for EVERY query the
 * curriculum carries at 6de6c0e (release 15), what it resolved to and what it
 * did to the store:
 *
 *  - English: each concept's `tryThisQuery`, each task's `query`, every quoted
 *    token of each task's `instruction` (whether it resolves or not, and
 *    whether the lesson turns it into a button — `findQuotedQueries`), each
 *    unit's milestone / completion query and the track endings' queries;
 *  - Portuguese and Spanish: every quoted token of each task's instruction
 *    (the overlays keep the English queries, but translate the instructions).
 *
 * `res` is the resolution (`resolveTheoryQuery`), `btn` whether the token is
 * a button in the lesson text, `fx` the store after `executeTheoryQuery`
 * starting from Learn on A natural minor with no chord (so a query that keeps
 * or changes the scale shows it).
 *
 * After the fixes a recorded value may differ ONLY where a finding says the
 * old result was wrong; each such difference is listed in `CHANGED` below,
 * with its old and new value. Anything else that moves fails.
 *
 * Re-record (only at a deliberate base change): RECORD_CURRICULUM_QUERIES=1.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { executeTheoryQuery } from '../queryExecutor';
import { resolveTheoryQuery, findQuotedQueries, type ResolvedTheoryQuery } from '../theoryQuery';
import { parseChordListQuery } from '../queryExecutorChords';
import { useAppStore } from '../../state/store';
import { clearProgressionRequest, getProgressionRequest } from '../../state/progressionRequest';
import { noteToString, type Chord } from '../../core/types/music';
import { chordFromParsed } from '../../core/utils/chordParser';
import type { CurriculumUnit } from '../../core/types/curriculum';
import type { CurriculumLevelOverlay } from '../../i18n/content/types';
import { TRACK_ENDINGS } from '../../components/learn/tracks/trackEndings';

import { L1_UNITS } from '../../core/constants/curriculumL1';
import { L2_UNITS } from '../../core/constants/curriculumL2';
import { L3_UNITS } from '../../core/constants/curriculumL3';
import { L4_UNITS } from '../../core/constants/curriculumL4';
import { L5_UNITS } from '../../core/constants/curriculumL5';
import { L6_UNITS } from '../../core/constants/curriculumL6';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L8_UNITS } from '../../core/constants/curriculumL8';
import { L9_UNITS } from '../../core/constants/curriculumL9';
import pt1 from '../../i18n/content/pt/curriculumL1';
import pt2 from '../../i18n/content/pt/curriculumL2';
import pt3 from '../../i18n/content/pt/curriculumL3';
import pt4 from '../../i18n/content/pt/curriculumL4';
import pt5 from '../../i18n/content/pt/curriculumL5';
import pt6 from '../../i18n/content/pt/curriculumL6';
import pt7 from '../../i18n/content/pt/curriculumL7';
import pt8 from '../../i18n/content/pt/curriculumL8';
import pt9 from '../../i18n/content/pt/curriculumL9';
import es1 from '../../i18n/content/es/curriculumL1';
import es2 from '../../i18n/content/es/curriculumL2';
import es3 from '../../i18n/content/es/curriculumL3';
import es4 from '../../i18n/content/es/curriculumL4';
import es5 from '../../i18n/content/es/curriculumL5';
import es6 from '../../i18n/content/es/curriculumL6';
import es7 from '../../i18n/content/es/curriculumL7';
import es8 from '../../i18n/content/es/curriculumL8';
import es9 from '../../i18n/content/es/curriculumL9';

const FIXTURE = resolve(process.cwd(), 'src/utils/__tests__/fixtures/curriculumQueries.6de6c0e.json');
const RECORD = process.env.RECORD_CURRICULUM_QUERIES === '1';

const UNITS: CurriculumUnit[] = [
  ...L1_UNITS, ...L2_UNITS, ...L3_UNITS, ...L4_UNITS, ...L5_UNITS,
  ...L6_UNITS, ...L7_UNITS, ...L8_UNITS, ...L9_UNITS,
];
const OVERLAYS: Record<'pt' | 'es', CurriculumLevelOverlay[]> = {
  pt: [pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9],
  es: [es1, es2, es3, es4, es5, es6, es7, es8, es9],
};

// The same token reader the lesson text uses (theoryQuery.ts QUOTED_TOKEN):
// every quoted token is recorded, whether it resolves or not.
const QUOTED = /(?<![\p{L}\p{N}])['"‘“«]([^'"‘’“”«»\n]{1,60}?)['"’”»](?![\p{L}\p{N}])/gu;

interface Row {
  q: string;
  res: string;
  btn?: boolean;
  fx?: string;
}

const chordText = (c: Chord | null | undefined): string =>
  c ? `${noteToString(c.root)}|${c.quality}|${c.bassNote ? noteToString(c.bassNote) : ''}|${c.notes.map((n) => noteToString(n)).join(',')}` : 'none';

function resText(r: ResolvedTheoryQuery | null): string {
  if (!r) return 'null';
  switch (r.kind) {
    case 'key': return `key ${noteToString(r.root)} minor=${r.minor}`;
    case 'circle': return 'circle';
    case 'rootlessScale': return `rootless ${r.scaleType}`;
    case 'scale': return `scale ${noteToString(r.root)} ${r.scaleType}`;
    case 'chord': return `chord ${chordText(chordFromParsed(r.parsed))}`;
  }
}

function resolution(q: string): string {
  const list = parseChordListQuery(q);
  if (list) return `progression ${list.map((e) => e.symbol).join(' ')}`;
  return resText(resolveTheoryQuery(q));
}

/** The store after running the query from Learn, A natural minor, no chord. */
function effect(q: string): string {
  useAppStore.getState().setView('learn');
  useAppStore.setState({ selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'natural_minor', selectedChord: null, chordInversion: 0 });
  clearProgressionRequest();
  const kind = executeTheoryQuery(q);
  const s = useAppStore.getState();
  const prog = getProgressionRequest();
  // The inversion only when there is one (at 6de6c0e a query never set it, so
  // the recorded values keep their form).
  const inv = s.chordInversion ? ` inv=${s.chordInversion}` : '';
  return `${kind} ${s.view} ${noteToString(s.selectedKey)} ${s.selectedScale} ${chordText(s.selectedChord)}${inv}${prog ? ` prog=${(prog.chords ?? []).join(',')}` : ''}`;
}

function collect(): Record<string, Row> {
  const rows: Record<string, Row> = {};
  const query = (where: string, q: string) => { rows[where] = { q, res: resolution(q), fx: effect(q) }; };
  const quoted = (where: string, text: string) => {
    const buttons = new Set(findQuotedQueries(text).map((t) => t.index));
    let i = 0;
    for (const m of text.matchAll(QUOTED)) {
      const q = m[1].trim();
      const btn = buttons.has(m.index ?? -1);
      rows[`${where}#${i++}`] = { q, res: resolution(q), btn, ...(btn ? { fx: effect(q) } : {}) };
    }
  };
  for (const unit of UNITS) {
    for (const mod of unit.modules) {
      mod.concepts.forEach((c, i) => {
        if (c.tryThisQuery) query(`en ${mod.id} concept${i}.tryThisQuery`, c.tryThisQuery);
        if (c.childTryThisQuery) query(`en ${mod.id} concept${i}.childTryThisQuery`, c.childTryThisQuery);
      });
      mod.tasks.forEach((task, i) => {
        if (task.query) query(`en ${mod.id} task${i}.query`, task.query);
        quoted(`en ${mod.id} task${i}.instruction`, task.instruction);
      });
      for (const lang of ['pt', 'es'] as const) {
        const ov = OVERLAYS[lang].map((o) => o.modules[mod.id]).find(Boolean);
        ov?.tasks.forEach((task, i) => quoted(`${lang} ${mod.id} task${i}.instruction`, task.instruction));
      }
    }
    if (unit.milestone?.tryThisQuery) query(`en ${unit.id} milestone.tryThisQuery`, unit.milestone.tryThisQuery);
    if (unit.completionContent?.tryThisQuery) query(`en ${unit.id} completion.tryThisQuery`, unit.completionContent.tryThisQuery);
  }
  for (const [track, steps] of Object.entries(TRACK_ENDINGS)) {
    (steps ?? []).forEach((step, i) => {
      if (step.kind === 'explore') query(`en track:${track} ending${i}.query`, step.query);
    });
  }
  return rows;
}

/**
 * Every recorded value that the fixes change, with the finding that says the
 * old one was wrong (`fixtures/curriculumQueries.changes.json`): `field` →
 * [old, new]. 129 are A2 — a lesson's "key of X" (no quality), which opened X
 * natural minor when the learner was in a minor key, and now opens X major,
 * the key the lesson means. 68 are the review of b94d761, item 7 — a lesson's
 * slash chord whose bass is a chord tone (C/E, C/G, G7/F, Dm7/C, Db/F …),
 * which opened with the bass doubled under a root-position chord and the
 * Voicing chip on Root, and now opens as that inversion (C/E = C major,
 * 1st inversion: utils/chordSelection.ts).
 */
const CHANGED = JSON.parse(readFileSync(resolve(process.cwd(), 'src/utils/__tests__/fixtures/curriculumQueries.changes.json'), 'utf8')) as Record<
  string,
  Partial<Record<keyof Row, [unknown, unknown]>> & { finding: string }
>;

describe('the curriculum queries resolve as they did at 6de6c0e, except where a finding says that was wrong', () => {
  beforeEach(() => {
    useAppStore.setState({ language: 'en' });
  });

  it('every query location, its resolution, its button and its effect', () => {
    const now = collect();
    if (RECORD) {
      writeFileSync(FIXTURE, `${JSON.stringify(now, null, 0).replace(/\},"/g, '},\n"')}\n`);
      return;
    }
    const base = JSON.parse(readFileSync(FIXTURE, 'utf8')) as Record<string, Row>;
    // The same locations (no query lost, none added unseen).
    expect(Object.keys(now).sort()).toEqual(Object.keys(base).sort());
    const unexpected: string[] = [];
    const listedButSame: string[] = [];
    for (const [where, row] of Object.entries(base)) {
      const cur = now[where];
      for (const field of ['q', 'res', 'btn', 'fx'] as const) {
        const change = CHANGED[where]?.[field];
        if (change) {
          if (row[field] !== change[0] || cur[field] !== change[1]) {
            listedButSame.push(`${where} ${field}: recorded ${String(row[field])} → now ${String(cur[field])}, listed ${String(change[0])} → ${String(change[1])}`);
          }
        } else if (row[field] !== cur[field]) {
          unexpected.push(`${where} ${field}: ${String(row[field])} → ${String(cur[field])}`);
        }
      }
    }
    expect(unexpected).toEqual([]);
    expect(listedButSame).toEqual([]);
    expect(Object.values(CHANGED).filter((c) => !['A2', 'A3', 'review item 7'].includes(c.finding))).toEqual([]);
  });
});
