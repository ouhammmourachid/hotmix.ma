"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n-utils';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, ArrowRight, Compass, Award } from 'lucide-react';
import styles from '@/styles/main.module.css';

export default function AboutUsClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 max-w-6xl mx-auto space-y-16">
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-greny text-sm font-semibold tracking-widest uppercase">
          {t('footer_about_title')}
        </span>
        <h1 className={styles.main_pages_title + " text-3xl sm:text-5xl font-bold"}>
          {t('about_title')}
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {t('about_subtitle')}
        </p>
      </div>

      {/* Brand Intro Card */}
      <div className="bg-secondary/80 border border-secondary rounded-2xl p-6 sm:p-10 backdrop-blur-sm shadow-xl space-y-6">
        <div className="flex items-center gap-3 text-greny">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">{t('about_story_title')}</h2>
        </div>
        <p className="text-gray-200 leading-relaxed text-base sm:text-lg">
          {t('footer_about_description')}
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 sm:p-8 hover:border-greny/50 transition-all duration-300 group space-y-4">
          <div className="w-12 h-12 rounded-xl bg-greny/10 text-greny flex items-center justify-center group-hover:bg-greny group-hover:text-primary transition-colors">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-semibold text-white">
            {t('about_mission_title')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {t('about_mission_desc')}
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 sm:p-8 hover:border-greny/50 transition-all duration-300 group space-y-4">
          <div className="w-12 h-12 rounded-xl bg-greny/10 text-greny flex items-center justify-center group-hover:bg-greny group-hover:text-primary transition-colors">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-semibold text-white">
            {t('about_vision_title')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {t('about_vision_desc')}
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">{t('about_why_choose_title')}</h2>
          <div className="w-16 h-1 bg-greny mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary/40 border border-gray-800 p-6 rounded-xl space-y-3 hover:border-greny/30 transition-colors">
            <ShieldCheck className="w-8 h-8 text-greny" />
            <h4 className="text-xl font-semibold text-white">{t('about_val_quality')}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{t('about_val_quality_desc')}</p>
          </div>

          <div className="bg-secondary/40 border border-gray-800 p-6 rounded-xl space-y-3 hover:border-greny/30 transition-colors">
            <Sparkles className="w-8 h-8 text-greny" />
            <h4 className="text-xl font-semibold text-white">{t('about_val_style')}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{t('about_val_style_desc')}</p>
          </div>

          <div className="bg-secondary/40 border border-gray-800 p-6 rounded-xl space-y-3 hover:border-greny/30 transition-colors">
            <Heart className="w-8 h-8 text-greny" />
            <h4 className="text-xl font-semibold text-white">{t('about_val_service')}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{t('about_val_service_desc')}</p>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="bg-gradient-to-r from-secondary to-primary border border-secondary/80 rounded-2xl p-8 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-white">
          {t('about_cta_title')}
        </h3>
        <p className="text-gray-300 max-w-xl mx-auto">
          {t('about_cta_desc')}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-greny text-primary font-semibold px-8 py-3.5 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-greny/20"
        >
          {t('footer_discover_products')}
          <ArrowRight className="w-5 h-5 rtl-flip" />
        </Link>
      </div>
    </div>
  );
}
