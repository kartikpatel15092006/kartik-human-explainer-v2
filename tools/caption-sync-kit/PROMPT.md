# Align my captions: prompt for Claude Code

Open Claude Code in your Remotion project (the folder that has `src/` and `public/`), unzip `caption-sync-kit` somewhere inside or next to it, then paste everything below the line. Fill the brackets `[ ]` first.

---

I want my reel captions to sync perfectly with my voiceover, using the caption-sync-kit I downloaded (free, local, no API).

MY FILES (fill these in)
- Voiceover audio: [path, e.g. public/vo.wav]
- Captions text, the exact words I want on screen in spoken order: [path to captions.txt, or paste it here]
- Language: [hi, en or auto]
- Kit folder: [path to caption-sync-kit]
- Keyword(s) to highlight: [e.g. sync, or none]
- Karaoke look: [colours, font, or "use my brand file"]

WHAT TO DO
1. Read the kit's README.md, words.py, align.py and karaoke/Karaoke.tsx first.
2. Set up the kit: create a venv with python 3.11 or 3.12, run `pip install -r requirements.txt`. Check that ffmpeg exists (`ffmpeg -version`); if not, tell me how to install it.
3. Run words.py on my audio with my language to make words.json. If the language is Hindi or Hinglish, also try it again with `--prompt-file` pointing at my captions.txt, and keep whichever run matches more words.
4. Run align.py with --words, --captions and --audio to make captions.words.json.
5. Read the report. Tell me matched vs filled counts. If fewer than 70 percent matched, stop and check that captions.txt really matches what is spoken (missing or extra words, wrong order) and tell me what you found instead of guessing.
6. For every "Filled stretch", look at its times next to the audio length and the words around it. Fix anything wrong: words stuck in under 0.1 second, words placed over silence, or a gap that is far too long. Fix by editing captions.txt (word count must match what is spoken), changing `--silence-db`, or re-running, not by hand-editing the JSON unless nothing else works. Re-run until the report looks sane. Never change the spoken words to match Whisper's spelling.
7. Copy captions.words.json into my project's public/ folder and karaoke/Karaoke.tsx into src/. Wire <Karaoke> into my scene with my keyword(s) and look. Keep it inside my safe zones (Instagram covers the top, the bottom and the right edge). Set the composition length from the last word's end plus 0.8 seconds. Use my existing brand colours and font, do not hard-code new ones.
8. Run the typecheck, then render a test still with `npx remotion still` at a frame in the middle of a caption chunk, and one near a keyword. Look at the images yourself and fix: text overflow, wrong highlight, low contrast, overlap with other elements.
9. Show me the stills and the final report. Do not render the full video until I say ok. Do not upload my audio anywhere.
