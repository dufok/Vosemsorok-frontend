# Vosemsorok Frontend

Portfolio website for **Stepan Vladovskii** — 3D Designer & Visualizer.

Brutalist timeline layout with bitmap fonts, infinite marquee header,
and per-project horizontal photo galleries.

---

## Stack

- **Vite 7** + **React 18** + **TypeScript**
- Plain CSS with custom properties — no UI framework
- Fonts: ModeNine (WOFF2, local), VT323 (TTF, local), Cascadia Code
- Drag-scroll hook for mouse and touch gallery interaction

---

## Project Structure

frontend/
├── public/
│ └── fonts/
│ ├── Modenine.woff2 # Converted + repaired from dafont TTF
│ └── VT323-Regular.ttf
├── src/
│ ├── api/
│ │ └── client.ts # fetchProjects(), imageUrl()
│ ├── components/
│ │ ├── MarqueeHeader.tsx # Fixed top scrolling ticker
│ │ ├── Timeline.tsx # Full project list
│ │ ├── ProjectCard.tsx # Year, role, gallery, overview
│ │ └── PhotoGallery.tsx # Horizontal draggable image strip
│ ├── hooks/
│ │ └── useDragScroll.ts # clientX-based drag scroll
│ ├── types/
│ │ └── index.ts # Project, ProjectImage types
│ ├── App.tsx # Root component, theme toggle
│ ├── index.css # All styles + light/dark theme
│ └── main.tsx
├── index.html
├── .env.development
└── vite.config.ts

text

---

## Design

| Element | Detail |
|---|---|
| Background (light) | `#c6bbaa` warm beige |
| Background (dark) | `#0f0f0f` near black |
| Text | `#1a1a1a` / `#e8e3da` |
| Timeline spine | `1.5px` vertical line, left side |
| Year font | ModeNine |
| Role font | VT323 |
| Overview font | Cascadia Code |
| Gallery | Full bleed right, clipped left at year indent |

---

## Getting Started

### Requirements

- Node.js 20+
- Backend running on `localhost:3001`
  → [Vosemsorok Backend](https://github.com/dufok/Vosemsorok-backend)

### Install

```bash
npm install
Environment
Create .env.development:

text
VITE_API_URL=http://localhost:3001
Dev Server
bash
npm run dev
# → http://localhost:5173
Production Build
bash
npm run build
# outputs to dist/
Theme
Light/dark toggle button is fixed bottom-right. All colors are CSS
custom properties — toggling adds body.dark which overrides
--bg, --text, and --text-dim.

Font Notes
ModeNine is sourced from dafont.com/modenine.
The original TTF has a malformed hdmx table that causes Firefox warnings.
The Modenine.woff2 in public/fonts/ is a repaired conversion
generated with fontTools:

python
from fontTools.ttLib import TTFont
font = TTFont('Modenine.ttf')
del font['hdmx']
font.flavor = 'woff2'
font.save('Modenine.woff2')
Related
Backend API: github.com/dufok/Vosemsorok-backend

