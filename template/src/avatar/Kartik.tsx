import React from "react";

/* ------------------------------------------------------------------ */
/*  Kartik v3 — drawn from the owner's photo: side-swept black hair,   */
/*  side-swept quiff, clean-shaven (thin moustache only), no glasses, gold earring, */
/*  rust zip jacket over a lavender tee. Pure SVG, deterministic.      */
/*                                                                     */
/*  expression: 20 names (EXPRESSION_NAMES)                             */
/*  gesture:    20 hand poses + none (GESTURE_NAMES)                   */
/*  open: 0..1 extra mouth opening (drive from the spoken word)        */
/*                                                                     */
/*  Want the exact Bitmoji/own-art look? Drop pose PNGs in              */
/*  public/avatar/ and set AVATAR.mode = "png" in brand.ts.            */
/* ------------------------------------------------------------------ */

export const EXPRESSION_NAMES = [
  "neutral", "happy", "laugh", "excited", "surprised", "shocked", "wink", "smirk", "thinking", "confused",
  "skeptical", "sad", "worried", "angry", "proud", "sleepy", "embarrassed", "smug", "love", "determined",
] as const;
export type Expression = (typeof EXPRESSION_NAMES)[number];
export type Gesture =
  | "none" | "pointUp" | "present" | "coverMouth" | "thumbsUp" | "chest" | "fistsUp" | "chin" | "coverEye"
  | "wave" | "peace" | "ok" | "stop" | "thanks" | "clap" | "shrug" | "thumbsDown" | "pointLeft" | "scratchHead" | "temple" | "crossArms";
export const GESTURE_NAMES: Gesture[] = [
  "none", "pointUp", "present", "coverMouth", "thumbsUp", "chest", "fistsUp", "chin", "coverEye",
  "wave", "peace", "ok", "stop", "thanks", "clap", "shrug", "thumbsDown", "pointLeft", "scratchHead", "temple", "crossArms",
];

const C = {
  skin: "#D9A47C", skinShade: "#C58E66", skinDeep: "#A8714D",
  hair: "#141416", hairHi: "#34343C",
  jacket: "#C4644A", jacketHi: "#DB7A5F", jacketDark: "#A44D38", stitch: "#EBAA90",
  tee: "#E9E5F3", teeShade: "#CFC9E0", gold: "#D9B44A",
  frame: "#323A49", lens: "rgba(190,215,240,0.20)",
  mouthIn: "#5A1E22", lip: "#B8705F", tongue: "#D96A7A", white: "#FFFFFF", iris: "#3A2418",
};

/* ------------------------- arms + hands (v3.2, from the owner's fixed set) -------------------------
   Sleeves are straight tapered trapezoids that rise from the bottom edge (or end in a round cap at the
   frame edge), with a ribbed cuff. Hands are drawn in a local frame whose origin is the cuff's top edge,
   fingers pointing up (-y). All positions are in the avatar viewBox (-50..650 x 0..640).               */
const HAND_SCALE = 1.14; // the owner's hands are chunkier than the first draft
const LINE = "#B87A55"; // skin outline
const sk = { fill: C.skin, stroke: LINE, strokeWidth: 3, strokeLinejoin: "round" as const };

type FingerSpec = { x: number; y: number; ang: number; len: number; w?: number };
type HandSpec = {
  kind: "fist" | "open" | "ok";
  fingers?: FingerSpec[]; // extra extended fingers on a fist (index, middle…)
  thumb?: { x: number; y: number; ang: number; len: number }; // extended thumb on a fist
  fan?: number; // open hand: 1 = spread, 0.3 = fingers together
};
type ArmSpec = {
  cuff: [number, number]; // cuff centre
  ang: number; // arm direction toward the hand, degrees clockwise from up
  hrot?: number; // absolute hand rotation (defaults to ang)
  len?: number; // sleeve length behind the cuff (default off-canvas)
  cap?: boolean; // round end cap (sleeve ends inside the frame)
  via?: [number, number]; // elbow for a bent arm: cuff -> via -> viaEnd (round end)
  viaEnd?: [number, number];
  mirror?: boolean; // left-hand version
  hand: HandSpec;
};
type Pose = { arms?: ArmSpec[]; fx?: "clap" | "wave" };

const idx = (x: number, ang: number, len = 92): FingerSpec => ({ x, y: -74, ang, len, w: 22 });
const FIST: HandSpec = { kind: "fist" };
const OPEN: HandSpec = { kind: "open", fan: 1 };

