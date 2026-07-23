---
name: Kinetic Technical Interface
colors:
  surface: '#0d1516'
  surface-dim: '#0d1516'
  surface-bright: '#333a3c'
  surface-container-lowest: '#080f11'
  surface-container-low: '#151d1e'
  surface-container: '#192122'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2e3638'
  on-surface: '#dce4e5'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dce4e5'
  inverse-on-surface: '#2a3233'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#d2bbff'
  on-secondary: '#3f008e'
  secondary-container: '#6001d1'
  on-secondary-container: '#c9aeff'
  tertiary: '#ffeac0'
  on-tertiary: '#3e2e00'
  tertiary-container: '#fec931'
  on-tertiary-container: '#6f5500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdf96'
  tertiary-fixed-dim: '#f3bf26'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#0d1516'
  on-background: '#dce4e5'
  surface-variant: '#2e3638'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  data-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for high-performance PC gaming telemetry and hardware optimization. The brand personality is **precise, authoritative, and ultra-modern**, drawing heavy influence from developer-centric tools and high-end hardware interfaces. 

The aesthetic blends **Minimalism** with **High-Contrast Technicality**. It prioritizes data density without sacrificing legibility, utilizing deep obsidian surfaces to let performance metrics "pop" with neon-like vibrancy. The goal is to evoke a sense of "zero-latency" through clean lines, generous whitespace between functional groups, and a strict adherence to a utilitarian grid. The emotional response should be one of total control and professional-grade insight.

## Colors
The palette is rooted in a "Dark-First" architecture. The primary color, **Tech Cyan (#00E5FF)**, is reserved for interactive states, primary actions, and active hardware focus.

### Performance Tiering
A strict 5-tier semantic system is used for FPS and latency data:
- **Excellent (120+):** Emerald (#10B981) - Peak performance.
- **High (90-119):** Lime (#84CC16) - Optimal experience.
- **Good (60-89):** Yellow (#FACC15) - Standard smooth play.
- **Playable (30-59):** Orange (#F97316) - Marginal stability.
- **Poor (<30):** Red (#EF4444) - Critical bottleneck.

### Hardware Identification
Specific hues are assigned to core components to allow for rapid visual scanning in complex data tables: **CPU (Blue)**, **GPU (Violet)**, and **VRAM (Pink)**. All background surfaces utilize a neutralized charcoal scale to ensure these semantic colors remain primary information carriers.

## Typography
The system uses a dual-font approach. **Geist** provides a clean, sophisticated sans-serif for UI navigation, headings, and descriptive text. For all telemetry, frame times, hardware specs, and code-like data, **JetBrains Mono** is employed. 

The monospaced font ensures that tabular data remains perfectly aligned, preventing "jitter" when numbers update rapidly in real-time. Use `label-caps` for table headers and hardware categories to create a distinct visual anchor. Large display sizes should use tighter letter spacing to maintain a "tight" technical feel.

## Layout & Spacing
This design system is built on a strict **8px linear grid**. All dimensions, padding, and margins must be multiples of 8 (e.g., 8, 16, 24, 32, 48, 64).

### Grid System
- **Desktop:** 12-column fluid grid with a 1440px max-width. Gutters are fixed at 24px.
- **Data Tables:** Utilize a "compact" density model where row heights are fixed at 40px or 48px to maximize information density.
- **Margins:** Use 32px for main page gutters on desktop, scaling down to 16px on mobile devices.

Layouts should favor horizontal alignment of related hardware metrics (CPU next to GPU) to allow for side-by-side comparison.

## Elevation & Depth
Elevation is achieved through **Tonal Layering** rather than traditional drop shadows.
- **Level 0 (#09090B):** The canvas. Used for the primary application background.
- **Level 1 (#18181B):** The container. Used for cards, sidebar sections, and main content areas.
- **Level 2 (#27272A):** The interactive layer. Used for hover states, dropdown menus, and modal dialogs.

Instead of shadows, use **1px Subtle Borders** (`#27272A` or `#3F3F46`) to define boundaries. This maintains the clean, flat, technical aesthetic. For critical alerts or "active" hardware cards, a subtle outer glow using the primary Tech Cyan (at 10% opacity) may be used to indicate focus.

## Shapes
The shape language is precise and geometric. 
- **Standard Radius:** 6px (applied to buttons, input fields, and small cards).
- **Large Radius:** 12px (reserved for major dashboard containers or modal windows).
- **Interactive Elements:** Use sharp 90-degree inner corners for nested elements (like progress bars inside a card) to emphasize the engineering-led design.

## Components

### FPS Gauges & Data Visuals
Gauges should be rendered as "Linear Micro-charts" rather than circular dials to save vertical space. Use a 2px stroke for sparklines. The current FPS value should be the largest typographic element in the component, utilizing `data-mono-lg`.

### Hardware Spec Cards
Cards must feature a "Hardware Header" with the specific semantic color (CPU/GPU/VRAM) as a 2px top border. Internal spacing should be a consistent 16px. Use `label-caps` for property names (e.g., CLOCK SPEED) and `data-mono-sm` for the values.

### Technical Data Tables
Tables should use a "Zebra Striping" effect using Elevation 0 and Elevation 1. Hovering over a row should trigger an Elevation 2 background change. Columns containing performance data should be right-aligned to ensure decimal points line up.

### Buttons & Inputs
- **Primary Button:** Solid Tech Cyan background with black text for maximum contrast.
- **Secondary Button:** Ghost style with a 1px white/gray border and subtle background fill on hover.
- **Input Fields:** Deep charcoal background with a 1px border that glows Tech Cyan on focus. Use monospaced font for numerical inputs.

### Chips & Tags
Use small, pill-shaped tags for "Status" or "Driver Version." These should use a low-opacity version of the semantic color (e.g., 15% green background with 100% green text) to prevent visual clutter.