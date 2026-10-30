/**
 * Sibling groups (audit W7-04): items that answer each other — an item and its
 * reverse ("Scale degree 1 is called…?" / "The Tonic is which degree?"), or
 * two facts about the same key, chord or interval — share a group, and the
 * session never puts two of a group back to back.
 */
import { describe, expect, it } from 'vitest';
import { drillSiblingGroup, generateDrillBank } from '../drillBank';

const BANK = generateDrillBank();
const IDS = new Set(BANK.map((i) => i.id));

function same(...ids: string[]) {
  for (const id of ids) expect(IDS.has(id), `bank has ${id}`).toBe(true);
  const groups = new Set(ids.map(drillSiblingGroup));
  expect(groups.size, ids.join(' / ')).toBe(1);
}

function different(a: string, b: string) {
  expect(IDS.has(a), `bank has ${a}`).toBe(true);
  expect(IDS.has(b), `bank has ${b}`).toBe(true);
  expect(drillSiblingGroup(a), `${a} vs ${b}`).not.toBe(drillSiblingGroup(b));
}

describe('drillSiblingGroup — reverses and same-fact items share a group', () => {
  it('degree: number → name and name → number (the live U-6 pair)', () => {
    same('degree:num-to-name:1', 'degree:name-to-num:Tonic');
    same('degree:num-to-name:7', 'degree:name-to-num:Leading Tone');
    different('degree:num-to-name:1', 'degree:num-to-name:2');
  });

  it('triads and sevenths: spell ↔ name, per root and quality', () => {
    same('triad:name-to-notes:C:major', 'triad:notes-to-name:C:major');
    same('seventh:name-to-notes:F#:half_diminished7', 'seventh:notes-to-name:F#:half_diminished7');
    different('triad:name-to-notes:C:major', 'triad:name-to-notes:C:minor');
    different('triad:name-to-notes:C:major', 'seventh:name-to-notes:C:major7');
  });

  it('roman: degree → chord, chord → degree, and the is-diatonic pair', () => {
    same(
      'roman:degree-to-chord:C:major:2',
      'roman:chord-to-degree:C:major:2',
      'roman:is-diatonic:C:2:yes',
      'roman:is-diatonic:C:2:no',
    );
    same('roman:degree-to-chord:f#:minor:5', 'roman:chord-to-degree:f#:minor:5');
    different('roman:degree-to-chord:C:major:2', 'roman:degree-to-chord:C:major:3');
    different('roman:degree-to-chord:a:minor:2', 'roman:degree-to-chord:C:major:2');
  });

  it('function: V7 of a key sits with the key\'s V chord', () => {
    same('function:v7-of:Eb', 'roman:degree-to-chord:Eb:major:5', 'roman:chord-to-degree:Eb:major:5');
  });

  it('keysig: every item about one signature (key ↔ signature ↔ relative)', () => {
    same(
      'keysig:key-to-count:A:major',
      'keysig:key-to-acc:A:major',
      'keysig:sig-to-key:3#:major',
      'keysig:sig-to-key:3#:minor',
      'keysig:rel-minor:A',
      'keysig:rel-major:f#',
      'keysig:key-to-count:f#:minor',
    );
    same('keysig:key-to-count:C:major', 'keysig:rel-minor:C', 'keysig:rel-major:a', 'keysig:key-to-count:a:minor');
    different('keysig:key-to-count:A:major', 'keysig:key-to-count:E:major');
    // Enharmonic keys have different signatures — not siblings.
    different('keysig:key-to-count:F#:major', 'keysig:key-to-count:Gb:major');
  });

  it('interval: naming a pair ↔ finding the note above', () => {
    same('interval:pair-to-name:C:E', 'interval:note-above:C:M3');
    same('interval:pair-to-name:Eb:Bb', 'interval:note-above:Eb:P5');
    different('interval:note-above:C:M3', 'interval:note-above:C:m3');
  });

  it('circle: a fifth up from X ↔ a fifth down from the answer', () => {
    same('circle:fifth-up:C', 'circle:fifth-down:G');
    same('circle:fifth-up:Bb', 'circle:fifth-down:F');
    different('circle:fifth-up:C', 'circle:fifth-down:C');
  });

  it('scale: spelling a scale ↔ asking for one of its degrees', () => {
    same('scale:spell:A:major', 'scale:degree-of:A:major:3', 'scale:degree-of:A:major:7');
    same('scale:spell:a:natural_minor', 'scale:spell:a:harmonic_minor', 'scale:degree-of:a:natural_minor:3');
    different('scale:spell:A:major', 'scale:spell:a:natural_minor');
  });
});

describe('drillSiblingGroup — totality', () => {
  it('every bank item gets a group; groups stay small', () => {
    const sizes = new Map<string, number>();
    for (const it of BANK) {
      const g = drillSiblingGroup(it.id);
      expect(typeof g).toBe('string');
      expect(g.length).toBeGreaterThan(0);
      sizes.set(g, (sizes.get(g) ?? 0) + 1);
    }
    expect(Math.max(...sizes.values())).toBeLessThanOrEqual(10);
  });

  it('an unknown id is its own group (stubs, removed items)', () => {
    expect(drillSiblingGroup('a')).toBe('a');
    expect(drillSiblingGroup('degree:removed-in-new-release')).toBe('degree:removed-in-new-release');
  });
});
