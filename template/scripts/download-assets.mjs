// Download only reviewed, public image URLs listed in the project's assets.json.
// Usage: node scripts/download-assets.mjs [--force]
// Audio and other user files are never read or uploaded by this script.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";

const root = process.cwd();
const manifestPath = resolve(root, "assets.json");
const force = process.argv.includes("--force");
const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);
const extensionsByType = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
};
const maxBytes = 20 * 1024 * 1024;

if (!existsSync(manifestPath)) {
  console.error("assets.json not found in the current project directory");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (!Array.isArray(manifest.assets)) throw new Error("assets.json must contain an assets array");

const safeTarget = (relativePath) => {
  if (typeof relativePath !== "string" || !relativePath.startsWith("public/assets/topic/")) {
    throw new Error(`Asset path must be inside public/assets/topic/: ${relativePath}`);
  }
  const target = resolve(root, relativePath);
  const base = resolve(root, "public/assets/topic") + sep;
  if (!target.startsWith(base)) throw new Error(`Unsafe asset path: ${relativePath}`);
  return target;
};

for (const [index, asset] of manifest.assets.entries()) {
  const label = asset.what || asset.path || `asset ${index + 1}`;
  if (!asset.url || !asset.sourceUrl || !asset.license || !asset.usage || !asset.credit || !asset.path) {
    throw new Error(`${label}: each entry needs url, sourceUrl, license, usage, credit, and path`);
  }
  if (typeof asset.url !== "string") throw new Error(`${label}: provide a direct image file URL in url`);
  const url = new URL(asset.url);
  if (url.protocol !== "https:") throw new Error(`${label}: only HTTPS download URLs are allowed`);
  const target = safeTarget(asset.path);
  const ext = target.slice(target.lastIndexOf(".")).toLowerCase();
  if (!Object.values(extensionsByType).flat().includes(ext)) {
    throw new Error(`${label}: output path must use .png, .jpg, .jpeg, .webp or .avif (SVG is not enabled)`);
  }
  if (existsSync(target) && !force) {
    console.log(`SKIP exists: ${asset.path} (use --force to replace)`);
    continue;
  }

  console.log(`Downloading: ${label}`);
  const response = await fetch(url, { redirect: "follow", headers: { "User-Agent": "kartik-human-explainer-v2/2.0 (local asset fetcher)" } });
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status} from source`);
  if (new URL(response.url).protocol !== "https:") throw new Error(`${label}: redirect left HTTPS`);
  const type = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!allowedTypes.has(type)) throw new Error(`${label}: unexpected content-type ${type || "(missing)"}; use a direct PNG/JPEG/WebP/AVIF image URL (SVG is disabled for safety)`);
  if (!extensionsByType[type].includes(ext)) throw new Error(`${label}: ${type} does not match output extension ${ext}`);
  const declaredSize = Number(response.headers.get("content-length") || 0);
  if (declaredSize > maxBytes) throw new Error(`${label}: exceeds 20 MB limit`);
  if (!response.body) throw new Error(`${label}: response has no body`);
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error(`${label}: exceeds 20 MB limit`);
    }
    chunks.push(Buffer.from(value));
  }
  const bytes = Buffer.concat(chunks);
  if (!bytes.length) throw new Error(`${label}: empty response`);

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, bytes);
  asset.downloadedAt = new Date().toISOString();
  console.log(`SAVED ${asset.path} (${(bytes.length / 1024).toFixed(1)} KB; ${type})`);
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Done. Asset sources and license notes: ${manifestPath}`);
