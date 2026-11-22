// Canvas + zones for a 9:16 reel, style v2 (measured at 720x1280 and scaled x1.5).
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

// Vertical map (px @1080x1920). Everything is a % of the canvas so it also
// holds if you render at 720x1280 (just change WIDTH/HEIGHT and scale = 2/3).
export const ZONES = {
  // white title card with progress dots
  title: { x: 140, y: 98, width: 800, height: 106 },
  // live caption text (left aligned, max 2 lines)
  caption: { x: 135, y: 262, width: 760, lineHeight: 93, fontSize: 78 },
  // the "scene world" stage — all beat visuals live here
  stage: { x: 70, y: 600, width: 940, height: 1010 },
  // presenter: bottom-right, cropped by the bottom edge
  avatar: { right: -10, bottom: -60, size: 700 },
};

// Instagram overlays (approximate) — nothing important below this line on the left side.
export const SAFE = { top: 200, bottom: 330, right: 110, left: 60 };
export const SAFE_BOX = {
  x: SAFE.left,
  y: SAFE.top,
  width: WIDTH - SAFE.left - SAFE.right,
  height: HEIGHT - SAFE.top - SAFE.bottom,
};
