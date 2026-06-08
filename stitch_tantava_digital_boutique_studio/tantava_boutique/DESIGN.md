---
name: Tantava Boutique
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4d4637'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#7e7665'
  outline-variant: '#d0c5b2'
  surface-tint: '#755b00'
  primary: '#755b00'
  on-primary: '#ffffff'
  primary-container: '#c9a84c'
  on-primary-container: '#503d00'
  inverse-primary: '#e6c364'
  secondary: '#496455'
  on-secondary: '#ffffff'
  secondary-container: '#ccead6'
  on-secondary-container: '#4f6a5b'
  tertiary: '#934848'
  on-tertiary: '#ffffff'
  tertiary-container: '#ee9290'
  on-tertiary-container: '#6c2a2b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe08f'
  primary-fixed-dim: '#e6c364'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#ccead6'
  secondary-fixed-dim: '#b0cdbb'
  on-secondary-fixed: '#062014'
  on-secondary-fixed-variant: '#324c3e'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b1'
  on-tertiary-fixed: '#3d060a'
  on-tertiary-fixed-variant: '#763132'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  stack-lg: 4rem
  stack-md: 2rem
---

## Brand & Style

The design system for this brand is rooted in the concept of "Artisanal Luxury." It bridges the gap between traditional craftsmanship and modern editorial elegance. The target audience is a discerning, culturally aware demographic that values slow fashion, heritage, and meticulous detail.

The visual style is a blend of **Minimalism** and **Tactile Sophistication**. It utilizes generous whitespace to allow product photography to breathe, creating a gallery-like experience. The emotional response should be one of serenity, warmth, and exclusivity. Every interaction should feel intentional and poised, avoiding aggressive transitions in favor of soft, fading movements.

## Colors

The palette is anchored by a warm cream base to avoid the sterile feel of pure white, evoking the texture of unbleached linen or high-grade parchment.

- **Base (#FDFBF7):** Used for primary backgrounds to create a warm, inviting atmosphere.
- **Gold Accent (#C9A84C):** Reserved for primary actions, subtle flourishes, and high-level branding elements.
- **Forest Green (#2D4739):** Used for secondary elements, navigation text, and grounding the lighter tones.
- **Burgundy (#8E4444):** Employed for seasonal highlights, alerts, or specific collection indicators.
- **Dusty Rose (#D4A5A5):** A soft supporting tone for hover states and delicate UI accents.

## Typography

The typographic hierarchy relies on the high contrast between the expressive, high-contrast serifs of the headings and the understated, geometric clarity of the body text.

- **Headlines:** Use Playfair Display for all major headings. It provides the "editorial" feel essential to fashion. Use tighter letter-spacing for larger display sizes to maintain a premium, "locked-in" look.
- **Body & Labels:** DM Sans is used for its low-contrast, modern profile which ensures legibility without competing with the headlines. 
- **Character:** Use uppercase styling for labels and small navigational elements to inject an authoritative, boutique feel.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model on desktop to maintain the integrity of the editorial compositions, transitioning to a **Fluid Grid** on mobile.

- **Rhythm:** An 8px base unit drives all spacing. For a luxurious feel, we lean into "Stack" spacing (32px to 64px) between sections to prevent the UI from feeling cluttered.
- **Breakpoints:**
    - **Mobile (<768px):** 4-column grid, 16px margins.
    - **Tablet (768px - 1024px):** 8-column grid, 32px margins.
    - **Desktop (>1024px):** 12-column grid, 64px margins, 1280px max-width.
- **Whitespace:** Use extra-wide margins (up to 80px) for high-end product features and lookbook pages.

## Elevation & Depth

To maintain a soft, artisanal aesthetic, depth is created through **Tonal Layers** and **Ambient Shadows** rather than harsh borders.

- **Surfaces:** Use the Ivory accent (#FFFDF9) for elevated surfaces like cards and menus against the warm cream background.
- **Shadows:** Use extremely soft, diffused shadows with a slight warm tint (e.g., `rgba(45, 71, 57, 0.04)`). Avoid high-opacity blacks. Shadows should feel like they are cast by natural light.
- **Interactions:** When an element is hovered, the elevation should subtly increase by widening the shadow spread, rather than drastically changing color.

## Shapes

The shape language is defined by **Rounded** corners that evoke the organic feel of textiles and handcrafted items.

- **Standard Elements:** Buttons and input fields use a 0.5rem (8px) radius.
- **Large Containers:** Product cards and image containers use a 1rem (16px) radius to soften the visual impact of large photography.
- **Badges:** Decorative labels like "Handcrafted" may use pill-shaped (rounded-full) geometry to stand out as distinct ornaments.

## Components

### Sticky Navigation
The header should utilize a frosted-glass effect (Backdrop Blur: 10px) over the neutral base color at 90% opacity. Navigation links use `label-md` styling with a Gold underline effect on hover.

### Product Cards
Cards are borderless with a subtle ambient shadow. The product image should have a 1:1.2 portrait aspect ratio. On hover, the image should subtly scale (1.05x). 

### 'Handcrafted' Badges
A small, elegant badge placed in the top-left or bottom-right of product images. Use the Forest Green (#2D4739) background with Gold (#C9A84C) `label-md` text. The badge should have a thin 1px Gold border.

### Buttons
- **Primary:** Forest Green background with Ivory text. 0.5rem radius.
- **Secondary:** Transparent with a 1px Gold border and Gold text.
- **Tertiary:** Text-only with a 1px underline that expands from the center on hover.

### Input Fields
Inputs should have a minimal 1px bottom border in a muted version of Forest Green, with a floating label using `label-md` typography. This mimics the look of a bespoke order form.