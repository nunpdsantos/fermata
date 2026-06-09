import { describe, it, expect } from 'vitest';
import templatesL5 from '../templatesL5';
import { generateExercises } from '../exerciseGenerator';
import { applyTemplateOverlay } from '../../../i18n/content/contentResolver';
import ptOverlayL5 from '../../../i18n/content/pt/templatesL5';
import esOverlayL5 from '../../../i18n/content/es/templatesL5';
import { L5_UNITS } from '../../../core/constants/curriculumL5';
import { validateAnswer } from '../../../components/learn/exercises/validateExercise';
import { buildChord } from '../../../core/constants/chords';
import { buildScale } from '../../../core/constants/scales';
import { getPitchClass } from '../../../core/constants/notes';
import type { ChordQuality, ScaleType, Note } from '../../../core/types/music';

// Curriculum module id -> title, the authoritative topic map.
const MODULE_TITLES: Record<string, string> = {};
for (const unit of L5_UNITS) {
  for (const m of unit.modules) MODULE_TITLES[m.id] = m.title;
}

// Keyword(s) that MUST appear (case-insensitive) somewhere in a module's
// generated prompts/hints/choice labels, proving the template is on-topic for
// the curriculum module it is keyed to. Only modules that have generated
// templates are listed.
const ON_TOPIC_KEYWORDS: Record<string, string[]> = {
  l5u15m1: ['major triad', 'V/V'],
  l5u15m2: ['dominant 7th', 'secondary dominant'],
  l5u15m3: ['leading-tone'],
  l5u15m4: ['tonicization', 'modulation'],
  l5u15m5: ['dominant chain', 'V7'],
  l5u16m1: ['pivot'],
  l5u16m2: ['closely related', 'relative minor'], // Modulation to Closely Related Keys
  l5u16m3: ['direct modulation', 'common-tone', 'chromatic modulation'], // Direct/Common-Tone/Chromatic
  l5u16m4: ['borrowed', 'mode-mixture', 'mode mixture'], // Mode Mixture
  l5u17m1: ['binary', 'ternary'], // Binary and Ternary Forms
  l5u17m2: ['rondo', 'sonata', 'variation'], // Song Forms / Large Forms
};

// Topic keywords that MUST NOT appear in a module's generated content (catches
// the A1 cross-wiring regression: forms content under modulation modules, etc.)
const OFF_TOPIC_FORBIDDEN: Record<string, string[]> = {
  l5u16m2: ['borrowed chord', 'sonata', 'rondo', 'binary'],
  l5u16m3: ['borrowed chord', 'sonata', 'rondo'],
  l5u16m4: ['sonata', 'rondo', 'binary form', 'Picardy'], // borrowed-chords module, not forms; Picardy is m5
  l5u17m1: ['borrowed chord', 'sonata', 'rondo'], // binary/ternary, not large forms
};

function toNote(natural: string, accidental: string): Note {
  return { natural: natural as Note['natural'], accidental: accidental as Note['accidental'] };
}

function gatheredText(moduleId: string): string {
  const exercises = generateExercises(
    templatesL5.find((c) => c.moduleId === moduleId)!,
    undefined,
  );
  const parts: string[] = [];
  for (const ex of exercises) {
    parts.push(ex.prompt, ex.hint ?? '');
    if (ex.config.type === 'multiple_choice') {
      for (const c of ex.config.choices) parts.push(c.label);
    }
  }
  return parts.join(' • ').toLowerCase();
}

/**
 * Text from prompts, hints, and only the CORRECT choice labels — excludes
 * distractor labels (which may legitimately name other topics, e.g. a
 * binary-form question with a false "...is rondo" distractor).
 */
function authoritativeText(moduleId: string): string {
  const exercises = generateExercises(
    templatesL5.find((c) => c.moduleId === moduleId)!,
    undefined,
  );
  const parts: string[] = [];
  for (const ex of exercises) {
    parts.push(ex.prompt, ex.hint ?? '');
    if (ex.config.type === 'multiple_choice') {
      for (const c of ex.config.choices) if (c.correct) parts.push(c.label);
    }
  }
  return parts.join(' • ').toLowerCase();
}

