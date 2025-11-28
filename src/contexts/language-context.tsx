"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslation } from '@/translations';
import { languageConfig } from '@/config/language-config';

// Define available languages
export type Language = 'en' | 'ar' | 'fr';

// Create interface for the context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Record<string, string>) => string; // translation function with variables support
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define props for the provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Helper function to detect initial language
const getInitialLanguage = (): Language => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return languageConfig.defaultLanguage;
  }

  const storedLanguage = localStorage.getItem('language');
  // If user has already selected a language, use that
  if (storedLanguage && ['en', 'fr', 'ar'].includes(storedLanguage)) {
    return storedLanguage as Language;
  }

  // Try to detect browser language
  try {
    const browserLanguages = navigator.languages || [navigator.language];

    // Extract primary language codes (e.g., 'en-US' becomes 'en')
    const primaryLanguageCodes = browserLanguages.map(lang => lang.split('-')[0]);

    // Get supported language codes
    const supportedLanguageCodes = languageConfig.languages.map(lang => lang.code);

    // Find the first browser language that is supported
    for (const code of primaryLanguageCodes) {
      if (supportedLanguageCodes.includes(code as Language)) {
        return code as Language;
      }
    }
  } catch (error) {
    console.error('Error detecting browser language:', error);
  }

  // Default to Arabic if no match found
  return languageConfig.defaultLanguage;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language synchronously to prevent flash
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted after first render to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update document settings when language changes
  useEffect(() => {
    if (!language) return;

    // Save to localStorage
    localStorage.setItem('language', language);

    // Update document direction for RTL support (Arabic)
    const languageData = languageConfig.getLanguageByCode(language);
    document.documentElement.dir = languageData.dir;
    document.documentElement.lang = language;

    // You could add additional language-specific settings here
  }, [language]);

  // Translation function
  const t = (key: string, vars?: Record<string, string>): string => {
    return getTranslation(language, key, vars);
  };

  // Change language function
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  // Don't render children until mounted to prevent flash
  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
