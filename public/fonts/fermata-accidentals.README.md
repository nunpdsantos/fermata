# fermata-accidentals.woff2

The accidentals ♭ ♮ ♯ 𝄪 𝄫 (U+266D–266F, U+1D12A–1D12B) for running text.
Source Serif 4 has none of them; the system fallback set them wide ("E ♭").
`src/index.css` puts this face first in every font stack with a
`unicode-range`, so it draws those five characters and nothing else.

- Source: Bravura Text, version 1.482, by Steinberg Media Technologies GmbH.
  Upstream: https://github.com/steinbergmedia/bravura
  File: https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/otf/BravuraText.otf
  (master at commit 37b194378b710cc40e406ab6c4b07608bb9548ae, fetched 2026-11-09).
- Copyright: Steinberg Media Technologies GmbH, with Reserved Font Name
  "Bravura". `fermata-accidentals-OFL.txt` is the upstream `redist/OFL.txt`,
  unchanged ("Copyright © 2015, Steinberg Media Technologies GmbH
  (http://www.steinberg.net/), with Reserved Font Name "Bravura"."); the font's
  own copyright field (name ID 0) is kept exactly as Bravura Text 1.482 ships
  it ("Copyright © 2026, Steinberg Media Technologies GmbH … with Reserved Font
  Name "Bravura"." followed by the licence). Nothing of ours replaces it.
- Licence: SIL Open Font License 1.1, as above.
- Modified version: subset with fontTools `pyftsubset` to the five code points
  (`--unicodes=U+266D-266F,U+1D12A-1D12B --layout-features='' --no-hinting
  --desubroutinize --flavor=woff2`). "Bravura" is a Reserved Font Name under the
  OFL, so the subset is renamed **Fermata Accidentals**
  (PostScript name FermataAccidentals-Regular). "Bravura" appears in none of
  name IDs 1, 2, 3, 4, 6, 16, 17; the provenance is in name ID 10
  (description): "Subset of Bravura Text 1.482 by Steinberg Media
  Technologies GmbH …"; name ID 14 is the OFL URL.
