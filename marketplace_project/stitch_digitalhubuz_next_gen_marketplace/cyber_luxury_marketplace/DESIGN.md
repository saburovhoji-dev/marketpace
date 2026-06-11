---
name: Cyber-Luxury Marketplace
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c7c4d6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#918f9f'
  outline-variant: '#464554'
  surface-tint: '#c2c1ff'
  primary: '#c2c1ff'
  on-primary: '#1c0b9f'
  primary-container: '#5856d6'
  on-primary-container: '#e7e4ff'
  inverse-primary: '#4f4ccd'
  secondary: '#adc6ff'
  on-secondary: '#002e69'
  secondary-container: '#4b8eff'
  on-secondary-container: '#00285c'
  tertiary: '#e8b3ff'
  on-tertiary: '#510074'
  tertiary-container: '#9739c6'
  on-tertiary-container: '#f8deff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c2c1ff'
  on-primary-fixed: '#0c006a'
  on-primary-fixed-variant: '#3631b4'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#f6d9ff'
  tertiary-fixed-dim: '#e8b3ff'
  on-tertiary-fixed: '#310048'
  on-tertiary-fixed-variant: '#7201a2'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-margin-mobile: 20px
  container-margin-desktop: 80px
  gutter: 16px
  stack-gap-sm: 12px
  stack-gap-lg: 32px
---

## Brand & Style
The design system embodies "Cyber Luxury"—a fusion of high-end technical precision and effortless startup elegance. It is designed for the next generation of digital entrepreneurs in Uzbekistan, evoking a sense of being at the forefront of a technological frontier.

The aesthetic leans heavily into **Glassmorphism** and **Corporate Modern** styles, utilizing deep space-blacks and vibrant light-leaks to create a "layered reality." The UI should feel like a high-end physical device: cold, sleek, and exceptionally responsive. Every interaction must feel intentional, using subtle micro-animations and magnetic hover states to reinforce a premium, unicorn-startup atmosphere.

## Colors
The palette is rooted in a "True Black" (`#050505`) foundation to ensure infinite depth on OLED mobile displays. 

- **Primary (Electric Violet):** Used for primary actions and brand presence.
- **Secondary (Cyber Blue):** Used for links, secondary status indicators, and technical highlights.
- **Tertiary (Neon Magenta):** Reserved for rare highlights, special offers, or high-conversion triggers.
- **Neutral Layers:** A series of semi-transparent greys are used over the black base to create the glass effect, rather than solid lighter shades.

The system relies on **Aurora Backgrounds**—soft, blurred gradients of purple and blue that sit behind the UI layers to provide a sense of movement and "energy" within the marketplace.

## Typography
The typography strategy balances the technical precision of a SaaS tool with the readability of a premium marketplace.

- **Headlines:** `Geist` provides a sharp, geometric feel that screams "modern technology." Display sizes use tight letter spacing for a compact, authoritative look.
- **Body:** `Inter` is used for all long-form content and UI metadata to ensure maximum legibility at small sizes on mobile devices.
- **Accents:** `JetBrains Mono` is used sparingly for technical data points (e.g., price IDs, dates, "Sold Out" tags) to reinforce the marketplace's digital-first nature.

## Layout & Spacing
The design system follows a **Fluid Grid** model with a mobile-first philosophy. 

- **Mobile:** A 4-column grid with 20px side margins. Content cards generally span the full width or 2 columns for product grids.
- **Desktop:** A 12-column grid with 80px side margins and a maximum content width of 1440px.
- **Rhythm:** Spacing is strictly based on an 8px scale. Use `stack-gap-lg` for separating distinct sections and `stack-gap-sm` for elements within a card or list item.

Layouts should feel expansive; use white space (or "black space") to isolate premium products and high-value data.

## Elevation & Depth
Depth is created through **Glassmorphism** and light physics rather than traditional heavy shadows.

- **Base Level:** True Black (#050505).
- **Surface Level (Cards/Modals):** A semi-transparent fill (`rgba(255, 255, 255, 0.03)`) with a `20px` backdrop blur.
- **Borders:** Every floating element must have a 1px solid border. Use a linear gradient stroke (from `rgba(255,255,255,0.1)` at the top to `rgba(255,255,255,0.02)` at the bottom) to simulate light hitting the top edge.
- **Glows:** Primary components use a subtle outer "halo" glow in the primary violet color to indicate interactivity or high-importance status.

## Shapes
The shape language is ultra-modern and soft. The system uses a **Pill-shaped (Level 3)** roundedness strategy to contrast against the sharp, technical typography.

- **Primary Containers:** `rounded-3xl` (24px - 32px) for main product cards and dashboard modules.
- **Buttons & Inputs:** `rounded-full` or `rounded-2xl` to create a friendly, "squishy" feel that invites touch.
- **Small Elements:** Chips and tags should always be fully pill-shaped.

## Components
- **Magnetic Buttons:** Primary buttons feature a subtle "magnetic" hover effect on desktop. They use a gradient fill from Primary to Secondary and a high-contrast white label.
- **Glass Cards:** Cards should never have a solid background. They must use the backdrop-blur treatment defined in Elevation.
- **Input Fields:** Minimalist design—only a bottom border or a very faint translucent container. Upon focus, the border should glow with a Blue-to-Violet gradient.
- **Chips:** Small, semi-transparent capsules with Mono labels. Used for categories like "Software," "Design," or "Premium."
- **Floating Navigation:** A bottom-anchored navigation bar on mobile, utilizing a heavy backdrop blur and "frosted glass" icons.
- **Animated Gradients:** Use "Aurora" background components that slowly rotate or pulse behind the main content area to maintain a dynamic, futuristic feel.