describe('templatesL5 module mapping (A1)', () => {
  it('has no duplicate moduleIds (merged colliding blocks)', () => {
    const ids = templatesL5.map((c) => c.moduleId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keys every template config to a real L5 curriculum module', () => {
    for (const c of templatesL5) {
      expect(MODULE_TITLES[c.moduleId], `${c.moduleId} should exist in curriculum`).toBeDefined();
    }
  });

  it('keeps each generated module on-topic for its curriculum module', () => {
    for (const [moduleId, keywords] of Object.entries(ON_TOPIC_KEYWORDS)) {
      const text = gatheredText(moduleId);
      const hit = keywords.some((k) => text.includes(k.toLowerCase()));
      expect(hit, `${moduleId} ("${MODULE_TITLES[moduleId]}") missing all of: ${keywords.join(', ')}`).toBe(true);
    }
  });

  it('does not serve off-topic content under re-keyed modules (prompts + correct answers)', () => {
    for (const [moduleId, forbidden] of Object.entries(OFF_TOPIC_FORBIDDEN)) {
      const text = authoritativeText(moduleId);
      for (const bad of forbidden) {
        expect(text.includes(bad.toLowerCase()), `${moduleId} should NOT contain "${bad}" in prompts/correct answers`).toBe(false);
      }
    }
  });
});

describe('templatesL5 generated build answers are correct (A3/A4/A5)', () => {
  it('every generated chord_build / scale_build grades its own computed answer as correct', () => {
    for (const config of templatesL5) {
      const exercises = generateExercises(config, undefined);
      for (const ex of exercises) {
        if (ex.config.type === 'chord_build') {
          const cfg = ex.config;
          const chord = buildChord(toNote(cfg.root, cfg.rootAccidental), cfg.quality as ChordQuality);
          const pcs = new Set(chord.notes.map((n) => getPitchClass(n) as number));
          const res = validateAnswer(cfg, pcs);
          expect(res.correct, `${ex.id} ${cfg.root}${cfg.rootAccidental} ${cfg.quality}`).toBe(true);
        }
        if (ex.config.type === 'scale_build') {
          const cfg = ex.config;
          const scale = buildScale(toNote(cfg.root, cfg.rootAccidental), cfg.scaleType as ScaleType);
          const pcs = new Set(scale.notes.map((n) => getPitchClass(n) as number));
          const res = validateAnswer(cfg, pcs);
          expect(res.correct, `${ex.id} ${cfg.root}${cfg.rootAccidental} ${cfg.scaleType}`).toBe(true);
        }
      }
    }
  });

  it('l5u16m2 scale_build builds the relative minor (a closely related key), never the home major itself', () => {
    const exercises = generateExercises(templatesL5.find((c) => c.moduleId === 'l5u16m2')!, undefined);
    const scaleBuilds = exercises.filter((e) => e.config.type === 'scale_build');
    expect(scaleBuilds.length).toBeGreaterThan(0);
    for (const ex of scaleBuilds) {
      expect(ex.config.type).toBe('scale_build');
      if (ex.config.type === 'scale_build') {
        expect(ex.config.scaleType).toBe('natural_minor');
        // prompt must not falsely claim to build a key "closely related to X" while building X
        expect(ex.prompt.toLowerCase()).toContain('natural minor');
      }
    }
  });

  it('l5u16m4 chord_build builds genuine C-major borrowed chords (bVI/bIII/bVII major, iv minor)', () => {
    const exercises = generateExercises(templatesL5.find((c) => c.moduleId === 'l5u16m4')!, undefined);
    const chordBuilds = exercises.filter((e) => e.config.type === 'chord_build');
    expect(chordBuilds.length).toBeGreaterThan(0);
    const allowed = new Set(['Ab major', 'Eb major', 'Bb major', 'F minor']);
    for (const ex of chordBuilds) {
      if (ex.config.type === 'chord_build') {
        const label = `${ex.config.root}${ex.config.rootAccidental} ${ex.config.quality}`;
        expect(allowed.has(label), `unexpected borrowed chord ${label}`).toBe(true);
        // prompt must never name a flat root as a KEY (the A5 bug)
        expect(ex.prompt).not.toMatch(/in (Ab|Eb|Bb|Cb|Db|Gb) major/i);
      }
    }
  });
});

describe('templatesL5 PT/ES overlays re-keyed identically (A1 propagation)', () => {
  for (const [lang, overlay] of [['pt', ptOverlayL5], ['es', esOverlayL5]] as const) {
    it(`${lang}: overlay keys match EN moduleIds with identical per-module entry counts`, () => {
      const enById = new Map(templatesL5.map((c) => [c.moduleId, c]));
      for (const moduleId of Object.keys(overlay)) {
        expect(enById.has(moduleId), `${lang} overlay key ${moduleId} not in EN templates`).toBe(true);
        const en = enById.get(moduleId)!;
        const ov = (overlay as Record<string, unknown[]>)[moduleId];
        expect(ov.length, `${lang} ${moduleId} overlay entry count must equal EN template count`).toBe(en.templates.length);
      }
    });

    it(`${lang}: generation with overlay leaves no unfilled {tokens}`, () => {
      const configs = applyTemplateOverlay(templatesL5, overlay as never);
      for (const config of configs) {
        for (const ex of generateExercises(config, undefined, lang)) {
          expect(ex.prompt).not.toContain('{root}');
          expect(ex.prompt).not.toContain('{scaleType}');
          expect(ex.hint ?? '').not.toContain('{root}');
        }
      }
    });
  }
});
