# Learned corrections (append-only)

Corrections the user made during builds. **Append only — never delete or rewrite
existing entries.** When the user fixes a mistake, add a new line here so the
correction never regresses in future reels.

Format: `YYYY-MM-DD — <what the user corrected> — <rule for next time>`

---

- 2026-11-16 — SFX everywhere felt noisy; whooshes "bad" — SFX only on MAIN
  moments: one subtle pill pop per section (0.2) + per-beat one-shots named in
  storyboard.json `sfx` field. No whooshes, no per-beat pops, no keyword dings.
- 2026-11-16 — crash/reward sounds hidden under the voice-over — boost those two
  (0.85 / 0.75) so they cut through the VO; other one-shots stay 0.5–0.55.
- 2026-11-16 — sounds must be license-free — only CC0 (Kenney Interface Sounds,
  bundled in template/public/sfx with LICENSE.txt). Never download licensed sfx.
- 2026-11-16 — dot grid invisible after Instagram compression at 13% opacity —
  use opacity 0.24, 2.3px dots, 50px spacing.
- 2026-11-16 — hard visual cuts between beats felt abrupt — add slow exit ramps:
  14 frames per beat, 36 frames at section ends (dim-then-clear).
- 2026-11-16 — CTA handle — use `@kartik_codes` (not @techstackbro).
- 2026-11-16 — never upload the user's audio anywhere; all processing local
  (ffmpeg + faster-whisper in a local venv).
- 2026-11-16 — never render the full video until the user explicitly says ok;
  stills are the review medium.
- 2026-11-16 — new topics need their own relevant visuals, not reused GitHub
  assets — research official/open-license sources per topic, record source and
  license in assets.json, download reviewed files locally when useful, and use
  code-built diagrams/mockups when no asset has clear permission. Never upload VO.
- 2026-11-16 — STYLE V2 (from 4 new reference reels) supersedes the v1 visual notes above. Dot-grid
  opacity/spacing note (0.24 / 2.3 px / 50 px) is SUPERSEDED: v2 uses a very fine texture
  (11 px pitch, 1.3 px dots, ~16%). Coral bottom-left presenter, speech bubble, neo-brutalist
  chips and the topic pill are SUPERSEDED by: title card + progress dots, phrase captions with
  pink serif keywords, a bearded avatar bottom-right and a persistent illustrated scene world.
  See reference/style-v2.md. Still valid: SFX only on main moments, CC0 sounds only, never upload
  VO, never full-render before approval, handle `@kartik_codes`, per-topic visuals.
- 2026-11-16 — v1 exit ramps (14 / 36 frames, dim-then-clear) are replaced in v2 by element-level
  fades (~10 frames before a visual's `until` beat ends) and halftone wipes at act changes.
- 2026-11-16 — v2 reels are SHORT: 24–31 s, ~1 phrase (3–6 words) per beat, 20–26 beats —
  not 27 beats / 45–60 s. Keep captions to ≤ 2 lines; split longer lines.
- 2026-11-16 — CTA in v2 is always: `Comment WORD` (keyword sticker) → DM "sent you the link" →
  friend "sent ✓" or "Following ✓", not the old Follow button alone.
- 2026-11-16 — AVATAR v3: the bearded black-hoodie avatar was WRONG for the owner — the owner's look is:
  side-swept black hair, rectangular dark glasses, thin moustache + light stubble, small gold earring,
  rust-orange zip jacket over a lavender tee. Use it. 20 expressions are available (see EXPRESSION_NAMES).
- 2026-11-16 — NECK MISTAKE (v1/v2 avatar): the neck was a flat rect with a big brown disc inside a dark collar
  ring, so the head looked like it floated over a hole. Rule: draw the neck BEFORE the torso, add a jaw shadow
  under the chin, and let the collar + tee neckline overlap it; never draw a skin-coloured disc in the collar.
- 2026-11-16 — AVATAR v3.1: owner asked to REMOVE the beard/stubble and the GLASSES, fix the smile, and improve the hair. Rule: no glasses, no stubble/beard (thin moustache only), a high-hairline side-swept quiff with tapered sideburns, and smiles must read clearly (curved lips, soft grin with teeth for happy). Do not re-add glasses or stubble unless asked.
- 2026-11-16 — HANDS/ARMS MISTAKE (avatar v3.1): arms were drawn BEHIND the torso as one straight stroke, so hands looked like
  they came from behind the body. Rule: arms are drawn IN FRONT of the jacket and face (after torso + head, before hands),
  as shoulder -> elbow -> wrist with a dark outline stroke under the sleeve so it separates from the torso, and every
  gesture in Kartik.tsx POSES must define an `elbow`. Never draw sleeves before the torso.
- 2026-11-16 — Avatar hair: no loose hairline 'points' (they read as stray dots on the forehead). Keep the hairline edge clean.
