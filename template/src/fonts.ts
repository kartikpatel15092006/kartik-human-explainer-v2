// Google fonts, loaded once. Remotion waits for them before it renders a frame.
// v2 type system (measured from the @kartik_codes reels):
//   Anton          -> title card (bold condensed caps)
//   SpaceGrotesk   -> live caption text (geometric sans)
//   InstrumentSerif italic -> keyword highlight inside captions + big "feel" words
//   SpaceMono      -> tiny "// label" tags on UI cards
//   Inter          -> UI text inside mock cards/buttons
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadSpaceMono } from "@remotion/google-fonts/SpaceMono";

export const FONTS = {
  Anton: loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  Inter: loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] }).fontFamily,
  InstrumentSerif: loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  SpaceGrotesk: loadSpaceGrotesk("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily,
  SpaceMono: loadSpaceMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily,
};

export type FontName = keyof typeof FONTS;
