"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n-utils';
import { Shield, Lock, FileText, Eye, Check } from 'lucide-react';
import styles from '@/styles/main.module.css';

export default function PrivacyPolicyClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-greny text-sm font-semibold tracking-widest uppercase">
          {t('footer_privacy')}
        </span>
        <h1 className={styles.main_pages_title + " text-3xl sm:text-5xl font-bold"}>
          {t('privacy_title')}
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg">
          {t('privacy_subtitle')}
        </p>
        <div className="text-xs text-greny/80 font-mono pt-1">
          Last updated: January 2026
        </div>
      </div>

      {/* Intro Box */}
      <div className="bg-secondary/80 border border-secondary rounded-2xl p-6 sm:p-8 flex items-start gap-4">
        <Shield className="w-8 h-8 text-greny shrink-0 mt-1" />
        <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
          At HOTMIX, we are committed to respecting your privacy and protecting your personal data.
          This privacy notice outlines how we gather, store, and utilize your information when visiting or purchasing from our website.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8">
        
        {/* Section 1 */}
        <div className="bg-secondary/50 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-greny">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t('privacy_sec1_title')}
            </h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {t('privacy_sec1_desc')}
          </p>
          <ul className="space-y-2 text-sm text-gray-300 pt-2">
            {[
              'Contact details (Name, Shipping Address, Phone Number, Email)',
              'Order history and transaction preferences',
              'Device data (Browser type, IP address, browsing cookies)'
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-greny shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-secondary/50 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-greny">
            <Eye className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t('privacy_sec2_title')}
            </h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {t('privacy_sec2_desc')}
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-secondary/50 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-greny">
            <Lock className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t('privacy_sec3_title')}
            </h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {t('privacy_sec3_desc')}
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-secondary/50 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-greny">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t('privacy_sec4_title')}
            </h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {t('privacy_sec4_desc')}
          </p>
        </div>

      </div>
    </div>
  );
}
