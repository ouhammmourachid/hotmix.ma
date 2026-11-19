// Remembers the order just placed for 5 minutes, so a follow-up order from the same shopper is
// added to it (one delivery) instead of becoming a separate order. The server re-checks the
// 5-minute window and the phone number itself, so this cookie is only a hint.
const COOKIE_NAME = 'hotmix_open_order';
const MAX_AGE_SECONDS = 5 * 60;

export function readOpenOrderId(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function rememberOpenOrder(orderId: string) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(orderId)}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}
