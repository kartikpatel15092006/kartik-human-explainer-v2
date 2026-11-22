# Loudness envelope for avatar lip-sync: per-video-frame RMS of the voice-over.
# Writes public/vo-envelope.json = [{ "v": 0..1 }] at FPS frames per second.
import json
import json as _json
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
FPS = 30
FLOOR_DB = -42.0  # below this = silent

data, sr = sf.read(str(ROOT / "public" / "vo.wav"), dtype="float32")
if data.ndim > 1:
    data = data.mean(axis=1)

hop = sr / FPS
frames = int(np.ceil(len(data) / hop))
rms = np.zeros(frames, dtype=np.float32)
for i in range(frames):
    a = int(i * hop)
    b = min(len(data), int((i + 1) * hop))
    if b > a:
        seg = data[a:b]
        rms[i] = float(np.sqrt(np.mean(seg * seg)))

db = 20 * np.log10(np.maximum(rms, 1e-8))
lo, hi = FLOOR_DB, max(float(np.percentile(db, 97)), FLOOR_DB + 6)
v = np.clip((db - lo) / (hi - lo), 0, 1)

# light temporal smoothing so the motion reads as speech, not jitter
k = np.array([0.16, 0.24, 0.2, 0.24, 0.16], dtype=np.float32)
v = np.convolve(v, k, mode="same").astype(np.float32)

out = [{"v": round(float(x), 3)} for x in v]
p = ROOT / "public" / "vo-envelope.json"
p.write_text(_json.dumps(out), encoding="utf8")
print(f"wrote {p} ({len(out)} frames, peak {v.max():.2f}, mean {v.mean():.2f})")
