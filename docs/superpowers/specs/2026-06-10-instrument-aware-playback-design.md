# Fermata — Instrument-Aware One-Shot Playback (WS8) — Design Spec

- **Date:** 2026-06-10
- **Workstream:** WS8 — Explore play buttons (and all one-shot playback) follow the selected instrument
- **Branch:** `ws8-instrument-aware-playback`
- **Status:** Direction chosen (Approach 1 — voice swap at the core seam). Proceeding to implementation plan.
- **Decision authority:** Nuno delegated the remaining design calls this session ("do the choices as you see best"). Scope and the ear-training product call were answered explicitly (see §2). The perceptual sign-off happens **by ear on the deployed build** — sound cannot be verified by an agent (repo convention).

---

## 1. Problem (verified in code, this session)

Every one-shot playback path is hardwired to the piano voice, regardless of which instrument is on screen:

- `ExploreView.tsx:47` — scale Play button → core `playScale()`.
- `CurrentChordPanel.tsx:106,120` — Chord / Arpeggio buttons → `playChordVoiced()` / `playArpeggioAscending()`.
- `ChordBuilderPanel.tsx:136` — Build-tab Play → `playChordVoiced()`.
- `CircleOfFifths.tsx:82` — segment click → `playChordVoiced([tonic], 4, 0.5)`.
- `ExerciseRunner.tsx:85–109` — ear training (`playEarAudio`) → `playNote()` / `playChord()` with `getSynthConfig('piano')`.
- `celebrationSound.ts` — completion fanfare → `playNote()` ×3.

All of these funnel through core `playNote()` (`src/core/services/audio.ts`), which already has a pluggable voice seam: `PianoVoice` + `setPianoVoice()` (`audio.ts:165–179`), added for the Salamander sampler. Every note is offered to the registered voice first; the FM synth fires only when the voice returns `false`.

Sustained interaction is already instrument-correct and out of scope: `useAudio(instrument)` routes keyboard presses to core sustained notes (sampler/FM) and fretboard presses to `karplusStrong.startNote/stopNote`.

`stopPlayback()` has no UI call sites (verified) — no stop machinery needs extending.

## 2. Decisions (Nuno, this session)

- **Scope:** only the instrument-aware playback item. PT diacritics, L6/L7 deep links, welcome banner stay queued.
- **Ear training follows the instrument.** Interval/chord-ID exercises play as guitar when the fretboard is up. Closes the open decision recorded in CLAUDE.md.
- **Consequence:** *everything* one-shot follows the active instrument — including the celebration fanfare. No pin-to-piano mechanism is built (YAGNI; trivial to add later if a path ever needs pinning).

## 3. Chosen direction — swap the voice at the existing core seam

Rejected alternatives:

- **The recorded sketch (route at call sites):** each call site branches on `instrument` and calls a guitar path. Requires guitar duplicates of `playScale`/`playChordVoiced`/`playArpeggioAscending` sequencing (octave bumps, voicing, tempo scaling, visual callbacks) or extracting all of it; 5+ call sites change; future call sites must remember to branch. The sketch itself missed ear training and celebration.
- **App-layer router module:** centralizes the branch but still duplicates the guitar sequencer; call sites change imports; core keeps a dishonest "piano-only" shape.

Chosen: generalize the seam that already exists. The `PianoVoice` interface is already voice-shaped (`playNote(midi, when, duration, velocity)`, `startNote`, `stopNote`, `setVolume`, `resume`); the sampler proved the contract. Swapping which voice is registered routes **all** one-shot playback with zero call-site changes and zero duplicated music logic.

## 4. Design

### 4.1 Core seam rename (`src/core/services/audio.ts`)

- `PianoVoice` → `InstrumentVoice`; `setPianoVoice()` → `setInstrumentVoice()`; module-local `pianoVoice` → `instrumentVoice`. Doc comment rewritten: the seam is "the active melodic voice", not "a better piano".
- Behavior unchanged: one-shot and sustained paths offer the note to the voice first; FM synth fires only on `false`. The FM fallback's remaining role is piano-mode-while-samples-decode (and first-visit offline).
- **Amended during planning:** the volume push lives in the registration swap path (`instrumentVoices.ts`), not in core — `sampler.setVolume()` eagerly creates its AudioContext, and a core-side push at boot registration would create it during initial script eval. On swap, registration pushes `state.volume` into the incoming voice; boot volume arrives via `useAudio`'s mount sync as before. Additionally `ks.setVolume()` now remembers a value set before the chain exists (latent fix — the persisted volume previously never applied to guitar until the slider moved).
- Core stays framework-agnostic: no store imports, no app imports.

### 4.2 Karplus-Strong one-shot (`src/services/karplusStrong.ts`)

New export, mirroring the sampler's one-shot semantics:

```ts
playNote(midiNumber: number, when: number, duration: number, velocity: number): void
```

