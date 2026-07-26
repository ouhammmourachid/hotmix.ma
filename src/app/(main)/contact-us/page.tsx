"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n-utils';
import { Mail, Clock, MapPin, MessageSquare, ArrowUpRight, Facebook, Instagram, Youtube } from 'lucide-react';
import Tiktok from '@/components/icon/tiktok';
import styles from '@/styles/main.module.css';

export default function ContactUsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-greny text-sm font-semibold tracking-widest uppercase">
          {t('contact_get_in_touch')}
        </span>
        <h1 className={styles.main_pages_title + " text-3xl sm:text-5xl font-bold"}>
          {t('contact_title')}
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg">
          {t('contact_subtitle')}
        </p>
      </div>

      {/* Primary WhatsApp Featured Banner */}
      <div className="bg-gradient-to-r from-secondary to-primary border border-secondary hover:border-greny/50 rounded-2xl p-8 text-center space-y-6 shadow-xl transition-all">
        <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('contact_whatsapp')}</h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
            Get instant customer assistance, size guidance, order tracking, and exchange support directly on WhatsApp.
          </p>
        </div>
        <div>
          <a
            href="https://wa.me/+212687763532"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg text-base"
          >
            <MessageSquare className="w-5 h-5" />
            Chat on WhatsApp
            <ArrowUpRight className="w-4 h-4 rtl-flip" />
          </a>
        </div>
      </div>

      {/* Info Cards Grid (3 columns on desktop, responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Email Card */}
        <div className="bg-secondary/70 border border-gray-800 p-6 rounded-2xl space-y-4 text-center hover:border-greny/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-greny/10 text-greny flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('contact_email')}</h4>
            <a
              href="mailto:contact@hotmix.ma"
              className="text-white font-semibold text-base hover:text-greny transition-colors block mt-1"
            >
              contact@hotmix.ma
            </a>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="bg-secondary/70 border border-gray-800 p-6 rounded-2xl space-y-4 text-center hover:border-greny/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-greny/10 text-greny flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('contact_hours')}</h4>
            <p className="text-white font-semibold text-sm mt-1">{t('contact_hours_val')}</p>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-secondary/70 border border-gray-800 p-6 rounded-2xl space-y-4 text-center hover:border-greny/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-greny/10 text-greny flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Location</h4>
            <p className="text-white font-semibold text-base mt-1">Casablanca, Morocco</p>
          </div>
        </div>

      </div>

      {/* Social Links Banner */}
      <div className="bg-secondary/40 border border-gray-800 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Follow Us On Social Media</h3>
        <p className="text-gray-400 text-sm">Stay updated with our latest collections, sales, and fashion trends.</p>
        <div className="flex justify-center gap-4 pt-2">
          <a
            href="#"
            className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-white hover:text-blue-500 hover:border-blue-500 transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/hotmix.ma/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-white hover:text-pink-500 hover:border-pink-500 transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.youtube.com/@Hotmix-ma"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-white hover:text-red-500 hover:border-red-500 transition-colors"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href="https://www.tiktok.com/@hotmix.ma"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-white hover:text-red-500 hover:border-red-500 transition-colors"
          >
            <Tiktok className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
