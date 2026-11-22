import React from "react";
import { Composition } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./layout";
import { DURATION } from "./reel/data";
import { Reel } from "./reel/Reel";

// Phase 2 — the reel. Audio stays empty until Phase 3 (public/vo.wav).
export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={DURATION}
    defaultProps={{ audio: "vo.wav" }}
  />
);
