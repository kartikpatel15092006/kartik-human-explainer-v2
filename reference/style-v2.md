# Style v2 — "scene world" reels (measured from 4 reference reels)

Source reels (all 9:16, 720×1280 exports; numbers below are scaled to 1080×1920):
1. **Free AI Sales Agent** (Sellbird) — 27.5 s, fishing-pier/aquarium world, 5 steps
2. **Ask ChatGPT These 3** — ~24 s, theatre curtain + notebook + fortune teller, 3 prompts
3. **Untangle Your Code** — 28 s, sink hairball → comb → blueprint, 3 steps
4. **Free Code → Paid Service** — ~31 s, three market stalls, 3 projects

Everything here was read off frames (2 fps contact sheets + a few full-res frames). Fonts are best matches, not confirmed.

## 1. Canvas & colour
| token | value |
|---|---|
| canvas | 1080×1920 @ 30 fps |
| bg | `#F5F1ED` + fine dot texture (11 px pitch, 1.3 px dots, ~16% ink) |
| accent | `#F4146F` (hot pink) · soft `#FDE3EE` |
| ink / text | `#1C1C20` |
| ok | `#22A06B` |
| cards | white, 2 px hairline border, soft shadow, radius ≈ 26, tiny tilt (±2°) |
| sticker | pink pill, darker bottom edge (fake 3D), white heavy text |

## 2. Type
Title card: **Anton** caps ~68 px, pink highlighted part. Captions: **Space Grotesk** 500, 78 px, line pitch 93.
Keyword: **Instrument Serif italic**, accent pink, ×1.1 size. UI mono tags `// label`: **Space Mono** 18–24 px grey.
UI text: **Inter** 600–800.

## 3. Layout (y in px @1920)
- **Title card** x140 y98 w800 h106: title left; **progress dots** right (30 px circles numbered 1…N; done = pink, current = pink + pulsing ring, pending = grey). One dot per section; dots fill as steps advance. Reel 4 uses tiny icons instead of numbers.
- **Caption** x135 y≈262, max width 760, ≤ 2 lines, left aligned.
- **Stage** (the world): x70 y600 w940 h1010. Visuals are free-positioned inside it; the world may extend behind the avatar.
- **Avatar** bottom-right, ~700 px wide, cropped by the bottom edge; head centre ≈ x780 y1515, head top ≈ y1350. It overlaps the stage's lower-right corner — keep important stage content out of x>650,y>1330.
- Safe zone: nothing important below y≈1590 on the left (Instagram UI), none within 110 px of the right edge above the avatar.

## 4. Captions (the signature)
- One **phrase** per beat (3–6 words, one `captions.txt` line). Phrase builds word by word, then **clears** at the next beat. Not a growing paragraph, not a speech bubble.
- A word fades in over ~4 frames as spoken (starts at 25% opacity, slight rise). Unspoken words are not drawn.
- Keywords switch font to Instrument Serif italic + pink — **1–2 per beat**, nouns/verbs that carry the meaning ("free", "decides", "approve", "honest", "wrong").
- Pace ≈ 1 phrase per 1.1 s (≈ 2.6 words/s). Whole reel 24–31 s.
- Last beat holds until the video ends.

