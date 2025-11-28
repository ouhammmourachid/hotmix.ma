"use client";

import { useLanguage, Language } from "@/contexts/language-context";
import { TranslationKey } from "@/translations";

// Custom hook that wraps the useLanguage hook to provide
// type safety and intellisense for translation keys
export const useTranslation = () => {
  const { t, language, setLanguage } = useLanguage();
  
  // Typed translation function  
  const translate = (key: TranslationKey | string, vars?: Record<string, string>) => {
    return t(key, vars);
  };
  
  return {
    t: translate,
    language,
    setLanguage,
    formatNumber: (num: number) => formatNumberByLocale(num, language),
  };
};

// Helper function to handle RTL text direction
export const getTextDirection = (lang: string) => {
  return lang === 'ar' ? 'rtl' : 'ltr';
};

// Helper function to get appropriate font class based on language
export const getLanguageFontClass = (lang: string) => {
  return lang === 'ar' ? 'font-arabic' : 'font-geist-sans';
};

/**
 * Format a number according to the locale of the current language
 * @param num - The number to format
 * @param lang - The current language
 * @returns The formatted number string
 */
export const formatNumberByLocale = (num: number, lang: Language): string => {
  const locales = {
    'en': 'en-US',
    'fr': 'fr-FR',
    'ar': 'ar-MA'
  };
  
  return new Intl.NumberFormat(locales[lang]).format(num);
};
