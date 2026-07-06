# Design System / Vibe Prompt — "Soft Glass Productivity" UI

## Copy-paste vibe prompt (for AI design tools / Figma AI / v0 / Midjourney UI mode)

> A soft, glassy SaaS productivity dashboard on a pale lavender-to-gray gradient background. Modular bento-grid layout of floating white cards with large 20–28px rounded corners, near-borderless edges, and diffused low-opacity drop shadows that make each card feel like it's hovering slightly above the canvas. Subtle backdrop blur / frosted-glass translucency on panels and the sidebar. High-contrast near-black pill-shaped buttons and nav icons against the pale backdrop, accented with a single punchy chartreuse/lime highlight color used sparingly for active states, tags, and checkmarks. Typography is a clean geometric-rounded sans-serif — bold, large numerals for stats, calm gray for secondary text. Thin single-weight line icons inside circular chip buttons. Smooth curved line charts with soft dot markers and a dark pill-shaped tooltip. Overall mood: calm, minimal, "quietly premium" fintech/productivity tool — airy, tactile, not flat.

---

## Color Palette

| Role | Approx. Hex | Usage |
|---|---|---|
| Background base | `#EFEFF2` – `#F2F1F5` | Page background, light neutral gray |
| Background gradient accent | `#C9C0EA` → `#A79BDD` (soft lavender/purple) | Diagonal gradient glow, bottom-left corner bleed, blurred vignette |
| Card surface | `#FFFFFF` / `#FAFAFC` | Primary card fills |
| Secondary surface | `#E4E4E8` – `#DADADE` | Nested/secondary blocks (e.g. gray activity chip) |
| Ink / primary text | `#17171B` – `#1F1F23` | Headings, near-black, not pure black |
| Muted text | `#8B8B92` | Secondary labels, timestamps, subtext |
| Dark UI element | `#141414` – `#1C1C1F` | Active nav icon bg, primary buttons ("+ Add task"), avatar frame ring |
| Accent (hero) | `#D6F24E` / `#CFF23A` (chartreuse-lime) | Highlighted timeline block, checkmarks, active-state dot, "done" tag |
| Accent (secondary) | `#C7BEFB` (soft periwinkle/lavender) | Tertiary timeline block ("Coffee break"), decorative gradient |
| Divider / hairline | `#E7E7EA` at ~1px, or shadow-only (borderless) | Rare — most separation is via shadow/whitespace, not stroke |

Palette logic: **one neutral family (grays/lavenders) + one loud accent (lime)** + near-black for structural/UI-chrome elements. Never more than 2 accent colors on screen at once.

---

## Surfaces, Borders & Blur (glass effect)

- **Corner radius:** large and consistent — ~20–28px on cards, fully pill-shaped (9999px) on buttons, tabs, search bars, and nav icon chips.
- **Borders:** essentially none. Cards are separated by shadow + background contrast, not strokes. If a border exists, it's a near-invisible 1px `rgba(0,0,0,0.04)`.
- **Shadow style:** soft, large-radius, low-opacity ambient shadow — approx `0 20px 40px rgba(20,20,30,0.06)` — no hard edges, no sharp offset. Creates a "floating card" / neumorphic-lite effect rather than flat material design.
- **Blur / glass:** background has a soft gradient blur bleeding in from one corner (diagonal light-purple glow, heavily feathered — looks like a defocused bokeh light source). Some panels read as frosted/translucent (backdrop-filter blur ~12–20px) rather than solid white, especially where the sidebar or floating toggle sits over the gradient.
- **Depth cue in Image 1:** the whole mockup is tilted in 3D perspective with edge blur (depth-of-field), reinforcing a "physical floating glass panel" feel — useful if the deliverable is a marketing shot rather than the live UI.

---

## Typography

- **Typeface family:** geometric, rounded-terminal sans-serif (think *General Sans*, *Switzer*, *Plus Jakarta Sans*, or *Inter* with rounded tracking) — friendly but not playful.
- **Headings:** bold, large, tight line-height (e.g. "Good morning, Mike!" ~32–40px, weight 600–700).
- **Stat numbers:** extra bold, largest text on screen (e.g. "2,543"), often paired with a small up-arrow icon.
- **Body/labels:** regular weight, smaller (~13–14px), muted gray color, generous letter spacing on all-caps labels.
- **Numerals:** tabular/mono-spaced feel for stats and calendar grids so columns align.

---

## Components & Iconography

- **Icons:** thin single-stroke line icons (not filled), ~20px, centered inside circular "chip" buttons (~40–44px diameter). Just Lucide icon.
- **Nav sidebar:** vertical stack of circular icon buttons; active state = solid near-black filled circle with white icon; inactive = light gray ghost circle.
- **Buttons:** pill-shaped, solid black/dark fill with white text for primary actions (e.g. "+ Add task"); light gray pill for secondary/tab controls.
- **Avatars:** circular, stacked/overlapping when showing multiple collaborators, with a small "+N" counter chip in the accent color.
- **Chat/assistant bubble:** rounded speech-bubble card with a tail, tab row above it (icon toggles for help/chat/settings).
- **Timeline / activity view:** horizontal time-axis with rounded colored event blocks of varying widths (lime = primary/active event, gray = secondary, lavender = tertiary), each with bold title + light subtitle.
- **Charts:** smooth curved line/area chart, thin stroke, small circular data-point markers, dark rounded tooltip pill with white text on hover/peak point, dashed horizontal gridlines, minimal axis labels.
- **Calendar/date grid:** simple 7-column grid, muted gray numerals, selected date = solid dark filled circle, secondary highlighted date = light gray filled circle.
- **Checkmarks/done state:** small solid lime-green circle with white check, paired with strikethrough text for completed to-do items.

---

## Layout & Spacing

- **Grid:** modular "bento box" layout — asymmetric card sizes in a 2-column (or 2x2) grid, generous consistent gutters (~20–24px).
- **Whitespace:** generous internal card padding (~24–32px), airy rather than dense.
- **Hierarchy:** top bar (greeting + key stats + primary CTA) → two-column card row (chat/assistant + activity timeline) → second two-column row (to-do list + summary/chart).
- **Consistency across screens:** same corner radius, same shadow depth, same icon chip size reused across every component — this repetition is what makes it read as one coherent design system rather than one-off screens.

---

## One-line DNA summary
**"Pale lavender-gray gradient canvas, floating frosted white cards with heavy rounding and soft shadow, near-black chrome for structure, one lime accent for emphasis, rounded geometric type, thin-line icons in circular chips."**
