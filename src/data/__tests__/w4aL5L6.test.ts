/**
 * W4a, Levels 5–6 — content pins with first-principles oracles.
 *
 * W4-26: each Neapolitan / German-sixth question asks what its keyed answer
 * answers. The Neapolitan "function" question no longer keys an identity
 * fact ("the Neapolitan in C minor is Db major"), and the Gr+6 modulation
 * question no longer keys a history fact — each of those has its own prompt.
 *
 * Oracles (independent of the app's chord tables): a note's pitch class is
 * its letter's natural pitch class plus its accidental; the Neapolitan of a
 * minor key is the major triad on the letter above the tonic, one semitone
 * above it; a major triad is root, major 3rd (+4, two letters up) and
 * perfect 5th (+7, four letters up); an altered dominant of a major key sits
 * on its 5th degree (+7 semitones, four letters up), and V+ raises its 5th
 * (augmented triad: +4, +8).
 */
import { describe, it, expect } from 'vitest';
import templatesL6 from '../exercises/templatesL6';
import ptTplL6 from '../../i18n/content/pt/templatesL6';
import esTplL6 from '../../i18n/content/es/templatesL6';
import { generateExercises } from '../exercises/exerciseGenerator';
import type { ChordBuildConfig } from '../../core/types/exercise';

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, b: -1 };
const pc = (n: string) => (((LETTER_PC[n[0]] + ACC[n.slice(1)]) % 12) + 12) % 12;
const up = (n: string, steps: number) => LETTERS[(LETTERS.indexOf(n[0]) + steps) % 7];
const module = (id: string) => templatesL6.find((t) => t.moduleId === id)!;
const keyed = (t: { params: { choiceSets?: { label: string; correct: boolean }[][] } }) =>
  (t.params.choiceSets ?? []).map((s) => s.find((c) => c.correct)!.label);

describe('W4-26: prompts ask what their keyed answers answer (L6)', () => {
  it('l6u18m1: the function question keys a function; the identity question keys a chord', () => {
    const mcs = module('l6u18m1').templates.filter((t) => t.type === 'multiple_choice');
    const fn = mcs.find((t) => /function/i.test(t.promptTemplate))!;
    const id = mcs.find((t) => /which option gives the correct Neapolitan chord/i.test(t.promptTemplate))!;
    expect(fn && id).toBeTruthy();
    for (const k of keyed(fn)) expect(k).toMatch(/pre-dominant/i);
    for (const k of keyed(id)) expect(k).toMatch(/^In [A-G][#b]? minor: [A-G][#b]? major \(/);
    // No MC template mixes a "how / function" prompt with an identity answer.
    for (const t of mcs) if (/function/i.test(t.promptTemplate)) for (const k of keyed(t)) expect(k).not.toMatch(/ is [A-G][#b]? major/);
  });

  it('l6u18m1: every keyed Neapolitan is the major triad a semitone above the tonic, on the next letter', () => {
    const id = module('l6u18m1').templates.find((t) => /which option gives the correct Neapolitan chord/i.test(t.promptTemplate))!;
    for (const k of keyed(id)) {
      const m = /^In ([A-G][#b]?) minor: ([A-G][#b]?) major \(([A-G][#b]?)-([A-G][#b]?)-([A-G][#b]?)\)$/.exec(k)!;
      expect(m, k).not.toBeNull();
      const [, tonic, root, r, third, fifth] = m;
      expect(root).toBe(r);
      expect(root[0]).toBe(up(tonic, 1));
      expect(pc(root)).toBe((pc(tonic) + 1) % 12);
      expect([third[0], fifth[0]]).toEqual([up(root, 2), up(root, 4)]);
      expect([pc(third), pc(fifth)]).toEqual([(pc(root) + 4) % 12, (pc(root) + 7) % 12]);
    }
  });

  it('l6u18m4: the history fact has its own history question, in all three languages', () => {
    const t = module('l6u18m4').templates;
    const hist = t.findIndex((x) => keyed(x).some((k) => /Romantic composers/.test(k)));
    expect(hist).toBeGreaterThan(-1);
    expect(t[hist].promptTemplate).toMatch(/history/i);
    for (const [i, x] of t.entries()) if (i !== hist) for (const k of keyed(x)) expect(k).not.toMatch(/composers/i);
    expect(ptTplL6.l6u18m4[hist].promptTemplate).toMatch(/história/);
    expect(esTplL6.l6u18m4[hist].promptTemplate).toMatch(/historia/);
  });
});

describe('W4-01 new L6 content: the altered dominant sits on V of the named key', () => {
  it('every l6u19m3 V+ build: root = 5th degree of {key}, an augmented triad', () => {
    const builds = module('l6u19m3').templates.filter((t) => t.type === 'chord_build');
    expect(builds).toHaveLength(1);
    for (const t of builds) {
      t.params.roots!.forEach((_, ri) => {
        const slice = { ...t, params: { ...t.params, roots: [t.params.roots![ri]], accidentals: [t.params.accidentals![ri]], keys: [t.params.keys![ri]] } };
        const [e] = generateExercises({ moduleId: 'w4a-l6', targetCount: 1, templates: [slice] }, 1);
        const c = e.config as ChordBuildConfig;
        const key = t.params.keys![ri];
        const root = c.root + c.rootAccidental;
        expect(root[0]).toBe(up(key, 4));
        expect(pc(root)).toBe((pc(key) + 7) % 12);
        expect(c.quality).toBe('augmented');
        // The prompt names the key, not the answer (W4-07); the hint names the root.
        expect(e.prompt).toContain(`of ${key} major`);
        expect(e.prompt).not.toContain(`${root}+`);
        expect(e.hint).toContain(root);
      });
    }
  });
});
