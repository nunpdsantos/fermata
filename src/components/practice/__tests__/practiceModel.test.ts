import { describe, expect, it } from 'vitest';
import { TUNING_STANDARD, getTuningById } from '../../../core/constants/guitarTunings';
import { getPitchClass } from '../../../core/constants/notes';
import { preferredRootSpelling } from '../../../core/utils/degreeSpelling';
import { fullRoute, getScaleRoute } from '../../../core/utils/scaleRoutes';
import { RIGHT_HAND_PATTERNS, rightHandStudy } from '../../../core/utils/rightHandPatterns';
import { keyMode, practiceSchedule, rightHandPractice, routeFingerKey, scalePractice, technicalSet } from '../practiceModel';
import { isValidFingeringKey } from '../../../state/fingeringStore';
import en from '../../../i18n/practice/en.json';
import pt from '../../../i18n/practice/pt.json';
import es from '../../../i18n/practice/es.json';
const C = { natural: 'C', accidental: '' } as const;
const tuning = TUNING_STANDARD;

describe('practice event model', () => {
  it('keeps every finger and shift of the scale route, including melodic minor descent', () => {
    const root = { natural: 'B', accidental: '' } as const;
    const route = scalePractice(root, 'melodic_minor', tuning, 2, 'ma')!;
    expect(route.events.flatMap((e) => e.notes)).toEqual(fullRoute(getScaleRoute(root, 'melodic_minor', { octaves: 2 })!));
    expect(route.events.slice(0, 4).map((e) => e.rh)).toEqual([['m'], ['a'], ['m'], ['a']]);
    expect(route.events.some((e) => e.notes.some((n) => n.shift))).toBe(true);
    expect(scalePractice(C, 'blues', tuning, 2, 'im')).toBeNull();
  });
  it('does not silently treat a mode as a major/minor key', () => {
    expect(keyMode('dorian')).toBeNull();
    const items = technicalSet(C, 'dorian', tuning);
    expect(items.find((i) => i.id === 'scale')?.route).not.toBeNull();
    expect(items.find((i) => i.id === 'tonicArpeggio')).toMatchObject({ route: null, reason: 'majorMinor' });
    expect(rightHandPractice(C, 'dorian', tuning, 'p-i-m-a')).toBeNull();
    expect(rightHandPractice(C, 'major', getTuningById('drop-d'), 'p-i-m-a')).toBeNull();
  });
  it('lists available exercises or a truthful reason in all 24 keys', () => {
    for (const type of ['major', 'natural_minor'] as const) for (let pc = 0; pc < 12; pc++) {
      const root = preferredRootSpelling(pc, type);
      const items = technicalSet(root, type, tuning);
      expect(items).toHaveLength(13);
      for (const item of items) {
        if (item.route) {
          expect(item.route.events.length).toBeGreaterThan(1);
          for (const event of item.route.events) {
            expect(event.rh).toHaveLength(event.notes.length);
            for (const n of event.notes) expect(n.midi % 12).toBe(getPitchClass(n.note));
          }
        } else {
          expect(item.reason).toBeTruthy();
          expect(Object.keys(en.reason)).toContain(item.reason);
        }
      }
    }
  }, 120000);
  it('does not call a top group confined to string 1 “beyond the neck”', () => {
    const item = technicalSet(C, 'major', tuning).find((i) => i.id === 'brokenChord-upper')!;
    expect(item.route).toBeNull();
    expect(item.reason).toBe('beyond-neck');
    for (const locale of [en, pt, es]) {
      expect(locale.reason['beyond-neck']).toMatch(/three strings|três cordas|tres cuerdas/);
      expect(locale.reason['beyond-neck']).not.toMatch(/beyond the neck|além do braço|fuera del mástil/i);
    }
  });
  it('uses every right-hand pattern, preserving its progression and simultaneous strokes', () => {
    for (const pattern of RIGHT_HAND_PATTERNS) {
      const route = rightHandPractice(C, 'major', tuning, pattern.id)!;
      const study = rightHandStudy(C, 'major', pattern.id)!;
      expect(route.events).toHaveLength(pattern.strokes.length * 3);
      expect(route.events.map((e) => e.numeral)).toEqual(study.bars.flatMap((bar) => pattern.strokes.map(() => bar.numeral)));
      expect(route.events.flatMap((e) => e.notes.map((n) => n.midi))).toEqual(study.bars.flatMap((b) => b.notes.map((n) => n.midi)));
      route.events.forEach((e, i) => expect(e.rh).toEqual(pattern.strokes[i % pattern.strokes.length]));
    }
  });
  it('schedules exactly the shown pitches, simultaneous events, tempo and ringing', () => {
    for (const route of [scalePractice(C, 'major', tuning, 2, 'im')!, rightHandPractice(C, 'major', tuning, 'p+a-i-m-i')!, technicalSet(C, 'major', tuning).find((i) => i.id === 'sixths-together')!.route!]) {
      const schedule = practiceSchedule(route, 60);
      expect(schedule.notes.map((n) => n.note)).toEqual(route.events.flatMap((e) => e.notes.map((n) => n.pitched)));
      schedule.notes.forEach((n, i) => expect(n.at).toBe(schedule.eventIndices[i]));
      const fast = practiceSchedule(route, 120);
      fast.notes.forEach((n, i) => expect(n.at).toBe(schedule.notes[i].at / 2));
      expect(schedule.notes[0].duration).toBeGreaterThan(route.overRinging ? 1 : 0);
    }
  });
  it('namespaces route fingers separately by key, tuning, exercise, range and occurrence', () => {
    const route = scalePractice(C, 'major', tuning, 2, 'im')!;
    const n = route.events[0].notes[0];
    const key = routeFingerKey(C, 'major', tuning, route, 0, n);
    expect(isValidFingeringKey(key)).toBe(true);
    expect(routeFingerKey(C, 'major', tuning, route, 1, n)).not.toBe(key);
    expect(isValidFingeringKey(key.replace('route:1', 'route:999'))).toBe(false);
  });
});

function leaves(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value };
  return Object.fromEntries(Object.entries(value as object).flatMap(([k, v]) => Object.entries(leaves(v, `${prefix}.${k}`))));
}
it('EN/PT/ES practice keys and interpolation tokens match', () => {
  const source = leaves(en);
  for (const locale of [pt, es]) {
    const target = leaves(locale);
    expect(Object.keys(target).sort()).toEqual(Object.keys(source).sort());
    for (const key of Object.keys(source)) expect(target[key].match(/{{\w+}}/g) ?? []).toEqual(source[key].match(/{{\w+}}/g) ?? []);
    expect(locale.items['thirds-broken']).toContain('3.as');
    expect(locale.items['sixths-together']).toContain('6.as');
  }
});
