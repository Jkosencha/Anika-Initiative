const PHONE_PATTERN = /^\+?[1-9]\d{6,14}$/;

export function sanitizePhoneInput(value) {
  return String(value ?? '').replace(/[^0-9+().\s-]/g, '').slice(0, 25);
}

export function normalizePhone(value) {
  const raw = String(value ?? '').trim();
  const digits = raw.replace(/[\s().-]/g, '');
  if (!/^\+?\d+$/.test(digits)) return null;
  const normalized = digits.startsWith('+') ? digits : `+${digits}`;
  return PHONE_PATTERN.test(normalized) ? normalized : null;
}

export function isValidPhone(value) {
  return Boolean(normalizePhone(value));
}

export function phoneError(value) {
  if (!String(value ?? '').trim()) return 'Phone number is required.';
  return 'Enter a valid international phone number, including the country code (for example +254712345678).';
}
