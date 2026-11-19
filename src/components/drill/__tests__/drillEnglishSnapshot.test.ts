/**
 * English Drill reads exactly as it did at 6de6c0e (audit A12, 2026-11-18).
 *
 * Every item of the bank, rendered in English as the learner meets it
 * (drillCorpus.ts: the question, every chip, the explanation, the answer the
 * feedback names), equals its recording from 6de6c0e
 * (fixtures/drill-en-render-6de6c0e.json, recorded before any A12 change;
 * RECORD_DRILL_EN=1 re-records, for a deliberate change only). Translating
 * Portuguese and Spanish moved the English clause texts out of the
 * generators into the Drill's text bundle: this proves not one English
 * character changed.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderBank, type RenderedItem } from './drillCorpus';

const FIXTURE = resolve(process.cwd(), 'src/components/drill/__tests__/fixtures/drill-en-render-6de6c0e.json');

if (process.env.RECORD_DRILL_EN) writeFileSync(FIXTURE, `${JSON.stringify(renderBank('en'), null, 0)}\n`);
const BASE = JSON.parse(readFileSync(FIXTURE, 'utf8')) as RenderedItem[];

describe('English Drill text is unchanged', () => {
  it('the recording covers the whole bank', () => {
    expect(BASE.length).toBe(1615);
  });

  it('every question, chip, explanation and feedback answer equals 6de6c0e', () => {
    const now = new Map(renderBank('en').map((r) => [r.id, r]));
    const diffs: string[] = [];
    for (const b of BASE) {
      const r = now.get(b.id);
      if (!r) {
        diffs.push(`${b.id}: missing`);
        continue;
      }
      for (const field of ['question', 'explanation', 'answer'] as const) {
        if (r[field] !== b[field]) diffs.push(`${b.id} ${field}: "${b[field]}" → "${r[field]}"`);
      }
      if (JSON.stringify(r.choices) !== JSON.stringify(b.choices)) {
        diffs.push(`${b.id} choices: ${JSON.stringify(b.choices)} → ${JSON.stringify(r.choices)}`);
      }
    }
    expect(now.size).toBe(BASE.length);
    expect(diffs.slice(0, 20)).toEqual([]);
  });
});
