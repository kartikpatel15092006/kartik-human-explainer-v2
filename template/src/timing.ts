// Make things appear exactly when a word is spoken.
// words.json = [{ "word": "five", "start": 0.12, "end": 0.40 }, ...] (seconds),
// the format Whisper gives you with word timestamps turned on.
import wordsJson from "../public/words.json";
import { FPS } from "./layout";

export type Word = { word: string; start: number; end: number };

// Draft timings (scripts/make-words.mjs). Phase 3 swaps in real Whisper output
// from vo.wav — same format, nothing else changes.
export const WORDS: Word[] = wordsJson as Word[];

/** seconds -> frame */
export const sec = (s: number, fps = FPS) => Math.round(s * fps);

/**
 * Frame where word number `n` starts (0 = first word).
 * If there is no such word (no words.json yet), uses `fallbackSec` instead.
 */
export const atWord = (n: number, fallbackSec = 0, words: Word[] = WORDS, fps = FPS) => {
  const w = words[n];
  return w ? sec(w.start, fps) : sec(fallbackSec, fps);
};

/** Frame where the first word matching `text` starts, e.g. atText("tips"). */
export const atText = (text: string, fallbackSec = 0, words: Word[] = WORDS, fps = FPS) => {
  const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const i = words.findIndex((w) => clean(w.word) === clean(text));
  return i >= 0 ? atWord(i, fallbackSec, words, fps) : sec(fallbackSec, fps);
};

/** Video length: last word + a short tail, or `fallbackSec` if there are no words. */
export const durationFromWords = (tailSec = 0.8, fallbackSec = 6, words: Word[] = WORDS, fps = FPS) =>
  words.length ? sec(words[words.length - 1].end + tailSec, fps) : sec(fallbackSec, fps);
