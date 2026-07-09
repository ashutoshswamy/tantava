const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email);
}

export function isValidLength(value: string, max: number, min = 1): boolean {
  return typeof value === "string" && value.trim().length >= min && value.length <= max;
}