- Generates a pluck buffer and schedules `source.start(ctx.currentTime + when)`. `when` is an offset in seconds — offsets transfer across the two AudioContexts (piano ctx computes it, KS ctx consumes it); the sampler uses the same trick.
- **Velocity → gain:** `gain = velocity * 0.9`. Default one-shot velocity is 0.5 (core `DEFAULT_SYNTH_CONFIG.volume`) → 0.45, exactly the sustained-pluck gain today, so one-shots and fret presses match levels. Chord/arpeggio volume scaling arrives pre-applied in `velocity`.
- **Release ("finger lift"):** gain holds until `when + duration`, then a 0.3 s linear ramp to 0; `source.stop(when + duration + 0.35)`. Fast scales stay articulate instead of stacking 5 s of ring; chords (duration 1–2 s) keep a natural body. The ~0.3 s tail still lets adjacent scale notes overlap slightly, which reads as guitar legato.
- **Buffer length = `min(DEFAULT 5 s, duration + 0.5 s)`, floor 1 s.** Generation cost scales with buffer length; a 0.35 s scale note needs ~1 s of buffer, not 5 s (~5× cheaper). The fade makes the truncated tail inaudible. Sustained `startNote` keeps the full 5 s buffer.
- One-shot voices are self-cleaning (`onended`) and do **not** enter the sustained `voices`/`voiceOrder` maps — a scheduled scale must not voice-steal a held fret note. Scheduled one-shots are tracked in a separate set so `stopAll()`/`_resetForTesting()` can stay honest.

### 4.3 Voice registration (`src/services/pianoVoiceRegistration.ts` → `src/services/instrumentVoices.ts`)

`registerSampledPiano()` → `registerInstrumentVoices()` (call site: `main.tsx`):

- Builds both voice objects once:
  - **pianoVoice:** the existing sampler wrapper, unchanged in substance.
  - **guitarVoice:** `playNote` → new KS one-shot; `startNote(midi, _velocity)` → `ks.startNote(midi)` then `return true`; `stopNote` → `ks.stopNote`; `setVolume` → `ks.setVolume`; `resume` → `ks.resumeContext()`. `playNote`/`startNote` always return `true` — KS generates synchronously and is always ready, so the FM synth never leaks into guitar mode.
- Registers the voice matching `useAppStore.getState().instrument` **at boot** — `instrument` is persisted (store `partialize`), so a session can legitimately boot into guitar.
- Subscribes via plain `useAppStore.subscribe(listener)` (no `subscribeWithSelector` middleware in the store; the listener diffs `instrument` against the previous value) and calls `setInstrumentVoice()` on change.
- Sampler `preload()` still kicks off on idle **unconditionally** — flipping to piano later must not start a 2 MB download at flip time.
- Mid-playback switch semantics: already-scheduled notes ring out on the old voice; future calls use the new voice. Acceptable; not worth a cancel mechanism (no stop UI exists at all).

### 4.4 What does not change

- All call sites listed in §1 — zero edits.
- `useAudio`, Piano/Fretboard sustained interaction, exercise `InstrumentInput`.
- `pianoSampler.ts` internals; FM `synthConfig.ts`; SYNTH_PRESETS.
- Volume flow: `useAudio` keeps syncing store volume → `setMasterVolume()` + `ks.setVolume()`; idempotent with the seam's new registration push.

## 5. Testing

TDD throughout; suite must stay green (2,265 baseline).

1. **`karplusStrong.test.ts` additions** — `playNote`: schedules at `currentTime + when`; gain = velocity × 0.9; release ramp scheduled at `when + duration`; source stopped after the tail; does not occupy the sustained-voice maps; buffer length capped by duration.
2. **`instrumentVoices.test.ts` (new)** — boot registration honors persisted `instrument` (piano and guitar cases); store flip piano→guitar→piano swaps the registered voice (assert via mocked `setInstrumentVoice` / engine spies); sampler preload kicks off regardless of boot instrument; volume pushed on registration.
3. **Core seam routing test (new, light)** — with a mock guitar voice registered, `playChord`/`playScale`/`playNote` route every note to the voice and skip the FM oscillator path; with a declining voice (`false`), FM fallback still fires. (Core audio has zero direct tests today; this covers exactly the seam this WS touches.)
4. **Existing suites** — `useAudio.test.ts`, `pianoSampler.test.ts`, component tests mock core audio and must pass untouched (rename updates aside).
5. **Not testable here:** how it sounds. Ship behind green gates → Nuno judges on the deployed build → iterate on release tail / gain if needed.

## 6. Risks & known considerations

- **Perceptual (the real risk):** pluck loudness vs piano, 0.3 s release feel, scale articulation. Mitigation: constants (`RELEASE_S`, gain factor) are named and isolated for fast iteration after ear review.
- **First-note latency:** KS buffers generate synchronously at schedule time; an 8–16 note scale generates all buffers in one tick. Buffer-length capping (§4.2) keeps this to a few ms per note; the first pluck may start ~10–30 ms late on slow devices in the worst case. Accepted for v1; a pre-generation pool is the escape hatch if Nuno hears it.
- **Rename surface:** `setPianoVoice` references in tests/imports — mechanical, `tsc -b --force` catches all.

## 7. Rollout

1. Branch `ws8-instrument-aware-playback` → PR → squash-merge (repo convention).
2. Gates before merge: `tsc -b --force`, eslint, vitest, `audit:all` steady state.
3. Deploy via merge to `main` (content change included, so the SW updates — header-only-deploy gotcha doesn't apply).
4. Verify live bundle hash == local build of the merged commit.
5. Update CLAUDE.md: remove the NEXT SESSION item; record the ear-training decision under Audio & instruments; note the seam rename.
6. Nuno's ear check on https://fermata-music.vercel.app — flip to guitar, hit Chord/Arpeggio/Scale/Circle/ear-training, judge tone and levels.
