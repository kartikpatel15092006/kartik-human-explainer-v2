// Phase 4 — synthesize the reel's SFX set with ffmpeg (local, deterministic, free).
// Every sound is generated from oscillators/filtered noise — no downloads, no licences.
// Run: node scripts/make-sfx.mjs  →  public/sfx/*.wav (stereo 44.1kHz)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const SR = 44100;
const OUT = "public/sfx";
mkdirSync(OUT, { recursive: true });

/** each entry: ffmpeg lavfi inputs + audio filter chain (all as ONE filter graph) */
const SFX = {
  // soft UI "bloop" — beat visual pops in
  pop: {
    input: [`aevalsrc=sin(2*PI*(300-1400*t)*t)*exp(-30*t):d=0.14:s=${SR}`],
    af: "volume=1.1",
  },
  // filtered-noise swell — transition into the next beat
  whoosh: {
    input: [`anoisesrc=color=pink:d=0.5:a=0.7:r=${SR}`],
    af: "highpass=f=260,lowpass=f=2600,afade=t=in:d=0.20,afade=t=out:st=0.26:d=0.24",
  },
  // bell — keyword chip lands
  ding: {
    input: [`aevalsrc=(sin(2*PI*1047*t)+0.4*sin(2*PI*2100*t))*exp(-8*t):d=0.6:s=${SR}`],
    af: "volume=0.9",
  },
  // glitchy crash — laptop dies
  zap: {
    input: [`aevalsrc=sin(2*PI*(200-500*t)*t)*exp(-18*t)+0.3*sin(2*PI*55*t)*exp(-7*t):d=0.32:s=${SR}`],
    af: "volume=1.2",
  },
  // rising noise that cuts — "kaam gayab"
  vanish: {
    input: [`anoisesrc=color=pink:d=0.42:a=0.6:r=${SR}`],
    af: "highpass=f=500,lowpass=f=3800,afade=t=in:d=0.38,volume=1.1",
  },
  // ta-da arpeggio (E5-B5-E6) — Merged / FREE
  chime: {
    input: [
      `aevalsrc=sin(2*PI*659*t)*exp(-10*t):d=0.22:s=${SR}`,
      `aevalsrc=sin(2*PI*988*t)*exp(-10*t):d=0.22:s=${SR}`,
      `aevalsrc=sin(2*PI*1319*t)*exp(-6*t):d=0.55:s=${SR}`,
    ],
    af: "[0]adelay=0[a];[1]adelay=130[b];[2]adelay=260[c];[a][b][c]amix=inputs=3:duration=longest,volume=0.95[out]",
  },
  // double notification pop — comment GIT
  cta: {
    input: [
      `aevalsrc=sin(2*PI*(300-1400*t)*t)*exp(-30*t):d=0.14:s=${SR}`,
      `aevalsrc=sin(2*PI*(420-1800*t)*t)*exp(-30*t):d=0.14:s=${SR}`,
    ],
    af: "[0]adelay=0[a];[1]adelay=140[b];[a][b]amix=inputs=2:duration=longest,volume=1.05[out]",
  },
};

for (const [name, s] of Object.entries(SFX)) {
  const graph =
    s.input.length === 1
      ? `[0:a]${s.af}[out]`
      : s.af; // multi-input sounds carry their own full graph
  execFileSync(
    "ffmpeg",
    [
      "-y", "-loglevel", "error",
      ...s.input.flatMap((i) => ["-f", "lavfi", "-i", i]),
      "-filter_complex", graph,
      "-map", "[out]",
      "-ac", "2", "-ar", String(SR), "-c:a", "pcm_s16le",
      `${OUT}/${name}.wav`,
    ],
    { stdio: "inherit" },
  );
  console.log("made", name);
}
console.log("SFX set done →", OUT);
