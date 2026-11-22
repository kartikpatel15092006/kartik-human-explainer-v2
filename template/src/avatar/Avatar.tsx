// The presenter. Two modes (set AVATAR.mode in brand.ts):
//  "svg" : the code-drawn Kartik (./Kartik.tsx). Real LIP-SYNC — `open` (voice
//          loudness 0..1 per frame, from public/vo-envelope.json) widens the mouth
//          and shows teeth on every voiced syllable, plus the body answers to it.
//  "png" : the still photo pack in public/avatar/<gesture>__<expression>.png
//          (441 files). Photographic, but a still cannot move its mouth — only bob.
import React from "react";
import { Img, staticFile } from "remotion";
import { AVATAR } from "../brand";
import Kartik, { type Expression, type Gesture } from "./Kartik";

const pngFile = (gesture: Gesture, expression: Expression) =>
  `avatar/${AVATAR.variants ? `${gesture}__${expression}` : gesture}.png`;

export const Avatar: React.FC<{ frame: number; fps: number; expression: Expression; gesture: Gesture; open: number; size: number }> = ({
  frame,
  fps,
  expression,
  gesture,
  open,
  size,
}) => {
  const t = frame / fps;
  const voiced = Math.max(0, Math.min(1, open));
  // gamma: quiet syllables still part the lips a little, accents open them wide
  const amp = Math.pow(voiced, 0.7);

  if (AVATAR.mode === "png") {
    return (
      <div
        style={{
          width: size,
          height: size * 1.09,
          transform: `translateY(${Math.sin(t * 1.7) * 3 + amp * 22}px) scale(${1 - amp * 0.015}, ${1 + amp * 0.035})`,
          transformOrigin: "50% 100%",
        }}
      >
        <Img
          src={staticFile(pngFile(gesture, expression))}
          style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: (size * 640) / 600,
        transform: `translateY(${amp * 7}px)`, // body lift on the accent
        transformOrigin: "50% 100%",
      }}
    >
      <Kartik
        frame={frame}
        fps={fps}
        expression={expression}
        gesture={gesture}
        open={amp}
        idle={0.55 + amp * 0.85} // idle sway gains energy with the voice
        size={size}
      />
    </div>
  );
};

export default Avatar;
