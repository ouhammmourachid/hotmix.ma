// Utility helpers for Meta (Facebook) Pixel events
// Usage: import { trackPurchase, trackEvent } from '@/lib/pixel';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Fire any standard or custom Pixel event */
export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') {
    console.warn('[Pixel] window is undefined (SSR context)');
    return;
  }

  const fbq = (window as any).fbq;

  if (typeof fbq !== 'function') {
    console.warn('[Pixel] fbq is not loaded yet:', typeof fbq);
    return;
  }

  console.log('[Pixel] Firing event:', event, params);
  fbq('track', event, params ?? {});
}

/** Fire the standard "Purchase" event.
 *  @param value      - total order value (number)
 *  @param currency   - ISO 4217 currency code, default "MAD"
 *  @param contentIds - array of product IDs in the order
 */
export function trackPurchase(
  value: number,
  currency = 'MAD',
  contentIds: string[] = []
) {
  trackEvent('Purchase', {
    value,
    currency,
    content_ids: contentIds,
    content_type: 'product',
  });
}
