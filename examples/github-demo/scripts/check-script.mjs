// Phase 1C check script — captions.txt vs script table vs keywords.json
// Run: node scripts/check-script.mjs [--fix]
// - token count per line + total (CLAUDE.md §9: 130-145 words, lines <= 7)
// - est. start-end per line (draft model: 2.65 words/s, 0.20 s pause after each sentence)
// - warnings: digits, 1-2 char words in a row, brand tokens (hard to time)
// - recomputes keyword indices (token + occurrence) and rewrites keywords.json with --fix
import { readFileSync, writeFileSync } from "node:fs";

const lines = readFileSync("captions.txt", "utf8").split(/\r?\n/).filter((l) => l.trim());
const tokens = [];
const perLine = [];
lines.forEach((line, li) => {
  const words = line.trim().split(/\s+/);
  const start = tokens.length;
  words.forEach((w) => tokens.push(w));
  perLine.push({ line: li + 1, text: line, n: words.length, start, end: tokens.length - 1 });
});

console.log("== captions.txt ==");
perLine.forEach((p) => console.log(`L${String(p.line).padStart(2)} n=${p.n} tokens ${p.start}..${p.end}  ${p.text}`));
const total = tokens.length;
console.log(`TOTAL TOKENS: ${total}`);

// Draft estimate: pause only where a line ends like a sentence. Actual timing
// is aligned to the provided voice-over later, so this is never render timing.
const WPS = 2.75, PAUSE = 0.18;
let t = 0.35; // small lead-in before the first word
console.log("\n== est. timings (draft model: 2.75 w/s, 0.18 s after sentence punctuation) ==");
for (const p of perLine) {
  const dur = p.n / WPS;
  const s = t, e = t + dur;
  console.log(`L${String(p.line).padStart(2)}  ${s.toFixed(2)}s - ${e.toFixed(2)}s`);
  const endsSentence = /[.!?।][\"')\]]*\s*$/.test(p.text);
  t = e + (endsSentence ? PAUSE : 0);
}
console.log(`EST TOTAL: ${t.toFixed(2)}s`);

// warnings
console.log("\n== warnings ==");
const warns = [];
tokens.forEach((w, i) => {
  if (/^\d+$/.test(w)) warns.push(`digit token @${i}: "${w}"`);
  if (w.length <= 2) warns.push(`very short token @${i}: "${w}"`);
});
// runs of short words
for (let i = 0; i + 2 < tokens.length; i++) {
  if (tokens[i].length <= 2 && tokens[i + 1].length <= 2) warns.push(`2 short words in a row @${i}: "${tokens[i]}" "${tokens[i + 1]}"`);
}
console.log(warns.length ? warns.join("\n") : "none");

// keywords — the wanted list comes FROM keywords.json (token + occurrence),
// so this script works for any script without edits.
const kwPath = "keywords.json";
const kw = JSON.parse(readFileSync(kwPath, "utf8"));
if (!Array.isArray(kw.keywords)) throw new Error("keywords.json must contain a keywords array");
console.log("\n== keywords ==");
const wanted = kw.keywords.map((k) => [k.token, k.occurrence ?? 1]);
const find = (tok, occ) => {
  let seen = 0;
  for (let i = 0; i < tokens.length; i++) if (tokens[i] === tok && ++seen === occ) return i;
  return -1;
};
const resolved = wanted.map(([tok, occ]) => ({ token: tok, occurrence: occ, index: find(tok, occ) }));
resolved.forEach((r) => console.log(`"${r.token}"#${r.occurrence} -> index ${r.index}`));
if (process.argv.includes("--fix")) {
  writeFileSync(kwPath, JSON.stringify({ keywords: resolved }, null, 2) + "\n");
  console.log("keywords.json rewritten with resolved indices");
} else {
  const stale = resolved.filter((r, i) => !(kw.keywords[i] && kw.keywords[i].index === r.index));
  if (stale.length) console.log(`NOTE: ${stale.length} keyword indices in keywords.json are stale (run with --fix)`);
  else console.log("keywords.json indices are correct");
}
