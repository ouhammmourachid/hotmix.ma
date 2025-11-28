"use client";

import React from 'react';
import { useLanguage } from '@/contexts/language-context';

interface RTLWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A component that provides proper RTL support based on the current language
 */
const RTLWrapper: React.FC<RTLWrapperProps> = ({ children, className = '' }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <div 
      className={`${className} ${isRTL ? 'rtl text-right' : 'ltr text-left'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </div>
  );
};

export default RTLWrapper;