const POSES: Record<Gesture, Pose> = {
  none: {},
  pointUp: { arms: [{ cuff: [520, 384], ang: -9.7, hand: { kind: "fist", fingers: [idx(-12, -6, 102)] } }] },
  present: { arms: [{ cuff: [26, 486], ang: 2.2, mirror: true, hand: OPEN }, { cuff: [587, 575], ang: 9.1, hrot: 24, hand: OPEN }] },
  coverMouth: { arms: [{ cuff: [193, 448], ang: 38.4, hrot: 46, mirror: true, hand: { kind: "open", fan: 0.35 } }, { cuff: [391, 419], ang: -36, hrot: -44, hand: { kind: "open", fan: 0.35 } }] },
  thumbsUp: { arms: [{ cuff: [511, 444], ang: -13.4, hand: { kind: "fist", thumb: { x: -20, y: -66, ang: -18, len: 62 } } }] },
  chest: { arms: [{ cuff: [418, 573], ang: -52, hand: { kind: "open", fan: 0.7 } }] },
  fistsUp: { arms: [{ cuff: [38, 383], ang: 7.1, mirror: true, hand: FIST }, { cuff: [561, 383], ang: -7.1, hand: FIST }] },
  chin: { arms: [{ cuff: [440, 460], ang: -30.5, hand: { kind: "fist", fingers: [idx(-14, -4, 38)] } }] },
  coverEye: { arms: [{ cuff: [234, 307], ang: 35.6, mirror: true, hand: { kind: "open", fan: 0.5 } }] },
  wave: { arms: [{ cuff: [511, 425], ang: -12.4, hand: OPEN }], fx: "wave" },
  peace: { arms: [{ cuff: [511, 425], ang: -12.4, hand: { kind: "fist", fingers: [idx(-18, -20), idx(6, 2)] } }] },
  ok: { arms: [{ cuff: [511, 425], ang: -12.4, hand: { kind: "ok", fan: 1 } }] },
  stop: { arms: [{ cuff: [511, 425], ang: -12.4, hand: { kind: "open", fan: 0.6 } }] },
  thanks: { arms: [{ cuff: [279, 611], ang: 64.7, hrot: 3, mirror: true, hand: { kind: "open", fan: 0.25 } }, { cuff: [320, 612], ang: -63.2, hrot: -3, hand: { kind: "open", fan: 0.25 } }] },
  clap: { arms: [{ cuff: [239, 620], ang: 63.3, hrot: 16, mirror: true, hand: { kind: "open", fan: 0.8 } }, { cuff: [360, 620], ang: -63.3, hrot: -16, hand: { kind: "open", fan: 0.8 } }], fx: "clap" },
  shrug: { arms: [{ cuff: [19, 551], ang: -10, mirror: true, hand: OPEN }, { cuff: [580, 551], ang: 10, hand: OPEN }] },
  thumbsDown: { arms: [{ cuff: [500, 571], ang: -68.5, len: 88, cap: true, hand: { kind: "fist", thumb: { x: -22, y: -30, ang: -112, len: 62 } } }] },
  pointLeft: { arms: [{ cuff: [458, 544], ang: -63.6, len: 140, cap: true, hand: { kind: "fist", fingers: [idx(-12, -26, 84)] } }] },
  scratchHead: { arms: [{ cuff: [472, 269], ang: -36.9, via: [596, 468], viaEnd: [468, 780], hand: { kind: "open", fan: 0.9 } }] },
  temple: { arms: [{ cuff: [468, 365], ang: -21.3, hand: { kind: "fist", fingers: [idx(-14, -10, 68)] } }] },
  crossArms: { arms: [{ cuff: [350, 547], ang: 79.5, len: 326, cap: true, mirror: true, hand: FIST }, { cuff: [245, 602], ang: -86.4, len: 326, cap: true, hand: FIST }] },
};

/* ---- hands ---- */
const FingerShape: React.FC<{ f: FingerSpec }> = ({ f }) => {
  const w = f.w ?? 17;
  return <rect x={f.x - w / 2} y={f.y - f.len} width={w} height={f.len + 10} rx={w / 2} {...sk} transform={`rotate(${f.ang} ${f.x} ${f.y})`} />;
};

