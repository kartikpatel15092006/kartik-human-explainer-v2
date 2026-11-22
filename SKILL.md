---
name: kartik-human-explainer-v2
description: Turn a script (English or Hinglish) or just a topic + voice-over into a finished 1080x1920 vertical explainer reel in the @kartik_codes "scene world" style (v2) — white title card with progress dots, word-by-word phrase captions with pink serif keywords, one persistent illustrated metaphor world per reel, a gesturing bearded avatar bottom-right, halftone-dot wipes and a comment-keyword CTA. Use when the user says "make a reel", "explainer video", "give my script and voice", or invokes this skill with a script and/or VO audio.
---

# Kartik Human Explainer v2 (scene-world reels)

You turn a script + voice-over into a finished vertical (1080×1920, 30 fps) explainer reel.
The output is a Remotion project that renders to an MP4 and registers into VideoHub (if installed).

**Style v2 supersedes the old GitHub-reel look** (coral presenter bottom-left, speech bubble,
50 px dot grid, neo-brutalist chips). Read `reference/style-v2.md` before designing any reel —
it has the measured layout, caption rules, animation catalog, transition timings and the CTA recipe.
`reference/notes.md` keeps the old corrections; entries marked superseded no longer apply to visuals.

## What the user gives you

One or both of:
1. **A script** — English or Hinglish Roman, one short phrase per line (3–6 words, e.g. `captions.txt`).
2. **A voice-over audio file** — mp3/wav from ElevenLabs or any TTS (e.g. "Viraj - Energetic, Clear Narrator").

If the user gives only a topic, write the script first and show it for approval before audio exists:
**24–31 s, ~60–80 words, 20–26 beats of 3–6 words**, structure = metaphor hook → "this free tool/skill…"
→ 3–5 numbered steps (they become the progress dots) → the honest caveat → CTA
(`Comment WORD` / `for the link,` / `and send this to a friend who needs it` or `follow for more tools like this`).

## Hard rules

- **No full render until the user says ok.** Stills and short renders are fine.
- **User feedback overrides everything in this skill**, including the reference style below.
- **Corrections are append-only** — when the user fixes a mistake, add it to the skill's
  `reference/notes.md` so it never regresses.
- CTA at the end is always the 3-act sequence in `reference/style-v2.md` §9: `CommentCTA` (keyword typed, then a
  giant 3D sticker) → `DMCard` ("sent you the link") → `FriendCard` (sent ✓) or `FollowCard` (Following ✓), handle `@kartik_codes`.
- All sounds must be CC0/license-free (Kenney pack is bundled in `template/public/sfx`).
- Never upload the user's VO, source footage, or project files. VO processing is local (ffmpeg + faster-whisper). Network use is limited to topic research, fonts and user-approved/licensed public visual assets.

## Pipeline (phases)

Work in the project root (each reel gets its own folder created by `scripts/new-reel.mjs`).

### Phase 0 — Topic research, assets + setup
1. If given a topic rather than a finished script, research the topic first. For changing facts (prices, availability, quotas, model sizes, token counts, API limits), verify against current primary/official sources, note URLs and access date in `research.md`, then draft the script and show it to the user for approval. Do not invent or silently overstate numbers.
2. Create the project: `node <skill>/scripts/new-reel.mjs <project-name> [target-dir]`.
3. Plan visuals beat-by-beat. For each important proper noun, product, model, place, or numeric claim, choose one of:
   - a relevant official asset (logo/model card/product image) or genuinely useful public-page screenshot;
   - an openly licensed asset whose exact license permits the intended use; or
   - a code-built mock UI, diagram, chart, token counter, map, or concept card when sourcing is unavailable or rights are unclear.
