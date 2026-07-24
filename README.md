# Fermata

Interactive music theory, from the instrument out. A virtual piano or guitar fretboard is always in reach; theory — scales, chords, intervals, keys, the circle of fifths — is explored on it directly. Alongside the explorer sits a structured 9-level curriculum (118 modules, 869 exercises) with spaced-repetition review.

**Live:** https://fermata-music.vercel.app/

- English, Portuguese, and Spanish
- Offline-capable PWA (installable, Workbox precaching)
- Single-user and local-first: progress lives in your browser, no accounts

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

Guitar sound: [Spanish Classical Guitar](https://freepats.zenvoid.org/Guitar/acoustic-guitar.html) (nylon-string) from the [FreePats project](https://freepats.zenvoid.org/), recorded by Roberto (CC0 / public domain).
