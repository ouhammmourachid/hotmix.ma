// Flat delivery fees in DH: Casablanca itself, and every other city.
// cities.json still carries the carrier's per-city rates, but customers are charged these.
export const CASABLANCA_SHIPPING_PRICE = 20;
export const DEFAULT_SHIPPING_PRICE = 30;

export function getShippingPrice(cityName: string): number {
  return cityName.trim().toLowerCase() === 'casablanca'
    ? CASABLANCA_SHIPPING_PRICE
    : DEFAULT_SHIPPING_PRICE;
}
