"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n-utils';

/**
 * Higher-Order Component to provide internationalization capabilities to components
 * @param Component - The component to wrap
 */
export function withTranslation<P extends object>(
  Component: React.ComponentType<P & { t: (key: string) => string; isRTL: boolean }>
): React.FC<P> {
  return (props: P) => {
    const { t, language } = useTranslation();
    const isRTL = language === 'ar';
    
    return <Component {...props} t={t} isRTL={isRTL} />;
  };
}