4. Browse for topic-specific assets using official product/brand/repository pages first. Check source, exact license/brand rules, allowed use, and required attribution **before** downloading. Do not treat a public URL or search-engine result as permission. Avoid random stock sites, watermarked images, paywalled assets, copyrighted artwork, scraped thumbnails, and unmodified AI-generated brand marks. Never bypass login, DRM, hotlink restrictions, or access controls.
5. Record each chosen asset in project `assets.json` with `what`, `url` (direct HTTPS file URL), `sourceUrl`, `license`, `usage`, `credit`, and `path` under `public/assets/topic/`. Download only after review with `npm run assets`; it validates HTTPS, raster image type and size, constrains paths, and never accesses the VO. If the official page is useful but has no direct image, recreate the relevant UI as a code-built mockup instead of scraping it.
6. Use a code-drawn visual whenever no suitable asset has clear permission. A downloaded asset is optional; **visual coverage is not**. Keep `assets.json` and `research.md` with the project and add required credits to the final-video description.
7. Write `captions.txt` — one line per beat, numbered `b01`–`b27` style ids; write `keywords.json` with `{ token, occurrence, index }` keyword anchors. Validate with `node scripts/check-script.mjs --fix` and `node scripts/check-assets.mjs`. `check-assets.mjs` also checks the starter's screenshots, logo files, Twemoji and SFX.

### Phase 1 — Audio + sync
1. Convert the user's VO to `public/vo.wav`:
   `ffmpeg -y -i <input.mp3> -ac 1 -ar 48000 -c:a pcm_s16le public/vo.wav`
