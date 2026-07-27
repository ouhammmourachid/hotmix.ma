"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n-utils';
import { Truck, Clock, ShieldCheck, MapPin, CreditCard, Eye } from 'lucide-react';
import Link from 'next/link';
import styles from '@/styles/main.module.css';

export default function ShippingDeliveryPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-greny text-sm font-semibold tracking-widest uppercase">
          {t('footer_shipping')}
        </span>
        <h1 className={styles.main_pages_title + " text-3xl sm:text-5xl font-bold"}>
          {t('shipping_title')}
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
          {t('shipping_subtitle')}
        </p>
      </div>

      {/* Main Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Local Delivery Card */}
        <div className="bg-secondary/80 border border-secondary hover:border-greny/50 rounded-2xl p-8 transition-all space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-greny/10 text-greny flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">{t('shipping_casablanca')}</h3>
          <p className="text-xl font-semibold text-greny">{t('shipping_timeline_local')}</p>
          <p className="text-gray-300 leading-relaxed text-sm">
            {t('shipping_casablanca_desc')}
          </p>
        </div>

        {/* National Delivery Card */}
        <div className="bg-secondary/80 border border-secondary hover:border-greny/50 rounded-2xl p-8 transition-all space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-greny/10 text-greny flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">{t('shipping_nationwide')}</h3>
          <p className="text-xl font-semibold text-greny">{t('shipping_timeline_national')}</p>
          <p className="text-gray-300 leading-relaxed text-sm">
            {t('shipping_nationwide_desc')}
          </p>
        </div>
      </div>

      {/* Nationwide Cities Banner */}
      <div className="bg-secondary/50 border border-gray-800 rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3 text-greny">
          <MapPin className="w-6 h-6" />
          <h3 className="text-2xl font-bold text-white">{t('shipping_fast_title')}</h3>
        </div>
        <p className="text-gray-300 leading-relaxed text-base">
          {t('shipping_fast_desc')}
        </p>

        {/* Cities Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            'Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Agadir',
            'Fès', 'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'El Jadida',
            'Safi', 'Mohammedia', 'Nador', 'Laâyoune'
          ].map((city) => (
            <span
              key={city}
              className="bg-primary/80 border border-gray-700/80 px-4 py-1.5 rounded-full text-xs font-medium text-gray-200"
            >
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment on Delivery */}
        <div className="bg-secondary/40 border border-gray-800 p-6 rounded-2xl space-y-3">
          <CreditCard className="w-8 h-8 text-greny" />
          <h4 className="text-xl font-bold text-white">{t('shipping_payment_title')}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{t('shipping_payment_desc')}</p>
        </div>

        {/* Package Inspection */}
        <div className="bg-secondary/40 border border-gray-800 p-6 rounded-2xl space-y-3">
          <Eye className="w-8 h-8 text-greny" />
          <h4 className="text-xl font-bold text-white">{t('shipping_inspection_title')}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{t('shipping_inspection_desc')}</p>
        </div>
      </div>

      {/* Help / WhatsApp CTA */}
      <div className="bg-gradient-to-r from-secondary to-primary border border-secondary/80 rounded-2xl p-8 text-center space-y-4">
        <ShieldCheck className="w-10 h-10 text-greny mx-auto" />
        <h3 className="text-2xl font-bold text-white">{t('shipping_help_title')}</h3>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          {t('shipping_help_desc')}
        </p>
        <div className="pt-2">
          <Link
            href="/contact-us"
            className="inline-block bg-greny text-primary font-bold px-8 py-3 rounded-full hover:bg-white transition-all text-sm"
          >
            {t('shipping_contact_support')}
          </Link>
        </div>
      </div>
    </div>
  );
}
