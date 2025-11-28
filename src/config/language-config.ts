import { Language } from "@/contexts/language-context";

/**
 * Language configuration for the application
 */
export const languageConfig = {
  // Default language
  defaultLanguage: 'ar' as Language,
  
  // Available languages
  languages: [
    {
      code: 'en',
      name: 'English',
      flag: 'https://flagcdn.com/w20/gb.png',
      dir: 'ltr',
      locale: 'en-US'
    },
    {
      code: 'fr',
      name: 'Français',
      flag: 'https://flagcdn.com/w20/fr.png',
      dir: 'ltr',
      locale: 'fr-FR'
    },
    {
      code: 'ar',
      name: 'العربية',
      flag: 'https://flagcdn.com/w20/ma.png',
      dir: 'rtl',
      locale: 'ar-MA'
    }
  ],
  
  /**
   * Get language data by code
   * @param code - The language code
   * @returns The language data object
   */
  getLanguageByCode(code: Language) {
    return this.languages.find(lang => lang.code === code) || this.languages[0];
  },
  
  /**
   * Check if a language is RTL
   * @param code - The language code
   * @returns True if the language is RTL
   */
  isRTL(code: Language) {
    return this.getLanguageByCode(code).dir === 'rtl';
  }
};