2. Install sync deps if missing (see `INSTALL.md` §3): Python venv `.venv` with `faster-whisper`.
3. Run the whisper sync (in `tools/caption-sync-kit`):
   `python tools/caption-sync-kit/align.py` — produces `public/words-plain.json` (plain `hi` run)
   and optionally `words-prompt.json` (prompted run). Pick the pass with the higher match rate
   against `captions.txt` (plain usually wins; the current session's best was 92%).
4. Fix compound words: `node scripts/sync-words.mjs` — splits multi-word spans like "time machine".
5. Verify: `public/words.json` must have ≥85% matched words; every keyword anchor must exist.

### Phase 2 — Storyboard (v2 schema)
Design the reel as ONE metaphor world, then edit `storyboard.json`:
1. **Pick the world + cast** (see `reference/style-v2.md` §6): one everyday metaphor that the whole reel lives in
   (fishing pier, hairball in a sink, market stalls, theatre curtain…). Cast: 1 mascot (reuse `Mascot` with hat/label changes)
   + the avatar. Write the world as `src/reel/worlds/<topic>.tsx` and register it in `MAP` in `Reel.tsx`.
2. `title.parts` — 2–4 words, one part `hi: true` (pink); use `"->"` for an arrow ("FREE CODE -> PAID SERVICE").
3. `sections` — one per numbered step; each becomes a progress dot (3–5 total, CTA is the last).
4. `beats` — one per `captions.txt` line, timing from `words.json`. Per beat:
   - `visuals[]`: `{ component, props, x, y, scale, rot, until }`. Visuals **persist** from their beat until beat id `until`
     (the world stays, elements get added). Stage coordinates are 940×1010, centre-anchored.
     Use `fooAfter: n` props (frames after the visual enters) instead of absolute frames (e.g. `sentAfter`, `onAfter`, `clickAfter`).
   - `avatar: { expression, gesture }` — never empty; change gesture on nearly every beat (see §5 of the style guide).
   - `transition`: `pink | ink | sweepRight | sweepLeft` halftone wipe at act changes (pink = new act, ink = into CTA, sweep = quick cut). 2–4 per reel.
   - `glow: true` on emphasis beats (pink burst behind the avatar); `sfx` on main moments only.
5. Replace **all demo content** (title, sections, beats, anchors, visuals, CTA); never leave demo beats or stale indices.
6. Keywords (`keywords.json`) are the pink serif-italic words: 1–2 per beat max, tokens must match `captions.txt` **exactly including punctuation and case** (`"script,"`, `"REEL"`); run `check-script.mjs --fix`.
7. Prefer code-built visuals from `src/reel/visuals.tsx`. Use `TopicAssetCard` only for verified assets recorded in `assets.json`.

### Phase 3 — Build + verify (no full render)
1. Wire `public/vo.wav` into `src/Root.tsx` (template already has the slot).
2. Confirm `storyboard.json` has no leftover GitHub demo text, every referenced visual component exists, and every topic-asset path exists.
3. `npx tsc --noEmit` — must pass.
4. Render **stills** at key beats: `npx remotion still Reel out/<beat>.png --frame=<n> --log=error`.
5. Check every still: avatar visible bottom-right and not covering the stage focus, title card + dots correct, caption ≤ 2 lines
   and clear of the stage, topic-specific visual present, no dead gaps, no overlaps. Also still the frame *mid-wipe* of each transition. Check any borrowed marks/images against their usage rules.
6. Assemble an attribution line from `assets.json` for any required credits; tell the user which assets are official, openly licensed, or code-built.

### Phase 4 — Render + register (only after user ok)
1. `npx remotion render Reel <output.mp4> --log=error` (background, long timeout).
2. Register into VideoHub if the server is up:
   `Copy-Item <output.mp4> <project>/<name>_vN.mp4; node -e "<fetch POST /api/project/<id>/version>"`
3. Report the final file path + size + duration.

## Reference style v2 (measured from 4 reference reels — user overrides apply)

Full detail in `reference/style-v2.md`. Summary:

- Canvas 1080×1920 @30 fps, bg `#F5F1ED` + very fine dot texture (11 px, ~16%). Accent pink `#F4146F`, ink `#1C1C20`.
- Title card (white, Anton caps, pink highlight, numbered progress dots) at y≈100; captions at y≈260 (Space Grotesk 78 px, keywords Instrument Serif italic pink);
  stage y≈600–1600; avatar bottom-right, head top ≈ y 1350, cropped by the bottom edge.
- Captions are one phrase per beat; words fade in as spoken; cleared at the next beat. ~1 beat per 1.1 s.
- One persistent metaphor world per reel; visuals pop with springs and stay until `until`.
- Halftone wipes between acts; CTA = comment-keyword sticker → DM link card → friend "sent ✓" / "Following ✓".
- SFX: only main moments — pill pop per section, a soft sound per wipe, crash/success/reward/notify one-shots. VO always dominant.
- Presenter: code-drawn SVG (`src/avatar/Kartik.tsx`, 20 expressions × 21 gestures) with **real mouth lip-sync** — `open` (voice loudness) widens the mouth and shows teeth; body sway follows the same signal. The photo pack in `public/avatar/` stays available via `AVATAR.mode = "png"`, but a still cannot move its mouth.
- Lip-sync pipeline: `python scripts/make-envelope.py` → `public/vo-envelope.json` (per-frame RMS at 30 fps) → `Reel.tsx` reads it per frame → `Avatar.tsx` passes `open = pow(loud, 0.7)` to `Kartik`. Mouth opening is clamped to the chin (44 px) so `laugh` doesn't spill past the jaw.
- Topic assets are researched per reel; never silently reuse another topic's screenshots/logos.

## Known pitfalls

- Whisper plain `hi` run beats prompted runs for Hinglish — measure both, pick the best.
- `vo.wav` must be 48 kHz mono pcm_s16le or frames drift.
- Never render before the user approves; stills are the review medium.
- Windows PowerShell mangles inline JSON — use temp files or `node -e`.
- Keyword tokens in `keywords.json` are matched exactly (punctuation + case); `"script"` will not match `script,`.
- Captions longer than ~6 words wrap to 3 lines and collide with the stage — split the line instead.
- v2 reels are 24–31 s. If a script runs past ~34 s, cut beats; do not slow the pacing.
- Style guide numbers were measured from reference videos, but stills could not always be rendered in the authoring sandbox — always review stills before trusting layout.
