<div align="center">

# 🏎️ PORSCHE GT2 RS

### Interactive Engineering Dashboard

A cinematic, scroll-driven web experience showcasing the Porsche 911 GT2 RS through an immersive technical dashboard with real-time telemetry visuals, exploded component animations, and a motorsport-inspired UI.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-D50000?style=for-the-badge)](LICENSE)

</div>

---

## ⚡ Overview

A fully client-side, single-page experience that transforms the browser into a Porsche engineering lab. The hero section features a **240-frame scroll-driven image sequence** that explodes the GT2 RS into its component layers, surrounded by floating HUD panels with live telemetry data, tachometer SVG animations, and sparkline readouts.

> **No frameworks. No build step.** Pure HTML + CSS + JS — powered by GSAP, ScrollTrigger, Lenis smooth scroll, and the Tailwind CSS CDN.

---

## ✨ Features

| Feature | Description |
|---|---|
| **🎬 Preloader** | Conic-gradient gauge with real-time frame-load percentage |
| **🖱️ Custom Cursor** | Dual-element cursor (dot + rotating frame) with magnetic hover on HUD panels |
| **🎞️ 240-Frame Scroll Sequence** | Canvas-rendered exploded-view animation scrubbed by scroll position |
| **📊 Telemetry HUD** | Glass-morphism panels showing engine load, boost pressure, chassis config |
| **🔴 Tachometer** | Animated SVG circular gauge with live RPM, sparkline boost & oil temp readouts |
| **🔊 Sound Design** | Web Audio API synthesized "exploded cue" — triangle wave + sine hum + bandpass noise swoosh |
| **🪟 Glassy 911 Watermark** | Multi-layered transparent text with gradient fill, stroke outline, and radial backdrop blur |
| **📐 Bento Spec Grid** | Responsive 12-column grid with performance stats, aero data, and materials info |
| **🌊 Lenis Smooth Scroll** | Buttery 60fps scrolling with custom easing and GSAP ticker integration |
| **📱 Responsive** | Fully adaptive layout — HUD hides on mobile, car stage repositions, panels stack |

---

## 🏗️ Project Structure

```
PORSCHE/
├── DASH.html          # Single-page application (HTML + CSS + JS)
├── README.md          # Project documentation
├── IMG/               # 240 scroll-sequence frames (ezgif-frame-001..240.jpg)
└── asset/
    └── Porsche.jpg    # Hero reference image
```

---

## 🚀 Getting Started

### Prerequisites

- Any modern browser (Chrome, Firefox, Edge, Safari)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/hrdx11/Antigrav.git
cd Antigrav/PORSCHE
```

Then open `DASH.html` directly in your browser — everything loads from CDNs, no setup needed.

### Live Demo

The project is deployed as part of the [Antigrav](https://github.com/hrdx11/Antigrav) monorepo on Vercel. Visit the `/porsche` route on the live site.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Structure** | HTML5, semantic markup |
| **Styling** | Tailwind CSS (CDN), custom CSS (glassmorphism, scanlines, tech-grid) |
| **Animation** | GSAP 3.12 + ScrollTrigger (scrub-based timeline) |
| **Scroll** | Lenis 1.1 smooth scroll |
| **Canvas** | Vanilla Canvas 2D — frame-by-frame sequence renderer |
| **Audio** | Web Audio API — procedural sound synthesis (no audio files) |
| **Fonts** | Space Grotesk (display/labels), Inter (body) — via Google Fonts |

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary-container` | `#D50000` | Accent red — CTAs, borders, tachometer, scanlines |
| `background` | `#121414` | Dark canvas |
| `surface-container` | `#1E2020` | Elevated card surfaces |
| `on-surface` | `#E2E2E2` | Primary text |
| `outline` | `#424242` | Borders and dividers |

### Typography

- **Display / Headlines** — Space Grotesk 700–900, italic, tight tracking
- **Labels** — Space Grotesk 700, 12px, all-caps, `0.2em` letter-spacing
- **Body** — Inter 400, 16–18px, `1.6` line-height

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built with 🏁 by [hrdx11](https://github.com/hrdx11)**

</div>
