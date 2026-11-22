# caption-sync-kit

Free, local caption sync for reels. From @techstackbro, series "AI se video kaise banaye", part 4.

Your voiceover goes in. You get `captions.words.json`: **your own words** with the exact time each one is spoken. No API key, no upload, no cost.

```
vo.wav --words.py--> words.json (what Whisper heard)
                          |
captions.txt ------align.py----> captions.words.json (your words + Whisper's times)
                          |
                    Karaoke.tsx (Remotion) --> word by word captions
```

## Why two steps?

Whisper is great at *when*, less great at *what*, especially for Hindi and Hinglish. It may spell words differently (Devanagari instead of Roman), mishear a few, or skip a whole stretch. So we keep **your** words from `captions.txt` and only borrow Whisper's **times**. Where Whisper has nothing, `align.py` spreads your words across the real speech in the audio and skips the silences.

Hinglish mein: Whisper ka time lo, apne words rakho. Jahan Whisper ne skip kiya, wahan awaaz ki khamoshi dekh ke words bhar do.

## 1. Install (once)

You need Python 3.11 or 3.12 and ffmpeg.

```bash
# Mac:   brew install python@3.12 ffmpeg
# Linux: sudo apt install python3.12 python3.12-venv ffmpeg
python3.12 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

The first run downloads the Whisper model once (`small` is about 480 MB). After that it works offline. CPU is fine: a 45 second voiceover takes under a minute.

## 2. Get word times

```bash
python words.py vo.wav --lang hi        # Hindi / Hinglish
python words.py vo.wav --lang en        # English
python words.py vo.wav                  # auto-detect
python words.py --help
```

Options: `--model tiny|base|small|medium|large-v3` (bigger = slower, better), `--device cuda` for an NVIDIA GPU, `--out`.

**Tip:** `--prompt-file captions.txt` shows Whisper your caption text as a hint. For Hinglish this usually makes it write Roman words like yours, and more words match. In our test it lifted matches from about 90% to 97%. Compare both runs, because a hint can occasionally make Whisper write a word it did not hear.

## 3. Align to your captions

Write `captions.txt`: the exact words you want on screen, **in spoken order**. Line breaks do not matter.

```bash
python align.py --words words.json --captions captions.txt --audio vo.wav
```

You get `captions.words.json` and a report:

```
Captions words : 125
Matched        : 112 (90%)  (time taken from Whisper)
Filled         : 13 (10%)   (time estimated from the gaps)

Filled stretches (check these by ear):
  words 34-36   13.22s to  13.88s  [silence]  "word ka time"
```

- **Matched**: Whisper heard it and the spelling is close enough (Roman and Devanagari are compared by sound, so `video` matches `वीडियो`). Time comes straight from Whisper.
- **Filled**: Whisper skipped or garbled it. The words are spread over the gap by word length, skipping silences (`[silence]`). If no audio is given, or no speech is found in the gap, you get even spacing (`[even]`).
- Always open the "Filled stretches" list and listen to those parts once.
- Options: `--silence-db -45` if gaps look wrong (a lower number counts quieter sounds as speech; a higher one ignores them), `--min-word`, `--out`.

## What the JSON looks like

Same format for `words.json` and `captions.words.json`, times in seconds:

```json
[
  { "word": "Ye", "start": 0.0, "end": 0.2 },
  { "word": "captions", "start": 0.2, "end": 0.66 },
  { "word": "mere", "start": 0.66, "end": 0.88 }
]
```

## Use it in Remotion

1. Copy `captions.words.json` into your project's `public/` (or `src/`).
2. Copy `karaoke/Karaoke.tsx` into your `src/`.
3. Use it:

```tsx
import captions from "../public/captions.words.json";
import { Karaoke } from "./Karaoke";

<Karaoke
  words={captions}
  keywords={["sync"]}
  perChunk={4}
  spokenColor="#111" upcomingColor="#9A9A9A" keywordColor="#FF4D7E"
  style={{ position: "absolute", bottom: 480, left: 60, right: 140 }}
/>
```

Spoken word is solid, upcoming words are grey, keywords get the highlight colour, 2 to 5 words per chunk. Colours, font, size are all props.

Want things to pop on a word, not only captions? See the free reel scene template and its `CaptionStrip` and `atWord` helpers: https://getanimo.io/blog/ai-se-video-kaise-banaye/part-3

Or skip the manual work: paste `PROMPT.md` into Claude Code.

## Tips

- **Hindi:** write captions in Roman Hinglish (easy to read on screen), but the **number of words must match what is spoken**. If you say "bolte hi" write two words, not "boltehi". Do not add words you do not say, and do not drop ones you do.
- Numbers: write them the way you say them if you can ("4" and "four" are different to Whisper).
- Do not reorder. Alignment assumes captions and speech are in the same order.
- Check the output: `Matched` below 60% means captions.txt and the audio probably differ. Fix the text or re-record.
- Clean audio helps most. Music loud under the voice makes Whisper guess.
- Very short words are the hardest. That is what the gap-filling is for.

## Licence

MIT. faster-whisper and the Whisper models are MIT as well. Remotion has its own licence: free for individuals and small teams, see remotion.dev/license.
