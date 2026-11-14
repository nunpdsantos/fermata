# Fermatina

Interactive music theory, from the instrument out. A virtual piano or guitar fretboard is always in reach; theory — scales, chords, intervals, keys, the circle of fifths — is explored on it directly. Alongside the explorer sits a structured 9-level curriculum (118 modules, 870 exercises) with spaced-repetition review.

**Live:** https://fermatina.com/ (called Fermata until 14 November 2026; the old address, https://fermata-music.vercel.app/, keeps working and tells learners how to bring their progress along: a browser keeps progress per address, so it moves by Export there and Import here).

- English, Portuguese, and Spanish
- Offline-capable PWA (installable, Workbox precaching)
- Single-user and local-first: progress lives in your browser, no accounts
- Every lesson and the glossary also as plain pages that read without JavaScript, in all three languages (https://fermatina.com/en/, generated at build time from the app's own data: `src/site/`, `scripts/pages/`)

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand, with VexFlow for staff notation and the Web Audio API for sound.

## Development

```sh
npm install
npm run dev      # dev server at localhost:5173
npm test         # unit tests (Vitest)
npm run build    # production build to dist/
```

## Repository notes

`docs/superpowers/` contains AI-assisted engineering plans and audits kept for the record.

## Credits

Piano sound: [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3) by Alexander Holm (CC-BY-3.0), via the [Tone.js audio collection](https://tonejs.github.io/audio/salamander/).

Accidental signs (♭ ♮ ♯ 𝄪 𝄫): a subset of [Bravura Text](https://github.com/steinbergmedia/bravura) by Steinberg Media Technologies (SIL Open Font License 1.1), renamed "Fermata Accidentals" as the licence requires for a modified version; licence and provenance in `public/fonts/`.

Guitar sound: [Spanish Classical Guitar](https://freepats.zenvoid.org/Guitar/acoustic-guitar.html) (nylon-string) from the [FreePats project](https://freepats.zenvoid.org/), recorded by Roberto (CC0 / public domain).
