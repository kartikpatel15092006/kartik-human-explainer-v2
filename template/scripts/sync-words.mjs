// Phase 3 — post-align fixes for captions.words.json → public/words.json.
// Only handles cases align.py cannot: Whisper compound words that swallowed two
// caption words, leaving one filled word < 0.1s ("words stuck in under 0.1
// second" from the kit checklist). Each fix is a named rule below.
// Run AFTER: .venv/Scripts/python.exe tools/caption-sync-kit/align.py
//   --words words-plain.json --captions captions.txt --audio public/vo.wav
import { readFileSync, writeFileSync } from "node:fs";

const words = JSON.parse(readFileSync("captions-plain.json", "utf8"));
const fixes = [];

// rule "compound-split": a filled word with duration < 0.1s whose previous word
// is much longer (> 0.45s) -> divide the previous word's span between them
// (Whisper transcribed both as one compound word).
for (let i = 1; i < words.length; i++) {
  const a = words[i - 1], b = words[i];
  if (b.end - b.start < 0.1 && a.end - a.start > 0.45 && b.end <= a.end + 0.12) {
    const mid = (a.start + a.end) / 2;
    const aEnd = a.end;
    fixes.push(`compound-split @${i} "${a.word}+${b.word}": ${a.start.toFixed(2)}-${aEnd.toFixed(2)} -> ${a.start.toFixed(2)}-${mid.toFixed(2)} + ${mid.toFixed(2)}-${aEnd.toFixed(2)}`);
    a.end = +mid.toFixed(3);
    b.start = +mid.toFixed(3);
    b.end = aEnd;
  }
}

// sanity: monotonic, all spoken
for (let i = 1; i < words.length; i++) {
  if (words[i].start < words[i - 1].start) throw new Error(`non-monotonic @${i}`);
}

writeFileSync("public/words.json", JSON.stringify(words, null, 1) + "\n");
console.log(`public/words.json: ${words.length} words, last end ${words[words.length - 1].end}s`);
console.log(fixes.length ? fixes.join("\n") : "no fixes needed");
