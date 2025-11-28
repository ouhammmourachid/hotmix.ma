import enTranslations from '@/translations/en.json';
import arTranslations from '@/translations/ar.json';
import frTranslations from '@/translations/fr.json';
import { Language } from '@/contexts/language-context';

// Create a type for our translations
export type TranslationKey = keyof typeof enTranslations;

// Create an object with all translations
export const translations = {
  en: enTranslations,
  ar: arTranslations,
  fr: frTranslations
};

/**
 * Helper function to get translations based on language
 * @param lang - The language code
 * @param key - The translation key
 * @param vars - Variables to replace in the translation string
 * @returns The translated string or the key if not found
 */
export const getTranslation = (lang: Language, key: string, vars?: Record<string, string>): string => {
  try {
    const translationSet = translations[lang] as Record<string, string>;
    let translation = translationSet[key] || key;
    
    // Replace variables if they exist
    if (vars) {
      Object.entries(vars).forEach(([key, value]) => {
        translation = translation.replace(`%(${key})s`, value);
      });
    }
    
    return translation;
  } catch (error) {
    console.error(`Translation error for ${lang}.${key}:`, error);
    return key;
  }
};
