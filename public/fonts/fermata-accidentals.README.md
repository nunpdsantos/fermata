# fermata-accidentals.woff2

The accidentals ♭ ♮ ♯ 𝄪 𝄫 (U+266D–266F, U+1D12A–1D12B) for running text.
Source Serif 4 has none of them; the system fallback set them wide ("E ♭").
`src/index.css` puts this face first in every font stack with a
`unicode-range`, so it draws those five characters and nothing else.

- Source: Bravura Text, version 1.482, by Steinberg Media Technologies GmbH.
  Upstream: https://github.com/steinbergmedia/bravura
  File: https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/otf/BravuraText.otf
  (master at commit 37b194378b710cc40e406ab6c4b07608bb9548ae, fetched 2026-11-09).
- Licence: SIL Open Font License 1.1 — `fermata-accidentals-OFL.txt`, the
  upstream `redist/OFL.txt`, unchanged.
- Modified version: subset with fontTools `pyftsubset` to the five code points
  (`--unicodes=U+266D-266F,U+1D12A-1D12B --layout-features='' --no-hinting
  --desubroutinize --flavor=woff2`). "Bravura" is a Reserved Font Name under the
  OFL, so the subset is renamed **Fermata Accidentals**
  (PostScript name FermataAccidentals-Regular).
