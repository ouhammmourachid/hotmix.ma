// Flat delivery fees in DH: Casablanca itself, and every other city.
// cities.json still carries the carrier's per-city rates, but customers are charged these.
export const CASABLANCA_SHIPPING_PRICE = 20;
export const OTHER_CITIES_SHIPPING_PRICE = 30;
// Shown before a city is picked; checkout requires a city, so it is never what gets charged
export const DEFAULT_SHIPPING_PRICE = 20;

export function getShippingPrice(cityName: string): number {
  const city = cityName.trim().toLowerCase();
  if (!city) return DEFAULT_SHIPPING_PRICE;
  return city === 'casablanca' ? CASABLANCA_SHIPPING_PRICE : OTHER_CITIES_SHIPPING_PRICE;
}
