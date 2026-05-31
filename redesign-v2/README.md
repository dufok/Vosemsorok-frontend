# BADPROMT — redesign-v2 prototypes

Standalone prototypes for the **Vosemsorok → BADPROMT** redesign (new domain `badpromt.xyz`).
Source of truth for the new visual systems before they're ported into the React app.

**Palette:** bg `#0A0A0A` · accent `#FF8A00`→`#FFB000` · text `#F5F5F0` · dim `#8A8A82`

## prototypes/

### `ascii-logo-bg.html` — the keeper ⭐
Interactive ASCII **logo** background. Three.js renders `GRAPHICS/logo.glb` into a low-res
WebGLRenderTarget sized to the ASCII grid → `readRenderTargetPixels` → luminance → ASCII chars
(amber on black). The logo **rotates following the mouse**. This unifies two planned systems
(3D logo + ASCII background) into one interactive thing.

- **Baked base orientation:** `{ x:10, y:-83, z:1 }` degrees (calibrated, makes the wordmark face the camera at rest).
- Material overridden to matte white (metalness 0) — ASCII only uses brightness, so shape-shading reads cleanly.
- Controls: mouse → rotation · vertical slider → camera dolly · horizontal slider → charset morph · flicker.
- `?debug=1` shows the raw grayscale render (pre-ASCII) to check framing.
- Three.js loaded from unpkg via importmap (browser needs internet; `logo.glb` served same-origin).

### `ascii-bg.html`
Earlier pure-Canvas2D ASCII engine on **procedural word targets** (BADPROMT / 800 / ssory / again?).
Dolly-zoom + crossfade + charset morph + flicker. No WebGL. Kept as reference for the ASCII engine itself.

## Serving (needs HTTP — `file://` blocks the glb XHR)

Tested on the MacPro server in Docker (nginx container `badpromt-proto`, port 8088, serving `~/badpromt/`):

```
open http://192.168.1.2:8088/prototypes/ascii-logo-bg.html
```

Locally:
```
python3 -m http.server 8000   # run from this redesign-v2/ dir
# → http://localhost:8000/prototypes/ascii-logo-bg.html
```

## Next

- Bring the frontend up on the MacPro server, then port these in.
- `<AsciiLogoBg/>` component mounted behind the header content (manifest + pills + ssory/again?).
- Wire page **vertical scroll → camera dolly**; keep mouse → rotation; add idle drift.
- `prefers-reduced-motion` fallback (freeze flicker + rotation).
- Polish: light/material contrast, default framing, background flicker density, optional white specular peaks.

## Header manifest (final copy)

> My carbon footprint is smaller than the thousand tokens burned on images you'd never love. I don't charge for revisions; I work for the beauty of it. I'm no saint — I run my own servers, I work with AI, I buy tokens like a one-man corporation — but I'm learning to spend less and waste nothing, for the glaciers, for the animals, for a planet worth the light. I'm for beauty, for your project, for your chance to move people through the way space and culture are felt. I'd rather spend a little light making something true than a flood of it making noise. We imagine it together. You build it.
