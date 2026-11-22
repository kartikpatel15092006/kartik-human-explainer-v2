// Scaffold a new explainer-reel project from the bundled template.
// Usage: node new-reel.mjs <project-name> [parent-dir]
// Creates <parent-dir>/<project-name>/ with the full Remotion starter and
// prints the next steps. Never touches the skill folder itself.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url)); // <skill>/scripts
const template = resolve(here, "..", "template");

const name = process.argv[2];
const parent = resolve(process.argv[3] ?? "..");
if (!name || !/^[a-z0-9][a-z0-9-_]*$/i.test(name)) {
  console.error("Usage: node new-reel.mjs <project-name> [parent-dir]");
  process.exit(1);
}
const target = join(parent, name);
const ignoredDuringScaffold = new Set(["node_modules", "out", ".venv"]);
const filterRuntimeFiles = (source) => {
  const relative = source.slice(template.length).replace(/^[/\\]+/, "");
  if (relative.split(/[\\/]+/).some((part) => ignoredDuringScaffold.has(part))) return false;
  return true;
};
if (existsSync(target)) {
  console.error(`Refusing: ${target} already exists`);
  process.exit(1);
}

mkdirSync(target, { recursive: true });
cpSync(template, target, { recursive: true, filter: filterRuntimeFiles });

console.log(`Created ${target}`);
console.log(`
Next steps (in ${name}):
  1. cd ${name}
  2. npm install
  3. Research topic and plan visuals; record reviewed assets in assets.json
  4. Download reviewed HTTPS assets: npm run assets
  5. Write captions.txt + keywords.json; node scripts/check-script.mjs --fix
  6. Run the local asset audit: node scripts/check-assets.mjs
  7. Drop your voice-over in and convert locally:
     ffmpeg -y -i vo.mp3 -ac 1 -ar 48000 -c:a pcm_s16le public/vo.wav
  8. Whisper sync (see skill SKILL.md Phase 1; audio stays local)
  9. Replace demo GitHub storyboard with your topic -> build -> stills -> render on approval
`);
