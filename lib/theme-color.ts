// Derives the full storefront color palette (the same tonal system defined in
// app/globals.css's @theme block) from three admin-picked seed colors, so the
// whole site can be re-themed without touching every dependent shade by hand.

export type ThemeSeeds = {
  background: string;
  primary: string;
  secondary: string;
};

export const DEFAULT_THEME_SEEDS: ThemeSeeds = {
  background: "#fff8e7",
  primary: "#930500",
  secondary: "#3d6ba0",
};

export function isValidHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function mix(hexA: string, hexB: string, amount: number): string {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  return rgbToHex(r1 + (r2 - r1) * amount, g1 + (g2 - g1) * amount, b1 + (b2 - b1) * amount);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexA) + 0.05;
  const b = relativeLuminance(hexB) + 0.05;
  return a > b ? a / b : b / a;
}

const WHITE = "#ffffff";
const BLACK = "#000000";

// Best-contrast text color to place on top of `bg`.
function onColor(bg: string): string {
  return contrast(bg, WHITE) >= contrast(bg, BLACK) ? WHITE : BLACK;
}

function accentFamily(seed: string, prefix: string): Record<string, string> {
  return {
    [`--color-${prefix}`]: seed,
    [`--color-on-${prefix}`]: onColor(seed),
    [`--color-${prefix}-container`]: mix(seed, WHITE, 0.82),
    [`--color-on-${prefix}-container`]: mix(seed, BLACK, 0.18),
    [`--color-${prefix}-fixed`]: mix(seed, WHITE, 0.9),
    [`--color-${prefix}-fixed-dim`]: mix(seed, WHITE, 0.55),
    [`--color-on-${prefix}-fixed`]: mix(seed, BLACK, 0.35),
    [`--color-on-${prefix}-fixed-variant`]: mix(seed, BLACK, 0.08),
  };
}

export function deriveThemeVars(seeds: ThemeSeeds): Record<string, string> {
  const { background, primary, secondary } = seeds;

  // Tertiary rides on the secondary seed (a lighter, related accent) so admins
  // only ever have to pick three colors, not four.
  const tertiary = mix(secondary, WHITE, 0.35);

  const onSurface = mix(primary, BLACK, 0.72);
  const onSurfaceVariant = mix(onSurface, background, 0.35);
  const outline = mix(onSurface, background, 0.55);
  const outlineVariant = mix(onSurface, background, 0.8);
  const surfaceContainer = mix(background, onSurface, 0.05);
  const inverseSurface = mix(onSurface, background, 0.15);

  return {
    "--color-background": background,
    "--color-surface": background,
    "--color-surface-dim": mix(background, onSurface, 0.14),
    "--color-surface-bright": mix(background, WHITE, 0.35),
    "--color-surface-container-lowest": mix(background, WHITE, 0.9),
    "--color-surface-container-low": mix(background, WHITE, 0.55),
    "--color-surface-container": surfaceContainer,
    "--color-surface-container-high": mix(background, onSurface, 0.1),
    "--color-surface-container-highest": mix(background, onSurface, 0.16),
    "--color-surface-variant": mix(background, onSurface, 0.2),
    "--color-surface-tint": primary,
    "--color-on-surface": onSurface,
    "--color-on-surface-variant": onSurfaceVariant,
    "--color-on-background": onSurface,
    "--color-inverse-surface": inverseSurface,
    "--color-inverse-on-surface": surfaceContainer,
    "--color-outline": outline,
    "--color-outline-variant": outlineVariant,

    ...accentFamily(primary, "primary"),
    ...accentFamily(secondary, "secondary"),
    ...accentFamily(tertiary, "tertiary"),

    "--color-brand-red": mix(primary, BLACK, 0.18),
  };
}