## 5. Avatar (owner's cartoon — v3, drawn from the owner's photo)
- **Look (v3):** side-swept black quiff (high hairline, tapered sideburns), NO glasses, clean-shaven apart from a thin moustache (no beard/stubble), small gold earring, rust-orange zip jacket over a lavender tee, thin gold chain. Smiles are a curved closed smile (neutral) or a soft teeth-showing grin (happy/wink/love). (The 4 reference reels show a bearded Bitmoji-style avatar; v3 replaces it with the owner's own look.)
- **Neck rule:** neck is drawn BEFORE the torso with a jaw-shadow under the chin; the jacket collar and tee neckline overlap it. (v1/v2 drew a brown disc inside a dark collar ring — wrong; do not reintroduce.)
- **Arms rule:** arms are drawn in FRONT of the body (shoulder → elbow → wrist, outlined sleeve), hands attach at the wrist with a jacket cuff. Never behind the torso.
- Bottom-right, gentle idle bob/sway; blinks; mouth opens with each spoken word.
- **Changes pose almost every beat.** Vocabulary seen: pointUp (most common, when stating a point), present (open palm toward the stage), coverMouth (surprise/"oops"), coverEye/facepalm (cringe), chest (honesty/"me"), chin (thinking), fistsUp (celebration), thumbsUp + wink (final beat — always).
- **20 expressions** (`EXPRESSION_NAMES`): neutral, happy, laugh, excited, surprised, shocked, wink, smirk, thinking, confused, skeptical, sad, worried, angry, proud, sleepy, embarrassed, smug, love, determined. Use a different one on nearly every beat; pick by meaning (shock → shocked, "honest part" → proud/smug, caveat → worried, "it can be wrong" → skeptical, CTA → happy/wink).
- **Pink glow burst** behind the avatar (≈ 26 frames) on emphasis beats and wipe landings.
- Built-in SVG presenter: `src/avatar/Kartik.tsx`. Your own face: export transparent PNGs per gesture to `public/avatar/<gesture>.png` and set `AVATAR.mode = "png"` in `brand.ts`.

## 6. Scene worlds (the creative core)
One everyday metaphor per reel, built by the **same few characters** and **persisting** across beats (elements are added/removed, the world is not reset). Examples:
| reel | world | cast | metaphor beats |
|---|---|---|---|
| 1 Sellbird | aquarium + pier; fish tagged "dental / cafe / roofing" | pelican-bot "Harvey" → relabelled "Sellbird" (bucket hat) | bare hands slapping fish → bot nets them → business cards → owner card → email ✓ → typewriter draft → envelopes → plan card (Claude/ChatGPT) → API bill crossed out → OUTBOX + Approve button → fake repos as hooked fish + FAKE stamp |
| 2 ChatGPT notes | theatre curtain, corkboard, plant; later fortune-teller tent | ChatGPT bot (gets glasses / witch hat) | "NOTES ON YOU" notebook → settings Memory toggle → 3 numbered prompts → sticky habits → STOP sign → hamster wheel + hourglass → crystal ball "can be wrong" |
| 3 Untangle | bathroom sink hairball | AI-fixer robots, pink comb | tweezers "1 strand at a time" → patches pile up → magnifier finds knots → blueprint redesign → one comb pass → agents re-comb until "0 knots left" → checklist ✓ |
| 4 Free → Paid | row of market stalls with awnings | 3 GitHub repo cards | repo cards → stall opens (PAID) → "clipping service" film reel, "ad factory" ×100 counter, "shop apps" laptop → licence card → stamps FREE vs "setup by you" |

Design recipe: (1) turn each step into a physical object/action in the metaphor; (2) the caption keyword is the object's label; (3) each beat adds or transforms ONE thing; (4) a callout (hang tag, stamp, sketch circle) names the idea.

## 7. Animation catalog (what each beat uses) → component
| motion seen | component / helper |
|---|---|
| spring pop-in from below/side with overshoot, ±3° rotate | `Pop` (used by all cards) |
| text typing into a card/field with caret | `TypeCard`, `ChatBubble`, `typed()` |
| pink chat bubble + big extruded step number | `ChatBubble n={1}`, `Number3D` |
| hand-drawn circle drawing itself around a thing | `SketchCircle` |
| rubber stamp slam (scale 2.3→1, multiply) "FAKE / NEVER DONE / CAN BE WRONG" | `Stamp` |
| pink tag hanging on a string, swinging | `HangTag` ("the honest part", "honest friend") |
| paper sticky note, serif italic | `Sticky` |
| status chip ✓ / ! / i | `StatusChip` |
| cursor glides + click squash; toggle flips ON | `Cursor`, `Toggle` |
| radial sparks / confetti / splash | `Burst` |
| helper bot (hat, glasses, label, mood) | `Mascot` |
| market stall with awning/sign/PAID tag | `Stall` |
| pink 3D sticker pill | `Sticker`, `KeywordSticker` |
| halftone wipe | `HalftoneWipe` via `beat.transition` |
| pink glow behind avatar | `beat.glow` |
Not in the kit (build per topic in `worlds/`): big arm reaching from the top of frame, splash/water, hamster wheel, hourglass, comb, blueprint overlay, film strip, onomatopoeia ("SLAP!"), screen-shake on impacts, camera-zoom on the stage.
Rules: each element enters on its anchor word (or line start if the anchor is >18 frames away); typing speed ≈ 1 char/frame; spring `damping 13 stiffness 170 mass .8`; one or two simultaneous motions max.

## 8. Transitions
- **Pink halftone** (full wash, ~20 frames): new act / big idea change. Dots swell until solid, scene swaps at the midpoint, dots shrink. Used at ~4 s, ~7 s, ~25 s.
- **Ink (black) halftone**: hard hand-off into the CTA.
- **Sweep**: a band of black dots crossing left→right (or reverse) in ~16 frames, used for quick "next thought" and just before "Comment WORD".
- 2–4 wipes per reel. Between wipes, changes are element-level (pops), not full-scene cuts.
- Exit: visuals fade ~10 frames before their `until` beat ends; the last beat never exits.

## 9. CTA recipe (identical in all 4 reels)
1. `"Comment WORD"` — comment box appears, WORD types into the input in pink, then a **giant 3D pink sticker** of WORD slams over the box (burst). Keyword is themed: SELL, NOTES, CLEAN (comb), EARN.
2. `"…for the link,"` — keyword sticker shrinks to the top-left; `DMCard` "new message / sent you the link" with the repo/link card ✓ and a speech tail down to the avatar's hand.
3. `"and send this to a friend who needs …"` → `FriendCard` ("sent ✓", confetti, celebrating character) **or** `"follow for more tools like this"` → `FollowCard` (cursor clicks → "Following ✓", mini tool cards fanned behind).
4. Avatar: present → thumbsUp + wink on the very last beat.

**Timing rule:** the comment box + sticker animation needs ≈ 30 frames. If the `Comment WORD` beat is shorter than that, give `CommentCTA` `until` = the next beat (and place the DM card lower, y≈800).

## 10. Beat-level examples (word → what happens)
Reel 3, 0–8 s: "You can't pull a hairball apart" (tweezers + hairball in sink; avatar covers mouth on "plop!") → "one strand at a time." (sticky "1 strand", SNAP! onomatopoeia) → pink-wipe-free cut → "But that's how your AI fixes your code." (hairball grows, robot + fix log typing "+ patch / + if / + copy") → red "!" marks → **pink halftone** → "This free skill is the comb." (FREE/MIT tag, comb slides in) → "It's called untangle-codebase." (name types on the comb).
Reel 4, 0–12 s: "3 free projects on GitHub you could turn into a paid service" (3 repo cards with FREE badges pop; stalls open with PAID) → "Most people star them and never open them again. Don't." (filing cabinet "starred", cobwebs, spider) → "First, AutoClip." (card #1 + stall "Clipping service" assembles; film strip, phone "CAPTIONS ON", editor character, coins).

## 11. Length & beat budget
24–31 s · 20–26 beats · 60–80 words · 3–5 sections (= dots) · 2–4 halftone wipes · 1 hook beat, 1 "free/open source" reveal, numbered steps, 1 honest-caveat beat, CTA ≈ 6 beats.

## 12. What was NOT visible / unknown
Voice-over level was continuous (no music detected); SFX per-beat usage could not be confirmed from frames. Exact fonts, easing curves and halftone cell size are approximations. The original avatar looks like a Bitmoji-style asset — supply pose PNGs for a faithful match.