const HandDraw: React.FC<{ h: HandSpec }> = ({ h }) => {
  if (h.kind === "fist") {
    return (
      <g>
        {h.fingers?.map((f, i) => <FingerShape key={i} f={f} />)}
        {h.thumb ? <FingerShape f={{ x: h.thumb.x, y: h.thumb.y, ang: h.thumb.ang, len: h.thumb.len, w: 25 }} /> : null}
        <path d="M-32 2 L-33 -46 C-33 -72 -12 -84 4 -84 C26 -84 34 -66 33 -46 L32 2Z" {...sk} />
        <path d="M-14 -80 L-12 -55 M3 -83 L5 -54 M20 -78 L21 -55" stroke={LINE} strokeWidth={3} strokeLinecap="round" fill="none" />
        <path d="M-33 -50 Q0 -41 33 -55" stroke={LINE} strokeWidth={3} fill="none" strokeLinecap="round" />
        {!h.thumb ? (<>
          <path d="M-28 -32 C-6 -44 14 -38 22 -26" stroke={LINE} strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={22} cy={-25} r={9} {...sk} />
        </>) : null}
      </g>
    );
  }
  const f = h.fan ?? 1;
  const bases = h.kind === "ok" ? [-2, 12, 26] : [-22, -7, 8, 23];
  const angs = (h.kind === "ok" ? [-4, 4, 12] : [-14, -5, 4, 12]).map((a) => a * f);
  const lens = (h.kind === "ok" ? [68, 66, 54] : [60, 70, 67, 55]).map((n) => n * 1.14);
  return (
    <g>
      {h.kind === "open" ? <FingerShape f={{ x: -27, y: -22, ang: -58 * (0.5 + 0.5 * f) - 10, len: 40, w: 19 }} /> : null}
      {bases.map((x, i) => <FingerShape key={i} f={{ x, y: -54, ang: angs[i], len: lens[i], w: 17 }} />)}
      <path d="M-31 2 L-31 -34 C-31 -48 -28 -56 -22 -60 L22 -60 C28 -56 31 -48 31 -34 L31 2Z" {...sk} />
      <path d={bases.slice(0, -1).map((x, i) => `M${(x + bases[i + 1]) / 2} -57 v15`).join(" ")} stroke={LINE} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.9} />
      {h.kind === "ok" ? (
        <path d="M-24 -91 a21 21 0 1 0 0.1 0Z M-24 -77 a7 7 0 1 1 -0.1 0Z" fillRule="evenodd" {...sk} />
      ) : null}
    </g>
  );
};

