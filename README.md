# kartik-human-explainer-v2 🎬

**Give a script (or just a topic) + your voice-over → get a finished vertical
explainer reel.** The exact pipeline behind the @kartik_codes reels, packaged as
an OpenCode skill so an agent can run it end-to-end.

## What it makes

A 1080×1920 @30fps MP4 (24–31 s, style v2 "scene world") with:

- 🪪 **Title card with progress dots**, phrase-by-phrase captions with pink serif keywords
- 🌊 **One persistent illustrated metaphor world** per reel, halftone-dot wipes, comment-keyword CTA
- 🧑‍🎨 **Bearded presenter avatar** (built-in SVG, or your own pose PNGs) bottom-right with a new gesture on nearly every beat
- 🔤 **Word-synced visuals** — every card, sticker and mockup pops exactly on its word
- 🏷️ **Keyword chips** — emoji + word pills that land on the anchor word
- 🔊 **SFX on main moments only** — CC0 Kenney sounds (crash, gone, success, reward, notify), never noisy
- 🟡 **Hand-drawn look** — warm cream bg with dot grid, ink borders, hard shadows, rotation-settle entrances
- 🔎 **Topic-specific research + assets** — checks official/openly licensed sources; downloads reviewed visual assets locally with a source/license manifest, or builds the visual in code when rights are unclear
- 💬 **CTA ending** — topic-appropriate CTA + @kartik_codes Follow button (customizable)

## How it works (agent pipeline)

```
script/topic + VO audio
   │
   ├─ Phase 0  research topic + source visuals → scaffold + reviewed asset manifest
   ├─ Phase 1  local whisper sync (faster-whisper, nothing uploaded) → words.json
   ├─ Phase 2  topic storyboard: beats, avatar expressions, assets/mockups, SFX
   ├─ Phase 3  build + STILL previews → user approves
   └─ Phase 4  render MP4 → register in VideoHub (optional)
```

Safety rails built into the skill: **no full render until the user approves**,
stills as the review medium, corrections appended to `reference/notes.md`
so they never regress, audio never leaves the machine. Topic-specific visuals are
researched per reel, with source/license notes in `assets.json`; when reuse rights
are unclear, the skill builds the graphic in code instead of downloading it.

## Quickstart

```bash
# 1. copy the skill folder to .opencode/skills/ (see INSTALL.md)
# 2. in OpenCode:
"Use kartik-human-explainer-v2 — here's my script and my vo.mp3"
# 3. review stills → say "ok render" → get your MP4
```

## What's inside

```
kartik-human-explainer-v2/
├── SKILL.md            # the agent workflow (phases, style rules, pitfalls)
├── INSTALL.md          # buyer installation + licensing guide
├── reference/notes.md  # append-only learned corrections
├── scripts/new-reel.mjs # scaffold a new reel project
└── template/            # Remotion starter + local asset downloader + safe visual fallbacks
```

## Licensing

MIT (skill code) · Remotion: check remotion.dev/license for commercial use ·
Sounds: CC0 (Kenney) · caption-sync-kit: MIT (© Animo) · Twemoji: CC-BY 4.0 ·
per-topic images: terms vary, logged in `assets.json`. Details in `INSTALL.md` §6.
