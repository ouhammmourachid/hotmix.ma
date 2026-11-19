// Moroccan phone helpers. Browser autofill often supplies the international
// form ("00212 6…", "+212 06…"), so every input is folded to the local
// 10-digit form ("06XXXXXXXX") before it is checked or sent.

// Keep digits and a single leading "+", and turn a "00" international prefix into "+"
export function sanitizePhoneInput(raw: string): string {
  const cleaned = raw.trim().replace(/(?!^\+)[^\d]/g, '');
  return cleaned.startsWith('00') ? '+' + cleaned.slice(2) : cleaned;
}

// Convert a complete international number to local form; anything else is returned as-is
export function toLocalPhone(phone: string): string {
  const match = sanitizePhoneInput(phone).match(/^\+?2120?([5-8]\d{8})$/);
  return match ? '0' + match[1] : sanitizePhoneInput(phone);
}

// Valid Moroccan numbers are 0 followed by 5, 6, 7 or 8 and eight more digits
export function isValidMoroccanPhone(phone: string): boolean {
  return /^0[5-8]\d{8}$/.test(toLocalPhone(phone));
}
