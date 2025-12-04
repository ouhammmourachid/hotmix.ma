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

export function convertToPocketBaseFilter(filterStr: string): string {
  if (!filterStr) return '';
  const params = new URLSearchParams(filterStr);
  const filters: string[] = [];

  if (params.has('sizes')) {
    const sizes = params.get('sizes')?.split(',') || [];
    if (sizes.length > 0) {
      const sizeFilters = sizes.map(s => `sizes ~ '${s}'`).join(' || ');
      filters.push(`(${sizeFilters})`);
    }
  }
  if (params.has('colors')) {
    const colors = params.get('colors')?.split(',') || [];
    if (colors.length > 0) {
      const colorFilters = colors.map(c => `colors ~ '${c}'`).join(' || ');
      filters.push(`(${colorFilters})`);
    }
  }
  if (params.has('tags')) {
    const tags = params.get('tags')?.split(',') || [];
    if (tags.length > 0) {
      const tagFilters = tags.map(t => `tags ~ '${t}'`).join(' || ');
      filters.push(`(${tagFilters})`);
    }
  }
  if (params.has('category')) {
    const category = params.get('category');
    if (category) {
      filters.push(`category = '${category}'`);
    }
  }
  if (params.has('q')) {
    const q = params.get('q');
    if (q) {
      filters.push(`name ~ '${q}'`);
    }
  }

  if (params.has('sale') && params.get('sale') === 'true') {
    filters.push(`discount > 0`);
  }

  return filters.join(' && ');
}
