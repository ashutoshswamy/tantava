// Derives a full "primary" color family (Material-ish container/on-color set)
// from a single admin-picked brand color, so the whole storefront can be
// re-themed by choosing one hex value instead of ten.

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

function mix(hex: string, target: [number, number, number], amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const [tr, tg, tb] = target;
  return rgbToHex(r + (tr - r) * amount, g + (tg - g) * amount, b + (tb - b) * amount);
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

const WHITE: [number, number, number] = [255, 255, 255];
const BLACK: [number, number, number] = [0, 0, 0];

export function deriveThemeVars(primary: string): Record<string, string> {
  const onPrimary = contrast(primary, "#ffffff") >= contrast(primary, "#000000") ? "#ffffff" : "#000000";

  return {
    "--color-primary": primary,
    "--color-surface-tint": primary,
    "--color-on-primary": onPrimary,
    "--color-primary-container": mix(primary, WHITE, 0.82),
    "--color-primary-fixed": mix(primary, WHITE, 0.9),
    "--color-inverse-primary": mix(primary, WHITE, 0.55),
    "--color-primary-fixed-dim": mix(primary, WHITE, 0.55),
    "--color-on-primary-container": mix(primary, BLACK, 0.18),
    "--color-on-primary-fixed": mix(primary, BLACK, 0.35),
    "--color-on-primary-fixed-variant": mix(primary, BLACK, 0.08),
  };
}
