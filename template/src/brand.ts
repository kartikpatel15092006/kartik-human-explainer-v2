// ONE place to make the template yours (style v2 — "scene world" reels).
// Every number below was measured from the four reference reels
// (Sellbird, ChatGPT notes, Untangle-codebase, Free code -> paid service).
import type { FontName } from "./fonts";
import type React from "react";

export type Brand = {
  colors: {
    bg: string; // warm off-white stage
    surface: string; // white UI cards
    text: string; // caption / title ink
    accent: string; // hot pink: highlights, keyword italics, stickers, progress
    accentSoft: string; // pink tint for glows / filled backgrounds
    ink: string; // near-black used for 3D lettering, halftone-to-CTA wipe
    ok: string; // success green (✓ chips)
    water: string; // example world colour (aquarium); worlds bring their own palette
  };
  fonts: { title: FontName; caption: FontName; keyword: FontName; mono: FontName; ui: FontName };
  handle: string; // CTA follow card
};

export const brand: Brand = {
  colors: {
    bg: "#F5F1ED",
    surface: "#FFFFFF",
    text: "#1C1C20",
    accent: "#F4146F",
    accentSoft: "#FDE3EE",
    ink: "#1C1C20",
    ok: "#22A06B",
    water: "#4498B0",
  },
  fonts: { title: "Anton", caption: "SpaceGrotesk", keyword: "InstrumentSerif", mono: "SpaceMono", ui: "Inter" },
  handle: "@kartik_codes",
};

/** Soft card look used by every UI mock (white, hairline border, soft shadow, tiny tilt). */
export const CARD: React.CSSProperties = {
  background: "#FFFFFF",
  border: "2px solid rgba(28,28,32,0.10)",
  borderRadius: 26,
  boxShadow: "0 18px 40px rgba(28,28,32,0.14), 0 3px 8px rgba(28,28,32,0.08)",
};

/** Hot-pink "sticker" look: pill with a darker bottom edge (fake 3D). */
export const STICKER = (accent: string): React.CSSProperties => ({
  background: accent,
  color: "#fff",
  borderRadius: 999,
  boxShadow: `0 8px 0 rgba(120,0,50,0.35), 0 16px 30px rgba(244,20,111,0.30)`,
});

/** Presenter source. "svg" = code-drawn Kartik with real mouth lip-sync. "png" = the bundled photo pack (public/avatar/<gesture>__<expression>.png). */
export const AVATAR: { mode: "svg" | "png"; dir: string; variants: boolean } = { mode: "svg", dir: "avatar", variants: true };
