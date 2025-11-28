"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '@/contexts/language-context';
import { ChevronDown, Check } from 'lucide-react';
import { languageConfig } from '@/config/language-config';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Language options with their display names and flags
  const languages: {
    code: Language;
    name: string;
    flag: string;
  }[] = [
    {
      code: 'en',
      name: 'English',
      flag: 'https://flagcdn.com/w20/gb.png',
    },
    {
      code: 'fr',
      name: 'Français',
      flag: 'https://flagcdn.com/w20/fr.png',
    },
    {
      code: 'ar',
      name: 'العربية',
      flag: 'https://flagcdn.com/w20/ma.png',
    },
  ];

  // Get current language data
  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  const closeDropdown = () => setIsOpen(false);

  // Handle language change
  const handleLanguageChange = (languageCode: Language) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>      {/* Current language display - dropdown trigger */}      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-1 py-1 px-2 hover:text-greny rounded-md"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-5 h-auto" />
        <span className="text-xs font-medium inline">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown 
              size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} min-w-[14px] block`} />
      </button>
        {/* Dropdown content */}
      {isOpen && (
        <div className={`absolute top-full ${
          language === 'ar' ? '-right-16' : 'right-0'} mt-1 bg-primary shadow-lg rounded-sm overflow-hidden z-50 min-w-32 py-1`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:text-greny ${
                language === lang.code ? 'text-greny font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <img src={lang.flag} alt={lang.name} className="w-5 h-auto" />
                <span>{lang.name}</span>
              </div>
              {language === lang.code && <Check size={14} className="text-greny" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
