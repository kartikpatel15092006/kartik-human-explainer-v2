// Validate every local asset referenced by the storyboard, SFX layer and source manifests.
// Usage: node scripts/check-assets.mjs
import { existsSync, readFileSync } from "node:fs";
import { resolve, sep } from "node:path";

const root = process.cwd();
const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), "utf8"));
const failures = [];
const checkFile = (relative, label) => {
  if (!relative || typeof relative !== "string") {
    failures.push(`${label}: missing local path`);
    return;
  }
  if (/[*?]/.test(relative)) return; // manifest wildcard (for example, a set of emoji files)
  const normalized = relative.replace(/^public\//, "");
  const full = resolve(root, "public", normalized);
  const base = resolve(root, "public") + sep;
  if (!full.startsWith(base)) {
    failures.push(`${label}: unsafe path: ${relative}`);
    return;
  }
  if (!existsSync(full)) failures.push(`${label}: file missing: ${relative}`);
};

const storyboard = readJson("storyboard.json");
const reelSource = readFileSync(resolve(root, "src/reel/Reel.tsx"), "utf8");
const mapBlock = reelSource.match(/const MAP:[\s\S]*?= \{([\s\S]*?)\n\};/);
const mapped = new Set([...((mapBlock?.[1] || "").matchAll(/^\s{2}([A-Za-z][A-Za-z0-9_]*):/gm))].map((match) => match[1]));
if (!mapBlock) failures.push("Could not locate the storyboard visual-component map in Reel.tsx");

for (const beat of storyboard.beats || []) {
  for (const [index, visual] of (beat.visuals || []).entries()) {
    const label = `${beat.id || "beat"} visual ${index + 1} (${visual.component})`;
    if (!mapped.has(visual.component)) failures.push(`${label}: component is not registered in Reel.tsx`);
    const props = visual.props || {};
    if (visual.component === "TopicAssetCard") {
      if (!String(props.src || "").startsWith("assets/topic/")) failures.push(`${label}: src must be inside public/assets/topic/`);
      checkFile(props.src, label);
      if (!props.caption) failures.push(`${label}: add a descriptive caption`);
    }
  }
}

for (const match of reelSource.matchAll(/src:\s*"(sfx\/[^\"]+)"/g)) checkFile(match[1], "SFX");
const visualSource = readFileSync(resolve(root, "src/reel/visuals.tsx"), "utf8");
for (const match of visualSource.matchAll(/hex="([0-9a-f]+)"/gi)) checkFile(`assets/twemoji/${match[1]}.svg`, "Twemoji visual");
const dataSource = readFileSync(resolve(root, "src/reel/data.ts"), "utf8");
const emojiBlock = dataSource.match(/export const PILL_EMOJI:[\s\S]*?= \{([\s\S]*?)\n\};/);
for (const match of (emojiBlock?.[1] || "").matchAll(/:\s*"([0-9a-f]+)"/gi)) checkFile(`assets/twemoji/${match[1]}.svg`, "Topic-pill emoji");

const topicManifest = readJson("assets.json");
for (const asset of topicManifest.assets || []) {
  if (!asset.path || !asset.what || !asset.sourceUrl || !asset.license || !asset.usage || !asset.credit || !asset.url) {
    failures.push(`assets.json entry missing what/url/path/sourceUrl/license/usage/credit: ${JSON.stringify(asset)}`);
    continue;
  }
  if (!asset.path.startsWith("public/assets/topic/")) failures.push(`${asset.what}: path must be in public/assets/topic/`);
  checkFile(asset.path, `assets.json (${asset.what})`);
}

if (existsSync(resolve(root, "demo-assets.json"))) {
  const demoManifest = readJson("demo-assets.json");
  for (const asset of demoManifest.assets || []) {
    if (!asset.file || asset.file.includes("→")) continue; // crop/source description, not a separate local file
    checkFile(asset.file, `demo-assets.json (${asset.what || asset.file})`);
  }
}

if (failures.length) {
  console.error(`Asset audit failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("Asset audit passed: storyboard components, local topic images, Twemoji, SFX and manifests are present.");
