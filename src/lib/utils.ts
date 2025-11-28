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
