# Install — kartik-human-explainer-v2

Turn a script (or topic) + voice-over into a finished 1080×1920 vertical explainer
reel. Voice-over processing runs **locally** and your audio is never uploaded.
Topic research and optional public visual-asset downloads need an internet connection.

## 1. Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 18+ | `node -v` |
| ffmpeg | any recent | `ffmpeg -version` |
| Internet access | for topic research, optional public visual assets and fonts | available during setup |
| Python | 3.9–3.12 | `python --version` |
| OpenCode | V2 | `opencode --version` |

- **Node.js**: https://nodejs.org (LTS)
- **ffmpeg**: `winget install ffmpeg` (Windows) or https://ffmpeg.org/download.html
- **Python**: https://python.org — on Windows, enable "Add to PATH".

## 2. Install the skill

Copy the `kartik-human-explainer-v2` folder into one of OpenCode's skill locations:

- **Per project** (recommended for testing):
  `<your-project>/.opencode/skills/kartik-human-explainer-v2/`
- **Global** (available in every project):
  `~/.config/opencode/skills/kartik-human-explainer-v2/`
  (Windows: `C:\Users\<you>\.config\opencode\skills\kartik-human-explainer-v2\`)

Restart OpenCode. The skill appears in the skill list; say **"make a reel"** or
invoke `kartik-human-explainer-v2` to trigger it.

## 3. One-time: local voice-sync deps (faster-whisper)

The word-level sync runs on a local Whisper model. Set it up once per machine:

```bash
python -m venv .venv
# Windows:
.venv\Scripts\pip install faster-whisper
# macOS/Linux:
.venv/bin/pip install faster-whisper
```

The first sync run downloads the model (~150 MB) into your local cache — no data
leaves your machine. The template expects the venv at `.venv/` inside the reel
project (the skill walks the agent through this automatically).

## 4. Make your first reel

1. Open OpenCode in any empty folder.
2. Say: **"Use kartik-human-explainer-v2, here is my script …"** (or give just a topic
   + your voice-over audio file).
3. The agent researches the topic, checks official/open-license asset sources,
   writes reviewed direct links and license details to `assets.json`, runs
   `npm run assets` to download them into the project (or draws visuals in code
   if rights are unclear), then syncs your VO locally, builds the storyboard,
   and shows you **stills** for approval.
4. Say **"ok render"** to get the final MP4 (1080×1920 @30fps, typically ~45–60 s).

Full workflow details are in `SKILL.md`.

## 5. Troubleshooting

| Problem | Fix |
|---|---|
| Skill not listed | Check the folder path contains `SKILL.md` directly; restart OpenCode. |
| `remotion: command not found` | Run `npm install` inside the scaffolded project. |
| Sync accuracy poor | Ensure `vo.wav` is **48 kHz mono pcm_s16le**; re-record without background noise. The plain `hi` whisper pass usually beats prompted passes for Hinglish. |
| ffmpeg not found | Add ffmpeg to PATH, reopen the terminal. |
| Topic image cannot be downloaded | Check `assets.json` uses a direct HTTPS image URL, valid image MIME type, and allowed use. If the page has no downloadable image or license is unclear, use a code-built mockup instead. |
| Render fails with font errors | Fonts load from Google Fonts at render time — check your internet connection once, or vendor the fonts into `src/fonts.ts`. |
| Python venv issues | Recreate: delete `.venv`, redo §3. |

## 6. Licensing (what you can sell and how)

| Component | License | Your obligation |
|---|---|---|
| This skill (SKILL.md, scripts, template code) | MIT | Keep the copyright notice |
| Remotion | Source-available — **company license required for commercial/for-profit use** of rendered videos by companies | Buy a Remotion company license (remotion.dev) if you sell videos commercially as a company; individuals/small use is covered by the free license terms — verify at remotion.dev/license |
| Sounds (Kenney Interface Sounds) | CC0 | None |
| Per-topic downloaded assets | Varies by asset; recorded individually in `assets.json` | Verify each source's actual terms; include its required credit and do not assume public availability means reuse rights |
| caption-sync-kit (tools/) | MIT (© Animo) | Keep LICENSE file |
| Twemoji SVGs (public/assets/twemoji) | CC-BY 4.0 | **Attribution required** — credit "Twemoji (CC-BY 4.0)" in your video description |
| Fonts | Google Fonts (OFL) | None for embedding in video |

**Selling reels you made with this skill is fine** as long as you comply with the
Remotion license for your situation and credit Twemoji where the emojis appear.

## 7. Updating

When you (the buyer) learn a correction from a client, append it to
`reference/notes.md` — entries are append-only so corrections never regress.