/* ---- sleeves ---- */
const SleeveArm: React.FC<{ a: ArmSpec }> = ({ a }) => {
  const w0 = 72;
  const len = a.len ?? 760;
  const w1 = Math.min(112, w0 + 0.17 * Math.min(len, 300));
  const [cx, cy] = a.cuff;
  const poly = `M${-w0 / 2} 0 L${w0 / 2} 0 L${w1 / 2} ${len} L${-w1 / 2} ${len}Z`;
  const cuff = (<g><rect x={-w0 / 2 - 2} y={-7} width={w0 + 4} height={15} rx={3} fill={C.jacketDark} /><path d={`M${-w0 / 2} -3 H${w0 / 2}`} stroke={C.jacketHi} strokeWidth={2} opacity={0.5} /></g>);
  if (a.via) {
    const [vx, vy] = a.via;
    const far: [number, number] = a.viaEnd ?? [vx - 90, 760];
    const d = `M${cx} ${cy} L${vx} ${vy} L${far[0]} ${far[1]}`;
    return (
      <g>
        <path d={d} stroke={C.jacketDark} strokeWidth={w0 + 8} strokeLinecap="butt" strokeLinejoin="round" fill="none" />
        <path d={d} stroke={C.jacket} strokeWidth={w0} strokeLinecap="butt" strokeLinejoin="round" fill="none" />
        <path d={d} stroke={C.jacketHi} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.5} transform="translate(-12 -6)" />
        <g transform={`translate(${cx} ${cy}) rotate(${a.ang})`}>{cuff}</g>
      </g>
    );
  }
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${a.ang + 180}) scale(-1 -1)`}>
      {/* local frame: +y runs back along the sleeve */}
      <g transform="scale(1 1)">
        <path d={poly} stroke={C.jacketDark} strokeWidth={8} strokeLinejoin="round" fill={C.jacketDark} />
        {a.cap ? <circle cx={0} cy={len} r={w1 / 2 + 4} fill={C.jacketDark} /> : null}
        <path d={poly} fill={C.jacket} />
        {a.cap ? <circle cx={0} cy={len} r={w1 / 2} fill={C.jacket} /> : null}
        <path d={`M${-w0 * 0.2} 8 L${-w1 * 0.2} ${len}`} stroke={C.jacketHi} strokeWidth={5} strokeLinecap="round" opacity={0.55} />
        <path d={`M${w0 * 0.3} 20 L${w1 * 0.3} ${Math.min(len, 150)}`} stroke={C.jacketDark} strokeWidth={3} strokeLinecap="round" opacity={0.35} />
        {cuff}
      </g>
    </g>
  );
};

/* ------------------------------ expressions ------------------------------ */
type EyeKind = "normal" | "arc" | "heart" | "dash";
type MouthKind = "smile" | "softgrin" | "grin" | "laugh" | "o" | "bigO" | "flat" | "frown" | "smirk" | "wavy" | "pout" | "clench";
type Ex = {
  brow: [number, number, number, number]; // [Ldy, Ltilt, Rdy, Rtilt]  tilt>0 = inner end lower (angry), <0 inner end higher (sad)
  lid: [number, number]; // 0 open … 1 closed, negative = wide
  look: [number, number]; // pupil offset
  eye?: EyeKind | [EyeKind, EyeKind];
  mouth: MouthKind;
  blush?: number; sweat?: boolean; tear?: boolean; vein?: boolean; sparkle?: boolean; zzz?: boolean;
};
const EX: Record<Expression, Ex> = {
  neutral:     { brow: [0, 0, 0, 0], lid: [0.05, 0.05], look: [0, 0], mouth: "smile" },
  happy:       { brow: [-4, 0, -4, 0], lid: [0.12, 0.12], look: [0, 0], mouth: "softgrin", blush: 0.25 },
  laugh:       { brow: [-8, -2, -8, -2], lid: [0, 0], look: [0, 0], eye: "arc", mouth: "laugh", blush: 0.3 },
  excited:     { brow: [-14, -2, -14, -2], lid: [-0.3, -0.3], look: [0, -1], mouth: "grin", sparkle: true },
  surprised:   { brow: [-16, 0, -16, 0], lid: [-0.35, -0.35], look: [0, 0], mouth: "o" },
  shocked:     { brow: [-22, -3, -22, -3], lid: [-0.5, -0.5], look: [0, 0], mouth: "bigO" },
  wink:        { brow: [-6, 0, 0, 0], lid: [0.05, 0], look: [0, 0], eye: ["normal", "arc"], mouth: "softgrin" },
  smirk:       { brow: [-2, 0, -8, -2], lid: [0.25, 0.2], look: [3, 0], mouth: "smirk" },
  thinking:    { brow: [-10, -2, 0, 3], lid: [0.1, 0.1], look: [-6, -6], mouth: "pout" },
  confused:    { brow: [-12, -4, 2, 5], lid: [0.05, 0.1], look: [5, -2], mouth: "wavy" },
  skeptical:   { brow: [-16, 0, 4, 4], lid: [0.3, 0.35], look: [6, 0], mouth: "flat" },
  sad:         { brow: [2, -9, 2, -9], lid: [0.3, 0.3], look: [0, 4], mouth: "frown", tear: true },
  worried:     { brow: [-6, -10, -6, -10], lid: [0, 0], look: [-3, 2], mouth: "wavy", sweat: true },
  angry:       { brow: [6, 11, 6, 11], lid: [0.15, 0.15], look: [0, 0], mouth: "clench", vein: true },
  proud:       { brow: [-6, 0, -6, 0], lid: [0.5, 0.5], look: [0, -3], eye: "arc", mouth: "smile", blush: 0.2 },
  sleepy:      { brow: [4, -3, 4, -3], lid: [0.8, 0.8], look: [0, 3], eye: "dash", mouth: "pout", zzz: true },
  embarrassed: { brow: [-4, -7, -4, -7], lid: [0.15, 0.15], look: [-7, 3], mouth: "wavy", blush: 0.8, sweat: true },
  smug:        { brow: [-2, 3, -10, -3], lid: [0.42, 0.42], look: [0, 0], mouth: "smirk" },
  love:        { brow: [-8, -3, -8, -3], lid: [0, 0], look: [0, 0], eye: "heart", mouth: "grin", blush: 0.6 },
  determined:  { brow: [4, 7, 4, 7], lid: [0.12, 0.12], look: [0, 0], mouth: "clench" },
};

const MOUTH = (kind: MouthKind, open: number) => {
  const cy = 354;
  const mo = Math.min(1, Math.max(0, open));
  // corner dy for left/right, upper/lower control offsets, half width
  type M = { w: number; cl: number; cr: number; up: number; low: number; teeth?: boolean; tongue?: boolean; round?: [number, number] };
  const base: Record<MouthKind, M> = {
    flat: { w: 20, cl: 0, cr: 0, up: 0, low: 0 },
    smile: { w: 30, cl: -15, cr: -15, up: 10, low: 22 },
    softgrin: { w: 32, cl: -15, cr: -15, up: 6, low: 28, teeth: true },
    grin: { w: 31, cl: -9, cr: -9, up: 3, low: 30, teeth: true },
    laugh: { w: 35, cl: -12, cr: -12, up: 2, low: 46, teeth: true, tongue: true },
    o: { w: 0, cl: 0, cr: 0, up: 0, low: 0, round: [10, 13] },
    bigO: { w: 0, cl: 0, cr: 0, up: 0, low: 0, round: [17, 27] },
    frown: { w: 22, cl: 8, cr: 8, up: -9, low: -9 },
    smirk: { w: 24, cl: 2, cr: -11, up: 3, low: 6 },
    wavy: { w: 24, cl: 0, cr: 0, up: 0, low: 0 },
    pout: { w: 10, cl: 0, cr: 0, up: -3, low: 4 },
    clench: { w: 28, cl: 1, cr: 1, up: -2, low: 12, teeth: true },
  };
  const m = { ...base[kind] };
  // speech: closed shapes open with the voice, but never past the chin
  if (!m.round && kind !== "wavy" && mo > 0.12) {
    const room = Math.max(0, 44 - m.low); // 44 = widest a mouth can open on this face
    m.low += Math.min(room, mo * (kind === "laugh" ? 6 : 22));
    m.teeth = m.teeth || mo > 0.3;
  }
  return { m, cy, mo };
};

const Eye: React.FC<{ cx: number; kind: EyeKind; lid: number; look: [number, number]; left: boolean }> = ({ cx, kind, lid, look, left }) => {
  const cy = 247;
  if (kind === "arc") return <path d={`M${cx - 19} ${cy + 4} Q${cx} ${cy - 17} ${cx + 19} ${cy + 4}`} stroke={C.hair} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
  if (kind === "dash") return <path d={`M${cx - 17} ${cy + 3} Q${cx} ${cy + 11} ${cx + 17} ${cy + 3}`} stroke={C.hair} strokeWidth={5} fill="none" strokeLinecap="round" />;
  if (kind === "heart") return <path d={`M${cx} ${cy + 19} C${cx - 32} ${cy - 2} ${cx - 15} ${cy - 22} ${cx} ${cy - 8} C${cx + 15} ${cy - 22} ${cx + 32} ${cy - 2} ${cx} ${cy + 19}Z`} fill="#E5304F" stroke="#B01E38" strokeWidth={1.5} />;
  const cover = Math.max(-0.6, Math.min(1, lid));
  const ry = Math.max(1.6, 13 * (1 - cover * 0.9));
  const rx = 18 + (cover < 0 ? -cover * 4 : 0);
  const px = cx + look[0] * 1.1 + (left ? 1 : -1);
  const py = cy + look[1] * 0.8;
  const ir = Math.min(10, ry - 0.6);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.white} />
      {ry > 3 && <circle cx={px} cy={py} r={Math.max(2, ir)} fill={C.iris} />}
      {ry > 5 && <circle cx={px} cy={py} r={Math.max(1.4, ir * 0.45)} fill="#0b0605" />}
      {ry > 6 && <circle cx={px - ir * 0.35} cy={py - ir * 0.4} r={Math.max(1, ir * 0.22)} fill="#fff" opacity={0.9} />}
      {/* upper lid line + soft eyelid crease */}
      <path d={`M${cx - rx - 1.5} ${cy - ry * 0.3} Q${cx} ${cy - ry - 5} ${cx + rx + 1.5} ${cy - ry * 0.3}`} stroke={C.hair} strokeWidth={4.2} fill="none" strokeLinecap="round" />
      <path d={`M${cx - rx + 2} ${cy - ry - 7} Q${cx} ${cy - ry - 13} ${cx + rx - 2} ${cy - ry - 7}`} stroke={C.skinDeep} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.45} />
    </g>
  );
};

export const Kartik: React.FC<{
  frame?: number; fps?: number; expression?: Expression; gesture?: Gesture;
  open?: number; blink?: "auto" | number | false; idle?: number; size?: number; style?: React.CSSProperties;
}> = ({ frame = 0, fps = 30, expression = "neutral", gesture = "none", open = 0.1, blink = "auto", idle = 1, size = 600, style }) => {
  const t = frame / fps;
  const bob = Math.sin(t * 2.1) * 5 * idle;
  const tilt = Math.sin(t * 1.3) * 1.4 * idle;
  const ph = t % 3.4;
  const blinkAmt = blink === false ? 0 : typeof blink === "number" ? blink : ph > 1.6 && ph < 1.8 ? Math.max(0, 1 - Math.abs(ph - 1.7) * 11) : 0;
  const pose = POSES[gesture] ?? POSES.none;
  const ex = EX[expression] ?? EX.neutral;
  const kinds: [EyeKind, EyeKind] = Array.isArray(ex.eye) ? ex.eye : [ex.eye ?? "normal", ex.eye ?? "normal"];
  const lidL = ex.lid[0] + (kinds[0] === "normal" ? blinkAmt : 0);
  const lidR = ex.lid[1] + (kinds[1] === "normal" ? blinkAmt : 0);
  const { m, cy, mo } = MOUTH(ex.mouth, open);

  // eyebrows: outer end at x=222/378, inner end at 288/312
  const brow = (outer: number, inner: number, dy: number, tl: number) => (
    <path d={`M${outer} ${216 + dy - tl * 0.1} Q${(outer + inner) / 2} ${207 + dy - Math.abs(tl) * 0.15} ${inner} ${217 + dy + tl}`} stroke={C.hair} strokeWidth={10} fill="none" strokeLinecap="round" />
  );

  // mouth
  const wl = 300 - m.w, wr = 300 + m.w;
  let mouth: React.ReactNode;
  if (m.round) {
    const [rx, ry] = m.round;
    mouth = (<g><ellipse cx={300} cy={cy + ry * 0.4} rx={rx} ry={ry + mo * 8} fill={C.mouthIn} stroke={C.lip} strokeWidth={3} /><ellipse cx={300} cy={cy + ry * 0.4 + ry * 0.55} rx={rx * 0.6} ry={ry * 0.35} fill={C.tongue} /></g>);
  } else if (ex.mouth === "wavy") {
    mouth = <path d={`M${wl} ${cy} q${m.w / 4} -9 ${m.w / 2} 0 t${m.w / 2} 0 t${m.w / 2} 0 t${m.w / 2} 0`} stroke={C.lip} strokeWidth={4} fill="none" strokeLinecap="round" />;
  } else {
    const upper = `M${wl} ${cy + m.cl} Q300 ${cy + m.up - 2} ${wr} ${cy + m.cr}`;
    const lower = `Q300 ${cy + m.low + 4} ${wl} ${cy + m.cl}Z`;
    const openMouth = m.low - m.up > 12;
    mouth = (
      <g>
        {openMouth ? (<>
          <path d={`${upper} ${lower}`} fill={C.mouthIn} />
          {m.tongue && <ellipse cx={300} cy={cy + m.low * 0.55} rx={m.w * 0.5} ry={m.low * 0.22} fill={C.tongue} />}
          {m.teeth && <path d={`M${wl + 5} ${cy + m.cl + 1} Q300 ${cy + m.up - 1} ${wr - 5} ${cy + m.cr + 1} L${wr - 6} ${cy + m.cr + 9} Q300 ${cy + m.up + 8} ${wl + 6} ${cy + m.cl + 9}Z`} fill={C.white} />}
        </>) : null}
        {!openMouth ? <path d={`M${wl + 2} ${cy + m.cl} Q300 ${cy + m.up - 2} ${wr - 2} ${cy + m.cr} Q300 ${cy + Math.min(m.low, 14) + 12} ${wl + 2} ${cy + m.cl}Z`} fill="#C57F70" /> : null}
        <path d={openMouth ? upper : `M${wl} ${cy + m.cl} Q300 ${cy + m.up - 2} ${wr} ${cy + m.cr}`} stroke="#7C3A33" strokeWidth={4.5} fill="none" strokeLinecap="round" />
        {ex.mouth === "clench" && !openMouth ? null : null}
      </g>
    );
  }

  return (
    <svg viewBox="0 0 600 640" width={size} height={(size * 640) / 600} style={{ overflow: "visible", ...style }}>
      <g transform={`translate(0 ${bob}) rotate(${tilt} 300 520)`}>

        {/* ---- neck (drawn BEFORE torso so the collar overlaps it) ---- */}
        <path d="M258 366 C262 420 262 452 252 486 L348 486 C338 452 338 420 342 366Z" fill={C.skin} />
        <path d="M258 366 C262 420 262 452 252 486 L276 486 C274 450 276 420 280 372Z" fill={C.skinShade} opacity={0.5} />
        {/* shadow cast by the jaw onto the neck */}
        <path d="M256 372 Q300 428 344 372 L344 398 Q300 440 256 398Z" fill={C.skinDeep} opacity={0.5} />

        {/* ---- torso: jacket base, tee, open collar ---- */}
        <path d="M20 664 C20 544 92 488 204 466 L396 466 C508 488 580 544 580 664Z" fill={C.jacket} />
        <path d="M40 664 C40 560 100 506 190 482" stroke={C.jacketHi} strokeWidth={7} fill="none" opacity={0.55} strokeLinecap="round" />
        <path d="M130 520 Q150 590 140 664" stroke={C.jacketDark} strokeWidth={4} fill="none" opacity={0.5} />
        <path d="M470 520 Q450 590 460 664" stroke={C.jacketDark} strokeWidth={4} fill="none" opacity={0.5} />
        <path d="M250 440 L350 440 L358 472 Q300 504 242 472Z" fill={C.skin} />
        {/* tee panel between the lapels */}
        <path d="M244 462 Q300 504 356 462 L382 664 L218 664Z" fill={C.tee} />
        <path d="M246 464 Q300 508 354 464" stroke={C.teeShade} strokeWidth={9} fill="none" strokeLinecap="round" />
        {/* zip lines + stitches along both lapel edges */}
        <path d="M244 462 L218 664" stroke={C.jacketDark} strokeWidth={5} />
        <path d="M356 462 L382 664" stroke={C.jacketDark} strokeWidth={5} />
        <path d="M250 480 L226 664" stroke={C.stitch} strokeWidth={2.5} strokeDasharray="7 7" />
        <path d="M350 480 L374 664" stroke={C.stitch} strokeWidth={2.5} strokeDasharray="7 7" />
        {/* stand-up collars */}
        <path d="M200 470 C204 440 232 418 266 410 L274 446 L252 492 L212 508Z" fill={C.jacketDark} />
        <path d="M204 468 C210 444 234 426 262 418" stroke={C.stitch} strokeWidth={2.5} fill="none" strokeDasharray="6 6" />
        <path d="M400 470 C396 440 368 418 334 410 L326 446 L348 492 L388 508Z" fill={C.jacketDark} />
        <path d="M396 468 C390 444 366 426 338 418" stroke={C.stitch} strokeWidth={2.5} fill="none" strokeDasharray="6 6" />
        {/* thin gold chain */}
        <path d="M268 468 Q300 500 332 468" stroke={C.gold} strokeWidth={3} fill="none" strokeDasharray="1 4" strokeLinecap="round" />

        {/* ---- head ---- */}
        <ellipse cx={199} cy={272} rx={15} ry={27} fill={C.skinShade} />
        <ellipse cx={401} cy={272} rx={15} ry={27} fill={C.skinShade} />
        <path d="M197 262 q-8 10 0 20" stroke={C.skinDeep} strokeWidth={3} fill="none" opacity={0.6} />
        <circle cx={403} cy={303} r={7.5} fill="none" stroke={C.gold} strokeWidth={3.2} />
        <path d="M200 250 C200 170 244 140 300 140 C356 140 400 170 400 250 C400 322 372 388 300 394 C228 388 200 322 200 250Z" fill={C.skin} />
        {/* cheek / jaw shade */}
        <path d="M206 290 C214 346 244 386 300 392 C268 372 240 340 232 300Z" fill={C.skinShade} opacity={0.45} />
        {/* nose */}
        <path d="M297 258 Q289 288 297 297 Q306 302 316 295" stroke={C.skinDeep} strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={300} cy={298} rx={13} ry={4} fill={C.skinDeep} opacity={0.25} />

        {/* hair: one clean side-swept mass (high hairline, sweep to the viewer's left), tapered sideburns */}
        <path d="M404 250 C404 222 396 202 384 190 L386 240 C388 262 392 282 394 298 C399 282 403 266 404 250Z" fill={C.hair} />
        <path d="M196 250 C196 224 204 206 216 198 L214 240 C212 262 208 282 206 298 C201 282 197 266 196 250Z" fill={C.hair} />
        <path d="M204 266 C188 168 212 112 268 94 C326 76 398 98 408 172 C414 208 410 242 402 270 C398 232 394 204 378 186 C348 170 306 176 268 190 C246 198 230 208 220 226 C212 238 208 252 204 266Z" fill={C.hair} />
        {/* strand highlights flowing from the crown toward the sweep */}
        <path d="M262 108 C304 90 356 98 392 130" stroke={C.hairHi} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
        <path d="M240 140 C284 114 338 118 380 150" stroke={C.hairHi} strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.6} />
        <path d="M232 176 C276 150 330 150 372 176" stroke={C.hairHi} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.5} />

        {/* eyes */}
        <Eye cx={254} kind={kinds[0]} lid={lidL} look={ex.look} left />
        <Eye cx={346} kind={kinds[1]} lid={lidR} look={ex.look} left={false} />
        {/* brows */}
        {brow(222, 288, ex.brow[0], ex.brow[1])}
        {brow(378, 312, ex.brow[2], ex.brow[3])}

        {/* cheeks / extras */}
        {ex.blush ? <g opacity={ex.blush * 0.7}><ellipse cx={240} cy={310} rx={22} ry={11} fill="#E8757F" /><ellipse cx={360} cy={310} rx={22} ry={11} fill="#E8757F" /></g> : null}
        {ex.sweat ? <path d="M404 206 q-14 22 0 32 q14 -10 0 -32Z" fill="#9FD6F2" stroke="#5FA8D3" strokeWidth={2.5} /> : null}
        {ex.tear ? <path d="M232 276 q-9 17 0 24 q9 -7 0 -24Z" fill="#9FD6F2" stroke="#5FA8D3" strokeWidth={2} /> : null}
        {ex.vein ? <g stroke="#D63A3A" strokeWidth={5} strokeLinecap="round" fill="none"><path d="M396 168 l12 -6 M408 176 l12 6 M398 160 l2 -14 M410 168 l16 -4" /></g> : null}
        {ex.sparkle ? <g fill="#F5B82E"><path d="M430 190 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5Z" /><path d="M168 200 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4Z" /></g> : null}
        {ex.zzz ? <g fontFamily="Inter, sans-serif" fontWeight={800} fill="#6B7AB8"><text x={420} y={170} fontSize={34}>z</text><text x={446} y={140} fontSize={26}>z</text></g> : null}

        {/* moustache (thin) then mouth */}
        <path d="M250 334 Q275 325 300 331 Q325 325 350 334 Q325 332 300 336 Q275 332 250 334Z" fill="#2a1f1c" />
        {/* soft shade under the lower lip + smile creases */}
        <ellipse cx={300} cy={382} rx={20} ry={5} fill={C.skinDeep} opacity={0.22} />
        {["softgrin", "grin", "laugh"].includes(ex.mouth) ? (
          <g stroke={C.skinDeep} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.32}>
            <path d={`M${300 - m.w - 5} ${cy - 18} Q${300 - m.w - 11} ${cy - 8} ${300 - m.w - 4} ${cy + 2}`} />
            <path d={`M${300 + m.w + 5} ${cy - 18} Q${300 + m.w + 11} ${cy - 8} ${300 + m.w + 4} ${cy + 2}`} />
          </g>
        ) : null}
        {mouth}
        {/* arms + hands in FRONT of body and face */}
        {pose.arms?.map((a, i) => <SleeveArm key={`arm${i}`} a={a} />)}
        {pose.arms?.map((a, i) => (
          <g key={`hand${i}`} transform={`translate(${a.cuff[0]} ${a.cuff[1]}) rotate(${a.hrot ?? a.ang}) translate(0 -7) scale(${(a.mirror ? -1 : 1) * HAND_SCALE} ${HAND_SCALE})`}><HandDraw h={a.hand} /></g>
        ))}
        {pose.fx === "clap" ? <g stroke="#F5B82E" strokeWidth={6} strokeLinecap="round"><path d="M300 440 v-30 M258 454 l-20 -24 M342 454 l20 -24" /></g> : null}
        {pose.fx === "wave" ? <g stroke="#F5B82E" strokeWidth={6} strokeLinecap="round" fill="none"><path d="M572 292 q20 -32 2 -68" /><path d="M600 300 q28 -40 2 -88" /></g> : null}
      </g>
    </svg>
  );
};

export default Kartik;
