import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatNumberByLocale } from "./i18n-utils"
import { Language } from "@/contexts/language-context"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price by removing trailing zeros after the decimal point
 * If the price is a whole number, removes the decimal part entirely
 * @param price - The price to format
 * @param currency - Optional currency symbol to append (default: empty string)
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | string,
  currency: string = '',
  language: Language = 'en'
): string {
  if (price === null || price === undefined) return `0 ${currency}`.trim();

  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Format based on language
  const formattedPrice = formatNumberByLocale(numPrice, language);
  // RTL languages like Arabic might need the currency symbol on the right
  return language === 'ar'
    ? `${formattedPrice} ${currency}`.trim()
    : `${formattedPrice} ${currency}`.trim();
}

// PocketBase filter values are quoted here with double quotes so a raw `'`
// in user input (e.g. searching "women's dress") doesn't terminate the
// literal early — PocketBase's filter grammar rejects the SQL-style `''`
// escape (it 400s), but backslash-escaping `"` and `\` inside a
// double-quoted literal is valid.
function escapePbFilterValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function convertToPocketBaseFilter(filterStr: string): string {
  if (!filterStr) return '';
  const params = new URLSearchParams(filterStr);
  const filters: string[] = [];

  if (params.has('sizes')) {
    const sizes = params.get('sizes')?.split(',') || [];
    if (sizes.length > 0) {
      const sizeFilters = sizes.map(s => `sizes ~ "${escapePbFilterValue(s)}"`).join(' || ');
      filters.push(`(${sizeFilters})`);
    }
  }
  if (params.has('colors')) {
    const colors = params.get('colors')?.split(',') || [];
    if (colors.length > 0) {
      const colorFilters = colors.map(c => `colors ~ "${escapePbFilterValue(c)}"`).join(' || ');
      filters.push(`(${colorFilters})`);
    }
  }
  if (params.has('tags')) {
    const tags = params.get('tags')?.split(',') || [];
    if (tags.length > 0) {
      const tagFilters = tags.map(t => `tags ~ "${escapePbFilterValue(t)}"`).join(' || ');
      filters.push(`(${tagFilters})`);
    }
  }
  if (params.has('category')) {
    const category = params.get('category');
    if (category) {
      filters.push(`category = "${escapePbFilterValue(category)}"`);
    }
  }
  if (params.has('q')) {
    const q = params.get('q');
    if (q) {
      filters.push(`name ~ "${escapePbFilterValue(q)}"`);
    }
  }

  if (params.has('sale') && params.get('sale') === 'true') {
    filters.push(`discount > 0`);
  }

  return filters.join(' && ');
}

/**
 * Creates a clean, URL-safe slug from a category name or object.
 */
export function createCategorySlug(category: { id?: string; name: string } | string): string {
  const name = typeof category === 'string' ? category : category?.name;
  if (!name) return '';

  return name
    .toLowerCase()
    .trim()
    .replace(/[/\\&]/g, ' ')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Matches a category from a list by slug, ID, or name.
 */
export function findCategoryBySlug<T extends { id: string; name: string }>(
  categories: T[],
  slugOrId: string | undefined | null
): T | undefined {
  if (!slugOrId || !categories || categories.length === 0) return undefined;

  const rawSlug = String(slugOrId).trim();
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug).trim();
  } catch (e) {
    // ignore decode error
  }

  const targetNormalizedSlug = createCategorySlug(decodedSlug);
  const decodedLower = decodedSlug.toLowerCase();
  const rawLower = rawSlug.toLowerCase();

  return categories.find((cat) => {
    if (!cat) return false;

    // 1. Direct ID match
    if (cat.id === rawSlug || cat.id === decodedSlug) return true;

    // 2. Slugified name match
    const catSlug = createCategorySlug(cat.name);
    if (catSlug && catSlug === targetNormalizedSlug) return true;

    // 3. Name lowercase match
    const catNameLower = cat.name.toLowerCase().trim();
    if (catNameLower === decodedLower || catNameLower === rawLower) return true;

    // 4. Space-to-hyphen or hyphen-to-space match
    if (catNameLower.replace(/\s+/g, '-') === decodedLower.replace(/\s+/g, '-')) return true;
    if (catNameLower.replace(/-/g, ' ') === decodedLower.replace(/-/g, ' ')) return true;

    return false;
  });
}

/**
 * Determines whether a color (by hex code or name) is white or light
 * so contrast elements (like checkmarks) can be styled appropriately in black.
 */
export function isLightColor(color?: { code?: string; name?: string } | string): boolean {
  if (!color) return false;
  const hexOrName = typeof color === 'string' ? color : color.code || color.name || '';
  const lower = hexOrName.toLowerCase().trim();

  // Check common light color names
  if (['white', 'blanc', 'off-white', 'cream', 'ivory', 'beige', 'snow', 'light'].some(n => lower.includes(n))) {
    return true;
  }

  // Parse Hex code
  let hex = lower.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      // Relative brightness formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 185;
    }
  }

  return false;
}

