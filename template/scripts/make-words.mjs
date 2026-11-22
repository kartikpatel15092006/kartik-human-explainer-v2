// Phase 2 — draft word timings for public/words.json (no vo.wav yet).
// Same draft model as scripts/check-script.mjs: 2.75 words/s, 0.18 s sentence pause,
// 0.35 s lead-in. When real vo.wav arrives, Phase 3 replaces this with Whisper output.
import { readFileSync, writeFileSync } from "node:fs";

const lines = readFileSync("captions.txt", "utf8").split(/\r?\n/).filter((l) => l.trim());
const WPS = 2.75, PAUSE = 0.18, LEAD = 0.35;

const words = [];
let t = LEAD;
lines.forEach((line, li) => {
  const ws = line.trim().split(/\s+/);
  const dur = ws.length / WPS;
  ws.forEach((w, i) => {
    const s = t + (i * dur) / ws.length;
    const e = t + ((i + 1) * dur) / ws.length;
    words.push({ word: w, start: +s.toFixed(3), end: +e.toFixed(3) });
  });
  const endsSentence = /[.!?।]["')\]]*\s*$/.test(line);
  t += dur + (endsSentence ? PAUSE : 0);
});

// pad the tail so the last caption stays readable
words[words.length - 1].end = +(words[words.length - 1].end + 0.6).toFixed(3);

writeFileSync("public/words.json", JSON.stringify(words, null, 1) + "\n");
console.log(`words.json: ${words.length} words, total ${t.toFixed(2)}s`);
