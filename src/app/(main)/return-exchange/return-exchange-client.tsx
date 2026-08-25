"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n-utils';
import { RotateCcw, Calendar, CheckCircle2, MessageSquare, ArrowRight, PackageCheck } from 'lucide-react';
import Link from 'next/link';
import styles from '@/styles/main.module.css';

export default function ReturnExchangeClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-greny text-sm font-semibold tracking-widest uppercase">
          {t('footer_returns')}
        </span>
        <h1 className={styles.main_pages_title + " text-3xl sm:text-5xl font-bold"}>
          {t('returns_title')}
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
          {t('returns_subtitle')}
        </p>
      </div>

      {/* 7-Day Window Feature Card */}
      <div className="bg-secondary/80 border border-secondary rounded-2xl p-8 sm:p-10 shadow-xl space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-greny/10 text-greny flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {t('returns_window_title')}
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg">
          {t('returns_window_desc')}
        </p>
      </div>

      {/* Item Conditions Card */}
      <div className="bg-secondary/60 border border-gray-800 rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3 text-greny">
          <PackageCheck className="w-6 h-6" />
          <h3 className="text-2xl font-bold text-white">{t('returns_cond_title')}</h3>
        </div>
        <p className="text-gray-300">{t('returns_cond_desc')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {[
            t('returns_cond_unworn'),
            t('returns_cond_tags'),
            t('returns_cond_packaging'),
            t('returns_cond_receipt')
          ].map((cond, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-primary/60 border border-gray-800 p-4 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-greny shrink-0" />
              <span className="text-sm font-medium text-white">{cond}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Exchange Flow */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">{t('returns_steps_title')}</h2>
          <p className="text-gray-400 text-sm">{t('returns_steps_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-secondary/40 border border-gray-800 p-6 rounded-2xl space-y-3 relative hover:border-greny/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-greny text-primary font-extrabold flex items-center justify-center text-lg">
              1
            </div>
            <h4 className="text-lg font-bold text-white">{t('returns_step1_title')}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{t('returns_step1')}</p>
          </div>

          {/* Step 2 */}
          <div className="bg-secondary/40 border border-gray-800 p-6 rounded-2xl space-y-3 relative hover:border-greny/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-greny text-primary font-extrabold flex items-center justify-center text-lg">
              2
            </div>
            <h4 className="text-lg font-bold text-white">{t('returns_step2_title')}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{t('returns_step2')}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-secondary/40 border border-gray-800 p-6 rounded-2xl space-y-3 relative hover:border-greny/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-greny text-primary font-extrabold flex items-center justify-center text-lg">
              3
            </div>
            <h4 className="text-lg font-bold text-white">{t('returns_step3_title')}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{t('returns_step3')}</p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-secondary to-primary border border-secondary/80 rounded-2xl p-8 text-center space-y-4">
        <RotateCcw className="w-10 h-10 text-greny mx-auto" />
        <h3 className="text-2xl font-bold text-white">{t('returns_ready_title')}</h3>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          {t('returns_ready_desc')}
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/212687763532"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full transition-all text-sm shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            {t('returns_contact_whatsapp')}
          </a>
        </div>
      </div>
    </div>
  );
}
