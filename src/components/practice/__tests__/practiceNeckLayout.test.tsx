import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GUITAR_TUNINGS } from '../../../core/constants/guitarTunings';
import { midiToNote } from '../../../core/utils/pianoLayout';
import { RIGHT_HAND_PATTERNS } from '../../../core/utils/rightHandPatterns';
import { PracticeNeck } from '../PracticeNeck';
import { practiceNeckLayout } from '../practiceNeckLayout';
import { positionWalkPractice, rightHandPractice, scalePractice, technicalSet } from '../practiceModel';

// Exercise the actual routes, including alternate-tuning/unavailable cases.
// No made-up pitches or changes to the engines to make a board fit.
for (const tuning of GUITAR_TUNINGS) {
  describe(`practice board: ${tuning.id}`, () => {
    for (const type of ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor'] as const) {
      it.each(Array.from({ length: 12 }, (_, pc) => pc))(`${type}, root pitch class %i: all events and passage dots fit`, (pc) => {
        const root = midiToNote(60 + pc);
        const tabs = {
          scales: [1, 2, 3].map((octaves) => scalePractice(root, type, tuning, octaves, 'im')),
          technical: technicalSet(root, type, tuning).map((item) => item.route),
          rightHand: RIGHT_HAND_PATTERNS.map((pattern) => rightHandPractice(root, type, tuning, pattern.id)),
          walk: [positionWalkPractice(root, type, tuning)],
        };
        // Some engine key/tuning pairs have no playable scale route.
        // The chromatic technical exercise still exercises the board.
        expect(tabs.technical.some(Boolean)).toBe(true);
        if (tuning.id !== 'standard') expect(tabs.rightHand.every((route) => route === null)).toBe(true);
        for (const [tab, routes] of Object.entries(tabs)) {
          for (const route of routes) {
            if (!route) continue; // unavailable in the UI; never invent a replacement
            route.events.forEach((event, index) => {
              const layout = practiceNeckLayout(route, index);
              const board = new Set([0, ...layout.frets]);
              const passage = route.events.slice(Math.max(0, index - 3), index + 5).flatMap((e) => e.notes);
              for (const note of [...event.notes, ...passage]) {
                if (!board.has(note.fret) || !layout.places.has(`${note.stringIndex}:${note.fret}`)) {
                  throw new Error(`${tuning.id}/${pc}/${type}/${tab}/${route.id}/${index}: missing ${note.stringIndex}:${note.fret}`);
                }
              }
              expect(layout.frets.at(-1)).toBe(layout.low);
            });
            // Verify real rendered cells/dots at the initial window AND the
            // first fret-1 event, in normal and edited display states.
            const fret1 = route.events.findIndex((event) => event.notes.some((n) => n.fret === 1));
            for (const index of new Set([0, ...(fret1 >= 0 ? [fret1] : [])])) {
              const host = document.createElement('div');
              host.innerHTML = renderToStaticMarkup(<PracticeNeck route={route} index={index} tuning={tuning}
                fingerFor={(_, n) => n.finger} edited={() => index === fret1} onNote={() => {}} />);
              const layout = practiceNeckLayout(route, index);
              for (const { note } of layout.places.values()) {
                expect(host.querySelector(`[data-dot-string="${note.stringIndex}"][data-dot-fret="${note.fret}"]`)).not.toBeNull();
              }
              expect(host.querySelectorAll('[data-fret-break]')).toHaveLength(layout.low > 1 ? 6 : 0);
              expect([...host.querySelectorAll('[data-string-row="0"]')].at(-1)?.getAttribute('data-fret')).toBe(String(layout.low));
            }
          }
        }
      }, 30_000);
    }
  });
}
